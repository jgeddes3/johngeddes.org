import React from 'react';

const GameOverModal = ({ gameResult, dispatch }) => {
  const { winner, reason } = gameResult;

  let title, subtitle;
  if (reason === 'checkmate') {
    title = 'Checkmate!';
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
        <button
          className="cd-modal-button"
          onClick={() => dispatch({ type: 'REMATCH' })}
        >
          Rematch
        </button>
      </div>
    </div>
  );
};

export default GameOverModal;
