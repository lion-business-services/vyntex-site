import { marketingSocial } from "@/lib/seo-metadata";
import type { Metadata } from "next";
import { spanishAlternates } from "@/lib/seo-routes";
import IndustriesHub from "@/components/marketing/IndustriesHub";
export const metadata: Metadata = {title: "Industrias que atendemos",description: "Soluciones de tecnología para servicios profesionales, negocios locales, restaurantes, belleza, empresas nuevas y negocios bilingües.",alternates: spanishAlternates("/es/industrias"),openGraph:marketingSocial("/es/industrias", "Industrias que atendemos", "Soluciones tecnológicas para negocios locales, servicios profesionales y empresas bilingües.", true)};
export default function Page(){return <IndustriesHub/>;}
