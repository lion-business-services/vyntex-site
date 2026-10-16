import { SITE } from "@/lib/site";
import { PUBLIC_LOCALE_ROUTES } from "@/lib/seo-routes";

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
        name: SITE.name, legalName: "Vyntex LLC", alternateName: "VYNTEX USA",
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
        areaServed: [{ "@type": "State", name: "New Jersey" }, { "@type": "Country", name: "United States" }],
        availableLanguage: ["English", "Spanish"],
        knowsLanguage: ["en", "es"],
        knowsAbout: ["AI automation", "AI chatbots", "CRM implementation", "Website development", "Brand identity", "Digital marketing", "Bilingual customer service"],
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
      { "@type": "WebSite", "@id": `${base}/#website`, url: base,
        name: SITE.name, inLanguage: ["en-US", "es-US"],
        publisher: { "@id": `${base}/#organization` } },
    ],
  };
  return <script type="application/ld+json" dangerouslySetInnerHTML={{
    __html: JSON.stringify(schema).replace(/</g, "\\u003c"),
  }} />;
}
