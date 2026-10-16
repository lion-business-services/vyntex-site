import { marketingSocial } from "@/lib/seo-metadata";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getService, industriesByLang } from "@/lib/marketing-content";
import { spanishAlternates, localizedPath, INDUSTRY_SLUGS, ES_INDUSTRY_SLUGS, industrySlugFromSpanish } from "@/lib/seo-routes";
import { PageSchema } from "@/lib/page-schema";
import PageShell from "@/components/marketing/PageShell";
import MarketingHero from "@/components/marketing/MarketingHero";
import Container from "@/components/ui/Container";

export const dynamicParams = false;
export function generateStaticParams() { return INDUSTRY_SLUGS.map(en => ({ slug: ES_INDUSTRY_SLUGS[en] })); }
export async function generateMetadata({ params }: {params: Promise<{slug: string}>}): Promise<Metadata> {
  const {slug} = await params;
  const enSlug = industrySlugFromSpanish(slug);
  const industry = industriesByLang.es.find(i => i.slug === enSlug);
  if (!industry) return {};
  return { title: `Soluciones para ${industry.title}`, description: industry.summary, alternates: spanishAlternates(`/es/industrias/${slug}`), openGraph: marketingSocial(`/es/industrias/${slug}`, industry.title, industry.summary, true) };
}
export default async function IndustryDetailEs({ params }: {params: Promise<{slug: string}>}) {
  const {slug} = await params;
  const enSlug = industrySlugFromSpanish(slug);
  const industry = industriesByLang.es.find(i => i.slug === enSlug);
  if (!industry) notFound();
  return <PageShell>
    <PageSchema path={`/es/industrias/${slug}`} name={industry.title} description={industry.summary} kind="WebPage" parentPath="/es/industrias" parentName="Industrias" />
    <MarketingHero eyebrow="Soluciones por industria" title={`Soluciones digitales para ${industry.title.toLowerCase()}`} description={industry.summary} primaryHref="/es/contacto" primaryLabel="Hablemos de su negocio" secondaryHref="/es/industrias" secondaryLabel="Todas las industrias" />
    <section className="py-20"><Container className="grid gap-10 lg:grid-cols-2"><div><h2 className="text-3xl font-semibold">Desafíos habituales</h2><ul className="mt-6 space-y-4">{industry.challenges.map(x=><li key={x} className="rounded-xl border border-vx-line bg-vx-bg2 p-5 text-vx-silver">{x}</li>)}</ul></div><div><h2 className="text-3xl font-semibold">Soluciones que podemos crear</h2><ul className="mt-6 space-y-4">{industry.solutions.map(x=><li key={x} className="rounded-xl border border-vx-line bg-vx-bg2 p-5 text-vx-silver">{x}</li>)}</ul></div></Container></section>
    <section className="border-t border-vx-line py-20"><Container><h2 className="text-3xl font-semibold">Servicios recomendados</h2><div className="mt-8 grid gap-5 md:grid-cols-3">{industry.recommended.map(slug=>{const service=getService("es",slug);return service?<Link key={slug} href={localizedPath(`/services/${slug}`,"es")} className="rounded-xl border border-vx-line bg-vx-bg2 p-6 hover:border-vx-blue"><h3 className="text-xl font-semibold text-vx-cyan">{service.shortTitle}</h3><p className="mt-3 text-sm leading-7 text-vx-muted">{service.summary}</p></Link>:null})}</div><p className="mt-9 text-vx-muted">Adaptamos cada proyecto a sus procesos, herramientas y alcance aprobado.</p></Container></section>
  </PageShell>;
}
