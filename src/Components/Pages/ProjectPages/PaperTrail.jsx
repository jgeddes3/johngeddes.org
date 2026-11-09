import React from 'react';
import Background from '../../ForEveryPage/Background';
import PageFooter from '../../ForEveryPage/PageFooter';
import SEO from '../../ForEveryPage/SEO';
import { Link } from 'react-router-dom';
import './ProjectTemplate.css';
import Glyph from './icons/Glyph';
import Hero from './ProjectPageImages/PaperTrail/papertrail-hero.webp';
import SplitShot from './ProjectPageImages/PaperTrail/papertrail-split.webp';

const FEATURES = [
  {
    glyph: 'paperFile',
    title: 'Reads what the bank gives you',
    body: `Drop in PDF statements, CSV exports, or the Quicken and QuickBooks downloads (QFX,
      QBO, OFX) that nearly every bank and credit union offers. Twenty-four CSV layouts are
      built in, from Chase and American Express to Apple Card and Ally. PDFs go through
      dedicated parsers for Bilt and USAA and a generic one for any statement that prints a
      date, a description, and an amount per line. A CSV it has never seen asks which
      columns to use, once, and remembers the answer for that header.`,
  },
  {
    glyph: 'paperRepeat',
    title: 'Finds the subscriptions',
    body: `A merchant that charges on a cadence is a subscription: weekly, fortnightly,
      monthly, or yearly, within fifteen percent, with the amount steady within ten percent
      or stepping once. Netflix raising its price shows up as a flag, not a new merchant.
      Each one gets a yearly cost, a last-seen date, and a keep or cancelled mark, and the
      total across all of them sits on the overview.`,
  },
  {
    glyph: 'paperFlag',
    title: 'Flags the excess',
    body: `Four detectors run over every month. Above normal: a category one and a half
      times its trailing six-month median. Over budget: a cap you set, crossed. Small
      stuff: charges under fifteen dollars that add up to ten or more a year from one place.
      Probably forgotten: a subscription unchanged for a long time, a trial that turned into
      a charge, or the same merchant twice on the same day for the same amount.`,
  },
  {
    glyph: 'paperSplit',
    title: 'Splits the month between two people',
    body: `Each charge knows whose card it was on. Mark the shared ones and choose a ratio,
      fifty-fifty or seventy-thirty or anything else, as the default for the pair, for one
      charge, or as a rule for a merchant so rent splits itself on future imports. The
      month settles to one line, who owes whom and how much, with a mark-settled button and
      a record of past months.`,
  },
  {
    glyph: 'paperLock',
    title: 'Picks up where you left off',
    body: `A session file is the whole ledger encrypted under a passphrase you type at
      export. Open it later to resume, or hand it to the other person to merge into theirs;
      their charges arrive owned by them. The file carries its own salt and no key lives in
      the app, so the public source cannot read anyone's file. Every decrypted file is
      whitelisted field by field before it touches the store.`,
  },
  {
    glyph: 'paperShield',
    title: 'Cannot phone home',
    body: `The page is forbidden from making a network request. Its content security policy
      sets connect-src to none, the build fails if that line goes missing, a privacy gate
      scans the bundle for outside origins, and a browser smoke test counts requests after
      load and expects zero. Storage is AES-GCM under a key derived from your passphrase
      with six hundred thousand rounds; lose the passphrase and the data is gone, which is
      the point.`,
  },
];

const LEDGER = [
  { label: 'Unit tests', value: '102' },
  { label: 'Browser smoke checks', value: '11' },
  { label: 'CSV layouts built in', value: '24' },
  { label: 'PDF parsers, plus one generic', value: '3' },
  { label: 'Key derivation rounds', value: '600,000' },
  { label: 'Network requests after load', value: '0' },
];

const PaperTrail = () => {
  return (
    <>
      <SEO path="/PaperTrail" />
      <Background />
      <div id="centerpiece2" className="main-content">
        <h1>Paper Trail</h1>
      </div>
      <div className="proj-page main-content">
        <div className="proj-hero">
          <p className="proj-hero-tagline">
            Upload your card statements. Find out what you are paying for. Nothing leaves your
            browser.
          </p>
          <div className="proj-tech-pills">
            <span className="proj-pill">React 19</span>
            <span className="proj-pill">Vite</span>
            <span className="proj-pill">IndexedDB</span>
            <span className="proj-pill">Web Crypto</span>
            <span className="proj-pill">pdf.js</span>
            <span className="proj-pill">PapaParse</span>
            <span className="proj-pill">Node test runner</span>
            <span className="proj-pill">Puppeteer</span>
            <span className="proj-pill">GitHub Actions</span>
          </div>
          <p className="proj-status">
            Working build, run locally against real statements. The hosted copy will live at{' '}
            <a href="https://papertrail.company" rel="noopener noreferrer">papertrail.company</a>{' '}
            when the repository goes public.
          </p>
        </div>

        <div className="proj-hero-screenshot">
          <img
            loading="lazy"
            decoding="async"
            src={Hero}
            alt="The Paper Trail overview: a month's spending, flags for a changed price and a same-day duplicate, spending by category, the subscriptions list, and a trailing year"
          />
        </div>

        <div className="proj-about">
          <p>
            Paper Trail is a budgeting tool in the shape of Rocket Money, with one difference
            that decides everything else: there is no account and no server. You open the page,
            choose a passphrase, and upload the statements your bank already gives you. It
            sorts them into merchants and categories, finds the subscriptions, flags what looks
            like excess, and lets you search the lot. The data never leaves the browser, and I
            cannot see it even if I wanted to.
          </p>
          <p>
            That constraint came from building it on my own statements first. A tool that
            reads a year of someone's spending has to be one they can verify rather than trust.
            So the rule is enforced by the browser, not by a promise: the page carries a
            content security policy that forbids network requests, the build refuses to ship
            without it, and anyone can open the developer tools, import a statement, and watch
            no request appear.
          </p>
          <p>
            The engine is plain JavaScript with no framework in it: parsers for each statement
            layout, a normaliser that turns "SQ *MOONFALL COFFEE 3301 CHICAGO IL" into one
            merchant, a categoriser with shipped rules and your own on top, a fingerprint that
            stops the same charge counting twice across overlapping files, and the detectors.
            Every piece is a pure module with a test, and the same code runs in the browser and
            in a command-line checker that prints counts only, so parsers can be tuned against
            real statements without the statements ever being pasted anywhere.
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

        <div className="proj-hero-screenshot">
          <img
            loading="lazy"
            decoding="async"
            src={SplitShot}
            alt="The Split screen: what each person paid, the shared total, each person's share, one settlement line, and the month's charges with owner and split controls"
          />
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
          Read from the repository at its last commit, 9 November 2026.
        </p>


        <div className="proj-about">
          <p>
            It began as a concept for a credit card recommendation app, the project this page
            replaced. Recommendations need your spending to be any good, and the honest way to
            get spending is from the statements, so the statement reader became the product
            and the recommendations fell away. The design is deliberately quiet: white ground,
            an aubergine accent, Castoro Titling for the titles, Afacad for the text, IBM Plex
            Mono for every number, and Phosphor icons.
          </p>
          <p>
            Next is the public release: the repository opens, the hosted build goes up at
            papertrail.company, and the merchant rules ship as a data package anyone can
            improve. The statement coverage will grow the same way the first layouts did,
            from real files that did not parse, with the command-line checker reporting what
            was off and nothing else.
          </p>
        </div>
      </div>

      <div className="proj-nav-buttons">
        <Link to="/WeatherApp" className="proj-nav-button">
          Route Weather
        </Link>
        <Link to="/projects" className="proj-nav-button proj-nav-button-blue">
          Projects Page
        </Link>
        <Link to="/DrinkDecider" className="proj-nav-button">
          Horoscope
        </Link>
      </div>
      <PageFooter />
    </>
  );
};

export default PaperTrail;
