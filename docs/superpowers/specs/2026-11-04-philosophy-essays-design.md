# Philosophy essays: data-driven section (design)

Date: 2026-11-04. Approved in conversation; mirrors the review system that the
Misc page already uses.

## Goal

Make adding a philosophy essay a one-file job, and rebuild `/philosophy` in the
Misc "shelf" layout: five category sections, each a logo, heading, and card
holding a row list. Shelves with nothing on them show one empty-state line.

## Data

- `src/philosophy/entries/<Slug>.js`, one default-exported object per essay,
  collected by `import.meta.glob` in `src/philosophy/index.js`.
- Fields: `slug`, `category` (general | neuroethics | technology | political |
  world), `title`, `deck` (one-line summary), `date` (ISO), `status`
  (`published` | `coming-soon`), `seoDescription`, optional `epigraph`
  `{ text, attribution }`, `blocks`.
- Block kinds: `paragraph`, `heading`, `pullquote`, `blockquote`, `divider`,
  `image` (full width), `figure` (text beside an image, `side` left or right).
  Paragraph text supports inline `[label](target)` links, shared with reviews.
- `src/philosophy/categoryKeys.js` holds the key and title list (plain data, so
  the scaffold script can import it). `src/philosophy/categories.js` adds the
  logo and empty-state line for each.
- Entries sort newest first within a shelf. An entry naming an unknown
  category is dropped with a console warning rather than crashing the page.

## Pages

- `Philosophy.jsx`: headline, one-line description, five shelf sections, then
  the existing Friends and Social buttons. Rows come from `ReviewIndex`, which
  gains an optional `meta` string shown where a rating would be (here the month
  and year); the existing "soon" tag applies to coming-soon essays.
- `src/philosophy/EssayPage.jsx`: category eyebrow, title, deck, byline with
  date, epigraph, body, and a Philosophy Page button. Uses the reading layout in
  `PhilosophyTemplate.css`. Coming-soon entries show a short note instead of a
  body.
- Routes: `App.jsx` maps every entry to `/<slug>`. The current `/phil1` intro
  becomes the first entry, slug `phil1`, so the sitemap and links keep working.

## Removed

`GeneralPhilosophy.jsx`, `Phil1.jsx` to `Phil5.jsx` and `Phil.css`,
`templates/TemplatePhilosophy.jsx`. Nothing else on the site changes.

## Authoring

`npm run new:essay -- <category> "Title"` scaffolds a coming-soon entry.
`templates/TemplateEssayEntry.js` documents every field. `templates/README.md`
gets a matching section.

## Verification

Production build passes; `/philosophy` shows five shelves with one row under
General; `/phil1` renders the same text as before; a scaffolded test entry
appears on its shelf and at its URL, then is deleted.
