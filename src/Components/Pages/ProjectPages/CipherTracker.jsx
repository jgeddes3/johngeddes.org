import React, { useState } from 'react';
import { motion } from 'framer-motion';
import Background from '../../ForEveryPage/Background';
import PageFooter from '../../ForEveryPage/PageFooter';
import SEO from '../../ForEveryPage/SEO';
import { Link } from 'react-router-dom';
import './ProjectTemplate.css';
import MainPhoto from './ProjectPageImages/CipherTracker/Ciphertrackerphoto1.webp';
import Analytics from './ProjectPageImages/CipherTracker/IMG_9430.PNG';
import Security from './ProjectPageImages/CipherTracker/IMG_9424.PNG';
import Progress from './ProjectPageImages/CipherTracker/IMG_9431.PNG';
import Modules from './ProjectPageImages/CipherTracker/IMG_9436.PNG';
import AnalyticsImg1 from './ProjectPageImages/CipherTracker/IMG_9432.PNG';
import AnalyticsImg2 from './ProjectPageImages/CipherTracker/IMG_9433.PNG';
import AnalyticsImg3 from './ProjectPageImages/CipherTracker/IMG_9454.PNG';
import AnalyticsImg4 from './ProjectPageImages/CipherTracker/IMG_9455.PNG';
import AnalyticsImg5 from './ProjectPageImages/CipherTracker/IMG_9456.PNG';
import AnalyticsImg6 from './ProjectPageImages/CipherTracker/IMG_9457.PNG';

const ANALYTICS_IMAGES = [AnalyticsImg1, AnalyticsImg2, AnalyticsImg3, AnalyticsImg4, AnalyticsImg5, AnalyticsImg6];

const AnalyticsCard = ({ src, index, total, hoveredIndex, onHover }) => {
  const centerIndex = (total - 1) / 2;
  const rotateValue = (index - centerIndex) * 5;
  const yOffset = Math.abs(index - centerIndex) * 10;
  const isHovered = hoveredIndex === index;
  const isAnyHovered = hoveredIndex !== null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 100, rotate: 0 }}
      animate={{
        opacity: 1,
        y: isHovered ? -20 : yOffset,
        rotate: isHovered ? 0 : rotateValue,
        scale: isHovered ? 1.1 : (isAnyHovered ? 0.9 : 1),
        zIndex: isHovered ? 50 : index,
      }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      onMouseEnter={() => onHover(index)}
      onMouseLeave={() => onHover(null)}
      style={{
        position: 'relative',
        width: '200px',
        height: '400px',
        borderRadius: '2rem',
        overflow: 'hidden',
        border: '6px solid #1a1a1a',
        backgroundColor: 'black',
        boxShadow: '0 25px 50px -12px rgba(163, 0, 0, 0.1)',
        cursor: 'pointer',
        transformOrigin: 'bottom center',
        marginLeft: index === 0 ? 0 : '-60px',
        flexShrink: 0,
      }}
    >
      <img
        loading="lazy"
        decoding="async"
        src={src}
        alt={`Analytics screenshot ${index + 1}`}
        style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '1.5rem' }}
      />
    </motion.div>
  );
};

const CipherTracker = () => {
  const [hoveredIndex, setHoveredIndex] = useState(null);

  return (
    <>
      <SEO
        title="Cipher Tracker"
        description="Cipher Tracker — a React Native habit tracking app with AES-256 encryption, analytics, and complete privacy by John Geddes."
        path="/CipherTracker"
      />
      <Background />
      <div id="centerpiece2" className="main-content">
        <h1>Cipher Tracker</h1>
      </div>
      <div className="proj-page main-content">
        <div className="proj-hero">
          <p className="proj-hero-tagline">
            Master Your Habits. Secure Your Life.
          </p>
          <div className="proj-tech-pills">
            <span className="proj-pill">React Native</span>
            <span className="proj-pill">AES-256 Encryption</span>
            <span className="proj-pill">PBKDF2</span>
            <span className="proj-pill">Analytics Engine</span>
          </div>
          <div className="proj-actions">
            <a href="https://www.cipher-app.org/" target="_blank" rel="noopener noreferrer" className="proj-action-link">
              cipher-app.org
            </a>
          </div>
        </div>

        <div className="proj-hero-screenshot">
          <img loading="lazy" decoding="async" src={MainPhoto} alt="Cipher Tracker" />
        </div>

        <div className="proj-about">
          <p>
            Cipher Tracker is the ultimate private tracker for what matters most.
            From screen time to sleep, own your data with military-grade encryption. Built as a React Native mobile application,
            Cipher Tracker gives users complete control over their personal data while providing powerful tracking and analytics
            capabilities across a wide range of daily habits and health metrics.
          </p>
        </div>

        <div className="proj-features">
          <div className="proj-feature-card">
            <div className="proj-feature-icon">📱</div>
            <h3>Unified Tracking</h3>
            <p>
              Everything in one place — a single dashboard for all your trackers. Monitor drinks, screen time,
              caffeine, cannabis, sleep, calories, period cycles, nicotine, pills, hydration, or keep a diary.
            </p>
          </div>
          <div className="proj-feature-card">
            <div className="proj-feature-icon">📈</div>
            <h3>Advanced Analytics</h3>
            <p>
              Interactive charts and weekly summaries power your self-improvement journey. The analytics engine
              surfaces meaningful trends, patterns, and insights to understand your habits at a deeper level.
            </p>
          </div>
          <div className="proj-feature-card">
            <div className="proj-feature-icon">🔒</div>
            <h3>Complete Privacy</h3>
            <p>
              AES-256 encryption with a zero-access architecture. Your information is encrypted on-device
              before it ever touches a server, using PBKDF2 key derivation for maximum security.
            </p>
          </div>
          <div className="proj-feature-card">
            <div className="proj-feature-icon">📊</div>
            <h3>Progress Visualization</h3>
            <p>
              Intuitive graphs and trend analysis transform raw tracking data into clear, actionable insights.
              View daily patterns, weekly trends, or long-term progress to stay on track with your goals.
            </p>
          </div>
        </div>

        <div className="proj-screenshot-grid">
          <img loading="lazy" decoding="async" src={Modules} alt="Tracker modules overview" />
          <img loading="lazy" decoding="async" src={Analytics} alt="Interactive analytics and charts" />
          <img loading="lazy" decoding="async" src={Security} alt="Security and privacy controls" />
          <img loading="lazy" decoding="async" src={Progress} alt="Progress visualization and trends" />
        </div>

        <div className="proj-card-fan">
          {ANALYTICS_IMAGES.map((src, index) => (
            <AnalyticsCard
              key={index}
              src={src}
              index={index}
              total={ANALYTICS_IMAGES.length}
              hoveredIndex={hoveredIndex}
              onHover={setHoveredIndex}
            />
          ))}
        </div>

        <div className="proj-about">
          <p>
            Cipher Tracker supports a comprehensive set of tracker categories: Drinks, Screen Time, Caffeine, Cannabis,
            Sleep, Calories, Period, Nicotine, Pills, Hydration, and Diary. Each category is tailored with specific input
            fields and visualization options to make tracking as effortless as possible.
          </p>
        </div>
      </div>

      <div className="proj-nav-buttons">
        <Link to="/projects" className="proj-nav-button">
          Projects Page
        </Link>
      </div>
      <PageFooter />
    </>
  );
};

export default CipherTracker;
