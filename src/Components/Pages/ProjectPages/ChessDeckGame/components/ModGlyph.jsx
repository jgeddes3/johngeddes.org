import React from 'react';
import { MODIFIER_GLYPHS } from '../modifierGlyphs.js';

// Renders one modifier badge. Filled rather than stroked, and inheriting
// `currentColor`, so the same mark can be tinted per player or per square
// state — neither of which the emoji it replaces could do.
//
// `label` is required: these badges carry real game state (a shielded piece
// plays differently from a frozen one), so they are announced rather than
// hidden from assistive tech.
const ModGlyph = ({ name, label, size = '1em', className }) => {
  const glyph = MODIFIER_GLYPHS[name];
  if (!glyph) return null;

  return (
    <svg
      className={className}
      width={size}
      height={size}
      viewBox="0 0 24 24"
      role="img"
      aria-label={label || name}
      focusable="false"
    >
      <path d={glyph.d} fill="currentColor" fillRule={glyph.evenOdd ? 'evenodd' : 'nonzero'} />
    </svg>
  );
};

export default ModGlyph;
