import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ARTICLES, getArticle } from "@/lib/articles";
import { seoAlternates } from "@/lib/seo-routes";
import { marketingSocial } from "@/lib/seo-metadata";
import ArticleView from "@/components/resources/ArticleView";

export const dynamicParams = false;
export function generateStaticParams() { return ARTICLES.map(a => ({ slug: a.en.slug })); }

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const found = getArticle("en", slug);
  if (!found) return {};
  const path = `/resources/${slug}`;
  const og = marketingSocial(path, found.copy.title, found.copy.description);
  return { title: found.copy.title, description: found.copy.description, alternates: seoAlternates(path),
    openGraph: { ...og, type: "article", publishedTime: found.article.published, modifiedTime: found.article.updated } };
}

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const found = getArticle("en", slug);
  if (!found) notFound();
  return <ArticleView article={found.article} copy={found.copy} lang="en" />;
}
