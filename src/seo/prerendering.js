/* True while scripts/prerender.mjs is taking the static snapshot of a page.
   The snapshot is captured after mount, but React hydrates against the
   markup of its *first* render, so anything a component fills in from an
   effect (random picks, fetched data) must be left out of the snapshot or the
   two will not match. Components with that shape check this flag and keep
   their first-render state during prerendering. */
export const isPrerendering = () => typeof window !== 'undefined' && window.__PRERENDER__ === true;
