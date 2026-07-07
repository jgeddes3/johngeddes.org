# johngeddes.org

Personal site and portfolio of John Geddes — projects, resume, book/restaurant
reviews, recipes, and a few interactive toys (route weather, drink horoscope,
news ticker).

## Stack

- React 18 single-page app built with Vite
- react-router-dom for routing, framer-motion for animation
- Express-style serverless API in `api/index.js`, deployed as a Vercel function
- Static assets live in `public/` (Vite copies them into the build output)

## Local development

```
npm install
npm run dev
```

This serves the front end at the Vite dev URL. The `/api/*` routes are handled
by the Vercel function, so they only work under `vercel dev` (or in
production) — plain `npm run dev` will get 404s from API calls.

## Build

```
npm run build
```

Output goes to `build/`.

## Environment variables

See `.env.example` for the full list (Last.fm, Anthropic, Mapbox, Finnhub).
All keys are server-side only, read by `api/index.js`. Never add
`VITE_`-prefixed secrets — Vite inlines those into the public bundle.

## Notes

- The resume PDF is served from `public/` at the stable URL
  `/Geddes_Resume_26.pdf`.
- Starter templates for new review/recipe pages live in `templates/` — copy
  one into `src/Components/Pages/MiscPages/` and fix the relative imports.
