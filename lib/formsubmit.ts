import "server-only";
import { SITE } from "@/lib/site";

/**
 * Internal submission notification through FormSubmit (AJAX endpoint).
 *
 * Every public form (contact, consultation, Book a Free Demo, reseller, ...)
 * calls notifyFormSubmit so the team gets an email at FORMSUBMIT_EMAIL
 * (default info@vyntexusa.com) even when Resend or Supabase is down.
 *
 * FormSubmit requires a one-time activation click sent to the destination
 * inbox after the first submission. Until that activation is completed,
 * FormSubmit answers { success: "false" } and this helper reports ok:false;
 * Supabase persistence and the Resend outbox keep the request, so no customer
 * submission is lost and the visitor never sees an error because of it.
 *
 * Authentication secrets, OTP values, payment-provider payloads, and admin
 * actions must never be sent through this helper.
 */

export interface FormSubmitNotification {
  formName: string;
  subject: string;
  replyTo?: string;
  fields: Record<string, unknown>;
}

export interface FormSubmitResult {
  ok: boolean;
  skipped?: boolean;
  error?: string;
}

export interface FormSubmitRequest {
  endpoint: string;
  payload: Record<string, string>;
}

const ENDPOINT_BASE = "https://formsubmit.co/ajax/";
const TIMEOUT_MS = 7000;
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

type Env = Record<string, string | undefined>;

function destination(env: Env): string {
  const configured = env.FORMSUBMIT_EMAIL?.trim();
  return configured && EMAIL_RE.test(configured) ? configured : SITE.email;
}

export function formSubmitEnabled(env: Env = process.env): boolean {
  return env.FORMSUBMIT_ENABLED?.trim().toLowerCase() !== "false";
}

function normalize(value: unknown): string {
  if (value === null || value === undefined || value === "") return "Not provided";
  if (Array.isArray(value)) return value.length ? value.map(normalize).join(", ") : "Not provided";
  if (value instanceof Date) return value.toISOString();
  if (typeof value === "object") return JSON.stringify(value);
  return String(value).slice(0, 5000);
}

/** One line, no control characters, bounded: subjects go into an email header. */
function cleanSubject(subject: string): string {
  return subject.replace(/[\r\n\t]+/g, " ").replace(/\s{2,}/g, " ").trim().slice(0, 180);
}

/**
 * Builds the FormSubmit AJAX request. Pure (no network) so it can be unit
 * tested. Field names starting with "_" are FormSubmit control settings and
 * can only be set here, never by a caller's field list.
 */
export function buildFormSubmitRequest(
  input: FormSubmitNotification,
  env: Env = process.env,
  now: Date = new Date(),
): FormSubmitRequest {
  const email = destination(env);
  const replyTo = input.replyTo?.trim();
  const payload: Record<string, string> = {
    _subject: cleanSubject(input.subject),
    _template: "table",
    _captcha: "false",
    _replyto: replyTo && EMAIL_RE.test(replyTo) ? replyTo : email,
    "Submission Type": input.formName,
    "Submitted At": now.toISOString(),
    Website: env.NEXT_PUBLIC_SITE_URL || SITE.url,
  };

  for (const [key, value] of Object.entries(input.fields)) {
    if (key.startsWith("_")) continue;
    payload[key] = normalize(value);
  }

  return { endpoint: `${ENDPOINT_BASE}${encodeURIComponent(email)}`, payload };
}

/** FormSubmit reports success as true or "true". Anything else is a failure. */
export function isFormSubmitSuccess(body: unknown): boolean {
  if (!body || typeof body !== "object") return false;
  const success = (body as { success?: unknown }).success;
  return success === true || success === "true";
}

/** Strips anything that looks like an email address before logging. */
function redact(text: string): string {
  return text.replace(/[^\s@"']+@[^\s@"']+/g, "[email]").slice(0, 300);
}

function logFailure(formName: string, reason: string): void {
  // Never log field values: they carry the visitor's name, email and phone.
  console.error(`[formsubmit] "${formName}" notification failed: ${redact(reason)}`);
}

async function attempt(request: FormSubmitRequest): Promise<{ result: FormSubmitResult; retry: boolean }> {
  try {
    const response = await fetch(request.endpoint, {
      method: "POST",
      headers: { Accept: "application/json", "Content-Type": "application/json" },
      body: JSON.stringify(request.payload),
      cache: "no-store",
      signal: AbortSignal.timeout(TIMEOUT_MS),
    });

    const body = (await response.json().catch(() => null)) as
      | { success?: unknown; message?: unknown }
      | null;

    if (!response.ok) {
      return {
        result: { ok: false, error: `HTTP ${response.status}` },
        retry: response.status >= 500 || response.status === 429,
      };
    }

    if (!isFormSubmitSuccess(body)) {
      const message = typeof body?.message === "string" ? body.message : "no success flag in the response";
      // Not retried: an unactivated form or a rejected payload will not change in a second.
      return { result: { ok: false, error: `rejected: ${message}` }, retry: false };
    }

    return { result: { ok: true }, retry: false };
  } catch (error) {
    const name = error instanceof Error ? error.name : "";
    const message = error instanceof Error ? error.message : "unknown error";
    return {
      result: { ok: false, error: name === "TimeoutError" ? "timed out" : message },
      retry: true,
    };
  }
}

/**
 * Sends the notification. Never throws. Retries once after a network error,
 * a timeout or a 5xx/429 answer; logs failures without any personal data.
 */
export async function notifyFormSubmit(
  input: FormSubmitNotification,
): Promise<FormSubmitResult> {
  if (!formSubmitEnabled()) return { ok: true, skipped: true };

  const request = buildFormSubmitRequest(input);
  let outcome = await attempt(request);
  if (!outcome.result.ok && outcome.retry) {
    await new Promise((resolve) => setTimeout(resolve, 400));
    outcome = await attempt(request);
  }

  if (!outcome.result.ok) {
    logFailure(input.formName, outcome.result.error ?? "unknown error");
    return { ok: false, error: redact(outcome.result.error ?? "unknown error") };
  }
  return { ok: true };
}
