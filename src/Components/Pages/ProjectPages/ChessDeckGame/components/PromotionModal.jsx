import React from 'react';
import { QUEEN, ROOK, BISHOP, KNIGHT } from '../constants.js';
import { PIECE_IMAGES } from '../pieceAssets.js';

const PROMO_OPTIONS = [QUEEN, ROOK, BISHOP, KNIGHT];

const PromotionModal = ({ color, dispatch }) => {
  return (
    <div className="cd-modal-overlay">
      <div className="cd-modal">
        <h2 className="cd-modal-title">Promote Pawn</h2>
        <div className="cd-promo-options">
          {PROMO_OPTIONS.map(type => (
            <button
              key={type}
              className="cd-promo-button"
              onClick={() => dispatch({ type: 'CHOOSE_PROMOTION', pieceType: type })}
              title={type}
            >
              <img
                className="cd-promo-img"
                src={PIECE_IMAGES[color][type]}
                alt={type}
                draggable={false}
              />
              <span className="cd-promo-label">{type}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PromotionModal;
