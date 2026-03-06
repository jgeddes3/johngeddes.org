import React from 'react';
import Background from '../../ForEveryPage/Background';
import PageFooter from '../../ForEveryPage/PageFooter';
import SEO from '../../ForEveryPage/SEO';
import { Link } from 'react-router-dom';
import './ProjectTemplate.css';
import Logo from '../ProjectButtons/ProjectButtonImages/Creditlogo.png';

const ReactNativeCreditCardApp = () => {
  return (
    <>
      <SEO
        title="React Native Credit Card App"
        description="A credit card recommendation and financial education app — goal-based card matching, milestone tracking, and more."
        path="/ReactNativeCreditCardApp"
      />
      <Background />
      <div id="centerpiece2" className="main-content">
        <h1>React Native Credit Card App</h1>
      </div>
      <div className="proj-page main-content">
        <div className="proj-hero">
          <img className="proj-stub-logo" src={Logo} alt="React Native Credit Card App" />
          <p className="proj-hero-tagline">
            Smart credit card recommendations, financial education, and goal tracking — all in one app.
          </p>
        </div>

        <div className="proj-about">
          <h2 className="proj-section-heading">The Idea</h2>
          <p>
            Think of it as The Points Guy meets NerdWallet, but taken a step further. This app will
            recommend credit cards tailored to your spending habits and financial goals, just like those
            platforms do — but it won't stop there.
          </p>
          <p>
            Beyond recommendations, the app will offer built-in financial education, goal tracking, and
            milestone systems designed to actually get you where you want to go. Set a goal like
            "I want to travel more," and the app will map out a path: which cards to apply for, how to
            maximize sign-up bonuses, which rewards categories to target, and milestones to hit along the way.
            Whether your goal is travel, cash back, building credit, or earning premium perks, the app
            builds a personalized roadmap and keeps you on track.
          </p>
        </div>

        <div className="proj-features">
          <div className="proj-feature-card">
            <h3>Card Recommendations</h3>
            <p>
              Personalized credit card suggestions based on your spending patterns, credit score, and
              what you actually care about — not just generic "best cards" lists.
            </p>
          </div>
          <div className="proj-feature-card">
            <h3>Goal-Based Planning</h3>
            <p>
              Tell the app what you want — more travel, better cash back, premium lounge access — and
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
            This project is currently in the concept and early design phase. Stay tuned for updates
            as development progresses.
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
