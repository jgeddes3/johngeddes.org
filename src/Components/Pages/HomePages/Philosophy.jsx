import React from 'react';
import { Link } from 'react-router-dom';
import Background from '../../ForEveryPage/Background';
import PageFooter from '../../ForEveryPage/PageFooter';
import SEO from '../../ForEveryPage/SEO';
import './Philosophy.css';
import Phil1 from './PhilosophyPage/Phil1';
import Phil2 from './PhilosophyPage/Phil2';
import Phil3 from './PhilosophyPage/Phil3';
import Phil4 from './PhilosophyPage/Phil4';
import Phil5 from './PhilosophyPage/Phil5';


const FriendsPage = () => {
  return (
    <>
      <SEO
        title="Philosophy"
        description="Explore John Geddes' philosophy writings covering general, neuro-ethical, modern, political philosophy, and world events."
        path="/philosophy"
      />
     <Background />
      <div id="centerpiece2" className='main-content'>
        <h1>Philosophy</h1>
      </div>
      <div className="projects-description-container">
      <p className="projects-description main-content">
          In Progress, as all of life is.
        </p>
      </div>

      <div className="Philcontent-container">
        <div className="Phil-item">
          
          <Link to="/phil1" className="Phil-button main-content">
          <Phil1
            headerText="General Philosophy"
            contentText="Open now — the first essays land here."
          />
          </Link>
        </div>
        {/* These categories have no pages yet — rendered as non-links until routes exist,
            so visitors don't dead-end on the 404 page. Restore <Link to="/philN"> when adding each page. */}
        <div className="Phil-item">
          <div className="Phil-button main-content" aria-disabled="true">
          <Phil2
            headerText="Neuro-Ethical Philosophy"
            contentText="For all philosophy about the brain. Coming soon."
          />
          </div>
        </div>
        <div className="Phil-item">
          <div className="Phil-button main-content" aria-disabled="true">
          <Phil3
            headerText="Modern Philosophy"
            contentText="For Philosophy involving tech. Coming soon."
          />
          </div>
        </div>
        <div className="Phil-item">
          <div className="Phil-button main-content" aria-disabled="true">
          <Phil4
            headerText="Political Philosophy"
            contentText="For the rare event I write about politics. Coming soon."
          />
          </div>
        </div>
          <div className="Phil-item">
          <div className="Phil-button main-content" aria-disabled="true">
          <Phil5
            headerText="World Events"
            contentText="For the similarly rare event like political philosophy I write about world events. Coming soon."
          />
          </div>
        </div>
        </div>
      
        <div className="bottom-buttons-container">
        <Link to="/friends" className="friends1-nav-button">
          Friends Page
        </Link>
        <Link to="/social" className="social-nav-button">
          Social Page
        </Link>

      </div>

      <PageFooter />
    </>
  );
};

export default FriendsPage;