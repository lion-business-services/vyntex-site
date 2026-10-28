import { describe, it, expect } from "vitest";
import { ERP, erpHref, erpTrialLink } from "@/lib/site";

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

describe("7-day trial link in VYNTEX's demo-request email", () => {
  const d = { businessName: "Pine & Co Cleaning", fullName: "Ana Ruiz", email: "ana@example.com", industry: "Cleaning", language: "es" };
  it("opens the ERP console form, with every value after # so it never reaches a server log", () => {
    const link = erpTrialLink(d);
    expect(link.startsWith("https://erp.vyntexusa.com/admin#new-trial&")).toBe(true);
    expect(link).not.toContain("?");
    const params = new URLSearchParams(link.split("#new-trial&")[1]);
    expect(params.get("business")).toBe("Pine & Co Cleaning");
    expect(params.get("owner")).toBe("Ana Ruiz");
    expect(params.get("email")).toBe("ana@example.com");
    expect(params.get("industry")).toBe("Cleaning");
    expect(params.get("lang")).toBe("es");
  });
  it("falls back to the person's name when no business name was given", () => {
    expect(new URLSearchParams(erpTrialLink({ ...d, businessName: "" }).split("#new-trial&")[1]).get("business")).toBe("Ana Ruiz");
  });
});
