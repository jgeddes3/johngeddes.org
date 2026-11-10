import React from 'react';
import './Project1.css';
import Photo4 from './ProjectButtonImages/CensusFavicon.webp';

const Project4 = () => {
  return (
    <div className="project-container1">
      <div className="text-container1">
        <h1>Census</h1>
        <p>The IT asset team's console, 14 systems in one record</p>
      </div>
      <div className="ProjectPhoto1">
        <div className="ProjPhotoEllipse1">
          <img loading="lazy" decoding="async" src={Photo4} alt="Census mark" className="projphoto1" />
        </div>
      </div>
    </div>
  );
};

export default Project4;
