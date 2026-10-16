import type { Metadata } from "next";
import { spanishAlternates } from "@/lib/seo-routes";
import { marketingSocial } from "@/lib/seo-metadata";
import ResourcesHub from "@/components/resources/ResourcesHub";

const title = "Recursos";
const description = "Guías prácticas sobre automatización, CRM, sitios web y atención bilingüe para pequeños negocios.";
export const metadata: Metadata = { title, description, alternates: spanishAlternates("/es/recursos"), openGraph: marketingSocial("/es/recursos", title, description, true) };
export default function Page() { return <ResourcesHub lang="es" />; }
