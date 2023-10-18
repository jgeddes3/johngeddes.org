import React from 'react';
import './Largebutton1.css';
import './ComplexLayoutL.css';
import img_1230 from './img_1230.png'; 
import img_1231 from './img_1231.png'; 
import img_1232 from './img_1232.png';  


const Largebutton1 = () => {
  return (
    <button className="large-btn" id="large-btn1">
      <div className="inner-rectangle">
        <span className="text-top">Click here if you are</span>
        <span className="text-bottom">Recruiters</span>
      </div>
      <div className="rectangle1"></div>
      <div className="rectangle2">
        <img src={img_1230} alt="1230" className="circle-img" />
        <img src={img_1231} alt="1231" className="circle-img" />
        <img src={img_1232} alt="1232" className="circle-img" />
      </div>
      <div className="rectangle4"></div>
      <div className="rectangle3"></div>
      <div className="rectangle5"></div>
      <div className="rectangle6"></div>
      <div className="rectangle7"></div>
      <div className="rectangle8"></div>
      </button>
  );
};

export default Largebutton1;
