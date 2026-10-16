import { marketingSocial } from "@/lib/seo-metadata";
import { seoAlternates } from "@/lib/seo-routes";
import type{Metadata}from"next";import ContactPage from"@/components/marketing/ContactPage";export const metadata:Metadata={title:"Contact",description:"Contact VYNTEX to discuss website development, AI automation, CRM, branding, or digital marketing.", alternates: seoAlternates("/contact"), openGraph: marketingSocial("/contact", "Contact", "Contact VYNTEX for web development, CRM, AI automation, branding or digital marketing.")};export default function Page(){return <ContactPage/>}
