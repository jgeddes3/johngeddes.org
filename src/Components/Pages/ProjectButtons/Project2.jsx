import React from 'react';
import './Project1.css';
import Photo2 from './ProjectButtonImages/PaperTrailLogo.webp';

const Project2 = () => {
  return (
    <div className="project-container1">
      <div className="text-container1">
        <h1>Paper Trail</h1>
        <p>Your statements, sorted in the browser. Nothing leaves it</p>
      </div>
      <div className="ProjectPhoto1">
        <div className="ProjPhotoEllipse1">
          <img loading="lazy" decoding="async" src={Photo2} alt="The Paper Trail mark, a folded receipt in an aubergine circle" className="projphoto1" />
        </div>
      </div>
    </div>
  );
};

export default Project2;
