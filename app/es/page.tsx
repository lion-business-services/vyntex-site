import type { Metadata } from "next";
import { spanishAlternates } from "@/lib/seo-routes";
import Nav from "@/components/Nav";
import HomeExperience from "@/components/home/HomeExperience";
import Footer from "@/components/Footer";
import BookConsultation from "@/components/BookConsultation";
import Chatbot from "@/components/Chatbot";
import { marketingSocial } from "@/lib/seo-metadata";
export const metadata: Metadata = {
  title: "Tecnología y sistemas conectados para negocios",
  description: "Sitios web, automatización con IA, sistemas CRM, asistentes digitales, branding y marketing para negocios en Estados Unidos. Atención en español e inglés.",
  alternates: spanishAlternates("/es"), openGraph: marketingSocial("/es", "Tecnología y sistemas conectados para negocios", "Sitios web, automatización, CRM y marketing en español.", true),
};
export default function Page() { return <><Nav/><main id="main-content"><HomeExperience/></main><Footer showCta={false}/><BookConsultation/><Chatbot/></>; }
