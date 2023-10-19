import React, { useState } from 'react';
import './Bottombar.css';

const Bottombar = () => {
    const [showOverlay, setShowOverlay] = useState(false);
    const [position, setPosition] = useState({ x: 0, y: 0 });

    const handleMouseEnter = () => {
        setShowOverlay(true);
      };
    
      const handleMouseLeave = () => {
        setShowOverlay(false);
      };

      const handleMouseMove = (e) => {
        setPosition({
        x: e.clientX,
        y: e.clientY,
        });
     };
  
    return (
        <div className="bottom-bar">
        <div className="spotifyrect1"></div>
        <div className="name1 bottomtext1">John Geddes</div>
        <div className="ellipse5"></div>
        <button 
        className="button11" 
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onMouseMove={handleMouseMove}
      >
        <span className="button-text1 bottomtext1">Colophone</span>
      </button>
      {showOverlay && (
        <div className="overlay" style={{ left: `${position.x}px`, top: `${position.y}px` }}>
          <div className="overlay-text overlay-text-large">Figma for Design</div>
          <div className="overlay-text overtext1">React for Code</div>
          <div className="overlay-text overtext2">GitHub for other versions</div>
          <div className="overlay-text overtext3">AWS for Launch</div>
          <div className="overlay-paragraph">
            Galgine for Headline, EB Garamond for body. Plus heavily inspired by other online webpages.
          </div>
        </div>
        )}
        <div className="elsewhereB bottomtext1">Elsewhere</div>
        <div className="to-the-rightB bottomtext1">Contact</div>
        <button className="bottom-button resume-button bottomtext1">Resume Download</button>
        <button className="bottom-button linkedin-button bottomtext1">LinkedIn</button>
        <button className="bottom-button cv-button bottomtext1">CV</button>
        <button className="bottom-button github-button bottomtext1">Github</button>
        <div className="email bottomtext1" style={{top: '62px'}}>johngeddes@pm.me</div>
        <div className="phone bottomtext1" style={{top: '94px'}}>(612) 790-3691</div>

      </div>
    );
  };

export default Bottombar;
