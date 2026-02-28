import React from 'react';
import Background from '../../ForEveryPage/Background';
import PageFooter from '../../ForEveryPage/PageFooter';
import { Link } from 'react-router-dom';
import './ProjectTemplate.css';
import Photo1 from './ProjectPageImages/SnipeIT/SnipeITPhoto1.png';
import Photo2 from './ProjectPageImages/SnipeIT/SnipeITPhoto2.png';
import Photo3 from './ProjectPageImages/SnipeIT/SnipeITPhoto3.png';
import Photo4 from './ProjectPageImages/SnipeIT/SnipeITPhoto4.png';
import Photo5 from './ProjectPageImages/SnipeIT/SnipeITPhoto5.png';
import Photo6 from './ProjectPageImages/SnipeIT/SnipeITPhoto6.png';
import Photo7 from './ProjectPageImages/SnipeIT/SnipeITPhoto7.png';

const SnipeITTag = () => {
  return (
    <>
      <Background />
      <div id="centerpiece2" className="main-content">
        <h1>Snipe IT Tag</h1>
      </div>
      <div className="proj-page main-content">
        <div className="proj-hero">
          <p className="proj-hero-tagline">
            A mobile-friendly web interface for enterprise IT asset management
          </p>
          <div className="proj-tech-pills">
            <span className="proj-pill">React 19</span>
            <span className="proj-pill">TypeScript</span>
            <span className="proj-pill">Vite</span>
            <span className="proj-pill">TailwindCSS</span>
            <span className="proj-pill">Node.js</span>
            <span className="proj-pill">Express</span>
            <span className="proj-pill">Azure AD</span>
            <span className="proj-pill">JWT</span>
          </div>
        </div>

        <div className="proj-hero-screenshot">
          <img loading="lazy" decoding="async" src={Photo1} alt="Snipe IT Tag main interface" />
        </div>

        <div className="proj-about">
          <p>
            Snipe IT Tag is a full-stack web application serving as a mobile-friendly interface for Snipe-IT asset management.
            Built for enterprise IT teams, it provides a streamlined way to track, manage, and control IT assets across multiple locations.
            The application brings the power of Snipe-IT's asset management system into an intuitive, responsive web portal that works
            seamlessly on both desktop and mobile devices.
          </p>
        </div>

        <div className="proj-features">
          <div className="proj-feature-card">
            <div className="proj-feature-icon">📦</div>
            <h3>Asset Management</h3>
            <p>
              View, search, filter, check out, and check in assets with ease. Over 30 sortable and filterable
              properties let teams quickly locate any piece of equipment across the organization.
            </p>
          </div>
          <div className="proj-feature-card">
            <div className="proj-feature-icon">👥</div>
            <h3>User & Location Control</h3>
            <p>
              Track who has what equipment and where it is deployed. Role-based access control with Azure AD
              single sign-on ensures secure and seamless access for enterprise environments.
            </p>
          </div>
          <div className="proj-feature-card">
            <div className="proj-feature-icon">📊</div>
            <h3>Data Export</h3>
            <p>
              Export data to Excel for reporting, with a 5-minute caching layer for improved performance
              and rate limiting to protect backend services.
            </p>
          </div>
          <div className="proj-feature-card">
            <div className="proj-feature-icon">🏗️</div>
            <h3>Scalable Architecture</h3>
            <p>
              TypeScript across the entire stack for type safety. TailwindCSS enables rapid UI development
              while keeping the design consistent and responsive across all screen sizes.
            </p>
          </div>
        </div>

        <div className="proj-screenshot">
          <img loading="lazy" decoding="async" src={Photo2} alt="Dashboard and asset overview" />
        </div>

        <div className="proj-screenshot-grid">
          <img loading="lazy" decoding="async" src={Photo4} alt="Asset management and filtering interface" />
          <img loading="lazy" decoding="async" src={Photo5} alt="User and location management" />
          <img loading="lazy" decoding="async" src={Photo6} alt="Data export and feature controls" />
          <img loading="lazy" decoding="async" src={Photo7} alt="Feature detail view" />
        </div>

        <div className="proj-screenshot">
          <img loading="lazy" decoding="async" src={Photo3} alt="Additional interface views" />
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

export default SnipeITTag;
