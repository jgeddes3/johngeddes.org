import React from 'react';
import './Project1.css';
import Photo9 from './ProjectButtonImages/HoroscopeLogo.webp';

const Project9 = () => {
  return (
    <div className="project-container1">
      <div className="text-container1">
        <h1>Drink Horoscope</h1>
        <p>A cocktail paired to your zodiac reading</p>
      </div>
      <div className="ProjectPhoto1">
        <div className="ProjPhotoEllipse1">
          <img loading="lazy" decoding="async" src={Photo9} alt="Project 1" className="projphoto1" />
        </div>
      </div>
    </div>
  );
};

export default Project9;
