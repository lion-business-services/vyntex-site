import { existsSync, readFileSync } from "node:fs";
import path from "node:path";

const root = path.resolve(import.meta.dirname, "..");
const read = file => readFileSync(path.join(root, file), "utf8");
const exists = file => existsSync(path.join(root, file));
const errors = [];
const check = (ok, why) => { if (!ok) errors.push(why); };
const services = ["ai-automation", "ai-chatbots", "crm-systems", "web-development", "branding", "digital-marketing"];
const industries = ["professional-services", "home-services", "restaurants-retail", "beauty-wellness", "startups", "multilingual-businesses"];
const spanishSlugs = ["automatizacion-ia", "chatbots-ia", "sistemas-crm", "desarrollo-web", "branding", "marketing-digital"];

check(read("lib/site.ts").includes('url: "https://www.vyntexusa.com"'), "SITE canonical host is not www");
check(read("next.config.ts").includes('value: "vyntexusa.com"'), "Apex redirect is missing");
check(read("app/layout.tsx").includes("<VyntexJsonLd />"), "JSON-LD component not mounted");
check(read("app/layout.tsx").includes("lang={currentLanguage}"), "HTML document language is not set server-side");
check(read("middleware.ts").includes("x-vyntex-language"), "Locale request header missing");
check(read("app/sitemap.ts").includes("EN_TO_ES") && !read("app/sitemap.ts").includes('"/industries#'), "Sitemap has missing hreflang or fragment links");
check(read("app/robots.ts").includes("SITE.url"), "Robots does not use canonical SITE URL");
check(exists("public/llms.txt") && read("public/llms.txt").includes("# VYNTEX"), "LLMs summary missing");
check(read("lib/crawlers.ts").includes("OAI-SearchBot") && read("app/robots.ts").includes("SEARCH_CRAWLERS"), "Robots must name the search and AI-search crawlers");
check(read("lib/crawlers.ts").includes("AI_TRAINING_CRAWLERS_ALLOWED = true"), "AI training crawlers were approved by management on October 22, 2026 and must be allowed on public pages (lib/crawlers.ts)");
check(read("app/robots.ts").includes("disallow: privatePaths") && read("lib/crawlers.ts").includes('"/portal/"') && read("lib/crawlers.ts").includes('"/api/"'), "Private paths (/portal/, /api/) must stay closed to every crawler");
check(read("public/llms.txt").includes("https://erp.vyntexusa.com/demo") && read("public/llms.txt").includes("https://erp.vyntexusa.com/pricing"), "llms.txt must list the live demo and software pricing links");
check(read("public/llms.txt").includes("https://www.vyntexusa.com/contact?intent=demo") && read("docs/AI-SALES-AGENT-LINKS.md").includes("https://www.vyntexusa.com/contact?intent=demo"), "llms.txt and the AI sales agent sheet must send Book a Free Demo to the website demo form");
check(read("lib/site.ts").includes('intent: "demo"') && !read("lib/site.ts").includes("erpPath: ERP.paths.requestDemo"), "Book a Free Demo must open the website demo form (lib/site.ts DEMO_BOOKING)");
check(read("components/BookConsultation.tsx").includes("openDemoRequest") && read("app/api/consultation/route.ts").includes("demoRequestSchema"), "The demo form must use the consultation pipeline (modal + /api/consultation)");
check(read("components/home/ConnectedHero.tsx").includes("cta-try-demo") && read("components/home/ConnectedHero.tsx").includes("cta-software-pricing") && read("components/home/ConnectedHero.tsx").includes("cta-book-demo"), "Homepage must show Try Live Demo, View Software & Pricing and Book a Free Demo");
check(!read("app/vyntex-jsonld.tsx").includes("TODO"), "JSON-LD has unresolved TODO");
check(!exists("app/loading.tsx"), "Root loading overlay has not been removed");
for (const [en, es] of [
  ["services", "servicios"], ["industries", "industrias"], ["about", "nosotros"],
  ["contact", "contacto"], ["partners", "socios"],
]) {
  check(exists(`app/${en}/page.tsx`), `English route missing: /${en}`);
  check(exists(`app/es/${es}/page.tsx`), `Spanish route missing: /es/${es}`);
}
check(exists("app/es/page.tsx"), "Spanish homepage missing");
check(exists("app/services/[slug]/page.tsx") && exists("app/es/servicios/[slug]/page.tsx"), "Bilingual service dynamic routes missing");
check(exists("app/industries/[slug]/page.tsx") && exists("app/es/industrias/[slug]/page.tsx"), "Bilingual industry detail routes missing");
for (const slug of [...services, ...industries]) {
  check(read("lib/seo-routes.ts").includes(`/services/${slug}`) || read("lib/seo-routes.ts").includes(`"${slug}"`), `Route map missing ${slug}`);
}
for (const slug of spanishSlugs) check(read("lib/seo-routes.ts").includes(`/es/servicios/${slug}`), `Missing Spanish path for ${slug}`);
const spanish = read("lib/spanish-marketing.ts");
for (const slug of services) check(spanish.includes(`"${slug}": {`) || spanish.includes(`${slug}: {`), `Spanish content missing ${slug}`);
check(read("app/case-studies/page.tsx").includes("index: false"), "Unapproved client examples must be noindex");
check(read("package.json").includes('"next"') && exists("app/api/contact/route.ts"), "Next.js app or dynamic API routes missing");
console.log(`VYNTEX structural SEO audit: ${errors.length === 0 ? "PASS" : "FAIL"}; ${services.length} bilingual service routes, ${industries.length} bilingual industry routes.`);
if (errors.length) { errors.forEach(e => console.error("- " + e)); process.exitCode = 1; }
