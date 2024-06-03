import React, { useEffect } from 'react';
import './StickyBar.css';
import { Link, useLocation } from 'react-router-dom';

const StickyBar = () => {
  const location = useLocation();

  const getActiveClass = (path) => {
    const currentPath = location.pathname;

    // Home-related pages
    if (
      currentPath === '/' ||
      currentPath === '/recruiters' ||
      currentPath === '/contractors' ||
      currentPath === '/friends'
    ) {
      return path === '/' ? 'active' : '';
    }

    // Projects-related pages
    if (
      currentPath === '/projects' ||
      currentPath === '/chess'
    ) {
      return path === '/projects' ? 'active' : '';
    }

    // Exact matches for other pages
    return currentPath === path ? 'active' : '';
  };

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
      <Link to="/" className={`nav-btn ${getActiveClass('/')}`} id="home-btn">Home</Link>
      <Link to="/about" className={`nav-btn ${getActiveClass('/about')}`} id="about-btn">About Me</Link>
      <Link to="/projects" className={`nav-btn ${getActiveClass('/projects')}`} id="projects-btn">Projects</Link>
      <Link to="/contact" className={`nav-btn ${getActiveClass('/contact')}`} id="contact-btn">Contact Me</Link>
      <Link to="/misc" className={`nav-btn ${getActiveClass('/misc')}`} id="misc-btn">Misc</Link>
    </header>
  );
};

export default StickyBar;
