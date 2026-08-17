import cover from '../images/TheWayofKings/TheWayofKings.jpg';

export default {
  slug: 'WayOfKingsReview',
  type: 'book',
  title: 'The Way of Kings',
  author: 'Brandon Sanderson',
  series: 'The Stormlight Archive, Book One',
  rating: 10,
  status: 'published',
  blurb: 'Probably my favorite fantasy series — and I owe it to a stranger at a Super Bowl party.',
  seoDescription:
    'John Geddes reviews The Way of Kings, the first Stormlight Archive book by Brandon Sanderson: a slow start that becomes his favorite fantasy series.',
  links: [
    { label: 'Goodreads', url: 'https://www.goodreads.com/book/show/7235533-the-way-of-kings' },
    { label: 'Brandon Sanderson', url: 'https://www.goodreads.com/author/show/38550.Brandon_Sanderson' },
  ],
  blocks: [
    {
      kind: 'figure',
      side: 'right',
      image: {
        src: cover,
        alt: 'The Way of Kings book cover',
        caption: 'The Way of Kings by Brandon Sanderson',
      },
      text: "The Way of Kings is the first book of The Stormlight Archive, Brandon Sanderson's epic fantasy series. And Sanderson does it again: he sucked me into a massive series that's now probably my favorite fantasy series I've read to this date. The story of how I found it shows how the smallest things can have such a drastic impact on your life. I was at my sister's 49ers–Chiefs Super Bowl party, talking with people I'd never met and will never talk to again, when a guy brought up Red Rising. Red Rising is my favorite science fiction series and probably always will be, so my ears perked right up. We got to talking, I recommended him a few books — The Name of the Wind among them — and he recommended me this book right here.",
    },
    {
      kind: 'paragraph',
      text: "At first I didn't even think I'd read it. I bought it, and it didn't speak to me at all — I just couldn't relate to Kal while he was in Amaram's army. But I stuck with it and really got into it once he became a slave. Call it a slow start; the moment it picks up, I couldn't put it down. The attention to detail is crazy. I'm writing this review having just finished Rhythm of War, and the number of callbacks is insane. I could read only this series for a year and I don't think I'd ever get bored.",
    },
    {
      kind: 'paragraph',
      text: "The one complaint I hear that I actually get is that the book is long. That doesn't bother me in the least — there's very little I would cut. But I understand it: a book this size can feel daunting, especially when you're starting out. All I can tell you is that finishing the series is so worth it.",
    },
  ],
};
