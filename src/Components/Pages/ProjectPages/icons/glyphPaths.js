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
  cipherCalendar:{ d: 'M4 6 L20 6 L20 20 L4 20 Z M4 10 L20 10 M8 3.5 L8 7 M16 3.5 L16 7' },
  cipherChart:   { d: 'M4 20 L4 12 L8 12 L8 20 M10 20 L10 6 L14 6 L14 20 M16 20 L16 9.5 L20 9.5 L20 20 M3 20 L21 20' },
  cipherCheck:   { d: 'M4 13 L9.5 18.5 L20 6' },
  cipherDrop:    { d: 'M12 3 C12 3 5.5 11 5.5 15.2 A6.5 6.5 0 0 0 18.5 15.2 C18.5 11 12 3 12 3 Z' },
  cipherDumbbell:{ d: 'M2.5 12 L4.5 12 M4.5 8.5 L6.8 8.5 L6.8 15.5 L4.5 15.5 Z M6.8 12 L17.2 12 M17.2 8.5 L19.5 8.5 L19.5 15.5 L17.2 15.5 Z M19.5 12 L21.5 12' },
  cipherLock:    { d: 'M7 11 L7 8 A5 5 0 0 1 17 8 L17 11 M5 11 L19 11 L19 21 L5 21 Z M12 15 L12 18' },
  cipherNote:    { d: 'M5 4 L19 4 L19 20 L5 20 Z M8 9 L16 9 M8 12.5 L16 12.5 M8 16 L13 16' },
  cipherPhone:   { d: 'M7 3 L17 3 L17 21 L7 21 Z M10.5 18.2 L13.5 18.2' },
  cipherPulse:   { d: 'M2 12 L7 12 L9 8 L11.5 17 L14 10 L15.5 12 L22 12' },
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

  // ---- GateKeep (drawn for this page; the app itself uses Phosphor, which
  // this site does not ship) ----
  gateDates:     { d: 'M4 5 H20 A1.5 1.5 0 0 1 21.5 6.5 V19.5 A1.5 1.5 0 0 1 20 21 H4 A1.5 1.5 0 0 1 2.5 19.5 V6.5 A1.5 1.5 0 0 1 4 5 Z M2.5 9.8 H21.5 M8 3 V7 M16 3 V7 M7 13.5 H9 M11 13.5 H13 M15 13.5 H17 M7 17 H9 M11 17 H13' },
  gateFind:      { d: 'M12 21 A9 9 0 1 1 12 3 A9 9 0 0 1 12 21 Z M15.5 8.5 L13.6 13.6 L8.5 15.5 L10.4 10.4 Z' },
  gateHold:      { d: 'M6 10.5 H18 A1.5 1.5 0 0 1 19.5 12 V19.5 A1.5 1.5 0 0 1 18 21 H6 A1.5 1.5 0 0 1 4.5 19.5 V12 A1.5 1.5 0 0 1 6 10.5 Z M8 10.5 V7.5 A4 4 0 0 1 16 7.5 V10.5 M12 14.5 V17' },
  gateNote:      { d: 'M9 18 V5.5 L19 3.5 V16 M9 18 A2.5 2.5 0 1 1 4 18 A2.5 2.5 0 0 1 9 18 Z M19 16 A2.5 2.5 0 1 1 14 16 A2.5 2.5 0 0 1 19 16 Z' },
  gateTerms:     { d: 'M4 8 H18 M14.5 4.5 L18 8 L14.5 11.5 M20 16 H6 M9.5 12.5 L6 16 L9.5 19.5' },
  gateTicket:    { d: 'M3 7.5 A1.5 1.5 0 0 1 4.5 6 H19.5 A1.5 1.5 0 0 1 21 7.5 V10 A2 2 0 0 0 21 14 V16.5 A1.5 1.5 0 0 1 19.5 18 H4.5 A1.5 1.5 0 0 1 3 16.5 V14 A2 2 0 0 0 3 10 Z M14.5 6 V8 M14.5 11 V13 M14.5 16 V18' },

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

  // ---- Snipe IT (Lucide, the icon set the app shipped until October 2026; kept for older pages) ----
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

  // ---- Census (Solar Linear by 480 Design, CC BY 4.0: the icon set the app ships since October 2026) ----
  // Every path of each Solar glyph joined into one path string, circles rewritten as arcs.
  censusBox:     { d: 'M15.5777 3.38197L17.5777 4.43152C19.7294 5.56066 20.8052 6.12523 21.4026 7.13974C22 8.15425 22 9.41667 22 11.9415V12.0585C22 14.5833 22 15.8458 21.4026 16.8603C20.8052 17.8748 19.7294 18.4393 17.5777 19.5685L15.5777 20.618C13.8221 21.5393 12.9443 22 12 22C11.0557 22 10.1779 21.5393 8.42229 20.618L6.42229 19.5685C4.27063 18.4393 3.19479 17.8748 2.5974 16.8603C2 15.8458 2 14.5833 2 12.0585V11.9415C2 9.41667 2 8.15425 2.5974 7.13974C3.19479 6.12523 4.27063 5.56066 6.42229 4.43152L8.42229 3.38197C10.1779 2.46066 11.0557 2 12 2C12.9443 2 13.8221 2.46066 15.5777 3.38197Z M21 7.5L17 9.5M12 12L3 7.5M12 12V21.5M12 12C12 12 14.7426 10.6287 16.5 9.75C16.6953 9.65237 17 9.5 17 9.5M17 9.5V13M17 9.5L7.5 4.5' },
  censusTruck:   { d: 'M9.56541 8.73049C9.0804 6.97492 8.8379 6.09714 9.24954 5.40562C9.66119 4.71409 10.5662 4.47889 12.3763 4.00849L14.2962 3.50955C16.1062 3.03915 17.0113 2.80394 17.7242 3.20319C18.4372 3.60244 18.6797 4.48023 19.1647 6.2358L19.6792 8.09786C20.1642 9.85343 20.4067 10.7312 19.995 11.4227C19.5834 12.1143 18.6784 12.3495 16.8683 12.8199L14.9484 13.3188C13.1384 13.7892 12.2333 14.0244 11.5203 13.6252C10.8073 13.2259 10.5648 12.3481 10.0798 10.5926L9.56541 8.73049Z M8.23 15.0602L6.08 7.27014C5.89453 6.61732 5.38563 6.12036 4.7 5.92L3 5.4502 M10.9199 17.36L19.9999 15 M10.950000000000001 18.1 A2.9 2.9 0 1 1 5.15 18.1 A2.9 2.9 0 1 1 10.950000000000001 18.1 Z' },
  censusReturn:  { d: 'M4 7H15C17.7614 7 20 9.23857 20 12C20 14.7614 17.7614 17 15 17H8.00001M7 10L4 7L7 4' },
  censusBill:    { d: 'M16.755 2H7.24502C6.08614 2 5.50671 2 5.03939 2.16261C4.15322 2.47096 3.45748 3.18719 3.15795 4.09946C3 4.58055 3 5.17705 3 6.37006V20.3742C3 21.2324 3.985 21.6878 4.6081 21.1176C4.97417 20.7826 5.52583 20.7826 5.8919 21.1176L6.375 21.5597C7.01659 22.1468 7.98341 22.1468 8.625 21.5597C9.26659 20.9726 10.2334 20.9726 10.875 21.5597C11.5166 22.1468 12.4834 22.1468 13.125 21.5597C13.7666 20.9726 14.7334 20.9726 15.375 21.5597C16.0166 22.1468 16.9834 22.1468 17.625 21.5597L18.1081 21.1176C18.4742 20.7826 19.0258 20.7826 19.3919 21.1176C20.015 21.6878 21 21.2324 21 20.3742V6.37006C21 5.17705 21 4.58055 20.842 4.09946C20.5425 3.18719 19.8468 2.47096 18.9606 2.16261C18.4933 2 17.9139 2 16.755 2Z M10.5 11L17 11 M7 11H7.5 M7 7.5H7.5 M7 14.5H7.5 M10.5 7.5H17 M10.5 14.5H17' },
  censusClock:   { d: 'M12 8V12L14.5 14.5 M22 12 A10 10 0 1 1 2 12 A10 10 0 1 1 22 12 Z' },
  censusUser:    { d: 'M20 17.5C20 19.9853 20 22 12 22C4 22 4 19.9853 4 17.5C4 15.0147 7.58172 13 12 13C16.4183 13 20 15.0147 20 17.5Z M16 6 A4 4 0 1 1 8 6 A4 4 0 1 1 16 6 Z' },
  censusLaptop:  { d: 'M19.6471 15.5357H4.35294M19.6471 15.5357V8C19.6471 6.11438 19.6471 5.17157 19.0613 4.58579C18.4755 4 17.5327 4 15.6471 4H8.35294C6.46732 4 5.52451 4 4.93873 4.58579C4.35294 5.17157 4.35294 6.11438 4.35294 8V15.5357M19.6471 15.5357L21.3911 17.3358C21.4356 17.3818 21.4579 17.4048 21.4787 17.4276C21.7998 17.7802 21.9843 18.2358 21.999 18.7124C22 18.7433 22 18.7753 22 18.8393C22 18.9885 22 19.0631 21.996 19.1261C21.9325 20.1314 21.1314 20.9325 20.1261 20.996C20.0631 21 19.9885 21 19.8393 21H4.16068C4.01148 21 3.93688 21 3.87388 20.996C2.86865 20.9325 2.06749 20.1314 2.00398 19.1261C2 19.0631 2 18.9885 2 18.8393C2 18.7753 2 18.7433 2.00096 18.7124C2.01569 18.2358 2.20022 17.7802 2.52127 17.4276C2.54208 17.4048 2.56438 17.3818 2.60888 17.3358L4.35294 15.5357 M9.5 18.5H14.5 M12 6.75H12.0001' },
  censusCart:    { d: 'M7.5 18C8.32843 18 9 18.6716 9 19.5C9 20.3284 8.32843 21 7.5 21C6.67157 21 6 20.3284 6 19.5C6 18.6716 6.67157 18 7.5 18Z M16.5 18.0001C17.3284 18.0001 18 18.6716 18 19.5001C18 20.3285 17.3284 21.0001 16.5 21.0001C15.6716 21.0001 15 20.3285 15 19.5001C15 18.6716 15.6716 18.0001 16.5 18.0001Z M2 3L2.26121 3.09184C3.5628 3.54945 4.2136 3.77826 4.58584 4.32298C4.95808 4.86771 4.95808 5.59126 4.95808 7.03836V9.76C4.95808 12.7016 5.02132 13.6723 5.88772 14.5862C6.75412 15.5 8.14857 15.5 10.9375 15.5H16.2404C17.8014 15.5 18.5819 15.5 19.1336 15.0504C19.6853 14.6008 19.8429 13.8364 20.158 12.3075L20.6578 9.88275C21.0049 8.14369 21.1784 7.27417 20.7345 6.69708C20.2906 6.12 18.7738 6.12 17.0888 6.12H4.95808' },
};

// Names rendered as filled shapes rather than strokes.
export const FILLED = ['cipherDrop'];
