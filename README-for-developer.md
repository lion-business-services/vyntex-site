# VYNTEX SEO / GEO / bilingual deployment — developer handoff

> Source: the updated **Next.js 15 + React 19 + TypeScript** App Router project, not a static HTML export. See `docs/DEPLOYMENT-AND-SEO-AUDIT.md` for implementation and limitations. Keep this file in the repository for maintenance.

## Files required by the owner's SEO kit

- `public/llms.txt` — served from `/llms.txt` at the canonical www host.
- `app/sitemap.ts` — real, published URLs, including the Spanish URLs and industry detail URLs; all bilingual entries have hreflang alternates. No hash-fragment sitemap entries. There is no `SPANISH_LIVE` switch because the routes are implemented and included.
- `app/vyntex-jsonld.tsx` — organization, professional services and website structured data without unconfirmed address, hours, social accounts, ratings or reviews; imported and rendered in `app/layout.tsx`.
- This file — maintainer instructions; original SEO-kit README retained at `docs/SEO-KIT-ORIGINAL-README.md`.

## Required quality gates

1. Node >=20, `npm ci`, then `npm run typecheck`, `npm run lint`, `npm test`, `npm run build`. **Important if updating an existing GitHub branch:** replace the project files and commit deletions too (in particular delete the former `app/loading.tsx`); GitHub web uploads alone do not automatically remove old files.
2. `node scripts/verify-seo.mjs` for structural SEO route checks.
3. Deploy to a Vercel **preview** first. Confirm APIs / authentication / checkout integrations with real staging secrets and test accounts before production promotion.
4. Add both `vyntexusa.com` and `www.vyntexusa.com` to the Vercel project; make **www** primary. Check apex returns a single permanent 308 redirect to www (configuration rule lives in `next.config.ts`). DNS / Vercel domain ownership cannot be changed by repository source code.
5. Test rendered page-source HTML for `/`, `/es`, `/services/ai-automation`, `/es/servicios/automatizacion-ia`, English and Spanish industry paths. Verify `<html lang>`, title, canonical, hreflang, visible language, structured data, links and forms. Test EN/ES switch on desktop/mobile, including back/forward.
6. Check `/sitemap.xml`, `/robots.txt`, `/llms.txt` on the **live www domain**; check canonical and x-default language links, and that no private route appears in sitemap.
7. Submit the verified sitemap in Google Search Console and Bing Webmaster Tools (separately, account access required). Run Google Rich Results Test and inspect Google Search Console indexing results (not a guaranteed rich-result or AI recommendation).
8. Secure written approval of 2–3 real case studies (Lion Business Services proposed) before replacing the `noindex` example page. See `docs/CASE-STUDIES-PUBLISHING.md`.

## Next steps

Do not claim the live site is validated until the production build and real-domain tests pass. The site retains the existing Supabase, APIs, payment, authentication, partner workflows and React interactions, but those integrations need environment-specific tests. Spanish marketing routes are implemented with original Spanish service and industry content; partner application, legal and authenticated portal remain on their existing URLs, as allowed by the supplied kit.
