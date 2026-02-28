import React from 'react';
import Background from '../../ForEveryPage/Background';
import PageFooter from '../../ForEveryPage/PageFooter';
import { Link } from 'react-router-dom';
import './ProjectTemplate.css';
import Logo from '../ProjectButtons/ProjectButtonImages/Loyola.png';

const RamblerRegistrar = () => {
  return (
    <>
      <Background />
      <div id="centerpiece2" className="main-content">
        <h1>Rambler Registrar</h1>
      </div>
      <div className="proj-page main-content">
        <div className="proj-hero">
          <p className="proj-hero-tagline">
            A student scheduling application to simplify course registration
          </p>
          <div className="proj-tech-pills">
            <span className="proj-pill">Python</span>
            <span className="proj-pill">JavaScript</span>
            <span className="proj-pill">Database Backend</span>
          </div>
          <div className="proj-actions">
            <a href="https://github.com/jgeddes3/RamblerRegistrar" target="_blank" rel="noopener noreferrer" className="proj-action-link">
              GitHub
            </a>
          </div>
        </div>

        <div className="proj-hero-screenshot" style={{ textAlign: 'center' }}>
          <img loading="lazy" decoding="async" src={Logo} alt="Rambler Registrar logo" style={{ maxWidth: '280px', width: '100%' }} />
        </div>

        <div className="proj-about">
          <p>
            Rambler Registrar is a student scheduling application designed to make the course registration process significantly easier.
            Built as a full-stack web application combining a Python backend with a JavaScript frontend, the project aims to simplify
            one of the most stressful parts of the academic experience — picking and scheduling classes.
          </p>
          <p>
            The application features a database backend written in Python that handles course data storage, retrieval, and processing.
            The JavaScript frontend provides the scheduling interface where students can browse available courses, view time slots,
            and build their ideal schedule without conflicts. The split architecture allows each layer to focus on what it does best —
            Python for data management and JavaScript for an interactive user experience.
          </p>
          <p>
            As an early-stage foundational project with 22 commits, Rambler Registrar represents the kind of practical problem-solving
            that drives good software development. Rather than accepting a clunky registration system, the goal was to build something
            better — a tool that students could actually use to plan their semesters more effectively.
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

export default RamblerRegistrar;
