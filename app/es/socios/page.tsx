import { marketingSocial } from "@/lib/seo-metadata";
import type { Metadata } from "next";
import { spanishAlternates } from "@/lib/seo-routes";
import PartnersPage from "@/components/marketing/PartnersPage";
export const metadata: Metadata = {title: "Programa de revendedores autorizados",description: "Conozca el programa de socios de VYNTEX. Ofrezca soluciones digitales a sus clientes mientras VYNTEX desarrolla los servicios técnicos aprobados.",alternates: spanishAlternates("/es/socios"),openGraph:marketingSocial("/es/socios", "Programa de revendedores autorizados", "Ofrezca servicios digitales a través del programa de socios de VYNTEX.", true)};
export default function Page(){return <PartnersPage/>;}
