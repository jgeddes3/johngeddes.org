import React, { useEffect } from 'react';
import './StickyBar.css';
import { Link } from 'react-router-dom';

const StickyBar = () => {
  const navigateTo = (path) => {
    window.location.href = path;
  };

  useEffect(() => {
    const scrollFunc = () => {
      const buttons = document.querySelectorAll('.nav-btn');
      if (window.scrollY >= 240) {
        buttons.forEach((btn) => btn.classList.add('scrolled'));
      } else {
        buttons.forEach((btn) => btn.classList.remove('scrolled'));
      }
    };

    window.addEventListener('scroll', scrollFunc);
    return () => window.removeEventListener('scroll', scrollFunc);
  }, []);

  return (
    <header id="sticky-header">
    <Link to="/" className="nav-btn" id="home-btn">Home</Link>
    <Link to="/about" className="nav-btn" id="about-btn">About Me</Link>
    <Link to="/projects" className="nav-btn" id="projects-btn">Projects</Link>
    <Link to="/contact" className="nav-btn" id="contact-btn">Contact Me</Link>
    <Link to="/misc" className="nav-btn" id="misc-btn">Misc</Link>
  </header>
);

};

export default StickyBar;
