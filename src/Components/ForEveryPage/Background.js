import React, { useEffect } from 'react';
import './Background.css';

const Background = () => {
  useEffect(() => {
    let angle = 0;
    const step = 0.005;
      const radiusX = window.innerWidth / 2;
      const radiusY = window.innerHeight / 4;

    const updateOrbPositions = () => {
      const centerX = window.innerWidth / 2;
      const centerY = window.innerHeight / 2;
      // directly query within React component
      const orbs = document.querySelectorAll('.orb');

      orbs.forEach((orb, index) => {
        const phase = (Math.PI / 2) * index;
        const figureEightX = Math.sin(angle + phase) * radiusX;
        const figureEightY = Math.sin(angle * 2 + phase) * radiusY;
        
        orb.style.left = `${centerX + figureEightX - orb.clientWidth / 2}px`;
        orb.style.top = `${centerY + figureEightY - orb.clientHeight / 2}px`;
      });

      angle += step;
    };

    const intervalId = setInterval(updateOrbPositions, 16);
    return () => clearInterval(intervalId);  // Cleanup
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
