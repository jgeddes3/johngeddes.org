// Records when each route's source last changed, from git, into
// src/seo/lastmod.json. The sitemap and the Article/Review structured data
// read it. Run `npm run seo` (which includes this) before committing content
// changes; the build also asks git directly and uses whichever is newer.
import { writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { ROOT, loadSeo, sourceFileFor, gitDate } from './seo/common.mjs';

const { vite, meta } = await loadSeo();
const routes = [...meta.prerenderRoutes(), ...(meta.shellRoutes ? meta.shellRoutes() : [])];
const out = {};
const missing = [];
for (const path of routes) {
  const file = sourceFileFor(path);
  const date = gitDate(file);
  if (date) out[path] = date;
  else missing.push(path);
}
const sorted = Object.fromEntries(Object.entries(out).sort(([a], [b]) => a.localeCompare(b)));
writeFileSync(join(ROOT, 'src/seo/lastmod.json'), `${JSON.stringify(sorted, null, 2)}\n`);
console.log(`seo-dates: ${Object.keys(sorted).length} routes dated${missing.length ? `; no source found for ${missing.join(', ')}` : ''}`);
await vite.close();
process.exit(0);
