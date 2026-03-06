import React from 'react';
import Background from '../../ForEveryPage/Background';
import PageFooter from '../../ForEveryPage/PageFooter';
import SEO from '../../ForEveryPage/SEO';
import { Link } from 'react-router-dom';
import './ProjectTemplate.css';
import Logo from '../ProjectButtons/ProjectButtonImages/TourismApp.webp';

const ATourismApp = () => {
  return (
    <>
      <SEO
        title="A Tourism App"
        description="A Tourism App project by John Geddes — a travel and tourism application connecting travelers with local guides."
        path="/ATourismApp"
      />
      <Background />
      <div id="centerpiece2" className="main-content">
        <h1>A Tourism App</h1>
      </div>
      <div className="proj-page main-content">
        <div className="proj-hero">
          <img className="proj-stub-logo" src={Logo} alt="A Tourism App" />
          <p className="proj-hero-tagline">
            A one-stop shop for discovering and booking tours of famous areas around the world,
            powered by the people who know them best.
          </p>
        </div>

        <div className="proj-about">
          <h2 className="proj-section-heading">The Idea</h2>
          <p>
            The idea behind the Tourism App is simple: connect travelers directly with locals who can offer
            authentic, personal tours of their cities and landmarks. Instead of relying on large tour companies
            with cookie-cutter itineraries, users will be able to browse tours created and led by local guides
            who bring genuine knowledge and passion for the places they call home.
          </p>
          <p>
            Whether it's a walking tour through the historic streets of Dublin, a hidden-gem food crawl in
            Lisbon, or a sunset hike through a national park, the app will serve as a marketplace where locals
            can list their tours and travelers can discover, compare, and book them all in one place.
          </p>
        </div>

        <div className="proj-features">
          <div className="proj-feature-card">
            <h3>Local-Led Tours</h3>
            <p>
              Locals sign up as guides and create their own tour listings with descriptions, photos,
              pricing, and availability. Travelers get a genuine, insider experience rather than
              a generic tourist package.
            </p>
          </div>
          <div className="proj-feature-card">
            <h3>One-Stop Booking</h3>
            <p>
              Search by destination, browse available tours, read reviews, and book — all without
              leaving the app. No more juggling multiple websites and email threads to plan a trip.
            </p>
          </div>
          <div className="proj-feature-card">
            <h3>Discover Famous Areas</h3>
            <p>
              Curated collections of tours around the world's most iconic destinations make it easy
              to find something great whether you're visiting Paris, Tokyo, or your own backyard.
            </p>
          </div>
          <div className="proj-feature-card">
            <h3>Reviews and Trust</h3>
            <p>
              A ratings and review system helps travelers pick the best guides, and helps top-quality
              locals build a reputation and grow their business.
            </p>
          </div>
        </div>

        <div className="proj-about">
          <h2 className="proj-section-heading">Status</h2>
          <p>
            This project is currently in the concept and early design phase. Stay tuned for updates
            as development progresses.
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

export default ATourismApp;
