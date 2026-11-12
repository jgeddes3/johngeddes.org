import React, { useState, useEffect } from 'react';
import img1 from './Big Ben, London.webp';
import img2 from './Blackhawks, Chicago.webp';
import img3 from './Boyne Mountain, Michigan.webp';
import img4 from './Chattanooga, Tennessee.webp';
import img5 from './Chicago Sunset, Chicago.webp';
import img6 from './Cliffs of Moher, Ireland.webp';
import img7 from './Crete, Greece.webp';
import img8 from './Dublin, Ireland.webp';
import img9 from './Duluth, Minnesota.webp';
import img10 from './Fairy Push, New Orleans.webp';
import img11 from './Fort Lauderdale, Florida.webp';
import img12 from './Galway, Ireland.webp';
import img13 from './Haunted House, New Orleans.webp';
import img14 from './Lake View, Chippewa Flowage.webp';
import img15 from './Lilys.webp';
import img16 from './Lisbon, Portugal.webp';
import img17 from './Middle of Nowhere, Berwick-upon-Tweed.webp';
import img18 from './Minneapolis, Minnesota.webp';
import img19 from './Montrose Point, Chicago.webp';
import img20 from './Moorish Castle.webp';
import img21 from './Oil Refinery, Louisiana.webp';
import img22 from './Ol Church, Scotland.webp';
import img23 from './Phoenix, Arizona.webp';
import img24 from './Portland, Maine.webp';
import img25 from './Porto, Portugal.webp';
import img26 from './QUACK, London.webp';
import img27 from './Queens Crib, London.webp';
import img28 from './Quinta da Regaleira.webp';
import img29 from './Rossaveel, Ireland.webp';
import img30 from './San Francisco, California.webp';
import img31 from './Scotland, United Kingdom.webp';
import img32 from './Scottish Castle, Scotland.webp';
import img33 from './Sherlock Holmes, London.webp';
import img34 from './Sunset, St. Petersburg.webp';
import img35 from './The Half Blood Prince.webp';
import img36 from './The Holy Island, Holy Island.webp';
import img37 from './Toca da Raposa.webp';
import img38 from './Unknown Hills, Ireland.webp';
import img39 from './Watch Tower, Holy Island.webp';
import img40 from './Well Out of Hell.webp';
import img41 from './Wicklow Mountains, Ireland.webp';
import img42 from './Wolf Point, Chicago.webp';
import img43 from './Wrigley Field, Chicago.webp';

import { isPrerendering } from '../../../seo/prerendering';
import './ImageRectangles.css';

const ALL_IMAGES = [
  { src: img1,  name: 'Big Ben, London' },
  { src: img2,  name: 'Blackhawks, Chicago' },
  { src: img3,  name: 'Boyne Mountain, Michigan' },
  { src: img4,  name: 'Chattanooga, Tennessee' },
  { src: img5,  name: 'Chicago Sunset, Chicago' },
  { src: img6,  name: 'Cliffs of Moher, Ireland' },
  { src: img7,  name: 'Crete, Greece' },
  { src: img8,  name: 'Dublin, Ireland' },
  { src: img9,  name: 'Duluth, Minnesota' },
  { src: img10, name: 'Fairy Push, New Orleans' },
  { src: img11, name: 'Fort Lauderdale, Florida' },
  { src: img12, name: 'Galway, Ireland' },
  { src: img13, name: 'Haunted House, New Orleans' },
  { src: img14, name: 'Lake View, Chippewa Flowage' },
  { src: img15, name: "Lily's" },
  { src: img16, name: 'Lisbon, Portugal' },
  { src: img17, name: 'Middle of Nowhere, Berwick-upon-Tweed' },
  { src: img18, name: 'Minneapolis, Minnesota' },
  { src: img19, name: 'Montrose Point, Chicago' },
  { src: img20, name: 'Moorish Castle' },
  { src: img21, name: 'Oil Refinery, Louisiana' },
  { src: img22, name: 'Ol Church, Scotland' },
  { src: img23, name: 'Phoenix, Arizona' },
  { src: img24, name: 'Portland, Maine' },
  { src: img25, name: 'Porto, Portugal' },
  { src: img26, name: 'QUACK, London' },
  { src: img27, name: "Queen's Crib, London" },
  { src: img28, name: 'Quinta da Regaleira' },
  { src: img29, name: 'Rossaveel, Ireland' },
  { src: img30, name: 'San Francisco, California' },
  { src: img31, name: 'Scotland, United Kingdom' },
  { src: img32, name: 'Scottish Castle, Scotland' },
  { src: img33, name: 'Sherlock Holmes, London' },
  { src: img34, name: 'Sunset, St. Petersburg' },
  { src: img35, name: 'The Half Blood Prince' },
  { src: img36, name: 'The Holy Island, Holy Island' },
  { src: img37, name: 'Toca da Raposa' },
  { src: img38, name: 'Unknown Hills, Ireland' },
  { src: img39, name: 'Watch Tower, Holy Island' },
  { src: img40, name: 'Well Out of Hell' },
  { src: img41, name: 'Wicklow Mountains, Ireland' },
  { src: img42, name: 'Wolf Point, Chicago' },
  { src: img43, name: 'Wrigley Field, Chicago' },
];

const ROTATE_MS = 20 * 1000;
const FADE_MS = 400;

// Two different photos, neither of them one of the pair being replaced.
const pickPair = (exclude = []) => {
  const pool = ALL_IMAGES.filter((img) => !exclude.includes(img));
  const first = Math.floor(Math.random() * pool.length);
  let second = Math.floor(Math.random() * (pool.length - 1));
  if (second >= first) second += 1;
  return [pool[first], pool[second]];
};

// Resolves once the photo is decoded, so a swap never shows a half-loaded image.
const preload = ({ src }) => {
  const img = new Image();
  img.src = src;
  return img.decode().catch(() => {});
};

const ImageRectangles = () => {
  const [randomImages, setRandomImages] = useState([]);
  const [swapping, setSwapping] = useState(false);

  useEffect(() => {
    // The static snapshot keeps the empty rectangles so hydration matches;
    // the random pair arrives after mount, as it always has.
    if (isPrerendering()) return;
    let current = pickPair();
    setRandomImages(current);

    // Like the project carousel, don't auto-advance for reduced motion.
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    let cancelled = false;
    let busy = false;
    let fadeTimer;
    const interval = setInterval(() => {
      if (document.hidden || busy) return;
      busy = true;
      const next = pickPair(current);
      Promise.all(next.map(preload)).then(() => {
        if (cancelled) return;
        setSwapping(true);
        fadeTimer = setTimeout(() => {
          current = next;
          setRandomImages(next);
          setSwapping(false);
          busy = false;
        }, FADE_MS);
      });
    }, ROTATE_MS);
    return () => {
      cancelled = true;
      clearInterval(interval);
      clearTimeout(fadeTimer);
    };
  }, []);

  const swapClass = swapping ? ' is-swapping' : '';

  return (
    <>
      <div className={`Aboutimgrects${swapClass}`}>
        <div className="Aboutimgrect">
          {randomImages[0] && (
            <>
              <img loading="lazy" decoding="async" src={randomImages[0].src} alt={randomImages[0].name} />
              <div className="image-name-label">{randomImages[0].name}</div>
            </>
          )}
        </div>
      </div>
      <div className={`Aboutimgrects2${swapClass}`}>
        <div className="Aboutimgrect2">
          {randomImages[1] && (
            <>
              <img loading="lazy" decoding="async" src={randomImages[1].src} alt={randomImages[1].name} />
              <div className="image-name-label">{randomImages[1].name}</div>
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default ImageRectangles;


