import React from 'react';
import { Link } from 'react-router-dom'; 
import Background from '../../ForEveryPage/Background';
import Bottombar from '../../ForEveryPage/Bottombar';
import './Friends.css';

const FriendsPage = () => {
  return (
    <>
     <Background />
      <div id="centerpiece2" className='main-content'>
        <h1>Hello Friends!</h1>
      </div>
      <div className="projects-description-container">
      <p className="projects-description main-content">
          Friends!
        </p>
      </div>
        <div className="bottom-buttons-container">
        <Link to="/contracts" className="contracts-nav-button">
          Contracts Page
        </Link>
        <Link to="/philosophy" className="philosophy-nav-button">
          Philosophy Page
        </Link>

      </div>

      <Bottombar />
    </>
  );
};

export default FriendsPage;