#!/usr/bin/env node
/* Scaffold a review entry. The entry file is all the site needs — the route,
   the Misc page, and the Friends page all pick it up automatically.

   Usage:
     npm run new:review -- book "The Name of the Wind" --author "Patrick Rothfuss" --rating 9
     npm run new:review -- restaurant "Dearly Beloved" --place "Chicago" --rating 8
     npm run new:review -- recipe "Breakfast Tacos"

   Optional flags: --series "Kingkiller Chronicle, Book One"   --slug CustomSlug */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ENTRIES = path.join(path.dirname(fileURLToPath(import.meta.url)), '..', 'src', 'reviews', 'entries');

const [type, title, ...rest] = process.argv.slice(2);
const TYPES = ['book', 'restaurant', 'recipe'];
if (!TYPES.includes(type) || !title) {
  console.error('Usage: npm run new:review -- <book|restaurant|recipe> "Title" [--author "..."] [--place "..."] [--rating N] [--series "..."] [--slug Slug]');
  process.exit(1);
}

const flags = {};
for (let i = 0; i < rest.length; i += 2) {
  if (rest[i]?.startsWith('--')) flags[rest[i].slice(2)] = rest[i + 1];
}

const pascal = title.replace(/[^a-zA-Z0-9 ]/g, '').split(/\s+/).filter(Boolean)
  .map((w) => w[0].toUpperCase() + w.slice(1)).join('');
const slug = flags.slug || (type === 'recipe' ? pascal : `${pascal}Review`);
const file = path.join(ENTRIES, `${slug}.js`);
if (fs.existsSync(file)) {
  console.error(`Already exists: ${file}`);
  process.exit(1);
}

const rating = flags.rating != null ? Number(flags.rating) : null;
if (rating != null && (!Number.isFinite(rating) || rating < 0 || rating > 10)) {
  console.error(`--rating must be a number from 0 to 10, got: ${flags.rating}`);
  process.exit(1);
}
const q = (s) => JSON.stringify(s);
const lines = ['export default {'];
lines.push(`  slug: ${q(slug)},`);
lines.push(`  type: ${q(type)},`);
lines.push(`  title: ${q(title)},`);
if (type === 'book') lines.push(`  author: ${q(flags.author || 'TODO author')},`);
if (flags.series) lines.push(`  series: ${q(flags.series)},`);
if (type === 'restaurant') lines.push(`  place: ${q(flags.place || 'Chicago')},`);
lines.push(`  rating: ${type === 'recipe' ? 'null' : rating ?? 'null /* TODO: out of 10 */'},`);
lines.push(`  status: 'coming-soon', // flip to 'published' once blocks are written`);
if (type === 'recipe') {
  lines.push(`  blurb: ${q('TODO one-line description for listing cards')},`);
} else {
  lines.push(`  blurb: ${q(`Rated ${rating ?? 'X'}/10 — written review on the way.`)},`);
}
lines.push(`  seoDescription: ${q(`John Geddes on ${title}. TODO: one factual sentence, ~150 chars.`)},`);
if (type === 'book') {
  const grq = encodeURIComponent(`${title} ${flags.author || ''}`.trim());
  lines.push(`  links: [{ label: 'Goodreads', url: 'https://www.goodreads.com/search?q=${grq}' }],`);
} else if (type === 'restaurant') {
  lines.push(`  links: [`);
  lines.push(`    { label: 'Tripadvisor', url: 'https://www.tripadvisor.com/Profile/JohnHoss' },`);
  lines.push(`    { label: 'Yelp', url: 'https://www.yelp.com/user_details_reviews_self?userid=fgyF6oOG788lkuxtjUWFFg' },`);
  lines.push(`  ],`);
} else {
  lines.push(`  links: [],`);
}
lines.push(`  // To publish: set status 'published', then add hero/blocks — see templates/TemplateReviewEntry.js`);
lines.push('};');
lines.push('');

fs.writeFileSync(file, lines.join('\n'));
console.log(`Created src/reviews/entries/${slug}.js`);
console.log(`Live at /${slug} on the next build. Images go in src/reviews/images/<AnyFolder>/ and are imported at the top of the entry.`);
