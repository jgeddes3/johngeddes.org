import React, { useReducer, useEffect, useState, useRef, useCallback } from 'react';
import Background from '../../ForEveryPage/Background';
import PageFooter from '../../ForEveryPage/PageFooter';
import { Link, useParams, useNavigate } from 'react-router-dom';
import './ProjectTemplate.css';
import './ChessDeck.css';

import { gameReducer, createInitialState } from './ChessDeckGame/gameReducer';
import { WHITE, BLACK, PHASE_DRAW, PHASE_PROMOTION, PHASE_GAME_OVER } from './ChessDeckGame/constants';
import { createRoom, joinRoom } from './ChessDeckGame/firebaseRoom';

import Board from './ChessDeckGame/components/Board';
import GameInfo from './ChessDeckGame/components/GameInfo';
import TurnPhaseBar from './ChessDeckGame/components/TurnPhaseBar';
import CardHand from './ChessDeckGame/components/CardHand';
import OpponentHand from './ChessDeckGame/components/OpponentHand';
import CapturedPieces from './ChessDeckGame/components/CapturedPieces';
import PromotionModal from './ChessDeckGame/components/PromotionModal';
import GameOverModal from './ChessDeckGame/components/GameOverModal';
import WaitingRoom from './ChessDeckGame/components/WaitingRoom';

import TableBg from './ProjectPageImages/ChessDeck/ChessBackground2.webp';

const ChessDeckOnline = () => {
  const { peerId: roomId } = useParams();
  const navigate = useNavigate();

  const [state, dispatch] = useReducer(gameReducer, null, createInitialState);
  const [myColor, setMyColor] = useState(null);
  const [connected, setConnected] = useState(false);
  const [disconnected, setDisconnected] = useState(false);
  const [error, setError] = useState(null);
  const [hostRoomId, setHostRoomId] = useState(null);

  const sendRef = useRef(null);
  const cleanupRef = useRef(null);
  const stateRef = useRef(state);
  const ignoreNextUpdate = useRef(false);

  // Keep stateRef in sync
  useEffect(() => {
    stateRef.current = state;
  }, [state]);

  const noopDispatch = useCallback(() => {}, []);

  // Setup connection
  useEffect(() => {
    let cancelled = false;

    if (!roomId) {
      // I'm the host — create a room and redirect
      const { roomId: newRoomId, cleanup } = createRoom(
        (sendState, onReceiveState) => {
          if (cancelled) return;
          sendRef.current = sendState;
          cleanupRef.current = cleanup;
          setConnected(true);
          setMyColor(WHITE);

          // Send initial state to guest
          sendState(stateRef.current);

          onReceiveState((newState) => {
            if (ignoreNextUpdate.current) {
              ignoreNextUpdate.current = false;
              return;
            }
            // Restore modifiers arrays
            restoreModifiers(newState);
            dispatch({ type: 'REPLACE_STATE', state: newState });
          });
        },
        () => {
          if (!cancelled) setDisconnected(true);
        }
      );

      cleanupRef.current = cleanup;
      setHostRoomId(newRoomId);
      navigate(`/ChessDeck/online/${newRoomId}`, { replace: true });
    } else {
      // Check if we're the host coming back or a joiner
      if (hostRoomId === roomId) {
        return;
      }

      // We're a joiner
      setMyColor(BLACK);

      joinRoom(roomId)
        .then(({ sendState, onReceiveState, listenForHostLeave, cleanup }) => {
          if (cancelled) return;
          sendRef.current = sendState;
          cleanupRef.current = cleanup;
          setConnected(true);

          onReceiveState((newState) => {
            if (ignoreNextUpdate.current) {
              ignoreNextUpdate.current = false;
              return;
            }
            restoreModifiers(newState);
            dispatch({ type: 'REPLACE_STATE', state: newState });
          });

          listenForHostLeave(() => {
            if (!cancelled) setDisconnected(true);
          });
        })
        .catch((err) => {
          if (cancelled) return;
          console.error('Failed to join room:', err);
          setError('Could not connect — the host may have left or the link expired.');
        });
    }

    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (cleanupRef.current) cleanupRef.current();
    };
  }, []);

  // Custom dispatch that enforces turn-based play and syncs state
  const onlineDispatch = useCallback((action) => {
    const currentState = stateRef.current;

    // Allow REMATCH from anyone
    if (action.type === 'REMATCH') {
      const newState = createInitialState();
      dispatch({ type: 'REPLACE_STATE', state: newState });
      ignoreNextUpdate.current = true;
      if (sendRef.current) sendRef.current(newState);
      return;
    }

    // Only allow actions when it's my turn
    if (currentState.currentPlayer !== myColor && action.type !== 'REPLACE_STATE') {
      return;
    }

    const newState = gameReducer(currentState, action);
    dispatch({ type: 'REPLACE_STATE', state: newState });

    // Send updated state to opponent
    ignoreNextUpdate.current = true;
    if (sendRef.current) {
      sendRef.current(newState);
    }
  }, [myColor]);

  // Auto-draw when it's my turn and in draw phase
  useEffect(() => {
    if (!connected || !myColor) return;
    if (state.currentPlayer !== myColor) return;
    if (state.phase !== PHASE_DRAW) return;

    const hand = state.hands[myColor];
    if (hand.length >= 5) {
      onlineDispatch({ type: 'SKIP_DRAW' });
      return;
    }
    const timer = setTimeout(() => {
      onlineDispatch({ type: 'DRAW_CARD' });
    }, 400);
    return () => clearTimeout(timer);
  }, [state.phase, state.currentPlayer, state.hands, connected, myColor, onlineDispatch]);

  const isMyTurn = connected && state.currentPlayer === myColor;
  const activeDispatch = isMyTurn ? onlineDispatch : noopDispatch;

  // Error state
  if (error) {
    return (
      <>
        <Background />
        <div id="centerpiece2" className="main-content">
          <h1>Chess Deck</h1>
        </div>
        <div className="cd-table-section">
          <div className="cd-table-bg" style={{ backgroundImage: `url(${TableBg})` }} />
          <div className="cd-waiting-room">
            <div className="cd-waiting-status" style={{ color: '#ff6b6b' }}>{error}</div>
            <button
              className="cd-action-btn"
              onClick={() => window.location.href = '/ChessDeck/online'}
              style={{ marginTop: '1rem' }}
            >
              Try Again
            </button>
          </div>
        </div>
        <div className="proj-nav-buttons">
          <Link to="/ChessDeck" className="proj-nav-button">
            Back to Menu
          </Link>
        </div>
        <PageFooter />
      </>
    );
  }

  // Waiting room: host is waiting for opponent
  if (roomId && !connected && myColor === null) {
    const link = `${window.location.origin}/ChessDeck/online/${roomId}`;
    return (
      <>
        <Background />
        <div id="centerpiece2" className="main-content">
          <h1>Chess Deck</h1>
        </div>
        <div className="cd-table-section">
          <div className="cd-table-bg" style={{ backgroundImage: `url(${TableBg})` }} />
          <WaitingRoom link={link} />
        </div>
        <div className="proj-nav-buttons">
          <Link to="/ChessDeck" className="proj-nav-button">
            Back to Menu
          </Link>
        </div>
        <PageFooter />
      </>
    );
  }

  if (!connected) {
    const link = hostRoomId
      ? `${window.location.origin}/ChessDeck/online/${hostRoomId}`
      : '';

    return (
      <>
        <Background />
        <div id="centerpiece2" className="main-content">
          <h1>Chess Deck</h1>
        </div>
        <div className="cd-table-section">
          <div className="cd-table-bg" style={{ backgroundImage: `url(${TableBg})` }} />
          {hostRoomId ? (
            <WaitingRoom link={link} />
          ) : (
            <div className="cd-waiting-room">
              <div className="cd-waiting-spinner" />
              <div className="cd-waiting-status">Connecting...</div>
            </div>
          )}
        </div>
        <div className="proj-nav-buttons">
          <Link to="/ChessDeck" className="proj-nav-button">
            Back to Menu
          </Link>
        </div>
        <PageFooter />
      </>
    );
  }

  // Connected — render the game
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

          <div className="cd-online-color-indicator">
            You are playing as {myColor === WHITE ? 'White' : 'Black'}
            {!isMyTurn && state.phase !== PHASE_GAME_OVER && ' — Waiting for opponent...'}
          </div>

          {disconnected && (
            <div className="cd-online-disconnect">Opponent disconnected</div>
          )}

          <OpponentHand state={state} perspective={myColor} />

          <div className="cd-play-area">
            <CapturedPieces
              pieces={state.capturedPieces.black}
              label="Black's captures"
            />
            <Board
              state={state}
              dispatch={activeDispatch}
              perspective={myColor}
            />
            <CapturedPieces
              pieces={state.capturedPieces.white}
              label="White's captures"
            />
          </div>

          <CardHand
            state={state}
            dispatch={activeDispatch}
            perspective={myColor}
          />

          <div className="cd-actions">
            {state.activeCard && isMyTurn && (
              <button
                className="cd-action-btn cd-action-cancel"
                onClick={() => onlineDispatch({ type: 'CANCEL_CARD' })}
              >
                Cancel
              </button>
            )}
          </div>

          {state.phase === PHASE_PROMOTION && isMyTurn && (
            <PromotionModal color={state.currentPlayer} dispatch={onlineDispatch} />
          )}
          {state.phase === PHASE_GAME_OVER && state.gameResult && (
            <GameOverModal gameResult={state.gameResult} dispatch={onlineDispatch} />
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

function restoreModifiers(state) {
  if (state && state.board) {
    for (let r = 0; r < 8; r++) {
      for (let c = 0; c < 8; c++) {
        const piece = state.board[r][c];
        if (piece && !piece.modifiers) {
          piece.modifiers = [];
        }
      }
    }
  }
}

export default ChessDeckOnline;
