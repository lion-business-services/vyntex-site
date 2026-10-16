import type { MetadataRoute } from "next";
import { SITE } from "@/lib/site";
import { EN_TO_ES } from "@/lib/seo-routes";

/** Static, crawlable URLs only. No hash fragments, transactional pages or placeholder case studies. */
export default function sitemap(): MetadataRoute.Sitemap {
  const basicPages = ["/partners/apply", "/privacy", "/terms", "/cookies", "/accessibility"];
  const bilingual = Object.entries(EN_TO_ES);
  const alternatesFor = (en: string, es: string) => ({
    languages: { "en-US": `${SITE.url}${en}`, "es-US": `${SITE.url}${es}`, "x-default": `${SITE.url}${en}` },
  });
  return [
    ...bilingual.flatMap(([en, es]) => {
      const priority = en === "/" ? 1 : en.startsWith("/services/") ? 0.8 : 0.65;
      const alternates = alternatesFor(en, es);
      return [
        { url: `${SITE.url}${en}`, changeFrequency: "monthly" as const, priority, alternates },
        { url: `${SITE.url}${es}`, changeFrequency: "monthly" as const, priority, alternates },
      ];
    }),
    ...basicPages.map(path => ({
      url: `${SITE.url}${path}`, changeFrequency: "yearly" as const,
      priority: path === "/partners/apply" ? 0.6 : 0.2,
    })),
  ];
}
