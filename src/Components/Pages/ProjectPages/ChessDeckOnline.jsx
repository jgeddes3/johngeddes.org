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
    let peer;
    let cleaned = false;

    if (!urlPeerId) {
      // I'm the host — create a peer and redirect to the URL with my peer ID
      const { peer: hostPeer, peerId } = createHost(
        (conn) => {
          if (cleaned) return;
          connRef.current = conn;
          setConnected(true);
          setMyColor(WHITE);

          // Send initial state to joiner
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
      );

      peer = hostPeer;
      peerRef.current = peer;
      setHostPeerId(peerId);

      // Redirect to URL with peer ID
      navigate(`/ChessDeck/online/${peerId}`, { replace: true });
    } else {
      // Check if we're the host coming back or a joiner
      // If hostPeerId matches urlPeerId, we're the host waiting for connection
      // Otherwise, we're a joiner
      if (hostPeerId === urlPeerId) {
        // We're the host — already set up, just wait
        return;
      }

      // We're a joiner
      setMyColor(BLACK);

      joinGame(urlPeerId)
        .then(({ peer: joinerPeer, conn }) => {
          if (cleaned) return;
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
          console.error('Failed to join game:', err);
        });
    }

    return () => {
      cleaned = true;
      if (peer) peer.destroy();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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

  // Waiting room: host is waiting for opponent
  if (urlPeerId && !connected && myColor === null) {
    // Still loading/connecting...
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
    // Joiner is connecting or host is waiting
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
