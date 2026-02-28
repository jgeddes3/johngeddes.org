import React from 'react';
import { CARDS } from '../cardDefinitions';
import { RARITY_COMMON, RARITY_UNCOMMON, RARITY_RARE } from '../constants';

const RARITY_COLORS = {
  [RARITY_COMMON]: '#9E9E9E',
  [RARITY_UNCOMMON]: '#4FC3F7',
  [RARITY_RARE]: '#FFD700',
};

const Card = ({ cardId, index, onClick, disabled, isActive }) => {
  const card = CARDS[cardId];
  if (!card) return null;

  const rarityColor = RARITY_COLORS[card.rarity] || '#9E9E9E';

  return (
    <div
      className={`cd-card ${disabled ? 'cd-card-disabled' : ''} ${isActive ? 'cd-card-active' : ''}`}
      onClick={!disabled ? onClick : undefined}
      style={{ '--card-index': index }}
    >
      {/* TODO: replace with card art */}
      <div className="cd-card-art" style={{ backgroundColor: card.artColor || '#444' }}>
        <span className="cd-card-art-placeholder">?</span>
      </div>
      <div className="cd-card-body">
        <div className="cd-card-name">{card.name}</div>
        <div className="cd-card-desc">{card.description}</div>
      </div>
      <div className="cd-card-rarity">
        <span className="cd-rarity-gem" style={{ backgroundColor: rarityColor }} />
      </div>
    </div>
  );
};

export default Card;
