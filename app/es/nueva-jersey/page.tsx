import type { Metadata } from "next";
import { spanishAlternates } from "@/lib/seo-routes";
import { marketingSocial } from "@/lib/seo-metadata";
import { NJ_COPY } from "@/lib/local-nj";
import NewJerseyPage from "@/components/local/NewJerseyPage";

const c = NJ_COPY.es;
export const metadata: Metadata = { title: c.metaTitle, description: c.description, alternates: spanishAlternates(c.path), openGraph: marketingSocial(c.path, c.metaTitle, c.description, true) };
export default function Page() { return <NewJerseyPage lang="es" />; }
