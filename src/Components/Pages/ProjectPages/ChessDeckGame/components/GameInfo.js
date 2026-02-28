import React from 'react';

const GameInfo = ({ state }) => {
  const { currentPlayer, message } = state;

  return (
    <div className="cd-game-info">
      <div className="cd-turn-indicator">
        <span className={`cd-turn-dot cd-turn-dot-${currentPlayer}`} />
        <span className="cd-turn-text">
          {currentPlayer === 'white' ? 'White' : 'Black'}&apos;s Turn
        </span>
      </div>
      {message && <div className="cd-message">{message}</div>}
    </div>
  );
};

export default GameInfo;
