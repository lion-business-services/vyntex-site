import type { Metadata } from "next";
import { seoAlternates } from "@/lib/seo-routes";
import { marketingSocial } from "@/lib/seo-metadata";
import { NJ_COPY } from "@/lib/local-nj";
import NewJerseyPage from "@/components/local/NewJerseyPage";

const c = NJ_COPY.en;
export const metadata: Metadata = { title: c.metaTitle, description: c.description, alternates: seoAlternates(c.path), openGraph: marketingSocial(c.path, c.metaTitle, c.description) };
export default function Page() { return <NewJerseyPage lang="en" />; }
