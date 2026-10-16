import { SITE } from "@/lib/site";

/** Lightweight per-page service and breadcrumb graph; factual statements only. */
export function PageSchema({ path, name, description, kind = "Service", parentPath, parentName }:
 { path: string; name: string; description: string; kind?: "Service" | "WebPage"; parentPath: string; parentName: string }) {
  const data = { "@context": "https://schema.org", "@graph": [
    { "@type": kind, "@id": `${SITE.url}${path}#content`, name, description,
      url: `${SITE.url}${path}`, ...(kind === "Service" ? { provider: { "@id": `${SITE.url}/#business` } } : {}) },
    { "@type": "BreadcrumbList", itemListElement: [
      { "@type": "ListItem", position: 1, name: "VYNTEX", item: SITE.url },
      { "@type": "ListItem", position: 2, name: parentName, item: `${SITE.url}${parentPath}` },
      { "@type": "ListItem", position: 3, name, item: `${SITE.url}${path}` },
    ] },
  ] };
  return <script type="application/ld+json" dangerouslySetInnerHTML={{__html: JSON.stringify(data).replace(/</g, "\\u003c")}} />;
}
