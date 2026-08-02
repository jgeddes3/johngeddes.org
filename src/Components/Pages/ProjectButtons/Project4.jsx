import React from 'react';
import './Project1.css';
import Photo4 from './ProjectButtonImages/SnipeITFavicon.webp';

const Project4 = () => {
  return (
    <div className="project-container1">
      <div className="text-container1">
        <h1>Snipe IT</h1>
        <p>A device census reconciling eleven vendor APIs</p>
      </div>
      <div className="ProjectPhoto1">
        <div className="ProjPhotoEllipse1">
          <img loading="lazy" decoding="async" src={Photo4} alt="Snipe IT app icon" className="projphoto1" />
        </div>
      </div>
    </div>
  );
};

export default Project4;

