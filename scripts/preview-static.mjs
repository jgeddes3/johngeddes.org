// Serves build/ the way Vercel does with cleanUrls: /about -> about.html,
// unknown paths -> 404.html, so the prerendered pages can be checked locally.
// `vite preview` cannot do this; it sends index.html for every path.
//   npm run preview:static   (port 4175, or PORT)
import { readFileSync, existsSync } from 'node:fs';
import { join } from 'node:path';
import { BUILD, serveDir } from './seo/common.mjs';

// Read per request so a rebuild while the server runs is picked up.
const notFoundFile = join(BUILD, '404.html');
const shell = () => readFileSync(existsSync(notFoundFile) ? notFoundFile : join(BUILD, 'index.html'), 'utf8');
const { origin } = await serveDir(BUILD, shell, Number(process.env.PORT) || 4175);
console.log(`preview-static: serving build/ at ${origin}`);
