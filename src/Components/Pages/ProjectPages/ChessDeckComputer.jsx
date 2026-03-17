import React, { useReducer, useEffect, useCallback, useRef } from 'react';
import Background from '../../ForEveryPage/Background';
import PageFooter from '../../ForEveryPage/PageFooter';
import { Link } from 'react-router-dom';
import './ProjectTemplate.css';
import './ChessDeck.css';

import { gameReducer, createInitialState } from './ChessDeckGame/gameReducer';
import { WHITE, BLACK, PHASE_DRAW, PHASE_MOVE, PHASE_PROMOTION, PHASE_GAME_OVER } from './ChessDeckGame/constants';
import { chooseBestMove, chooseCardAction } from './ChessDeckGame/ai';
import { CARDS } from './ChessDeckGame/cardDefinitions';

import Board from './ChessDeckGame/components/Board';
import GameInfo from './ChessDeckGame/components/GameInfo';
import TurnPhaseBar from './ChessDeckGame/components/TurnPhaseBar';
import CardHand from './ChessDeckGame/components/CardHand';
import OpponentHand from './ChessDeckGame/components/OpponentHand';
import CapturedPieces from './ChessDeckGame/components/CapturedPieces';
import PromotionModal from './ChessDeckGame/components/PromotionModal';
import GameOverModal from './ChessDeckGame/components/GameOverModal';

import TableBg from './ProjectPageImages/ChessDeck/ChessBackground2.webp';

const ChessDeckComputer = () => {
  const [state, dispatch] = useReducer(gameReducer, null, createInitialState);
  const aiRunning = useRef(false);
  const stateRef = useRef(state);

  // Keep stateRef in sync so the async AI function always reads latest state
  useEffect(() => {
    stateRef.current = state;
  }, [state]);

  // Human plays the starting color; AI plays the other
  const humanColor = state.startingColor || WHITE;
  const aiColor = humanColor === WHITE ? BLACK : WHITE;
  const isAiTurn = state.currentPlayer === aiColor && state.phase !== PHASE_GAME_OVER;

  // No-op dispatch for when AI is thinking (disables user input)
  const noopDispatch = useCallback(() => {}, []);

  // Auto-draw for human player
  useEffect(() => {
    if (state.phase === PHASE_DRAW && state.currentPlayer === humanColor) {
      const hand = state.hands[humanColor];
      if (hand.length >= 5) {
        dispatch({ type: 'SKIP_DRAW' });
        return;
      }
      const timer = setTimeout(() => {
        dispatch({ type: 'DRAW_CARD' });
      }, 400);
      return () => clearTimeout(timer);
    }
  }, [state.phase, state.currentPlayer, state.hands, humanColor]);

  // AI draw phase
  useEffect(() => {
    if (state.currentPlayer !== aiColor || state.phase !== PHASE_DRAW) return;
    const hand = state.hands[aiColor];
    if (hand.length >= 5) {
      dispatch({ type: 'SKIP_DRAW' });
      return;
    }
    const timer = setTimeout(() => {
      dispatch({ type: 'DRAW_CARD' });
    }, 600);
    return () => clearTimeout(timer);
  }, [state.phase, state.currentPlayer, state.hands, aiColor]);

  // AI move phase — async chain that reads latest state via stateRef
  useEffect(() => {
    if (state.currentPlayer !== aiColor || state.phase !== PHASE_MOVE) return;
    if (aiRunning.current) return;

    aiRunning.current = true;
    let aborted = false;

    const runAiTurn = async () => {
      try {
        await delay(400);
        if (aborted) return;

        // Read latest state for card decision
        let currentState = stateRef.current;

        // Try to play a card
        const cardAction = chooseCardAction(currentState);
        if (cardAction) {
          const card = CARDS[cardAction.cardId];

          if (card.targetType === 'none') {
            dispatch({ type: 'SELECT_CARD', cardId: cardAction.cardId, handIndex: cardAction.handIndex });
            await delay(600);
            if (aborted) return;
          } else if (cardAction.targets.length > 0) {
            dispatch({ type: 'SELECT_CARD', cardId: cardAction.cardId, handIndex: cardAction.handIndex });
            await delay(400);
            if (aborted) return;

            for (const target of cardAction.targets) {
              dispatch({ type: 'SELECT_CARD_TARGET', target });
              await delay(400);
              if (aborted) return;
            }
          }

          // If the card replaces the move, the turn has ended
          if (card.replacesMove) {
            return;
          }

          await delay(400);
          if (aborted) return;
        }

        // Re-read latest state after card effects have been applied
        currentState = stateRef.current;

        // If card targeting got stuck (invalid target left activeCard set), cancel it
        if (currentState.activeCard) {
          dispatch({ type: 'CANCEL_CARD' });
          await delay(200);
          if (aborted) return;
          currentState = stateRef.current;
        }

        // Verify it's still our turn in PHASE_MOVE (card may have ended the turn)
        if (currentState.currentPlayer !== aiColor || currentState.phase !== PHASE_MOVE) {
          return;
        }

        // Make a move using the latest state
        const bestMove = chooseBestMove(currentState);
        if (bestMove) {
          dispatch({ type: 'SELECT_PIECE', row: bestMove.from.row, col: bestMove.from.col });
          await delay(500);
          if (aborted) return;

          dispatch({ type: 'MAKE_MOVE', row: bestMove.to.row, col: bestMove.to.col });
        }
      } finally {
        aiRunning.current = false;
      }
    };

    runAiTurn();

    // Only abort on unmount, not on state changes from the AI's own dispatches
    return () => { aborted = true; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.currentPlayer, state.phase, aiColor]);

  // AI promotion phase
  useEffect(() => {
    if (state.currentPlayer !== aiColor || state.phase !== PHASE_PROMOTION) return;
    const timer = setTimeout(() => {
      dispatch({ type: 'CHOOSE_PROMOTION', pieceType: 'queen' });
    }, 500);
    return () => clearTimeout(timer);
  }, [state.phase, state.currentPlayer]);

  return (
    <>
      <Background />
      <div id="centerpiece2" className="main-content">
        <h1>Chess Deck</h1>
      </div>
      <div className="cd-table-section">
        <div className="cd-table-bg" style={{ backgroundImage: `url(${TableBg})` }} />
        <div className="cd-game-container">
          <GameInfo state={state} />
          <TurnPhaseBar phase={state.phase} />

          {isAiTurn && <div className="cd-ai-thinking">Computer is thinking...</div>}

          <OpponentHand state={state} perspective={humanColor} />

          <div className="cd-play-area">
            <CapturedPieces
              pieces={state.capturedPieces[aiColor]}
              label={`${aiColor === 'white' ? 'White' : 'Black'}'s captures`}
            />
            <Board
              state={state}
              dispatch={isAiTurn ? noopDispatch : dispatch}
              perspective={humanColor}
            />
            <CapturedPieces
              pieces={state.capturedPieces[humanColor]}
              label={`${humanColor === 'white' ? 'White' : 'Black'}'s captures`}
            />
          </div>

          <CardHand
            state={state}
            dispatch={isAiTurn ? noopDispatch : dispatch}
            perspective={humanColor}
          />

          <div className="cd-actions">
            {state.activeCard && !isAiTurn && (
              <button
                className="cd-action-btn cd-action-cancel"
                onClick={() => dispatch({ type: 'CANCEL_CARD' })}
              >
                Cancel
              </button>
            )}
          </div>

          {state.phase === PHASE_PROMOTION && state.currentPlayer === humanColor && (
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

function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

export default ChessDeckComputer;
