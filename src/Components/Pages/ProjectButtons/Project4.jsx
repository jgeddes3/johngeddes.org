import React from 'react';
import './Project1.css';
import Photo4 from './ProjectButtonImages/SnipeITFavicon.png';

const Project4 = () => {
  return (
    <div className="project-container1">
      <div className="text-container1">
        <h1>Snipe IT</h1>
        <p>A front end addition to Snipe-IT asset management</p>
      </div>
      <div className="ProjectPhoto1">
        <div className="ProjPhotoEllipse1">
          <img loading="lazy" decoding="async" src={Photo4} alt="Project 1" className="projphoto1" />
        </div>
      </div>
    </div>
  );
};

export default Project4;

