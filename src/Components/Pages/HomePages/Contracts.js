import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom'; 
import Background from '../../ForEveryPage/Background';
import Bottombar from '../../ForEveryPage/Bottombar';
import './Contracts.css';
import ContractSlide1 from './ContractsSlides/ContractSlide1.png';
import ContractSlide2 from './ContractsSlides/ContractSlide2.png';
import ContentSlide3 from './ContractsSlides/ContractSlide3'; // Import the new ContentSlide3 component

const ContractsPage = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [showButtons, setShowButtons] = useState(false); // State for button visibility

  const slides = [
    { image: ContractSlide1, color: '#3a7243' }, 
    { image: ContractSlide2, color: '#618e68' }, 
    { component: <ContentSlide3 />, color: '#88aa8e' },  // Use component for Slide 3
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
          Like what you see? Go through the slides to see all the skills I bring to the table, my rates, and how to contact me, as well as previous projects I've worked on.
        </p>
      </div>

      <div className="slideshow-container main-content">
        {/* Full Slide when it's active */}
        {slides.map((slide, index) => (
          <div
            key={index}
            className={`slide ${index === currentSlide ? 'active' : 'collapsed'}`} // Ensure the slide collapses
            style={{ backgroundColor: slide.color }}
          >
            {slide.image && <img loading="lazy" decoding="async" src={slide.image} alt={`Contract Slide ${index + 1}`} className="slide-image" />} {/* Image for Slide 1 and Slide 2 */}
            {index === 2 && index === currentSlide && <ContentSlide3 />} {/* Show ContentSlide3 only when active */}
          </div>
        ))}

        {/* Navigation Buttons */}
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

