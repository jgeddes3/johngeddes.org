import React, { useState } from 'react';
import { motion } from 'framer-motion';
import Background from '../../ForEveryPage/Background';
import PageFooter from '../../ForEveryPage/PageFooter';
import SEO from '../../ForEveryPage/SEO';
import { Link } from 'react-router-dom';
import './ProjectTemplate.css';
import Photo1 from './ProjectPageImages/RamblerRegistrar/Rambler1.png';
import Photo2 from './ProjectPageImages/RamblerRegistrar/Rambler2.png';
import Photo3 from './ProjectPageImages/RamblerRegistrar/Rambler3.png';
import Photo4 from './ProjectPageImages/RamblerRegistrar/Rambler4.png';
import Photo6 from './ProjectPageImages/RamblerRegistrar/Rambler6.png';
import Logo from './ProjectPageImages/RamblerRegistrar/RamblerIcon.png';

const SCREENSHOTS = [Photo1, Photo3, Photo2, Photo6, Photo4];

const ScreenshotCard = ({ src, index, total, hoveredIndex, onHover }) => {
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
        boxShadow: '0 25px 50px -12px rgba(163, 0, 70, 0.15)',
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
        alt={`Rambler Registrar screenshot ${index + 1}`}
        style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '1.5rem' }}
      />
    </motion.div>
  );
};

const RamblerRegistrar = () => {
  const [hoveredIndex, setHoveredIndex] = useState(null);

  return (
    <>
      <SEO
        title="Rambler Registrar"
        description="Rambler Registrar — a React Native course planning app for Loyola University Chicago with RIASEC personality matching, live LOCUS data, and degree progress tracking."
        path="/RamblerRegistrar"
      />
      <Background />
      <div id="centerpiece2" className="main-content">
        <h1>Rambler Registrar</h1>
      </div>
      <div className="proj-page main-content">
        <div className="proj-hero">
          <p className="proj-hero-tagline">
            Plan your path to graduation — powered by personality, live data, and your degree requirements.
          </p>
          <div className="proj-tech-pills">
            <span className="proj-pill">React Native</span>
            <span className="proj-pill">Expo</span>
            <span className="proj-pill">Node.js</span>
            <span className="proj-pill">SQLite</span>
            <span className="proj-pill">Firebase Auth</span>
            <span className="proj-pill">Puppeteer</span>
          </div>
          <div className="proj-actions">
            <a href="https://github.com/jgeddes3/RamblerRegistrar" target="_blank" rel="noopener noreferrer" className="proj-action-link">
              GitHub
            </a>
          </div>
          <p style={{ color: '#999', fontSize: '0.9rem', marginTop: '0.5rem', fontStyle: 'italic' }}>
            Work in progress
          </p>
        </div>

        <div className="proj-hero-screenshot" style={{ textAlign: 'center' }}>
          <img loading="lazy" decoding="async" src={Logo} alt="Rambler Registrar logo" style={{ maxWidth: '280px', width: '100%' }} />
        </div>

        <div className="proj-about">
          <p>
            Rambler Registrar is a mobile course planning app built for Loyola University Chicago students.
            It combines a 25-question RIASEC personality assessment with live enrollment data scraped directly
            from Loyola's LOCUS registration system to help students choose the right courses, track their
            degree progress, and plan their path to graduation.
          </p>
          <p>
            The app is built as a React Native mobile application with an Express.js backend powered by SQLite.
            A headless Puppeteer scraper runs every day at 4 AM, pulling live section data, enrollment numbers,
            instructor assignments, and meeting times from LOCUS. Firebase handles authentication, and the
            backend serves everything through a REST API with 20+ endpoints.
          </p>
        </div>

        <div className="proj-features">
          <div className="proj-feature-card">
            <div className="proj-feature-icon">🧠</div>
            <h3>RIASEC Personality Quiz</h3>
            <p>
              A 25-question assessment determines your personality profile across six dimensions — Realistic,
              Investigative, Artistic, Social, Enterprising, and Conventional. Undecided students get major
              recommendations ranked by fit. Decided students get focus area recommendations within their major,
              weighted by how long they have until graduation.
            </p>
          </div>
          <div className="proj-feature-card">
            <div className="proj-feature-icon">📊</div>
            <h3>Degree Progress Tracking</h3>
            <p>
              See exactly where you stand — major requirements, university core, electives, and total credits
              toward 120. Courses are categorized as Completed, Up Next (prerequisites met), or Remaining
              (still need prereqs), with fulfilled prerequisites shown in green.
            </p>
          </div>
          <div className="proj-feature-card">
            <div className="proj-feature-icon">🔍</div>
            <h3>Live Course Search</h3>
            <p>
              Search 1,200+ courses by name, code, department, or instructor. Results show available Fall
              sections with meeting times, building, enrollment seats, and professor ratings from RateMyProfessor.
              Filter by morning/afternoon, MWF/TuTh, or open seats only.
            </p>
          </div>
          <div className="proj-feature-card">
            <div className="proj-feature-icon">🤖</div>
            <h3>Automated LOCUS Scraper</h3>
            <p>
              A Puppeteer headless browser scrapes Loyola's PeopleSoft registration system daily, collecting
              2,200+ course sections with enrollment numbers, instructor names, meeting times, room assignments,
              and open/closed status. Historical snapshots track how fast courses fill up during registration.
            </p>
          </div>
        </div>

        <div className="proj-card-fan">
          {SCREENSHOTS.map((src, index) => (
            <ScreenshotCard
              key={index}
              src={src}
              index={index}
              total={SCREENSHOTS.length}
              hoveredIndex={hoveredIndex}
              onHover={setHoveredIndex}
            />
          ))}
        </div>

        <div className="proj-screenshot-grid">
          <img loading="lazy" decoding="async" src={Photo1} alt="RIASEC personality quiz" />
          <img loading="lazy" decoding="async" src={Photo3} alt="Degree progress tracking" />
          <img loading="lazy" decoding="async" src={Photo2} alt="Electives and credit tracking" />
          <img loading="lazy" decoding="async" src={Photo4} alt="Profile with personality results" />
        </div>

        <div className="proj-about">
          <p>
            The backend maintains a SQLite database with 121 majors, 1,247 courses, 2,177 program-course
            relationships, 136 prerequisite pairs, 539 focus areas across 117 majors, and 24 RIASEC code-to-major
            recommendation mappings. Course sections are updated nightly with enrollment data, and professor
            ratings are pulled from RateMyProfessor's GraphQL API with local caching.
          </p>
          <p>
            This project started as a college assignment and is being rebuilt from the ground up as a comprehensive
            tool that Loyola students could actually use. It's still a work in progress — the schedule builder,
            campus map integration, and Cloudflare tunnel deployment are coming next.
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

export default RamblerRegistrar;
