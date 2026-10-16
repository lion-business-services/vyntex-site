/** Explicit, verified one-to-one routes. No hreflang points to a missing page. */
export const PUBLIC_LOCALE_ROUTES = {
  "/": "/es",
  "/services": "/es/servicios",
  "/services/ai-automation": "/es/servicios/automatizacion-ia",
  "/services/ai-chatbots": "/es/servicios/chatbots-ia",
  "/services/crm-systems": "/es/servicios/sistemas-crm",
  "/services/web-development": "/es/servicios/desarrollo-web",
  "/services/branding": "/es/servicios/branding",
  "/services/digital-marketing": "/es/servicios/marketing-digital",
  "/industries": "/es/industrias",
  "/about": "/es/nosotros",
  "/contact": "/es/contacto",
  "/partners": "/es/socios",
} as const;

export type EnglishLocalizedPath = keyof typeof PUBLIC_LOCALE_ROUTES;
export const EN_TO_ES: Record<string, string> = {
  ...PUBLIC_LOCALE_ROUTES,
  ...Object.fromEntries(
    Object.entries({
      "professional-services": "servicios-profesionales",
      "home-services": "servicios-para-el-hogar",
      "restaurants-retail": "restaurantes-y-tiendas",
      "beauty-wellness": "belleza-y-bienestar",
      "startups": "empresas-nuevas",
      "multilingual-businesses": "negocios-bilingues",
    }).map(([en, es]) => [`/industries/${en}`, `/es/industrias/${es}`]),
  ),
};
export const ES_TO_EN: Record<string, string> = Object.fromEntries(
  Object.entries(EN_TO_ES).map(([en, es]) => [es, en]),
);

export const INDUSTRY_SLUGS = [
  "professional-services", "home-services", "restaurants-retail",
  "beauty-wellness", "startups", "multilingual-businesses",
] as const;

export function localizedPath(path: string, lang: "en" | "es"): string {
  const [pathname = "", ...hash] = path.split("#");
  if (!pathname.startsWith("/")) return path;
  const converted = lang === "es" ? EN_TO_ES[pathname] : ES_TO_EN[pathname];
  return (converted || pathname) + (hash.length ? `#${hash.join("#")}` : "");
}

export function seoAlternates(englishPath: string) {
  const es = EN_TO_ES[englishPath];
  return {
    canonical: englishPath,
    ...(es ? { languages: { "en-US": englishPath, "es-US": es, "x-default": englishPath } } : {}),
  };
}

export function spanishAlternates(spanishPath: string) {
  const en = ES_TO_EN[spanishPath];
  return {
    canonical: spanishPath,
    ...(en ? { languages: { "en-US": en, "es-US": spanishPath, "x-default": en } } : {}),
  };
}

/** Spanish URL slug for each industry (English slug -> Spanish slug). */
export const ES_INDUSTRY_SLUGS: Record<(typeof INDUSTRY_SLUGS)[number], string> = Object.fromEntries(
  INDUSTRY_SLUGS.map(en => [en, (EN_TO_ES[`/industries/${en}`] ?? "").split("/").pop() ?? en]),
) as Record<(typeof INDUSTRY_SLUGS)[number], string>;

/** English industry slug for a Spanish slug, or undefined. */
export function industrySlugFromSpanish(esSlug: string): (typeof INDUSTRY_SLUGS)[number] | undefined {
  return INDUSTRY_SLUGS.find(en => ES_INDUSTRY_SLUGS[en] === esSlug);
}
