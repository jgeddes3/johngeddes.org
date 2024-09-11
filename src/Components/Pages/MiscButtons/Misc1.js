import React from 'react';
import './Misc1.css';
import MiscPhoto1 from './MiscImages/RestaurantLogo.png';

const Misc1 = ({ headerText, contentText }) => {  // Props for dynamic content
  return (
    <div className="misc2-container">
      <div className="text-container">
        <h2>{headerText}</h2>
        <p>{contentText}</p>
      </div>
      <div className="miscPhoto1">
        <div className="miscPhotoEllipse1">
          <img src={MiscPhoto1} alt="Restaurant Logo" className="miscphoto1" />
        </div>
      </div>
    </div>
  );
};

export default Misc1;