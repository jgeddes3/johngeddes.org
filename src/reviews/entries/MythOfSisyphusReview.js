import cover from '../images/TheMythofSisyphus/TheMythofSisyphus.jpg';

export default {
  slug: 'MythOfSisyphusReview',
  type: 'book',
  title: 'The Myth of Sisyphus',
  author: 'Albert Camus',
  rating: 7.5,
  status: 'published',
  blurb: 'Camus on the boulder, the walk back down, and why endless labor feels less lonely.',
  seoDescription:
    'John Geddes reviews The Myth of Sisyphus by Albert Camus: the absurd, the freedom of the walk back down, and finding company in endless labor.',
  links: [
    { label: 'Goodreads', url: 'https://www.goodreads.com/book/show/11987.The_Myth_of_Sisyphus_and_Other_Essays' },
    { label: 'Albert Camus', url: 'https://www.goodreads.com/author/show/957894.Albert_Camus' },
  ],
  blocks: [
    {
      kind: 'figure',
      side: 'right',
      image: {
        src: cover,
        alt: 'The Myth of Sisyphus book cover',
        caption: 'The Myth of Sisyphus and Other Essays by Albert Camus',
      },
      text: "In The Myth of Sisyphus, Albert Camus takes up the ancient Greek myth of Sisyphus, the man the gods condemned to roll a boulder up a hill for eternity, only to watch it roll back down every time he reaches the top. That endless, futile task becomes his symbol for human life, which Camus argues is inherently devoid of meaning — and yet we keep looking for purpose in a world that offers none. What makes the myth tragic, Camus suggests, is that Sisyphus is fully aware of his situation. That consciousness both burdens and frees him. “If this myth is tragic, it is because the hero is conscious,” Camus writes. Sisyphus knows his task is futile, yet he keeps at it, and in that perseverance we find resilience and defiance.",
    },
    {
      kind: 'paragraph',
      text: "The most striking moment in Camus' reading is the descent. The hour-long walk back down, after the rock has inevitably tumbled, is when Sisyphus is free. What looks like his lowest point is also his liberation. “If this descent is in sorrow, then it can also be in joy,” Camus provocatively writes. Sisyphus is condemned to repeat the same task forever, but in those moments between struggles he is conscious of his fate and free to choose his attitude toward it. That's the heart of Camus' philosophy: even in a life without inherent meaning, we can find freedom by accepting the absurdity and embracing it.",
    },
    {
      kind: 'paragraph',
      text: 'There is catharsis in monotony and labor, and in that sense Sisyphus is shown a kind of mercy. Others suffer endlessly at the hands of tormentors; Sisyphus only has to push a boulder up a hill. He must simply endure.',
    },
    {
      kind: 'paragraph',
      text: "Reading it through my own lens, I found that catharsis too. In my own endless round of labor and searching for meaning, it feels better knowing there are others — others laboring with no end in sight. I don't know if that was Camus' intention, but it makes me feel less alone.",
    },
  ],
};
