import React from 'react';
import { PHASE_DRAW, PHASE_MOVE, PHASE_GAME_OVER } from '../constants';

const PHASES = [
  { key: PHASE_DRAW, label: 'Draw' },
  { key: PHASE_MOVE, label: 'Move' },
  { key: 'end', label: 'End' },
];

const TurnPhaseBar = ({ phase }) => {
  const activePhase = phase === PHASE_GAME_OVER ? 'end' : phase;

  return (
    <div className="cd-phase-bar">
      {PHASES.map((p, i) => (
        <React.Fragment key={p.key}>
          <div className={`cd-phase-step ${activePhase === p.key ? 'cd-phase-active' : ''}`}>
            <span className="cd-phase-number">{i + 1}</span>
            <span className="cd-phase-label">{p.label}</span>
          </div>
          {i < PHASES.length - 1 && <div className="cd-phase-connector" />}
        </React.Fragment>
      ))}
    </div>
  );
};

export default TurnPhaseBar;
