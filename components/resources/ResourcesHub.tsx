import Link from "next/link";
import { ARTICLES } from "@/lib/articles";
import PageShell from "@/components/marketing/PageShell";
import MarketingHero from "@/components/marketing/MarketingHero";
import Container from "@/components/ui/Container";

export default function ResourcesHub({ lang }: { lang: "en" | "es" }) {
  const es = lang === "es";
  return (
    <PageShell>
      <MarketingHero
        eyebrow={es ? "Recursos" : "Resources"}
        title={es ? "Guías prácticas para conectar su negocio" : "Practical guides to running a connected business"}
        description={es
          ? "Explicaciones claras sobre automatización, CRM, sitios web y atención bilingüe para pequeños negocios."
          : "Clear explanations of automation, CRM, websites and bilingual customer service for small businesses."}
        primaryHref={es ? "/es/contacto" : "/contact"}
        primaryLabel={es ? "Agende una consulta gratuita" : "Book a Free Consultation"}
      />
      <section className="py-20">
        <Container className="grid gap-6 md:grid-cols-2">
          {ARTICLES.map(a => {
            const c = a[lang];
            return (
              <article key={a.id} className="rounded-2xl border border-[rgba(14,165,233,.14)] bg-vx-bg2 p-7">
                <h2 className="text-2xl font-semibold text-vx-ink">
                  <Link href={es ? `/es/recursos/${c.slug}` : `/resources/${c.slug}`} className="hover:text-vx-cyan">{c.title}</Link>
                </h2>
                <p className="mt-4 leading-7 text-vx-muted">{c.description}</p>
              </article>
            );
          })}
        </Container>
      </section>
    </PageShell>
  );
}
