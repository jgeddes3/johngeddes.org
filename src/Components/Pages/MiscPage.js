import React from 'react';
import Background from '../ForEveryPage/Background';
import Bottombar from '../ForEveryPage/Bottombar';
import { Link } from 'react-router-dom';
import './MiscPage.css';

// Import individual misc components
import Misc1 from './MiscButtons/Misc1';
import Misc2 from './MiscButtons/Misc2';
import Misc3 from './MiscButtons/Misc3';

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
          <Misc1 
            headerText="My Favorite Restaurant" 
            contentText="A wonderful place for dining with family." 
          />
          </Link>
        </div>
        <div className="misc-item">
          <Link to="/misc2" className="misc-button main-content">
          <Misc2 
            headerText="My Favorite Recipe" 
            contentText="A nice hot chicken." 
          />
          </Link>
        </div>
        <div className="misc-item">
          <Link to="/RedRisingReview" className="misc-button main-content">
          <Misc3 
            headerText="My Favorite Book!" 
            contentText="Red Rising" 
          />
          </Link>
        </div>
       
      </div>
      <Bottombar />
    </>
  );
};

export default MiscPage;
