/* Review registry. Every file in ./entries that default-exports a review
   object is picked up automatically — adding a review to the site is:
   drop images in ./images/<Slug>/, add one file to ./entries/. Routes,
   the Misc page, and the Friends page all read from here. */

const modules = import.meta.glob('./entries/*.js', { eager: true });

export const reviews = Object.values(modules)
  .map((m) => m.default)
  .filter(Boolean)
  .sort((a, b) => (b.rating ?? -1) - (a.rating ?? -1) || a.title.localeCompare(b.title));

export const books = reviews.filter((r) => r.type === 'book');
export const restaurants = reviews.filter((r) => r.type === 'restaurant');
export const recipes = reviews.filter((r) => r.type === 'recipe');

export const bySlug = (slug) => reviews.find((r) => r.slug === slug);
