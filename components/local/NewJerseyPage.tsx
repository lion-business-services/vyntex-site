import Link from "next/link";
import { MapPin, Phone, Mail, Clock } from "lucide-react";
import { SITE, CONTACT_HREFS, ERP, erpHref } from "@/lib/site";
import { NJ_COPY, NJ_TOWNS, NJ_REGIONS } from "@/lib/local-nj";
import PageShell from "@/components/marketing/PageShell";
import MarketingHero from "@/components/marketing/MarketingHero";
import Container from "@/components/ui/Container";

/** Local New Jersey landing page with matching LocalBusiness, Service and FAQPage schema. */
export default function NewJerseyPage({ lang }: { lang: "en" | "es" }) {
  const c = NJ_COPY[lang];
  const es = lang === "es";
  const url = `${SITE.url}${c.path}`;
  const schema = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebPage", "@id": `${url}#webpage`, url, name: c.metaTitle, description: c.description,
        inLanguage: es ? "es-US" : "en-US", about: { "@id": `${SITE.url}/#business` },
      },
      ...c.services.map((s) => ({
        "@type": "Service", name: s.name, description: s.text,
        provider: { "@id": `${SITE.url}/#business` },
        areaServed: [...NJ_TOWNS.map((t) => ({ "@type": "City", name: `${t}, NJ` })), { "@type": "State", name: "New Jersey" }],
        availableLanguage: ["English", "Spanish"],
      })),
      {
        "@type": "FAQPage", "@id": `${url}#faq`,
        mainEntity: c.faq.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })),
      },
      {
        "@type": "BreadcrumbList", itemListElement: [
          { "@type": "ListItem", position: 1, name: "VYNTEX", item: es ? `${SITE.url}/es` : SITE.url },
          { "@type": "ListItem", position: 2, name: es ? "Nueva Jersey" : "New Jersey", item: url },
        ],
      },
    ],
  };
  return (
    <PageShell>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema).replace(/</g, "\\u003c") }} />
      <MarketingHero eyebrow={c.eyebrow} title={c.title} description={c.intro[0] ?? ""} primaryHref={es ? "/es/contacto" : "/contact"} primaryLabel={c.cta} />
      <section className="py-16">
        <Container className="max-w-3xl">
          {c.intro.slice(1).map((p) => <p key={p} className="text-lg leading-8 text-vx-silver">{p}</p>)}
        </Container>
      </section>
      <section className="border-t border-vx-line py-16">
        <Container>
          <h2 className="text-3xl font-semibold text-vx-ink">{c.servicesHeading}</h2>
          <div className="mt-8 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {c.services.map((s) => {
              const href = s.name === "ERP" ? erpHref(ERP.paths.home, { lang }) : s.href;
              const inner = <><h3 className="text-xl font-semibold text-vx-cyan">{s.name}</h3><p className="mt-3 text-sm leading-7 text-vx-muted">{s.text}</p></>;
              const cls = "block rounded-xl border border-vx-line bg-vx-bg2 p-6";
              return href
                ? (href.startsWith("http") ? <a key={s.name} href={href} className={`${cls} hover:border-vx-blue`}>{inner}</a> : <Link key={s.name} href={href} className={`${cls} hover:border-vx-blue`}>{inner}</Link>)
                : <div key={s.name} className={cls}>{inner}</div>;
            })}
          </div>
        </Container>
      </section>
      <section className="border-t border-vx-line py-16">
        <Container className="grid gap-10 lg:grid-cols-2">
          <div>
            <h2 className="text-3xl font-semibold text-vx-ink">{c.whyHeading}</h2>
            <ul className="mt-6 space-y-3">{c.why.map((w) => <li key={w} className="rounded-xl border border-vx-line bg-vx-bg2 p-4 text-vx-silver">{w}</li>)}</ul>
          </div>
          <div>
            <h2 className="text-3xl font-semibold text-vx-ink">{c.areaHeading}</h2>
            <p className="mt-4 text-vx-muted">{c.areaText}</p>
            <ul className="mt-6 flex flex-wrap gap-2">
              {[...NJ_TOWNS, ...NJ_REGIONS].map((t) => <li key={t} className="rounded-full border border-[rgba(14,165,233,.25)] px-3 py-1.5 text-sm text-vx-silver">{t}</li>)}
            </ul>
          </div>
        </Container>
      </section>
      <section className="border-t border-vx-line py-16">
        <Container>
          <h2 className="text-3xl font-semibold text-vx-ink">{c.officeHeading}</h2>
          <address className="mt-6 grid gap-4 not-italic text-vx-silver sm:grid-cols-2">
            <p className="inline-flex items-start gap-2"><MapPin size={18} className="mt-1 text-vx-cyan" />VYNTEX USA<br />{SITE.address.street}<br />{SITE.address.locality}, {SITE.address.region} {SITE.address.postalCode}</p>
            <p className="inline-flex items-start gap-2"><Clock size={18} className="mt-1 text-vx-cyan" />{c.hoursLabel}: {c.hours}</p>
            <a href={CONTACT_HREFS.phone} className="inline-flex items-center gap-2 hover:text-vx-ink"><Phone size={18} className="text-vx-cyan" />{SITE.phone}</a>
            <a href={CONTACT_HREFS.email} className="inline-flex items-center gap-2 hover:text-vx-ink"><Mail size={18} className="text-vx-cyan" />{SITE.email}</a>
          </address>
          <p className="mt-6"><a href={SITE.social.googleBusiness} target="_blank" rel="noopener noreferrer" className="font-semibold text-vx-cyan hover:text-vx-ink">{es ? "Ver en Google Maps" : "View on Google Maps"}</a></p>
        </Container>
      </section>
      <section className="border-t border-vx-line py-16">
        <Container className="max-w-3xl">
          <h2 className="text-3xl font-semibold text-vx-ink">{c.faqHeading}</h2>
          <dl className="mt-6 space-y-5">{c.faq.map((f) => <div key={f.q} className="rounded-xl border border-vx-line bg-vx-bg2 p-6"><dt className="font-semibold text-vx-ink">{f.q}</dt><dd className="mt-3 leading-7 text-vx-muted">{f.a}</dd></div>)}</dl>
        </Container>
      </section>
    </PageShell>
  );
}
