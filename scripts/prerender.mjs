// Runs after `vite build` (package.json "postbuild"). For every route it writes
// a static HTML file into build/ whose <head> carries that page's own title,
// description, canonical URL, share image, and structured data, so crawlers
// and link scrapers that do not run JavaScript see the right thing. When a
// Chrome is available it also renders each page and saves the markup, so the
// first paint is the finished page and React hydrates on top of it.
//
// It never fails the build: without a browser every route still gets its own
// head and the app shell as the body, which is what shipped before.
//
// Output:
//   build/index.html            the home page
//   build/<route>.html          every other prerendered route ("cleanUrls" serves it at /<route>)
//   build/404.html              the not-found page, marked noindex
//   build/sitemap.xml, build/llms.txt
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { ROOT, BUILD, SITE_URL, loadSeo, serveDir, launchBrowser, sourceFileFor, gitDate, escapeHtml } from './seo/common.mjs';

const NOT_FOUND_PATH = '/__not_found__';
const CONCURRENCY = 4;
const started = Date.now();

// The untouched app shell from `vite build`. This script overwrites
// build/index.html with the rendered home page, so a second run without a
// rebuild finds a prerendered file; the shell is then restored from it by
// dropping the injected head tags and putting the source loader back in #root.
function restoreShell(built) {
  const source = readFileSync(join(ROOT, 'index.html'), 'utf8');
  const loaderSpan = rootSpan(source);
  const loader = source.slice(loaderSpan.start, loaderSpan.end);
  const { start, end } = rootSpan(built, true);
  let html = `${built.slice(0, start)}${loader}${built.slice(end)}`;
  html = html
    .replace(/\s*<title data-rh="true">[^<]*<\/title>/g, '')
    .replace(/\s*<script data-rh="true"[^>]*>[\s\S]*?<\/script>/g, '')
    .replace(/\s*<(?:meta|link) data-rh="true"[^>]*>/g, '');
  const title = /<title>[^<]*<\/title>/.exec(source);
  if (title) html = html.replace('</head>', `    ${title[0]}\n  </head>`);
  return html;
}
const built = readFileSync(join(BUILD, 'index.html'), 'utf8');
const template = built.includes('data-prerendered') ? restoreShell(built) : built;
const { vite, meta } = await loadSeo();

const routes = meta.prerenderRoutes();
const shellOnly = meta.shellRoutes ? meta.shellRoutes() : [];

/* ---- head tags from src/seo/meta.js, marked for react-helmet-async to adopt ---- */
function headFor(m) {
  const t = (tag) => tag.replace('<', '<').replace(/^<(\w+)/, '<$1 data-rh="true"');
  const metaTag = (attrs) => t(`<meta ${attrs}>`);
  const tags = [
    t(`<title>${escapeHtml(m.fullTitle)}</title>`),
    metaTag(`name="description" content="${escapeHtml(m.description)}"`),
    m.noindex ? metaTag('name="robots" content="noindex"') : '',
    m.canonical ? t(`<link rel="canonical" href="${m.canonical}">`) : '',
    metaTag(`property="og:type" content="${m.type}"`),
    metaTag('property="og:site_name" content="John Geddes"'),
    metaTag('property="og:locale" content="en_US"'),
    metaTag(`property="og:title" content="${escapeHtml(m.fullTitle)}"`),
    metaTag(`property="og:description" content="${escapeHtml(m.description)}"`),
    m.canonical ? metaTag(`property="og:url" content="${m.canonical}"`) : '',
    metaTag(`property="og:image" content="${m.image.url}"`),
    metaTag(`property="og:image:width" content="${m.image.width}"`),
    metaTag(`property="og:image:height" content="${m.image.height}"`),
    metaTag(`property="og:image:alt" content="${escapeHtml(m.image.alt)}"`),
    metaTag('name="twitter:card" content="summary_large_image"'),
    metaTag(`name="twitter:title" content="${escapeHtml(m.fullTitle)}"`),
    metaTag(`name="twitter:description" content="${escapeHtml(m.description)}"`),
    metaTag(`name="twitter:image" content="${m.image.url}"`),
    metaTag(`name="twitter:image:alt" content="${escapeHtml(m.image.alt)}"`),
    ...m.jsonLd.map((data) => t(`<script type="application/ld+json">${JSON.stringify(data).replace(/</g, '\\u003c')}</script>`)),
  ];
  return tags.filter(Boolean).join('\n    ');
}

/* Start and end offsets of the root element in the template, found by
   counting nested <div>s so the loader markup inside it does not matter. */
function rootSpan(html, prerendered = false) {
  const open = prerendered ? '<div id="root" data-prerendered="">' : '<div id="root">';
  const start = html.indexOf(open);
  if (start < 0) throw new Error(`template has no ${open}`);
  const tag = /<div\b[^>]*>|<\/div>/g;
  tag.lastIndex = start + open.length;
  let depth = 1;
  let match;
  while ((match = tag.exec(html))) {
    depth += match[0].startsWith('</') ? -1 : 1;
    if (depth === 0) return { start, end: match.index + match[0].length };
  }
  throw new Error('template root element is not closed');
}

/* The built index.html with the page's head, and optionally its rendered body. */
function compose(m, body) {
  let html = template.replace(/<title>[^<]*<\/title>\s*/, '');
  html = html.replace('</head>', `    ${headFor(m)}\n  </head>`);
  if (body != null) {
    const { start, end } = rootSpan(html);
    html = `${html.slice(0, start)}<div id="root" data-prerendered="">${body}</div>${html.slice(end)}`;
  }
  return html;
}

/* ---- rendered body via Chrome ---- */
async function snapshot(browser, origin, path) {
  const page = await browser.newPage();
  try {
    await page.setViewport({ width: 1280, height: 900 });
    // Components that fill themselves in after mount check this flag and keep
    // their first-render state, so the snapshot hydrates cleanly (src/seo/prerendering.js).
    await page.evaluateOnNewDocument(() => { window.__PRERENDER__ = true; });
    await page.setRequestInterception(true);
    page.on('request', (req) => {
      const url = new URL(req.url());
      // Same-origin assets only: no API calls, analytics, fonts from elsewhere, or Firebase.
      if (url.origin !== origin || url.pathname.startsWith('/api/') || url.pathname.startsWith('/_vercel/')) req.abort();
      else req.continue();
    });
    await page.goto(`${origin}${path}`, { waitUntil: 'networkidle0', timeout: 45000 });
    await page.waitForFunction(() => {
      const root = document.getElementById('root');
      return root && root.children.length > 0 && !root.querySelector('#initial-loader');
    }, { timeout: 15000 });
    // Let the router, Helmet, and entrance animations settle.
    await new Promise((r) => setTimeout(r, 600));
    return await page.evaluate(() => {
      // React renders `{a} and {b}` as separate text nodes, and its hydration
      // expects to find them separately. Serialising the DOM would merge
      // neighbouring text nodes into one, so put the same empty comment
      // between them that React's own server renderer emits.
      const root = document.getElementById('root');
      const walker = document.createTreeWalker(root, NodeFilter.SHOW_ELEMENT);
      const elements = [root];
      while (walker.nextNode()) elements.push(walker.currentNode);
      for (const el of elements) {
        for (let child = el.firstChild; child && child.nextSibling; child = child.nextSibling) {
          if (child.nodeType === Node.TEXT_NODE && child.nextSibling.nodeType === Node.TEXT_NODE) {
            el.insertBefore(document.createComment(''), child.nextSibling);
          }
        }
      }
      return root.innerHTML;
    });
  } finally {
    await page.close();
  }
}

/* ---- write helpers ---- */
function outFile(path) {
  if (path === '/') return join(BUILD, 'index.html');
  if (path === NOT_FOUND_PATH) return join(BUILD, '404.html');
  return join(BUILD, `${path.replace(/^\//, '')}.html`);
}
function write(file, text) {
  mkdirSync(dirname(file), { recursive: true });
  writeFileSync(file, text);
}

/* ---- sitemap and llms.txt ---- */
function sitemapXml(entries) {
  const url = (e) => [
    '  <url>',
    `    <loc>${SITE_URL}${e.path}</loc>`,
    e.lastmod ? `    <lastmod>${e.lastmod}</lastmod>` : '',
    `    <changefreq>${e.changefreq}</changefreq>`,
    `    <priority>${e.priority}</priority>`,
    '  </url>',
  ].filter(Boolean).join('\n');
  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${entries.map(url).join('\n')}\n</urlset>\n`;
}

/* Git knows when a page last changed even if lastmod.json is stale. */
function freshest(path, recorded) {
  const fromGit = gitDate(sourceFileFor(path));
  if (!fromGit) return recorded;
  if (!recorded) return fromGit;
  return fromGit > recorded ? fromGit : recorded;
}

/* ---- main ---- */
// Anything unexpected is logged and the build keeps the plain app shell; a
// prerender problem must never take the site down.
process.on('uncaughtException', (err) => { console.warn(`prerender: giving up (${err.message})`); process.exit(0); });
process.on('unhandledRejection', (err) => { console.warn(`prerender: giving up (${err && err.message})`); process.exit(0); });

const results = { rendered: [], headOnly: [], failed: [] };
const { server, origin } = await serveDir(BUILD, template);

let browser = null;
try {
  const launched = await launchBrowser();
  browser = launched.browser;
  console.log(`prerender: rendering with ${launched.source}`);
} catch (err) {
  console.warn(`prerender: no browser (${err.message}); writing per-route heads only`);
}

const pages = new Map(); // outFile -> html
const queue = [...routes.map((p) => ({ path: p, render: true })), { path: NOT_FOUND_PATH, render: true }, ...shellOnly.map((p) => ({ path: p, render: false }))];

async function work() {
  while (queue.length) {
    const { path, render } = queue.shift();
    const m = meta.metaForPath(path === NOT_FOUND_PATH ? '/404' : path);
    let body = null;
    if (browser && render) {
      try {
        body = await snapshot(browser, origin, path);
        results.rendered.push(path);
      } catch (err) {
        results.failed.push(`${path}: ${err.message.split('\n')[0]}`);
      }
    }
    if (body == null) results.headOnly.push(path);
    pages.set(outFile(path), compose(m, body));
  }
}
await Promise.all(Array.from({ length: browser ? CONCURRENCY : 1 }, work));

for (const [file, html] of pages) write(file, html);

const entries = meta.sitemapEntries().map((e) => ({ ...e, lastmod: freshest(e.path, e.lastmod) }));
write(join(BUILD, 'sitemap.xml'), sitemapXml(entries));
write(join(BUILD, 'llms.txt'), meta.llmsText());

if (browser) await browser.close();
server.close();
await vite.close();

const secs = ((Date.now() - started) / 1000).toFixed(1);
console.log(`prerender: ${results.rendered.length} rendered, ${results.headOnly.length} head-only, ${entries.length} sitemap entries, ${secs}s`);
for (const f of results.failed) console.warn(`prerender: render failed, head-only fallback: ${f}`);
process.exit(0);
