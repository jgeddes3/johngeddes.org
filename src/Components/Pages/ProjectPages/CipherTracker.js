import React, { useState } from 'react';
import { motion } from 'framer-motion';
import Background from '../../ForEveryPage/Background';
import PageFooter from '../../ForEveryPage/PageFooter';
import { Link } from 'react-router-dom';
import '../MiscPages/AaMiscTemplates.css';
import MainPhoto from './ProjectPageImages/CipherTracker/Ciphertrackerphoto1.png';
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
      <Background />
      <div id="centerpiece2" className='main-content'>
        <h1>Cipher Tracker</h1>
      </div>
      <div className="restaurant-container main-content">
        <div className="author-links">
          <p>
            Built by John Geddes |
            <a href="https://www.cipher-app.org/" target="_blank" rel="noopener noreferrer"> cipher-app.org</a>
          </p>
        </div>
        <div className="MainPhoto-container">
          <img loading="lazy" decoding="async" src={MainPhoto} alt="Cipher Tracker" />
          <p className="image-caption">Cipher Tracker — Master Your Habits. Secure Your Life.</p>
        </div>
        <div className="paragraph-only-container">
          <p>
            Master Your Habits. Secure Your Life. Cipher Tracker is the ultimate private tracker for what matters most.
            From screen time to sleep, own your data with military-grade encryption. Built as a React Native mobile application,
            Cipher Tracker gives users complete control over their personal data while providing powerful tracking and analytics
            capabilities across a wide range of daily habits and health metrics.
          </p>
        </div>
        <div className="paragraph-photo-right-container">
          <div className="Seperator-photo-right">
            <p>
              Everything in one place — Cipher Tracker provides a single dashboard for all your trackers.
              Whether you're monitoring drinks, screen time, caffeine, cannabis, sleep, calories, period cycles,
              nicotine, pills, hydration, or keeping a diary, everything lives in one unified interface. Each tracker
              module is designed to capture the specific data points that matter most for that category.
            </p>
          </div>
          <div className="image-with-caption">
            <img loading="lazy" decoding="async" src={Modules} alt="Tracker modules" />
            <p className="image-caption">Tracker modules overview</p>
          </div>
        </div>
        <div className="paragraph-photo-left-container">
          <div className="Seperator-photo-left">
            <p>
              Advanced Analytics power your self-improvement journey with interactive charts and weekly summaries.
              The analytics engine processes your tracking data to surface meaningful trends, patterns, and insights
              that help you understand your habits at a deeper level. Weekly and monthly summaries make it easy to
              see progress over time.
            </p>
          </div>
          <div className="image-with-caption">
            <img loading="lazy" decoding="async" src={Analytics} alt="Analytics dashboard" />
            <p className="image-caption">Interactive analytics and charts</p>
          </div>
        </div>
        <div className="paragraph-photo-right-container">
          <div className="Seperator-photo-right">
            <p>
              Complete Privacy is at the core of Cipher Tracker. The app uses AES-256 encryption with a zero-access
              architecture, meaning not even the developers can see your data. Your information is encrypted on-device
              before it ever touches a server, using PBKDF2 key derivation to ensure your encryption keys are as
              strong as possible.
            </p>
          </div>
          <div className="image-with-caption">
            <img loading="lazy" decoding="async" src={Security} alt="Security and privacy settings" />
            <p className="image-caption">Security and privacy controls</p>
          </div>
        </div>
        <div className="paragraph-photo-left-container">
          <div className="Seperator-photo-left">
            <p>
              Visualize your progress with intuitive graphs and trend analysis. The visualization system transforms
              raw tracking data into clear, actionable insights. Whether you're looking at daily patterns, weekly
              trends, or long-term progress, the charts adapt to show you exactly what you need to stay on track
              with your goals.
            </p>
          </div>
          <div className="image-with-caption">
            <img loading="lazy" decoding="async" src={Progress} alt="Progress visualization" />
            <p className="image-caption">Progress visualization and trends</p>
          </div>
        </div>
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '500px', marginBottom: '20px', overflow: 'visible' }}>
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
        <div className="paragraph-only-container">
          <p>
            Cipher Tracker supports a comprehensive set of tracker categories: Drinks, Screen Time, Caffeine, Cannabis,
            Sleep, Calories, Period, Nicotine, Pills, Hydration, and Diary. Each category is tailored with specific input
            fields and visualization options to make tracking as effortless as possible.
          </p>
        </div>
      </div>
      <div className="misc-nav-buttons">
        <Link to="/projects" className="misc-nav-button misc-nav-misc">
          Projects Page
        </Link>
      </div>
      <PageFooter />
    </>
  );
};

export default CipherTracker;
