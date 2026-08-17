import exterior from '../images/Hopleaf/HopLeafExterior.jpg';
import mussels from '../images/Hopleaf/Mussels.jpg';

export default {
  slug: 'Hopleaf',
  type: 'restaurant',
  title: 'Hopleaf',
  place: 'Andersonville, Chicago',
  rating: 9,
  status: 'published',
  blurb: 'Still the first place I send Chicago visitors — the brisket reuben alone is worth it.',
  seoDescription:
    'Review of Hopleaf in Chicago: a rotating draft list of fifty-plus beers, oysters, poutine, and a standout brisket reuben. Rated 9/10.',
  links: [
    { label: 'Tripadvisor', url: 'https://www.tripadvisor.com/Profile/JohnHoss' },
    { label: 'Yelp', url: 'https://www.yelp.com/user_details_reviews_self?userid=fgyF6oOG788lkuxtjUWFFg' },
  ],
  hero: {
    src: exterior,
    alt: 'The Hopleaf storefront',
    caption: 'Hopleaf exterior — photo by Tripadvisor user WarmWeatherPlease013, 2019',
  },
  blocks: [
    {
      kind: 'paragraph',
      text: "I've been to Hopleaf a handful of times now, and it's still the first place I tell people to go when they're visiting Chicago. Even if you live here and haven't been, you're missing out.",
    },
    {
      kind: 'paragraph',
      text: "The beer list is massive — something like fifty-plus drafts at any given time, rotating constantly — with everything from local Chicago breweries to random European ales you've never heard of. I've barely made a dent in it, though I have tried every cider they've had on tap.",
    },
    {
      kind: 'figure',
      side: 'right',
      image: {
        src: mussels,
        alt: 'A pot of mussels at Hopleaf',
        caption: "Mussels for one — photo by Yelp user Sallie, 2022",
      },
      text: "The food is legit too. The oysters are great — go for those if you like seafood, and they pair well with whatever lighter beer you've got going. Fair warning: they're pretty filling, so if you order an entrée afterward, you'll probably be taking it home.",
    },
    {
      kind: 'paragraph',
      text: "The poutine is another go-to. Fries, gravy, cheese curds — you know the deal, but they do it really well. Grab a darker beer with it and you're set. I order it pretty much every time.",
    },
    {
      kind: 'paragraph',
      text: "The real star, though, is the brisket reuben. The brisket is smoky, the sauerkraut and cheese work, and the rye bread has a good crunch. It's a big sandwich — you won't leave hungry. Probably my favorite thing on the menu.",
    },
    {
      kind: 'paragraph',
      text: "Great beer, great food, and an atmosphere to match. I'll keep going back, and I'll keep telling people to check it out. One practical note: on a Thursday, Friday, or Saturday you may be hard-pressed to find a seat — though that's true of anywhere good in the neighborhood.",
    },
  ],
};
