/* schema.org builders. Each returns a plain object; SEO.jsx serialises them
   into <script type="application/ld+json"> tags and the prerender script
   writes the same objects into the static HTML. Plain data only: this file
   is loaded in Node by the build scripts. */
import { SITE, PERSON } from './site';

const CONTEXT = 'https://schema.org';
const absolute = (path) => (/^https?:\/\//.test(path) ? path : `${SITE.url}${path}`);

/* The site's author, as a reference. withContext=true makes it a standalone block. */
export function person(withContext = false) {
  return {
    ...(withContext ? { '@context': CONTEXT } : {}),
    '@type': 'Person',
    '@id': `${SITE.url}/#person`,
    name: PERSON.name,
    alternateName: PERSON.alternateName,
    givenName: PERSON.givenName,
    familyName: PERSON.familyName,
    url: `${SITE.url}/`,
    jobTitle: PERSON.jobTitle,
    description: PERSON.description,
    disambiguatingDescription: PERSON.disambiguatingDescription,
    email: `mailto:${SITE.email}`,
    homeLocation: { '@type': 'Place', name: `${PERSON.city}, ${PERSON.region}` },
    address: {
      '@type': 'PostalAddress',
      addressLocality: PERSON.city,
      addressRegion: PERSON.region,
      addressCountry: PERSON.country,
    },
    worksFor: { '@type': 'Organization', name: PERSON.worksFor },
    alumniOf: { '@type': 'CollegeOrUniversity', name: PERSON.alumniOf },
    knowsAbout: PERSON.knowsAbout,
    sameAs: PERSON.sameAs,
  };
}

/* The short reference other blocks use for the author. */
const authorRef = () => ({ '@type': 'Person', '@id': `${SITE.url}/#person`, name: PERSON.name, url: `${SITE.url}/` });

/* Home page only. Tells search engines which name to show for the site. */
export function website() {
  return {
    '@context': CONTEXT,
    '@type': 'WebSite',
    '@id': `${SITE.url}/#website`,
    name: SITE.name,
    alternateName: ['johngeddes.org', 'John Geddes · AV & Software Engineer'],
    url: `${SITE.url}/`,
    description: SITE.description,
    inLanguage: 'en',
    author: authorRef(),
    publisher: authorRef(),
  };
}

/* The About page is the canonical profile of the person. */
export function profilePage(path) {
  return {
    '@context': CONTEXT,
    '@type': 'ProfilePage',
    url: absolute(path),
    mainEntity: person(),
  };
}

/* Home > ... > this page. */
export function breadcrumbs(crumbs) {
  const all = [{ name: 'Home', path: '/' }, ...crumbs];
  return {
    '@context': CONTEXT,
    '@type': 'BreadcrumbList',
    itemListElement: all.map((c, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: c.name,
      item: absolute(c.path),
    })),
  };
}

/* A built app, from a PAGES[...].project record. */
export function softwareApplication(project, path, image) {
  return {
    '@context': CONTEXT,
    '@type': 'SoftwareApplication',
    name: project.name,
    applicationCategory: project.category,
    operatingSystem: project.os,
    description: project.summary,
    url: absolute(project.url || path),
    image,
    author: authorRef(),
    offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
  };
}

/* The thing a review is about: a book or a restaurant. */
function reviewedItem(review) {
  if (review.type === 'book') {
    return {
      '@type': 'Book',
      name: review.title,
      ...(review.author ? { author: { '@type': 'Person', name: review.author } } : {}),
      ...(review.series ? { isPartOf: { '@type': 'BookSeries', name: review.series } } : {}),
    };
  }
  // Restaurant. `place` reads like "Andersonville, Chicago"; the city is the last part.
  const parts = (review.place || '').split(',').map((s) => s.trim()).filter(Boolean);
  const city = parts.length ? parts[parts.length - 1] : 'Chicago';
  return {
    '@type': 'Restaurant',
    name: review.title,
    address: { '@type': 'PostalAddress', addressLocality: city, addressRegion: 'IL', addressCountry: 'US' },
  };
}

/* A rated book or restaurant review. `body` is the first paragraph, when written. */
export function review(entry, path, image, dateModified) {
  const firstParagraph = (entry.blocks || []).find((b) => b.kind === 'paragraph' && b.text);
  return {
    '@context': CONTEXT,
    '@type': 'Review',
    name: `${entry.title} review`,
    url: absolute(path),
    author: authorRef(),
    publisher: authorRef(),
    inLanguage: 'en',
    itemReviewed: reviewedItem(entry),
    ...(entry.rating != null
      ? { reviewRating: { '@type': 'Rating', ratingValue: entry.rating, bestRating: 10, worstRating: 1 } }
      : {}),
    ...(firstParagraph ? { reviewBody: firstParagraph.text } : {}),
    ...(image ? { image } : {}),
    ...(dateModified ? { dateModified } : {}),
  };
}

/* A recipe, from the entry's structured `recipe` block (see templates/README.md). */
export function recipe(entry, path, image, dateModified) {
  const r = entry.recipe || {};
  return {
    '@context': CONTEXT,
    '@type': 'Recipe',
    name: entry.title,
    url: absolute(path),
    description: entry.seoDescription,
    author: authorRef(),
    inLanguage: 'en',
    ...(image ? { image: [image] } : {}),
    ...(r.yield ? { recipeYield: r.yield } : {}),
    ...(r.prepTime ? { prepTime: r.prepTime } : {}),
    ...(r.cookTime ? { cookTime: r.cookTime } : {}),
    ...(r.totalTime ? { totalTime: r.totalTime } : {}),
    ...(r.category ? { recipeCategory: r.category } : {}),
    ...(r.cuisine ? { recipeCuisine: r.cuisine } : {}),
    ...(r.ingredients?.length ? { recipeIngredient: r.ingredients } : {}),
    ...(r.steps?.length
      ? { recipeInstructions: r.steps.map((text) => ({ '@type': 'HowToStep', text })) }
      : {}),
    ...(dateModified ? { dateModified } : {}),
  };
}

/* A philosophy essay. */
export function article(essay, path, image, dateModified) {
  return {
    '@context': CONTEXT,
    '@type': 'Article',
    headline: essay.title,
    description: essay.seoDescription || essay.deck,
    url: absolute(path),
    mainEntityOfPage: absolute(path),
    author: authorRef(),
    publisher: authorRef(),
    inLanguage: 'en',
    ...(image ? { image } : {}),
    ...(essay.date ? { datePublished: essay.date } : {}),
    ...(dateModified || essay.date ? { dateModified: dateModified || essay.date } : {}),
    ...(essay.category ? { articleSection: essay.category } : {}),
  };
}

/* JSON for a <script type="application/ld+json">. "<" is escaped so no value
   can close the script element early. */
export function serialize(data) {
  return JSON.stringify(data).replace(/</g, '\\u003c');
}
