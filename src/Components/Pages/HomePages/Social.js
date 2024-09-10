import React from 'react';
import { Link } from 'react-router-dom'; 
import Background from '../../ForEveryPage/Background';
import Bottombar from '../../ForEveryPage/Bottombar';
import './Social.css';

const SocialPage = () => {
  return (
    <>
     <Background />
      <div id="centerpiece2" className='main-content'>
        <h1>Social Page</h1>
      </div>
      <div className="projects-description-container">
      <p className="projects-description main-content">
          IN PROGRESS
        </p>
      </div>
        <div className="bottom-buttons-container">
        <div className="phil-nav-button-container">
        <Link to="/philosophy" className="phil-nav-button">
          Philosophy Page
        </Link>
      </div>
      </div>

      <Bottombar />
    </>
  );
};

export default SocialPage;