import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom'; 
import Background from '../../ForEveryPage/Background';
import Bottombar from '../../ForEveryPage/Bottombar';
import './Contracts.css';

const ContractsPage = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [showButtons, setShowButtons] = useState(false); // State for button visibility

  const slides = [
    { text: 'Slide 1 Content', color: '#3a7243' }, // Red for Slide 1
    { text: 'Slide 2 Content', color: '#618e68' }, // Green for Slide 2
    { text: 'Slide 3 Content', color: '#88aa8e' }, // Blue for Slide 3
  ];

  useEffect(() => {
    // Delay showing buttons by 0.5 seconds after slide change
    const timer = setTimeout(() => setShowButtons(true), 500);
    return () => {
      clearTimeout(timer); // Clean up the timeout on slide change
      setShowButtons(false); // Hide buttons right away when transitioning
    };
  }, [currentSlide]);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const previousSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  const firstSlide = () => {
    setCurrentSlide(0);
  };

  const lastSlide = () => {
    setCurrentSlide(slides.length - 1);
  };

  return (
    <>
      <Background />
      <div id="centerpiece2" className="main-content">
        <h1>Looking to Contract?</h1>
      </div>
      <div className="projects-description-container">
      <p className="projects-description main-content">
         I am always looking to help.
        </p>
      </div>

      <div className="slideshow-container main-content">
        {/* Full Slide when it's active */}
        {slides.map((slide, index) => (
          <div
            key={index}
            className={`slide ${index === currentSlide ? 'active' : 'collapsed'}`}
            style={{ backgroundColor: slide.color }}
          >
            <p className="slide-text">{slide.text}</p>
          </div>
        ))}

        {/* Navigation Buttons with delayed visibility */}
        <div className={`navigation-buttons-left ${showButtons ? 'visible' : ''}`}>
          {currentSlide > 0 && (
            <>
              <div className="previous-button" onClick={previousSlide}></div>
              {currentSlide === slides.length - 1 && (
                <div className="previous-button first" onClick={firstSlide}></div>
              )}
            </>
          )}
        </div>

        <div className={`navigation-buttons-right ${showButtons ? 'visible' : ''}`}>
          {currentSlide < slides.length - 1 && (
            <>
              <div className="next-button" onClick={nextSlide}></div>
              {currentSlide === 0 && (
                <div className="next-button last" onClick={lastSlide}></div>
              )}
            </>
          )}
        </div>
      </div>

             {/* Add buttons to navigate to Friends.js and Recruiters.js */}
             <div className="bottom-buttons-container">
        <Link to="/recruiters" className="recruiters-nav-button">
          Recruiters Page
        </Link>
        <Link to="/friends" className="friends-nav-button">
          Friends Page
        </Link>

      </div>

      <Bottombar />
    </>
  );
};

export default ContractsPage;
