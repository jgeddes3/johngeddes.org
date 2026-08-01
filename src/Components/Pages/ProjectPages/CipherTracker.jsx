import React, { useState } from 'react';
import { motion } from 'framer-motion';
import Background from '../../ForEveryPage/Background';
import PageFooter from '../../ForEveryPage/PageFooter';
import SEO from '../../ForEveryPage/SEO';
import { Link } from 'react-router-dom';
import './ProjectTemplate.css';
import Glyph from './icons/Glyph';
import SiteHero from './ProjectPageImages/CipherTracker/cipher-site-hero.webp';
import Home from './ProjectPageImages/CipherTracker/IMG_9425.webp';
import Analytics from './ProjectPageImages/CipherTracker/IMG_9430.webp';
import PinLock from './ProjectPageImages/CipherTracker/IMG_9424.webp';
import Insights from './ProjectPageImages/CipherTracker/IMG_9431.webp';
import Drinks from './ProjectPageImages/CipherTracker/IMG_9442.webp';
import ScreenTime from './ProjectPageImages/CipherTracker/IMG_9443.webp';
import Period from './ProjectPageImages/CipherTracker/IMG_9447.webp';
import Calories from './ProjectPageImages/CipherTracker/IMG_9449.webp';
import Pills from './ProjectPageImages/CipherTracker/IMG_9451.webp';
import Sleep from './ProjectPageImages/CipherTracker/IMG_9452.webp';

const TRACKER_SHOTS = [
  { src: Drinks, alt: 'Logging a drink in the Drinks tracker' },
  { src: ScreenTime, alt: 'Entering hours and minutes in the Screen Time tracker' },
  { src: Period, alt: 'The Period tracker with flow levels and symptom tags' },
  { src: Calories, alt: 'The Calories tracker with a food entry and daily total' },
  { src: Pills, alt: 'The Pills tracker with a prescription schedule' },
  { src: Sleep, alt: 'The Sleep tracker with bedtime and wake time' },
];

const FEATURES = [
  {
    glyph: 'cipherLock',
    title: 'Encrypted before it leaves the phone',
    body: `Entries are encrypted on the device with AES-256-CTR under a key derived from the
      user's password by 200,000 rounds of PBKDF2-HMAC-SHA256. Every write gets a fresh
      128-bit IV and an HMAC-SHA256 signature that covers the iteration count itself, so the
      derivation cost cannot be downgraded by rewriting a stored blob. The server only ever
      receives the ciphertext.`,
  },
  {
    glyph: 'cipherTarget',
    title: 'Twelve trackers, one registry',
    body: `Drinks, screen time, caffeine, cannabis, nicotine, period, calories, hydration,
      exercise, sleep, pills and diary. Colour, unit, trend polarity, reminder shape and
      quick-add behaviour all live in a single pure-data registry with no imports, which is
      what lets the test runner execute it directly and pin the list to exactly twelve.`,
  },
  {
    glyph: 'cipherChart',
    title: 'Analytics computed on the device',
    body: `Weekly and monthly views, per-tracker trends and cycle predictions, all derived
      locally from decrypted data. Nothing is aggregated server-side, because the server has
      no readable copy to aggregate.`,
  },
  {
    glyph: 'cipherDumbbell',
    title: 'One exercise tracker, three sports',
    body: `Strength, climbing and cardio share a tracker through a session-type field. Strength
      gets rest timers, last-session targets and a personal-record engine that only fires on a
      strict improvement. Climbing logs sends and attempts across four grade systems on one
      comparable scale. Cardio uses sport-correct pace conventions, including the /100m swim
      and /500m erg splits.`,
  },
  {
    glyph: 'cipherBarcode',
    title: 'Barcode scanning without shipping the keys',
    body: `Calorie logging scans GTIN-13 barcodes and searches a nutrition database. A security
      audit found the food API credentials sitting in the client bundle, so requests now route
      through an auth-gated Cloud Function that signs them server-side, behind a local cache
      and a client rate limit.`,
  },
  {
    glyph: 'cipherPhone',
    title: 'Screen time read from the OS',
    body: `A custom Expo config plugin injects an Android UsageStatsManager module, checks the
      usage-access permission, deep-links to the system settings page to grant it, and reads
      real per-day device screen time. It no-ops cleanly on iOS, where the equivalent API needs
      an entitlement from Apple.`,
  },
];

const LEDGER = [
  { label: 'Trackers', value: '12' },
  { label: 'Unit tests, all passing', value: '548' },
  { label: 'PBKDF2 rounds per key', value: '200,000' },
  { label: 'Exercises in the library', value: '52' },
  { label: 'Icons drawn to replace emoji', value: '26' },
  { label: 'Tests holding the site to the app', value: '75' },
];

const TrackerCard = ({ src, alt, index, total, hoveredIndex, onHover }) => {
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
        alt={alt}
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
        description="Cipher Tracker — a React Native habit tracker for iOS and Android that encrypts every entry on the device, and the Next.js site that markets it. By John Geddes."
        path="/CipherTracker"
      />
      <Background />
      <div id="centerpiece2" className="main-content">
        <h1>Cipher Tracker</h1>
      </div>
      <div className="proj-page main-content">
        <div className="proj-hero">
          <p className="proj-hero-tagline">
            Twelve habits. Encrypted on your phone.
          </p>
          <div className="proj-tech-pills">
            <span className="proj-pill">React Native</span>
            <span className="proj-pill">Expo</span>
            <span className="proj-pill">AES-256-CTR</span>
            <span className="proj-pill">Firebase</span>
            <span className="proj-pill">RevenueCat</span>
            <span className="proj-pill">Next.js</span>
            <span className="proj-pill">TypeScript</span>
          </div>
          <div className="proj-actions">
            <a href="https://www.cipher-app.org/" target="_blank" rel="noopener noreferrer" className="proj-action-link">
              cipher-app.org
            </a>
          </div>
          <p className="proj-status">
            iOS and Android builds, pre-launch. The site is live; the app is in submission
            prep, the TestFlight beta is at capacity, and the App Store listing is not
            public yet.
          </p>
        </div>

        <div className="proj-hero-screenshot">
          <img loading="lazy" decoding="async" src={SiteHero} alt="The cipher-app.org home page, showing the Cipher sigil inside a vault door drawn in falling binary" />
        </div>

        <div className="proj-about">
          <p>
            Cipher is a health and habit tracker for iOS and Android, built in React Native
            and Expo. It tracks twelve things — drinking, sleep, calories, cycles, screen
            time, workouts and the rest — and the whole product is arranged around one
            promise: the entries are encrypted on the phone before they reach the cloud, so
            the server holds ciphertext and nothing else.
          </p>
          <p>
            That promise decides the architecture. There is no password reset, because the
            key is derived from the password and never sent anywhere. A PIN unlocks the app
            on a device that is already signed in; on a new device the password is the only
            way back in, and the app makes you write it down before it finishes setting up.
            Accounts are username-only, so no email address is ever collected. Firestore
            stores month-sharded encrypted blobs behind owner-only security rules tested
            against the emulator.
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

        <div className="proj-screenshot-grid">
          <img loading="lazy" decoding="async" src={Home} alt="Home dashboard showing each enabled tracker with the day's totals" />
          <img loading="lazy" decoding="async" src={Analytics} alt="Analytics screen with weekly totals and change per tracker" />
          <img loading="lazy" decoding="async" src={PinLock} alt="PIN entry screen that unlocks an already signed-in device" />
          <img loading="lazy" decoding="async" src={Insights} alt="Analytics insight cards for medication adherence and caffeine timing" />
        </div>

        <div className="proj-card-fan">
          {TRACKER_SHOTS.map((shot, index) => (
            <TrackerCard
              key={shot.alt}
              src={shot.src}
              alt={shot.alt}
              index={index}
              total={TRACKER_SHOTS.length}
              hoveredIndex={hoveredIndex}
              onHover={setHoveredIndex}
            />
          ))}
        </div>

        <div className="proj-ledger">
          {LEDGER.map((row) => (
            <div className="proj-ledger-row" key={row.label}>
              <span className="proj-ledger-label">{row.label}</span>
              <span className="proj-ledger-value">{row.value}</span>
            </div>
          ))}
        </div>

        <div className="proj-companion">
          <h2>The site that sells it</h2>
          <p>
            cipher-app.org is the second half of the project: a Next.js 16 and React 19 site
            in TypeScript, with a scroll-pinned vault door drawn in raw Canvas 2D and the
            theme toggle repurposed as the demo — light is plaintext, dark is ciphertext.
          </p>
          <p>
            Its useful trick is that the marketing claims are testable. Rather than restate
            the app's data in prose, the site mirrors it as typed constants — the tracker
            registry, the design tokens, the literal shape of the stored ciphertext envelope —
            and 75 unit tests assert the copy against them. If the app changes its blob format,
            the website's test suite fails. A build script fails the build over a per-route
            gzip budget, which is what killed the previous hero: eighty decoded WebP frames
            that hijacked the scroll.
          </p>
        </div>

        <div className="proj-about">
          <p>
            The engineering discipline is the part worth pointing at. 548 unit tests run on
            the Node test runner with no framework, including a gate that fails the build if
            an emoji appears anywhere in the rendered UI — which is why the app ships a
            26-glyph SVG icon set of its own, the set the icons on this page are drawn from.
            Firebase connections are certificate-pinned across three Google domains with
            backup pins so a rotation cannot lock anyone out, and decryption still walks four
            historical envelope formats so no early user's data was ever stranded.
          </p>
          <p>
            Cipher is operated by Cipher Tracker LLC, an Illinois company, and ships with a
            full privacy policy and terms of service. It is an 18+ product, since it tracks
            alcohol, cannabis and nicotine, and it is not a medical device.
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
