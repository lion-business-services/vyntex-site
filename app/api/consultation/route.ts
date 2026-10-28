import { NextResponse } from "next/server";
import { consultationSchema, type ConsultationInput } from "@/lib/validation/consultation";
import {
  demoRequestSchema,
  isDemoRequestBody,
  DEMO_SERVICE_TOKEN,
  type DemoRequestInput,
} from "@/lib/validation/demo-request";
import { erpTrialLink } from "@/lib/site";
import { getSupabaseAdmin } from "@/lib/supabase/admin";
import { limiters } from "@/lib/rate-limit";
import { getClientIp, hashIp, checkSpam } from "@/lib/request";
import { internalInbox } from "@/lib/resend";
import { queueAndSend, type EmailKind } from "@/lib/email/outbox";
import { notifyFormSubmit, type FormSubmitNotification } from "@/lib/formsubmit";
import {
  internalConsultationEmail,
  clientConsultationConfirmation,
  internalDemoRequestEmail,
  clientDemoRequestConfirmation,
  demoRequestSubject,
  demoTeamSizeLabel,
  demoTimeLabel,
  demoDateLabel,
  preferredContactLabel,
  type ConsultationEmailData,
  type DemoRequestEmailData,
  type EmailContent,
} from "@/lib/email/templates";

/**
 * Free consultation AND "Book a Free Demo" (Business Software) requests.
 *
 * A body with requestType "demo" is a demo request; anything else is a
 * consultation request, exactly as before. Both go through the same steps:
 *
 *   1. Rate limit, spam check and zod validation.
 *   2. In parallel: FormSubmit email to the team (FORMSUBMIT_EMAIL) and the
 *      Supabase insert into consultation_requests.
 *   3. Resend outbox: internal notification + confirmation to the visitor.
 *
 * The visitor sees success as soon as ANY of the three team channels holds
 * the request (database row, FormSubmit email, Resend internal email). A
 * failing channel is logged (without personal data) and reported as partial.
 */

export const runtime = "nodejs";
/** FormSubmit (with one retry) + Supabase + Resend comfortably fit in this. */
export const maxDuration = 30;

type Result = { ok: true; partial?: boolean } | { ok: false; code: string };

function json(body: Result, status = 200) {
  return NextResponse.json(body, { status });
}

interface Prepared {
  log: string;
  formSubmit: FormSubmitNotification;
  row: Record<string, unknown>;
  internal: EmailContent;
  confirmation: EmailContent;
  kinds: { internal: EmailKind; client: EmailKind };
  email: string;
}

function prepareConsultation(data: ConsultationInput): Prepared {
  const emailData: ConsultationEmailData = {
    fullName: data.fullName,
    businessName: data.businessName,
    email: data.email,
    phone: data.phone,
    services: data.services,
    budget: data.budget,
    timeline: data.timeline,
    preferredContact: data.preferredContact,
    referralSource: data.referralSource,
    message: data.message,
    language: data.language,
  };
  return {
    log: "consultation",
    email: data.email,
    formSubmit: {
      formName: "Consultation Request",
      subject: `New VYNTEX consultation request from ${data.fullName}`,
      replyTo: data.email,
      fields: {
        Name: data.fullName,
        Business: data.businessName,
        Email: data.email,
        Phone: data.phone,
        Services: data.services,
        Budget: data.budget,
        Timeline: data.timeline,
        "Preferred Contact": data.preferredContact,
        "Referral Source": data.referralSource,
        Language: data.language,
        Message: data.message,
      },
    },
    row: {
      full_name: data.fullName,
      business_name: data.businessName || null,
      email: data.email,
      phone: data.phone || null,
      services: data.services,
      budget: data.budget,
      timeline: data.timeline,
      preferred_contact: data.preferredContact,
      referral_source: data.referralSource || null,
      message: data.message,
      language: data.language,
    },
    internal: internalConsultationEmail(emailData),
    confirmation: clientConsultationConfirmation(emailData),
    kinds: { internal: "consultation_internal", client: "consultation_client" },
  };
}

/**
 * Demo requests are stored in the existing consultation_requests table (no
 * migration needed): services = ["business_software_demo"], budget and
 * timeline empty, and the demo details written into the message column.
 */
function prepareDemo(data: DemoRequestInput): Prepared {
  const emailData: DemoRequestEmailData = {
    fullName: data.fullName,
    businessName: data.businessName,
    email: data.email,
    phone: data.phone,
    industry: data.industry,
    teamSize: data.teamSize,
    preferredDate: data.preferredDate,
    preferredTime: data.preferredTime,
    preferredContact: data.preferredContact,
    message: data.message,
    language: data.language,
  };
  const storedMessage = [
    "[VYNTEX ERP demo request]",
    `Industry: ${data.industry}`,
    `Team size: ${demoTeamSizeLabel(data.teamSize)}`,
    `Preferred date: ${demoDateLabel(data.preferredDate)}`,
    `Preferred time: ${demoTimeLabel(data.preferredTime)}`,
    "",
    data.message || "No notes.",
  ].join("\n");

  return {
    log: "demo-request",
    email: data.email,
    formSubmit: {
      formName: "VYNTEX ERP Demo Request",
      subject: demoRequestSubject(data),
      replyTo: data.email,
      fields: {
        "Request Type": "Book a Free Demo (VYNTEX ERP)",
        Name: data.fullName,
        Business: data.businessName,
        Email: data.email,
        Phone: data.phone,
        Industry: data.industry,
        "Team Size": demoTeamSizeLabel(data.teamSize),
        "Preferred Date": demoDateLabel(data.preferredDate),
        "Preferred Time": demoTimeLabel(data.preferredTime),
        "Preferred Contact": preferredContactLabel(data.preferredContact),
        Language: data.language === "es" ? "Spanish" : "English",
        Notes: data.message,
        "Start a 7-day trial": erpTrialLink(emailData),
      },
    },
    row: {
      full_name: data.fullName,
      business_name: data.businessName,
      email: data.email,
      phone: data.phone || null,
      services: [DEMO_SERVICE_TOKEN],
      budget: null,
      timeline: null,
      preferred_contact: data.preferredContact,
      referral_source: null,
      message: storedMessage,
      language: data.language,
    },
    internal: internalDemoRequestEmail(emailData),
    confirmation: clientDemoRequestConfirmation(emailData),
    kinds: { internal: "demo_request_internal", client: "demo_request_client" },
  };
}

async function saveRow(log: string, row: Record<string, unknown>): Promise<boolean> {
  const admin = getSupabaseAdmin();
  if (!admin) {
    console.error(`[${log}] Supabase admin not configured; relying on FormSubmit and Resend.`);
    return false;
  }
  try {
    const { error } = await admin.from("consultation_requests").insert(row);
    if (error) {
      console.error(`[${log}] insert failed:`, error.message);
      return false;
    }
    return true;
  } catch (error) {
    console.error(`[${log}] insert threw:`, error instanceof Error ? error.message : "unknown error");
    return false;
  }
}

export async function POST(request: Request) {
  const ip = getClientIp(request.headers);

  const rl = await limiters.consultation().limit(`ip:${ip}`);
  if (!rl.success) return json({ ok: false, code: "rate_limited" }, 429);

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return json({ ok: false, code: "validation" }, 400);
  }
  if (!body || typeof body !== "object") return json({ ok: false, code: "validation" }, 400);

  const raw = body as Record<string, unknown>;
  const spam = checkSpam({
    honeypot: raw.honeypot,
    startedAt: raw.startedAt,
    message: typeof raw.message === "string" ? raw.message : "",
  });
  if (spam.spam) return json({ ok: false, code: "spam" }, 400);

  let prepared: Prepared;
  if (isDemoRequestBody(body)) {
    const parsed = demoRequestSchema.safeParse(body);
    if (!parsed.success) return json({ ok: false, code: "validation" }, 400);
    prepared = prepareDemo(parsed.data);
  } else {
    const parsed = consultationSchema.safeParse(body);
    if (!parsed.success) return json({ ok: false, code: "validation" }, 400);
    prepared = prepareConsultation(parsed.data);
  }

  const [formSubmitRes, databaseSaved] = await Promise.all([
    notifyFormSubmit(prepared.formSubmit),
    saveRow(prepared.log, { ...prepared.row, ip_hash: hashIp(ip), status: "new" }),
  ]);

  const [internalRes, confirmRes] = await Promise.all([
    queueAndSend({
      kind: prepared.kinds.internal,
      to: internalInbox(),
      subject: prepared.internal.subject,
      html: prepared.internal.html,
      text: prepared.internal.text,
      replyTo: prepared.email,
    }),
    queueAndSend({
      kind: prepared.kinds.client,
      to: prepared.email,
      subject: prepared.confirmation.subject,
      html: prepared.confirmation.html,
      text: prepared.confirmation.text,
    }),
  ]);

  if (!databaseSaved && !formSubmitRes.ok && !internalRes.sent) {
    console.error(`[${prepared.log}] no channel accepted the request (database, FormSubmit, Resend).`);
    return json({ ok: false, code: "server" }, 500);
  }

  const partial = !databaseSaved || !internalRes.sent || !confirmRes.sent || !formSubmitRes.ok;
  return json({ ok: true, partial });
}
