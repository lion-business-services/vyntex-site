import { SITE, ERP } from "@/lib/site";
import { PUBLIC_LOCALE_ROUTES } from "@/lib/seo-routes";
import { NJ_TOWNS } from "@/lib/local-nj";

/** Owner-supplied SEO kit details; unverified hours, profiles and ratings omitted. */
const SERVICE_NAMES: Record<string, string> = {
  "ai-automation": "AI Automation", "ai-chatbots": "AI Chatbots", "crm-systems": "CRM Systems",
  "web-development": "Web Development", "branding": "Branding", "digital-marketing": "Digital Marketing",
};

export default function VyntexJsonLd() {
  const base = SITE.url;
  const businessId = `${base}/#business`;
  const schema = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization", "@id": `${base}/#organization`,
        name: SITE.name, legalName: "VYNTEX LLC", alternateName: "VYNTEX USA", foundingDate: "2026-06-30",
        address: { "@type": "PostalAddress", streetAddress: SITE.address.street, addressLocality: SITE.address.locality, addressRegion: SITE.address.region, postalCode: SITE.address.postalCode, addressCountry: SITE.address.country },
        url: base, logo: `${base}/vyntex-logo.png`,
        email: SITE.email, telephone: "+1-609-780-3218",
        founder: { "@type": "Person", name: "Daysi Bettran" },
        sameAs: Object.values(SITE.social),
      },
      {
        "@type": "ProfessionalService", "@id": businessId,
        name: SITE.name, url: base, image: `${base}${SITE.ogImage}`,
        parentOrganization: { "@id": `${base}/#organization` },
        description: "Bilingual English and Spanish technology services: websites, CRM, AI automation, chatbots, branding and digital marketing for businesses across the United States.",
        telephone: "+1-609-780-3218", email: SITE.email,
        hasMap: SITE.social.googleBusiness, sameAs: Object.values(SITE.social),
        address: { "@type": "PostalAddress", streetAddress: SITE.address.street, addressLocality: SITE.address.locality,
          addressRegion: SITE.address.region, postalCode: SITE.address.postalCode,
          addressCountry: SITE.address.country },
        areaServed: [...NJ_TOWNS.map(t => ({ "@type": "City", name: `${t}, NJ` })), ...["Atlantic", "Cape May", "Cumberland", "Ocean", "Gloucester", "Burlington", "Camden"].map(c => ({ "@type": "AdministrativeArea", name: `${c} County, NJ` })), { "@type": "AdministrativeArea", name: "South Jersey" }, { "@type": "State", name: "New Jersey" }, { "@type": "Country", name: "United States" }],
        openingHoursSpecification: [{ "@type": "OpeningHoursSpecification", dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"], opens: "09:00", closes: "17:30" }],
        availableLanguage: ["English", "Spanish"],
        knowsLanguage: ["en", "es"],
        knowsAbout: ["AI automation", "AI agents", "AI employees", "AI chatbots", "CRM implementation", "Custom project management", "ERP implementation", "Website development", "Brand identity", "Digital marketing", "Social media management", "Local SEO", "Bilingual customer service"],
        hasOfferCatalog: {
          "@type": "OfferCatalog", name: "VYNTEX Services",
          itemListElement: Object.entries(PUBLIC_LOCALE_ROUTES)
            .filter(([path]) => path.startsWith("/services/"))
            .map(([path]) => ({ "@type": "Offer", itemOffered: {
              "@type": "Service", url: base + path,
              name: SERVICE_NAMES[path.split("/").pop() ?? ""] ?? path,
              provider: { "@id": businessId },
            }})),
        },
      },
      // The Business Software. Plans and prices are published (and marked up
      // with Offer data) on erp.vyntexusa.com/pricing, from the ERP's own
      // pricing file, so no price is repeated here.
      { "@type": "SoftwareApplication", "@id": `${ERP.url}/#software`,
        name: ERP.name, alternateName: "VYNTEX Business Software", url: `${ERP.url}/`,
        applicationCategory: "BusinessApplication", operatingSystem: "Web browser",
        inLanguage: ["en", "es"],
        description: "Business management software: leads, clients, jobs, scheduling, documents, e-signature, payments, automations and reports in one place, with editions for each industry. Live demo with sample data, no account needed.",
        publisher: { "@id": `${base}/#organization` },
        potentialAction: { "@type": "ViewAction", name: "Try the live demo", target: `${ERP.url}${ERP.paths.demo}` } },
      { "@type": "WebSite", "@id": `${base}/#website`, url: base,
        name: SITE.name, inLanguage: ["en-US", "es-US"],
        publisher: { "@id": `${base}/#organization` } },
    ],
  };
  return <script type="application/ld+json" dangerouslySetInnerHTML={{
    __html: JSON.stringify(schema).replace(/</g, "\\u003c"),
  }} />;
}
