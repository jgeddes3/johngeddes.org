import React from 'react';
import { useNavigate } from 'react-router-dom';

const GameOverModal = ({ gameResult, dispatch }) => {
  const navigate = useNavigate();
  const { winner, reason } = gameResult;

  let title, subtitle;
  if (reason === 'checkmate') {
    title = 'Checkmate!';
    subtitle = `${winner === 'white' ? 'White' : 'Black'} wins`;
  } else if (reason === 'king_captured') {
    title = 'King Captured!';
    subtitle = `${winner === 'white' ? 'White' : 'Black'} wins`;
  } else {
    title = 'Stalemate';
    subtitle = 'The game is a draw';
  }

  return (
    <div className="cd-modal-overlay">
      <div className="cd-modal">
        <h2 className="cd-modal-title">{title}</h2>
        <p className="cd-modal-subtitle">{subtitle}</p>
        <div className="cd-modal-buttons">
          <button
            className="cd-modal-button"
            onClick={() => dispatch({ type: 'REMATCH' })}
          >
            Rematch
          </button>
          <button
            className="cd-modal-button"
            onClick={() => navigate('/ChessDeck')}
          >
            Back to Menu
          </button>
        </div>
      </div>
    </div>
  );
};

export default GameOverModal;
