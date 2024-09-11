import React from 'react';
import './Phil.css';
import PhilPhoto5 from './PhilosophyImages/WorldLogo.png';

const Phil5 = ({ headerText, contentText }) => {  // Props for dynamic content
  return (
    <div className="Phil-container">
      <div className="Philtext-container">
        <h2>{headerText}</h2>
        <p>{contentText}</p>
      </div>
      <div className="PhilPhoto1">
        <div className="PhilPhotoEllipse1">
          <img src={PhilPhoto5} alt="Phil Logo" className="Philphoto1" />
        </div>
      </div>
    </div>
  );
};

export default Phil5;