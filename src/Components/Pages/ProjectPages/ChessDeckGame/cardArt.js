// Pure data — no imports. Card art as SVG path data, keyed by card id, drawn on
// a 280x140 grid: the 2:1 art band at the top of a card, authored at 2x.
//
// House rules for an entry:
//   - viewBox is "0 0 280 140". Keep the subject inside the centre ~88% — the
//     card's aspect drifts from 2.000:1 to 2.083:1 at mobile widths, and the
//     band crops rather than squashes.
//   - Filled silhouettes, not strokes. The band renders 70px tall on desktop
//     and 53px on a phone, so a shape has to survive being 12px of detail: one
//     bold profile beats an illustration every time.
//   - No colour of its own. The renderer applies `fill="currentColor"`, which
//     Card.jsx sets per card from the field's luminance, so the same path reads
//     on Holy Ground's cream and Sinkhole's near-black alike.
//   - `evenOdd: true` when the shape needs a hole punched through it.
//
// Any card without an entry falls back to the monogram plate, so this table can
// be filled in one card at a time without the deck ever looking half-broken.
export const CARD_ART = {
  // Fortify — a shield.
  '1': { d: 'M140 16 L206 42 V76 C206 104 178 122 140 134 C102 122 74 104 74 76 V42 Z' },

  // Fog of War — banks of fog, the far ones thinning out.
  '2': { d: 'M60 34 H196 A10 10 0 0 1 196 54 H60 A10 10 0 0 1 60 34 Z M84 62 H220 A10 10 0 0 1 220 82 H84 A10 10 0 0 1 84 62 Z M60 90 H180 A10 10 0 0 1 180 110 H60 A10 10 0 0 1 60 90 Z' },

  // Double Time — two chevrons, motion doubled.
  '3': { d: 'M72 26 L118 70 L72 114 L52 96 L80 70 L52 44 Z M148 26 L194 70 L148 114 L128 96 L156 70 L128 44 Z' },

  // Sabotage — a charge with a lit fuse.
  '4': { d: 'M124 84 m-46 0 a46 46 0 1 0 92 0 a46 46 0 1 0 -92 0 Z M158 50 C176 26 200 18 226 20 C206 32 194 44 184 64 Z' },

  // Stallion Spirit — the knight's leap, L-shaped.
  '5': { d: 'M62 132 V34 H100 V96 H166 V132 Z M156 62 L216 100 L156 138 Z' },

  // Petrify — a padlock, shackle closed.
  '6': { d: 'M108 62 V44 A32 32 0 0 1 172 44 V62 H184 A10 10 0 0 1 194 72 V122 A10 10 0 0 1 184 132 H96 A10 10 0 0 1 86 122 V72 A10 10 0 0 1 96 62 Z M128 62 H152 V44 A12 12 0 0 0 128 44 Z', evenOdd: true },

  // Promotion Decree — a crown.
  '7': { d: 'M64 118 L78 34 L108 72 L140 20 L172 72 L202 34 L216 118 Z' },

  // Bounty — a coin purse, drawn tight.
  '8': { d: 'M112 30 H168 L156 54 C186 64 202 88 202 108 A26 26 0 0 1 176 134 H104 A26 26 0 0 1 78 108 C78 88 94 64 124 54 Z' },

  // Vigil — an open eye.
  '9': { d: 'M32 70 C70 26 210 26 248 70 C210 114 70 114 32 70 Z M140 44 a26 26 0 1 0 0.1 0 Z', evenOdd: true },

  // Excommunicate — a crown cast down.
  '10': { d: 'M78 66 L88 14 L112 40 L140 4 L168 40 L192 14 L202 66 Z M118 82 H162 V106 H190 L140 140 L90 106 H118 Z' },

  // Immovable Rock — a boulder, flat and heavy.
  '11': { d: 'M34 126 L70 58 L114 26 L176 36 L226 82 L242 126 Z' },

  // Holy Ground — a halo over consecrated ground. Drawn as an open ring: the
  // earlier arc closed against the slab and read as a padlock, which is
  // exactly what Petrify already is.
  '12': { d: 'M84 104 H196 V132 H84 Z M140 8 a44 44 0 1 0 0.1 0 Z M140 30 a22 22 0 1 1 -0.1 0 Z', evenOdd: true },

  // Sinkhole — a funnel with the ground falling away.
  '13': { d: 'M40 44 C40 20 240 20 240 44 C240 60 190 66 172 76 L150 132 H130 L108 76 C90 66 40 60 40 44 Z' },

  // Watchtower — a crenellated tower.
  '14': { d: 'M92 46 V26 H108 V38 H124 V26 H140 V38 H156 V26 H172 V38 H188 V26 H204 V46 H196 L206 132 H90 L100 46 Z' },

  // Conscription — a pawn, built from separate masses so it survives 70px.
  '15': { d: 'M140 12 a28 28 0 1 1 -0.1 0 Z M120 66 H160 L166 88 H114 Z M110 96 H170 L184 132 H96 Z' },

  // Catapult — a rook and the arc of its throw.
  '16': { d: 'M40 54 V34 H58 V46 H74 V34 H92 V46 H108 V34 H126 V54 H118 L126 132 H40 L48 54 Z M144 128 C158 74 196 44 244 40 V60 C206 64 176 88 164 132 Z' },

  // Switcheroo — two places trading.
  '17': { d: 'M56 44 H190 V22 L240 54 L190 86 V64 H56 Z M224 118 H90 V140 L40 108 L90 76 V98 H224 Z' },

  // Gambit — one blade given for another.
  '18': { d: 'M42 26 L64 22 L214 122 L206 136 Z M238 26 L216 22 L66 122 L74 136 Z' },

  // Recall — a piece brought home.
  '19': { d: 'M204 26 V72 A44 44 0 0 1 160 116 H92 V90 H160 A18 18 0 0 0 178 72 V26 Z M92 68 L92 138 L34 103 Z' },

  // Hasty Retreat — the king sidesteps.
  '20': { d: 'M28 116 L38 58 L62 86 L90 44 L118 86 L142 58 L152 116 Z M186 40 L246 78 L186 116 V96 H150 V60 H186 Z' },

  // Second Chance — the glass turned over.
  '21': { d: 'M76 14 H204 V32 C204 56 168 66 152 70 C168 74 204 84 204 108 V126 H76 V108 C76 84 112 74 128 70 C112 66 76 56 76 32 Z' },
};

// Initials used when a card has no art yet. Multi-word cards take one letter
// per word ("Fog of War" -> "FW"); single-word cards take two ("Sabotage" ->
// "Sa"), because first-letter-only put Sabotage, Sinkhole and Switcheroo on the
// same plate. The mixed casing is deliberate — it reads as a word fragment
// rather than a set of initials. cards.test.js asserts these stay unique.
export function monogramFor(name) {
  const words = name.split(/\s+/).filter((w) => !/^(of|the|a|an)$/i.test(w));
  if (words.length === 1) {
    return words[0][0].toUpperCase() + (words[0][1] || '').toLowerCase();
  }
  return words.slice(0, 2).map((w) => w[0].toUpperCase()).join('');
}

// The art field runs from near-black (Sinkhole) to cream (Holy Ground), so a
// single ink colour cannot work on all 21 cards — a fixed dark mark is invisible
// on Sabotage's red and Excommunicate's purple. Pick the ink from the field's
// own luminance instead.
const INK_ALPHA = 0.82;
const DARK_INK = [18, 22, 34];
const LIGHT_INK = [248, 244, 233];

function toRgb(hex) {
  let h = hex.replace('#', '');
  if (h.length === 3) h = h.split('').map((c) => c + c).join('');
  return [0, 2, 4].map((i) => parseInt(h.slice(i, i + 2), 16));
}

/** WCAG 2.1 relative luminance from 0-255 channels. */
function luminance([r, g, b]) {
  const lin = (c) => {
    const v = c / 255;
    return v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4;
  };
  return 0.2126 * lin(r) + 0.7152 * lin(g) + 0.0722 * lin(b);
}

function contrast(a, b) {
  const [hi, lo] = [luminance(a), luminance(b)].sort((x, y) => y - x);
  return (hi + 0.05) / (lo + 0.05);
}

/**
 * Ink for whatever sits in the art band, measured against the field behind it.
 *
 * A luminance threshold is the usual shortcut, but it picks wrong on the
 * mid-tone fields this deck is full of — Hasty Retreat's teal sits just under
 * any sensible cutoff while still taking dark ink far better than light. So
 * composite both candidates over the field and keep whichever wins outright.
 */
export function artInkFor(artColor) {
  const field = toRgb(artColor);
  const over = (ink) => ink.map((c, i) => INK_ALPHA * c + (1 - INK_ALPHA) * field[i]);
  const best = contrast(over(DARK_INK), field) >= contrast(over(LIGHT_INK), field)
    ? DARK_INK
    : LIGHT_INK;
  return `rgba(${best[0]}, ${best[1]}, ${best[2]}, ${INK_ALPHA})`;
}

/** Contrast the chosen ink actually achieves on a field. Used by the tests. */
export function artInkContrast(artColor) {
  const field = toRgb(artColor);
  const [r, g, b, a] = artInkFor(artColor).match(/[\d.]+/g).map(Number);
  return contrast([r, g, b].map((c, i) => a * c + (1 - a) * field[i]), field);
}
