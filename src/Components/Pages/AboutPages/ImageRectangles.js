import React, { useState, useEffect, useMemo } from 'react';
import img1 from './Lilys.jpg';
import img2 from './Lisbon, Portugal.jpg';
import img3 from './Minneapolis, MN.jpg';
import img4 from './Montrose Point, Chicago.jpg';
import img5 from './Moorish Castle.jpg';
import img6 from './Pheonix, Arizona.jpg';
import img7 from './Portland, Maine.jpg';
import img8 from './Porto, Portugal.jpg';
import img9 from './Quinta da Regaleira.jpg';
import img10 from './Rossaveel, Ireland.jpg';
import img11 from './San Francisco, California.jpg';
import img12 from './The Half Blood Prince.jpg';
import img13 from './Toca da Raposa.jpg';
import img14 from './Unknown Hills, Ireland.jpg';
import img15 from './Well Out of Hell.jpg';
import img16 from './Wicklow Mountains, Ireland.jpg';
import img17 from './Wolf Point Chicago.jpg';
import img18 from './Wrigly Field, Chicago.jpg';
import img19 from './Boyne Mountain, Michigan.jpg';
import img20 from './Chattanooga, Tennessee.jpg';
import img21 from './Cliffs of Moher, Ireland.jpg';
import img22 from './Crete, Greece.jpg';
import img23 from './Dublin, Ireland.jpg';
import img24 from './Duluth, Minnesota.jpg';
import img25 from './Fort Lauderdale, Florida.jpg';
import img26 from './Galway, Ireland.jpg';

import './ImageRectangles.css';

const ImageRectangles = () => {
  const images = useMemo(() => [img1, img2, img3, img4, img5, img6, img7, img8, img9, img10, img11, img12, img13, img14, img15, img16, img17, img18, img19, img20, img21, img22, img23, img24, img25, img26], []);

  const [randomImages, setRandomImages] = useState([]);

  useEffect(() => {
    const getRandomImages = () => {
      let randomIndexes = [];
      while (randomIndexes.length < 2) {
        const rand = Math.floor(Math.random() * images.length);
        if (randomIndexes.indexOf(rand) === -1) randomIndexes.push(rand);
      }
      return [images[randomIndexes[0]], images[randomIndexes[1]]];
    };
    setRandomImages(getRandomImages());
  }, [images]);

  // Extract the filename (imgX) from the import path
  const getImageName = (image) => {
    const parts = image.split('/');
    return parts[parts.length - 1].split('.')[0];
  };

  return (
    <>
      <div className="Aboutimgrects">
        <div className="Aboutimgrect">
          {randomImages[0] && (
            <>
              <img src={randomImages[0]} alt="Random 1" />
              <div className="image-name-label">{getImageName(randomImages[0])}</div>
            </>
          )}
        </div>
      </div>
      <div className="Aboutimgrects2">
        <div className="Aboutimgrect2">
          {randomImages[1] && (
            <>
              <img src={randomImages[1]} alt="Random 2" />
              <div className="image-name-label">{getImageName(randomImages[1])}</div>
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default ImageRectangles;

