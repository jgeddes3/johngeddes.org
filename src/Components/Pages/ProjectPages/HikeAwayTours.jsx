import React from 'react';
import Background from '../../ForEveryPage/Background';
import PageFooter from '../../ForEveryPage/PageFooter';
import SEO from '../../ForEveryPage/SEO';
import { Link } from 'react-router-dom';
import './ProjectTemplate.css';
import Glyph from './icons/Glyph';
import Hero from './ProjectPageImages/HikeAwayTours/hikeaway-hero.webp';

const FEATURES = [
  {
    glyph: 'hikeLanes',
    title: 'Two ways to book, one state machine',
    body: `Book more than six weeks out and you pick any start date, pay a 25% deposit, and
      ops assembles the package behind the scenes with a five-business-day target: hotels
      first, then the driver, then the bags. Between six and three weeks out you choose from
      published departures with live capacity and pay in full, airline-style, with the trip
      confirmed instantly. Nothing is sold inside three weeks. Either way the balance is paid
      by three weeks out and the trip moves through the same five states to completion.`,
  },
  {
    glyph: 'hikeVan',
    title: 'The logistics are ours',
    body: `Nobody guides on the trail. Customers walk on their own, and everything around the
      walking is arranged: a hotel each night, a driver for pickups and drop-offs, luggage
      moved between hotels, restaurants and coupons along the way. The vendors are
      contracted driving companies, bag movers, and hotels with negotiated block rates, held
      in one supplier ledger with partner flags, rates, contacts, and a last-verified date.`,
  },
  {
    glyph: 'hikeMap',
    title: 'A trip that works with no signal',
    body: `From departure day the app opens on an offline map: the route, your position,
      tonight's hotel, today's pickup, and the distance remaining with an arrival window.
      The pack downloads two weeks out, refreshes when ops amends the itinerary, and warns
      before departure if it is stale. Position and arrival times compute on the device, and
      the arrival time is always a range, never a point, with the pessimistic end used for
      anything safety-adjacent.`,
  },
  {
    glyph: 'hikeChat',
    title: 'Check in, and chat with the office',
    body: `Each trip has one chat thread between the party and ops, open from booking
      confirmation and readable afterwards, like texting your travel agent. Two big buttons
      on the trail: arrived safe, and chat. Safety is opt-in and check-in based at launch,
      with no background location at all, which avoids the store-review burden and keeps
      precise location, a legally sensitive category in several states, out of the product
      until a separately consented upgrade.`,
  },
  {
    glyph: 'hikeBoard',
    title: 'A console a small team can run',
    body: `The economic thesis lives in the ops console: a pipeline board by trip state with
      the assembly clock and balance-due flags inline, a day-by-day workbench beside a margin
      sheet so a trip can never go underwater silently, generated ready-to-send supplier
      requests, and a live map with each party's last-known position next to the band they
      should be in given the stage and the hour. A pocket field app covers today's runs and
      pin-dropping on site.`,
  },
  {
    glyph: 'hikeCore',
    title: 'Logic that has never heard of Firestore',
    body: `Pricing, deposit math, lead-time gates, capacity arithmetic, chainage, booking
      states, and arrival ranges are pure zero-import modules tested with the Node test
      runner. A thin store interface is the only code outside the Firebase folder that knows
      the database, with an in-memory adapter and a Firestore adapter passing one shared
      contract suite. Money paths run only in Cloud Functions; clients cannot write a
      booking at all, and the rules say so with tests.`,
  },
];

const LEDGER = [
  { label: 'Launch corridor, Pittsburgh to Washington', value: '335 miles' },
  { label: 'Routes assessed in research', value: 'about 110' },
  { label: 'Pure logic modules', value: '6' },
  { label: 'Unit tests', value: '55' },
  { label: 'Firestore emulator tests', value: '40' },
  { label: 'Collections under security rules', value: '17' },
];

const HikeAwayTours = () => {
  return (
    <>
      <SEO
        title="Hike Away Tours"
        description="Hike Away Tours — an operated multi-day walking-tour platform on US rail-trail corridors, by John Geddes. Booking engine, data model and Firestore rules built and tested; customer and ops surfaces to follow."
        path="/HikeAwayTours"
      />
      <Background />
      <div id="centerpiece2" className="main-content">
        <h1>Hike Away Tours</h1>
      </div>
      <div className="proj-page main-content">
        <div className="proj-hero">
          <p className="proj-hero-tagline">
            A multi-day walking tour you book like a flight. A travel agent, but newer.
          </p>
          <div className="proj-tech-pills">
            <span className="proj-pill">Firebase</span>
            <span className="proj-pill">Firestore</span>
            <span className="proj-pill">Cloud Functions</span>
            <span className="proj-pill">Node 22</span>
            <span className="proj-pill">Stripe</span>
            <span className="proj-pill">Next.js</span>
            <span className="proj-pill">Expo</span>
            <span className="proj-pill">MapLibre</span>
            <span className="proj-pill">GitHub Actions</span>
          </div>
          <p className="proj-status">
            Private repo, pre-launch. The booking engine, data model, and security rules are
            built and tested headless; no customer surface exists yet.
          </p>
        </div>

        <div className="proj-hero-screenshot">
          <img
            loading="lazy"
            decoding="async"
            src={Hero}
            alt="A hand holding up a phone showing the Hike Away Tours app icon against an Alpine valley and snow-capped peaks"
          />
        </div>

        <div className="proj-about">
          <p>
            Hike Away Tours is an operated walking-tour company on US rail-trail and towpath
            corridors, sold and run through software. A customer books a multi-day walk and the
            company arranges everything around the walking: hotels each night, a driver for
            pickups and drop-offs, luggage moved between hotels, and in-app guidance along the
            way. Nobody guides on the trail. Customers walk independently, and the logistics
            are delivered through contracted vendors.
          </p>
          <p>
            The launch route is the Great Allegheny Passage and the C&amp;O Canal towpath, one
            continuous 335-mile corridor from Pittsburgh to Washington, with Shenandoah
            inn-to-inn planned second. The model is Hillwalk Tours, ported to an app-first
            experience. It began as a plan for Alpine hut-to-hut treks; six research passes
            and about 110 assessed routes later, the Alps were deferred because road-free
            huts do not fit a driver-and-luggage model, and the US corridors do.
          </p>
          <p>
            Visitors who have not booked get a brochure: route previews, stage-by-stage
            itineraries, elevation profiles, hotel photos, prices. Booking unlocks the
            product. There is no free planning tier, deliberately. Every competitor in the
            space surfaces availability and hands you off to book it yourself; here the
            booking is the product and the planning layer is table stakes.
          </p>
        </div>

        <h2 className="proj-section-heading">How it works</h2>
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

        <div className="proj-ledger">
          {LEDGER.map((row) => (
            <div className="proj-ledger-row" key={row.label}>
              <span className="proj-ledger-label">{row.label}</span>
              <span className="proj-ledger-value">{row.value}</span>
            </div>
          ))}
        </div>
        <p className="proj-ledger-caption">
          Read from the repo at its last commit, 19 August 2026, and from the research record.
        </p>

        <div className="proj-companion">
          <h2>Why the legal shape came first</h2>
          <p>
            Selling accommodation plus luggage transfer plus a taxi to a trailhead makes the
            company a package organiser under EU and UK package-travel law. That was decided
            on purpose rather than engineered around, because the package is what customers
            want and what the incumbents sell. The consequence is a US entity selling to US
            residents only: the paid tier is geo-gated, there is no euro pricing and no
            EU-targeted marketing, and Europe waits until scale justifies bonding.
          </p>
          <p>
            In the US, seller-of-travel registration triggers on offering travel for a fee,
            not on holding client money, which an earlier research pass got wrong and the
            record now corrects. Florida, Washington, Hawaii, and California each bring their
            own bonds or trust accounts, and Florida requires its registration legend on every
            advertisement, the App Store listing included. All of it is written into the plan
            as owner gates before the first sale, and one question is reserved for a travel
            lawyer.
          </p>
        </div>

        <div className="proj-about">
          <p>
            Phases 0 and 1a are done: a monorepo with pure-logic, store, and design-token
            packages, a Firestore ruleset with a deny-by-default terminal rule and tests from
            day one, in-memory and Firestore store adapters that pass one shared contract
            suite, and CI that runs the unit and emulator suites on every push. Each plan
            records its own errata as execution corrects it, so the repo, not the plan, is the
            source of truth.
          </p>
          <p>
            Next is Phase 1b: Cloud Functions for booking creation, the capacity race on the
            last seat, and the autopay ladder at three weeks out, with Stripe in test mode.
            Then the customer website, the ops console, and the two apps, all built and
            rehearsed on a fake trip walked by GPX replay before anything ships. The lawyer,
            the registrations, and the driver contracts run alongside the code as owner gates.
          </p>
        </div>
      </div>

      <div className="proj-nav-buttons">
        <Link to="/CipherTracker" className="proj-nav-button">
          Cipher Tracker
        </Link>
        <Link to="/projects" className="proj-nav-button proj-nav-button-blue">
          Projects Page
        </Link>
        <Link to="/ChessDeck" className="proj-nav-button">
          Chess Deck
        </Link>
      </div>
      <PageFooter />
    </>
  );
};

export default HikeAwayTours;
