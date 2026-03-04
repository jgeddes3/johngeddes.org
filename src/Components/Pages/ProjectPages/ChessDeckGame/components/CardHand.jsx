import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Card from './Card';
import { PHASE_MOVE } from '../constants';
import { CARDS } from '../cardDefinitions';
import { canPlayCard } from '../cardLogic';

const CardHand = ({ state, dispatch, perspective }) => {
  const { hands, currentPlayer, phase, activeCard, cardPlayedThisTurn } = state;
  const displayPlayer = perspective || currentPlayer;
  const hand = hands[displayPlayer];

  // Cards are playable during PHASE_MOVE if no card has been played yet this turn
  const canPlay = phase === PHASE_MOVE && !cardPlayedThisTurn && !activeCard;

  return (
    <div className="cd-card-hand">
      <div className="cd-hand-label">{displayPlayer === 'white' ? 'White' : 'Black'}&apos;s Hand</div>
      <div className="cd-hand-cards">
        <AnimatePresence>
          {hand.map((cardId, i) => {
            const card = CARDS[cardId];
            const disabled = !canPlay || (activeCard && activeCard.handIndex !== i) || !canPlayCard(card, state);
            const isActive = activeCard && activeCard.handIndex === i;

            return (
              <motion.div
                key={`${cardId}-${i}`}
                initial={{ opacity: 0, y: 50, rotate: 0 }}
                animate={{
                  opacity: 1,
                  y: 0,
                  rotate: 0,
                }}
                exit={{ opacity: 0, y: -50, scale: 0.8 }}
                transition={{ type: 'spring', stiffness: 300, damping: 25 }}
                className="cd-hand-card-wrapper"
              >
                <Card
                  cardId={cardId}
                  index={i}
                  disabled={disabled}
                  isActive={isActive}
                  onClick={() => {
                    if (canPlay) {
                      dispatch({ type: 'SELECT_CARD', cardId, handIndex: i });
                    }
                  }}
                />
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default CardHand;
