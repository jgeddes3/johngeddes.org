import React from 'react';
import Background from '../../ForEveryPage/Background';
import PageFooter from '../../ForEveryPage/PageFooter';
import { Link } from 'react-router-dom';
import '../MiscPages/AaMiscTemplates.css';
import Logo from '../ProjectButtons/ProjectButtonImages/Loyola.png';

const RamblerRegistrar = () => {
  return (
    <>
      <Background />
      <div id="centerpiece2" className='main-content'>
        <h1>Rambler Registrar</h1>
      </div>
      <div className="restaurant-container main-content">
        <div className="author-links">
          <p>
            Built by John Geddes |
            <a href="https://github.com/jgeddes3/RamblerRegistrar" target="_blank" rel="noopener noreferrer"> GitHub</a>
          </p>
        </div>
        <div className="MainPhoto-container">
          <img loading="lazy" decoding="async" src={Logo} alt="Rambler Registrar logo" />
          <p className="image-caption">Loyola University Chicago — Rambler Registrar</p>
        </div>
        <div className="paragraph-only-container">
          <p>
            Rambler Registrar is a student scheduling application designed to make the course registration process significantly easier.
            Built as a full-stack web application combining a Python backend with a JavaScript frontend, the project aims to simplify
            one of the most stressful parts of the academic experience — picking and scheduling classes.
          </p>
        </div>
        <div className="paragraph-only-container">
          <p>
            The application features a database backend written in Python that handles course data storage, retrieval, and processing.
            The JavaScript frontend provides the scheduling interface where students can browse available courses, view time slots,
            and build their ideal schedule without conflicts. The split architecture allows each layer to focus on what it does best —
            Python for data management and JavaScript for an interactive user experience.
          </p>
        </div>
        <div className="paragraph-only-container">
          <p>
            As an early-stage foundational project with 22 commits, Rambler Registrar represents the kind of practical problem-solving
            that drives good software development. Rather than accepting a clunky registration system, the goal was to build something
            better — a tool that students could actually use to plan their semesters more effectively.
          </p>
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

export default RamblerRegistrar;
