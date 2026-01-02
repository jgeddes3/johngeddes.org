import React from 'react';
import './Homepage.css';
import Background from '../ForEveryPage/Background';
import Bottombar from '../ForEveryPage/Bottombar';
import Largebutton1 from '../hpButtons/Largebutton1';
import Smallbutton1 from '../hpButtons/Smallbutton1';
import LargeButton2 from '../hpButtons/Largebutton2';
import SmallButton2 from '../hpButtons/Smallbutton2';
import Largebutton3 from '../hpButtons/Largebutton3';
import Smallbutton3 from '../hpButtons/Smallbutton3';
import { Link } from 'react-router-dom';

const HomePage = () => {
  return (
    <>
      <Background />
      <div id="centerpiece" className='main-content'>
        <h1>
          <span className="line1">I'm John</span>
          <br />
          <span className="line2">Joseph Geddes</span>
        </h1>
      </div>
      <div className="button-container main-content">
        <div className="button-row">
          <Link to="/recruiters" className="large-btn">
            <Largebutton1 />
          </Link>
          <Link to="/contracts" className="small-btn">
            <Smallbutton1 />
          </Link>
        </div>
        <div className="button-row">
          <Link to="/" className="small-btn">
            <SmallButton2 />
          </Link>
          <Link to="/friends" className="large-btn">
            <LargeButton2 />
          </Link>
        </div>
        <div id="centerpiece1">
          <h1>In Progress</h1>
        </div>
        <div className="button-row">
          <Link to="/philosophy" className="small-btn">
            <Smallbutton3 />
          </Link>
          <Link to="/social" className="large-btn">
            <Largebutton3 />
          </Link>
        </div>
      </div>
      <Bottombar />
    </>
  );
};

export default HomePage;
