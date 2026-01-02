import React, { useEffect } from 'react';
import './Background.css';

const Background = () => {
  useEffect(() => {
    const orbs = Array.from(document.querySelectorAll('.orb'));
    if (!orbs.length) {
      return;
    }

    let angle = 0;
    const step = 0.005;
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const isSmallScreen = window.innerWidth <= 768;

    const updateOrbPositions = () => {
      const centerX = window.innerWidth / 2;
      const centerY = window.innerHeight / 2;
      const radiusX = window.innerWidth / 2;
      const radiusY = window.innerHeight / 4;

      orbs.forEach((orb, index) => {
        const phase = (Math.PI / 2) * index;
        const figureEightX = Math.sin(angle + phase) * radiusX;
        const figureEightY = Math.sin(angle * 2 + phase) * radiusY;

        const x = centerX + figureEightX - orb.clientWidth / 2;
        const y = centerY + figureEightY - orb.clientHeight / 2;
        orb.style.transform = `translate3d(${x}px, ${y}px, 0)`;
      });

      angle += step;
    };

    updateOrbPositions();

    if (prefersReducedMotion || isSmallScreen) {
      return;
    }

    let rafId = 0;
    let lastTime = 0;

    const animate = (time) => {
      if (time - lastTime >= 33) {
        lastTime = time;
        updateOrbPositions();
      }
      rafId = window.requestAnimationFrame(animate);
    };

    rafId = window.requestAnimationFrame(animate);

    return () => window.cancelAnimationFrame(rafId);
  }, []);

  return (
    <>
    <div className="orb-container">
      <div id="orb1" className="orb"></div>
      <div id="orb2" className="orb"></div>
      <div id="orb3" className="orb"></div>
      <div id="orb4" className="orb"></div>
     <div id="orb5" className="orb"></div>
     <div id="orb6" className="orb"></div>
     <div id="orb8" className="orb"></div>
      <div className="blur-rectangle"></div>
    </div>
    </>
  );

};

export default Background;
