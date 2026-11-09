import React from 'react';
import Background from '../../ForEveryPage/Background';
import PageFooter from '../../ForEveryPage/PageFooter';
import SEO from '../../ForEveryPage/SEO';
import { Link } from 'react-router-dom';
import './ProjectTemplate.css';
import Logo from '../ProjectButtons/ProjectButtonImages/Creditlogo.webp';

const ReactNativeCreditCardApp = () => {
  return (
    <>
      <SEO path="/ReactNativeCreditCardApp" />
      <Background />
      <div id="centerpiece2" className="main-content">
        <h1>React Native Credit Card App</h1>
      </div>
      <div className="proj-page main-content">
        <div className="proj-hero">
          <img className="proj-stub-logo" src={Logo} alt="React Native Credit Card App" />
          <p className="proj-hero-tagline">
            Credit card recommendations, financial education, and goal tracking in one app.
          </p>
          <p className="proj-status">
            A concept, not a build. Nothing is written yet; this is the shape the app would take.
          </p>
        </div>

        <div className="proj-about">
          <h2 className="proj-section-heading">The Idea</h2>
          <p>
            The Points Guy and NerdWallet recommend cards. This app would do that, matched to your
            spending habits and financial goals, and then keep going.
          </p>
          <p>
            Beyond recommendations, the app will offer built-in financial education, goal tracking, and
            milestone systems designed to actually get you where you want to go. Set a goal like
            "I want to travel more," and the app will map out a path: which cards to apply for, how to
            maximize sign-up bonuses, which rewards categories to target, and milestones to hit along the way.
            Travel, cash back, building credit, premium perks: the app builds the plan for whichever
            you pick and tracks it.
          </p>
        </div>

        <div className="proj-features">
          <div className="proj-feature-card">
            <h3>Card Recommendations</h3>
            <p>
              Personalized credit card suggestions based on your spending patterns, credit score, and
              what you actually care about, rather than a generic best-cards list.
            </p>
          </div>
          <div className="proj-feature-card">
            <h3>Goal-Based Planning</h3>
            <p>
              Tell the app what you want (more travel, better cash back, premium lounge access) and
              it will recommend the right cards and strategy to get you there.
            </p>
          </div>
          <div className="proj-feature-card">
            <h3>Financial Education</h3>
            <p>
              Learn how credit scores work, understand APR and annual fees, and make informed decisions.
              The app teaches you the "why" behind every recommendation.
            </p>
          </div>
          <div className="proj-feature-card">
            <h3>Milestones and Tracking</h3>
            <p>
              Track your progress toward sign-up bonuses, reward thresholds, and long-term goals with
              clear milestones that keep you motivated and on course.
            </p>
          </div>
        </div>

        <div className="proj-about">
          <h2 className="proj-section-heading">Status</h2>
          <p>
            Concept and early design only. Nothing has been built.
          </p>
        </div>
      </div>

      <div className="proj-nav-buttons">
        <Link to="/projects" className="proj-nav-button proj-nav-button-blue">
          Projects Page
        </Link>
      </div>
      <PageFooter />
    </>
  );
};

export default ReactNativeCreditCardApp;
