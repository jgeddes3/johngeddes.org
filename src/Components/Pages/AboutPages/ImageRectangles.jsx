import React, { useState, useEffect, useMemo } from 'react';
import img1 from './Lilys.jpg';
import img2 from './Lisbon, Portugal.webp';
import img3 from './Minneapolis, MN.webp';
import img4 from './Montrose Point, Chicago.webp';
import img5 from './Moorish Castle.webp';
import img6 from './Pheonix, Arizona.webp';
import img7 from './Portland, Maine.webp';
import img8 from './Porto, Portugal.webp';
import img9 from './Quinta da Regaleira.webp';
import img10 from './Rossaveel, Ireland.jpg';
import img11 from './San Francisco, California.jpg';
import img12 from './The Half Blood Prince.jpg';
import img13 from './Toca da Raposa.webp';
import img14 from './Unknown Hills, Ireland.webp';
import img15 from './Well Out of Hell.webp';
import img16 from './Wicklow Mountains, Ireland.webp';
import img17 from './Wolf Point Chicago.webp';
import img18 from './Wrigly Field, Chicago.jpg';
import img19 from './Boyne Mountain, Michigan.jpg';
import img20 from './Chattanooga, Tennessee.jpg';
import img21 from './Cliffs of Moher, Ireland.webp';
import img22 from './Crete, Greece.jpg';
import img23 from './Dublin, Ireland.webp';
import img24 from './Duluth, Minnesota.webp';
import img25 from './Fort Lauderdale, Florida.webp';
import img26 from './Galway, Ireland.webp';

import './ImageRectangles.css';

const ALL_IMAGES = [
  { src: img1,  name: "Lily's" },
  { src: img2,  name: 'Lisbon, Portugal' },
  { src: img3,  name: 'Minneapolis, MN' },
  { src: img4,  name: 'Montrose Point, Chicago' },
  { src: img5,  name: 'Moorish Castle' },
  { src: img6,  name: 'Phoenix, Arizona' },
  { src: img7,  name: 'Portland, Maine' },
  { src: img8,  name: 'Porto, Portugal' },
  { src: img9,  name: 'Quinta da Regaleira' },
  { src: img10, name: 'Rossaveel, Ireland' },
  { src: img11, name: 'San Francisco, California' },
  { src: img12, name: 'The Half Blood Prince' },
  { src: img13, name: 'Toca da Raposa' },
  { src: img14, name: 'Unknown Hills, Ireland' },
  { src: img15, name: 'Well Out of Hell' },
  { src: img16, name: 'Wicklow Mountains, Ireland' },
  { src: img17, name: 'Wolf Point, Chicago' },
  { src: img18, name: 'Wrigley Field, Chicago' },
  { src: img19, name: 'Boyne Mountain, Michigan' },
  { src: img20, name: 'Chattanooga, Tennessee' },
  { src: img21, name: 'Cliffs of Moher, Ireland' },
  { src: img22, name: 'Crete, Greece' },
  { src: img23, name: 'Dublin, Ireland' },
  { src: img24, name: 'Duluth, Minnesota' },
  { src: img25, name: 'Fort Lauderdale, Florida' },
  { src: img26, name: 'Galway, Ireland' },
];

const ImageRectangles = () => {
  const [randomImages, setRandomImages] = useState([]);

  useEffect(() => {
    const getRandomImages = () => {
      let randomIndexes = [];
      while (randomIndexes.length < 2) {
        const rand = Math.floor(Math.random() * ALL_IMAGES.length);
        if (randomIndexes.indexOf(rand) === -1) randomIndexes.push(rand);
      }
      return [ALL_IMAGES[randomIndexes[0]], ALL_IMAGES[randomIndexes[1]]];
    };
    setRandomImages(getRandomImages());
  }, []);

  return (
    <>
      <div className="Aboutimgrects">
        <div className="Aboutimgrect">
          {randomImages[0] && (
            <>
              <img loading="lazy" decoding="async" src={randomImages[0].src} alt={randomImages[0].name} />
              <div className="image-name-label">{randomImages[0].name}</div>
            </>
          )}
        </div>
      </div>
      <div className="Aboutimgrects2">
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


