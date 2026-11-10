/* Site-wide SEO data: who the site is about, and the title, description, and
   place in the site tree of every static page. Reviews and essays are not
   listed here; meta.js derives theirs from the content registries.

   This file is plain data with no React or DOM imports because the build
   scripts load it in Node (scripts/prerender.mjs) as well as the app. */

export const SITE = {
  name: 'John Geddes',
  url: 'https://www.johngeddes.org',
  homeTitle: 'John Geddes · AV & Software Engineer in Chicago',
  description:
    'John Geddes is a Senior Audio Visual Engineer and software developer in Chicago. Projects and case studies, book and restaurant reviews, recipes, essays, and how to reach him.',
  locale: 'en_US',
  email: 'app@johngeddes.org',
  defaultImageAlt: 'The John Geddes site mark: a snake wound through a trinity knot, white on green.',
};

export const PERSON = {
  name: 'John Geddes',
  alternateName: ['John Joseph Geddes', 'John J. Geddes'],
  givenName: 'John',
  familyName: 'Geddes',
  jobTitle: 'Senior Audio Visual Engineer',
  // The name is shared with a Canadian political journalist and a novelist, among
  // others. This line is what search engines and AI crawlers use to tell them apart.
  disambiguatingDescription:
    'The Chicago-based Senior Audio Visual Engineer and software developer behind johngeddes.org; not the Canadian journalist or the novelist of the same name.',
  description:
    'Senior AV Engineer and software developer based in Chicago, Illinois. Builds React, React Native, and Node applications, and designs enterprise AV systems on Crestron and Extron.',
  city: 'Chicago',
  region: 'IL',
  country: 'US',
  worksFor: 'The Aspen Group (TAG)',
  alumniOf: 'Loyola University Chicago',
  sameAs: [
    'https://www.linkedin.com/in/therealjohngeddes',
    'https://github.com/jgeddes3',
    'https://www.chess.com/member/shyne4life',
  ],
  knowsAbout: [
    'Audio Visual Engineering', 'Crestron', 'Extron', 'React', 'React Native', 'TypeScript',
    'JavaScript', 'Node.js', 'Express', 'Firebase', 'Python', 'Vite', 'Azure AD',
    'AES-256 Encryption', 'Excel Automation', 'Chess', 'Philosophy', 'Neuroethics',
  ],
};

/* Static pages. Keys are route paths. Fields:
     title        short title; the tab shows "<title> | John Geddes" (home is special-cased)
     description  one or two factual sentences for search results, ~150 characters
     parent       the breadcrumb above this page: { path, name }
     project      SoftwareApplication facts for built apps; omit for concepts and write-ups
     cardImage    a photo for the share card, as a dev-server path under /src (optional)
     noindex      true keeps the page out of search: a robots noindex tag, no canonical,
                  no structured data, and no entry in the sitemap or llms.txt. The page
                  is still built and linked from the site (Paper Trail, the 404 page)
     sitemap      false leaves the page out of the sitemap (play URLs, the 404)
     prerender    false skips static HTML for this route (pages with side effects on load)
     body         false writes the page's head with the plain app shell instead of rendered markup
     priority / changefreq   sitemap hints */
const PROJECTS = { path: '/projects', name: 'Projects' };
const CHESS = { path: '/ChessDeck', name: 'Chess Deck' };

export const PAGES = {
  '/': {
    title: '',
    description: SITE.description,
    priority: 1,
    changefreq: 'weekly',
  },
  '/about': {
    title: 'About',
    description:
      'About John Geddes, a Senior Audio Visual Engineer and software developer in Chicago: background, skills, and interests.',
    priority: 0.9,
    changefreq: 'monthly',
  },
  '/projects': {
    title: 'Projects',
    description:
      'Projects by John Geddes: shipped apps, browser games, and case studies. Chess Deck, Rambler Registrar, Cipher Tracker, Census, Hike Away Tours, and more.',
    priority: 0.9,
    changefreq: 'monthly',
  },
  '/misc': {
    title: 'Miscellaneous',
    description:
      'Book reviews, restaurant reviews, and recipes by John Geddes, each rated out of ten, plus other writing.',
    priority: 0.8,
    changefreq: 'weekly',
  },
  '/contracts': {
    title: 'Contracts',
    description:
      "John Geddes' contract services, skills, rates, and previous projects as an AV and software engineer in Chicago.",
    priority: 0.7,
    changefreq: 'monthly',
  },
  '/friends': {
    title: 'Friends & Interests',
    description:
      "John Geddes' interests: rock climbing, chess, golf, foreign affairs, and the books and restaurants he reviews.",
    priority: 0.5,
    changefreq: 'monthly',
  },
  '/philosophy': {
    title: 'Philosophy',
    description:
      "John Geddes' philosophy essays, in five shelves: general, neuroethics, technology, political philosophy, and world events.",
    priority: 0.7,
    changefreq: 'weekly',
  },
  '/social': {
    title: 'Social',
    // Live tiles load after mount, so the rendered snapshot would never match
    // React's first render; this page ships its own head with the app shell.
    body: false,
    description:
      'What John Geddes is up to right now: live signals from Last.fm, Chess.com, and GitHub, plus where to find him online.',
    priority: 0.5,
    changefreq: 'weekly',
  },
  '/recruiters': {
    title: 'Recruiters',
    description:
      "John Geddes' role-specific resumes for AV Engineer, Executive Technician, Manager, and Web Developer positions.",
    priority: 0.6,
    changefreq: 'monthly',
  },

  /* ---- Projects ---- */
  '/HikeAwayTours': {
    cardImage: '/src/Components/Pages/ProjectPages/ProjectPageImages/HikeAwayTours/hikeaway-hero.webp',
    title: 'Hike Away Tours',
    description:
      'Hike Away Tours is an operated multi-day walking-tour platform on US rail-trail corridors, by John Geddes. Booking engine, data model and Firestore rules built and tested; customer and ops surfaces to follow.',
    parent: PROJECTS,
    priority: 0.7,
    changefreq: 'monthly',
  },
  '/ChessDeck': {
    cardImage: '/src/Components/Pages/ProjectPages/ProjectPageImages/ChessDeck/case-hero.webp',
    title: 'Chess Deck',
    description:
      'Chess Deck is a card-based chess variant by John Geddes. Full legal chess move generation verified by perft, twenty-one cards that bend the rules, and a computer opponent, playable in the browser.',
    parent: PROJECTS,
    project: {
      name: 'Chess Deck',
      category: 'GameApplication',
      os: 'Web browser',
      url: '/ChessDeck/play',
      summary: 'Chess crossed with a card game: legal chess underneath, twenty-one rule-bending cards on top. Local, computer, and online play.',
    },
    priority: 0.8,
    changefreq: 'monthly',
  },
  '/ChessDeck/play': {
    title: 'Play Chess Deck',
    description:
      'Play Chess Deck, a chess card game by John Geddes: pass-and-play on one device, challenge the computer, or play online with a friend.',
    parent: CHESS,
    priority: 0.6,
    changefreq: 'monthly',
  },
  '/ChessDeck/local': {
    body: false, // the board deals a random hand on load
    title: 'Chess Deck · Local Play',
    description:
      'Chess Deck local multiplayer, a card-based chess game by John Geddes. Play with a friend on the same device.',
    parent: CHESS,
    priority: 0.4,
    changefreq: 'yearly',
  },
  '/ChessDeck/computer': {
    body: false, // the board deals a random hand on load
    title: 'Chess Deck · vs Computer',
    description:
      'Chess Deck vs computer, a card-based chess game by John Geddes. Battle an AI opponent that draws and plays cards to bend the rules of chess.',
    parent: CHESS,
    priority: 0.4,
    changefreq: 'yearly',
  },
  '/ChessDeck/online': {
    title: 'Chess Deck · Online Play',
    description:
      'Chess Deck online multiplayer, a card-based chess game by John Geddes. Create a room, share the link, and play a friend in real time from anywhere.',
    parent: CHESS,
    // Opening this page creates a room, so it is neither prerendered nor listed.
    prerender: false,
    sitemap: false,
  },
  '/DrinkDecider': {
    title: 'Drink Horoscope',
    description:
      'Drink Horoscope, a small web app by John Geddes that pairs a cocktail with your zodiac sign and its reading for the day.',
    parent: PROJECTS,
    project: {
      name: 'Drink Horoscope',
      category: 'EntertainmentApplication',
      os: 'Web browser',
      url: '/DrinkDecider',
      summary: 'A cocktail paired to your zodiac reading.',
    },
    priority: 0.5,
    changefreq: 'yearly',
  },
  '/GateKeep': {
    cardImage: '/src/Components/Pages/ProjectPages/ProjectPageImages/GateKeep/gatekeep-artist.webp',
    title: 'GateKeep',
    description:
      "GateKeep is a planned marketplace for one city's live music, by John Geddes: reviewed musician and venue profiles, gig booking with a held deposit, ticketing, and fan discovery. Pre-launch; the page describes the plan and its screens are mockups.",
    parent: PROJECTS,
    priority: 0.5,
    changefreq: 'monthly',
  },
  '/CipherTracker': {
    cardImage: '/src/Components/Pages/ProjectPages/ProjectPageImages/CipherTracker/cipher-site-hero.webp',
    title: 'Cipher Tracker',
    description:
      'Cipher Tracker is a React Native habit tracker for iOS and Android that encrypts every entry on the device, and the Next.js site that markets it. By John Geddes.',
    parent: PROJECTS,
    project: {
      name: 'Cipher Tracker',
      category: 'LifestyleApplication',
      os: 'iOS, Android',
      url: 'https://cipher-app.org',
      summary: 'Twelve habit trackers, encrypted on your phone with AES-256.',
    },
    priority: 0.8,
    changefreq: 'monthly',
  },
  '/RamblerRegistrar': {
    cardImage: '/src/Components/Pages/ProjectPages/ProjectPageImages/RamblerRegistrar/rambler-site-hero.webp',
    title: 'Rambler Registrar',
    description:
      'Rambler Registrar is a React Native course scheduling app for Loyola University Chicago students that generates and scores schedules from live catalog data, plus the Vite marketing site that launches it. By John Geddes.',
    parent: PROJECTS,
    project: {
      name: 'Rambler Registrar',
      category: 'EducationalApplication',
      os: 'iOS, Android',
      url: 'https://www.ramblerregistrar.com/',
      summary: 'Course scheduling for Loyola University Chicago students: five conflict-free schedules, scored for how liveable the week is.',
    },
    priority: 0.8,
    changefreq: 'monthly',
  },
  /* Reachable from the Projects grid and the home carousel, but kept out of
     search engines on purpose, the same as papertrail.company itself. */
  '/PaperTrail': {
    noindex: true,
    cardImage: '/src/Components/Pages/ProjectPages/ProjectPageImages/PaperTrail/papertrail-card.webp',
    title: 'Paper Trail',
    description:
      'Paper Trail by John Geddes: upload your card statements and it finds the subscriptions, flags the excess, and splits the month between two people, entirely in the browser. No account, no server, and a content security policy that forbids the page from phoning home.',
    parent: PROJECTS,
    project: {
      name: 'Paper Trail',
      category: 'FinanceApplication',
      os: 'Web browser',
      summary: 'A local-only budgeting tool that reads card statements, finds subscriptions and excess, and splits spending between two people, with nothing leaving the browser.',
      url: 'https://papertrail.company',
    },
    priority: 0.8,
    changefreq: 'monthly',
  },
  '/Census': {
    title: 'Census',
    cardImage: '/src/Components/Pages/ProjectPages/ProjectPageImages/Census/census-card.webp',
    description:
      'Aspen Census by John Geddes: the console the IT asset team works in, on top of Snipe-IT. React 19 and TypeScript, an Express gateway with Entra ID sign-in, SQL reads against the Snipe-IT database, and nightly jobs that reconcile 14 outside systems: Intune, Jamf, CrowdStrike, ServiceNow, FedEx, SHI and more.',
    parent: PROJECTS,
    project: {
      name: 'Aspen Census',
      category: 'BusinessApplication',
      os: 'Web browser',
      summary: 'The asset team console: onboarding, shipping, chargebacks and nightly checks against 14 outside systems, on top of Snipe-IT.',
    },
    priority: 0.7,
    changefreq: 'monthly',
  },
  '/WeatherApp': {
    title: 'Route Weather',
    description:
      'Route Weather by John Geddes: the forecast for where you will actually be along a drive, every quarter hour or so, with the wet stretches marked on the map, up to three routes to choose between, and the days at the destination.',
    parent: PROJECTS,
    project: {
      name: 'Route Weather',
      category: 'TravelApplication',
      os: 'Web browser',
      url: '/WeatherApp',
      summary: 'The weather where you will be on the road, when you will be there.',
    },
    priority: 0.5,
    changefreq: 'yearly',
  },

  /* The 404 page. Prerendered to 404.html, never indexed or listed. */
  '/404': {
    title: '404: Page Not Found',
    description: 'That page does not exist on johngeddes.org.',
    noindex: true,
    sitemap: false,
    prerender: false,
  },
};

/* Where each kind of content sits in the site tree. */
export const SECTIONS = {
  review: { path: '/misc', name: 'Misc' },
  essay: { path: '/philosophy', name: 'Philosophy' },
};
