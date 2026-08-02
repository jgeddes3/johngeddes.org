// Pure data — no imports. 24x24 FILLED marks for the piece and square
// modifier badges, replacing the emoji those badges used to render.
//
// Filled, not stroked, on purpose: these draw at roughly 10-12 CSS px
// (`font-size: calc(min(560px, 90vw) / 56)`), where the 1.8px stroke used by
// the rest of the site's glyphs falls below half a pixel and disappears. The
// bar here is "distinguishable at a glance", not "representational" — at this
// size silhouette is the only thing that survives.
//
// Emoji were the previous solution and had three problems: they render
// differently on every platform, they cannot be tinted to match a player's
// colour, and shield and bodyguard were assigned the SAME emoji, so two
// distinct states looked identical on the board.
export const MODIFIER_GLYPHS = {
  // ── Piece modifiers ────────────────────────────────────────────────
  // Heater shield.
  shield: { d: 'M12 1.5 L21.5 5 V11.2 C21.5 16.9 17.6 21.4 12 23 C6.4 21.4 2.5 16.9 2.5 11.2 V5 Z' },
  // Padlock: the piece is locked in place. Was a cut gem, which at 11px was
  // indistinguishable from the boulder used for Immovable Rock.
  petrified: { d: 'M7.4 10 V7.2 A4.6 4.6 0 0 1 16.6 7.2 V10 H18.6 A1.4 1.4 0 0 1 20 11.4 V20.6 A1.4 1.4 0 0 1 18.6 22 H5.4 A1.4 1.4 0 0 1 4 20.6 V11.4 A1.4 1.4 0 0 1 5.4 10 Z M9.8 10 H14.2 V7.2 A2.2 2.2 0 0 0 9.8 7.2 Z', evenOdd: true },
  // The knight's move as an L with an arrowhead.
  knightMovement: { d: 'M4.5 3.5 H10 V13 H15 V8.6 L21.5 15 L15 21.4 V17 H4.5 Z' },
  // Five-point star: a marked piece worth taking.
  bounty: { d: 'M12 1.8 L15 8.7 L22.4 9.4 L16.8 14.4 L18.5 21.8 L12 18 L5.5 21.8 L7.2 14.4 L1.6 9.4 L9 8.7 Z' },
  // Open eye — the piece is being watched over. Pupil is a hole (even-odd).
  vigil: { d: 'M12 4.5 C18 4.5 22.2 9.6 23 12 C22.2 14.4 18 19.5 12 19.5 C6 19.5 1.8 14.4 1 12 C1.8 9.6 6 4.5 12 4.5 Z M12 8.4 A3.6 3.6 0 1 0 12 15.6 A3.6 3.6 0 0 0 12 8.4 Z', evenOdd: true },

  // ── Square modifiers ───────────────────────────────────────────────
  // Boulder: wide, low and angular, so its silhouette stays distinct from the
  // taller badges when both are only a few pixels across.
  rock: { d: 'M2 19.6 L5.4 11 L10.6 6.6 L17.4 8 L22 14.6 L21 19.6 Z' },
  // Four-point sparkle for a blessed square.
  holyGround: { d: 'M12 1.5 C13 7.4 16.6 11 22.5 12 C16.6 13 13 16.6 12 22.5 C11 16.6 7.4 13 1.5 12 C7.4 11 11 7.4 12 1.5 Z' },
  // Ring collapsing inward — a hole in the board (even-odd).
  sinkhole: { d: 'M12 2 A10 10 0 1 0 12 22 A10 10 0 0 0 12 2 Z M12 7.6 A4.4 4.4 0 1 1 12 16.4 A4.4 4.4 0 0 1 12 7.6 Z', evenOdd: true },
  // Crenellated tower.
  watchtower: { d: 'M4.6 7.2 V3.6 H8 V6 H10.3 V3.6 H13.7 V6 H16 V3.6 H19.4 V7.2 L17.6 9 V20.6 H6.4 V9 Z' },
};
