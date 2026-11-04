/* The Social page's editable content. Everything a visitor reads on /social
   that is not a live feed lives here; edit it the way you edit a review entry.

   - `updated`  : ISO date shown as "Last changed Nov 2026". Bump it when you edit `now`.
   - `reading`  : slug of a review entry (src/reviews/entries) for the "Last book rated" tile.
   - `now`      : the "what I'd tell a friend I hadn't seen in a year" list.
   - `profiles` : where to find you. A profile with `handle: null` is hidden
                  until you fill the handle in. `mono` is the two-letter badge.
   The live tiles (now playing, chess, last commit, weather) come from /api/signals. */

export default {
  updated: '2026-11-04',

  deck: 'A board of small true things about me today, and the places you can find more.',

  reading: 'KatabasisReview',

  now: [
    { term: 'Working', text: "Modernizing The Aspen Group's AV stack inside a Logitech ecosystem, and keeping the C-suite's rooms boring in the good way." },
    { term: 'Building', text: 'This site. The philosophy section just moved to data files, and this page is the newest thing on it.' },
    { term: 'Reading', text: 'Katabasis by R.F. Kuang, finished and rated. The Will of the Many is up next.' },
    { term: 'Playing', text: 'Rapid chess on Chess.com, badly but often. Golf when it is above fifty degrees.' },
    { term: 'Writing', text: 'The first general philosophy essay. The Myth of Sisyphus review is the seed.' },
  ],

  profiles: [
    { title: 'GitHub', handle: 'jgeddes3', url: 'https://github.com/jgeddes3', mono: 'GH' },
    { title: 'LinkedIn', handle: 'therealjohngeddes', url: 'https://www.linkedin.com/in/therealjohngeddes', mono: 'LI' },
    { title: 'Chess.com', handle: 'shyne4life', url: 'https://www.chess.com/member/shyne4life', mono: 'CC' },
    { title: 'Yelp', handle: 'John G.', url: 'https://www.yelp.com/user_details_reviews_self?userid=fgyF6oOG788lkuxtjUWFFg', mono: 'YP' },
    { title: 'Tripadvisor', handle: 'JohnHoss', url: 'https://www.tripadvisor.com/Profile/JohnHoss', mono: 'TA' },
    // Fill in a handle (and URL) to show these:
    { title: 'Instagram', handle: null, url: 'https://www.instagram.com/', mono: 'IG' },
    { title: 'Last.fm', handle: null, url: 'https://www.last.fm/', mono: 'FM' },
    { title: 'Goodreads', handle: null, url: 'https://www.goodreads.com/', mono: 'GR' },
    { title: 'Bluesky', handle: null, url: 'https://bsky.app/', mono: 'BS' },
  ],

  // One line under the badges. Say which networks you are not on, if you like.
  note: 'Email beats all of the above: app@johngeddes.org.',
};
