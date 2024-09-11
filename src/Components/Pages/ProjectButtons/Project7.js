import React from 'react';
import './Project1.css';
import Photo7 from './ProjectButtonImages/WeatherLogo.png';

const Project7 = () => {
  return (
    <div className="project-container1">
      <div className="text-container1">
        <h1>Built a weather app</h1>
        <p>App for weather</p>
      </div>
      <div className="ProjectPhoto1">
        <div className="ProjPhotoEllipse1">
          <img src={Photo7} alt="Project 1" className="projphoto1" />
        </div>
      </div>
    </div>
  );
};

export default Project7;
