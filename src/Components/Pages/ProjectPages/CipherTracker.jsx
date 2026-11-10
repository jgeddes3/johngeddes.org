import React, { useState } from 'react';
import { motion } from 'framer-motion';
import Background from '../../ForEveryPage/Background';
import PageFooter from '../../ForEveryPage/PageFooter';
import SEO from '../../ForEveryPage/SEO';
import { Link } from 'react-router-dom';
import './ProjectTemplate.css';
import Glyph from './icons/Glyph';
import SiteHero from './ProjectPageImages/CipherTracker/cipher-site-hero.webp';
import Home from './ProjectPageImages/CipherTracker/cipher-home.webp';
import PinLock from './ProjectPageImages/CipherTracker/cipher-pin.webp';
import StatsOverview from './ProjectPageImages/CipherTracker/cipher-stats-overview.webp';
import StatsCaffeine from './ProjectPageImages/CipherTracker/cipher-stats-caffeine.webp';
import StatsCaffeineDetail from './ProjectPageImages/CipherTracker/cipher-stats-caffeine-detail.webp';
import Calendar from './ProjectPageImages/CipherTracker/cipher-calendar.webp';
import ClimbSetup from './ProjectPageImages/CipherTracker/cipher-climb-setup.webp';
import ClimbSession from './ProjectPageImages/CipherTracker/cipher-climb-session.webp';
import Hydration from './ProjectPageImages/CipherTracker/cipher-hydration.webp';
import Drinks from './ProjectPageImages/CipherTracker/cipher-drinks.webp';
import Calories from './ProjectPageImages/CipherTracker/cipher-calories.webp';
import Period from './ProjectPageImages/CipherTracker/cipher-period.webp';
import Habits from './ProjectPageImages/CipherTracker/cipher-habits.webp';
import ExportPane from './ProjectPageImages/CipherTracker/cipher-export.webp';
import Report from './ProjectPageImages/CipherTracker/cipher-report.webp';

const TRACKER_SHOTS = [
  { src: Hydration, alt: 'The Hydration tracker: a bottle filled to 25 of 64 ounces, with quick-add buttons for a glass, a bottle and a saved custom size' },
  { src: Drinks, alt: 'The Drinks tracker with wine selected and a half or full pour to choose' },
  { src: Calories, alt: 'The Calories tracker: a ring of calories left and bars for protein, carbs, fat and sugar' },
  { src: Period, alt: 'The Period tracker on day 9 of the follicular phase, with flow chips and a prediction confidence line' },
  { src: Habits, alt: 'The Habits tracker reading All done, with one habit ticked for the day' },
  { src: ExportPane, alt: 'The Export pane in Settings: a period, a set of trackers, a name for the report, and CSV or JSON for the data' },
];

const FEATURES = [
  {
    glyph: 'cipherLock',
    title: 'Encrypted before it leaves the phone',
    body: `Entries are encrypted on the device with AES-256-CTR under a key derived from the
      user's password by 200,000 rounds of PBKDF2-HMAC-SHA256. Every write gets a fresh
      128-bit IV and an HMAC-SHA256 signature that covers the iteration count itself, so the
      derivation cost cannot be downgraded by rewriting a stored blob. The server only ever
      receives the ciphertext. The derived key is kept on the phone wrapped under the PIN, so
      a daily unlock does not pay the 200,000 rounds again, and concurrent callers share one
      derivation instead of each running their own.`,
  },
  {
    glyph: 'cipherTarget',
    title: 'Fourteen trackers, one registry',
    body: `Drinks, screen time, caffeine, cannabis, sleep, calories, period, diary, nicotine,
      pills, hydration, exercise, vitals and habits. Colour, ink, unit, trend direction,
      reminder shape and quick-add behaviour all live in a single pure-data registry with no
      imports, which is what lets the test runner execute it directly and pin the list.
      Tutorials run on the real screens, one for every tracker but Hydration.`,
  },
  {
    glyph: 'cipherChart',
    title: 'Stats computed on the device, by rules',
    body: `Seven, thirty and 365 day views, per-tracker trends and cycle predictions, all
      derived locally from decrypted data. A daily average divides by the days that have a
      log, never by the calendar. A previous window with nothing in it reads as no prior data
      rather than a made-up percentage. The Impacts card pairs the user's own days (days with
      caffeine after two in the afternoon against days without, say) and states both counts
      in the user's units, and only once an evidence gate is met: five days in each arm,
      fourteen paired, and a standardised difference above a floor. It never names a cause,
      a percentage or a piece of advice, and a test scans every sentence for the words it is
      not allowed to use.`,
  },
  {
    glyph: 'cipherDumbbell',
    title: 'One exercise tracker, four session types',
    body: `Strength, climbing, cardio and intervals share a tracker. The catalogue is 877
      exercises with instructions, generated from a pinned public-domain dataset, and the
      personal-record engine only fires on a strict improvement. Climbing logs flashes, sends
      and attempts by venue, keeps a project list per gym and draws a grade pyramid, with
      four grade systems on one comparable scale. Cardio uses sport-correct pace conventions, including the /100m swim
      and /500m erg splits. Rest timers run on the lock screen as an iOS Live Activity and an
      Android ongoing notification, and a weekly plan names the day's workout.`,
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
  {
    glyph: 'cipherNote',
    title: 'A report you can hand to a doctor',
    body: `The Export pane builds a PDF over 30, 90 or 365 days or all time for the trackers you
      pick, with the same numbers as the Stats screen because it runs the same compute
      modules. The name on the report is typed each time and never saved. Data goes out as
      CSV or as the stored JSON untouched. Files are written to the app's private cache and
      swept after sharing, and diary text goes into a data export, never into a report.`,
  },
  {
    glyph: 'cipherCheck',
    title: 'Product rules the tests enforce',
    body: `On the five trackers where less is better (drinks, caffeine, nicotine, cannabis,
      screen time) no celebration, success haptic or animation ever fires on a consumption
      entry; rewards attach to clean days and reductions against the user's own baseline.
      Calories treats under and over the goal identically. Period keeps no streak or score,
      and a late period never reaches a notification. Every animation gates on the reduced
      motion setting. Each of these is a test that fails the suite, not a note in a document.`,
  },
];

const LEDGER = [
  { label: 'Trackers', value: '14' },
  { label: 'Unit tests, all passing', value: '3,822' },
  { label: 'PBKDF2 rounds per key', value: '200,000' },
  { label: 'Exercises in the catalogue', value: '877' },
  { label: 'Icons drawn to replace emoji', value: '36' },
  { label: 'Tests on the marketing site', value: '163' },
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
        style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'top', borderRadius: '1.5rem' }}
      />
    </motion.div>
  );
};

const CipherTracker = () => {
  const [hoveredIndex, setHoveredIndex] = useState(null);

  return (
    <>
      <SEO path="/CipherTracker" />
      <Background />
      <div id="centerpiece2" className="main-content">
        <h1>Cipher Tracker</h1>
      </div>
      <div className="proj-page main-content">
        <div className="proj-hero">
          <p className="proj-hero-tagline">
            Fourteen habits. Encrypted on your phone.
          </p>
          <div className="proj-tech-pills">
            <span className="proj-pill">React Native</span>
            <span className="proj-pill">Expo</span>
            <span className="proj-pill">AES-256-CTR</span>
            <span className="proj-pill">Firebase</span>
            <span className="proj-pill">Cloud Functions</span>
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
            iOS and Android builds, pre-launch. The site is live and the app is at version
            1.5.7 in store prep. The App Store listing is reserved but not public yet.
          </p>
        </div>

        <div className="proj-hero-screenshot">
          <img loading="lazy" decoding="async" src={SiteHero} alt="The cipher-app.org home page in light mode: the Cipher sigil inside the open vault door, the CIPHER title, and the Get in touch and How it works buttons" />
        </div>

        <div className="proj-about">
          <p>
            Cipher is a health and habit tracker for iOS and Android, built in React Native
            and Expo. It tracks fourteen things (drinking, sleep, calories, cycles, screen
            time, workouts, blood pressure, a floss habit, and the rest), and the whole product
            is arranged around one promise: the entries are encrypted on the phone before they
            reach the cloud, so the server holds ciphertext and nothing else.
          </p>
          <p>
            That promise decides the architecture. There is no password reset, because the
            key is derived from the password and never sent anywhere. A PIN unlocks the app
            on a device that is already signed in; on a new device the password is the only
            way back in, and the app makes you write it down before it finishes setting up.
            Accounts are username-only, so no email address is ever collected. Firestore
            stores month-sharded encrypted blobs behind owner-only security rules tested
            against the emulator, and a sync re-encrypts and sends only the months whose
            content changed since the last push.
          </p>
        </div>

        <div className="proj-screenshot-grid">
          <img loading="lazy" decoding="async" src={Home} alt="Home on a Tuesday morning: ten enabled trackers, each with the day's status and an add button, and a three-day flame" />
          <img loading="lazy" decoding="async" src={PinLock} alt="The six-digit PIN screen that unlocks a phone that is already signed in" />
        </div>
        <p className="proj-caption">Home with ten of the fourteen trackers switched on, and the PIN that stands in for the password on a signed-in phone.</p>

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
          <img loading="lazy" decoding="async" src={StatsOverview} alt="Stats over seven days: today's summary across ten trackers, then period totals per tracker" />
          <img loading="lazy" decoding="async" src={StatsCaffeine} alt="Caffeine stats: total and average per tracked day, highlights, a seven-day bar chart and insight rows" />
        </div>
        <div className="proj-screenshot-grid">
          <img loading="lazy" decoding="async" src={StatsCaffeineDetail} alt="Further down the caffeine page: when caffeine is consumed by time of day, caffeine-free progress, a sleep impact estimate, the FDA daily limit bar and a cups-of-coffee equivalent" />
          <img loading="lazy" decoding="async" src={Calendar} alt="The Calendar for November 2026 with coloured orbs on logged days, a tracker filter row, and the selected day's entries below" />
        </div>
        <p className="proj-caption">Stats and Calendar are computed from decrypted data on the phone. The sleep impact line is the one place a down-good tracker is allowed to state a fact about itself.</p>

        <div className="proj-screenshot-grid">
          <img loading="lazy" decoding="async" src={ClimbSetup} alt="Starting a climb: the venue, saved gyms as chips, boulder, top-rope or lead, and V-Scale or Font grades, over the exercise home with its week plan" />
          <img loading="lazy" decoding="async" src={ClimbSession} alt="A live climbing session at a gym: a V3 grade stepper with Flash, Send and Attempt, five climbs logged by grade, and a rest timer along the bottom" />
        </div>
        <p className="proj-caption">Climbing inside the exercise tracker: a venue with its own project list, a grade stepper, and the rest timer that also runs on the lock screen.</p>

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

        <div className="proj-screenshot">
          <img loading="lazy" decoding="async" src={Report} alt="The first page of a Cipher health report PDF opened in Files: a 30-day window, the trackers included, and an at-a-glance table of days logged per tracker" />
          <p className="proj-caption">The PDF the Export pane produces, opened in Files on the phone. The paragraph at the top says how the averages were taken, so the person reading it does not have to guess.</p>
        </div>

        <div className="proj-companion">
          <h2>The site that sells it</h2>
          <p>
            cipher-app.org is the second half of the project: a Next.js 16 and React 19 site
            in TypeScript, with a scroll-pinned vault door drawn in raw Canvas 2D and the
            theme toggle repurposed as the demo: light is plaintext, dark is ciphertext.
          </p>
          <p>
            Its useful trick is that the marketing claims are testable. Rather than restate
            the app's data in prose, the site mirrors it as typed constants (the tracker
            registry, the design tokens, the literal shape of the stored ciphertext envelope),
            and its test suite asserts the copy against them. If the app changes its blob
            format, the website's tests fail. A build script fails the build over a per-route
            gzip budget, which is what killed the previous hero: eighty decoded WebP frames
            that hijacked the scroll.
          </p>
        </div>

        <div className="proj-about">
          <p>
            The engineering discipline is the part worth pointing at. 3,822 unit tests run on
            the Node test runner with no framework and never render a screen; they read the
            source instead and pin what it must and must not contain. One gate fails the build
            if an emoji appears anywhere in the UI, which is why the app ships a 36-glyph SVG
            icon set of its own, the set the icons on this page are drawn from. Another fails it
            on an em dash in a shipping string. Firebase connections are certificate-pinned
            across three Google domains with backup pins so a rotation cannot lock anyone out,
            and decryption still walks four historical envelope formats so no early user's data
            was ever stranded.
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
