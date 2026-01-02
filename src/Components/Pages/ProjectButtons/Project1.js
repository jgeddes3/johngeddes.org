import React from 'react';
import './Project1.css';
import Photo1 from './ProjectButtonImages/Loyola.png';

const Project1 = () => {
  return (
    <div className="project-container1">
      <div className="text-container1">
        <h1>Rambler Registrar</h1>
        <p>A scheduling app for school</p>
      </div>
      <div className="ProjectPhoto1">
        <div className="ProjPhotoEllipse1">
          <img loading="lazy" decoding="async" src={Photo1} alt="Project 1" className="projphoto1" />
        </div>
      </div>
    </div>
  );
};

export default Project1;

