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
            <div className="group-right">
                <div className="spotifyrect1"></div>
                <div className="inline-container">
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
                </div>
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
            </div>
            <div className="group-left">
                <div className="columns">
                    <div className="column">
                        <div className="column-title">More</div>
                        <a href="/path/to/JohnGeddesResume.pdf" download className="bottom-button resume-button bottomtext1">
                            Resume Download
                        </a>
                        <a href="https://www.linkedin.com/in/therealjohngeddes" target="_blank" rel="noopener noreferrer" className="bottom-button linkedin-button bottomtext1">
                            LinkedIn
                        </a>
                        <a href="https://read.cv/johngeddes" target="_blank" rel="noopener noreferrer" className="bottom-button cv-button bottomtext1">
                            CV
                        </a>
                        <a href="https://github.com/jgeddes3" target="_blank" rel="noopener noreferrer" className="bottom-button github-button bottomtext1">
                            Github
                        </a>
                    </div>
                    <div className="column">
                        <div className="column-title">Contact</div>
                        <div className="bottomtext1">johngeddes@pm.me</div>
                        <div className="bottomtext1">(612) 790-3691</div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Bottombar;
