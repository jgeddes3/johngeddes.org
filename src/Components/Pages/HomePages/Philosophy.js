import React from 'react';
import { Link } from 'react-router-dom'; 
import Background from '../../ForEveryPage/Background';
import Bottombar from '../../ForEveryPage/Bottombar';
import './Philosophy.css';
import Phil1 from './PhilosophyPage/Phil1';
import Phil2 from './PhilosophyPage/Phil2';
import Phil3 from './PhilosophyPage/Phil3';
import Phil4 from './PhilosophyPage/Phil4';
import Phil5 from './PhilosophyPage/Phil5';


const FriendsPage = () => {
  return (
    <>
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
            headerText="General Philosophy Catagory" 
            contentText="For General Philosophy Content." 
          />
          </Link>
        </div>
        <div className="Phil-item">
          <Link to="/phil2" className="Phil-button main-content">
          <Phil2 
            headerText="Neuro-Ethical Philosophy" 
            contentText="For all philosophy about the brain." 
          />
          </Link>
        </div>
        <div className="Phil-item">
          <Link to="/phil3" className="Phil-button main-content">
          <Phil3 
            headerText="Modern Philosophy" 
            contentText="For Philosophy involving tech" 
          />
          </Link>
        </div>
        <div className="Phil-item">
          <Link to="/phil4" className="Phil-button main-content">
          <Phil4 
            headerText="Political Philosophy" 
            contentText="For the rare event I write about politics" 
          />
          </Link>
        </div>
          <div className="Phil-item">
          <Link to="/phil5" className="Phil-button main-content">
          <Phil5 
            headerText="World Events" 
            contentText="For the similarly rare event like political philosophy I write about world events" 
          />
          </Link>
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

      <Bottombar />
    </>
  );
};

export default FriendsPage;