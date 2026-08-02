import React from 'react';
import './Project3.css';
import Photo5 from './ProjectButtonImages/TourismApp.webp';

const Project5 = () => {
  return (
    <div className="project-container3">
      <div className="text-container3">
        <h1>A Tourism App</h1>
        <p>A marketplace for tours led by locals — a concept</p>
      </div>
      <div className="ProjectPhoto3">
        <div className="ProjPhotoRectangle3">
          <img loading="lazy" decoding="async" src={Photo5} alt="Tourism app icon" className="projphoto3" />
        </div>
      </div>
    </div>
  );
};

export default Project5;

