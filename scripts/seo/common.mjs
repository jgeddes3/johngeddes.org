// Shared pieces for the SEO build scripts: loading src/seo/meta.js in Node
// through Vite, a tiny static server for the build output, finding a Chrome,
// and git dates for routes.
import { existsSync, readFileSync, statSync } from 'node:fs';
import { createServer as createHttpServer } from 'node:http';
import { join, extname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { execFileSync } from 'node:child_process';

export const ROOT = fileURLToPath(new URL('../../', import.meta.url));
export const BUILD = join(ROOT, 'build');
export const SITE_URL = 'https://www.johngeddes.org';

/* src/seo/meta.js imports the review and essay registries, which use
   import.meta.glob and image imports, so it is loaded through Vite's SSR
   module loader rather than plain Node. Returns the module and the Vite
   server to close afterwards. */
export async function loadSeo(extra = {}) {
  const { createServer } = await import('vite');
  const vite = await createServer({
    root: ROOT,
    appType: 'custom',
    logLevel: 'error',
    server: { middlewareMode: true, hmr: false, watch: null },
    optimizeDeps: { noDiscovery: true, include: [] },
    ...extra,
  });
  try {
    const meta = await vite.ssrLoadModule('/src/seo/meta.js');
    const site = await vite.ssrLoadModule('/src/seo/site.js');
    return { vite, meta, site };
  } catch (err) {
    await vite.close();
    throw err;
  }
}

const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.mjs': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.webp': 'image/webp',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.woff2': 'font/woff2',
  '.woff': 'font/woff',
  '.pdf': 'application/pdf',
  '.txt': 'text/plain; charset=utf-8',
  '.xml': 'application/xml; charset=utf-8',
};

/* Serves a directory like the production host does: files as-is, "/x" for
   "x.html", and the app shell for anything else. `shell` is the HTML to use
   for unknown paths (the untouched index.html during prerendering), or a
   function returning it, read per request. */
export function serveDir(dir, shell, port = 0) {
  const shellHtml = () => (typeof shell === 'function' ? shell() : shell);
  return new Promise((resolveServer) => {
    const server = createHttpServer((req, res) => {
      const pathname = decodeURIComponent(new URL(req.url, 'http://localhost').pathname);
      let file = join(dir, pathname);
      if (existsSync(file) && statSync(file).isDirectory()) file = join(file, 'index.html');
      if (!existsSync(file) && existsSync(`${file}.html`)) file = `${file}.html`;
      if (!existsSync(file) || statSync(file).isDirectory()) {
        // A missing asset is a 404, not the app shell, so a script tag never
        // receives HTML (the production host serves /_vercel/* itself).
        if (extname(pathname) && extname(pathname) !== '.html') {
          res.writeHead(404, { 'Content-Type': 'text/plain' });
          res.end('not found');
          return;
        }
        res.writeHead(200, { 'Content-Type': MIME['.html'] });
        res.end(shellHtml());
        return;
      }
      res.writeHead(200, { 'Content-Type': MIME[extname(file)] || 'application/octet-stream' });
      res.end(readFileSync(file));
    });
    server.listen(port, '127.0.0.1', () => {
      resolveServer({ server, port: server.address().port, origin: `http://127.0.0.1:${server.address().port}` });
    });
  });
}

/* A Chrome to render with. A local install wins (CHROME_PATH or the usual
   places); on a Linux build machine with none, the serverless Chromium build
   from @sparticuz/chromium. Throws when neither is available. */
export async function launchBrowser() {
  const puppeteer = (await import('puppeteer-core')).default;
  const candidates = [
    process.env.CHROME_PATH,
    'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    'C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe',
    process.env.LOCALAPPDATA && join(process.env.LOCALAPPDATA, 'Google\\Chrome\\Application\\chrome.exe'),
    '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
    '/usr/bin/google-chrome',
    '/usr/bin/google-chrome-stable',
    '/usr/bin/chromium',
    '/usr/bin/chromium-browser',
  ].filter(Boolean);
  const local = candidates.find((p) => existsSync(p));
  if (local) {
    const browser = await puppeteer.launch({
      executablePath: local,
      headless: true,
      args: ['--no-sandbox', '--disable-gpu', '--hide-scrollbars', '--font-render-hinting=none'],
    });
    return { browser, source: local };
  }
  const chromium = (await import('@sparticuz/chromium')).default;
  const executablePath = await chromium.executablePath();
  const browser = await puppeteer.launch({
    executablePath,
    args: [...chromium.args, '--hide-scrollbars', '--font-render-hinting=none'],
    headless: true,
  });
  return { browser, source: `@sparticuz/chromium (${executablePath})` };
}

/* The source file behind a route, for git dates: the page component for a
   static route (read from App.jsx), the entry file for a review or essay. */
export function sourceFileFor(path) {
  const app = readFileSync(join(ROOT, 'src/App.jsx'), 'utf8');
  // The path may carry an optional param in App.jsx, e.g. "/ChessDeck/online/:peerId?".
  const escaped = path.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const route = new RegExp(`<Route\\s+path="${escaped}(?:/:[^"]*)?"\\s+element=\\{<(\\w+)`).exec(app);
  if (route) {
    const comp = route[1];
    const imp = new RegExp(`import ${comp} from '([^']+)'`).exec(app);
    if (imp) {
      for (const ext of ['', '.jsx', '.js', '/index.jsx', '/index.js']) {
        const candidate = resolve(join(ROOT, 'src'), `${imp[1]}${ext}`);
        if (existsSync(candidate) && statSync(candidate).isFile()) return candidate;
      }
    }
  }
  const slug = path.replace(/^\//, '');
  for (const dir of ['src/reviews/entries', 'src/philosophy/entries']) {
    const candidate = join(ROOT, dir, `${slug}.js`);
    if (existsSync(candidate)) return candidate;
  }
  return null;
}

/* ISO date (YYYY-MM-DD) of the last commit touching `file`, or today when it
   has uncommitted changes. Null when git has no record (a shallow clone, or a
   file outside the repo). */
export function gitDate(file) {
  if (!file) return null;
  try {
    const dirty = execFileSync('git', ['status', '--porcelain', '--', file], { cwd: ROOT, encoding: 'utf8' }).trim();
    if (dirty) return new Date().toISOString().slice(0, 10);
    const out = execFileSync('git', ['log', '-1', '--format=%cs', '--', file], { cwd: ROOT, encoding: 'utf8' }).trim();
    return /^\d{4}-\d{2}-\d{2}$/.test(out) ? out : null;
  } catch {
    return null;
  }
}

export function escapeHtml(s) {
  return String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}
