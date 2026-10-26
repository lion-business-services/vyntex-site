import { describe, it, expect } from "vitest";
import { ERP, erpHref } from "@/lib/site";

describe("Partner Portal link", () => {
  it("points at the invitation-only sign-in on erp.vyntexusa.com", () => {
    expect(ERP.paths.partners).toBe("/partners/signin");
    expect(erpHref(ERP.paths.partners)).toBe("https://erp.vyntexusa.com/partners/signin");
  });

  it("carries the visitor's language and theme", () => {
    expect(erpHref(ERP.paths.partners, { lang: "es", theme: "light" })).toBe(
      "https://erp.vyntexusa.com/partners/signin?lang=es&theme=light",
    );
    expect(erpHref(ERP.paths.partners, { lang: "en", theme: "dark" })).toBe(
      "https://erp.vyntexusa.com/partners/signin?lang=en&theme=dark",
    );
  });
});
