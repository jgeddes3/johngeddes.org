import React, { useEffect } from 'react';
import './StickyBar.css';
import { Link, useLocation } from 'react-router-dom';

const StickyBar = () => {
  const location = useLocation();

  useEffect(() => {
    const scrollFunc = () => {
      const header = document.getElementById('sticky-header');
      const buttons = document.querySelectorAll('.nav-btn');
      if (window.scrollY >= 240) {
        header.classList.add('scrolled');
        buttons.forEach((btn) => btn.classList.add('scrolled'));
      } else {
        header.classList.remove('scrolled');
        buttons.forEach((btn) => btn.classList.remove('scrolled'));
      }
    };

    window.addEventListener('scroll', scrollFunc);
    return () => window.removeEventListener('scroll', scrollFunc);
  }, []);

  return (
    <header id="sticky-header">
      <Link to="/" className={`nav-btn ${location.pathname === '/' ? 'active' : ''}`} id="home-btn">Home</Link>
      <Link to="/about" className={`nav-btn ${location.pathname === '/about' ? 'active' : ''}`} id="about-btn">About Me</Link>
      <Link to="/projects" className={`nav-btn ${location.pathname === '/projects' ? 'active' : ''}`} id="projects-btn">Projects</Link>
      <Link to="/contact" className={`nav-btn ${location.pathname === '/contact' ? 'active' : ''}`} id="contact-btn">Contact Me</Link>
      <Link to="/misc" className={`nav-btn ${location.pathname === '/misc' ? 'active' : ''}`} id="misc-btn">Misc</Link>
    </header>
  );
};

export default StickyBar;
