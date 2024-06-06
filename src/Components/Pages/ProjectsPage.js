import React from 'react';
import Background from '../ForEveryPage/Background';
import Bottombar from '../ForEveryPage/Bottombar';
import { Link } from 'react-router-dom';
import './ProjectsPage.css';

import Project1 from '../ProjectButtons/Project1';
import Project2 from '../ProjectButtons/Project2';
import Project3 from '../ProjectButtons/Project3';
import Project4 from '../ProjectButtons/Project4';
import Project5 from '../ProjectButtons/Project5';
import Project6 from '../ProjectButtons/Project6';
import Project7 from '../ProjectButtons/Project7';
import Project8 from '../ProjectButtons/Project8';
import Project9 from '../ProjectButtons/Project9';

const ProjectsPage = () => {
  return (
    <>
      <Background />
      <div id="centerpiece2" className='main-content'>
        <h1>Projects.</h1>
        <p className="projects-description">This is where you can find all my amazing projects. Stay tuned for more updates!</p>
      </div>
      <div className="projects-container main-content">
        <Link to="/project1" className="project-button">
          <Project1 />
        </Link>
        <Link to="/project2" className="project-button">
          <Project2 />
        </Link>
        <Link to="/project3" className="project-button-long">
          <Project3 />
        </Link>
        <Link to="/project4" className="project-button">
          <Project4 />
        </Link>
        <Link to="/project5" className="project-button-long">
          <Project5 />
        </Link>
        <Link to="/project6" className="project-button-long">
          <Project6 />
        </Link>
        <Link to="/project7" className="project-button">
          <Project7 />
        </Link>
        <Link to="/project8" className="project-button">
          <Project8 />
        </Link>
        <Link to="/project9" className="project-button">
          <Project9 />
        </Link>
      </div>
      <Bottombar />
    </>
  );
};

export default ProjectsPage;
