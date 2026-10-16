# VYNTEX website — SEO, AI-search visibility and bilingual implementation audit

**Release date:** October 16, 2026  
**Source:** latest attached GitHub archive `vyntex-site-main (1)(2).zip` and attached SEO kit `vyntex-seo-kit(1).zip`.  
**Stack:** Next.js 15 App Router, React 19, TypeScript, server/client components, dynamic API routes, Supabase authentication, partner portal, payments/webhooks. **This is not a static HTML export.**

## Implemented in this ZIP

| Requirement | Files / behavior |
|---|---|
| www canonical host | `lib/site.ts`, `app/layout.tsx`, `app/robots.ts`, `app/sitemap.ts`, `next.config.ts` host-conditional, permanent apex redirect. **Vercel domain assignment still required.** |
| Title suffix correction | Root title template and English/Spanish marketing pages. No double `| VYNTEX` suffix on modified pages. |
| Kit `llms.txt` | `public/llms.txt`, directly copied from owner-supplied kit (both languages). `/llms.txt` resolves when Next.js is deployed. |
| Kit JSON-LD | `app/vyntex-jsonld.tsx` included in `app/layout.tsx`. Uses owner-supplied Vyntex LLC and founder information; logo points to existing 1092×1092 square asset. Includes business area, languages, services, organization and website, and excludes all `TODO` values, unverified street address, opening hours, social URLs and ratings. `lib/page-schema.tsx` adds contextual Service/WebPage + Breadcrumb schema to detail pages. |
| Kit sitemap | New `app/sitemap.ts`; one-to-one EN/ES alternates, x-default, 6 service-detail pairs and 6 industry-detail pairs; no fragments or invented modification timestamps. No Spanish feature flag needed: Spanish paths are real Next.js routes. |
| Spanish pages with real URLs | `/es`, `/es/servicios`, `/es/servicios/{automatizacion-ia,chatbots-ia,sistemas-crm,desarrollo-web,branding,marketing-digital}`, `/es/industrias`, 6 `/es/industrias/<slug>`, `/es/nosotros`, `/es/contacto`, `/es/socios`. **18 Spanish marketing URLs.** The 6 Spanish service descriptions, benefit lists, FAQs, process steps, deliverables and industries are authored in Spanish in `lib/spanish-marketing.ts` instead of borrowing English arrays. |
| SEO-correct language toggle | `context/LanguageContext.tsx`, `components/ui/LanguageToggle.tsx`, `lib/seo-routes.ts`: language choice navigates to equivalent public URL; server uses URL-based language, sets `<html lang="es">` for Spanish URLs, and SSR renders Spanish. `middleware.ts` preserves session processing on protected/account/API routes, avoids server-side Supabase requests on public marketing pages, and forwards route locale to root layout. Client navigation keeps the document language synchronized. |
| Industry detail pages | 6 English + 6 Spanish routes, each with challenges, potential solutions, internal service links, metadata, breadcrumbs and contact CTA. |
| Images and accessibility | Inspected homepage and shared navigation/footer `<Image>` elements. Added short descriptive alt text to the three images previously carrying `alt=""` (nav logo, footer logo, ERP dark-mode screenshot). Retained `aria-hidden` for duplicated/decorative renderings so screen readers are not forced to hear duplicate brand or dashboard information. The primary ERP preview already has a useful translated `shotAlt`. |
| Loading/crawl visibility | Removed root `app/loading.tsx` skeleton / “Loading · Cargando” output and site-wide client opacity gate in `app/template.tsx`; intentional animations inside interactive sections remain. |
| Case studies | Added `/case-studies` with three clearly described *illustrative solution workflows*, **not fabricated client stories**. Page is `noindex` and excluded from sitemap until real client details and consent are confirmed; owner action described in `docs/CASE-STUDIES-PUBLISHING.md`. |
| Existing application | All existing dynamic backend paths, checkout/partner resources, portal files, authentication flows, Supabase, integrations and component structure remain in the source. No static export or business workflow deletion. |

## Verification performed in this workspace

- TypeScript/TSX parser inspected **207** source files with **0 syntax errors**.
- Internal local import resolver inspected **590** imports with **0 missing targets**.
- Sitemap runtime smoke check **passed**: **41 real sitemap entries** with **18 reciprocal English/Spanish alternate pairs**, covering six service and six industry pairs.
- `node scripts/verify-seo.mjs` **passed** structural assertions for www domain, route and language mapping, sitemap, robots, JSON-LD, loading removal, llms.txt, dynamic API preservation and representative content.
- Existing public OG image confirmed 1200×630; brand-logo image confirmed 1092×1092 square.
- `npm ci` was attempted but **did not finish**, so **a production `next build`, TypeScript semantic typecheck, ESLint, unit tests, Playwright E2E and runtime/SEO validation remain unverified.** Syntax checks are **not** a substitute for a successful build. Re-run all checks after dependency installation with network access.

## Must do before publishing to the production domain

1. Extract ZIP contents into the repository root. Set Node 20+ and run `npm ci` and `npm run verify:seo`, `npm run typecheck`, `npm run lint`, `npm run test`, `npm run build`. Resolve any output before promoting the deployment.
2. On Vercel, configure the production domain pair: **www.vyntexusa.com** primary and **vyntexusa.com** redirected (the app's permanent host redirect is included). Verify both DNS and SSL, and check `/about?foo=bar` on apex redirects to the same path/query under www with a 308, not a loop.
3. Supply the existing required environment variables and validate all auth, portal, email, partner, checkout, billing, signed agreements, webhooks, forms and cron jobs in a staging/preview environment. **Do not overwrite production secrets with `.env.example` values.** Review Supabase redirect allow-lists and API webhook provider URLs.
4. Using a non-authenticated browser/curl, inspect **rendered** homepage and Spanish homepage source for HTML `lang`, H1, titles, canonical, hreflang, actual Spanish text, page-specific OG links, indexing robots, JSON-LD, internal links, keyboard navigation and mobile views. Test service/industry detail pages and language switching in both directions (including browser back/forward).
5. Check the deployed `/sitemap.xml`, `/robots.txt`, `/llms.txt`. Feed **https://www.vyntexusa.com/sitemap.xml** to Google Search Console and Bing Webmaster Tools for the verified www property; test sample URLs using live Rich Results Test / URL Inspection.
6. Add *actual* approved client case studies and evidence; publish after client permission, then remove noindex and add them to the sitemap. Do **not** advertise unverified awards, conversion percentages, reviews, or guarantees.
7. Monitor Search Console index coverage and Core Web Vitals after deployment. Review language-specific form submission and lead routing for conversion and data integrity.

## Outstanding non-code / future work

- **Unverified client stories:** Lion Business Services and two other consenting customers need scope, examples, dates, screenshots, evidence, and approval. No claims can responsibly be invented.
- **Environment-level verification:** domain redirect behavior, SSL, Google/Bing submissions, Rich Results Test, render metrics and real third-party integrations require deployed environment/account access. They cannot be completed by a ZIP alone.
- **Spanish review:** 18 server-rendered Spanish marketing routes are implemented; a native Spanish-speaking reviewer should proofread terminology and the entire lead capture journey. Partner application, legal pages and private/authenticated portal retain their original routes by design (kit maps these as not localized). Typical follow-up for native-language QA, translated transactional flows where authorized, and full cross-device regression: **3–5 working days after approved copy and staging access** (estimate, not a scheduled delivery).
- **AI assistant discovery:** `llms.txt`, structured data, useful public content and canonical/hreflang can support discovery and interpretation. They **do not guarantee** any AI tool reads `llms.txt`, cites VYNTEX or recommends it; measurable outcomes need monitoring.

**Release status:** Source-level SEO and localization enhancements completed and structurally checked; **release candidate, not certified production-ready** pending dependency-based build and live environment verification.
