import Link from "next/link";
import { SITE } from "@/lib/site";
import type { Article, ArticleCopy } from "@/lib/articles";
import { getService } from "@/lib/marketing-content";
import { localizedPath } from "@/lib/seo-routes";
import PageShell from "@/components/marketing/PageShell";
import Container from "@/components/ui/Container";
import Button from "@/components/ui/Button";

/** One resource article: visible content plus matching Article, FAQPage and BreadcrumbList schema. */
export default function ArticleView({ article, copy, lang }: { article: Article; copy: ArticleCopy; lang: "en" | "es" }) {
  const es = lang === "es";
  const path = es ? `/es/recursos/${copy.slug}` : `/resources/${copy.slug}`;
  const hub = es ? "/es/recursos" : "/resources";
  const url = `${SITE.url}${path}`;
  const schema = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Article", "@id": `${url}#article`, headline: copy.title, description: copy.description,
        inLanguage: es ? "es-US" : "en-US", url, mainEntityOfPage: url,
        datePublished: article.published, dateModified: article.updated,
        image: `${SITE.url}${SITE.ogImage}`,
        author: { "@id": `${SITE.url}/#organization` }, publisher: { "@id": `${SITE.url}/#organization` },
      },
      {
        "@type": "FAQPage", "@id": `${url}#faq`,
        mainEntity: copy.faq.map(f => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })),
      },
      {
        "@type": "BreadcrumbList", itemListElement: [
          { "@type": "ListItem", position: 1, name: "VYNTEX", item: es ? `${SITE.url}/es` : SITE.url },
          { "@type": "ListItem", position: 2, name: es ? "Recursos" : "Resources", item: `${SITE.url}${hub}` },
          { "@type": "ListItem", position: 3, name: copy.title, item: url },
        ],
      },
    ],
  };
  const date = new Date(`${article.updated}T12:00:00Z`).toLocaleDateString(es ? "es-US" : "en-US", { year: "numeric", month: "long", day: "numeric" });
  return (
    <PageShell>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema).replace(/</g, "\\u003c") }} />
      <article>
        <header className="border-b border-[rgba(14,165,233,0.12)] py-16 sm:py-24">
          <Container>
            <nav aria-label={es ? "Ruta de navegación" : "Breadcrumb"} className="font-mono text-xs uppercase tracking-[0.2em] text-vx-cyan">
              <Link href={hub} className="hover:text-vx-ink">{es ? "Recursos" : "Resources"}</Link>
            </nav>
            <h1 className="mt-5 max-w-4xl text-4xl font-bold text-vx-ink sm:text-5xl">{copy.title}</h1>
            <p className="mt-6 max-w-3xl text-lg leading-8 text-vx-muted">{copy.description}</p>
            <p className="mt-6 text-sm text-vx-muted">VYNTEX · <time dateTime={article.updated}>{(es ? "Actualizado el " : "Updated ") + date}</time></p>
          </Container>
        </header>
        <Container className="max-w-3xl py-16">
          {copy.sections.map(s => (
            <section key={s.heading} className="mb-12">
              <h2 className="text-2xl font-semibold text-vx-ink sm:text-3xl">{s.heading}</h2>
              {s.paragraphs.map(p => <p key={p} className="mt-4 text-base leading-8 text-vx-silver">{p}</p>)}
              {s.bullets ? <ul className="mt-5 list-disc space-y-2 pl-6 text-vx-silver">{s.bullets.map(b => <li key={b} className="leading-7">{b}</li>)}</ul> : null}
            </section>
          ))}
          <section className="mb-12 border-t border-vx-line pt-12">
            <h2 className="text-2xl font-semibold text-vx-ink sm:text-3xl">{es ? "Preguntas frecuentes" : "Frequently asked questions"}</h2>
            <dl className="mt-6 space-y-6">
              {copy.faq.map(f => (
                <div key={f.q} className="rounded-xl border border-vx-line bg-vx-bg2 p-6">
                  <dt className="font-semibold text-vx-ink">{f.q}</dt>
                  <dd className="mt-3 leading-7 text-vx-muted">{f.a}</dd>
                </div>
              ))}
            </dl>
          </section>
          <section className="rounded-2xl border border-[rgba(14,165,233,.2)] bg-vx-bg2 p-8">
            <h2 className="text-2xl font-semibold text-vx-ink">{es ? "Servicios relacionados" : "Related services"}</h2>
            <ul className="mt-5 flex flex-wrap gap-3">
              {article.relatedServices.map(slug => {
                const s = getService(lang, slug);
                return s ? <li key={slug}><Link href={localizedPath(`/services/${slug}`, lang)} className="inline-flex rounded-full border border-[rgba(14,165,233,.25)] px-4 py-2 text-sm text-vx-cyan hover:border-vx-blue">{s.shortTitle}</Link></li> : null;
              })}
            </ul>
            <div className="mt-7"><Button href={localizedPath("/contact", lang)} size="lg">{es ? "Agende una consulta gratuita" : "Book a Free Consultation"}</Button></div>
          </section>
        </Container>
      </article>
    </PageShell>
  );
}
