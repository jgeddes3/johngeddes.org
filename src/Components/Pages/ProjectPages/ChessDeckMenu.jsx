import React from 'react';
import Background from '../../ForEveryPage/Background';
import PageFooter from '../../ForEveryPage/PageFooter';
import SEO from '../../ForEveryPage/SEO';
import { Link, useNavigate } from 'react-router-dom';
import './ProjectTemplate.css';
import './ChessDeck.css';

import TableBg from './ProjectPageImages/ChessDeck/ChessBackground2.webp';

const ChessDeckMenu = () => {
  const navigate = useNavigate();

  return (
    <>
      <SEO
        title="Chess Deck"
        description="Chess Deck — a chess card game. Play pass-and-play, challenge the AI, or play online with a friend."
        path="/ChessDeck"
      />
      <Background />
      <div id="centerpiece2" className="main-content">
        <h1>Chess Deck</h1>
      </div>
      <div className="cd-table-section">
        <div className="cd-table-bg" style={{ backgroundImage: `url(${TableBg})` }} />
        <div className="cd-menu-container">
          <button
            className="cd-menu-button"
            onClick={() => navigate('/ChessDeck/local')}
          >
            <span className="cd-menu-button-icon">&#9823;</span>
            <span className="cd-menu-button-title">Pass and Play</span>
            <span className="cd-menu-button-desc">Two players, one device</span>
          </button>
          <button
            className="cd-menu-button"
            onClick={() => navigate('/ChessDeck/computer')}
          >
            <span className="cd-menu-button-icon">&#9812;</span>
            <span className="cd-menu-button-title">Play a Computer</span>
            <span className="cd-menu-button-desc">Challenge the AI</span>
          </button>
          <button
            className="cd-menu-button"
            onClick={() => navigate('/ChessDeck/online')}
          >
            <span className="cd-menu-button-icon">&#9816;</span>
            <span className="cd-menu-button-title">Send a Link</span>
            <span className="cd-menu-button-desc">Play online with a friend</span>
          </button>
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

export default ChessDeckMenu;
