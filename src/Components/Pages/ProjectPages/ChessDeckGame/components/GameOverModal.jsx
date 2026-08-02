import React from 'react';
import { useNavigate } from 'react-router-dom';

const GameOverModal = ({ gameResult, dispatch }) => {
  const navigate = useNavigate();
  const { winner, reason } = gameResult;

  // Every ending needs its own line. This used to be two named cases and an
  // `else` that said "Stalemate", so a resignation — and each of the three draw
  // rules — announced a stalemate that had not happened.
  const side = winner === 'white' ? 'White' : 'Black';
  const ENDINGS = {
    checkmate: ['Checkmate!', `${side} wins`],
    king_captured: ['King Captured!', `${side} wins`],
    resignation: ['Resignation', `${side} wins`],
    stalemate: ['Stalemate', 'The game is a draw'],
    'insufficient material': ['Draw', 'Neither side has enough material to force mate'],
    'fifty-move rule': ['Draw', 'Fifty moves with no capture and no pawn move'],
    'threefold repetition': ['Draw', 'The same position has occurred three times'],
  };
  const [title, subtitle] = ENDINGS[reason] || ['Game over', winner ? `${side} wins` : 'The game is a draw'];

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
            onClick={() => navigate('/ChessDeck/play')}
          >
            Back to Menu
          </button>
        </div>
      </div>
    </div>
  );
};

export default GameOverModal;
