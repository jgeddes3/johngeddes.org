import React from 'react';
import './Project3.css';
import Photo5 from './ProjectButtonImages/TourismApp.png';

const Project5 = () => {
  return (
    <div className="project-container3">
      <div className="text-container3">
        <h1>A Tourism App</h1>
        <p>An app for navigating tourist locations</p>
      </div>
      <div className="ProjectPhoto3">
        <div className="ProjPhotoRectangle3">
          <img loading="lazy" decoding="async" src={Photo5} alt="Project 3" className="projphoto3" />
        </div>
      </div>
    </div>
  );
};

export default Project5;

