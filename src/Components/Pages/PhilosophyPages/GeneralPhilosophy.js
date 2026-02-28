import React from 'react';
import Background from '../../ForEveryPage/Background';
import PageFooter from '../../ForEveryPage/PageFooter';
import { Link } from 'react-router-dom';
import './PhilosophyTemplate.css';

const GeneralPhilosophy = () => {
  return (
    <>
      <Background />
      <div id="centerpiece2" className="main-content">
        <h1>General Philosophy</h1>
      </div>
      <div className="phil-page main-content">
        <p className="phil-subtitle">Subtitle or thesis statement here</p>

        <div className="phil-epigraph">
          Epigraph quote here
          <span className="phil-epigraph-attribution">— Attribution here</span>
        </div>

        <div className="phil-body">
          <h2 className="phil-heading">Section heading here</h2>
          <p className="phil-text">Body text here</p>

          <blockquote className="phil-blockquote">
            Blockquote here
          </blockquote>

          <p className="phil-text">Body text here</p>

          <hr className="phil-divider" />

          <h2 className="phil-heading">Section heading here</h2>
          <p className="phil-text">Body text here</p>

          <p className="phil-pullquote">Pull quote here</p>

          <p className="phil-text">Body text here</p>
        </div>
      </div>

      <div className="phil-nav-buttons">
        <Link to="/philosophy" className="phil-nav-button">
          Philosophy Page
        </Link>
      </div>

      <PageFooter />
    </>
  );
};

export default GeneralPhilosophy;
