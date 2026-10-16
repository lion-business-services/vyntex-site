import { marketingSocial } from "@/lib/seo-metadata";
import { seoAlternates } from "@/lib/seo-routes";
import type {Metadata} from "next";import AboutPage from "@/components/marketing/AboutPage";export const metadata:Metadata={title:"About Us",description:"Learn how VYNTEX approaches websites, automation, CRM, branding, and digital technology for growing businesses.", alternates: seoAlternates("/about"), openGraph: marketingSocial("/about", "About Us", "How VYNTEX designs websites, automations, CRM and connected business systems.")};export default function Page(){return <AboutPage/>}
