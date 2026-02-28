import React from 'react';
import CardBack from '../../ProjectPageImages/ChessDeck/Card.png';
import { WHITE, BLACK } from '../constants';

const OpponentHand = ({ state }) => {
  const opponentColor = state.currentPlayer === WHITE ? BLACK : WHITE;
  const hand = state.hands[opponentColor];

  if (!hand || hand.length === 0) return null;

  return (
    <div className="cd-opponent-hand">
      <div className="cd-hand-label">{opponentColor === WHITE ? 'White' : 'Black'}&apos;s Hand</div>
      <div className="cd-opponent-cards">
        {hand.map((_, i) => (
          <div key={i} className="cd-card-back-wrapper">
            <img
              className="cd-card-back"
              src={CardBack}
              alt="Card back"
              draggable={false}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default OpponentHand;
