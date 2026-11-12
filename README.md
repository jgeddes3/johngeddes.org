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

- Resumes are built by `npm run resumes` from `src/resumes/data.js` into
  `public/resumes/` (PDF and Word). The footer links the main resume at
  `/resumes/John_Geddes_Resume.pdf`; old resume URLs redirect in `vercel.json`.
- Reviews, recipes, and philosophy essays are data files (`src/reviews/entries/`,
  `src/philosophy/entries/`). `npm run new:review` and `npm run new:essay`
  scaffold one; see `templates/README.md`.
