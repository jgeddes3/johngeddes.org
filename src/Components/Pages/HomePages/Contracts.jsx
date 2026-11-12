import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Background from '../../ForEveryPage/Background';
import PageFooter from '../../ForEveryPage/PageFooter';
import SEO from '../../ForEveryPage/SEO';
import headshot from './ContractsImages/headshot.webp';
import signature from './ContractsImages/signature.webp';
import './Contracts.css';

const EMAIL = 'johngeddes@pm.me';
const MAILTO = `mailto:${EMAIL}?subject=${encodeURIComponent('Contract work')}`;

const SERVICES = [
  {
    name: 'Websites',
    text: 'I design the site, build it and put it live, with the search engine setup done as part of the job.',
  },
  {
    name: 'AV',
    text: 'I run sound boards and cameras for live events, set up and run live streams, and design AV systems for small venues. I also work on the installed systems listed below. This is AV work only, not computer repair.',
  },
  {
    name: 'Software',
    text: 'Internal tools, asset tracking, automations and mobile apps, close to the projects shown further down this page.',
  },
];

const SYSTEMS = [
  'Q-SYS', 'Crestron', 'Extron', 'Biamp', 'Shure', 'Sennheiser', 'Yealink',
  'Logitech', 'Neat', 'Cisco', 'Lenovo ThinkSmart', 'Planar', 'Samsung',
];

// Internal links carry `to`, outside ones `href`.
const WORK = [
  {
    kind: 'Software',
    name: 'Census',
    text: "The asset management platform The Aspen Group's IT asset team works in. It tracks 48,243 assets, and 36 people use it each week.",
    links: [{ label: 'Project page', to: '/Census' }],
  },
  {
    kind: 'Mobile app and website',
    name: 'Cipher Tracker',
    text: 'A health and habit tracker for iOS and Android. Every entry is encrypted on the phone. I also built the site that markets it.',
    links: [
      { label: 'Project page', to: '/CipherTracker' },
      { label: 'cipher-app.org', href: 'https://cipher-app.org' },
    ],
  },
  {
    kind: 'Mobile app and website',
    name: 'Rambler Registrar',
    text: 'A course scheduling app for Loyola University Chicago students that builds schedules from live catalog data, with its own website.',
    links: [
      { label: 'Project page', to: '/RamblerRegistrar' },
      { label: 'ramblerregistrar.com', href: 'https://www.ramblerregistrar.com/' },
    ],
  },
  {
    kind: 'Product design',
    name: 'GateKeep',
    text: "A planned marketplace for one city's live music: musician and venue profiles, gig booking and ticketing. It has not launched, so the page shows the plan and the screen designs.",
    links: [{ label: 'Project page', to: '/GateKeep' }],
  },
  {
    kind: 'Website',
    name: 'This site',
    text: 'I designed and built johngeddes.org. Each page is generated ahead of time, so search engines and slow phones get the whole page in the first response.',
    links: [{ label: 'All projects', to: '/projects' }],
  },
  {
    kind: 'AV',
    name: 'Enterprise AV',
    text: 'At The Aspen Group I support 88+ Logitech meeting rooms and rebuilt the boardroom on Neat and Q-SYS. Before that I ran AV for six or seven campus events a week at Loyola University Chicago.',
    links: [{ label: 'AV resume', to: '/recruiters?role=av' }],
  },
];

const STEPS = [
  'Email me what you need.',
  'We talk it through. For AV work I come and see the room.',
  'I send you a written quote.',
  'I do the work and hand it over.',
];

const ContractsPage = () => {
  const [copied, setCopied] = useState(false);

  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText(EMAIL);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      /* clipboard API unavailable: the address is on the button beside this one */
    }
  };

  return (
    <>
      <SEO path="/contracts" />
      <Background />
      <div id="centerpiece2" className="main-content">
        <h1>Looking to Contract?</h1>
      </div>
      <div className="projects-description-container">
        <p className="projects-description main-content">
          I take contract work in websites, AV and software. I am based in Chicago, and web
          and software work is remote.
        </p>
      </div>

      <div className="contracts-body">
        <section className="contracts-panel contracts-opener main-content" aria-labelledby="contracts-services">
          <div className="contracts-portrait">
            <div className="contracts-headshot-wrap">
              <img
                src={headshot}
                alt="John Geddes"
                className="contracts-headshot"
                width="800"
                height="566"
                decoding="async"
              />
              <img
                src={signature}
                alt=""
                aria-hidden="true"
                className="contracts-signature"
                width="400"
                height="400"
                decoding="async"
              />
            </div>
            <p className="contracts-name">John Geddes</p>
          </div>
          <div className="contracts-services">
            <h2 id="contracts-services">What I take on</h2>
            <ul>
              {SERVICES.map((s) => (
                <li key={s.name}>
                  <h3>{s.name}</h3>
                  <p>{s.text}</p>
                </li>
              ))}
            </ul>
            <a className="contracts-jump" href="#contact">Get in touch</a>
          </div>
        </section>

        <section className="contracts-section main-content" aria-labelledby="contracts-systems">
          <h2 id="contracts-systems">Systems I have worked on</h2>
          <ul className="contracts-systems">
            {SYSTEMS.map((name) => <li key={name}>{name}</li>)}
          </ul>
        </section>

        <section className="contracts-section main-content" aria-labelledby="contracts-work">
          <h2 id="contracts-work">What I have built</h2>
          <ul className="contracts-work">
            {WORK.map((w) => (
              <li key={w.name} className="contracts-card">
                <p className="contracts-kind">{w.kind}</p>
                <h3>{w.name}</h3>
                <p className="contracts-card-text">{w.text}</p>
                <p className="contracts-card-links">
                  {w.links.map((l) => (l.to
                    ? <Link key={l.label} to={l.to}>{l.label}</Link>
                    : <a key={l.label} href={l.href} target="_blank" rel="noopener noreferrer">{l.label}</a>))}
                </p>
              </li>
            ))}
          </ul>
        </section>

        <section className="contracts-section main-content" aria-labelledby="contracts-steps">
          <h2 id="contracts-steps">How it works</h2>
          <ol className="contracts-steps">
            {STEPS.map((step, i) => (
              <li key={step}>
                <span className="contracts-step-number" aria-hidden="true">{i + 1}</span>
                <span>{step}</span>
              </li>
            ))}
          </ol>
          <p className="contracts-rates">
            Rates are competitive and quoted per job once we have talked through the scope.
          </p>
        </section>

        <section id="contact" className="contracts-panel contracts-contact main-content" aria-labelledby="contracts-contact">
          <h2 id="contracts-contact">Get in touch</h2>
          <p>
            Send a few lines on what the job is, where it is if it is AV work, and when you
            need it done.
          </p>
          <div className="contracts-contact-buttons">
            <a className="contracts-email" href={MAILTO}>Email {EMAIL}</a>
            <button type="button" className="contracts-copy" onClick={copyEmail}>
              {copied ? 'Copied' : 'Copy address'}
            </button>
          </div>
          <span className="contracts-status" role="status">{copied ? 'Email address copied' : ''}</span>
        </section>
      </div>

      <div className="bottom-buttons-container">
        <Link to="/recruiters" className="recruiters-nav-button">
          Recruiters Page
        </Link>
        <Link to="/friends" className="friends-nav-button">
          Friends Page
        </Link>
      </div>

      <PageFooter />
    </>
  );
};

export default ContractsPage;
