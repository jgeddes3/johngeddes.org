import React from 'react';
import { Link } from 'react-router-dom';
import Background from '../../ForEveryPage/Background';
import PageFooter from '../../ForEveryPage/PageFooter';
import SEO from '../../ForEveryPage/SEO';
import '../ProjectPages/ProjectTemplate.css';
import './Social.css';
import InProgressImg from '../../hpButtons/img_1235.png';

const SocialPage = () => {
  return (
    <>
      <SEO
        title="Social"
        description="John Geddes' social links and connections."
        path="/social"
      />
      <Background />
      <div id="centerpiece2" className="main-content">
        <h1>Social Page</h1>
      </div>
      <div className="proj-page main-content">
        <div className="proj-hero">
          <img className="social-progress-img" src={InProgressImg} alt="In Progress" />
          <p className="proj-stub-message">In Progress</p>
          <p className="proj-hero-tagline">
            This page is currently being built. Check back soon for social links and connections.
          </p>
        </div>
      </div>

      <div className="proj-nav-buttons">
        <Link to="/philosophy" className="proj-nav-button">
          Philosophy Page
        </Link>
      </div>
      <PageFooter />
    </>
  );
};

export default SocialPage;
