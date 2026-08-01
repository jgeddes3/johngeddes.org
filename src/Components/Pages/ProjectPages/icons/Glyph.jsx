import React from 'react';
import { GLYPH_PATHS, FILLED } from './glyphPaths';

// Monochrome 24x24 line icon, tinted by `currentColor` so it inherits the
// surrounding text colour in both themes. Decorative by default — the feature
// card's heading already names the thing — so it is hidden from assistive tech
// unless a `label` is passed.
const Glyph = ({ name, size = 28, strokeWidth = 1.8, label, className }) => {
  const glyph = GLYPH_PATHS[name];
  if (!glyph) return null;

  const filled = FILLED.includes(name);

  return (
    <svg
      className={className}
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      role={label ? 'img' : undefined}
      aria-label={label}
      aria-hidden={label ? undefined : 'true'}
      focusable="false"
    >
      <path
        d={glyph.d}
        stroke={filled ? 'none' : 'currentColor'}
        strokeWidth={filled ? 0 : strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
        fill={filled ? 'currentColor' : 'none'}
      />
    </svg>
  );
};

export default Glyph;
