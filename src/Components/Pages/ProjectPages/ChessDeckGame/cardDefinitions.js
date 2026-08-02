import {
  RARITY_COMMON, RARITY_UNCOMMON, RARITY_RARE,
  TARGET_NONE, TARGET_OWN_PIECE, TARGET_ENEMY_PIECE, TARGET_SQUARE, TARGET_MULTI,
} from './constants.js';

// Each card: { id, name, description, rarity, targetType, targetSteps, targetPrompt, targetPrompts, targetFilter, replacesMove, artColor }

const CARD_LIST = [
  // ── Instant Cards ──────────────────────────────────────────────────
  {
    id: '1',
    name: 'Fortify',
    description: 'Select a square. All your pawns adjacent to it gain a shield. A shielded piece survives one capture attempt.',
    rarity: RARITY_COMMON,
    targetType: TARGET_SQUARE,
    targetFilter: 'anySquare',
    targetPrompt: 'Select a square to fortify around',
    artColor: '#6B8E23',
  },
  {
    id: '2',
    name: 'Fog of War',
    description: "For your opponent's next turn, all your pieces display as pawns.",
    rarity: RARITY_RARE,
    targetType: TARGET_NONE,
    artColor: '#708090',
  },
  {
    id: '3',
    name: 'Double Time',
    description: 'Make two moves this turn instead of one. If your first move gives check, your turn ends.',
    rarity: RARITY_RARE,
    targetType: TARGET_NONE,
    artColor: '#DAA520',
  },
  {
    id: '4',
    name: 'Sabotage',
    description: 'Your opponent discards a random card.',
    rarity: RARITY_COMMON,
    targetType: TARGET_NONE,
    artColor: '#8B0000',
  },

  // ── Target-Piece Cards ─────────────────────────────────────────────
  {
    id: '5',
    name: 'Stallion Spirit',
    description: 'One of your pieces, except a knight or your king, can also move like a knight for 3 turns.',
    rarity: RARITY_UNCOMMON,
    targetType: TARGET_OWN_PIECE,
    targetFilter: 'ownNonKnight',
    targetPrompt: 'Select one of your pieces (not a knight, not your king)',
    artColor: '#8B4513',
  },
  {
    id: '6',
    name: 'Petrify',
    description: "Freeze one opponent's piece in place for 2 of their turns. It still threatens squares.",
    rarity: RARITY_UNCOMMON,
    targetType: TARGET_ENEMY_PIECE,
    targetFilter: 'enemyNonKing',
    targetPrompt: "Select an opponent's non-king piece to freeze",
    artColor: '#696969',
  },
  {
    id: '7',
    name: 'Promotion Decree',
    description: 'Immediately promote one of your pawns to any piece, wherever it is.',
    rarity: RARITY_RARE,
    targetType: TARGET_OWN_PIECE,
    targetFilter: 'ownPawn',
    targetPrompt: 'Select one of your pawns to promote',
    artColor: '#FFD700',
  },
  {
    id: '8',
    name: 'Bounty',
    description: 'Mark an enemy piece. Capture it within 3 turns to draw 2 extra cards.',
    rarity: RARITY_COMMON,
    targetType: TARGET_ENEMY_PIECE,
    targetFilter: 'enemyNonKing',
    targetPrompt: 'Select an enemy piece to place a bounty on',
    artColor: '#B8860B',
  },
  {
    // Replaced Bodyguard, which was never wired into the capture path and so
    // did nothing at all — while the AI scored it +30 and kept casting it.
    // Vigil answers the card layer instead of the board, which the deck had no
    // defence against, and reuses the same targeting the old card used.
    id: '9',
    name: 'Vigil',
    description: "Select one of your pieces. For 3 turns it cannot be chosen as the target of an opponent's card.",
    rarity: RARITY_UNCOMMON,
    targetType: TARGET_OWN_PIECE,
    targetFilter: 'ownNonKing',
    targetPrompt: 'Select one of your non-king pieces to keep vigil over',
    artColor: '#2F4F4F',
  },
  {
    id: '10',
    name: 'Excommunicate',
    description: "Demote one of your opponent's non-pawn, non-king pieces to a pawn.",
    rarity: RARITY_RARE,
    targetType: TARGET_ENEMY_PIECE,
    targetFilter: 'enemyNonKingNonPawn',
    targetPrompt: "Select an opponent's piece to demote to pawn",
    artColor: '#4B0082',
  },

  // ── Target-Square Cards ────────────────────────────────────────────
  {
    id: '11',
    name: 'Immovable Rock',
    description: 'Place an immovable rock on any empty square. No piece can move to or through it.',
    rarity: RARITY_COMMON,
    targetType: TARGET_SQUARE,
    targetFilter: 'emptySquare',
    targetPrompt: 'Select an empty square for the rock',
    artColor: '#808080',
  },
  {
    id: '12',
    name: 'Holy Ground',
    description: 'Bless an empty square. For 4 turns, your pieces on it cannot be captured. Does not protect your king.',
    rarity: RARITY_UNCOMMON,
    targetType: TARGET_SQUARE,
    targetFilter: 'emptySquare',
    targetPrompt: 'Select an empty square to bless',
    artColor: '#FFFACD',
  },
  {
    id: '13',
    name: 'Sinkhole',
    description: 'Choose an enemy piece to capture it, or an empty square to trap the next piece that lands there.',
    rarity: RARITY_RARE,
    targetType: TARGET_SQUARE,
    targetFilter: 'anyNonKingSquare',
    targetPrompt: 'Select a square for the sinkhole',
    artColor: '#3B2F2F',
  },
  {
    id: '14',
    name: 'Watchtower',
    description: "Place a watchtower on an empty square. Your pieces within 2 squares can't be targeted by opponent's cards for 3 turns.",
    rarity: RARITY_UNCOMMON,
    targetType: TARGET_SQUARE,
    targetFilter: 'emptySquare',
    targetPrompt: 'Select an empty square for the watchtower',
    artColor: '#D2691E',
  },
  {
    id: '15',
    name: 'Conscription',
    description: 'Place a new pawn on any empty square in your second rank.',
    rarity: RARITY_COMMON,
    targetType: TARGET_SQUARE,
    targetFilter: 'ownSecondRankEmpty',
    targetPrompt: 'Select an empty square on your second rank',
    artColor: '#556B2F',
  },

  // ── Complex Cards (multi-step targeting) ───────────────────────────
  {
    id: '16',
    name: 'Catapult',
    description: 'Your rook jumps over one adjacent friendly piece and captures the first enemy piece beyond. Replaces your move.',
    rarity: RARITY_RARE,
    targetType: TARGET_MULTI,
    targetSteps: 2,
    targetPrompts: ['Select one of your rooks', 'Select the enemy piece to catapult at'],
    replacesMove: true,
    artColor: '#A0522D',
  },
  {
    id: '17',
    name: 'Switcheroo',
    description: 'Swap the positions of two of your non-king pieces.',
    rarity: RARITY_UNCOMMON,
    targetType: TARGET_MULTI,
    targetSteps: 2,
    targetPrompts: ['Select first piece to swap', 'Select second piece to swap'],
    artColor: '#9370DB',
  },
  {
    id: '18',
    name: 'Gambit',
    description: "Sacrifice one of your non-king pieces to capture any of your opponent's non-king pieces. Replaces your move.",
    rarity: RARITY_RARE,
    targetType: TARGET_MULTI,
    targetSteps: 2,
    targetPrompts: ['Select your piece to sacrifice', 'Select enemy piece to capture'],
    replacesMove: true,
    artColor: '#DC143C',
  },
  {
    id: '19',
    name: 'Recall',
    description: 'Return one of your non-king pieces to any empty square on your back rank.',
    rarity: RARITY_UNCOMMON,
    targetType: TARGET_MULTI,
    targetSteps: 2,
    targetPrompts: ['Select one of your pieces to recall', 'Select an empty back-rank square'],
    artColor: '#4682B4',
  },
  {
    id: '20',
    name: 'Hasty Retreat',
    description: 'Move your king to any adjacent empty safe square as a bonus. You still get your normal move.',
    rarity: RARITY_UNCOMMON,
    targetType: TARGET_SQUARE,
    targetFilter: 'kingAdjacentSafe',
    targetPrompt: 'Select an adjacent safe square for your king',
    artColor: '#5F9EA0',
  },
  {
    id: '21',
    name: 'Second Chance',
    description: 'Passive: While in your hand, if your king would be captured or you are checkmated, your king teleports to a random safe square. Consumed on use.',
    rarity: RARITY_RARE,
    targetType: TARGET_NONE,
    isPassive: true,
    artColor: '#F0E6C8',
  },
];

// Index by id for fast lookup
export const CARDS = {};
for (const card of CARD_LIST) {
  CARDS[card.id] = card;
}

export { CARD_LIST };
