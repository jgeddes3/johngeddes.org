import React from 'react';
import { PIECE_IMAGES, PAWN } from '../constants';

const MODIFIER_ICONS = {
  shield: '\u{1F6E1}',
  petrified: '\u{1F9CA}',
  knightMovement: '\u{1F40E}',
  bounty: '\u{1F4B0}',
  bodyguard: '\u{1F6E1}',
};

const Piece = ({ piece, fogged }) => {
  if (!piece) return null;

  // Fog: show all pieces as pawns
  const displayType = fogged ? PAWN : piece.type;
  const imgSrc = PIECE_IMAGES[piece.color][displayType];

  // Modifier indicators
  const modIcons = [];
  if (!fogged) {
    const seen = new Set();
    for (const mod of piece.modifiers) {
      if (MODIFIER_ICONS[mod] && !seen.has(mod)) {
        seen.add(mod);
        modIcons.push(
          <span key={mod} className="cd-piece-modifier" title={mod}>
            {MODIFIER_ICONS[mod]}
          </span>
        );
      }
    }
  }

  return (
    <div className={`cd-piece cd-piece-${piece.color}`}>
      <img
        className="cd-piece-img"
        src={imgSrc}
        alt={displayType}
        draggable={false}
      />
      {modIcons.length > 0 && (
        <span className="cd-piece-modifiers">{modIcons}</span>
      )}
    </div>
  );
};

export default Piece;
