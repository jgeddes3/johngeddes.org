import React, { useState, useRef, useEffect } from 'react';
import './Bottombar.css';
import LastFmRecentlyPlayed from '../../LastFmRecentlyPlayed';

const Resume1 = '/Geddes_Resume_26.pdf';

const Bottombar = () => {
    const [showOverlay, setShowOverlay] = useState(false);
    const timeoutRef = useRef(null);
    const overlayRef = useRef(null);

    const handleMouseEnter = () => {
        clearTimeout(timeoutRef.current);
        setShowOverlay(true);
    };

    const handleMouseLeave = () => {
        timeoutRef.current = setTimeout(() => {
            setShowOverlay(false);
        }, 1000);
    };

    const handleColophonClick = (e) => {
        e.stopPropagation();
        setShowOverlay(prev => !prev);
    };

    // Close overlay when clicking anywhere else (mobile)
    useEffect(() => {
        if (!showOverlay) return;

        const handleClickOutside = (e) => {
            if (overlayRef.current && !overlayRef.current.contains(e.target)) {
                setShowOverlay(false);
            }
        };

        document.addEventListener('click', handleClickOutside);
        return () => document.removeEventListener('click', handleClickOutside);
    }, [showOverlay]);

    // Clear any pending hide-timeout on unmount
    useEffect(() => () => clearTimeout(timeoutRef.current), []);

    return (
        // Explicit role: pages render this inside <main>, where an implicit
        // <footer> would not be exposed as a contentinfo landmark.
        <footer className="bottom-bar" role="contentinfo">
            <div className="group-right">
                <div className="lastfmrect1">
                    <LastFmRecentlyPlayed />
                </div>
                <div className="inline-container">
                    <div className="name1 bottomtext1">John Geddes</div>
                    <div className="ellipse5"></div>
                    <div
                        className="colophon-wrap"
                        ref={overlayRef}
                        onMouseEnter={handleMouseEnter}
                        onMouseLeave={handleMouseLeave}
                    >
                        <button
                            type="button"
                            className="button11"
                            aria-expanded={showOverlay}
                            aria-controls="colophon-overlay"
                            onClick={handleColophonClick}
                        >
                            <span className="button-text1 bottomtext1">Colophon</span>
                        </button>
                        {showOverlay && (
                            <div id="colophon-overlay" className="overlay fade-in">
                                <div className="overlay-left">
                                    <div className="overlay-text overlay-text-large">Figma for Design</div>
                                    <div className="overlay-text overtext1">React for Code</div>
                                    <div className="overlay-text overtext2">GitHub for other versions</div>
                                    <div className="overlay-text overtext3">Vercel for Launch</div>
                                </div>
                                <div className="overlay-right">
                                    <div className="overlay-paragraph">
                                        Galgine for Headline, EB Garamond for body. Designed and Coded by me, John Geddes.
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
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
                        <a href="https://github.com/jgeddes3" target="_blank" rel="noopener noreferrer" className="bottom-button github-button bottomtext1">
                            Github
                        </a>
                    </div>
                    <div className="column">
                        <div className="column-title">Contact</div>
                        <a className="bottomtext1" href="mailto:app@johngeddes.org">app@johngeddes.org</a>
                        <a className="bottomtext1" href="tel:+13126120347">(312) 612-0347</a>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Bottombar;
