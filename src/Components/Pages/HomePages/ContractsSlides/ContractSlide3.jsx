import React from 'react';
import { Link } from 'react-router-dom';
import './ContractSlide3.css';

const ContentSlide3 = () => {
  return (
    <div className="content-slide-3-container">
      <h2>I am looking to build other projects, but while you're here check out what the rest of this page has to offer!</h2>
      <div className="buttons-container">
        <Link to="/about" className="content-slide-3-button">About</Link>
        <Link to="/projects" className="content-slide-3-button">Projects</Link>
        <Link to="/misc" className="content-slide-3-button">Misc</Link>
      </div>
    </div>
  );
};

export default ContentSlide3;
