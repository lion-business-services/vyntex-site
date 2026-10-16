import { marketingSocial } from "@/lib/seo-metadata";
import { seoAlternates } from "@/lib/seo-routes";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import ServiceDetail from "@/components/marketing/ServiceDetail";
import { PageSchema } from "@/lib/page-schema";
import { getService, serviceSlugs } from "@/lib/marketing-content";

export function generateStaticParams() {
  return serviceSlugs.map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const service = getService("en", slug);
  return service
    ? {
        title: service.shortTitle,
        description: service.summary,
        alternates: seoAlternates(`/services/${slug}`),
        openGraph: marketingSocial(`/services/${slug}`, service.shortTitle, service.summary),
      }
    : {};
}

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  if (!getService("en", slug)) notFound();
  const service = getService("en", slug)!;
  return <><PageSchema path={`/services/${slug}`} name={service.title} description={service.summary} parentPath="/services" parentName="Services"/><ServiceDetail slug={slug} /></>;
}
