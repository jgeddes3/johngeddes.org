import React from 'react';
import './Project1.css';
import Photo9 from './ProjectButtonImages/AlcoholAstro.png';

const Project9 = () => {
  return (
    <div className="project-container1">
      <div className="text-container1">
        <h1>Alcohol Drink Decider</h1>
        <p>Creates a drink based off of your Zodiac</p>
      </div>
      <div className="ProjectPhoto1">
        <div className="ProjPhotoEllipse1">
          <img src={Photo9} alt="Project 1" className="projphoto1" />
        </div>
      </div>
    </div>
  );
};

export default Project9;