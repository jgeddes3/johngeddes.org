import React from 'react';
import { PIECE_IMAGES } from '../constants';

const CapturedPieces = ({ pieces, label }) => {
  if (!pieces || pieces.length === 0) {
    return (
      <div className="cd-captured">
        <div className="cd-captured-label">{label}</div>
        <div className="cd-captured-pieces cd-captured-empty">&mdash;</div>
      </div>
    );
  }

  return (
    <div className="cd-captured">
      <div className="cd-captured-label">{label}</div>
      <div className="cd-captured-pieces">
        {pieces.map((p, i) => (
          <img
            key={i}
            className="cd-captured-piece"
            src={PIECE_IMAGES[p.color][p.type]}
            alt={`${p.color} ${p.type}`}
            draggable={false}
          />
        ))}
      </div>
    </div>
  );
};

export default CapturedPieces;
