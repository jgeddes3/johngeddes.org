import React from 'react';
import './Project1.css';
import Photo7 from './ProjectButtonImages/Weathericon.webp';

const Project7 = () => {
  return (
    <div className="project-container1">
      <div className="text-container1">
        <h1>Route Weather</h1>
        <p>The weather along your route, hour by hour</p>
      </div>
      <div className="ProjectPhoto1">
        <div className="ProjPhotoEllipse1">
          <img loading="lazy" decoding="async" src={Photo7} alt="Route Weather icon" className="projphoto1" />
        </div>
      </div>
    </div>
  );
};

export default Project7;

