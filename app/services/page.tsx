import { marketingSocial } from "@/lib/seo-metadata";
import { seoAlternates } from "@/lib/seo-routes";
import type { Metadata } from "next";
import ServicesHub from "@/components/marketing/ServicesHub";

export const metadata: Metadata = {
  title: "Services",
  description:
    "Explore VYNTEX website development, AI automation, CRM, chatbot, branding, and digital marketing services. Bilingual English and Spanish. Book a free 30-minute consultation to find the right package.",
  alternates: seoAlternates("/services"), openGraph: marketingSocial("/services", "Services", "Explore VYNTEX website development, AI automation, CRM, chatbot, branding, and digital marketing services. Bilingual English and Spanish."),
};

export default function Page() {
  return <ServicesHub />;
}
