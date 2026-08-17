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

## Page templates (non-review pages)

- `AaTemplate.jsx` — generic page skeleton. Copy into `src/Components/Pages/...`
  and fix the relative imports.
- `TemplatePhilosophy.jsx` — long-form essay layout for the philosophy section,
  using the classes in `src/Components/Pages/PhilosophyPages/PhilosophyTemplate.css`.
