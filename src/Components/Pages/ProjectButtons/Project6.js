import React from 'react';
import './Project3.css';
import Photo6 from './ProjectButtonImages/InstagramBot.png';

const Project6 = () => {
  return (
    <div className="project-container3">
      <div className="text-container3">
        <h1>Instagram Bot Testing</h1>
        <p>Made a few bots for Instagram</p>
      </div>
      <div className="ProjectPhoto3">
        <div className="ProjPhotoRectangle3">
          <img src={Photo6} alt="Project 3" className="projphoto3" />
        </div>
      </div>
    </div>
  );
};

export default Project6;
