import { marketingSocial } from "@/lib/seo-metadata";
import type { Metadata } from "next";
import { spanishAlternates } from "@/lib/seo-routes";
import PartnersPage from "@/components/marketing/PartnersPage";
export const metadata: Metadata = {title: "Programa de revendedores autorizados",description: "Conoce el programa de socios de VYNTEX. Ofrece soluciones digitales a tus clientes mientras VYNTEX se encarga de los servicios técnicos aprobados.",alternates: spanishAlternates("/es/socios"),openGraph:marketingSocial("/es/socios", "Programa de revendedores autorizados", "Ofrece servicios digitales con el programa de socios de VYNTEX.", true)};
export default function Page(){return <PartnersPage/>;}
