"use client";

import { useEffect, useRef, useState, type MouseEvent as ReactMouseEvent } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { X, Check, Loader2 } from "lucide-react";
import { useLang } from "@/context/LanguageContext";
import {
  makeConsultationSchema,
  CONSULT_SERVICES,
  CONSULT_BUDGETS,
  CONSULT_TIMELINES,
  CONSULT_PREFERRED,
  CONSULT_MESSAGE_MIN,
  type ConsultationInput,
} from "@/lib/validation/consultation";
import {
  makeDemoRequestSchema,
  DEMO_TEAM_SIZES,
  DEMO_TIMES,
  DEMO_PREFERRED,
  DEMO_REQUEST_TYPE,
  type DemoRequestInput,
} from "@/lib/validation/demo-request";
import { demoPrefillFromSearch, isDemoIntent, type DemoPrefill } from "@/lib/demo-intent";
import { DEMO_BOOKING } from "@/lib/site";
import Button from "@/components/ui/Button";
import { TextField, TextAreaField, SelectField } from "@/components/ui/FormFields";

const OPEN_EVENT = "vx:open-consultation";

type ConsultService = (typeof CONSULT_SERVICES)[number];
type Mode = "consultation" | "demo";

/** Optional values used to pre-fill the modal (e.g. from a service card). */
export interface ConsultationPrefill {
  services?: ConsultService[];
  message?: string;
  /** "demo" opens the Book a Free Demo (Business Software) form instead. */
  mode?: Mode;
  demo?: DemoPrefill;
}

/** How many BookConsultation instances are listening (normally one per page). */
let mountedModals = 0;

/** True once a page has the modal mounted, so a click can open it in place. */
export function consultationModalReady(): boolean {
  return mountedModals > 0;
}

/**
 * Dispatch from anywhere to open the consultation modal. Safe to pass directly
 * as an onClick handler — the click event argument is ignored.
 */
export function openConsultation(): void {
  if (typeof window !== "undefined") window.dispatchEvent(new Event(OPEN_EVENT));
}

/** Opens the consultation modal with the given service(s) and note pre-filled. */
export function openConsultationFor(prefill: ConsultationPrefill): void {
  if (typeof window !== "undefined") {
    window.dispatchEvent(
      new CustomEvent<ConsultationPrefill>(OPEN_EVENT, { detail: prefill }),
    );
  }
}

/** Opens the "Book a Free Demo" form (VYNTEX Business Software). */
export function openDemoRequest(prefill: DemoPrefill = {}): void {
  openConsultationFor({ mode: "demo", demo: prefill });
}

/**
 * onClick for every "Book a Free Demo" link. The link keeps a real href
 * (/contact?intent=demo) for crawlers, no-JS visitors and new-tab clicks; a
 * plain click opens the form in place instead. If no modal is mounted on the
 * page, or an external calendar is configured, the link is simply followed.
 */
export function onDemoLinkClick(event: ReactMouseEvent<HTMLElement>): void {
  if (DEMO_BOOKING.calendarUrl) return;
  if (
    event.defaultPrevented ||
    event.button !== 0 ||
    event.metaKey ||
    event.ctrlKey ||
    event.shiftKey ||
    event.altKey
  ) {
    return;
  }
  if (!consultationModalReady()) return;
  event.preventDefault();
  openDemoRequest();
}

type Status = "idle" | "submitting" | "success" | "error";

function todayIso(): string {
  const now = new Date();
  const local = new Date(now.getTime() - now.getTimezoneOffset() * 60_000);
  return local.toISOString().slice(0, 10);
}

export default function BookConsultation() {
  const { t, lang } = useLang();
  const [open, setOpen] = useState(false);
  const [mode, setMode] = useState<Mode>("consultation");
  const [demoPrefill, setDemoPrefill] = useState<DemoPrefill>({});
  const [status, setStatus] = useState<Status>("idle");
  const [errorMsg, setErrorMsg] = useState<string>("");
  const dialogRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<Element | null>(null);
  const startedAt = useRef<number>(Date.now());

  const schema = makeConsultationSchema({
    required: t.forms.errors.required,
    invalidEmail: t.forms.errors.invalidEmail,
    invalidPhone: t.forms.errors.invalidPhone,
    minMessage: t.forms.errors.minMessage.replace("{min}", String(CONSULT_MESSAGE_MIN)),
    consent: t.forms.errors.consent,
    selectAtLeastOne: t.forms.errors.selectAtLeastOne,
    selectOne: t.forms.errors.required,
  });

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ConsultationInput>({
    resolver: zodResolver(schema),
    defaultValues: { services: [], honeypot: "", language: lang },
  });

  useEffect(() => {
    const onOpen = (event: Event) => {
      const prefill: ConsultationPrefill =
        event instanceof CustomEvent && event.detail ? (event.detail as ConsultationPrefill) : {};
      triggerRef.current = document.activeElement;
      startedAt.current = Date.now();
      setStatus("idle");
      setErrorMsg("");
      if (prefill.mode === "demo") {
        setDemoPrefill(prefill.demo ?? {});
        setMode("demo");
      } else {
        reset({
          services: prefill.services ?? [],
          message: prefill.message ?? "",
          honeypot: "",
          language: lang,
        });
        setMode("consultation");
      }
      setOpen(true);
    };
    window.addEventListener(OPEN_EVENT, onOpen);
    mountedModals += 1;
    return () => {
      window.removeEventListener(OPEN_EVENT, onOpen);
      mountedModals -= 1;
    };
  }, [reset, lang]);

  // Landing on /contact?intent=demo (or any page with it) opens the demo form.
  useEffect(() => {
    if (DEMO_BOOKING.calendarUrl) return;
    const search = window.location.search;
    if (isDemoIntent(search)) openDemoRequest(demoPrefillFromSearch(search, lang));
    // Only on first load; switching language later must not reopen it.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const close = () => {
    setOpen(false);
    if (triggerRef.current instanceof HTMLElement) triggerRef.current.focus();
  };

  // Focus trap + ESC + body scroll lock.
  useEffect(() => {
    if (!open) return;
    const node = dialogRef.current;
    const selector =
      'a[href],button:not([disabled]),textarea:not([disabled]),input:not([disabled]),select:not([disabled]),[tabindex]:not([tabindex="-1"])';
    const focusables = () =>
      node ? Array.from(node.querySelectorAll<HTMLElement>(selector)) : [];
    focusables()[0]?.focus();

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        close();
        return;
      }
      if (e.key === "Tab") {
        const items = focusables();
        if (items.length === 0) return;
        const first = items[0]!;
        const last = items[items.length - 1]!;
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, mode]);

  const mapError = (code?: string): string => {
    switch (code) {
      case "rate_limited":
        return t.forms.errors.rateLimited;
      case "spam":
        return t.forms.errors.spam;
      case "validation":
        return t.forms.errors.server;
      default:
        return t.forms.errors.server;
    }
  };

  /** Posts to /api/consultation. Success means the team has the request. */
  const send = async (body: Record<string, unknown>) => {
    setStatus("submitting");
    setErrorMsg("");
    try {
      const res = await fetch("/api/consultation", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...body, startedAt: startedAt.current, language: lang }),
      });
      const data = (await res.json()) as { ok: boolean; partial?: boolean; code?: string };
      if (data.ok) {
        setStatus("success");
        return;
      }
      setErrorMsg(mapError(data.code));
      setStatus("error");
    } catch {
      setErrorMsg(t.forms.errors.network);
      setStatus("error");
    }
  };

  const onSubmit = (values: ConsultationInput) => send({ ...values });

  if (!open) return null;

  const success =
    mode === "demo"
      ? { title: t.demo.success.title, body: t.demo.success.body }
      : { title: t.forms.success.title, body: t.forms.success.body };

  return (
    <div
      className="fixed inset-0 z-[90] flex items-start justify-center overflow-y-auto bg-black/70 p-4 backdrop-blur-sm sm:items-center"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) close();
      }}
    >
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="consult-title"
        data-mode={mode}
        data-testid={mode === "demo" ? "demo-request-dialog" : "consultation-dialog"}
        className="relative my-8 w-full max-w-lg rounded-2xl border border-[rgba(14,165,233,0.2)] bg-vx-bg2 p-6 shadow-vx-glow sm:p-8"
      >
        <button
          type="button"
          onClick={close}
          aria-label={t.forms.close}
          className="absolute right-4 top-4 rounded-lg p-1.5 text-vx-muted hover:bg-vx-bg3 hover:text-vx-ink"
        >
          <X size={20} aria-hidden />
        </button>

        {status === "success" ? (
          <div className="flex flex-col items-center py-6 text-center" role="status">
            <span className="grid h-14 w-14 place-items-center rounded-full bg-gradient-to-br from-vx-blue to-vx-cyan text-vx-onaccent">
              <Check size={26} aria-hidden />
            </span>
            <h2 id="consult-title" className="mt-4 text-xl font-bold text-vx-ink">
              {success.title}
            </h2>
            <p className="mt-2 max-w-sm text-sm text-vx-muted">{success.body}</p>
            <div className="mt-6">
              <Button onClick={close} variant="primary">
                {t.forms.close}
              </Button>
            </div>
          </div>
        ) : mode === "demo" ? (
          <DemoRequestForm
            key={`${lang}:${demoPrefill.industry ?? ""}:${demoPrefill.message ?? ""}`}
            prefill={demoPrefill}
            status={status}
            errorMsg={errorMsg}
            onSend={(values) => send({ ...values, requestType: DEMO_REQUEST_TYPE })}
            onCancel={close}
            onSwitchToConsultation={() => {
              setStatus("idle");
              setErrorMsg("");
              reset({ services: [], message: "", honeypot: "", language: lang });
              setMode("consultation");
            }}
          />
        ) : (
          <>
            <h2 id="consult-title" className="pr-8 text-xl font-bold text-vx-ink">
              {t.consult.title}
            </h2>
            <p className="mt-1.5 text-sm text-vx-muted">{t.consult.subtitle}</p>

            <form onSubmit={handleSubmit(onSubmit)} className="mt-5 flex flex-col gap-4" noValidate>
              {/* Honeypot */}
              <input
                type="text"
                tabIndex={-1}
                autoComplete="off"
                aria-hidden
                className="hidden"
                {...register("honeypot")}
              />

              <div className="grid gap-4 sm:grid-cols-2">
                <TextField label={t.consult.fields.name} error={errors.fullName?.message} required
                  field={register("fullName")} />
                <TextField label={t.consult.fields.business} error={errors.businessName?.message}
                  field={register("businessName")} />
                <TextField label={t.consult.fields.email} type="email" error={errors.email?.message} required
                  field={register("email")} />
                <TextField label={t.consult.fields.phone} type="tel" error={errors.phone?.message}
                  field={register("phone")} />
              </div>

              {/* Services (multi) */}
              <fieldset>
                <legend className="mb-1.5 text-sm text-vx-silver">
                  {t.consult.fields.services} <span className="text-vx-blue">*</span>
                </legend>
                <div className="flex flex-wrap gap-2">
                  {CONSULT_SERVICES.map((token, i) => (
                    <label
                      key={token}
                      className="inline-flex cursor-pointer items-center gap-2 rounded-full border border-[rgba(14,165,233,0.2)] bg-vx-bg3 px-3 py-1.5 text-sm text-vx-silver has-[:checked]:border-vx-blue has-[:checked]:text-vx-ink"
                    >
                      <input type="checkbox" value={token} className="accent-vx-blue" {...register("services")} />
                      {t.consult.serviceOptions[i]}
                    </label>
                  ))}
                </div>
                {errors.services?.message ? (
                  <p className="mt-1 text-xs text-red-400">{errors.services.message}</p>
                ) : null}
              </fieldset>

              <div className="grid gap-4 sm:grid-cols-2">
                <SelectField label={t.consult.fields.budget} required error={errors.budget?.message}
                  placeholder={t.consult.selectPlaceholder}
                  options={CONSULT_BUDGETS.map((v, i) => ({ value: v, label: t.consult.budgetOptions[i]! }))}
                  field={register("budget")} />
                <SelectField label={t.consult.fields.timeline} required error={errors.timeline?.message}
                  placeholder={t.consult.selectPlaceholder}
                  options={CONSULT_TIMELINES.map((v, i) => ({ value: v, label: t.consult.timelineOptions[i]! }))}
                  field={register("timeline")} />
              </div>

              {/* Preferred contact */}
              <fieldset>
                <legend className="mb-1.5 text-sm text-vx-silver">
                  {t.consult.fields.preferredContact} <span className="text-vx-blue">*</span>
                </legend>
                <div className="flex flex-wrap gap-3">
                  {CONSULT_PREFERRED.map((token, i) => (
                    <label key={token} className="inline-flex items-center gap-2 text-sm text-vx-silver">
                      <input type="radio" value={token} className="accent-vx-blue" {...register("preferredContact")} />
                      {t.consult.preferredContactOptions[i]}
                    </label>
                  ))}
                </div>
                {errors.preferredContact?.message ? (
                  <p className="mt-1 text-xs text-red-400">{errors.preferredContact.message}</p>
                ) : null}
              </fieldset>

              <TextField label={t.consult.fields.referral} placeholder={t.consult.referralPlaceholder}
                field={register("referralSource")} />

              <TextAreaField label={t.consult.fields.message} required error={errors.message?.message}
                field={register("message")} />

              <label className="flex items-start gap-2 text-sm text-vx-muted">
                <input type="checkbox" className="mt-1 accent-vx-blue" {...register("consent")} />
                <span>{t.consult.fields.consent}</span>
              </label>
              {errors.consent?.message ? (
                <p className="-mt-2 text-xs text-red-400">{errors.consent.message}</p>
              ) : null}

              {status === "error" ? (
                <p role="alert" className="rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-2 text-sm text-red-300">
                  {errorMsg}
                </p>
              ) : null}

              <div className="flex flex-col gap-2 sm:flex-row sm:justify-end">
                <Button type="button" variant="ghost" onClick={close}>
                  {t.forms.cancel}
                </Button>
                <Button type="submit" variant="primary" disabled={status === "submitting"}>
                  {status === "submitting" ? (
                    <>
                      <Loader2 size={16} className="animate-spin" aria-hidden />
                      {t.forms.sending}
                    </>
                  ) : (
                    t.consult.submit
                  )}
                </Button>
              </div>
            </form>
          </>
        )}
      </div>
    </div>
  );
}

/**
 * "Book a Free Demo" form (VYNTEX Business Software). Rendered inside the
 * consultation modal and submitted through the same /api/consultation route
 * with requestType "demo". Field ids are prefixed so they never collide with
 * the contact form on /contact.
 */
function DemoRequestForm({
  prefill,
  status,
  errorMsg,
  onSend,
  onCancel,
  onSwitchToConsultation,
}: {
  prefill: DemoPrefill;
  status: Status;
  errorMsg: string;
  onSend: (values: DemoRequestInput) => Promise<void>;
  onCancel: () => void;
  onSwitchToConsultation: () => void;
}) {
  const { t, lang } = useLang();
  const d = t.demo;

  const schema = makeDemoRequestSchema({
    required: t.forms.errors.required,
    invalidEmail: t.forms.errors.invalidEmail,
    invalidPhone: t.forms.errors.invalidPhone,
    invalidDate: t.forms.errors.invalidDate,
    consent: t.forms.errors.consent,
    selectOne: t.forms.errors.required,
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<DemoRequestInput>({
    resolver: zodResolver(schema),
    defaultValues: {
      requestType: DEMO_REQUEST_TYPE,
      industry: prefill.industry ?? "",
      message: prefill.message ?? "",
      preferredDate: "",
      phone: "",
      honeypot: "",
      language: lang,
    },
  });

  const errorId = (name: string) => `demo-${name}-error`;

  return (
    <>
      <h2 id="consult-title" className="pr-8 text-xl font-bold text-vx-ink">
        {d.title}
      </h2>
      <p className="mt-1.5 text-sm text-vx-muted">{d.subtitle}</p>

      <form
        onSubmit={handleSubmit(onSend)}
        className="mt-5 flex flex-col gap-4"
        noValidate
        data-testid="demo-request-form"
        aria-label={d.title}
      >
        {/* Honeypot */}
        <input
          type="text"
          tabIndex={-1}
          autoComplete="off"
          aria-hidden
          className="hidden"
          {...register("honeypot")}
        />

        <div className="grid gap-4 sm:grid-cols-2">
          <TextField id="demo-fullName" label={t.consult.fields.name} error={errors.fullName?.message} required
            autoComplete="name" field={register("fullName")} />
          <TextField id="demo-businessName" label={t.consult.fields.business} error={errors.businessName?.message} required
            autoComplete="organization" field={register("businessName")} />
          <TextField id="demo-email" label={t.consult.fields.email} type="email" error={errors.email?.message} required
            autoComplete="email" field={register("email")} />
          <TextField id="demo-phone" label={t.consult.fields.phone} type="tel" error={errors.phone?.message}
            autoComplete="tel" field={register("phone")} />
          <TextField id="demo-industry" label={d.fields.industry} error={errors.industry?.message} required
            placeholder={d.industryPlaceholder} field={register("industry")} />
          <SelectField id="demo-teamSize" label={d.fields.teamSize} required error={errors.teamSize?.message}
            placeholder={t.consult.selectPlaceholder}
            options={DEMO_TEAM_SIZES.map((v, i) => ({ value: v, label: d.teamSizeOptions[i]! }))}
            field={register("teamSize")} />
          <TextField id="demo-preferredDate" label={d.fields.preferredDate} type="date" min={todayIso()}
            error={errors.preferredDate?.message} field={register("preferredDate")} />
          <SelectField id="demo-preferredTime" label={d.fields.preferredTime} required error={errors.preferredTime?.message}
            placeholder={t.consult.selectPlaceholder}
            options={DEMO_TIMES.map((v, i) => ({ value: v, label: d.preferredTimeOptions[i]! }))}
            field={register("preferredTime")} />
        </div>

        <fieldset aria-describedby={errors.preferredContact ? errorId("preferredContact") : undefined}>
          <legend className="mb-1.5 text-sm text-vx-silver">
            {t.consult.fields.preferredContact} <span className="text-vx-blue">*</span>
          </legend>
          <div className="flex flex-wrap gap-3">
            {DEMO_PREFERRED.map((token, i) => (
              <label key={token} className="inline-flex min-h-[32px] items-center gap-2 text-sm text-vx-silver">
                <input type="radio" value={token} className="accent-vx-blue" {...register("preferredContact")} />
                {t.consult.preferredContactOptions[i]}
              </label>
            ))}
          </div>
          {errors.preferredContact?.message ? (
            <p id={errorId("preferredContact")} className="mt-1 text-xs text-red-400">{errors.preferredContact.message}</p>
          ) : null}
        </fieldset>

        <TextAreaField id="demo-message" label={d.fields.message} rows={3} error={errors.message?.message}
          field={register("message")} />

        <label className="flex items-start gap-2 text-sm text-vx-muted">
          <input
            type="checkbox"
            className="mt-1 accent-vx-blue"
            aria-invalid={Boolean(errors.consent)}
            aria-describedby={errors.consent ? errorId("consent") : undefined}
            {...register("consent")}
          />
          <span>{t.consult.fields.consent}</span>
        </label>
        {errors.consent?.message ? (
          <p id={errorId("consent")} className="-mt-2 text-xs text-red-400">{errors.consent.message}</p>
        ) : null}

        {status === "error" ? (
          <p role="alert" className="rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-2 text-sm text-red-300">
            {errorMsg}
          </p>
        ) : null}

        <div className="flex flex-col gap-2 sm:flex-row sm:justify-end">
          <Button type="button" variant="ghost" onClick={onCancel}>
            {t.forms.cancel}
          </Button>
          <Button type="submit" variant="primary" disabled={status === "submitting"} data-testid="demo-request-submit">
            {status === "submitting" ? (
              <>
                <Loader2 size={16} className="animate-spin" aria-hidden />
                {t.forms.sending}
              </>
            ) : (
              d.submit
            )}
          </Button>
        </div>

        <p className="text-center text-xs text-vx-muted">
          {d.otherHelp}{" "}
          <button
            type="button"
            onClick={onSwitchToConsultation}
            className="font-semibold text-vx-ink underline decoration-vx-cyan/60 underline-offset-4 hover:text-vx-cyan"
          >
            {d.switchToConsultation}
          </button>
        </p>
      </form>
    </>
  );
}
