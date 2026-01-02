import React from 'react';
import './SmallButton.css';
import './LargeButton.css';
import './ComplexLayoutS.css';
import img_1233 from './img_1233.png'; 

const Smallbutton1 = () => {
  return (
    <button className="small-btn" id="small-btn1">
      <div className="inner-rectangle2">
        <span className="text-topL">Click here if you are</span>
        <span className="TextBottomL1">Contractors</span>
      </div>
      <div className="rectangle11"></div>
      <div className="rectangle12"></div>
      <img loading="lazy" decoding="async" src={img_1233} alt="1233" className="circle-img1" />
      <div className="rectangle14"></div>
      <div className="rectangle13"></div>
      <div className="rectangle15"></div>
      <div className="rectangle16"></div>
      <div className="rectangle17"></div>
      </button>
  );
};

export default Smallbutton1;

