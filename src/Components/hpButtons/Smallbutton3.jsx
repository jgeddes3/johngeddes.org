import React from 'react';
import './SmallButton.css';
import img_1236 from './img_1236.webp';

const Smallbutton3 = () => {
  return (
    <button className="small-btn3">
            <div className="inner-rectangle5">
        <span className="text-bottom5">Philosophical Content</span>
      </div>
    <div className="sqrphil">
        <img loading="lazy" decoding="async" src={img_1236} alt="1236" className="phil-img" />
      </div>
    </button>
  );
};

export default Smallbutton3;

