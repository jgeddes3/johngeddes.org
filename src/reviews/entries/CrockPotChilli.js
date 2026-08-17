import chiliBowl from '../images/Chili/ChiliPhoto1.webp';
import chiliBowl2 from '../images/Chili/ChiliPhoto2.jpg';
import stout from '../images/Chili/StoutBeer.jpg';

export default {
  slug: 'CrockPotChilli',
  type: 'recipe',
  title: 'Crock Pot Beer Chili',
  rating: null,
  status: 'published',
  blurb: 'Slow-cooker chili with a half cup of stout — the leftovers beat same-day every time.',
  seoDescription:
    'Crock pot chili made with stout beer — chipotle-seasoned ground beef, beans, tomato puree, and a 6-8 hour low cook. Serves 12.',
  links: [],
  hero: {
    src: chiliBowl,
    alt: 'A bowl of chili',
    caption: 'Chili — stand-in photo until I make the next pot.',
  },
  blocks: [
    {
      kind: 'paragraph',
      text: "The biggest thing with this chili is seasoning the meat before it goes anywhere near the crock pot. Hit two pounds of ground beef with chipotle garlic barbecue seasoning, garlic powder, steak seasoning, salt, and pepper while you brown it. The chipotle brings heat and smokiness, and the steak seasoning rounds it out. The meat should taste good on its own before it hits the pot — that's what makes the finished chili so much better.",
    },
    {
      kind: 'figure',
      side: 'right',
      image: {
        src: chiliBowl2,
        alt: 'A bowl of chili topped with cheese',
        caption: 'Another stand-in bowl until the next batch.',
      },
      text: "Now the stout — this is the move that makes people ask you for the recipe. It sounds weird if you haven't done it before, but the beer adds a dark, almost malty taste that works really well against the tomato and onion, with a slight bitterness that keeps the chili from being one-note.",
    },
    {
      kind: 'paragraph',
      text: "You're only using half a cup, plus half a cup of beef broth alongside it, so it's not overpowering — it just ties everything together.",
    },
    {
      kind: 'figure',
      side: 'left',
      image: {
        src: stout,
        alt: 'A pint of stout beer',
        caption: 'A nice stout',
      },
      text: "The crock pot does the rest. Set it on low and let it go for 6-8 hours. By hour three or four your place is going to smell incredible and you're going to want to eat early — don't. Let it go the full time. The beans soak up everything and the beef gets super tender.",
    },
    {
      kind: 'paragraph',
      text: 'Every spoonful hits a little different — sometimes you get the chipotle, sometimes the garlic, sometimes just the beef.',
    },
    {
      kind: 'paragraph',
      text: "Serve this with sourdough bread, shredded cheese, and cilantro — that's non-negotiable. The sourdough is great for dipping, and its tang works well against how rich the chili is. Cheese on top melts right in, and cilantro adds some freshness (assuming you don't have that gene where it tastes like soap). One more thing: leftover chili is always better than same-day chili.",
    },
    {
      kind: 'card',
      heading: 'Crock Pot Beer Chili',
      text: 'Serves: 12 | Prep time: 35 minutes | Cook time: 6-8 hours',
    },
    {
      kind: 'card',
      heading: 'Ingredients',
      text: '- 2 pounds ground beef\n- 4 cans Westbrae chili bean mix\n- 2 cans garbanzo beans\n- 1 can black beans (mild spice)\n- 15 oz tomato puree\n- 1 onion, chopped\n- 4 garlic cloves, minced\n- Chili seasoning\n- Steak seasoning\n- Chipotle garlic barbecue blend by The Spice House\n- Worcestershire sauce\n- Oregano\n- Cayenne\n- Garlic powder\n- Cloves\n- Cinnamon\n- 1/2 cup stout beer\n- 1/2 cup beef broth',
    },
    {
      kind: 'card',
      heading: 'For after the chili is made',
      text: "- Shredded cheese\n- Sourdough bread\n- Cilantro (if you don't have that weird gene)",
    },
    {
      kind: 'card',
      heading: 'Directions',
      text: "- Start by browning the meat with chipotle garlic seasoning, steak seasoning, cayenne, and garlic powder.\n- When the meat is browned, move it to the crock pot and brown the onions in the same pan. When they're done, add them on top of the meat.\n- Add the beans, tomato puree, garlic cloves, chili seasoning, Worcestershire sauce, oregano, more garlic powder, cloves, cinnamon, beer, and broth to the crock pot.\n- Cook for 6-8 hours on low.\n- Serve with cheese and cilantro on top, with a slice of sourdough for dipping.",
    },
  ],
};
