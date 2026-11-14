// Draws a 1200x630 share image for every page into public/og/<key>.png and
// records each key with a short hash of its picture in src/seo/og-keys.json.
// src/seo/meta.js reads that to decide between a page's own card and the
// default og-image.png, and puts the hash in the image URL: LinkedIn and other
// sites cache a share image by its URL, so a redrawn card needs a new one.
//
// Needs a local Chrome, so it runs on this machine (`npm run seo`) and the
// images are committed; the build on Vercel does not draw them. Re-run after
// adding or renaming pages, reviews, or essays, or changing a title.
import { createHash } from 'node:crypto';
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { ROOT, loadSeo, launchBrowser, escapeHtml } from './seo/common.mjs';

const OUT_DIR = join(ROOT, 'public/og');
const TEMPLATE = readFileSync(join(ROOT, 'scripts/og-template.html'), 'utf8');
const started = Date.now();

/* The dev server resolves /src/... image imports and /fonts/...; the card
   itself is served from a tiny middleware in front of it. */
const cards = new Map();
const { vite, meta } = await loadSeo({
  server: { middlewareMode: false, hmr: false, watch: null, port: 0, host: '127.0.0.1', open: false },
  appType: 'custom',
  plugins: [{
    name: 'og-card',
    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        const url = new URL(req.url, 'http://localhost');
        if (url.pathname !== '/__og') return next();
        const html = cards.get(url.searchParams.get('key'));
        if (!html) { res.statusCode = 404; res.end('no card'); return; }
        res.setHeader('Content-Type', 'text/html; charset=utf-8');
        res.end(html);
      });
    },
  }],
});
await vite.listen();
const origin = `http://127.0.0.1:${vite.config.server.port}`;

function cardHtml(m) {
  const title = m.title || 'John Geddes';
  const titleClass = title.length > 34 ? 'longer' : title.length > 20 ? 'long' : '';
  const eyebrow = m.path === '/' ? 'AV & Software Engineer · Chicago' : m.eyebrow || 'johngeddes.org';
  const aside = m.heroSrc
    ? `<div class="hero"><img src="${escapeHtml(m.heroSrc)}" alt=""></div>`
    : `<div class="mark"><img src="/apple-touch-icon.png" alt=""></div>`;
  return TEMPLATE
    .replace('{{eyebrow}}', escapeHtml(eyebrow))
    .replace('{{titleClass}}', titleClass)
    .replace('{{title}}', escapeHtml(title))
    .replace('{{description}}', escapeHtml(m.description || ''))
    .replace('{{aside}}', aside);
}

const routes = [...meta.prerenderRoutes(), ...meta.shellRoutes()];
for (const path of routes) {
  const m = meta.metaForPath(path);
  cards.set(meta.ogKeyFor(path), cardHtml(m));
}

mkdirSync(OUT_DIR, { recursive: true });
const { browser, source } = await launchBrowser();
console.log(`og-images: drawing ${cards.size} cards with ${source}`);
const page = await browser.newPage();
await page.setViewport({ width: 1200, height: 630, deviceScaleFactor: 1 });
const hashes = {};
for (const key of cards.keys()) {
  await page.goto(`${origin}/__og?key=${encodeURIComponent(key)}`, { waitUntil: 'networkidle0' });
  await page.evaluate(() => document.fonts.ready);
  const png = await page.screenshot({ path: join(OUT_DIR, `${key}.png`), type: 'png', clip: { x: 0, y: 0, width: 1200, height: 630 } });
  hashes[key] = createHash('sha256').update(png).digest('hex').slice(0, 8);
}
await browser.close();
await vite.close();

const keys = Object.keys(hashes).sort();
const sorted = Object.fromEntries(keys.map((key) => [key, hashes[key]]));
writeFileSync(join(ROOT, 'src/seo/og-keys.json'), `${JSON.stringify(sorted, null, 2)}\n`);
console.log(`og-images: ${keys.length} cards in public/og, ${((Date.now() - started) / 1000).toFixed(1)}s`);
process.exit(0);
