// Pure data — no imports. 24x24 line icons for the project case-study pages,
// normalised to one spec so the two pages read as one system: stroke-width 1.8,
// round caps and joins, no fill. Names in FILLED render as solid shapes instead.
//
// These are the source projects' own marks, not a stock icon set:
//
//   cipher* — copied verbatim from CipherTracker's icon kit
//             (CipherTracker/src/components/ui/icons/glyphPaths.js), which the
//             app built to replace every emoji in its UI. Same 24x24 grid, same
//             stroke-first construction.
//   rambler* — lifted from Rambler Registrar's marketing site, which hand-draws
//             its glyphs inline rather than shipping an icon library
//             (RamblerRegistrarWeb/src/components). SVG <circle>/<rect> shapes
//             are rewritten as path data and the 16x16 grid glyph is scaled to
//             24; the geometry is otherwise unchanged. Stroke weights there
//             range 1.4-2.2 per context — normalised to 1.8 here so one page
//             does not mix three weights.
//
// The one exception is `ramblerRoute`, drawn for this page: the app's walk-time
// feature is illustrated on its own site by a full-height serpentine campus
// route (RamblerRegistrarWeb/src/components/journey/journeys.tsx TEASER_JOURNEY),
// which has no small-glyph equivalent. This distils that route to 24x24.
//
// Keys are kept in alphabetical order; insert new entries in their slot.
export const GLYPH_PATHS = {
  // ---- Cipher (verbatim) ----
  cipherBarcode: { d: 'M3 7.5 L3 5 L5.5 5 M18.5 5 L21 5 L21 7.5 M21 16.5 L21 19 L18.5 19 M5.5 19 L3 19 L3 16.5 M7 8.5 L7 15.5 M10 8.5 L10 15.5 M13.5 8.5 L13.5 15.5 M17 8.5 L17 15.5' },
  cipherChart:   { d: 'M4 20 L4 12 L8 12 L8 20 M10 20 L10 6 L14 6 L14 20 M16 20 L16 9.5 L20 9.5 L20 20 M3 20 L21 20' },
  cipherDrop:    { d: 'M12 3 C12 3 5.5 11 5.5 15.2 A6.5 6.5 0 0 0 18.5 15.2 C18.5 11 12 3 12 3 Z' },
  cipherDumbbell:{ d: 'M2.5 12 L4.5 12 M4.5 8.5 L6.8 8.5 L6.8 15.5 L4.5 15.5 Z M6.8 12 L17.2 12 M17.2 8.5 L19.5 8.5 L19.5 15.5 L17.2 15.5 Z M19.5 12 L21.5 12' },
  cipherLock:    { d: 'M7 11 L7 8 A5 5 0 0 1 17 8 L17 11 M5 11 L19 11 L19 21 L5 21 Z M12 15 L12 18' },
  cipherPhone:   { d: 'M7 3 L17 3 L17 21 L7 21 Z M10.5 18.2 L13.5 18.2' },
  cipherTarget:  { d: 'M12 21 A9 9 0 1 1 12 3 A9 9 0 0 1 12 21 Z M12 17 A5 5 0 1 1 12 7 A5 5 0 0 1 12 17 Z M12 13.2 A1.2 1.2 0 1 1 12 10.8 A1.2 1.2 0 0 1 12 13.2 Z' },

  // ---- Rambler (from RamblerRegistrarWeb) ----
  // SeatsAndProfs.tsx BellIcon — the seat-open watch alert.
  ramblerBell:   { d: 'M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9 M10.3 21a1.94 1.94 0 0 0 3.4 0' },
  // DegreeRing.tsx — the partial progress arc from the degree audit, closed by
  // the check PersonalizeDegree.tsx puts inside its "Stay on track" circle. A
  // full circle here would be indistinguishable from ramblerCompass at 26px.
  ramblerRing:   { d: 'M12 3 A9 9 0 1 1 3 12 M8.4 12.4 L11 15 L16.2 8.8' },
  // PersonalizeDegree.tsx "Find your fit" — the RIASEC preference quiz.
  ramblerCompass:{ d: 'M20.5 12 A8.5 8.5 0 1 1 3.5 12 A8.5 8.5 0 0 1 20.5 12 Z M15.6 8.4 L13 13 L8.4 15.6 L11 11 Z' },
  // SeatsAndProfs.tsx GaugeIcon — the 0-100 schedule score.
  ramblerGauge:  { d: 'M3.34 19a10 10 0 1 1 17.32 0 M12 14 L16 10' },
  // Flagship.tsx GridGlyph, scaled from its 16x16 grid — the weekly schedule.
  ramblerGrid:   { d: 'M4.5 2.25 L19.5 2.25 A2.25 2.25 0 0 1 21.75 4.5 L21.75 19.5 A2.25 2.25 0 0 1 19.5 21.75 L4.5 21.75 A2.25 2.25 0 0 1 2.25 19.5 L2.25 4.5 A2.25 2.25 0 0 1 4.5 2.25 Z M2.25 9 L21.75 9 M9 9 L9 21.75' },
  // PersonalizeDegree.tsx "Never asks for your LOCUS password".
  ramblerLock:   { d: 'M6.7 10.5 L17.3 10.5 A2.2 2.2 0 0 1 19.5 12.7 L19.5 17.8 A2.2 2.2 0 0 1 17.3 20 L6.7 20 A2.2 2.2 0 0 1 4.5 17.8 L4.5 12.7 A2.2 2.2 0 0 1 6.7 10.5 Z M8 10.5 V7 a4 4 0 0 1 8 0 v3.5' },
  // Distilled from the WalkJourney campus route — walk times between buildings.
  ramblerRoute:  { d: 'M5.2 19.4 A2 2 0 1 1 1.2 19.4 A2 2 0 0 1 5.2 19.4 Z M22.8 4.6 A2 2 0 1 1 18.8 4.6 A2 2 0 0 1 22.8 4.6 Z M4.4 17.5 C 9.5 16.2 5.8 12.4 11.6 11.4 C 17.4 10.4 14 6.6 19.6 6.5' },
  // SeatsAndProfs.tsx TrendDownIcon — seats draining, "fastest filling".
  ramblerTrend:  { d: 'M22 17 L13.5 8.5 L8.5 13.5 L2 7 M16 17 L22 17 L22 11' },

  // ---- Snipe IT (Lucide, the icon set the app itself ships) ----
  // The app draws its interface icons from lucide-react; its own artwork is
  // raster PNG, which cannot be tinted per theme. These are the exact Lucide
  // 0.562 glyphs the app imports, with <rect>/<circle>/<polyline> elements
  // rewritten as path data. Lucide is ISC-licensed. Drawn at 1.8 rather than
  // Lucide's default 2 so the weight matches the rest of this set.
  snipeAlert:    { d: 'M21.73 18 l-8 -14 a2 2 0 0 0 -3.48 0 l-8 14 A2 2 0 0 0 4 21 h16 a2 2 0 0 0 1.73 -3 M12 9 v4 M12 17 h.01' },
  snipeClipboard:{ d: 'M9 2 H15 A1 1 0 0 1 16 3 V5 A1 1 0 0 1 15 6 H9 A1 1 0 0 1 8 5 V3 A1 1 0 0 1 9 2 Z M16 4 h2 a2 2 0 0 1 2 2 v14 a2 2 0 0 1 -2 2 H6 a2 2 0 0 1 -2 -2 V6 a2 2 0 0 1 2 -2 h2 M9 14 l2 2 l4 -4' },
  snipeDatabase: { d: 'M21 5 A9 3 0 1 1 3 5 A9 3 0 0 1 21 5 Z M3 5 V19 A9 3 0 0 0 21 19 V5 M3 12 A9 3 0 0 0 21 12' },
  snipeLogIn:    { d: 'M10 17 l5 -5 l-5 -5 M15 12 H3 M15 3 h4 a2 2 0 0 1 2 2 v14 a2 2 0 0 1 -2 2 h-4' },
  snipeServer:   { d: 'M4 2 H20 A2 2 0 0 1 22 4 V8 A2 2 0 0 1 20 10 H4 A2 2 0 0 1 2 8 V4 A2 2 0 0 1 4 2 Z M4 14 H20 A2 2 0 0 1 22 16 V20 A2 2 0 0 1 20 22 H4 A2 2 0 0 1 2 20 V16 A2 2 0 0 1 4 14 Z M6 6 H6.01 M6 18 H6.01' },
  snipeTruck:    { d: 'M14 18 V6 a2 2 0 0 0 -2 -2 H4 a2 2 0 0 0 -2 2 v11 a1 1 0 0 0 1 1 h2 M15 18 H9 M19 18 h2 a1 1 0 0 0 1 -1 v-3.65 a1 1 0 0 0 -.22 -.624 l-3.48 -4.35 A1 1 0 0 0 17.52 8 H14 M19 18 A2 2 0 1 1 15 18 A2 2 0 0 1 19 18 Z M9 18 A2 2 0 1 1 5 18 A2 2 0 0 1 9 18 Z' },
};

// Names rendered as filled shapes rather than strokes.
export const FILLED = ['cipherDrop'];
