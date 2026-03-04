import React, { useRef, useCallback, useEffect, useState } from 'react';
import { useTheme } from '../../ThemeContext';
import './InteractiveBars.css';

const BAR_COUNT = 24;
const RESTING_HEIGHT = 20;
const MAX_HEIGHT = 80;
const INFLUENCE_RADIUS = 4;

function isDarkHour(index) {
  return index < 7 || index >= 19;
}

export default function InteractiveBars() {
  const { preference, currentHour, toggleTheme } = useTheme();
  const containerRef = useRef(null);
  const barsContainerRef = useRef(null);
  const barsRef = useRef([]);
  const rafRef = useRef(null);
  const mouseXRef = useRef(null);
  const isHoveringRef = useRef(false);
  const currentHourRef = useRef(currentHour);

  // Track indicator position by reading actual bar element offset
  const [indicatorLeft, setIndicatorLeft] = useState(0);

  const updateIndicatorPosition = useCallback(() => {
    const bar = barsRef.current[currentHour];
    const wrapper = containerRef.current;
    if (bar && wrapper) {
      const wrapperRect = wrapper.getBoundingClientRect();
      const barRect = bar.getBoundingClientRect();
      // Center of bar relative to the outer timeline-container
      setIndicatorLeft(barRect.left - wrapperRect.left + barRect.width / 2);
    }
  }, [currentHour]);

  // Keep ref in sync with currentHour state
  useEffect(() => {
    currentHourRef.current = currentHour;
    // Update the current-hour bar even when not hovering
    if (!isHoveringRef.current) {
      barsRef.current.forEach((b, i) => {
        if (b) b.style.height = i === currentHour ? `${MAX_HEIGHT}px` : `${RESTING_HEIGHT}px`;
      });
    }
    updateIndicatorPosition();
  }, [currentHour, updateIndicatorPosition]);

  useEffect(() => {
    // Recalculate on mount and resize
    const handleResize = () => updateIndicatorPosition();
    // Small delay on mount to ensure layout is complete
    requestAnimationFrame(updateIndicatorPosition);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [updateIndicatorPosition]);

  const updateBars = useCallback(() => {
    const bars = barsRef.current;
    if (!bars.length) return;

    bars.forEach((bar, i) => {
      if (!bar) return;
      let height = RESTING_HEIGHT;

      // Current hour bar is always fully raised
      if (i === currentHourRef.current) {
        height = MAX_HEIGHT;
      }

      if (isHoveringRef.current && mouseXRef.current !== null) {
        const container = barsContainerRef.current;
        if (container) {
          const rect = container.getBoundingClientRect();
          const barWidth = rect.width / BAR_COUNT;
          const barCenterX = barWidth * (i + 0.5);
          const relativeMouseX = mouseXRef.current - rect.left;
          const distance = Math.abs(barCenterX - relativeMouseX) / barWidth;

          if (distance < INFLUENCE_RADIUS) {
            const factor = (Math.cos((distance / INFLUENCE_RADIUS) * Math.PI) + 1) / 2;
            const hoverHeight = RESTING_HEIGHT + (MAX_HEIGHT - RESTING_HEIGHT) * factor;
            height = Math.max(height, hoverHeight);
          }
        }
      }

      bar.style.height = `${height}px`;
    });

    rafRef.current = requestAnimationFrame(updateBars);
  }, []);

  const handleMouseMove = useCallback((e) => {
    mouseXRef.current = e.clientX;
  }, []);

  const handleMouseEnter = useCallback(() => {
    isHoveringRef.current = true;
    if (!rafRef.current) {
      rafRef.current = requestAnimationFrame(updateBars);
    }
  }, [updateBars]);

  const handleMouseLeave = useCallback(() => {
    isHoveringRef.current = false;
    mouseXRef.current = null;
    barsRef.current.forEach((bar, i) => {
      if (bar) bar.style.height = i === currentHourRef.current ? `${MAX_HEIGHT}px` : `${RESTING_HEIGHT}px`;
    });
    if (rafRef.current) {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    }
  }, []);

  const handleTouchMove = useCallback((e) => {
    if (e.touches.length > 0) {
      isHoveringRef.current = true;
      mouseXRef.current = e.touches[0].clientX;
      if (!rafRef.current) {
        rafRef.current = requestAnimationFrame(updateBars);
      }
    }
  }, [updateBars]);

  const handleTouchEnd = useCallback(() => {
    handleMouseLeave();
  }, [handleMouseLeave]);

  useEffect(() => {
    return () => {
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
      }
    };
  }, []);

  const icon = preference === 'light' ? '\u2600' : '\u263D';

  return (
    <div className="timeline-container" ref={containerRef}>
      <div
        className="timeline-indicator"
        style={{ left: `${indicatorLeft}px` }}
      >
        <button onClick={toggleTheme} aria-label="Toggle theme">
          {icon}
        </button>
      </div>
      <div
        ref={barsContainerRef}
        className="timeline-bars"
        onMouseMove={handleMouseMove}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {Array.from({ length: BAR_COUNT }, (_, i) => (
          <div
            key={i}
            ref={(el) => { barsRef.current[i] = el; }}
            className={`timeline-bar ${isDarkHour(i) ? 'bar-dark-hour' : 'bar-light-hour'}`}
            style={{ height: `${i === currentHour ? MAX_HEIGHT : RESTING_HEIGHT}px` }}
          />
        ))}
      </div>
    </div>
  );
}
