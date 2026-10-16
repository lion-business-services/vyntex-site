import { marketingSocial } from "@/lib/seo-metadata";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getService, industriesByLang } from "@/lib/marketing-content";
import { seoAlternates, INDUSTRY_SLUGS } from "@/lib/seo-routes";
import { PageSchema } from "@/lib/page-schema";
import PageShell from "@/components/marketing/PageShell";
import MarketingHero from "@/components/marketing/MarketingHero";
import Container from "@/components/ui/Container";

export const dynamicParams = false;
export function generateStaticParams() { return INDUSTRY_SLUGS.map(slug => ({ slug })); }
export async function generateMetadata({ params }: {params: Promise<{slug: string}>}): Promise<Metadata> {
  const {slug} = await params;
  const industry = industriesByLang.en.find(i => i.slug === slug);
  if (!industry) return {};
  return { title: `${industry.title} Solutions`, description: industry.summary, alternates: seoAlternates(`/industries/${slug}`), openGraph: marketingSocial(`/industries/${slug}`, industry.title, industry.summary) };
}
export default async function IndustryDetail({ params }: {params: Promise<{slug: string}>}) {
  const {slug} = await params;
  const industry = industriesByLang.en.find(i => i.slug === slug);
  if (!industry) notFound();
  return <PageShell>
    <PageSchema path={`/industries/${slug}`} name={industry.title} description={industry.summary} kind="WebPage" parentPath="/industries" parentName="Industries" />
    <MarketingHero eyebrow="Solutions by industry" title={`${industry.title}: Connected Digital Solutions`} description={industry.summary} primaryHref="/contact" primaryLabel="Discuss Your Business" secondaryHref="/industries" secondaryLabel="All Industries" />
    <section className="py-20"><Container className="grid gap-10 lg:grid-cols-2"><div><h2 className="text-3xl font-semibold">Common challenges</h2><ul className="mt-6 space-y-4">{industry.challenges.map(x=><li key={x} className="rounded-xl border border-vx-line bg-vx-bg2 p-5 text-vx-silver">{x}</li>)}</ul></div><div><h2 className="text-3xl font-semibold">Systems we can help you build</h2><ul className="mt-6 space-y-4">{industry.solutions.map(x=><li key={x} className="rounded-xl border border-vx-line bg-vx-bg2 p-5 text-vx-silver">{x}</li>)}</ul></div></Container></section>
    <section className="border-t border-vx-line py-20"><Container><h2 className="text-3xl font-semibold">Recommended services</h2><div className="mt-8 grid gap-5 md:grid-cols-3">{industry.recommended.map(slug=>{const service=getService("en",slug);return service?<Link key={slug} href={`/services/${slug}`} className="rounded-xl border border-vx-line bg-vx-bg2 p-6 hover:border-vx-blue"><h3 className="text-xl font-semibold text-vx-cyan">{service.shortTitle}</h3><p className="mt-3 text-sm leading-7 text-vx-muted">{service.summary}</p></Link>:null})}</div><p className="mt-9 text-vx-muted">Every project is tailored to your workflow, existing tools and approved scope.</p></Container></section>
  </PageShell>;
}
