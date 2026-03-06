import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import './ProjectCarousel.css';

import RegistrarIcon from '../Pages/ProjectButtons/ProjectButtonImages/RegistrarIcon.png';
import ExcelIcon from '../Pages/ProjectButtons/ProjectButtonImages/ExcelIcon.png';
import SnipeITIcon from '../Pages/ProjectButtons/ProjectButtonImages/SnipeITIcon.png';
import ChessIcon from '../Pages/ProjectButtons/ProjectButtonImages/ChessIcon.png';
import TourismIcon from '../Pages/ProjectButtons/ProjectButtonImages/TourismIcon.png';
import CipherIcon from '../Pages/ProjectButtons/ProjectButtonImages/CipherIcon.png';
import WeatherIcon from '../Pages/ProjectButtons/ProjectButtonImages/Weathericon.png';
import HoroscopeIcon from '../Pages/ProjectButtons/ProjectButtonImages/HoroscopeIcon.png';
import CreditCardIcon from '../Pages/ProjectButtons/ProjectButtonImages/CreditCardIcon.png';

const allProjects = [
  { name: 'Registrar', route: '/RamblerRegistrar', icon: RegistrarIcon },
  { name: 'Excel', route: '/ExcelWorkBooks', icon: ExcelIcon },
  { name: 'Snipe IT', route: '/SnipeITTag', icon: SnipeITIcon },
  { name: 'Chess', route: '/ChessDeck', icon: ChessIcon },
  { name: 'Tourism', route: '/ATourismApp', icon: TourismIcon },
  { name: 'Cipher', route: '/CipherTracker', icon: CipherIcon },
  { name: 'Weather', route: '/WeatherApp', icon: WeatherIcon },
  { name: 'Horoscope', route: '/DrinkDecider', icon: HoroscopeIcon },
  { name: 'Credit Card', route: '/ReactNativeCreditCardApp', icon: CreditCardIcon },
];

function shuffle(arr) {
  const shuffled = [...arr];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

const ROTATION_INTERVAL = 12000;
const TRANSITION_DURATION = 400;

const ProjectCarousel = () => {
  const navigate = useNavigate();
  const projects = useMemo(() => shuffle(allProjects), []);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [displayIndex, setDisplayIndex] = useState(0);
  const [exitingIndex, setExitingIndex] = useState(null);
  const [phase, setPhase] = useState('stable'); // 'stable' | 'enter-start' | 'animating'
  const clickTargetRef = useRef(0);
  const intervalRef = useRef(null);
  const isPausedRef = useRef(false);

  const startInterval = useCallback(() => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    intervalRef.current = setInterval(() => {
      if (!isPausedRef.current) {
        setCurrentIndex((prev) => (prev + 1) % projects.length);
      }
    }, ROTATION_INTERVAL);
  }, [projects.length]);

  useEffect(() => {
    startInterval();
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [startInterval]);

  // Handle transitions when currentIndex changes
  useEffect(() => {
    if (currentIndex === displayIndex) return;

    // Save the old index as the click target during transition
    clickTargetRef.current = displayIndex;
    setExitingIndex(displayIndex);
    setDisplayIndex(currentIndex);
    setPhase('enter-start');

    // Next frame: trigger the animation
    const raf = requestAnimationFrame(() => {
      setPhase('animating');
    });

    // End the transition after duration
    const timer = setTimeout(() => {
      setPhase('stable');
      setExitingIndex(null);
      clickTargetRef.current = currentIndex;
    }, TRANSITION_DURATION);

    return () => {
      cancelAnimationFrame(raf);
      clearTimeout(timer);
    };
  }, [currentIndex]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleClick = () => {
    const targetIndex = phase !== 'stable' ? clickTargetRef.current : displayIndex;
    navigate(projects[targetIndex].route);
  };

  const handleMouseEnter = () => {
    isPausedRef.current = true;
  };

  const handleMouseLeave = () => {
    isPausedRef.current = false;
    startInterval();
  };

  const current = projects[displayIndex];
  const exiting = exitingIndex !== null ? projects[exitingIndex] : null;

  const enterClass =
    phase === 'enter-start'
      ? 'proj-carousel-slide-enter'
      : phase === 'animating'
      ? 'proj-carousel-slide-enter proj-carousel-slide-enter-active'
      : '';

  return (
    <button
      className="proj-carousel"
      onClick={handleClick}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* Static decorative elements */}
      <div className="proj-carousel-rect1"></div>
      <div className="proj-carousel-rect2"></div>
      <div className="proj-carousel-bar2"></div>
      <div className="proj-carousel-bar1"></div>
      <div className="proj-carousel-bar3"></div>
      <div className="proj-carousel-bar4"></div>

      {/* Exiting content */}
      {exiting && (
        <div className="proj-carousel-content proj-carousel-slide-exit-active">
          <div className="proj-carousel-inner-rect">
            <span className="proj-carousel-label">Click here if you want</span>
            <span className="proj-carousel-name">{exiting.name}</span>
          </div>
          <img
            loading="lazy"
            decoding="async"
            src={exiting.icon}
            alt={exiting.name}
            className="proj-carousel-circle-img"
          />
          <div className="proj-carousel-img-container">
            <img
              loading="lazy"
              decoding="async"
              src={exiting.icon}
              alt={exiting.name}
              className="proj-carousel-project-img"
            />
          </div>
        </div>
      )}

      {/* Entering / stable content */}
      <div className={`proj-carousel-content ${enterClass}`}>
        <div className="proj-carousel-inner-rect">
          <span className="proj-carousel-label">Click here if you want</span>
          <span className="proj-carousel-name">{current.name}</span>
        </div>
        <img
          loading="lazy"
          decoding="async"
          src={current.icon}
          alt={current.name}
          className="proj-carousel-circle-img"
        />
        <div className="proj-carousel-img-container">
          <img
            loading="lazy"
            decoding="async"
            src={current.icon}
            alt={current.name}
            className="proj-carousel-project-img"
          />
        </div>
      </div>
    </button>
  );
};

export default ProjectCarousel;
