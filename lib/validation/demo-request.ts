import { z } from "zod";
import { CONSULT_PREFERRED } from "@/lib/validation/consultation";

/**
 * "Book a Free Demo" (VYNTEX Business Software) validation.
 *
 * The demo request travels through the consultation pipeline: the same modal,
 * the same /api/consultation route, the same Supabase table, Resend outbox and
 * FormSubmit notification. It is told apart by `requestType: "demo"`; a body
 * without that field is an ordinary consultation request, so older clients
 * keep working unchanged.
 *
 * Option values are canonical tokens; the UI renders translated labels.
 */

export const DEMO_REQUEST_TYPE = "demo" as const;

/** Stored in consultation_requests.services so demo requests are easy to filter. */
export const DEMO_SERVICE_TOKEN = "business_software_demo" as const;

export const DEMO_TEAM_SIZES = ["1", "2_5", "6_15", "16_50", "50_plus"] as const;

/** Office hours are Monday to Friday, 9:00 AM to 5:30 PM Eastern. */
export const DEMO_TIMES = ["morning", "midday", "afternoon", "any"] as const;

export const DEMO_PREFERRED = CONSULT_PREFERRED;

export const DEMO_MESSAGE_MAX = 2000;

const phoneRe = /^[+()\-\s\d]{7,20}$/;
const dateRe = /^\d{4}-\d{2}-\d{2}$/;
const DAY_MS = 24 * 60 * 60 * 1000;

/**
 * A preferred date is optional. When given it must be a real calendar date
 * from today on (one day of slack for time zones) and within the next year.
 */
export function isAcceptableDemoDate(value: string, now: Date = new Date()): boolean {
  if (!dateRe.test(value)) return false;
  const parsed = new Date(`${value}T12:00:00Z`);
  if (Number.isNaN(parsed.getTime())) return false;
  // Reject impossible dates that Date silently rolls over (2026-02-31).
  if (parsed.toISOString().slice(0, 10) !== value) return false;
  const diff = parsed.getTime() - now.getTime();
  return diff >= -1.5 * DAY_MS && diff <= 366 * DAY_MS;
}

export interface DemoRequestMessages {
  required: string;
  invalidEmail: string;
  invalidPhone: string;
  invalidDate: string;
  consent: string;
  selectOne: string;
}

export const defaultDemoRequestMessages: DemoRequestMessages = {
  required: "This field is required.",
  invalidEmail: "Enter a valid email address.",
  invalidPhone: "Enter a valid phone number.",
  invalidDate: "Choose a date from today on.",
  consent: "Please provide your consent to continue.",
  selectOne: "Please select one.",
};

export function makeDemoRequestSchema(m: DemoRequestMessages = defaultDemoRequestMessages) {
  return z.object({
    requestType: z.literal(DEMO_REQUEST_TYPE),
    fullName: z.string().trim().min(1, m.required).max(120),
    businessName: z.string().trim().min(1, m.required).max(160),
    email: z.string().trim().min(1, m.required).email(m.invalidEmail).max(180),
    phone: z
      .string()
      .trim()
      .max(40)
      .optional()
      .default("")
      .refine((v) => v === "" || phoneRe.test(v), m.invalidPhone),
    industry: z.string().trim().min(1, m.required).max(120),
    teamSize: z.enum(DEMO_TEAM_SIZES, { errorMap: () => ({ message: m.selectOne }) }),
    preferredDate: z
      .string()
      .trim()
      .optional()
      .default("")
      .refine((v) => v === "" || isAcceptableDemoDate(v), m.invalidDate),
    preferredTime: z.enum(DEMO_TIMES, { errorMap: () => ({ message: m.selectOne }) }),
    preferredContact: z.enum(DEMO_PREFERRED, { errorMap: () => ({ message: m.selectOne }) }),
    message: z.string().trim().max(DEMO_MESSAGE_MAX).optional().default(""),
    consent: z.literal(true, { errorMap: () => ({ message: m.consent }) }),
    language: z.enum(["en", "es"]).default("en"),
    honeypot: z.string().optional().default(""),
    startedAt: z.number().optional(),
  });
}

export const demoRequestSchema = makeDemoRequestSchema();
export type DemoRequestInput = z.infer<typeof demoRequestSchema>;

/** True when a request body asks for a Business Software demo. */
export function isDemoRequestBody(body: unknown): boolean {
  return (
    typeof body === "object" &&
    body !== null &&
    (body as Record<string, unknown>).requestType === DEMO_REQUEST_TYPE
  );
}
