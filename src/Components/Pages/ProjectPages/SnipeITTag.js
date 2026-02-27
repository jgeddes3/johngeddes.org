import React from 'react';
import Background from '../../ForEveryPage/Background';
import PageFooter from '../../ForEveryPage/PageFooter';
import { Link } from 'react-router-dom';
import '../MiscPages/AaMiscTemplates.css';
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
      <div id="centerpiece2" className='main-content'>
        <h1>Snipe IT Tag</h1>
      </div>
      <div className="restaurant-container main-content">
        <div className="author-links">
          <p>
            Built by John Geddes
          </p>
        </div>
        <div className="MainPhoto-container">
          <img loading="lazy" decoding="async" src={Photo1} alt="Snipe IT Tag main interface" />
          <p className="image-caption">Snipe IT Tag — Full webpage overview</p>
        </div>
        <div className="paragraph-only-container">
          <p>
            Snipe IT Tag is a full-stack web application serving as a mobile-friendly interface for Snipe-IT asset management.
            Built for enterprise IT teams, it provides a streamlined way to track, manage, and control IT assets across multiple locations.
            The application brings the power of Snipe-IT's asset management system into an intuitive, responsive web portal that works
            seamlessly on both desktop and mobile devices.
          </p>
        </div>
        <div className="paragraph-photo-right-container">
          <div className="Seperator-photo-right">
            <p>
              The asset management system allows users to view, search, filter, check out, and check in assets with ease.
              With support for over 30 sortable and filterable properties, teams can quickly locate any piece of equipment
              across the organization. The advanced filtering system makes it simple to drill down into specific categories,
              locations, or assignment statuses.
            </p>
          </div>
          <div className="image-with-caption">
            <img loading="lazy" decoding="async" src={Photo4} alt="Asset management features" />
            <p className="image-caption">Asset management and filtering interface</p>
          </div>
        </div>
        <div className="paragraph-photo-left-container">
          <div className="Seperator-photo-left">
            <p>
              User and location management features allow administrators to track who has what equipment and where it is deployed.
              The system supports role-based access control, distinguishing between regular users and managers. Authentication is
              handled through Azure AD with single sign-on (SSO), ensuring secure and seamless access for enterprise environments.
            </p>
          </div>
          <div className="image-with-caption">
            <img loading="lazy" decoding="async" src={Photo5} alt="User management features" />
            <p className="image-caption">User and location management</p>
          </div>
        </div>
        <div className="MainPhoto-container">
          <img loading="lazy" decoding="async" src={Photo2} alt="Snipe IT Tag dashboard view" />
          <p className="image-caption">Dashboard and asset overview</p>
        </div>
        <div className="paragraph-photo-right-container">
          <div className="Seperator-photo-right">
            <p>
              Additional features include data export to Excel for reporting, a 5-minute caching layer for improved performance,
              and rate limiting to protect backend services. The application also includes a dark mode option for comfortable
              use in any environment.
            </p>
          </div>
          <div className="image-with-caption">
            <img loading="lazy" decoding="async" src={Photo6} alt="Data export and additional features" />
            <p className="image-caption">Data export and feature controls</p>
          </div>
        </div>
        <div className="paragraph-only-container">
          <p>
            The tech stack features React 19 with TypeScript and Vite on the frontend, styled with TailwindCSS for a clean,
            responsive design. The backend runs on Node.js with Express and TypeScript. Authentication is powered by Azure AD
            using MSAL and JWT tokens, providing enterprise-grade security throughout the application.
          </p>
        </div>
        <div className="MainPhoto-container">
          <img loading="lazy" decoding="async" src={Photo3} alt="Snipe IT Tag additional view" />
          <p className="image-caption">Additional interface views</p>
        </div>
        <div className="paragraph-photo-right-container">
          <div className="Seperator-photo-right">
            <p>
              The application was designed with scalability and maintainability in mind, utilizing TypeScript across the entire
              stack for type safety and developer experience. TailwindCSS enables rapid UI development while keeping the
              design consistent and responsive across all screen sizes.
            </p>
          </div>
          <div className="image-with-caption">
            <img loading="lazy" decoding="async" src={Photo7} alt="Feature detail view" />
            <p className="image-caption">Feature detail view</p>
          </div>
        </div>
      </div>
      <div className="misc-nav-buttons">
        <Link to="/projects" className="misc-nav-button misc-nav-misc">
          Projects Page
        </Link>
      </div>
      <PageFooter />
    </>
  );
};

export default SnipeITTag;
