import React from 'react';
import { PHASE_MOVE, PHASE_GAME_OVER } from '../constants.js';

// Resign only.
//
// There is deliberately no Pass button. A turn must always cost you a move —
// letting a player skip one would change the game, not just the interface. The
// stuck-turn problem a Pass button was covering for is handled in the reducer
// instead: a player with no legal move is, by definition, checkmated or
// stalemated, so the reducer settles the game rather than waiting for a click.
const GameControls = ({ state, dispatch }) => {
  if (state.phase === PHASE_GAME_OVER) return null;

  return (
    <div className="cd-controls">
      <button
        type="button"
        className="cd-control-button cd-control-danger"
        onClick={() => dispatch({ type: 'RESIGN' })}
      >
        Resign
      </button>
    </div>
  );
};

export default GameControls;
