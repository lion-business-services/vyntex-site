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
  ...Object.fromEntries([
    "professional-services", "home-services", "restaurants-retail",
    "beauty-wellness", "startups", "multilingual-businesses",
  ].map(slug => [`/industries/${slug}`, `/es/industrias/${slug}`])),
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
