# vyntexusa.com — SEO / AI-visibility kit

Stack: Next.js (App Router) on Vercel. Server rendering is already working — these are the remaining fixes.

## Files in this kit

| File | Where it goes |
|---|---|
| `public/llms.txt` | `public/llms.txt` → served at /llms.txt (currently 404) |
| `app/sitemap.ts` | replace the current sitemap source (removes `/industries#...` entries; ready for Spanish alternates) |
| `app/vyntex-jsonld.tsx` | replace the current JSON-LD; render `<VyntexJsonLd />` in `app/layout.tsx`; fill TODOs |

## Fixes (priority order)

1. **One domain.** Site serves at `www.vyntexusa.com` but canonical, sitemap, robots `Host` and JSON-LD use `vyntexusa.com`. Pick **www** (recommended, already serving): in Vercel → Domains, set `www.vyntexusa.com` as primary and 308-redirect the apex to it. Then set `metadataBase: new URL('https://www.vyntexusa.com')` in `app/layout.tsx` and update robots.txt `Host` + `Sitemap` lines.

2. **Spanish as real URLs.** The EN/ES toggle swaps text client-side, and both `hreflang` tags point to the same URL, so Google only indexes English. Build `/es/...` routes (e.g. `app/[locale]/...` with next-intl, or a parallel `app/es/...` tree) using the paths in `app/sitemap.ts`. On every page:
   ```ts
   export const metadata = {
     alternates: {
       canonical: '/services/ai-automation',
       languages: { 'en-US': '/services/ai-automation', 'es-US': '/es/servicios/automatizacion-ia', 'x-default': '/services/ai-automation' },
     },
   }
   ```
   Make the ES button link to the matching `/es` URL. Then set `SPANISH_LIVE = true` in `sitemap.ts`.

3. **Duplicate brand in titles** ("AI Automation | VYNTEX | VYNTEX"). In `app/layout.tsx` use `title: { default: 'VYNTEX | Connected Business Systems', template: '%s | VYNTEX' }` and remove "| VYNTEX" from each page's own title.

4. **Industries as pages.** Turn `/industries#beauty-wellness` etc. into `/industries/beauty-wellness`, `/industries/professional-services`, `/industries/home-services`, `/industries/restaurants-retail`, `/industries/startups`, `/industries/multilingual-businesses`, and add them to `sitemap.ts`.

5. **Alt text** on the 3 homepage images that have none.

6. **Case studies**: add `/case-studies` with 2–3 client stories (problem → system built → result). Lion Business Services can be the first.

7. **Loading overlay**: the server HTML starts with "Loading · Cargando". Make sure it doesn't hide content from crawlers or delay Largest Contentful Paint; remove it from the server render if possible.

## After deploying

- Submit the sitemap in Google Search Console and Bing Webmaster Tools (for the www property).
- Test with Google Rich Results Test and `curl -s https://www.vyntexusa.com/llms.txt`.
