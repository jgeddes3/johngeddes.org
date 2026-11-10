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
//   chess* — drawn for the Chess Deck page. Chess Deck ships no icon kit to
//            borrow from, so these are built from the game's own vocabulary
//            (the board, a card, the knight's profile) on the same grid.
//
// The other exception is `ramblerRoute`, drawn for this page: the app's walk-time
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

  // ---- Chess Deck (drawn for this page) ----
  // Chess Deck has no icon kit of its own to borrow from — it is a game, and its
  // only vocabulary is the board and the cards. These six are built from that
  // vocabulary on the same grid and weight as the rest.
  chessBoard:    { d: 'M3.5 3.5 H20.5 V20.5 H3.5 Z M8 3.5 V20.5 M12 3.5 V20.5 M16 3.5 V20.5 M3.5 8 H20.5 M3.5 12 H20.5 M3.5 16 H20.5' },
  chessCard:     { d: 'M6.5 2.8 H15 A1.8 1.8 0 0 1 16.8 4.6 V19.4 A1.8 1.8 0 0 1 15 21.2 H6.5 A1.8 1.8 0 0 1 4.7 19.4 V4.6 A1.8 1.8 0 0 1 6.5 2.8 Z M19.4 6.4 A1.8 1.8 0 0 1 20.6 8.1 V17.6 M8.2 7.4 H13.3 M8.2 10.6 H13.3' },
  chessClock:    { d: 'M12 21 A9 9 0 1 1 12 3 A9 9 0 0 1 12 21 Z M12 7.2 V12 L15.4 14.2' },
  chessCpu:      { d: 'M8 8 H16 V16 H8 Z M5 5 H19 V19 H5 Z M9.5 2.6 V5 M14.5 2.6 V5 M9.5 19 V21.4 M14.5 19 V21.4 M2.6 9.5 H5 M2.6 14.5 H5 M19 9.5 H21.4 M19 14.5 H21.4' },
  chessKnight:   { d: 'M8 20.6 H18.2 C18.2 15.4 17.4 11.6 14.6 8.8 L15.6 5.6 L12.9 6.6 L11.4 3.4 L9.9 7 C7.6 8.2 6 9.9 5.4 12.2 L8.4 13.4 L10.2 11 L11.6 12.2 C9.4 14.2 8 16.8 8 20.6 Z' },
  chessLink:     { d: 'M10.2 13.8 A3.4 3.4 0 0 0 15 13.8 L17.8 11 A3.4 3.4 0 0 0 13 6.2 L11.6 7.6 M13.8 10.2 A3.4 3.4 0 0 0 9 10.2 L6.2 13 A3.4 3.4 0 0 0 11 17.8 L12.4 16.4' },

  // ---- Hike Away Tours (drawn for this page) ----
  // The repo is headless so far — logic, rules, and a store, no UI and no icon
  // kit to borrow from. These six are built from the product's own vocabulary
  // (the booking calendar, the driver's van, the offline map pin, the ops chat,
  // the pipeline board, a pure module) on the same grid and weight as the rest.
  hikeBoard:     { d: 'M3 4 H8 V20 H3 Z M9.5 4 H14.5 V20 H9.5 Z M16 4 H21 V20 H16 Z M4.6 7.2 H6.4 M4.6 10.2 H6.4 M11.1 7.2 H12.9 M17.6 7.2 H19.4 M17.6 10.2 H19.4 M17.6 13.2 H19.4' },
  hikeChat:      { d: 'M4 4.5 H20 A1.5 1.5 0 0 1 21.5 6 V15 A1.5 1.5 0 0 1 20 16.5 H9 L4.5 20.5 V16.5 H4 A1.5 1.5 0 0 1 2.5 15 V6 A1.5 1.5 0 0 1 4 4.5 Z M8.6 10.6 L11 13 L15.6 8.4' },
  hikeCore:      { d: 'M12 2.8 L20 7.4 V16.6 L12 21.2 L4 16.6 V7.4 Z M12 12 L20 7.4 M12 12 V21.2 M12 12 L4 7.4' },
  hikeLanes:     { d: 'M4 5 H20 A1.5 1.5 0 0 1 21.5 6.5 V19.5 A1.5 1.5 0 0 1 20 21 H4 A1.5 1.5 0 0 1 2.5 19.5 V6.5 A1.5 1.5 0 0 1 4 5 Z M2.5 9.8 H21.5 M8 3 V7 M16 3 V7 M8.4 15 L11 17.6 L15.8 12.8' },
  hikeMap:       { d: 'M12 21.2 C12 21.2 5.5 14.6 5.5 9.6 A6.5 6.5 0 0 1 18.5 9.6 C18.5 14.6 12 21.2 12 21.2 Z M12 12.1 A2.5 2.5 0 1 1 12 7.1 A2.5 2.5 0 0 1 12 12.1 Z' },
  hikeVan:       { d: 'M2.5 16.5 V8.5 A1.5 1.5 0 0 1 4 7 H14 V16.5 M14 10 H17.8 L21.5 13.8 V16.5 H14 M2.5 16.5 H4.2 M8.8 16.5 H15.2 M19.8 16.5 H21.5 M8.8 17 A2.3 2.3 0 1 1 4.2 17 A2.3 2.3 0 0 1 8.8 17 Z M19.8 17 A2.3 2.3 0 1 1 15.2 17 A2.3 2.3 0 0 1 19.8 17 Z' },

  // ---- Route Weather (one glyph per forecast category, plus the trip sheet's
  // small marks). Clouds share one outline so a row of hours reads evenly.
  wxSun:       { d: 'M12 8 A4 4 0 1 1 11.99 8 Z M12 2.5 V4.5 M12 19.5 V21.5 M2.5 12 H4.5 M19.5 12 H21.5 M5.3 5.3 L6.7 6.7 M17.3 17.3 L18.7 18.7 M5.3 18.7 L6.7 17.3 M17.3 6.7 L18.7 5.3' },
  wxMoon:      { d: 'M20 14.5 A8.5 8.5 0 1 1 9.5 4 A7 7 0 0 0 20 14.5 Z' },
  wxPartly:    { d: 'M8.5 4 V2.5 M3.8 6 L4.9 7.1 M2.5 10.5 H4 M8.5 7 A3.5 3.5 0 0 1 12 10.3 M8 20 H17.5 A3.6 3.6 0 0 0 17.7 12.8 A5 5 0 0 0 8.2 13.9 A3.1 3.1 0 0 0 8 20 Z' },
  wxCloud:     { d: 'M7 18.5 H17.5 A4 4 0 0 0 17.8 10.5 A5.5 5.5 0 0 0 7.2 11.7 A3.4 3.4 0 0 0 7 18.5 Z' },
  wxFog:       { d: 'M7 14 H17.5 A4 4 0 0 0 17.8 6 A5.5 5.5 0 0 0 7.2 7.2 A3.4 3.4 0 0 0 7 14 Z M5 17.5 H15 M8.5 21 H19' },
  wxDrizzle:   { d: 'M7 15 H17.5 A4 4 0 0 0 17.8 7 A5.5 5.5 0 0 0 7.2 8.2 A3.4 3.4 0 0 0 7 15 Z M9 18 V20 M12.5 18 V20 M16 18 V20' },
  wxRain:      { d: 'M7 14.5 H17.5 A4 4 0 0 0 17.8 6.5 A5.5 5.5 0 0 0 7.2 7.7 A3.4 3.4 0 0 0 7 14.5 Z M9.8 17.5 L8.8 21 M13.3 17.5 L12.3 21 M16.8 17.5 L15.8 21' },
  wxHeavyRain: { d: 'M7 13.5 H17.5 A4 4 0 0 0 17.8 5.5 A5.5 5.5 0 0 0 7.2 6.7 A3.4 3.4 0 0 0 7 13.5 Z M9 16.5 L7.5 21.5 M12 16.5 L10.5 21.5 M15 16.5 L13.5 21.5 M18 16.5 L16.5 21.5' },
  wxSnow:      { d: 'M7 14.5 H17.5 A4 4 0 0 0 17.8 6.5 A5.5 5.5 0 0 0 7.2 7.7 A3.4 3.4 0 0 0 7 14.5 Z M9 18 V21 M7.7 19.5 H10.3 M13 18 V21 M11.7 19.5 H14.3 M17 18 V21 M15.7 19.5 H18.3' },
  wxSleet:     { d: 'M7 14.5 H17.5 A4 4 0 0 0 17.8 6.5 A5.5 5.5 0 0 0 7.2 7.7 A3.4 3.4 0 0 0 7 14.5 Z M9.8 17.5 L8.8 21 M13 18 V21 M11.7 19.5 H14.3 M16.8 17.5 L15.8 21' },
  wxStorm:     { d: 'M7 14 H17.5 A4 4 0 0 0 17.8 6 A5.5 5.5 0 0 0 7.2 7.2 A3.4 3.4 0 0 0 7 14 Z M13 15.5 L10.5 19 H13.5 L11 22.5' },
  wxWind:      { d: 'M3 9 H14 A2.5 2.5 0 1 0 11.5 6.5 M3 13 H18 A2.5 2.5 0 1 1 15.5 15.5 M3 17 H10' },
  wxDrop:      { d: 'M12 3.5 C12 3.5 6.5 10 6.5 14 A5.5 5.5 0 0 0 17.5 14 C17.5 10 12 3.5 12 3.5 Z' },
  wxPin:       { d: 'M12 21.5 C12 21.5 5.5 14.5 5.5 9.5 A6.5 6.5 0 0 1 18.5 9.5 C18.5 14.5 12 21.5 12 21.5 Z M12 9.5 A1.8 1.8 0 1 1 11.99 9.5 Z' },
  wxClock:     { d: 'M12 3 A9 9 0 1 1 11.99 3 Z M12 7.5 V12 L15 14' },

  // ---- Paper Trail ----
  paperFile:     { d: 'M6 3 H14 L19 8 V21 H6 Z M14 3 V8 H19 M12 11 V17.5 M9.5 15 L12 17.5 L14.5 15' },
  paperRepeat:   { d: 'M4 12 A8 8 0 0 1 18.3 7.2 M20 3.5 V8 H15.5 M20 12 A8 8 0 0 1 5.7 16.8 M4 20.5 V16 H8.5' },
  paperFlag:     { d: 'M5.5 21 V3.5 M5.5 4 H18.5 L15.5 8.5 L18.5 13 H5.5' },
  paperSplit:    { d: 'M12 3 A9 9 0 1 1 11.99 3 Z M12 3 V12 L18.4 18.4 M12 12 L5.6 18.4' },
  paperLock:     { d: 'M7.5 11 V8 A4.5 4.5 0 0 1 16.5 8 V11 M5 11 H19 V21 H5 Z M12 14.5 V17.5' },
  paperShield:   { d: 'M12 3 L19 6 V11 C19 16 15.5 19.5 12 21 C8.5 19.5 5 16 5 11 V6 Z M9 12 L11 14 L15 10' },

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
