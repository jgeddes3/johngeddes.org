import React, { useReducer, useEffect, useState, useRef, useCallback } from 'react';
import Background from '../../ForEveryPage/Background';
import PageFooter from '../../ForEveryPage/PageFooter';
import { Link, useParams, useNavigate } from 'react-router-dom';
import './ProjectTemplate.css';
import './ChessDeck.css';

import { gameReducer, createInitialState } from './ChessDeckGame/gameReducer';
import { WHITE, BLACK, PHASE_DRAW, PHASE_PROMOTION, PHASE_GAME_OVER } from './ChessDeckGame/constants';
import { createHost, joinGame, sendState, onReceiveState } from './ChessDeckGame/peerManager';

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
  const { peerId: urlPeerId } = useParams();
  const navigate = useNavigate();

  const [state, dispatch] = useReducer(gameReducer, null, createInitialState);
  const [myColor, setMyColor] = useState(null);
  const [connected, setConnected] = useState(false);
  const [disconnected, setDisconnected] = useState(false);
  const [error, setError] = useState(null);
  const [hostPeerId, setHostPeerId] = useState(null);

  const connRef = useRef(null);
  const peerRef = useRef(null);
  const stateRef = useRef(state);

  // Keep stateRef in sync
  useEffect(() => {
    stateRef.current = state;
  }, [state]);

  const noopDispatch = useCallback(() => {}, []);

  // Setup connection
  useEffect(() => {
    let cleaned = false;
    let peer = null;

    if (!urlPeerId) {
      // I'm the host — create a peer, wait for it to register, then redirect
      createHost(
        (conn) => {
          if (cleaned) return;
          connRef.current = conn;
          setConnected(true);
          setMyColor(WHITE);

          sendState(conn, stateRef.current);

          onReceiveState(conn, (newState) => {
            dispatch({ type: 'REPLACE_STATE', state: newState });
          });

          conn.on('close', () => {
            setDisconnected(true);
          });
        },
        (err) => {
          console.error('Host peer error:', err);
        }
      )
        .then(({ peer: hostPeer, peerId }) => {
          if (cleaned) {
            hostPeer.destroy();
            return;
          }
          peer = hostPeer;
          peerRef.current = peer;
          setHostPeerId(peerId);
          // Peer is registered on signaling server — safe to navigate
          navigate(`/ChessDeck/online/${peerId}`, { replace: true });
        })
        .catch((err) => {
          if (cleaned) return;
          console.error('Failed to create host:', err);
          setError('Failed to connect to server. Please try again.');
        });
    } else if (!hostPeerId) {
      // We're a joiner (no hostPeerId means we didn't create this game)
      setMyColor(BLACK);

      joinGame(urlPeerId)
        .then(({ peer: joinerPeer, conn }) => {
          if (cleaned) {
            joinerPeer.destroy();
            return;
          }
          peer = joinerPeer;
          peerRef.current = peer;
          connRef.current = conn;
          setConnected(true);

          onReceiveState(conn, (newState) => {
            dispatch({ type: 'REPLACE_STATE', state: newState });
          });

          conn.on('close', () => {
            setDisconnected(true);
          });
        })
        .catch((err) => {
          if (cleaned) return;
          console.error('Failed to join game:', err);
          setError('Could not connect to host — they may have left or the link expired.');
        });
    }
    // If hostPeerId is set and matches urlPeerId, we're the host waiting — do nothing.

    return () => {
      cleaned = true;
      if (peer) peer.destroy();
    };
  }, [urlPeerId, hostPeerId, navigate]);

  // Custom dispatch that enforces turn-based play and syncs state
  const onlineDispatch = useCallback((action) => {
    const currentState = stateRef.current;

    // Allow REMATCH from anyone
    if (action.type === 'REMATCH') {
      const newState = createInitialState();
      dispatch({ type: 'REPLACE_STATE', state: newState });
      if (connRef.current) sendState(connRef.current, newState);
      return;
    }

    // Only allow actions when it's my turn
    if (currentState.currentPlayer !== myColor && action.type !== 'REPLACE_STATE') {
      return;
    }

    const newState = gameReducer(currentState, action);
    dispatch({ type: 'REPLACE_STATE', state: newState });

    // Send updated state to peer
    if (connRef.current) {
      sendState(connRef.current, newState);
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

  const handleRetry = () => {
    setError(null);
    // For the host, go back to create a fresh game
    // For the joiner, retry the same link
    if (!urlPeerId || hostPeerId) {
      setHostPeerId(null);
      navigate('/ChessDeck/online', { replace: true });
    } else {
      // Force re-run of the effect by toggling a re-render
      setMyColor(null);
      navigate(`/ChessDeck/online/${urlPeerId}`, { replace: true });
    }
  };

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
            <button className="cd-action-btn" onClick={handleRetry} style={{ marginTop: '1rem' }}>
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
  if (urlPeerId && !connected && myColor === null) {
    const link = `${window.location.origin}/ChessDeck/online/${urlPeerId}`;
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
    const link = hostPeerId
      ? `${window.location.origin}/ChessDeck/online/${hostPeerId}`
      : '';

    return (
      <>
        <Background />
        <div id="centerpiece2" className="main-content">
          <h1>Chess Deck</h1>
        </div>
        <div className="cd-table-section">
          <div className="cd-table-bg" style={{ backgroundImage: `url(${TableBg})` }} />
          {hostPeerId ? (
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

export default ChessDeckOnline;
