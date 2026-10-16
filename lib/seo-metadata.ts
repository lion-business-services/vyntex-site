import type { Metadata } from "next";
import { SITE } from "@/lib/site";

export function marketingSocial(path: string, title: string, description: string, spanish = false): Metadata["openGraph"] {
  return {
    type: "website", url: `${SITE.url}${path === "/" ? "" : path}`,
    siteName: SITE.name, locale: spanish ? "es_US" : "en_US",
    alternateLocale: [spanish ? "en_US" : "es_US"],
    title: `${title} | VYNTEX`, description,
    images: [{url: SITE.ogImage, width: 1200, height: 630, alt: "VYNTEX — Connected Business Systems"}],
  };
}
