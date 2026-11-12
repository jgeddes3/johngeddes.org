import React from 'react';
import Background from '../../ForEveryPage/Background';
import PageFooter from '../../ForEveryPage/PageFooter';
import SEO from '../../ForEveryPage/SEO';
import { Link } from 'react-router-dom';
import './ProjectTemplate.css';
import Glyph from './icons/Glyph';
// Captured from the live app on 2026-11-05 with every person's name, email and
// phone number replaced in the browser before the shot. Sites and asset tags stay.
import Home from './ProjectPageImages/Census/census-home.webp';
import Onboarding from './ProjectPageImages/Census/census-onboarding.webp';
import Shipping from './ProjectPageImages/Census/census-shipping.webp';
import InTransit from './ProjectPageImages/Census/census-in-transit.webp';
import Requests from './ProjectPageImages/Census/census-requests.webp';
import CallCenter from './ProjectPageImages/Census/census-call-center.webp';
import Chargebacks from './ProjectPageImages/Census/census-chargebacks.webp';
import Flags from './ProjectPageImages/Census/census-flags.webp';
import Rooms from './ProjectPageImages/Census/census-location-rooms.webp';
import Transactions from './ProjectPageImages/Census/census-transactions.webp';
import Asset from './ProjectPageImages/Census/census-asset.webp';
import Security from './ProjectPageImages/Census/census-security.webp';
import SnowNote from './ProjectPageImages/Census/census-snow-note.webp';
import BeforeExcel from './ProjectPageImages/Census/census-before-excel.webp';
import RoomCheck from './ProjectPageImages/Census/census-room-check.webp';

// Every number on this page is read from the database Census runs on
// (2026-11-05), from git, or from the app's own research files; none is rounded
// beyond what the source already did.

const FEATURES = [
  {
    glyph: 'censusBox',
    title: 'New gear arrives already on a list',
    body: `The morning run reads SHI's orders, lines and shipments. A delivered unit lands on the
      onboarding queue with its order number, supplier and owner filled in; a tech checks it
      against the box in their hand and presses Create. The rule the whole app follows: the
      computer suggests, a person confirms. 910 assets came in this way in its first two weeks.`,
  },
  {
    glyph: 'censusTruck',
    title: 'A FedEx label from the checkout',
    body: `Checking a device out to someone opens the label form filled with the person, the
      address Census found in their ticket, the ticket number and the gear. FedEx validates the
      address, prints the label, and every box is tracked until it lands; the delivery date is
      written back onto the asset and a note goes on the ServiceNow ticket at each step.`,
  },
  {
    glyph: 'censusReturn',
    title: 'Getting gear back when people leave',
    body: `The call center marks a leaver and the Returns list shows what they hold. A tech checks
      each item in with its condition, Good or Broken, and Census does the check-ins and the
      stock counts. Anything not returned keeps its last holder and ticket, so it can still be
      chased or charged back. It replaced a spreadsheet called Callcenter.xlsx.`,
  },
  {
    glyph: 'censusBill',
    title: 'Chargebacks with a record of every charge',
    body: `Each month, per owning team: every item handed out, reviewed by a manager, charged in
      one press, and the same billing file finance always read. Nothing can be charged twice,
      and the department comes from the person's record instead of being typed. 4,502 charges
      since January; the old workbook held no price, cost or total anywhere.`,
  },
  {
    glyph: 'censusClock',
    title: 'Every night, the fleet is checked against the tools',
    body: `The evening run compares the books with what Intune, Jamf and CrowdStrike can see and
      raises a flag for what does not add up: missing from a tool, falling off one, still
      reporting after disposal, two computers on one person. Flags are routed to a group,
      escalated when they need the next tier, and close on their own once the fact changes.`,
  },
  {
    glyph: 'censusUser',
    title: 'Signed in as yourself, all the way down',
    body: `Sign-in is Microsoft Entra ID. The gateway exchanges the person's token for their own
      access to the asset record, so every write lands in its history under their name, not
      a service account's. Roles come from directory groups; thirteen smaller groups gate the
      workspaces (VIP, Security, Call Center, Chargebacks, audits, catalog edits).`,
  },
];

// Changes recorded in the asset history as made through Census, per month of 2026.
const CHANGES = [
  ['Jan', 0], ['Feb', 0], ['Mar', 2], ['Apr', 23], ['May', 916],
  ['Jun', 3340], ['Jul', 2537], ['Aug', 3716], ['Sep', 3270], ['Oct', 11942],
];
// Commits on main per month of 2026 (November, five days in, left out).
const COMMITS = [
  ['Jan', 3], ['Feb', 8], ['Mar', 1], ['Apr', 7], ['May', 35],
  ['Jun', 423], ['Jul', 222], ['Aug', 155], ['Sep', 318], ['Oct', 1854],
];
// Hours a month given back, from agreed minutes per task times October 2026's real counts.
const HOURS = [
  ['FedEx labels', 67], ['Accessory checkouts', 59], ['Chargebacks', 55], ['New assets', 31], ['Delivery dates', 26],
];

const LEDGER = [
  { label: 'Active assets on the books', value: '48,243' },
  { label: 'People in it each week', value: '36' },
  { label: 'Outside systems connected', value: '14' },
  { label: 'Built and waiting on a switch', value: '4' },
  { label: 'Screens in the app', value: '53' },
  { label: 'API routes', value: '228' },
  { label: 'Reads moved from API to SQL', value: '41' },
  { label: 'Census tables in the database', value: '40' },
  { label: 'Commits since 13 January 2026', value: '3,224' },
  { label: 'Lines of code, tests included', value: '294,500' },
  { label: 'Test files', value: '716' },
  { label: 'Design specs and plans written', value: '239' },
];

const SYSTEMS = [
  ['Asset database', 'The record. Read by SQL; written through its REST API as the signed-in person.'],
  ['Microsoft Entra ID', 'Sign-in with MSAL, roles from groups, on-behalf-of exchange for each person\'s own access to the record; new hires read nightly.'],
  ['Microsoft Intune', 'Windows devices through Graph: last check-in, user, OS, MAC, IP; missing and falling-off flags.'],
  ['Jamf Pro', 'Macs and iPads: last seen, user, IP; the iPad network check.'],
  ['CrowdStrike Falcon', 'Computers running the sensor and their IPs; the location check and the Not on CrowdStrike tab.'],
  ['ServiceNow', 'Tickets synced every five minutes, requests queue, work notes and comments, incident creation, VIP flag, sites.'],
  ['ServiceNow CMDB', 'A daily map from configuration items to assets; a compare report; 6,658 retired devices imported.'],
  ['FedEx', 'Ship, Track and Address Validation: labels, returns, tracking, delivery dates.'],
  ['SHI', 'Orders, lines, shipments and tracking numbers, read each morning into the onboarding queue.'],
  ['Apple, Dell, Lenovo', 'Apple Business Manager, Dell TechDirect and Lenovo warranty lookups, paced to one ask per asset a month.'],
  ['phpIPAM', 'Subnets per site, read for location checks and printer placement.'],
  ['Eptura', 'Seats, buildings and the meeting-room floor plans behind the Audio Visual map.'],
  ['Ricoh fleet report', 'The daily printer report from a service mailbox; new printers created and placed by IP.'],
  ['Microsoft Graph mail', 'Reads the Ricoh and Workday reports; sends warning emails when switched on.'],
  ['Google Cloud', 'Cloud Run for the app and the jobs, Cloud SQL for the database, Cloud Logging, Secret Manager.'],
  ['Workday', <>New-hire and leaver lists. <em>Built, waiting on the reports reaching the mailbox.</em></>],
  ['Active Directory', <>Computer objects and last logon, and the Room Check pilot. <em>Built, waiting on a service account.</em></>],
  ['Avigilon Alta', <>Door access for new hires. <em>Next: a service role is set up, the code is not written.</em></>],
];

const CHART_W = 640;

function LineChart({ data, highlightLast = true }) {
  const left = 56; const right = 24; const top = 18; const bottom = 34; const h = 240;
  const max = 14000;
  const xs = data.map((_, i) => left + ((CHART_W - left - right) * (i + 0.5)) / data.length);
  const y = (v) => top + (h - top - bottom) * (1 - v / max);
  const points = data.map(([, v], i) => `${xs[i]},${y(v)}`).join(' ');
  const ticks = [0, 4000, 8000, 12000];
  const last = data.length - 1;
  return (
    <svg viewBox={`0 0 ${CHART_W} ${h}`} role="img" aria-label="Changes made through Census per month, from 0 in January 2026 to 11,942 in October">
      {ticks.map((t) => (
        <g key={t}>
          <line className="proj-chart-grid" x1={left} x2={CHART_W - right} y1={y(t)} y2={y(t)} />
          <text className="proj-chart-text" x={left - 8} y={y(t) + 4} textAnchor="end">{t.toLocaleString()}</text>
        </g>
      ))}
      <polyline className="proj-chart-line" points={points} />
      {data.map(([m, v], i) => (
        <g key={m}>
          <circle className={`proj-chart-dot${highlightLast && i === last ? ' proj-chart-dot-accent' : ''}`} cx={xs[i]} cy={y(v)} r={highlightLast && i === last ? 5.5 : 4} />
          <text className="proj-chart-text" x={xs[i]} y={h - 12} textAnchor="middle">{m}</text>
        </g>
      ))}
      <text className="proj-chart-label" x={xs[4]} y={y(916) - 12} textAnchor="middle">916 in May</text>
      <text className="proj-chart-label" x={xs[last] - 12} y={y(11942) + 5} textAnchor="end">11,942 in October</text>
    </svg>
  );
}

// The two half-width charts draw on a narrower canvas so their type stays the same size on screen.
const HALF_W = 420;

function ColumnChart({ data, max, label }) {
  const left = 12; const right = 12; const top = 24; const bottom = 30; const h = 220;
  const slot = (HALF_W - left - right) / data.length;
  const bw = slot * 0.64;
  const y = (v) => top + (h - top - bottom) * (1 - v / max);
  const peak = data.reduce((a, b) => (b[1] > a[1] ? b : a));
  return (
    <svg viewBox={`0 0 ${HALF_W} ${h}`} role="img" aria-label={label}>
      <line className="proj-chart-grid" x1={left} x2={HALF_W - right} y1={h - bottom} y2={h - bottom} />
      {data.map(([m, v], i) => {
        const x = left + slot * i + (slot - bw) / 2;
        return (
          <g key={m}>
            <rect className={`proj-chart-bar${m === peak[0] ? ' proj-chart-bar-accent' : ''}`} x={x} y={y(v)} width={bw} height={h - bottom - y(v)} rx="3" />
            <text className="proj-chart-text" x={x + bw / 2} y={y(v) - 6} textAnchor="middle">{v.toLocaleString()}</text>
            <text className="proj-chart-text" x={x + bw / 2} y={h - 12} textAnchor="middle">{m}</text>
          </g>
        );
      })}
    </svg>
  );
}

function BarChart({ data, max, label }) {
  const left = 126; const right = 36; const rowH = 36; const top = 10;
  const h = top + rowH * data.length + 10;
  const w = (v) => ((HALF_W - left - right) * v) / max;
  return (
    <svg viewBox={`0 0 ${HALF_W} ${h}`} role="img" aria-label={label}>
      {data.map(([name, v], i) => {
        const y = top + rowH * i;
        return (
          <g key={name}>
            <text className="proj-chart-text" x={left - 10} y={y + rowH / 2 + 4} textAnchor="end">{name}</text>
            <rect className={`proj-chart-bar${i === 0 ? ' proj-chart-bar-accent' : ''}`} x={left} y={y + 7} width={w(v)} height={rowH - 14} rx="3" />
            <text className="proj-chart-label" x={left + w(v) + 8} y={y + rowH / 2 + 5}>{v}</text>
          </g>
        );
      })}
    </svg>
  );
}

const Census = () => {
  return (
    <>
      <SEO path="/Census" />
      <Background />
      <div id="centerpiece2" className="main-content">
        <h1>Census</h1>
      </div>
      <div className="proj-page main-content">
        <div className="proj-hero">
          <p className="proj-hero-tagline">
            Everything between someone asking for a laptop and that laptop arriving, in one place.
          </p>
          <div className="proj-tech-pills">
            <span className="proj-pill">TypeScript</span>
            <span className="proj-pill">React 19</span>
            <span className="proj-pill">Vite 7</span>
            <span className="proj-pill">Tailwind 3</span>
            <span className="proj-pill">Express 4</span>
            <span className="proj-pill">MySQL 8.4 on Cloud SQL</span>
            <span className="proj-pill">Microsoft Entra ID</span>
            <span className="proj-pill">Google Cloud Run</span>
            <span className="proj-pill">Docker</span>
            <span className="proj-pill">GitLab CI</span>
            <span className="proj-pill">SonarQube</span>
          </div>
          <p className="proj-status">
            Built for the IT asset team of a dental support organisation and in daily use since
            October 2026. The source is private. The screenshots are the real app on the live
            database, with every person's name replaced before the shot.
          </p>
        </div>

        <div className="proj-hero-screenshot">
          <img loading="lazy" decoding="async" src={Home} alt="Census home: asset counts for the signed-in person's team and site, quick actions, a recent activity feed and assets by category" />
        </div>

        <div className="proj-about">
          <p>
            A year ago the asset team ran shipping out of one shared workbook: 1,711 lines typed
            by hand in nine months, 118 department codes written 328 different ways, no price or
            total anywhere, and nearly three in ten lines with no ticket number. The asset database held
            about 13,000 records, mostly imports from field support's own spreadsheets, while the
            device-management and security tools could see roughly 40,000 devices that had no
            asset record at all.
          </p>
          <p>
            Census started in January 2026 as 22 screens in front of the asset database's API, where you
            signed in by pasting your own key. It is now the console the team works in all day:
            onboarding, shipping, offboarding, chargebacks, audits, repairs, disposals, reports,
            and a set of jobs that run every morning, evening and week, and every five minutes for
            tickets. The system of record is a MySQL database, self-hosted on Google Cloud since
            October. Census reads it by SQL and writes to it through an API as the person who
            clicked.
          </p>
        </div>

        <div className="proj-screenshot">
          <img loading="lazy" decoding="async" src={BeforeExcel} alt="The old Corp Equipment Tracking workbook, a wide sheet of hand-typed shipment lines with names, tickets and asset tags replaced" />
          <p className="proj-caption">Where it started: the shipping tab of the old workbook, Sep 2025 to Jun 2026. Names, tickets and tags replaced.</p>
        </div>

        <h2 className="proj-section-heading">What it does</h2>
        <div className="proj-features">
          {FEATURES.map((feature) => (
            <div className="proj-feature-card" key={feature.title}>
              <div className="proj-feature-head">
                <span className="proj-feature-icon">
                  <Glyph name={feature.glyph} size={26} strokeWidth={1.6} />
                </span>
                <h3>{feature.title}</h3>
              </div>
              <p>{feature.body}</p>
            </div>
          ))}
        </div>

        <div className="proj-screenshot">
          <img loading="lazy" decoding="async" src={Onboarding} alt="Asset onboarding, the Delivered tab: SHI receipts waiting for a tech to confirm, each with its order number and person" />
          <p className="proj-caption">Asset onboarding: what SHI delivered yesterday, waiting for a tech to confirm.</p>
        </div>

        <div className="proj-screenshot-grid">
          <img loading="lazy" decoding="async" src={Shipping} alt="Shipping: the FedEx label form with the ship-from depot and a ship-to clinic address filled in and validated" />
          <img loading="lazy" decoding="async" src={InTransit} alt="In transit report: every shipped box with its tracking number, status, estimated delivery and destination" />
          <img loading="lazy" decoding="async" src={Chargebacks} alt="Chargebacks for one owning team and month, with Not charged rows selected for the next charge" />
          <img loading="lazy" decoding="async" src={CallCenter} alt="Call Center returns list: people who have left and still hold gear, 52 pending" />
        </div>

        <div className="proj-screenshot-grid">
          <img loading="lazy" decoding="async" src={Requests} alt="Requests: open ServiceNow requests for computers, each with a Fulfill button and an I'm on it claim" />
          <img loading="lazy" decoding="async" src={SnowNote} alt="A ServiceNow ticket's activity stream with two notes Census wrote: the checkout and the shipping label" />
        </div>
        <p className="proj-caption">Left, the ServiceNow queue inside Census. Right, what the ticket sees: Census writes the checkout and the label back as notes.</p>

        <h2 className="proj-section-heading">In numbers</h2>
        <div className="proj-charts">
          <div className="proj-chart proj-chart-wide">
            <h3>Changes made through Census, per month</h3>
            <p className="proj-chart-sub">Rows in the asset history that came through the app. The team moved onto it fully on 22 October.</p>
            <LineChart data={CHANGES} />
          </div>
          <div className="proj-chart">
            <h3>Commits per month</h3>
            <p className="proj-chart-sub">3,224 on main from 13 January to 5 November 2026, one author.</p>
            <ColumnChart data={COMMITS} max={2000} label="Commits per month in 2026: 3 in January rising to 1,854 in October" />
          </div>
          <div className="proj-chart">
            <h3>Hours a month given back</h3>
            <p className="proj-chart-sub">Minutes per task agreed by the team, times October's real counts. About 314 hours in all, close to two people's month.</p>
            <BarChart data={HOURS} max={80} label="Hours saved per month by task: FedEx labels 67, accessory checkouts 59, chargebacks 55, new assets 31, delivery dates 26" />
          </div>
        </div>

        <div className="proj-ledger">
          {LEDGER.map((row) => (
            <div className="proj-ledger-row" key={row.label}>
              <span className="proj-ledger-label">{row.label}</span>
              <span className="proj-ledger-value">{row.value}</span>
            </div>
          ))}
        </div>
        <p className="proj-ledger-caption">Database and git read on 5 November 2026.</p>

        <div className="proj-screenshot-grid">
          <img loading="lazy" decoding="async" src={Flags} alt="Flags: the evening run's findings routed to groups, with type, owner, location, since, last seen and escalation" />
          <img loading="lazy" decoding="async" src={Security} alt="Security workspace, Not on CrowdStrike tab: 1,412 computers with no sensor, with when any other tool last saw them" />
          <img loading="lazy" decoding="async" src={Asset} alt="One asset's page: model, serial, location, last seen by Intune, MAC address, IP, OS and coverage" />
          <img loading="lazy" decoding="async" src={Rooms} alt="A clinic's location page in the By room view, assets grouped by the room they are in" />
        </div>

        <h2 className="proj-section-heading">The outside systems</h2>
        <div className="proj-systems">
          {SYSTEMS.map(([name, what]) => (
            <div className="proj-system" key={name}>
              <span className="proj-system-name">{name}</span>
              <span className="proj-system-what">{what}</span>
            </div>
          ))}
        </div>
        <p className="proj-ledger-caption" style={{ margin: '0 0 40px' }}>
          Every vendor connector is read-only toward its vendor. Census writes to its own asset database, to ServiceNow (notes, comments, incidents) and to FedEx (labels), and nowhere else.
        </p>

        <div className="proj-companion">
          <h2>How it runs</h2>
          <p>
            Three packages in one repository: the web app, the Express gateway, and the services
            package that holds the connectors and the jobs. The gateway serves the compiled app as
            static files from one Cloud Run service; a Cloud Run job runs the Morning (06:00),
            End-of-day (19:00) and Weekly (Sunday) runs and the five-minute ServiceNow poll.
            The asset record runs on a Compute Engine VM with its MySQL 8.4 database on Cloud SQL,
            private only, and Census's own 40 tables live in that same database under a
            <code> tag_</code> prefix, built by 50 migrations.
          </p>
          <p>
            People write by API, the jobs by SQL. A job never creates an asset or checks anything
            in or out: it queues a candidate, a person confirms, and the app writes through the
            API as that person, so the history names who did what. Reads went the other
            way: 41 read surfaces moved from the API to SQL between 16 and 21 October, each
            checked against the API's answer before it was switched on. The VIP report went from
            about two minutes to about a second; a year of history from 19.5 minutes to 1.3
            seconds.
          </p>
          <p>
            Nothing is served to someone who is not signed in. A Strict session cookie guards the
            API and a Lax page cookie guards the pages and the bundle, both set at sign-in and
            named with the <code>__Host-</code> prefix in production. Helmet sets the content
            security policy, bodies are capped at 10 kb, and traffic is rate-limited on three
            tiers. The 716 self-test files run with one command and the GitLab pipeline runs them
            on every push; SonarQube went from 43 blocker and critical findings to none in the
            November security pass.
          </p>
        </div>

        <div className="proj-screenshot">
          <img loading="lazy" decoding="async" src={Transactions} alt="Weekly transactions report: 11,324 rows for the week with date, action, item, model, owner, who performed it and the ticket" />
          <p className="proj-caption">The weekly report: every transaction for the week, with the columns you pick, exported to Excel in one press.</p>
        </div>

        <div className="proj-about">
          <h2 className="proj-section-heading">What is next</h2>
          <p>
            Room Check is built and tested: a small window on each field desktop asks whoever is
            sitting there whether the PC is still at that site and in that room, and nothing
            changes until a manager approves the answer. A pilot on a handful of desktops comes
            next. After it, the Workday new-hire and leaver lists inside Census, door access for
            new hires through Avigilon Alta, and writing what Census knows back into the
            ServiceNow CMDB.
          </p>
          <p>
            The honest gap is cost data: only about one asset in twenty carries a purchase cost,
            so the chargeback totals are a floor. The onboarding queue now fills the order number
            and supplier on 87 percent of new assets, against under one percent before, which is
            how that gap closes over time.
          </p>
        </div>

        <div className="proj-screenshot">
          <img loading="lazy" decoding="async" src={RoomCheck} alt="Room Check, two of its five screens: Is this PC still at this site, and Where is this PC now, with a list of rooms to pick from" />
          <p className="proj-caption">Room Check, the next piece: built and tested, pilot next.</p>
        </div>

        <div className="proj-about">
          <p>
            I built Census with an AI coding assistant as a pair, and a large share of the work is
            the 92,912 lines of tests that keep it from breaking. The 239 design specs and plans
            in the repository are the record of the decisions.
          </p>
          <p style={{ fontSize: '15px' }}>
            Icons on this page: Solar by 480 Design (CC BY 4.0), the set the app uses.
          </p>
        </div>
      </div>

      <div className="proj-nav-buttons">
        <Link to="/PaperTrail" className="proj-nav-button">
          Paper Trail
        </Link>
        <Link to="/projects" className="proj-nav-button proj-nav-button-blue">
          Projects Page
        </Link>
        <Link to="/HikeAwayTours" className="proj-nav-button">
          Hike Away Tours
        </Link>
      </div>
      <PageFooter />
    </>
  );
};

export default Census;
