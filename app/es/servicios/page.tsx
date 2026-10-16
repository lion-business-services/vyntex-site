import { marketingSocial } from "@/lib/seo-metadata";
import type { Metadata } from "next";
import { spanishAlternates } from "@/lib/seo-routes";
import ServicesHub from "@/components/marketing/ServicesHub";
export const metadata: Metadata = {title: "Servicios tecnológicos", description: "Conozca nuestros servicios de desarrollo web, CRM, automatización con IA, chatbots, marca y marketing digital para empresas bilingües.", alternates: spanishAlternates("/es/servicios"), openGraph: marketingSocial("/es/servicios", "Servicios tecnológicos", "Desarrollo web, CRM, automatización con IA, chatbots, marca y marketing digital.", true)};
export default function Page(){return <ServicesHub/>;}
