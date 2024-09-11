import React from 'react';
import './Phil.css';
import PhilPhoto2 from './PhilosophyImages/BrainLogo.png';

const Phil2 = ({ headerText, contentText }) => {  // Props for dynamic content
  return (
    <div className="Phil-container">
      <div className="Philtext-container">
        <h2>{headerText}</h2>
        <p>{contentText}</p>
      </div>
      <div className="PhilPhoto1">
        <div className="PhilPhotoEllipse1">
          <img src={PhilPhoto2} alt="Phil Logo" className="Philphoto1" />
        </div>
      </div>
    </div>
  );
};

export default Phil2;