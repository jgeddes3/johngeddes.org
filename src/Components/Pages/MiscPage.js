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
          
          <Link to="/Hopleaf" className="misc-button main-content">
          <Misc1 
            headerText="Review of Hopleaf" 
            contentText="A nice little Gastropub in Andersonville" 
          />
          </Link>
        </div>
        <div className="misc-item">
          <Link to="/AmazingBurgerRecipe" className="misc-button main-content">
          <Misc2 
            headerText="My amazing and intense Burger Recipe" 
            contentText="Are you looking to impress your friends? Try this burger recipe in order to step up your game." 
          />
          </Link>
        </div>
        <div className="misc-item">
          <Link to="/TavaFreshIndian" className="misc-button main-content">
          <Misc1 
            headerText="Tava Fresh Taste of India" 
            contentText="A very good indian option in the Chicago-Land area" 
          />
          </Link>
        </div>
        <div className="misc-item">
          <Link to="/MimosaRecipe" className="misc-button main-content">
          <Misc2 
            headerText="The Best Mimosa Recipe Ever" 
            contentText="Do you not like mimosas? You may not be making them right." 
          />
          </Link>
          <Link to="/CrockPotChilli" className="misc-button main-content">
          <Misc2 
            headerText="The Best Crock Pot Bear Chili" 
            contentText="The best chili you've never had. " 
          />
          </Link>
        </div>
          <Link to="/WayOfKingsReview" className="misc-button main-content">
          <Misc3 
            headerText="The Way of Kings" 
            contentText="My honest book review" 
          />
          </Link>
        <div className="misc-item">
          <Link to="/MythOfSisyphusReview" className="misc-button main-content">
          <Misc3 
            headerText="The Myth of Sisyphus" 
            contentText="My honest book review" 
          />
          </Link>
        </div>
        <div className="misc-item">
          <Link to="/RedRisingReview" className="misc-button main-content">
          <Misc3 
            headerText="Red Rising" 
            contentText="My honest book review" 
          />
          </Link>
        </div>
       
      </div>
      <Bottombar />
    </>
  );
};

export default MiscPage;
