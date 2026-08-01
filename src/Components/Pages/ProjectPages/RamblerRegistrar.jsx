import React, { useState } from 'react';
import { motion } from 'framer-motion';
import Background from '../../ForEveryPage/Background';
import PageFooter from '../../ForEveryPage/PageFooter';
import SEO from '../../ForEveryPage/SEO';
import { Link } from 'react-router-dom';
import './ProjectTemplate.css';
import Glyph from './icons/Glyph';
import SiteHero from './ProjectPageImages/RamblerRegistrar/rambler-site-hero.webp';
import Quiz from './ProjectPageImages/RamblerRegistrar/Rambler1.webp';
import MajorProgress from './ProjectPageImages/RamblerRegistrar/Rambler3.webp';
import Electives from './ProjectPageImages/RamblerRegistrar/Rambler2.webp';
import Profile from './ProjectPageImages/RamblerRegistrar/Rambler6.webp';
import FocusAreas from './ProjectPageImages/RamblerRegistrar/Rambler4.webp';

const SCREENSHOTS = [
  { src: Quiz, alt: 'A scenario question from the preference quiz' },
  { src: MajorProgress, alt: 'Major progress showing completed courses and what is up next' },
  { src: Electives, alt: 'Elective credit progress against the 120-credit degree total' },
  { src: Profile, alt: 'Profile with major, graduation year and preference results' },
  { src: FocusAreas, alt: 'Focus areas within a major, ranked by fit' },
];

const FEATURES = [
  {
    glyph: 'ramblerGrid',
    title: 'Five schedules, generated',
    body: `Pick up to eight courses and the app searches every conflict-free way to take one
      section of each, then returns the five best. The search is a deterministic depth-first
      walk with a 50,000-step budget and a 400-schedule cap, ordered fewest-sections-first so
      the tightest courses are placed before the flexible ones. When nothing fits it does not
      just shrug: a leave-one-out sweep names the course that is blocking the rest.`,
  },
  {
    glyph: 'ramblerGauge',
    title: 'A score you can audit',
    body: `Each schedule starts at 100 and loses points for the things that make a semester
      miserable: twelve for a building transfer you cannot walk in the gap, twenty for a
      closed or waitlisted section, six for an extra day on campus, three for a day with no
      lunch break, two each for starting before nine or ending after six, and one and a half
      for every half hour of dead time. The weights are published rather than hidden, and the
      same scorer will rate a schedule you already have.`,
  },
  {
    glyph: 'ramblerRoute',
    title: 'The transfers that do not work',
    body: `Walk times come from real building coordinates — haversine distance, a 1.3 factor
      for streets that do not run diagonally, at eighty metres a minute. A ten-minute passing
      period against a fifteen-minute walk is flagged as tight and costs schedule points.
      The two campuses are about eight miles apart, so a transfer between them is called
      impossible rather than tight, before registration rather than after.`,
  },
  {
    glyph: 'ramblerBell',
    title: 'Seats, watched honestly',
    body: `A watch on a full section sends a push notification when a seat opens. The poller
      runs every twenty minutes from 9 a.m. to 9:40 p.m. Chicago time, and deliberately not
      overnight, because the source is unreliable then. The product says so out loud instead
      of claiming round-the-clock alerts it cannot deliver.`,
  },
  {
    glyph: 'ramblerRing',
    title: '230 programs of progress',
    body: `Every major, minor and degree in the catalog, with requirements sorted into done,
      ready to take, and still blocked by a prerequisite. Requirements come in three shapes and
      all three are modelled: plain required courses, choice groups that need N units from a
      set, and prose electives like two 300-level philosophy courses. A what-if explorer prices
      a major or minor change in extra semesters before you commit. It is a pacing estimate,
      not a substitute for the university's own degree audit.`,
  },
  {
    glyph: 'ramblerCompass',
    title: 'A quiz that reranks everything',
    body: `Twenty-five scenario questions across four sections produce a Holland code across
      six preference types. Undecided students get majors ranked by fit; decided students get
      focus areas inside their major, weighted by how much time is left. Two students holding
      the same course list can land on a different top pick.`,
  },
];

const LEDGER = [
  { label: 'Programs in the catalog', value: '230' },
  { label: 'Courses', value: '2,082' },
  { label: 'Fall sections tracked', value: '2,450' },
  { label: 'Enrollment snapshots', value: '262,857' },
  { label: 'Buildings with coordinates', value: '23' },
  { label: 'Tests across the app', value: '270' },
];

const ScreenshotCard = ({ src, alt, index, total, hoveredIndex, onHover }) => {
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
        alt={alt}
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
        description="Rambler Registrar — a React Native course scheduling app for Loyola University Chicago students that generates and scores schedules from live catalog data, plus the Vite marketing site that launches it. By John Geddes."
        path="/RamblerRegistrar"
      />
      <Background />
      <div id="centerpiece2" className="main-content">
        <h1>Rambler Registrar</h1>
      </div>
      <div className="proj-page main-content">
        <div className="proj-hero">
          <p className="proj-hero-tagline">
            Five perfect schedules. Registration, solved in seconds.
          </p>
          <div className="proj-tech-pills">
            <span className="proj-pill">React Native</span>
            <span className="proj-pill">Expo</span>
            <span className="proj-pill">Firestore</span>
            <span className="proj-pill">Puppeteer</span>
            <span className="proj-pill">Express</span>
            <span className="proj-pill">SQLite</span>
            <span className="proj-pill">Vite</span>
            <span className="proj-pill">TypeScript</span>
          </div>
          <div className="proj-actions">
            <a href="https://github.com/jgeddes3/RamblerRegistrar" target="_blank" rel="noopener noreferrer" className="proj-action-link">
              GitHub
            </a>
          </div>
          <p className="proj-status">
            iOS and Android, pre-launch. Store builds are prepared but not distributed;
            the target is to launch before Fall 2026 registration.
          </p>
        </div>

        <div className="proj-hero-screenshot">
          <img loading="lazy" decoding="async" src={SiteHero} alt="The Rambler Registrar landing page, where a scattered week of classes has resolved into a conflict-free Fall grid scored 82 out of 100" />
        </div>

        <div className="proj-about">
          <p>
            Rambler Registrar is a course scheduling app for Loyola University Chicago
            students. You tell it which courses you need; it builds every conflict-free way to
            take them, scores each one for how liveable the week actually is, and hands back
            the five best. Underneath that is a data pipeline: a headless Chrome scraper reads
            the university's public guest class search every morning at ten, a catalog crawler
            pulls requirements for every program, and the results land in SQLite and sync to
            Firestore.
          </p>
          <p>
            The app talks to that Firestore directly rather than to the server. An earlier
            version routed everything through a REST API; the whole surface was deleted once
            the catalog, section and profile reads moved client-side behind two hundred-odd
            lines of security rules, and what is left of the server is the scraper host and a
            small proxy for library hours, study rooms and campus events.
          </p>
          <p>
            It never asks for a LOCUS password. Everything it reads is the same public course
            catalog any student can open, and completed coursework is whatever the student
            types in. You still enter your own class numbers when registration opens — the app
            is there to tell you which ones to enter.
          </p>
        </div>

        <h2 className="proj-section-heading">What it does</h2>
        <div className="proj-features">
          {FEATURES.map((feature) => (
            <div className="proj-feature-card" key={feature.title}>
              <div className="proj-feature-head">
                <span className="proj-feature-icon">
                  <Glyph name={feature.glyph} size={26} />
                </span>
                <h3>{feature.title}</h3>
              </div>
              <p>{feature.body}</p>
            </div>
          ))}
        </div>

        <div className="proj-card-fan">
          {SCREENSHOTS.map((shot, index) => (
            <ScreenshotCard
              key={shot.alt}
              src={shot.src}
              alt={shot.alt}
              index={index}
              total={SCREENSHOTS.length}
              hoveredIndex={hoveredIndex}
              onHover={setHoveredIndex}
            />
          ))}
        </div>

        <div className="proj-screenshot-grid">
          <img loading="lazy" decoding="async" src={Quiz} alt="A scenario question from the preference quiz" />
          <img loading="lazy" decoding="async" src={MajorProgress} alt="Major progress showing completed courses and what is up next" />
          <img loading="lazy" decoding="async" src={Electives} alt="Elective credit progress against the 120-credit degree total" />
          <img loading="lazy" decoding="async" src={Profile} alt="Profile with major, graduation year and preference results" />
        </div>

        <div className="proj-ledger">
          {LEDGER.map((row) => (
            <div className="proj-ledger-row" key={row.label}>
              <span className="proj-ledger-label">{row.label}</span>
              <span className="proj-ledger-value">{row.value}</span>
            </div>
          ))}
        </div>
        <p className="proj-ledger-caption">
          Read from the live catalog database for the current term, term 1266.
        </p>

        <div className="proj-companion">
          <h2>The site that launches it</h2>
          <p>
            The waitlist site is its own codebase: React 18 and Vite 6 in TypeScript, plain
            CSS modules, no router and no component library. It ships eight static routes as a
            multi-page app, and each of the app's real features gets a scroll-driven set piece
            — a pinned hero that resolves a chaotic week into a scored schedule, a gauge that
            counts up while a receipt itemises every penalty, a seven-stop walk across campus.
          </p>
          <p>
            One motion library loads, lazily, in a single chunk of about fifteen kilobytes
            gzipped, gated behind reduced-motion; everything else is hand-rolled CSS and native
            browser APIs. A budget script fails the build if any route's entry JavaScript
            passes ninety kilobytes gzipped, and a Puppeteer harness shoots every route at
            three viewports. The honesty rules are written into the repo: no invented signup
            counts, no fabricated queue position, and sample data labelled as sample.
          </p>
        </div>

        <div className="proj-about">
          <p>
            The scraper is the unglamorous half and the reason any of it works. It walks
            fifty-one subject codes a day, restarting the headless browser every fifteen to
            shake off stale sessions, retrying up to three times with a five-minute backoff,
            and it has been running long enough to hold more than a quarter of a million
            enrollment snapshots across a hundred days. That history is what turns a seat
            count into a warning about which sections fill first. It runs under PM2 on a
            Windows box with a scheduled health monitor that resurrects it if it dies.
          </p>
          <p>
            Professor ratings come from Rate My Professors and are labelled as such.
            The app started as a college practicum project and has been rebuilt since into
            something Loyola students could actually register with.
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
