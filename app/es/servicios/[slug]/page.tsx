import { marketingSocial } from "@/lib/seo-metadata";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getService } from "@/lib/marketing-content";
import { spanishAlternates, ES_TO_EN } from "@/lib/seo-routes";
import { PageSchema } from "@/lib/page-schema";
import ServiceDetail from "@/components/marketing/ServiceDetail";
const paths = Object.keys(ES_TO_EN).filter(x=>x.startsWith("/es/servicios/"));
export const dynamicParams = false;
export function generateStaticParams(){return paths.map(x=>({slug:x.split("/").at(-1)!}));}
export async function generateMetadata({params}:{params:Promise<{slug:string}>}):Promise<Metadata>{
 const {slug}=await params;const path=`/es/servicios/${slug}`;const en=ES_TO_EN[path];
 const service=en?getService("es",en.split("/").at(-1)!):null;
 return service?{title:service.shortTitle,description:service.summary,alternates:spanishAlternates(path),openGraph:marketingSocial(path,service.shortTitle,service.summary,true)}:{};
}
export default async function Page({params}:{params:Promise<{slug:string}>}){
 const {slug}=await params;const path=`/es/servicios/${slug}`;const en=ES_TO_EN[path];
 const service=en?getService("es",en.split("/").at(-1)!):null;
 if(!service)notFound();
 return <><PageSchema path={path} name={service.title} description={service.summary} parentPath="/es/servicios" parentName="Servicios"/><ServiceDetail slug={service.slug}/></>;
}
