import React from 'react';
import Background from '../../ForEveryPage/Background';
import PageFooter from '../../ForEveryPage/PageFooter';
import { Link } from 'react-router-dom';
import './ProjectTemplate.css';
import Logo from '../ProjectButtons/ProjectButtonImages/Creditlogo.png';

const ReactNativeCreditCardApp = () => {
  return (
    <>
      <Background />
      <div id="centerpiece2" className="main-content">
        <h1>React Native Credit Card App</h1>
      </div>
      <div className="proj-page main-content">
        <div className="proj-stub">
          <img className="proj-stub-logo" src={Logo} alt="React Native Credit Card App" />
          <p className="proj-stub-message">Project details coming soon</p>
          <p>Check back later for the full case study.</p>
        </div>
      </div>
      <div className="proj-nav-buttons">
        <Link to="/projects" className="proj-nav-button">
          Projects Page
        </Link>
      </div>
      <PageFooter />
    </>
  );
};

export default ReactNativeCreditCardApp;
