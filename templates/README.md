# Templates

## Adding a review or recipe (the easy way)

Reviews live as small data files — one file per review — in `src/reviews/entries/`.
Everything else (the page at `/<slug>`, the Misc page listing, the Friends page
listing, star ratings, sorting) is generated automatically from that file.

**Two steps:**

1. Scaffold the entry:

   ```
   npm run new:review -- book "The Name of the Wind" --author "Patrick Rothfuss" --rating 9
   npm run new:review -- restaurant "Dearly Beloved" --place "Chicago" --rating 8
   npm run new:review -- recipe "Breakfast Tacos"
   ```

   This creates `src/reviews/entries/<Slug>.js` with `status: 'coming-soon'`,
   which is already a complete, live page (title + stars + "written review on
   the way"). Rating-only reviews are fine to ship like this.

2. When the written review is ready: open the entry, set `status: 'published'`,
   and fill in `blocks` (and `hero` if there's a photo). Field-by-field docs are
   in [`TemplateReviewEntry.js`](TemplateReviewEntry.js). Photos go in
   `src/reviews/images/<Name>/` and are imported at the top of the entry.

Nothing else to touch: no routes, no `App.jsx`, no listing pages.
After deploying, add the new URL to `public/sitemap.xml` (copy any `<url>` block).

## Adding a philosophy essay

Same idea as reviews: one data file per essay in `src/philosophy/entries/`,
and the page at `/<slug>` plus its shelf on `/philosophy` are generated.

1. Scaffold the entry (categories: general, neuroethics, technology, political, world):

   ```
   npm run new:essay -- general "On Doing Nothing Well"
   npm run new:essay -- neuroethics "Who Owns a Memory" --deck "One line for the shelf"
   ```

   This creates `src/philosophy/entries/<Slug>.js` with `status: 'coming-soon'`,
   which is already a live page (title, date, and a "still being written" note)
   and a row on its shelf with a "soon" tag.

2. When the essay is ready: set `status: 'published'` and fill in `blocks`
   (and `epigraph` if you want one). Field-by-field docs are in
   [`TemplateEssayEntry.js`](TemplateEssayEntry.js). Images go in
   `src/philosophy/images/<Name>/` and are imported at the top of the entry.

After deploying, add the new URL to `public/sitemap.xml`.

## Updating the Social page

`/social` has no template: its text lives in `src/social/now.js`. Edit the
`now` list and bump `updated` when life changes; set `reading` to the slug of
the last book you rated; fill in a profile's `handle` to make its badge appear.
The live tiles (now playing, chess rating, last commit, Chicago weather) come
from `/api/signals` and need no editing.

## Page templates (non-review pages)

- `AaTemplate.jsx` — generic page skeleton. Copy into `src/Components/Pages/...`
  and fix the relative imports.

## SEO: titles, share images, and dates

Every page's title, description, canonical URL, share image, and structured data
come from `src/seo/`:

- `src/seo/site.js` — the static pages table (`PAGES`) and the facts about John.
  A new static page needs an entry here with a `title`, `description`, and
  `parent` (its breadcrumb), and `<SEO path="/its-path" />` in the component.
- Reviews and essays need nothing extra: `src/seo/meta.js` reads the registries.
  Recipes get schema.org Recipe data from the entry's `recipe` block (see
  `TemplateReviewEntry.js`).

The build (`npm run build`) prerenders every route to static HTML in `build/`
with its own head tags, and writes `sitemap.xml` and `llms.txt` there. Two
things are generated locally and committed because they need a Chrome:

    npm run seo        # both of the below
    npm run seo:dates  # src/seo/lastmod.json, from git: when each page last changed
    npm run seo:images # public/og/<page>.png share cards + src/seo/og-keys.json

Run `npm run seo` after adding or renaming a page, review, or essay, or changing a
title, then commit the results. A page without a generated card falls back to
`public/og-image.png`.
