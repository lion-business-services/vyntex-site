import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import {
  buildFormSubmitRequest,
  isFormSubmitSuccess,
  notifyFormSubmit,
  type FormSubmitNotification,
} from "@/lib/formsubmit";
import { demoRequestSubject } from "@/lib/email/templates";

/**
 * FormSubmit is the channel that emails the team for every public form,
 * including Book a Free Demo. These tests pin the payload FormSubmit receives
 * and how its answer is read. No network: fetch is mocked.
 */

const demo: FormSubmitNotification = {
  formName: "VYNTEX ERP Demo Request",
  subject: demoRequestSubject({ businessName: "Acme Cleaning LLC", fullName: "Ana Ruiz" }),
  replyTo: "ana@example.com",
  fields: {
    Name: "Ana Ruiz",
    Business: "Acme Cleaning LLC",
    Email: "ana@example.com",
    Phone: "",
    Industry: "Cleaning",
    Notes: "",
  },
};

const NOW = new Date("2026-10-22T15:00:00Z");

describe("buildFormSubmitRequest", () => {
  it("posts to the AJAX endpoint of FORMSUBMIT_EMAIL", () => {
    const { endpoint } = buildFormSubmitRequest(demo, { FORMSUBMIT_EMAIL: "team@vyntexusa.com" }, NOW);
    expect(endpoint).toBe("https://formsubmit.co/ajax/team%40vyntexusa.com");
  });

  it("defaults to info@vyntexusa.com when FORMSUBMIT_EMAIL is missing or not an email", () => {
    expect(buildFormSubmitRequest(demo, {}, NOW).endpoint).toBe(
      "https://formsubmit.co/ajax/info%40vyntexusa.com",
    );
    expect(buildFormSubmitRequest(demo, { FORMSUBMIT_EMAIL: "  " }, NOW).endpoint).toBe(
      "https://formsubmit.co/ajax/info%40vyntexusa.com",
    );
    expect(buildFormSubmitRequest(demo, { FORMSUBMIT_EMAIL: "not-an-email" }, NOW).endpoint).toBe(
      "https://formsubmit.co/ajax/info%40vyntexusa.com",
    );
  });

  it("sets the subject, table template, no captcha and the visitor as reply-to", () => {
    const { payload } = buildFormSubmitRequest(demo, {}, NOW);
    expect(payload._subject).toBe("New VYNTEX ERP demo request: Acme Cleaning LLC");
    expect(payload._template).toBe("table");
    expect(payload._captcha).toBe("false");
    expect(payload._replyto).toBe("ana@example.com");
    expect(payload["Submission Type"]).toBe("VYNTEX ERP Demo Request");
    expect(payload["Submitted At"]).toBe("2026-10-22T15:00:00.000Z");
  });

  it("uses the person's name in the subject when there is no business name", () => {
    expect(demoRequestSubject({ businessName: "", fullName: "Ana Ruiz" })).toBe(
      "New VYNTEX ERP demo request: Ana Ruiz",
    );
  });

  it("falls back to the destination inbox as reply-to when the visitor email is invalid", () => {
    const { payload } = buildFormSubmitRequest({ ...demo, replyTo: "nope" }, {}, NOW);
    expect(payload._replyto).toBe("info@vyntexusa.com");
  });

  it("keeps the subject on one line (no header injection)", () => {
    const { payload } = buildFormSubmitRequest(
      { ...demo, subject: "New VYNTEX ERP demo request: Evil\r\nBcc: x@example.com" },
      {},
      NOW,
    );
    expect(payload._subject).not.toMatch(/[\r\n]/);
  });

  it("writes every field as text and never lets a field override a FormSubmit setting", () => {
    const { payload } = buildFormSubmitRequest(
      {
        ...demo,
        fields: {
          ...demo.fields,
          Services: ["crm", "website"],
          _captcha: "true",
          _next: "https://evil.example.com",
        },
      },
      {},
      NOW,
    );
    expect(payload.Phone).toBe("Not provided");
    expect(payload.Services).toBe("crm, website");
    expect(payload._captcha).toBe("false");
    expect(payload._next).toBeUndefined();
  });
});

describe("isFormSubmitSuccess", () => {
  it("accepts true and \"true\" only", () => {
    expect(isFormSubmitSuccess({ success: true })).toBe(true);
    expect(isFormSubmitSuccess({ success: "true" })).toBe(true);
    expect(isFormSubmitSuccess({ success: "false", message: "This form needs Activation." })).toBe(false);
    expect(isFormSubmitSuccess({ success: false })).toBe(false);
    expect(isFormSubmitSuccess({})).toBe(false);
    expect(isFormSubmitSuccess(null)).toBe(false);
    expect(isFormSubmitSuccess("ok")).toBe(false);
  });
});

describe("notifyFormSubmit (fetch mocked)", () => {
  const fetchMock = vi.fn();
  const errorSpy = vi.spyOn(console, "error").mockImplementation(() => {});

  beforeEach(() => {
    fetchMock.mockReset();
    errorSpy.mockClear();
    vi.stubGlobal("fetch", fetchMock);
    vi.stubEnv("FORMSUBMIT_ENABLED", "true");
    vi.stubEnv("FORMSUBMIT_EMAIL", "info@vyntexusa.com");
  });

  afterEach(() => {
    vi.unstubAllGlobals();
    vi.unstubAllEnvs();
  });

  const answer = (body: unknown, status = 200) =>
    new Response(JSON.stringify(body), { status, headers: { "Content-Type": "application/json" } });

  it("sends one JSON POST and reports ok when FormSubmit says success", async () => {
    fetchMock.mockResolvedValueOnce(answer({ success: "true", message: "The form was submitted successfully." }));
    const result = await notifyFormSubmit(demo);
    expect(result).toEqual({ ok: true });
    expect(fetchMock).toHaveBeenCalledTimes(1);
    const [url, init] = fetchMock.mock.calls[0]!;
    expect(url).toBe("https://formsubmit.co/ajax/info%40vyntexusa.com");
    expect(init.method).toBe("POST");
    expect(init.headers).toMatchObject({ Accept: "application/json", "Content-Type": "application/json" });
    const sent = JSON.parse(init.body as string);
    expect(sent._subject).toBe("New VYNTEX ERP demo request: Acme Cleaning LLC");
    expect(sent._replyto).toBe("ana@example.com");
    expect(sent.Industry).toBe("Cleaning");
  });

  it("reports a failure (without retrying) when the form is not activated yet, and logs no personal data", async () => {
    fetchMock.mockResolvedValueOnce(
      answer({ success: "false", message: "This form needs Activation. We've sent you an email containing an 'Activate Form' link." }),
    );
    const result = await notifyFormSubmit(demo);
    expect(result.ok).toBe(false);
    expect(result.error).toMatch(/Activation/);
    expect(fetchMock).toHaveBeenCalledTimes(1);
    const logged = errorSpy.mock.calls.flat().join(" ");
    expect(logged).toContain("VYNTEX ERP Demo Request");
    expect(logged).not.toContain("ana@example.com");
    expect(logged).not.toContain("Ana Ruiz");
  });

  it("treats a 200 answer without a success flag as a failure", async () => {
    fetchMock.mockResolvedValueOnce(new Response("<html>oops</html>", { status: 200 }));
    expect((await notifyFormSubmit(demo)).ok).toBe(false);
  });

  it("retries once after a server error and succeeds", async () => {
    fetchMock
      .mockResolvedValueOnce(answer({ success: "false" }, 502))
      .mockResolvedValueOnce(answer({ success: true }));
    expect(await notifyFormSubmit(demo)).toEqual({ ok: true });
    expect(fetchMock).toHaveBeenCalledTimes(2);
  });

  it("retries once after a network error, then gives up without throwing", async () => {
    fetchMock.mockRejectedValue(new TypeError("fetch failed"));
    const result = await notifyFormSubmit(demo);
    expect(result.ok).toBe(false);
    expect(fetchMock).toHaveBeenCalledTimes(2);
  });

  it("does nothing when FORMSUBMIT_ENABLED is false", async () => {
    vi.stubEnv("FORMSUBMIT_ENABLED", "false");
    expect(await notifyFormSubmit(demo)).toEqual({ ok: true, skipped: true });
    expect(fetchMock).not.toHaveBeenCalled();
  });
});
