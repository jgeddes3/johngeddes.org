import burger from '../images/Burger/Burger.jpg';
import grilling from '../images/Burger/Grillin burgers.jpg';

export default {
  slug: 'AmazingBurgerRecipe',
  type: 'recipe',
  title: 'The Amazing Burger',
  rating: null,
  status: 'published',
  blurb: "My dad's burger method: egg and Worcestershire, no exceptions. Makes 6-8 burgers.",
  seoDescription:
    'Homemade grilled burger recipe with egg, Worcestershire sauce, smoked paprika, and sautéed onions and garlic. Makes 6-8 burgers; serves 8.',
  links: [],
  hero: {
    src: burger,
    alt: 'A cheeseburger on a bun',
    caption: "Stock photo for now — I'll swap in one of mine next time I grill.",
  },
  blocks: [
    {
      kind: 'paragraph',
      text: "Everyone writes a story before their recipe — I think it has something to do with Google Analytics — so here's mine. If you'd rather skip straight to the recipe, [click here](#recipe). When it comes to burgers, this recipe is the best way to go. My dad taught me to make burgers when I was a kid, and I've stuck to his method ever since, with a few tweaks of my own. The one thing he always insisted on was egg and Worcestershire sauce. I wasn't sure about it at first, but after trying it his way, I couldn't go back.",
    },
    {
      kind: 'figure',
      side: 'left',
      image: {
        src: grilling,
        alt: 'Burger patties on a grill',
        caption: "Burgers on the grill — also a stand-in until I grill again.",
      },
      text: "The egg holds everything together so the patty doesn't fall apart on the grill, and it keeps the burger juicy. And the Worcestershire — I don't know what it is about it, but it makes the meat taste meatier somehow.",
    },
    {
      kind: 'paragraph',
      text: "Over time I've experimented with different combinations and spices — garlic, onion, even a splash of soy sauce — but the foundation of my dad's recipe, that egg and Worcestershire combo, stays unchanged. It's a simple recipe, and it never fails. Alright, here it is. It makes 6-8 burgers, or 4 half-pound burgers.",
    },
    {
      kind: 'card',
      heading: 'The Amazing Burgers',
      text: 'Serves: 8 people | Prep time: 30 minutes | Cook time: 14 minutes\n\n- 2 lb ground beef\n- Steak seasoning\n- Worcestershire sauce\n- Smoked paprika\n- Garlic powder\n- Cayenne\n- 1 egg\n- 3/4 onion\n- 3 garlic cloves\n- Olive oil (for cooking the onions)\n- Salt and pepper (to taste)\n- Butter (for the buns)\n- Buns',
    },
    {
      kind: 'card',
      heading: 'Directions',
      text: "- Cut up the onions and garlic and start sautéing the onions. When the onions start to soften, add the garlic, cook for another 3 minutes, then set the pan aside. (The point isn't to cool the mixture, but it's fine if it does.)\n- Put the beef, steak seasoning, Worcestershire sauce, egg, smoked paprika, cayenne, and sautéed onions and garlic in a bowl and start mixing. I'm honestly not sure on measurements — the more you play around with it, the more natural it'll feel — just do NOT over-season with the steak seasoning.\n- Butter your buns before you grill, so you can toss them on when there's less than a minute of grilling left.\n- Throw the patties on the grill and cook for 7 minutes on each side, or until they look good. That part is down to personal preference — just don't burn them.\n- After the last flip, when the patties look nearly ready to come off, put the buns on for a minute or so. They're touchy and will burn very quickly.\n- Take everything off the grill and enjoy. Oh, and add pickles.",
    },
  ],
};
