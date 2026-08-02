import React from 'react';
import './Project1.css';
import Photo2 from './ProjectButtonImages/Excel.webp';

const Project2 = () => {
  return (
    <div className="project-container1">
      <div className="text-container1">
        <h1>Excel Workbooks</h1>
        <p>A shop of spreadsheets — not built yet</p>
      </div>
      <div className="ProjectPhoto1">
        <div className="ProjPhotoEllipse1">
          <img loading="lazy" decoding="async" src={Photo2} alt="Excel Workbooks icon" className="projphoto1" />
        </div>
      </div>
    </div>
  );
};

export default Project2;

