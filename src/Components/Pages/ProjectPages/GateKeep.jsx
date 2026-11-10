import React from 'react';
import Background from '../../ForEveryPage/Background';
import PageFooter from '../../ForEveryPage/PageFooter';
import SEO from '../../ForEveryPage/SEO';
import { Link } from 'react-router-dom';
import './ProjectTemplate.css';
import Glyph from './icons/Glyph';
import ArtistMock from './ProjectPageImages/GateKeep/gatekeep-artist.webp';
import BookingMock from './ProjectPageImages/GateKeep/gatekeep-booking.webp';
import FanMock from './ProjectPageImages/GateKeep/gatekeep-fan.webp';

const FEATURES = [
  {
    glyph: 'gateNote',
    title: 'A page a venue can judge quickly',
    body: `Each act gets one public page: a bio, photos, genres, links, and up to ten
      30-second audio snippets, trimmed and transcoded on the server and reviewed before they
      play. Rates and booking preferences sit on the same page, and the act decides whether
      everyone sees them or only approved venues do.`,
  },
  {
    glyph: 'gateDates',
    title: 'Gigs posted once, or as a run',
    body: `Venues, planners, and hosts get the same kind of profile and post the nights they
      need filled: a single date, or a recurring series that a daily job turns into real
      dates as they come up. A venue shows its address. A house show or a private event
      shows only its neighbourhood, and the exact address is released to the act once it is
      booked.`,
  },
  {
    glyph: 'gateTerms',
    title: 'Terms first, then a handshake',
    body: `Either side can open a booking. An act applies to an open gig, or a venue offers
      one directly. The two trade counter-offers in a thread that carries terms and nothing
      else, capped at fifty entries so it has to end. Accepting freezes the terms. Talking
      happens in messages, which are separate on purpose.`,
  },
  {
    glyph: 'gateHold',
    title: 'The money sits in the middle',
    body: `Accepting charges the venue a 35% deposit. The rest is charged three days after
      the show ends, and the act's share moves to its own Stripe account from there. The
      venue pays an 11% booking fee on top of the agreed price and the act gives up 2% of
      it. A band can set percentage shares per member, and each settlement is split that
      way before anyone is paid.`,
  },
  {
    glyph: 'gateTicket',
    title: 'Tickets, and the door',
    body: `A venue can turn a filled gig into a public event, or publish one on its own, with
      free and paid tiers. The buyer pays a service fee of 7% plus 99 cents a ticket, never
      more than $3.99. The ticket is a QR code checked in once at the door by the venue's
      phone. Cancel the event and every order is refunded without anyone asking.`,
  },
  {
    glyph: 'gateFind',
    title: 'A way to find Friday night',
    body: `Fans follow acts, venues, and genres. Following is what drives the notifications:
      a show announced, a lineup change, a new date, new music from someone they follow. A
      ranked deck and a searchable list cover the rest, sorted by distance, with a map on
      the results.`,
  },
];

const LEDGER = [
  { label: 'Sides to the marketplace', value: '3' },
  { label: 'Deposit charged when a booking is accepted', value: '35%' },
  { label: 'Booking fee, paid by the venue', value: '11%' },
  { label: 'Commission, paid by the act', value: '2%' },
  { label: 'Parts in the build plan', value: '12' },
  { label: 'Lines on the launch checklist', value: '65' },
];

const GateKeep = () => {
  return (
    <>
      <SEO path="/GateKeep" />
      <Background />
      <div id="centerpiece2" className="main-content">
        <h1>GateKeep</h1>
      </div>
      <div className="proj-page main-content">
        <div className="proj-hero">
          <p className="proj-hero-tagline">
            One city&apos;s musicians, venues, and fans in a single app, with the booking and
            the money handled in the middle.
          </p>
          <div className="proj-tech-pills">
            <span className="proj-pill">Expo</span>
            <span className="proj-pill">React Native</span>
            <span className="proj-pill">Next.js</span>
            <span className="proj-pill">TypeScript</span>
            <span className="proj-pill">Firebase</span>
            <span className="proj-pill">Firestore</span>
            <span className="proj-pill">Cloud Functions</span>
            <span className="proj-pill">Stripe Connect</span>
            <span className="proj-pill">GitHub Actions</span>
          </div>
          <p className="proj-status">
            Planned, not launched, and not close. This page describes what GateKeep is meant
            to be. The screens on it are mockups drawn to the app&apos;s own design rules,
            and every act, venue, and show in them is made up.
          </p>
        </div>

        <div className="proj-hero-screenshot">
          <img
            loading="lazy"
            decoding="async"
            src={ArtistMock}
            alt="Mockup of a GateKeep artist page: a made-up act's name over a cover image, an Offer a gig button, three 30-second audio snippets, and a list of upcoming shows with dates and ticket prices"
          />
          <p className="proj-caption">
            Mockup of an act&apos;s page as a venue would see it. The act is invented.
          </p>
        </div>

        <div className="proj-about">
          <p>
            GateKeep is a marketplace for live music in one city at a time. It has three
            sides. Musicians keep a page that shows what they sound like and what they
            charge. Venues, planners, and hosts post the nights they need filled. Fans find
            out what is on and buy a ticket. The same booking that fills a venue&apos;s
            Friday becomes the show a fan sees on Thursday.
          </p>
          <p>
            The name is the plan. Nobody is listed until a person has looked: every
            musician and venue profile goes from draft to review to approved, and every
            audio snippet is checked before it plays. That is slow by design, and it suits
            a launch in a single city better than one everywhere at once.
          </p>
          <p>
            It is meant to earn from the first booking instead of waiting on scale: a fee on
            each gig, a small commission from the act, and a service fee on tickets.
            Advertising, subscriptions, guest checkout, seat maps, promo codes, and ticket
            resale are all left out of the plan on purpose.
          </p>
        </div>

        <h2 className="proj-section-heading">What is planned</h2>
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
            src={BookingMock}
            alt="Mockup of a GateKeep booking: three offers and counter-offers ending at 600 dollars for one set, beside a summary showing an 11 percent booking fee, a 233 dollar 10 cent deposit charged today, and 432 dollars 90 cents charged three days after the show"
          />
          <p className="proj-caption">
            Mockup of a booking from the venue&apos;s side. The sums follow the planned fee
            rules: a $600 set costs the venue $666 and pays the act $588.
          </p>
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
          Read from the project&apos;s planning record and fee constants as of 5 September
          2026. Every figure can still change before launch.
        </p>

        <div className="proj-hero-screenshot">
          <img
            loading="lazy"
            decoding="async"
            src={FanMock}
            alt="Mockup of two GateKeep phone screens: a Discover list of upcoming shows with dates, venues, distances and prices, and a ticket with a QR code, a door time, and an order of 15 dollars plus a 2 dollar 4 cent service fee"
          />
          <p className="proj-caption">
            Mockup of the fan&apos;s side. The QR code is a drawing and encodes nothing.
          </p>
        </div>

        <div className="proj-companion">
          <h2>Why the money is the hard part</h2>
          <p>
            A booking is two payments weeks apart, to a person who may be one of four in a
            band, from a venue whose card may decline on the second one. The plan gives each
            of those its own rule. Fees charged to a venue round up, shares paid to an act
            round down, and the remainder stays with the platform, all in whole cents. The
            fee rates are copied onto a booking the moment it is accepted, so changing them
            later never touches a deal already made.
          </p>
          <p>
            A declined second payment is retried over the following days. If it still
            fails, a one-time 10% late fee is added, most of which goes to the act, and the
            venue cannot send or accept another booking until it pays. Either side can
            cancel free for an hour after accepting. After that, a venue that cancels
            inside three days of the show forfeits its deposit to the act, and an act that
            cancels inside one day takes a mark on the reliability record venues see beside
            its rates. All of it has to be right before a stranger hands over a card.
          </p>
        </div>

        <div className="proj-about">
          <p>
            Where it stands: a first pass of all twelve parts was written between 24 August
            and 5 September 2026, and it passes its own tests against local emulators. That
            is a draft of the plan in code, and it is a long way from a product. It has not
            run on a real phone, taken a real card, or been deployed anywhere a stranger
            could reach.
          </p>
          <p>
            What stands between the draft and a launch is mostly not code. The checklist
            runs to 65 lines: a production project under a business account, Stripe set up
            under that business, a lawyer&apos;s read of the terms and privacy text, real
            concert photography, device builds for both app stores, and a door scanner that
            has never seen a real camera. The app does not have a logo yet either. Its icon
            is still the one the framework ships with.
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

export default GateKeep;
