import React, { useEffect } from 'react';
import './Background.css';

const Background = () => {
  useEffect(() => {
    let angle = 0;
    const step = 0.005;
    const radius = 400;

    const updateOrbPositions = () => {
      const centerX = window.innerWidth / 2;
      const centerY = window.innerHeight / 2;
      // directly query within React component
      const orbs = document.querySelectorAll('.orb');

      orbs.forEach((orb, index) => {
        const phase = (Math.PI / 2) * index;
        orb.style.left = `${centerX + radius * Math.cos(angle + phase) - orb.clientWidth / 2}px`;
        orb.style.top = `${centerY + radius * Math.sin(angle + phase) - orb.clientHeight / 2}px`;
      });

      angle += step;
    };

    const intervalId = setInterval(updateOrbPositions, 16);
    return () => clearInterval(intervalId);  // Cleanup
  }, []);

  return (
    <div className="orb-container">
      <div id="orb1" className="orb"></div>
      <div id="orb2" className="orb"></div>
      <div id="orb3" className="orb"></div>
      <div id="orb4" className="orb"></div>
    </div>
  );

};

export default Background;
