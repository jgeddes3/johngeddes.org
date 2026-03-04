import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import SEO from '../../ForEveryPage/SEO';
import Background from '../../ForEveryPage/Background';
import PageFooter from '../../ForEveryPage/PageFooter';
import Logo from '../ProjectButtons/ProjectButtonImages/HoroscopeLogo.webp';
import TinyStar from './ProjectPageImages/TinyStar.png';
import SignAries from './ProjectPageImages/Horoscope/Aries.png';
import SignTaurus from './ProjectPageImages/Horoscope/Taurus.png';
import SignGemini from './ProjectPageImages/Horoscope/Gemini.png';
import SignCancer from './ProjectPageImages/Horoscope/Cancer.png';
import SignLeo from './ProjectPageImages/Horoscope/Leo.png';
import SignVirgo from './ProjectPageImages/Horoscope/Virgo.png';
import SignLibra from './ProjectPageImages/Horoscope/Libra.png';
import SignScorpio from './ProjectPageImages/Horoscope/Scorpio.png';
import SignSagittarius from './ProjectPageImages/Horoscope/Sagittarius.png';
import SignCapricorn from './ProjectPageImages/Horoscope/Capricorn.png';
import SignAquarius from './ProjectPageImages/Horoscope/Aquarius.png';
import SignPisces from './ProjectPageImages/Horoscope/Pisces.png';
import './DrinkDecider.css';

const ZODIAC_DATA = [
  { sign: 'capricorn',   icon: SignCapricorn,   element: 'earth', start: [1, 1],   end: [1, 19] },
  { sign: 'aquarius',    icon: SignAquarius,    element: 'air',   start: [1, 20],  end: [2, 18] },
  { sign: 'pisces',      icon: SignPisces,      element: 'water', start: [2, 19],  end: [3, 20] },
  { sign: 'aries',       icon: SignAries,       element: 'fire',  start: [3, 21],  end: [4, 19] },
  { sign: 'taurus',      icon: SignTaurus,      element: 'earth', start: [4, 20],  end: [5, 20] },
  { sign: 'gemini',      icon: SignGemini,      element: 'air',   start: [5, 21],  end: [6, 20] },
  { sign: 'cancer',      icon: SignCancer,      element: 'water', start: [6, 21],  end: [7, 22] },
  { sign: 'leo',         icon: SignLeo,         element: 'fire',  start: [7, 23],  end: [8, 22] },
  { sign: 'virgo',       icon: SignVirgo,       element: 'earth', start: [8, 23],  end: [9, 22] },
  { sign: 'libra',       icon: SignLibra,       element: 'air',   start: [9, 23],  end: [10, 22] },
  { sign: 'scorpio',     icon: SignScorpio,     element: 'water', start: [10, 23], end: [11, 21] },
  { sign: 'sagittarius', icon: SignSagittarius, element: 'fire',  start: [11, 22], end: [12, 21] },
  { sign: 'capricorn',   icon: SignCapricorn,   element: 'earth', start: [12, 22], end: [12, 31] },
];

function getZodiac(month, day) {
  const m = parseInt(month, 10);
  const d = parseInt(day, 10);
  if (isNaN(m) || isNaN(d) || m < 1 || m > 12 || d < 1 || d > 31) return null;
  for (const z of ZODIAC_DATA) {
    const afterStart = m > z.start[0] || (m === z.start[0] && d >= z.start[1]);
    const beforeEnd = m < z.end[0] || (m === z.end[0] && d <= z.end[1]);
    if (afterStart && beforeEnd) return z;
  }
  return null;
}

// Twinkling stars layer
function TwinklingStars() {
  const canvasRef = useRef(null);
  const starsRef = useRef([]);
  const tinyStarImg = useRef(null);

  useEffect(() => {
    const img = new Image();
    img.src = TinyStar;
    img.onload = () => { tinyStarImg.current = img; };
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let raf;

    const resize = () => {
      canvas.width = canvas.parentElement.offsetWidth;
      canvas.height = canvas.parentElement.offsetHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    const MAX_STARS = 40;

    const spawnStar = () => {
      // 70% dots, 30% tinystar images
      const isTinyStar = tinyStarImg.current && Math.random() < 0.3;
      return {
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        size: isTinyStar ? 8 + Math.random() * 14 : 1 + Math.random() * 2.5,
        opacity: 0,
        maxOpacity: 0.3 + Math.random() * 0.7,
        phase: Math.random() * Math.PI * 2,
        speed: 0.005 + Math.random() * 0.015,
        life: 0,
        maxLife: 120 + Math.random() * 300,
        isTinyStar,
      };
    };

    // Seed initial stars
    for (let i = 0; i < 20; i++) {
      const s = spawnStar();
      s.life = Math.random() * s.maxLife;
      starsRef.current.push(s);
    }

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Possibly spawn new stars
      if (starsRef.current.length < MAX_STARS && Math.random() < 0.08) {
        starsRef.current.push(spawnStar());
      }

      starsRef.current = starsRef.current.filter(s => {
        s.life++;
        // Fade in first 30 frames, fade out last 30 frames
        const fadeIn = Math.min(s.life / 30, 1);
        const fadeOut = Math.min((s.maxLife - s.life) / 30, 1);
        s.opacity = s.maxOpacity * fadeIn * Math.max(fadeOut, 0);

        // Subtle twinkle
        const twinkle = 0.7 + 0.3 * Math.sin(s.life * s.speed * 10 + s.phase);
        const alpha = s.opacity * twinkle;

        if (s.isTinyStar && tinyStarImg.current) {
          const img = tinyStarImg.current;
          const aspect = img.naturalWidth / img.naturalHeight;
          const w = s.size * aspect;
          const h = s.size;
          ctx.globalAlpha = alpha;
          ctx.drawImage(img, s.x - w / 2, s.y - h / 2, w, h);
          ctx.globalAlpha = 1;
        } else {
          ctx.fillStyle = `rgba(255, 255, 255, ${alpha})`;
          ctx.beginPath();
          ctx.arc(s.x, s.y, s.size, 0, Math.PI * 2);
          ctx.fill();
        }

        return s.life < s.maxLife;
      });

      raf = requestAnimationFrame(draw);
    };
    raf = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', resize);
    };
  }, []);

  return <canvas ref={canvasRef} className="dh-stars-canvas" />;
}

const DrinkDecider = () => {
  const [month, setMonth] = useState('');
  const [day, setDay] = useState('');
  const [year, setYear] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');
  const dayRef = useRef(null);
  const yearRef = useRef(null);
  const savedPrefRef = useRef(null);

  // Force dark mode on mount, block changes, restore on unmount
  useEffect(() => {
    // Remember what the user actually had (from localStorage or current DOM)
    savedPrefRef.current = localStorage.getItem('theme-preference') ||
      document.documentElement.getAttribute('data-theme') || 'light';

    // Force dark
    document.documentElement.setAttribute('data-theme', 'dark');

    // Watch for anything trying to change it back (ThemeContext, toggle clicks, etc.)
    const observer = new MutationObserver((mutations) => {
      for (const m of mutations) {
        if (m.attributeName === 'data-theme' &&
            document.documentElement.getAttribute('data-theme') !== 'dark') {
          document.documentElement.setAttribute('data-theme', 'dark');
        }
      }
    });
    observer.observe(document.documentElement, { attributes: true });

    return () => {
      observer.disconnect();
      // Restore their original preference exactly as it was
      const original = savedPrefRef.current;
      document.documentElement.setAttribute('data-theme', original);
      // Make sure localStorage still has their real choice, not "dark"
      if (original) {
        localStorage.setItem('theme-preference', original);
      }
    };
  }, []);

  const handleMonthChange = (val) => {
    const clean = val.replace(/\D/g, '').slice(0, 2);
    setMonth(clean);
    if (clean.length === 2) dayRef.current?.focus();
  };

  const handleDayChange = (val) => {
    const clean = val.replace(/\D/g, '').slice(0, 2);
    setDay(clean);
    if (clean.length === 2) yearRef.current?.focus();
  };

  const handleYearChange = (val) => {
    setYear(val.replace(/\D/g, '').slice(0, 4));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    const zodiac = getZodiac(month, day);
    if (!zodiac) {
      setError('please enter a valid birthday');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`/api/horoscope?sign=${zodiac.sign}`);
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.error || 'something went wrong');
      }
      const data = await res.json();
      setResult({ ...data, zodiac });
    } catch (err) {
      setError(err.message || 'failed to read the stars');
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setResult(null);
    setMonth('');
    setDay('');
    setYear('');
    setError('');
  };

  return (
    <>
      <SEO
        title="Drink Horoscope"
        description="Get a cocktail paired to your zodiac horoscope reading."
        path="/DrinkDecider"
      />
      <div className="drink-horoscope">
        {/* Hero — orbs visible behind */}
        <Background />
        <div className="dh-hero">
          <h1 className="dh-hero-title">Drink Horoscope</h1>
        </div>

        {/* Fade from orbs → black */}
        <div className="dh-fade-to-black" />

        {/* Black starfield section */}
        <div className="dh-black-section">
          <TwinklingStars />

          {/* Landing */}
          {!loading && !result && (
            <div className="dh-landing">
              <img src={Logo} alt="" className="dh-logo" />
              <h2 className="dh-enter-text">Enter your birthday</h2>
              <form className="dh-form" onSubmit={handleSubmit}>
                <div className="dh-date-inputs">
                  <div className="dh-date-field">
                    <input
                      type="text"
                      inputMode="numeric"
                      placeholder="mm"
                      value={month}
                      onChange={(e) => handleMonthChange(e.target.value)}
                      maxLength={2}
                      autoFocus
                    />
                    <label>month</label>
                  </div>
                  <div className="dh-date-field">
                    <input
                      ref={dayRef}
                      type="text"
                      inputMode="numeric"
                      placeholder="dd"
                      value={day}
                      onChange={(e) => handleDayChange(e.target.value)}
                      maxLength={2}
                    />
                    <label>day</label>
                  </div>
                  <div className="dh-date-field">
                    <input
                      ref={yearRef}
                      type="text"
                      inputMode="numeric"
                      placeholder="yyyy"
                      value={year}
                      onChange={(e) => handleYearChange(e.target.value)}
                      maxLength={4}
                      className="dh-year-input"
                    />
                    <label>year</label>
                  </div>
                </div>
                <button
                  type="submit"
                  className="dh-reveal-btn"
                  disabled={!month || !day}
                >
                  reveal
                </button>
              </form>
              {error && <p className="dh-error">{error}</p>}
            </div>
          )}

          {/* Loading */}
          {loading && (
            <div className="dh-loading">
              <p className="dh-loading-text">reading the stars...</p>
              <div className="dh-loading-dot" />
            </div>
          )}

          {/* Result */}
          {result && !loading && (
            <div className="dh-result">
              <div className="dh-sign-header">
                {result.horoscope?.color && (
                  <div
                    className="dh-sign-glow"
                    style={{ background: result.horoscope.color }}
                  />
                )}
                <img src={result.zodiac.icon} alt={result.sign} className="dh-sign-icon" />
                <h1 className="dh-sign-name">{result.sign}</h1>
                <span className="dh-sign-element">{result.zodiac.element}</span>
              </div>

              <div className="dh-horoscope-section">
                <p className="dh-horoscope-text">{result.horoscope?.text}</p>
              </div>

              <div className="dh-details">
                {result.horoscope?.mood && (
                  <div className="dh-detail-row">
                    <span className="dh-detail-label">mood</span>
                    <span className="dh-detail-value">{result.horoscope.mood}</span>
                  </div>
                )}
                {result.horoscope?.luckyNumber && (
                  <div className="dh-detail-row">
                    <span className="dh-detail-label">lucky number</span>
                    <span className="dh-detail-value">{result.horoscope.luckyNumber}</span>
                  </div>
                )}
                {result.horoscope?.compatibility && (
                  <div className="dh-detail-row">
                    <span className="dh-detail-label">compatibility</span>
                    <span className="dh-detail-value">{result.horoscope.compatibility}</span>
                  </div>
                )}
              </div>

              {result.cocktail && (
                <>
                  <hr className="dh-divider" />
                  <div className="dh-cocktail-section">
                    <p className="dh-cocktail-label">your cocktail</p>
                    {result.cocktail.image && (
                      <img
                        src={result.cocktail.image}
                        alt={result.cocktail.name}
                        className="dh-cocktail-image"
                      />
                    )}
                    <h2 className="dh-cocktail-name">{result.cocktail.name}</h2>
                    {result.cocktail.glass && (
                      <p className="dh-cocktail-glass">served in a {result.cocktail.glass}</p>
                    )}
                    {result.flavorProfile && (
                      <p className="dh-vibe">{result.flavorProfile}</p>
                    )}

                    {result.cocktail.ingredients?.length > 0 && (
                      <div className="dh-ingredients">
                        <h2>ingredients</h2>
                        {result.cocktail.ingredients.map((ing, i) => (
                          <div key={i} className="dh-ingredient-row">
                            <span className="dh-ingredient-name">{ing.ingredient}</span>
                            <span className="dh-ingredient-measure">{ing.measure}</span>
                          </div>
                        ))}
                      </div>
                    )}

                    {result.cocktail.instructions && (
                      <div className="dh-instructions">
                        <h2>instructions</h2>
                        <p>{result.cocktail.instructions}</p>
                      </div>
                    )}
                  </div>
                </>
              )}

              <button className="dh-try-again" onClick={handleReset}>
                try again
              </button>

              <div className="dh-nav-buttons">
                <Link to="/projects" className="proj-nav-button">
                  projects page
                </Link>
              </div>
            </div>
          )}
        </div>

        {/* Fade from black → site bg for footer */}
        <div className="dh-fade-to-footer" />
      </div>
      <PageFooter />
    </>
  );
};

export default DrinkDecider;
