import { marketingSocial } from "@/lib/seo-metadata";
import type { Metadata } from "next";
import { spanishAlternates } from "@/lib/seo-routes";
import ContactPage from "@/components/marketing/ContactPage";
export const metadata: Metadata = {title: "Contacto y consulta gratuita",description: "Hable con VYNTEX en español sobre su sitio web, CRM, automatización con IA o marketing digital. Solicite una consulta inicial.",alternates: spanishAlternates("/es/contacto"),openGraph:marketingSocial("/es/contacto", "Contacto y consulta gratuita", "Hable con VYNTEX en español sobre su proyecto.", true)};
export default function Page(){return <ContactPage/>;}
