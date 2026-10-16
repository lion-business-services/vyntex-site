import type { Metadata } from "next";
import { seoAlternates } from "@/lib/seo-routes";
import { marketingSocial } from "@/lib/seo-metadata";
import ResourcesHub from "@/components/resources/ResourcesHub";

const title = "Resources";
const description = "Practical guides on automation, CRM, websites and bilingual customer service for small businesses.";
export const metadata: Metadata = { title, description, alternates: seoAlternates("/resources"), openGraph: marketingSocial("/resources", title, description) };
export default function Page() { return <ResourcesHub lang="en" />; }
