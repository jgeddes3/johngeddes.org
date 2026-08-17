import mimosas from '../images/Mimosas/Mimosas1.jpg';
import orangeJuice from '../images/Mimosas/OJ.jpg';
import cava from '../images/Mimosas/Cava1.jpg';

export default {
  slug: 'MimosaRecipe',
  type: 'recipe',
  title: 'The Best Mimosa',
  rating: null,
  status: 'published',
  blurb: 'Fresh-squeezed OJ and chilled Cava, half and half. Save the real champagne.',
  seoDescription:
    'How to make the best mimosas: chilled Spanish Cava and freshly squeezed orange juice, poured half and half in a flute. Serves 8, 15 minutes of prep.',
  links: [],
  hero: {
    src: mimosas,
    alt: 'Mimosas in champagne flutes',
    caption: 'Mimosas — stock photo until I make the next batch.',
  },
  blocks: [
    {
      kind: 'paragraph',
      text: "If you're looking up how to make mimosas, one of three things is true: you're too young to be drinking them, you're already a bit too tipsy to be mixing another round, or you're chasing the perfect mimosa. As long as you're of age and drinking responsibly, I'm not here to judge. If you'd rather skip straight to the recipe, [click here](#recipe).",
    },
    {
      kind: 'paragraph',
      text: "Start with one of the two key ingredients in a classic mimosa: orange juice. People assume any orange juice will do since it's getting mixed with alcohol. It won't. I compare it to sushi — you can get decent sushi at Whole Foods, but it's not going to match Nobu. Same goes for mimosas. Ideally, squeeze your own with a juicer. If that's not an option, Whole Foods and most local grocery stores sell freshly squeezed orange juice, which is a good alternative.",
    },
    {
      kind: 'figure',
      side: 'left',
      image: {
        src: orangeJuice,
        alt: "A bottle of Trader Joe's orange juice",
        caption: "Trader Joe's orange juice",
      },
      text: "I get that freshly squeezed can run double or triple the price, which might not be ideal when you're pouring for friends. Just steer clear of brands like Minute Maid, Simply Orange, and Tropicana and you should be okay. If you want something close to fresh-squeezed, I recommend Uncle Matt's or Trader Joe's house brand. (Not sponsored.)",
    },
    {
      kind: 'figure',
      side: 'right',
      image: {
        src: cava,
        alt: 'A bottle of Segura Viudas cava',
        caption: 'Segura Viudas cava',
      },
      text: "Now for the fun part: the bubbly. If you're putting real champagne in your mimosas, you're either in a significantly higher tax bracket than me or you're wasting good wine and good money. To repeat what's been said a billion times, champagne only comes from Champagne, France. A small group in California is allowed to call their wine champagne, but it isn't. The wine I'd recommend is Cava.",
    },
    {
      kind: 'paragraph',
      text: "Cava is a Spanish sparkling wine you can find at pretty much any liquor store. It's cheap, but it's actually good — made the same way as champagne, so you get those nice small bubbles, and it doesn't overpower the orange juice the way some proseccos can. You can also swap in other juices if you want to get creative: grapefruit, cranberry, whatever you're into. It's light enough that you can have a few at brunch without feeling like you need a nap. Let's get into the recipe.",
    },
    {
      kind: 'card',
      heading: "The Best Mimosas You've Ever Had",
      text: 'Serves: 8 | Prep time: 15 minutes | Cook time: none',
    },
    {
      kind: 'card',
      heading: 'Ingredients',
      text: '- One bottle (750 ml) freshly squeezed orange juice\n- One bottle (750 ml) Cava, chilled',
    },
    {
      kind: 'card',
      heading: 'Directions',
      text: 'Fill a champagne flute half with orange juice and half with Cava, and enjoy.',
    },
  ],
};
