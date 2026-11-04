#!/usr/bin/env node
/* Scaffold a philosophy essay entry. The entry file is all the site needs —
   the route and the Philosophy page shelf pick it up automatically.

   Usage:
     npm run new:essay -- general "On Doing Nothing Well"
     npm run new:essay -- neuroethics "Who Owns a Memory" --deck "One line for the shelf" --date 2026-12-01

   Categories: general | neuroethics | technology | political | world
   Optional flags: --deck "..."   --date YYYY-MM-DD (default: today)   --slug CustomSlug */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { CATEGORY_KEYS } from '../src/philosophy/categoryKeys.js';

const ENTRIES = path.join(path.dirname(fileURLToPath(import.meta.url)), '..', 'src', 'philosophy', 'entries');
const KEYS = CATEGORY_KEYS.map((c) => c.key);

const [category, title, ...rest] = process.argv.slice(2);
if (!KEYS.includes(category) || !title) {
  console.error(`Usage: npm run new:essay -- <${KEYS.join('|')}> "Title" [--deck "..."] [--date YYYY-MM-DD] [--slug Slug]`);
  process.exit(1);
}

const flags = {};
for (let i = 0; i < rest.length; i += 2) {
  if (rest[i]?.startsWith('--')) flags[rest[i].slice(2)] = rest[i + 1];
}

const pascal = title.replace(/[^a-zA-Z0-9 ]/g, '').split(/\s+/).filter(Boolean)
  .map((w) => w[0].toUpperCase() + w.slice(1)).join('');
const slug = flags.slug || pascal;
const file = path.join(ENTRIES, `${slug}.js`);
if (fs.existsSync(file)) {
  console.error(`Already exists: ${file}`);
  process.exit(1);
}

const date = flags.date || new Date().toISOString().slice(0, 10);
if (!/^\d{4}-\d{2}-\d{2}$/.test(date) || Number.isNaN(Date.parse(date))) {
  console.error(`--date must be YYYY-MM-DD, got: ${flags.date}`);
  process.exit(1);
}

const q = (s) => JSON.stringify(s);
const lines = ['export default {'];
lines.push(`  slug: ${q(slug)},`);
lines.push(`  category: ${q(category)},`);
lines.push(`  title: ${q(title)},`);
lines.push(`  deck: ${q(flags.deck || 'TODO one line for the shelf, under ~90 characters')},`);
lines.push(`  date: ${q(date)},`);
lines.push(`  status: 'coming-soon', // flip to 'published' once blocks are written`);
lines.push(`  seoDescription: ${q(`John Geddes on ${title}. TODO: one factual sentence, ~150 chars.`)},`);
lines.push(`  // To publish: set status 'published', then add epigraph/blocks — see templates/TemplateEssayEntry.js`);
lines.push(`  blocks: [],`);
lines.push('};');
lines.push('');

fs.writeFileSync(file, lines.join('\n'));
console.log(`Created src/philosophy/entries/${slug}.js`);
console.log(`Live at /${slug} on the next build, listed on the "${CATEGORY_KEYS.find((c) => c.key === category).title}" shelf.`);
