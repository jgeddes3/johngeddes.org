import React from 'react';
import './Project3.css';
import Photo3 from './ProjectButtonImages/CipherTrackerLogo.webp';

const Project3 = () => {
  return (
    <div className="project-container3">
      <div className="text-container3">
        <h1>Cipher Tracker</h1>
        <p>Twelve habit trackers, encrypted on your phone</p>
      </div>
      <div className="ProjectPhoto3">
        <div className="ProjPhotoRectangle3">
          <img loading="lazy" decoding="async" src={Photo3} alt="Cipher Tracker app icon" className="projphoto3" />
        </div>
      </div>
    </div>
  );
};

export default Project3;

