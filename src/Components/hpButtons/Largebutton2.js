import React from 'react';
import './LargeButton.css';
import img_1234 from './img_1234.jpg';

const Largebutton2 = () => {
  return (
    <button className="large-btn2" id="large-btn2">
      <div className="inner-rectangle3">
        <span className="text-top3">Click here if you are</span>
        <span className="text-bottom3">Friends</span>
      </div>
      <div className="image-container">
        <img src={img_1234} alt="1234" className="sqr-img" />
        </div>
    </button>
  );
};

export default Largebutton2;
