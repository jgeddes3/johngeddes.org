import React from 'react';
import './Project1.css';
import Photo7 from './ProjectButtonImages/Weathericon.png';

const Project7 = () => {
  return (
    <div className="project-container1">
      <div className="text-container1">
        <h1>Route Weather</h1>
        <p>Calculate the weather for your upcoming trips</p>
      </div>
      <div className="ProjectPhoto1">
        <div className="ProjPhotoEllipse1">
          <img loading="lazy" decoding="async" src={Photo7} alt="Project 1" className="projphoto1" />
        </div>
      </div>
    </div>
  );
};

export default Project7;

