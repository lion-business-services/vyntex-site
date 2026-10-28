/**
 * Centralized, VERIFIED business information for VYNTEX.
 * Only facts confirmed by the business owner live here. Do not add founding
 * year, project counts, awards, certifications, guarantees, team size, or
 * partnerships unless they have been explicitly verified.
 */

export const SITE = {
  name: "VYNTEX",
  legalName: "VYNTEX",
  tagline: "Connected business systems, CRM implementation, automation, websites, and digital solutions.",

  url: "https://www.vyntexusa.com",
  domain: "www.vyntexusa.com",

  email: "info@vyntexusa.com",

  // VYNTEX has ONE official business line (calls, texts, WhatsApp).
  // 609-813-0633 belongs to Lion Business Services — never use it for VYNTEX.
  phone: "609-780-3218",

  address: {
    street: "331 Tilton Rd, Suite 27",
    locality: "Northfield",
    region: "NJ",
    postalCode: "08225",
    country: "US",
  },

  serviceArea: "United States",
  languages: ["en", "es"] as const,

  ogImage: "/og-image.png",

  /** Official VYNTEX social profiles (owner-confirmed). Add others here as they are confirmed. */
  social: {
    facebook: "https://www.facebook.com/vyntexusaa/",
    instagram: "https://www.instagram.com/vyntexusa/",
    googleBusiness: "https://maps.google.com/?cid=16318301074226518600",
  },
} as const;

/** E.164-style href for tel: links. Strips non-digits and prefixes +1 (US). */
export function telHref(phone: string): string {
  const digits = phone.replace(/\D/g, "");
  return `tel:+1${digits}`;
}

export const CONTACT_HREFS = {
  email: `mailto:${SITE.email}`,
  phone: telHref(SITE.phone),
} as const;

/** Primary multi-page navigation. */
export const SECTION_IDS = {
  home: "home",
  solutions: "solutions",
  services: "services",
  howItWorks: "how-it-works",
  aiAutomation: "ai-automation",
  pricing: "pricing",
  industries: "industries",
  caseStudies: "case-studies",
  about: "about",
  partners: "partners",
  resources: "resources",
  faq: "faq",
  contact: "contact",
} as const;

export type SectionId = (typeof SECTION_IDS)[keyof typeof SECTION_IDS];

export const NAV_LINKS: { key: keyof typeof SECTION_IDS; href: string }[] = [
  { key: "home", href: "/" },
  { key: "services", href: "/services" },
  { key: "industries", href: "/industries" },
  { key: "partners", href: "/partners" },
  { key: "about", href: "/about" },
  { key: "contact", href: "/contact" },
];

/** Footer legal links. Pages are scaffolded in a later phase. */
export const LEGAL_LINKS = [
  { key: "privacy", href: "/privacy" },
  { key: "terms", href: "/terms" },
  { key: "cookies", href: "/cookies" },
  { key: "accessibility", href: "/accessibility" },
] as const;

/**
 * VYNTEX ERP, the operations platform, served from its own subdomain
 * (separate Vercel project "vyntex-erp"). Every link out of this site carries
 * the visitor's language and theme, so the ERP opens exactly as they were
 * reading here (the ERP reads ?lang= and ?theme=, then tidies the address).
 */
export const ERP = {
  name: "VYNTEX ERP",
  url: "https://erp.vyntexusa.com",
  host: "erp.vyntexusa.com",
  paths: {
    home: "/",
    demo: "/demo",
    pricing: "/pricing",
    requestDemo: "/request-demo",
    /**
     * VYNTEX Partner Portal sign-in. Invitation only: accounts exist just for
     * the emails VYNTEX invited, and every partner signs in with an
     * authenticator app. Not the website's older reseller area (/portal/partner).
     */
    partners: "/partners/signin",
  },
} as const;

/**
 * The link in VYNTEX's own demo-request email that opens the ERP operator console with the "New client workspace"
 * form filled in for a 7-day trial (nothing is created until the operator presses Create). Everything travels after
 * "#", which browsers never send to a server, so the client's name and email stay out of server logs.
 */
export function erpTrialLink(d: { businessName: string; fullName: string; email: string; industry: string; language: string }): string {
  const enc = (v: string) => encodeURIComponent(String(v || "").trim().slice(0, 200));
  const lang = d.language === "es" ? "es" : "en";
  return `${ERP.url}/admin#new-trial&business=${enc(d.businessName || d.fullName)}&owner=${enc(d.fullName)}&email=${enc(d.email)}&industry=${enc(d.industry)}&lang=${lang}`;
}

/**
 * Where "Book a Free Demo" goes, everywhere on the site and in llms.txt.
 *
 * Book a Free Demo is a form on this website: the consultation modal in its
 * "Business Software demo" mode (components/BookConsultation.tsx). It posts to
 * /api/consultation, which saves the request in Supabase, emails the team
 * through Resend and FormSubmit, and confirms to the visitor.
 *
 * Every button is a real link to the contact page with ?intent=demo, so it
 * works without JavaScript and crawlers can follow it; with JavaScript the
 * click opens the form in place, and landing on that address opens it too.
 *
 * When a self-serve calendar exists (for example a VYNTEX CRM / GoHighLevel
 * booking calendar), set calendarUrl and every button goes there instead.
 */
export const DEMO_BOOKING = {
  /** An absolute URL to an external calendar, or null to use the website demo form. */
  calendarUrl: null as string | null,
  /** The contact page for each language; the form opens on top of it. */
  paths: { en: "/contact", es: "/es/contacto" },
  /** Query that asks the page to open the demo form. */
  query: { intent: "demo" },
} as const;

export function erpHref(
  path: string = ERP.paths.home,
  opts: { lang?: "en" | "es"; theme?: "light" | "dark" } = {},
): string {
  const url = new URL(path, ERP.url);
  if (opts.lang) url.searchParams.set("lang", opts.lang);
  if (opts.theme) url.searchParams.set("theme", opts.theme);
  return url.toString();
}

/**
 * The "Book a Free Demo" address: the external calendar when one is set,
 * otherwise the website demo form (/contact?intent=demo, or
 * /es/contacto?intent=demo in Spanish). Pass absolute: true for links that
 * leave the site (llms.txt, emails, AI agents). `theme` is accepted for
 * backward compatibility and ignored: the form is on this site.
 */
export function demoBookingHref(
  opts: { lang?: "en" | "es"; theme?: "light" | "dark"; absolute?: boolean } = {},
): string {
  if (DEMO_BOOKING.calendarUrl) return DEMO_BOOKING.calendarUrl;
  const path = `${DEMO_BOOKING.paths[opts.lang ?? "en"]}?${new URLSearchParams(DEMO_BOOKING.query).toString()}`;
  return opts.absolute ? `${SITE.url}${path}` : path;
}
