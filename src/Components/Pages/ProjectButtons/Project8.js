import React from 'react';
import './Project1.css';
import Photo8 from './ProjectButtonImages/Creditlogo.png';

const Project8 = () => {
  return (
    <div className="project-container1">
      <div className="text-container1">
        <h1>React Native Credit Card App</h1>
        <p>A work in progress Credit Card App</p>
      </div>
      <div className="ProjectPhoto1">
        <div className="ProjPhotoEllipse1">
          <img src={Photo8} alt="Project 1" className="projphoto1" />
        </div>
      </div>
    </div>
  );
};

export default Project8;