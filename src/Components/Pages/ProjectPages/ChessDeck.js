import React, { useReducer, useEffect } from 'react';
import Background from '../../ForEveryPage/Background';
import PageFooter from '../../ForEveryPage/PageFooter';
import SEO from '../../ForEveryPage/SEO';
import { Link } from 'react-router-dom';
import './ProjectTemplate.css';
import './ChessDeck.css';

import { gameReducer, createInitialState } from './ChessDeckGame/gameReducer';
import { PHASE_DRAW, PHASE_PROMOTION, PHASE_GAME_OVER } from './ChessDeckGame/constants';

import Board from './ChessDeckGame/components/Board';
import GameInfo from './ChessDeckGame/components/GameInfo';
import TurnPhaseBar from './ChessDeckGame/components/TurnPhaseBar';
import CardHand from './ChessDeckGame/components/CardHand';
import OpponentHand from './ChessDeckGame/components/OpponentHand';
import CapturedPieces from './ChessDeckGame/components/CapturedPieces';
import PromotionModal from './ChessDeckGame/components/PromotionModal';
import GameOverModal from './ChessDeckGame/components/GameOverModal';

import TableBg from './ProjectPageImages/ChessDeck/ChessBackground2.png';

const ChessDeck = () => {
  const [state, dispatch] = useReducer(gameReducer, null, createInitialState);

  // Auto-draw card when entering draw phase
  useEffect(() => {
    if (state.phase === PHASE_DRAW) {
      const hand = state.hands[state.currentPlayer];
      if (hand.length >= 5) {
        dispatch({ type: 'SKIP_DRAW' });
        return;
      }
      const timer = setTimeout(() => {
        dispatch({ type: 'DRAW_CARD' });
      }, 400);
      return () => clearTimeout(timer);
    }
  }, [state.phase, state.currentPlayer, state.hands]);

  return (
    <>
      <SEO
        title="Chess Deck — Local Play"
        description="Chess Deck local multiplayer — a card-based chess game by John Geddes. Play with a friend on the same device."
        path="/ChessDeck/local"
      />
      <Background />
      <div id="centerpiece2" className="main-content">
        <h1>Chess Deck</h1>
      </div>
      <div className="cd-table-section">
        <div className="cd-table-bg" style={{ backgroundImage: `url(${TableBg})` }} />
        <div className="cd-game-container">
          <GameInfo state={state} />
          <TurnPhaseBar phase={state.phase} />

          <OpponentHand state={state} />

          <div className="cd-play-area">
            <CapturedPieces
              pieces={state.capturedPieces.black}
              label="Black's captures"
            />
            <Board state={state} dispatch={dispatch} />
            <CapturedPieces
              pieces={state.capturedPieces.white}
              label="White's captures"
            />
          </div>

          <CardHand state={state} dispatch={dispatch} />

          <div className="cd-actions">
            {state.activeCard && (
              <button
                className="cd-action-btn cd-action-cancel"
                onClick={() => dispatch({ type: 'CANCEL_CARD' })}
              >
                Cancel
              </button>
            )}
          </div>

          {state.phase === PHASE_PROMOTION && (
            <PromotionModal color={state.currentPlayer} dispatch={dispatch} />
          )}
          {state.phase === PHASE_GAME_OVER && state.gameResult && (
            <GameOverModal gameResult={state.gameResult} dispatch={dispatch} />
          )}
        </div>
      </div>

      <div className="proj-nav-buttons">
        <Link to="/ChessDeck" className="proj-nav-button">
          Back to Menu
        </Link>
        <Link to="/projects" className="proj-nav-button">
          Projects Page
        </Link>
      </div>
      <PageFooter />
    </>
  );
};

export default ChessDeck;
