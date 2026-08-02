import React from 'react';
import { PAWN } from '../constants.js';
import { PIECE_IMAGES } from '../pieceAssets.js';
import ModGlyph from './ModGlyph.jsx';

// Spoken labels for the badges. The emoji these replaced were silent to screen
// readers and, worse, shield and bodyguard shared a glyph — two different
// states that looked identical on the board.
const MODIFIER_LABELS = {
  shield: 'shielded',
  petrified: 'frozen in place',
  knightMovement: 'moves like a knight',
  bounty: 'bounty marked',
  vigil: 'under vigil',
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
      if (MODIFIER_LABELS[mod] && !seen.has(mod)) {
        seen.add(mod);
        modIcons.push(
          <span key={mod} className="cd-piece-modifier" title={MODIFIER_LABELS[mod]}>
            <ModGlyph name={mod} label={MODIFIER_LABELS[mod]} />
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
