import React from 'react';

const GameInfo = ({ state }) => {
  const { currentPlayer, message } = state;

  // Whose turn it is and what just happened are the two things the game tells
  // you, and both were purely visual — a coloured dot and a line of gold text.
  // aria-live announces them instead of leaving a screen reader to guess why
  // nothing responds. "polite" so it waits its turn rather than interrupting.
  return (
    <div className="cd-game-info">
      <div className="cd-turn-indicator" aria-live="polite">
        <span className={`cd-turn-dot cd-turn-dot-${currentPlayer}`} aria-hidden="true" />
        <span className="cd-turn-text">
          {currentPlayer === 'white' ? 'White' : 'Black'}&apos;s Turn
        </span>
      </div>
      <div className="cd-message" role="status" aria-live="polite">{message || ''}</div>
    </div>
  );
};

export default GameInfo;
