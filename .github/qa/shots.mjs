import { chromium } from 'playwright';
import sharp from 'sharp';
import fs from 'node:fs';
const OUT = '/tmp/shots/'; fs.mkdirSync(OUT, { recursive: true });
const BASE = 'http://localhost:3000';
const axeSrc = fs.readFileSync(new URL('./node_modules/axe-core/axe.min.js', import.meta.url), 'utf8');
const b = await chromium.launch();
async function page(theme, w, h, path = '/') {
  const ctx = await b.newContext({ viewport: { width: w, height: h }, deviceScaleFactor: w < 500 ? 2 : 1 });
  await ctx.addInitScript((t) => { try { localStorage.setItem('vx-theme', t); } catch {} }, theme);
  const p = await ctx.newPage();
  const errs = []; p.on('pageerror', (e) => errs.push(e.message));
  await p.goto(BASE + path, { waitUntil: 'networkidle' });
  await p.waitForTimeout(900);
  return { ctx, p, errs };
}
const save = async (buf, name, width, q = 72) => sharp(buf).resize({ width, withoutEnlargement: true }).jpeg({ quality: q, mozjpeg: true }).toFile(OUT + name + '.jpg');
for (const theme of ['light', 'dark']) {
  for (const [w, h] of [[1440, 900], [390, 844]]) {
    const { ctx, p, errs } = await page(theme, w, h);
    await save(await p.screenshot(), `home-top-${theme}-${w}`, w < 500 ? 780 : 1440, 78);
    if (w > 500) await save(await p.screenshot({ clip: { x: 0, y: 0, width: 720, height: 90 } }), `header-${theme}`, 1440, 85);
    for (let y = 0; y < 16000; y += 500) { await p.evaluate((yy) => window.scrollTo(0, yy), y); await p.waitForTimeout(80); }
    await p.waitForTimeout(1200);
    const erp = await p.$('#vyntex-erp');
    if (erp) { await erp.scrollIntoViewIfNeeded(); await p.waitForTimeout(1500); await save(await erp.screenshot(), `erp-${theme}-${w}`, w < 500 ? 780 : 1440, 75); }
    await p.evaluate(() => window.scrollTo(0, 0)); await p.waitForTimeout(400);
    await save(await p.screenshot({ fullPage: true }), `home-full-${theme}-${w}`, w < 500 ? 390 : 900, 62);
    // sections one by one for close review on desktop
    if (w > 500) {
      const secs = await p.$$('main > section, main section[id], footer');
      let i = 0;
      for (const s of secs.slice(0, 14)) { const bb = await s.boundingBox(); if (!bb || bb.height < 80) continue; await s.scrollIntoViewIfNeeded(); await p.waitForTimeout(500); await save(await s.screenshot(), `sec-${theme}-${String(i++).padStart(2, '0')}`, 1100, 70); }
    }
    await p.addScriptTag({ content: axeSrc });
    const r = await p.evaluate(async () => { const res = await window.axe.run(document, { runOnly: ['color-contrast'] }); return { n: res.violations.reduce((a, v) => a + v.nodes.length, 0), ex: res.violations.flatMap(v => v.nodes.slice(0, 6).map(n => n.target.join(' ').slice(0, 60) + ' | ' + (n.any[0]?.message || '').slice(0, 90))), ox: document.documentElement.scrollWidth - innerWidth }; });
    console.log(`${theme} ${w}: contrast=${r.n} overflowX=${r.ox} errors=${errs.length} ${errs.join(' | ')}`); r.ex.forEach(e => console.log('   ' + e));
    await ctx.close();
  }
  for (const path of ['/services', '/about', '/contact']) {
    const { ctx, p } = await page(theme, 1440, 900, path);
    await save(await p.screenshot({ fullPage: true }), `page-${path.slice(1)}-${theme}`, 900, 60);
    await ctx.close();
  }
}
// toggle mid-transition frame
{ const { ctx, p } = await page('light', 1440, 900); await p.click('header .vx-theme-toggle >> visible=true'); await p.waitForTimeout(300); await save(await p.screenshot(), 'toggle-mid', 1440, 70); await ctx.close(); }
{ const { ctx, p } = await page('light', 390, 844); await p.click('button[aria-controls="mobile-drawer"]'); await p.waitForTimeout(500); await save(await p.screenshot(), 'drawer-light', 780, 75); await ctx.close(); }
await b.close();
