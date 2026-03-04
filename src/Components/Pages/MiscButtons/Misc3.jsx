import React from 'react';
import './Misc1.css';
import MiscPhoto3 from './MiscImages/BooksLogo.png';

const Misc3 = ({ headerText, contentText }) => {  // Props for dynamic content
  return (
    <div className="misc2-container">
      <div className="text-container">
        <h2>{headerText}</h2>
        <p>{contentText}</p>
      </div>
      <div className="miscPhoto1">
        <div className="miscPhotoEllipse1">
          <img loading="lazy" decoding="async" src={MiscPhoto3} alt="Restaurant Logo" className="miscphoto1" />
        </div>
      </div>
    </div>
  );
};

export default Misc3;
