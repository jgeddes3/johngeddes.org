import React, { useId } from 'react';

/* Ratings are out of 10 site-wide; stars display as five with half-steps.
   SVG + currentColor so the same component works on the cream background,
   inside red buttons, and in dark mode without shipping star PNGs. */

const STAR_PATH = 'M12 2l2.95 6.32 6.65.62-5.02 4.55 1.47 6.68L12 16.9l-6.05 3.27 1.47-6.68L2.4 8.94l6.65-.62L12 2z';

const StarIcon = ({ fillLevel, size }) => {
  const id = useId();
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} aria-hidden="true" focusable="false">
      {fillLevel > 0 && fillLevel < 1 && (
        <defs>
          <clipPath id={id}>
            <rect x="0" y="0" width={24 * fillLevel} height="24" />
          </clipPath>
        </defs>
      )}
      <path d={STAR_PATH} fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" opacity="0.45" />
      {fillLevel >= 1 && <path d={STAR_PATH} fill="currentColor" />}
      {fillLevel > 0 && fillLevel < 1 && <path d={STAR_PATH} fill="currentColor" clipPath={`url(#${id})`} />}
    </svg>
  );
};

const Stars = ({ rating, size = 22, showNumber = false, className = '' }) => {
  const clamped = Math.max(0, Math.min(10, rating));
  return (
    <span
      className={`stars ${className}`.trim()}
      role="img"
      aria-label={`Rated ${clamped} out of 10`}
    >
      {[0, 1, 2, 3, 4].map((i) => (
        <StarIcon key={i} fillLevel={Math.max(0, Math.min(1, clamped / 2 - i))} size={size} />
      ))}
      {showNumber && <span className="stars-number" aria-hidden="true">{clamped}/10</span>}
    </span>
  );
};

export default Stars;
