import React, { useState, useEffect, useMemo } from 'react';
import img1 from './img1.jpg';
import img2 from './img2.jpg';
import img3 from './img3.jpg';
import img4 from './img4.jpg';
import img5 from './img5.jpg';
import img6 from './img6.jpg';
import img7 from './img7.jpg';
import img8 from './img8.jpg';
import img9 from './img9.jpg';
import img10 from './img10.jpg';
import img11 from './img11.jpg';
import img12 from './img12.jpg';
import img13 from './img13.jpg';
import img14 from './img14.jpg';
import img15 from './img15.jpg';
import img16 from './img16.jpg';
import img17 from './img17.jpg';
import img18 from './img18.jpg';
import img19 from './img19.jpg';
import img20 from './img20.jpg';
import './ImageRectangles.css';

const ImageRectangles = () => {
  const images = useMemo(() => [img1, img2, img3, img4, img5, img6, img7, img8, img9, img10, img11, img12, img13, img14, img15, img16, img17, img18, img19, img20], []);

  const [randomImages, setRandomImages] = useState([]);

  useEffect(() => {
    const getRandomImages = () => {
      let randomIndexes = [];
      while (randomIndexes.length < 2) {
        const rand = Math.floor(Math.random() * 20);
        if (randomIndexes.indexOf(rand) === -1) randomIndexes.push(rand);
      }
      return [images[randomIndexes[0]], images[randomIndexes[1]]];
    };
    setRandomImages(getRandomImages());
  }, [images]);

  return (
    <>
      <div className="Aboutimgrects">
        <div className="Aboutimgrect">
          <img src={randomImages[0]} alt="Random 1"/>
        </div>
      </div>
      <div className="Aboutimgrects2">
        <div className="Aboutimgrect2">
          <img src={randomImages[1]} alt="Random 2"/>
        </div>
      </div>
    </>
  );
};

export default ImageRectangles;
