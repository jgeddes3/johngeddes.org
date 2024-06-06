import React from 'react';
import Background from '../ForEveryPage/Background';
import Bottombar from '../ForEveryPage/Bottombar';
import { Link } from 'react-router-dom';
import './MiscPage.css';

// Import individual misc components
import Misc1 from './MiscButtons/Misc1';
import Misc2 from './MiscButtons/Misc2';
import Misc3 from './MiscButtons/Misc3';
import Misc4 from './MiscButtons/Misc4';
import Misc5 from './MiscButtons/Misc5';
import Misc6 from './MiscButtons/Misc6';
import Misc7 from './MiscButtons/Misc7';
import Misc8 from './MiscButtons/Misc8';
import Misc9 from './MiscButtons/Misc9';

const MiscPage = () => {
  return (
    <>
      <Background />
      <div id="centerpiece2" className="main-content">
        <h1>Miscellaneous</h1>
        <p className="MiscPages-description main-content">This is for all of my thoughts, recipes, and reviews!</p>
      </div>
      <div className="content-container">
        <div className="misc-item">
          
          <Link to="/misc1" className="misc-button main-content">
          <Misc1 />
          </Link>
        </div>
        <div className="misc-item">
          <Link to="/misc2" className="misc-button main-content">
          <Misc2 />
          </Link>
        </div>
        <div className="misc-item">
          <Link to="/misc3" className="misc-button main-content">
          <Misc3 />
          </Link>
        </div>
        <div className="misc-item">
          <Link to="/misc4" className="misc-button main-content">
          <Misc4 />
          </Link>
        </div>
        <div className="misc-item">
          <Link to="/misc5" className="misc-button main-content">
          <Misc5 />
          </Link>
        </div>
        <div className="misc-item">
          <Link to="/misc6" className="misc-button main-content">
          <Misc6 />
          </Link>
        </div>
        <div className="misc-item">
          <Link to="/misc7" className="misc-button main-content">
          <Misc7 />
          </Link>
        </div>
        <div className="misc-item">
          <Link to="/misc8" className="misc-button main-content">
          <Misc8 />
          </Link>
        </div>
        <div className="misc-item">
          <Link to="/misc9" className="misc-button main-content">
          <Misc9 />
          </Link>
        </div>
      </div>
      <Bottombar />
    </>
  );
};

export default MiscPage;
