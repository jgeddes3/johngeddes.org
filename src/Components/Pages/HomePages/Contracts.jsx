import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import Background from '../../ForEveryPage/Background';
import PageFooter from '../../ForEveryPage/PageFooter';
import SEO from '../../ForEveryPage/SEO';
import './Contracts.css';
import ContractSlide1 from './ContractsSlides/ContractSlide1';
import ContractSlide2 from './ContractsSlides/ContractSlide2';
import ContentSlide3 from './ContractsSlides/ContractSlide3';

const SLIDES = [
  { Component: ContractSlide1, color: '#3a7243', label: 'Skills' },
  { Component: ContractSlide2, color: '#618e68', label: 'Rates and contact' },
  { Component: ContentSlide3,  color: '#88aa8e', label: 'More of my work' },
];

const ContractsPage = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [showButtons, setShowButtons] = useState(false);

  const nextSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev + 1) % SLIDES.length);
  }, []);

  const previousSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev - 1 + SLIDES.length) % SLIDES.length);
  }, []);

  const firstSlide = useCallback(() => setCurrentSlide(0), []);
  const lastSlide  = useCallback(() => setCurrentSlide(SLIDES.length - 1), []);

  useEffect(() => {
    // Delay showing nav buttons by 0.5s after slide change
    const timer = setTimeout(() => setShowButtons(true), 500);
    return () => {
      clearTimeout(timer);
      setShowButtons(false);
    };
  }, [currentSlide]);

  // Keyboard navigation — arrow keys, Home, End
  useEffect(() => {
    const handleKey = (e) => {
      // Don't hijack keys when the user is typing in an input
      const target = e.target;
      if (target && (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable)) {
        return;
      }
      if (e.key === 'ArrowRight') {
        e.preventDefault();
        nextSlide();
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        previousSlide();
      } else if (e.key === 'Home') {
        e.preventDefault();
        firstSlide();
      } else if (e.key === 'End') {
        e.preventDefault();
        lastSlide();
      }
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [nextSlide, previousSlide, firstSlide, lastSlide]);

  return (
    <>
      <SEO
        title="Contracts"
        description="Explore John Geddes' contract services, skills, rates, and previous projects as an AV and Software Engineer."
        path="/contracts"
      />
      <Background />
      <div id="centerpiece2" className="main-content">
        <h1>Looking to Contract?</h1>
      </div>
      <div className="projects-description-container">
        <p className="projects-description main-content">
          Like what you see? Go through the slides to see all the skills I bring to the table, my rates, and how to contact me, as well as previous projects I've worked on.
        </p>
      </div>

      <div
        className="slideshow-container main-content"
        role="region"
        aria-roledescription="carousel"
        aria-label="Contract services"
      >
        {SLIDES.map(({ Component, color, label }, index) => {
          const isActive = index === currentSlide;
          return (
            <div
              key={index}
              className={`slide ${isActive ? 'active' : 'collapsed'}`}
              style={{ backgroundColor: color }}
              role="group"
              aria-roledescription="slide"
              aria-label={`${label} (${index + 1} of ${SLIDES.length})`}
              aria-hidden={!isActive}
            >
              <Component active={isActive} />
            </div>
          );
        })}

        {/* Left Navigation (Previous and First buttons) */}
        <div className={`navigation-buttons-left ${showButtons ? 'visible' : ''}`}>
          {currentSlide > 0 && (
            <>
              <div
                className="previous-button"
                onClick={previousSlide}
                role="button"
                tabIndex={0}
                aria-label="Previous slide"
              ></div>
              {currentSlide === SLIDES.length - 1 && (
                <div
                  className="previous-button first"
                  onClick={firstSlide}
                  role="button"
                  tabIndex={0}
                  aria-label="First slide"
                ></div>
              )}
            </>
          )}
        </div>

        <div className={`navigation-buttons-right ${showButtons ? 'visible' : ''}`}>
          {currentSlide < SLIDES.length - 1 && (
            <>
              <div
                className="next-button"
                onClick={nextSlide}
                role="button"
                tabIndex={0}
                aria-label="Next slide"
              ></div>
              {currentSlide === 0 && (
                <div
                  className="next-button last"
                  onClick={lastSlide}
                  role="button"
                  tabIndex={0}
                  aria-label="Last slide"
                ></div>
              )}
            </>
          )}
        </div>
      </div>

      {/* Dot indicators */}
      <div className="slideshow-dots" role="tablist" aria-label="Slide indicators">
        {SLIDES.map((slide, index) => (
          <button
            key={index}
            type="button"
            className={`slideshow-dot ${index === currentSlide ? 'active' : ''}`}
            onClick={() => setCurrentSlide(index)}
            role="tab"
            aria-selected={index === currentSlide}
            aria-label={`Go to slide ${index + 1}: ${slide.label}`}
          />
        ))}
      </div>

      <div className="bottom-buttons-container">
        <Link to="/recruiters" className="recruiters-nav-button">
          Recruiters Page
        </Link>
        <Link to="/friends" className="friends-nav-button">
          Friends Page
        </Link>
      </div>

      <PageFooter />
    </>
  );
};

export default ContractsPage;
