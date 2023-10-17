import React, { useEffect } from 'react';
import './StickyBar.css';

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
    <button onClick={() => navigateTo('/index.html')} className="nav-btn" id="home-btn">Home</button>
    <button onClick={() => navigateTo('/about.html')} className="nav-btn" id="about-btn">About Me</button>
    <button onClick={() => navigateTo('/projects.html')} className="nav-btn" id="projects-btn">Projects</button>
    <button onClick={() => navigateTo('/contact.html')} className="nav-btn" id="contact-btn">Contact Me</button>
    <button onClick={() => navigateTo('/misc.html')} className="nav-btn" id="misc-btn">Misc</button>
  </header>
);

};

export default StickyBar;
