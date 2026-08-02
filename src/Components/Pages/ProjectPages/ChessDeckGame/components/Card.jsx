import React from 'react';
import { CARDS } from '../cardDefinitions.js';
import { CARD_ART, artInkFor, monogramFor } from '../cardArt.js';
import { RARITY_COMMON, RARITY_UNCOMMON, RARITY_RARE } from '../constants.js';

const RARITY_COLORS = {
  [RARITY_COMMON]: '#9E9E9E',
  [RARITY_UNCOMMON]: '#4FC3F7',
  [RARITY_RARE]: '#FFD700',
};

const Card = ({ cardId, index, onClick, disabled, isActive }) => {
  const card = CARDS[cardId];
  if (!card) return null;

  const rarityColor = RARITY_COLORS[card.rarity] || '#9E9E9E';
  const artColor = card.artColor || '#444';

  return (
    // A real button: the card was a div with an onClick, so the hand — the
    // entire card half of the game — could not be reached by keyboard at all,
    // and a screen reader was offered a colour swatch and nothing else.
    <button
      type="button"
      className={`cd-card ${disabled ? 'cd-card-disabled' : ''} ${isActive ? 'cd-card-active' : ''}`}
      onClick={!disabled ? onClick : undefined}
      disabled={disabled}
      aria-pressed={isActive || undefined}
      aria-label={`${card.name}, ${card.rarity}. ${card.description}`}
      style={{ '--card-index': index }}
    >
      {/* Art if it has been drawn, otherwise the card's monogram. The previous
          placeholder was a literal "?", which reads as a failed image rather
          than a deliberate state — and every card in hand showed one. */}
      <div
        className="cd-card-art"
        style={{ backgroundColor: artColor, '--cd-art-ink': artInkFor(artColor) }}
      >
        {CARD_ART[card.id] ? (
          <svg className="cd-card-art-svg" viewBox="0 0 280 140" aria-hidden="true" focusable="false">
            <path d={CARD_ART[card.id].d} fill="currentColor" />
          </svg>
        ) : (
          <span className="cd-card-art-monogram" aria-hidden="true">{monogramFor(card.name)}</span>
        )}
      </div>
      <div className="cd-card-body">
        <div className="cd-card-name">{card.name}</div>
        <div className="cd-card-desc">{card.description}</div>
      </div>
      <div className="cd-card-rarity">
        <span className="cd-rarity-gem" style={{ backgroundColor: rarityColor }} />
      </div>
    </button>
  );
};

export default Card;
