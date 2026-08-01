import React from 'react';
import Background from '../../ForEveryPage/Background';
import PageFooter from '../../ForEveryPage/PageFooter';
import SEO from '../../ForEveryPage/SEO';
import { Link } from 'react-router-dom';
import './ProjectTemplate.css';
import Glyph from './icons/Glyph';
// Captured from the real front end running against synthetic fixtures, so no
// record, name or address on this page belongs to anyone.
import Dashboard from './ProjectPageImages/SnipeIT/snipe-home.webp';
import Checkout from './ProjectPageImages/SnipeIT/snipe-checkout.webp';
import AssetList from './ProjectPageImages/SnipeIT/snipe-assets.webp';
import AssetDetail from './ProjectPageImages/SnipeIT/snipe-asset-detail.webp';
import StockCount from './ProjectPageImages/SnipeIT/snipe-stock-count.webp';
import UserDetail from './ProjectPageImages/SnipeIT/snipe-user.webp';
import Transfers from './ProjectPageImages/SnipeIT/snipe-transfers.webp';

const FEATURES = [
  {
    glyph: 'snipeDatabase',
    title: 'A spine database for the fleet',
    body: `The asset system knows what was bought and who signed for it. It does not know
      what a laptop has actually been doing. A separate Postgres service collects sightings
      from every system that sees a device and resolves them into one golden record per
      machine. Matching is deliberately timid: one match links, none creates, and two or more
      writes nothing rather than merging. A denylist of eighteen placeholder BIOS serials
      stops a shelf of machines all reporting "Default string" from welding themselves into
      a single record.`,
  },
  {
    glyph: 'snipeServer',
    title: 'Eleven connectors, dark by default',
    body: `Device management, endpoint security, the directory, procurement, shipping, IPAM
      and three warranty APIs each get a small read-only connector. None of them are
      required: with no credentials configured a connector still boots, still answers its
      health check, and reports itself skipped rather than failing. Bringing a vendor online
      is a matter of adding a key.`,
  },
  {
    glyph: 'snipeAlert',
    title: 'Reconciliation that polices itself',
    body: `A recon job compares what the sources say against what the asset record claims and
      raises eight kinds of flag — a device nobody has seen in weeks, an owner that
      disagrees with the directory, hardware that fell off endpoint security. Flags resolve
      themselves when the underlying fact changes, and each check is gated on how fresh its
      source is, so a connector that has never run disables its own checks instead of
      flooding the queue.`,
  },
  {
    glyph: 'snipeTruck',
    title: 'Ordered, shipped, received',
    body: `Purchase orders come in from the reseller as expected devices, tracking numbers go
      out to the carrier, and the shipments come back as a live in-transit view. A machine is
      accounted for from the day it is ordered rather than the day somebody remembers to
      create a record for it.`,
  },
  {
    glyph: 'snipeClipboard',
    title: 'The middle of a device’s life',
    body: `Most asset tools handle the first day and the last. This one covers what happens
      in between: barcode-scanned audits, shelf counts that reconcile accessories, a repair
      queue that writes maintenance records, a disposal chain from e-waste to wiped to
      destroyed, and registers for the ones that went missing or aged out.`,
  },
  {
    glyph: 'snipeLogIn',
    title: 'Directory sign-in, one way back in',
    body: `Sign-in is Microsoft Entra ID, verified against the published keys and exchanged
      for a twelve-hour session cookie, with three roles read from group membership and
      mirrored on both sides of the API. Nothing in the census writes to the asset system
      directly: every change funnels through a single allowlisted route that diffs first and
      skips a write that would change nothing.`,
  },
];

const LEDGER = [
  { label: 'Backend endpoints', value: '95' },
  { label: 'Screens in the app', value: '43' },
  { label: 'Vendor connectors', value: '11' },
  { label: 'Tables in the spine database', value: '13' },
  { label: 'Requests per minute, per token', value: '120' },
  { label: 'Response cache', value: '5 min' },
];

const SnipeIT = () => {
  return (
    <>
      <SEO
        title="Snipe IT"
        description="A device lifecycle console built on the Snipe-IT REST API — Entra ID single sign-on, a pooled service-token layer, and a Postgres census that reconciles eleven vendor sources into one record per machine. By John Geddes."
        path="/SnipeIT"
      />
      <Background />
      <div id="centerpiece2" className="main-content">
        <h1>Snipe IT</h1>
      </div>
      <div className="proj-page main-content">
        <div className="proj-hero">
          <p className="proj-hero-tagline">
            Every system that sees a laptop, reconciled into one record.
          </p>
          <div className="proj-tech-pills">
            <span className="proj-pill">TypeScript</span>
            <span className="proj-pill">React 19</span>
            <span className="proj-pill">Express</span>
            <span className="proj-pill">PostgreSQL</span>
            <span className="proj-pill">Microsoft Entra ID</span>
            <span className="proj-pill">Vite</span>
            <span className="proj-pill">Tailwind</span>
            <span className="proj-pill">Docker</span>
          </div>
          <p className="proj-status">
            Built for an IT team and deployed internally. The source is private, and the
            screenshots below are the real interface running on made-up records.
          </p>
        </div>

        <div className="proj-hero-screenshot">
          <img loading="lazy" decoding="async" src={Dashboard} alt="Dashboard with inventory totals, quick actions, a recent activity feed and a breakdown of assets by category" />
        </div>

        <div className="proj-about">
          <p>
            Snipe-IT is a good asset database with an API and a web interface that was never
            meant for a technician standing in a supply room with a phone. This started as a
            separate front end for it — a React app and an Express gateway adding single
            sign-on, roles and rate-limit headroom — and grew into the operations console for
            a hardware fleet: audits, repairs, disposals, transfers, shipments and reports.
          </p>
          <p>
            The gateway still holds no database of its own; Snipe-IT stays the system of
            record for what the company owns. What changed is that a third service now sits
            alongside it with a Postgres database of its own, collecting evidence from every
            other system that touches a device and reconciling the two pictures against each
            other.
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

        <div className="proj-screenshot">
          <img loading="lazy" decoding="async" src={Checkout} alt="Accessory checkout screen with a searchable catalogue on the left and a cart on the right" />
        </div>

        <div className="proj-screenshot-grid">
          <img loading="lazy" decoding="async" src={AssetList} alt="Asset list with status badges, a column manager showing five of seven columns in use, and a filter builder" />
          <img loading="lazy" decoding="async" src={AssetDetail} alt="Asset detail with custom fields and lifecycle actions for marking a device broken, lost or e-waste" />
          <img loading="lazy" decoding="async" src={StockCount} alt="Stock count for a single location, listing on-hand assets and accessories side by side" />
          <img loading="lazy" decoding="async" src={Transfers} alt="Transfer screen for staging unassigned assets between two locations" />
        </div>

        <div className="proj-screenshot">
          <img loading="lazy" decoding="async" src={UserDetail} alt="User record listing the assets and accessories currently checked out to them" />
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
          <h2>How it runs</h2>
          <p>
            The upstream API allows 120 requests a minute per credential, which one shared key
            cannot spread across a team. The gateway holds a pool of service accounts and
            sticky-assigns each signed-in person to one, so every token carries its own bucket
            and the ceiling scales with the pool. Requests queue when a bucket is spent, retry
            with exponential backoff, and shed load as a clean 503 once the queue passes five
            hundred. A five-minute cache fronts the read-heavy routes and every write clears it.
          </p>
          <p>
            In production the Express process serves the compiled React app as static files —
            one process, one port — behind an nginx reverse proxy that terminates TLS, with a
            multi-stage Docker image running as a non-root user as the alternative target.
            Helmet sets the content security policy and a year of HSTS, request bodies are
            capped at 10kb, nine browser APIs are denied outright, and inbound traffic is
            rate-limited on three separate tiers.
          </p>
        </div>

        <div className="proj-about">
          <p>
            The interface was rebuilt in 2026 over five documented phases onto a token-based
            design system — CSS variables for every surface and text colour so light and dark
            derive from one source, about nineteen shared primitives, skeletons instead of
            spinners, and toasts instead of blocking alerts.
          </p>
          <p>
            The honest gap is that the tests do not run themselves. There are 42 self-test
            modules across the three packages, but no test runner wiring them together and no
            CI to fail a build, so they only help when someone remembers to invoke them. The
            frontend also still ships as a single bundle with no route-level code splitting.
            Those are the first two things I would fix.
          </p>
          <p style={{ fontSize: '15px' }}>
            Snipe-IT is a trademark of Grokability, Inc. This project integrates with it
            through its public REST API and is not affiliated with or endorsed by Grokability.
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

export default SnipeIT;
