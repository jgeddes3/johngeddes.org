import React from 'react';
import './Project1.css';
import Photo2 from './ProjectButtonImages/Excel.png';

const Project2 = () => {
  return (
    <div className="project-container1">
      <div className="text-container1">
        <h1>Excel Workbooks</h1>
        <p>All of my Excel workbooks that I have made</p>
      </div>
      <div className="ProjectPhoto1">
        <div className="ProjPhotoEllipse1">
          <img loading="lazy" decoding="async" src={Photo2} alt="Project 1" className="projphoto1" />
        </div>
      </div>
    </div>
  );
};

export default Project2;

