import React from 'react';
import './Project1.css';
import Photo8 from './ProjectButtonImages/Creditlogo.webp';

const Project8 = () => {
  return (
    <div className="project-container1">
      <div className="text-container1">
        <h1>React Native Credit Card App</h1>
        <p>Card picks matched to your goals — a concept</p>
      </div>
      <div className="ProjectPhoto1">
        <div className="ProjPhotoEllipse1">
          <img loading="lazy" decoding="async" src={Photo8} alt="Credit card app icon" className="projphoto1" />
        </div>
      </div>
    </div>
  );
};

export default Project8;
