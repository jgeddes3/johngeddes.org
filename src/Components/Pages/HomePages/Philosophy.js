import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom'; 
import Background from '../../ForEveryPage/Background';
import Bottombar from '../../ForEveryPage/Bottombar';
import './Philosophy.css';

const FriendsPage = () => {
  return (
    <>
     <Background />
      <div id="centerpiece2" className='main-content'>
        <h1>Philosophy</h1>
      </div>
      <div className="projects-description-container">
      <p className="projects-description main-content">
          For the thinking
        </p>
      </div>
        <div className="bottom-buttons-container">
        <Link to="/friends" className="friends-nav-button">
          Contracts Page
        </Link>
        <Link to="/social" className="social-nav-button">
          Philosophy Page
        </Link>

      </div>

      <Bottombar />
    </>
  );
};

export default FriendsPage;