/* Template for a philosophy essay entry. Copy into src/philosophy/entries/<Slug>.js
   (or run `npm run new:essay` to scaffold one). The entry file is the ONLY thing
   to add — the route (/<slug>) and the Philosophy page shelf come from it.

   Images: put them in src/philosophy/images/<Something>/ and import as below.
   Delete any field that doesn't apply. */

// import figure from '../images/MyEssay/figure.jpg';

export default {
  slug: 'MyEssay',                 // URL: johngeddes.org/MyEssay
  category: 'general',             // 'general' | 'neuroethics' | 'technology' | 'political' | 'world'
  title: 'My Essay',
  deck: 'One line under the title and on the shelf, under ~90 characters.',
  date: '2026-11-04',              // ISO date; shown as "Nov 2026" and used to sort newest first
  status: 'published',             // 'coming-soon' lists the title and date with a "soon" tag

  seoDescription: 'One factual sentence for search engines, ~150 characters.',

  // Optional quotation under the byline:
  // epigraph: { text: 'If this myth is tragic, it is because the hero is conscious.', attribution: 'Albert Camus, The Myth of Sisyphus' },

  // The essay body, in order. Block kinds:
  blocks: [
    { kind: 'heading', text: 'A section heading' },
    { kind: 'paragraph', text: 'Plain paragraph. Inline links look like [this](/MythOfSisyphusReview) or [this](https://example.com).' },
    // { kind: 'pullquote', text: 'A line worth lifting out of the text.' },
    // { kind: 'blockquote', text: 'Someone else\'s words, set off from the body.' },
    // { kind: 'divider' },
    // { kind: 'image', image: { src: figure, alt: 'What the photo shows', caption: 'Caption with credit' } },
    // {
    //   kind: 'figure',
    //   side: 'right', // or 'left'
    //   image: { src: figure, alt: '...', caption: '...' },
    //   text: 'Paragraph that sits beside the image.',
    // },
  ],
};
