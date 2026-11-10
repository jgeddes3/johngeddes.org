/* The one place that answers "what are the title, description, canonical URL,
   share image, and structured data for this path?". SEO.jsx reads it at run
   time; scripts/prerender.mjs loads it through Vite in Node and writes the same
   answers into static HTML, the sitemap, and llms.txt. Keep it free of React
   and DOM access. */
import { SITE, PAGES, SECTIONS } from './site';
import { reviews, bySlug as reviewBySlug } from '../reviews';
import { essays, bySlug as essayBySlug } from '../philosophy';
import * as ld from './jsonld';
import ogKeys from './og-keys.json';
import lastmod from './lastmod.json';

export const absoluteUrl = (path) => `${SITE.url}${path}`;

/* "/ChessDeck/local" -> "ChessDeck-local"; "/" -> "home". Names the share image file. */
export const ogKeyFor = (path) => (path === '/' ? 'home' : path.replace(/^\//, '').replace(/\//g, '-'));

const shareImage = (path, alt) => {
  const key = ogKeyFor(path);
  const generated = ogKeys.includes(key);
  return {
    url: absoluteUrl(generated ? `/og/${key}.png` : '/og-image.png'),
    width: 1200,
    height: 630,
    alt: generated ? alt : SITE.defaultImageAlt,
  };
};

const fullTitleFor = (path, title) => (path === '/' || !title ? SITE.homeTitle : `${title} | ${SITE.name}`);

/* ISO date of the last meaningful change, from the committed lastmod map (see
   scripts/seo-dates.mjs). Undefined when unknown; callers leave the field out. */
export const lastModified = (path) => lastmod[path];

const reviewTitle = (r) => (r.type === 'recipe' ? r.title : `${r.title} Review`);

const reviewKindLabel = (r) =>
  r.type === 'book' ? 'Book review' : r.type === 'restaurant' ? 'Restaurant review' : 'Recipe';

/* Everything a page needs. Unknown paths resolve to the 404 entry. */
export function metaForPath(path) {
  const page = PAGES[path];
  if (page) return staticMeta(path, page);

  const slug = path.replace(/^\//, '');
  const review = reviewBySlug(slug);
  if (review) return reviewMeta(path, review);
  const essay = essayBySlug(slug);
  if (essay) return essayMeta(path, essay);

  return staticMeta('/404', PAGES['/404']);
}

function staticMeta(path, page) {
  const title = page.title;
  const fullTitle = fullTitleFor(path, title);
  const image = shareImage(path, `${title || SITE.name} · ${SITE.name}`);
  const jsonLd = [];
  if (path === '/') {
    jsonLd.push(ld.website(), ld.person(true));
  } else if (!page.noindex) {
    const crumbs = [...(page.parent ? [page.parent] : []), { name: title, path }];
    jsonLd.push(ld.breadcrumbs(crumbs));
    if (path === '/about') jsonLd.push(ld.profilePage(path));
    if (page.project) jsonLd.push(ld.softwareApplication(page.project, path, image.url));
  }
  return {
    path,
    title,
    fullTitle,
    description: page.description,
    canonical: page.noindex ? null : absoluteUrl(path),
    noindex: !!page.noindex,
    image,
    type: 'website',
    eyebrow: page.parent ? page.parent.name : '',
    heroSrc: page.cardImage || null,
    jsonLd,
  };
}

function reviewMeta(path, review) {
  const title = reviewTitle(review);
  const image = shareImage(path, `${title} · ${SITE.name}`);
  const section = SECTIONS.review;
  const modified = lastModified(path);
  const jsonLd = [
    ld.breadcrumbs([section, { name: title, path }]),
    review.type === 'recipe'
      ? ld.recipe(review, path, image.url, modified)
      : ld.review(review, path, image.url, modified),
  ];
  const eyebrowRating = review.rating != null ? ` · ${review.rating}/10` : '';
  return {
    path,
    title,
    fullTitle: fullTitleFor(path, title),
    description: review.seoDescription || review.blurb,
    canonical: absoluteUrl(path),
    noindex: false,
    image,
    type: 'article',
    eyebrow: `${reviewKindLabel(review)}${eyebrowRating}`,
    // The review's photo, for the share-image generator. A dev-server URL in
    // Node and a hashed asset URL in the browser; only the generator reads it.
    heroSrc: review.hero ? review.hero.src : null,
    jsonLd,
  };
}

function essayMeta(path, essay) {
  const title = essay.title;
  const image = shareImage(path, `${title} · ${SITE.name}`);
  const section = SECTIONS.essay;
  const jsonLd = [
    ld.breadcrumbs([section, { name: title, path }]),
    ld.article(essay, path, image.url, lastModified(path)),
  ];
  return {
    path,
    title,
    fullTitle: fullTitleFor(path, title),
    description: essay.seoDescription || essay.deck,
    canonical: absoluteUrl(path),
    noindex: false,
    image,
    type: 'article',
    eyebrow: 'Philosophy',
    jsonLd,
  };
}

/* ---- Route lists for the build ---- */

const staticPaths = () => Object.keys(PAGES);
const reviewPaths = () => reviews.map((r) => `/${r.slug}`);
const essayPaths = () => essays.map((e) => `/${e.slug}`);

/* Every route that gets its own static HTML file with rendered markup. A
   noindex page is included: it needs its own file so the noindex tag is in the
   HTML a crawler receives, and so the URL does not fall through to the 404. */
export function prerenderRoutes() {
  return [
    ...staticPaths().filter((p) => PAGES[p].prerender !== false && PAGES[p].body !== false),
    ...reviewPaths(),
    ...essayPaths(),
  ];
}

/* Routes that get a static file with their own head but the plain app shell
   as the body: pages whose content only exists after mount (live tiles), and
   pages with side effects on load (the online chess page creates a room). */
export function shellRoutes() {
  return staticPaths().filter((p) => (PAGES[p].prerender === false || PAGES[p].body === false) && !PAGES[p].noindex);
}

/* Every route a crawler should know about, with sitemap hints. */
export function sitemapEntries() {
  const entries = [];
  for (const path of staticPaths()) {
    const page = PAGES[path];
    if (page.noindex || page.sitemap === false) continue;
    entries.push({ path, priority: page.priority ?? 0.5, changefreq: page.changefreq ?? 'monthly', lastmod: lastModified(path) });
  }
  for (const r of reviews) {
    const path = `/${r.slug}`;
    entries.push({ path, priority: r.status === 'published' ? 0.6 : 0.4, changefreq: 'monthly', lastmod: lastModified(path) });
  }
  for (const e of essays) {
    const path = `/${e.slug}`;
    entries.push({ path, priority: 0.6, changefreq: 'monthly', lastmod: lastModified(path) || e.date });
  }
  return entries;
}

/* ---- llms.txt ----
   A plain summary of the site for AI crawlers, in the llmstxt.org shape: a
   heading, a blockquote, then sections of links with a line each. Built from
   the same data as the pages so it cannot drift from them. */
export function llmsText() {
  const url = (path) => absoluteUrl(path);
  const line = (path, text) => `- [${path === '/' ? 'Home' : (PAGES[path] && PAGES[path].title) || path}](${url(path)}): ${text}`;

  const projectPaths = staticPaths().filter((p) => PAGES[p].parent && PAGES[p].parent.path === '/projects' && !PAGES[p].noindex);
  const books = reviews.filter((r) => r.type === 'book');
  const restaurants = reviews.filter((r) => r.type === 'restaurant');
  const recipes = reviews.filter((r) => r.type === 'recipe');
  const rated = (r) => (r.rating != null ? ` Rated ${r.rating}/10.` : '');
  const status = (r) => (r.status === 'published' ? '' : ' Written review in progress.');

  return [
    `# ${SITE.name}`,
    '',
    `> ${SITE.description}`,
    '',
    `John Geddes (John Joseph Geddes) is a Senior Audio Visual Engineer at The Aspen Group and a software developer in Chicago, Illinois. He holds a B.S. in Computer Science from Loyola University Chicago with a focus on neuroethics and AI. This site is his: ${url('/')}. He is not the Canadian political journalist or the novelist who share the name.`,
    '',
    'Contact: app@johngeddes.org. Profiles: https://www.linkedin.com/in/therealjohngeddes, https://github.com/jgeddes3.',
    '',
    '## Pages',
    '',
    line('/', 'the front page: who he is and where everything lives.'),
    line('/about', 'background, skills, and interests.'),
    line('/projects', 'every project, with what is shipped, playable, in progress, or still a concept.'),
    line('/misc', 'book reviews, restaurant reviews, and recipes, rated out of ten.'),
    line('/philosophy', 'essays in five shelves: general, neuroethics, technology, political, world.'),
    line('/contracts', 'contract services and rates for AV and software work.'),
    line('/recruiters', 'role-specific resumes.'),
    line('/social', 'live signals (now playing, chess rating, latest commit, Chicago weather) and profile links.'),
    line('/friends', 'interests and the people behind them.'),
    '',
    '## Projects',
    '',
    ...projectPaths.map((p) => line(p, PAGES[p].description)),
    '',
    '## Book reviews',
    '',
    ...books.map((r) => `- [${r.title}${r.author ? ` by ${r.author}` : ''}](${url(`/${r.slug}`)}):${rated(r)}${status(r)} ${r.blurb || ''}`.trim()),
    '',
    '## Restaurant reviews',
    '',
    ...restaurants.map((r) => `- [${r.title}${r.place ? `, ${r.place}` : ''}](${url(`/${r.slug}`)}):${rated(r)}${status(r)} ${r.blurb || ''}`.trim()),
    '',
    '## Recipes',
    '',
    ...recipes.map((r) => `- [${r.title}](${url(`/${r.slug}`)}): ${r.seoDescription || r.blurb || ''}`),
    '',
    '## Philosophy essays',
    '',
    ...essays.map((e) => `- [${e.title}](${url(`/${e.slug}`)}): ${e.seoDescription || e.deck || ''}${e.status === 'published' ? '' : ' (coming soon)'}`),
    '',
    '## Technical skills',
    '',
    '- Frontend: React, TypeScript, JavaScript, Vite, HTML, CSS',
    '- Mobile: React Native, Expo',
    '- Backend: Node.js, Express, Firebase, Python',
    '- AV systems: Crestron, Extron, enterprise AV integration',
    '- Data and tooling: Python data analysis, Excel automation, Git, Azure AD',
    '- Security: AES-256 encryption, PBKDF2, JWT authentication',
    '',
  ].join('\n');
}
