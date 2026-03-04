import React from 'react';
import './LargeButton.css';
import img_1237 from './img_1237.png';
import img_1238 from './img_1238.png';

const Largebutton3 = () => {
  return (
    <button className="large-btn3" id="large-btn3">
        <div className="inner-rectangle6">
        <span className="TextBottomL6">Tiktok Youtube</span>
      </div>
      <div className="image-container-left">
        <img loading="lazy" decoding="async" src={img_1237} alt="left" className="img-diag-right" />
        </div>
        <div className="image-container-right">
        <img loading="lazy" decoding="async" src={img_1238} alt="right" className="img-diag-left" />
        </div>
    </button>
  );
};

export default Largebutton3;

