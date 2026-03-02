import React from 'react';
import { Link } from 'react-router-dom';
import Background from '../../ForEveryPage/Background';
import PageFooter from '../../ForEveryPage/PageFooter';
import SEO from '../../ForEveryPage/SEO';
import './Social.css';

const SocialPage = () => {
  return (
    <>
      <SEO
        title="Social"
        description="John Geddes' social links and connections."
        path="/social"
      />
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

      <PageFooter />
    </>
  );
};

export default SocialPage;