import tandoori from '../images/TavaFresh/Tava1.webp';
import fishAndLassi from '../images/TavaFresh/Tava2.jpg';

export default {
  slug: 'TavaFreshIndian',
  type: 'restaurant',
  title: 'TAVA Fresh Taste of India',
  place: 'Chicagoland',
  rating: 7,
  status: 'published',
  blurb: "Some of the best Indian food I've had in Chicago — and alcoholic lassis, of all things.",
  seoDescription:
    'John Geddes reviews TAVA Fresh Taste of India in Chicago: Tandoori Chicken, Chicken Makhani, alcoholic lassis, and service that lagged behind the food.',
  links: [
    { label: 'Tripadvisor', url: 'https://www.tripadvisor.com/Profile/JohnHoss' },
    { label: 'Yelp', url: 'https://www.yelp.com/user_details_reviews_self?userid=fgyF6oOG788lkuxtjUWFFg' },
  ],
  hero: {
    src: tandoori,
    alt: 'Tandoori chicken and Tava fish tandoori',
    caption: 'Tandoori chicken and Tava fish tandoori — photo by John Geddes, 2024',
  },
  blocks: [
    {
      kind: 'paragraph',
      text: "TAVA Fresh Taste of India serves some of the best Indian food I've had in Chicago — maybe the best. You can smell the kitchen the moment you walk in, which is exactly what you want. They also serve alcoholic lassis, something I'd never seen before, and they were honestly some of the best drinks I had that night.",
    },
    {
      kind: 'figure',
      side: 'right',
      image: {
        src: fishAndLassi,
        alt: 'Tava fish tandoori and a lassi',
        caption: 'Tava fish tandoori and a lassi — photo by John Geddes, 2024',
      },
      text: "I had the Tandoori Chicken, Tava Fish Tandoori, and Chicken Makhani, with carrot halwa for dessert. Everything was well-spiced and clearly made with care. If it says TAVA Signature on the menu, just order it — you won't regret it. The Chicken Makhani especially was on another level; that buttery tomato sauce was so good I was basically drinking it by the end.",
    },
    {
      kind: 'paragraph',
      text: "I'm knocking it down to three and a half stars for the service. Nothing went outright wrong — it just wasn't good either. That might have been because my group looked younger; we noticed our table getting a bit less attention than others. Still, the food more than made up for it, and it didn't ruin the experience.",
    },
    {
      kind: 'paragraph',
      text: "The restaurant itself is a nice spot — comfortable, good atmosphere, nothing to complain about there. Service aside, I really enjoyed it, and I'll definitely be back to try more of the menu.",
    },
  ],
};
