/* Template for a review entry. Copy into src/reviews/entries/<Slug>.js
   (or run `npm run new:review` to scaffold one). The entry file is the ONLY
   thing to add — the route (/<slug>), the Misc page listing, and the Friends
   page listing are all generated from it.

   Images: put them in src/reviews/images/<Something>/ and import as below.
   Delete any field that doesn't apply. */

// import hero from '../images/MyPlace/exterior.jpg';
// import detail from '../images/MyPlace/food.jpg';

export default {
  slug: 'MyPlaceReview',           // URL: johngeddes.org/MyPlaceReview
  type: 'restaurant',              // 'book' | 'restaurant' | 'recipe'
  title: 'My Place',
  author: 'Author Name',           // books only
  series: 'Series Name, Book One', // books only, optional
  place: 'Chicago',                // restaurants only
  rating: 8,                       // out of 10; halves fine (7.5); null for recipes
  status: 'published',             // 'coming-soon' shows the rating + a "review on the way" note

  blurb: 'One line for listing cards, under ~90 characters.',
  seoDescription: 'One factual sentence for search engines, ~150 characters.',

  links: [
    // books: { label: 'Goodreads', url: 'https://www.goodreads.com/...' }
    // restaurants: Tripadvisor/Yelp profile links (copy from an existing entry)
  ],

  // Optional full-width photo under the byline (restaurants/recipes usually have one):
  // hero: { src: hero, alt: 'What the photo shows', caption: 'Caption with photo credit' },

  // The review body, in order. Three kinds of block:
  blocks: [
    { kind: 'paragraph', text: 'Plain paragraph. Inline links look like [this](#recipe) or [this](/misc).' },
    // {
    //   kind: 'figure',
    //   side: 'right', // or 'left'
    //   image: { src: detail, alt: '...', caption: '...' },
    //   text: 'Paragraph that sits beside the image.',
    // },
    // {
    //   kind: 'card', // recipe card — lines starting with "- " render as a list
    //   heading: 'Ingredients',
    //   text: '- 2 lb ground beef\n- 1 egg',
    // },
  ],
};
