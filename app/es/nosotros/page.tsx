import { marketingSocial } from "@/lib/seo-metadata";
import type { Metadata } from "next";
import { spanishAlternates } from "@/lib/seo-routes";
import AboutPage from "@/components/marketing/AboutPage";
export const metadata: Metadata = {title: "Sobre nosotros",description: "Conozca a VYNTEX, empresa de tecnología en Northfield, Nueva Jersey, que ayuda a negocios a conectar sitios web, CRM y automatizaciones.",alternates: spanishAlternates("/es/nosotros"),openGraph:marketingSocial("/es/nosotros", "Sobre nosotros", "Empresa tecnológica bilingüe en Northfield, Nueva Jersey.", true)};
export default function Page(){return <AboutPage/>;}
