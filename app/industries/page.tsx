import { marketingSocial } from "@/lib/seo-metadata";
import { seoAlternates } from "@/lib/seo-routes";
import type { Metadata } from "next"; import IndustriesHub from "@/components/marketing/IndustriesHub";
export const metadata:Metadata={title:"Industries",description:"Digital solutions for professional services, home services, restaurants, retail, beauty, wellness, startups, and bilingual businesses.", alternates: seoAlternates("/industries"), openGraph: marketingSocial("/industries", "Industries", "Digital solutions for professional services, local services, restaurants, retail, beauty, wellness and startups.")}; export default function Page(){return <IndustriesHub/>}
