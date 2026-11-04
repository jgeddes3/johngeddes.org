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
    // The nav is static, so look the nodes up once; and only touch classes
    // when the scrolled state actually flips, not on every scroll event.
    const header = document.getElementById('sticky-header');
    const buttons = Array.from(document.querySelectorAll('.nav-btn'));
    let scrolled = null;

    const scrollFunc = () => {
      const next = window.scrollY >= 80;
      if (next === scrolled) return;
      scrolled = next;
      header.classList.toggle('scrolled', next);
      buttons.forEach((btn) => btn.classList.toggle('scrolled', next));
    };

    scrollFunc();
    window.addEventListener('scroll', scrollFunc, { passive: true });
    return () => window.removeEventListener('scroll', scrollFunc);
  }, []);

  const handleContactClick = (e) => {
    e.preventDefault();
    window.scrollTo({
      top: document.body.scrollHeight,
      behavior: 'smooth'
    });
  };

  return (
    <header id="sticky-header">
      <nav className="nav-links" aria-label="Main">
        <Link to="/" className={`nav-btn ${getActiveClass('/')}`} id="home-btn">Home</Link>
        <Link to="/about" className={`nav-btn ${getActiveClass('/about')}`} id="about-btn">About Me</Link>
        <Link to="/projects" className={`nav-btn ${getActiveClass('/projects')}`} id="projects-btn">Projects</Link>
        <Link to="/misc" className={`nav-btn ${getActiveClass('/misc')}`} id="misc-btn">Misc</Link>
        <Link to="#contact" className={`nav-btn ${getActiveClass('/contact')}`} id="contact-btn" onClick={handleContactClick}>Contact Me</Link>
      </nav>
    </header>
  );
};

export default StickyBar;
