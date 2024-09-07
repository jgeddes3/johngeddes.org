import React, { useState, useRef } from 'react';
import './Bottombar.css';
import SpotifyCurrentlyPlaying from '../../SpotifyCurrentlyPlaying.js';
import Resume1 from '../PDF/Geddes_Resume_24.pdf';

const Bottombar = () => {
    const [showOverlay, setShowOverlay] = useState(false);
    const timeoutRef = useRef(null);

    const handleMouseEnter = () => {
        clearTimeout(timeoutRef.current);
        setShowOverlay(true);
    };

    const handleMouseLeave = () => {
        timeoutRef.current = setTimeout(() => {
            setShowOverlay(false);
        }, 1000); // Delay hiding the overlay by 1 second
    };

    return (
        <div className="bottom-bar">
            <div className="group-right">
                <div className="spotifyrect1">
                    <SpotifyCurrentlyPlaying />
                </div>
                <div className="inline-container">
                    <div className="name1 bottomtext1">John Geddes</div>
                    <div className="ellipse5"></div>
                    <button 
                        className="button11" 
                        onMouseEnter={handleMouseEnter}
                        onMouseLeave={handleMouseLeave}
                    >
                        <span className="button-text1 bottomtext1">Colophon</span>
                        {showOverlay && (
                            <div className="overlay fade-in">
                                <div className="overlay-left">
                                    <div className="overlay-text overlay-text-large">Figma for Design</div>
                                    <div className="overlay-text overtext1">React for Code</div>
                                    <div className="overlay-text overtext2">GitHub for other versions</div>
                                    <div className="overlay-text overtext3">Vercel for Launch</div>
                                </div>
                                <div className="overlay-right">
                                    <div className="overlay-paragraph">
                                        Galgine for Headline, EB Garamond for body. Plus heavily inspired by other online webpages.
                                    </div>
                                </div>
                            </div>
                        )}
                    </button>
                </div>
            </div>
            <div className="group-left">
                <div className="columns">
                    <div className="column">
                        <div className="column-title">More</div>
                        <a href={Resume1} download="Audio_Visual_Engineer_Resume.pdf" className="bottom-button resume-button bottomtext1">
                                            Resume Download
                                        </a>
                        <a href="https://www.linkedin.com/in/therealjohngeddes" target="_blank" rel="noopener noreferrer" className="bottom-button linkedin-button bottomtext1">
                            LinkedIn
                        </a>
                        <a href="https://read.cv/johngeddes" target="_blank" rel="noopener noreferrer" className="bottom-button cv-button bottomtext1">
                            CV
                        </a>
                        <a href="https://github.com/jgeddes" target="_blank" rel="noopener noreferrer" className="bottom-button github-button bottomtext1">
                            Github
                        </a>
                    </div>
                    <div className="column">
                        <div className="column-title">Contact</div>
                        <div className="bottomtext1">johngeddes@pm.me</div>
                        <div className="bottomtext1">(312) 298-9877</div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Bottombar;
