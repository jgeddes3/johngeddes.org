import React from 'react';
import './Smallbutton2.css';
import img_1235 from './img_1235.png';

const Smallbutton2 = () => {
  return (
    <button className="small-btn2">
      <div className="realstylecontainer">
      <p className="realstyle">In Progess! Come back soon!!!</p>
    </div>
    <div className="rec_container">
        <img src={img_1235} alt="1235" className="rec-img" />
      </div>
    </button>
  );
};

export default Smallbutton2;
