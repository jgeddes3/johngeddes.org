import {
  RARITY_COMMON, RARITY_UNCOMMON, RARITY_RARE,
  TARGET_NONE, TARGET_OWN_PIECE, TARGET_ENEMY_PIECE, TARGET_SQUARE, TARGET_MULTI,
} from './constants';

// Each card: { id, name, description, rarity, targetType, targetSteps, targetPrompt, targetPrompts, targetFilter, replacesMove, artColor }

const CARD_LIST = [
  // ── Instant Cards ──────────────────────────────────────────────────
  {
    id: '1',
    name: 'Fortify',
    description: 'All your unmoved pieces gain a shield. A shielded piece survives one capture attempt.',
    rarity: RARITY_COMMON,
    targetType: TARGET_NONE,
    artColor: '#6B8E23', /* TODO: replace with card art */
  },
  {
    id: '2',
    name: 'Fog of War',
    description: "For your opponent's next turn, all your pieces display as pawns.",
    rarity: RARITY_RARE,
    targetType: TARGET_NONE,
    artColor: '#708090', /* TODO: replace with card art */
  },
  {
    id: '3',
    name: 'Double Time',
    description: 'Make two moves this turn instead of one.',
    rarity: RARITY_RARE,
    targetType: TARGET_NONE,
    artColor: '#DAA520', /* TODO: replace with card art */
  },
  {
    id: '4',
    name: 'Sabotage',
    description: 'Your opponent discards a random card.',
    rarity: RARITY_COMMON,
    targetType: TARGET_NONE,
    artColor: '#8B0000', /* TODO: replace with card art */
  },

  // ── Target-Piece Cards ─────────────────────────────────────────────
  {
    id: '5',
    name: 'Stallion Spirit',
    description: 'One of your non-knight pieces can also move like a knight for 3 turns.',
    rarity: RARITY_UNCOMMON,
    targetType: TARGET_OWN_PIECE,
    targetFilter: 'ownNonKnight',
    targetPrompt: 'Select one of your non-knight pieces',
    artColor: '#8B4513', /* TODO: replace with card art */
  },
  {
    id: '6',
    name: 'Petrify',
    description: "Freeze one opponent's piece in place for 2 of their turns. It still threatens squares.",
    rarity: RARITY_UNCOMMON,
    targetType: TARGET_ENEMY_PIECE,
    targetFilter: 'enemyNonKing',
    targetPrompt: "Select an opponent's non-king piece to freeze",
    artColor: '#696969', /* TODO: replace with card art */
  },
  {
    id: '7',
    name: 'Promotion Decree',
    description: 'Immediately promote one of your pawns to any piece, wherever it is.',
    rarity: RARITY_RARE,
    targetType: TARGET_OWN_PIECE,
    targetFilter: 'ownPawn',
    targetPrompt: 'Select one of your pawns to promote',
    artColor: '#FFD700', /* TODO: replace with card art */
  },
  {
    id: '8',
    name: 'Bounty',
    description: 'Mark an enemy piece. Capture it within 3 turns to draw 2 extra cards.',
    rarity: RARITY_COMMON,
    targetType: TARGET_ENEMY_PIECE,
    targetFilter: 'enemyNonKing',
    targetPrompt: 'Select an enemy piece to place a bounty on',
    artColor: '#B8860B', /* TODO: replace with card art */
  },
  {
    id: '9',
    name: 'Bodyguard',
    description: 'Select one of your pieces. For 2 turns, if an adjacent friendly piece would be captured, this piece is captured instead.',
    rarity: RARITY_UNCOMMON,
    targetType: TARGET_OWN_PIECE,
    targetFilter: 'ownNonKing',
    targetPrompt: 'Select one of your non-king pieces as bodyguard',
    artColor: '#2F4F4F', /* TODO: replace with card art */
  },
  {
    id: '10',
    name: 'Excommunicate',
    description: "Demote one of your opponent's non-pawn, non-king pieces to a pawn.",
    rarity: RARITY_RARE,
    targetType: TARGET_ENEMY_PIECE,
    targetFilter: 'enemyNonKingNonPawn',
    targetPrompt: "Select an opponent's piece to demote to pawn",
    artColor: '#4B0082', /* TODO: replace with card art */
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
    artColor: '#808080', /* TODO: replace with card art */
  },
  {
    id: '12',
    name: 'Holy Ground',
    description: 'Bless an empty square. For 4 turns, your pieces on it cannot be captured.',
    rarity: RARITY_UNCOMMON,
    targetType: TARGET_SQUARE,
    targetFilter: 'emptySquare',
    targetPrompt: 'Select an empty square to bless',
    artColor: '#FFFACD', /* TODO: replace with card art */
  },
  {
    id: '13',
    name: 'Sinkhole',
    description: 'If an enemy piece is on the chosen square, capture it. If empty, the next piece to land on it is captured.',
    rarity: RARITY_RARE,
    targetType: TARGET_SQUARE,
    targetFilter: 'anyNonKingSquare',
    targetPrompt: 'Select a square for the sinkhole',
    artColor: '#3B2F2F', /* TODO: replace with card art */
  },
  {
    id: '14',
    name: 'Watchtower',
    description: "Place a watchtower on an empty square. Your pieces within 2 squares can't be targeted by opponent's cards for 3 turns.",
    rarity: RARITY_UNCOMMON,
    targetType: TARGET_SQUARE,
    targetFilter: 'emptySquare',
    targetPrompt: 'Select an empty square for the watchtower',
    artColor: '#D2691E', /* TODO: replace with card art */
  },
  {
    id: '15',
    name: 'Conscription',
    description: 'Place a new pawn on any empty square in your second rank.',
    rarity: RARITY_COMMON,
    targetType: TARGET_SQUARE,
    targetFilter: 'ownSecondRankEmpty',
    targetPrompt: 'Select an empty square on your second rank',
    artColor: '#556B2F', /* TODO: replace with card art */
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
    artColor: '#A0522D', /* TODO: replace with card art */
  },
  {
    id: '17',
    name: 'Switcheroo',
    description: 'Swap the positions of two of your non-king pieces.',
    rarity: RARITY_UNCOMMON,
    targetType: TARGET_MULTI,
    targetSteps: 2,
    targetPrompts: ['Select first piece to swap', 'Select second piece to swap'],
    artColor: '#9370DB', /* TODO: replace with card art */
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
    artColor: '#DC143C', /* TODO: replace with card art */
  },
  {
    id: '19',
    name: 'Recall',
    description: 'Return one of your non-king pieces to any empty square on your back rank.',
    rarity: RARITY_UNCOMMON,
    targetType: TARGET_MULTI,
    targetSteps: 2,
    targetPrompts: ['Select one of your pieces to recall', 'Select an empty back-rank square'],
    artColor: '#4682B4', /* TODO: replace with card art */
  },
  {
    id: '20',
    name: 'Hasty Retreat',
    description: 'Move your king to any adjacent empty safe square as a bonus. You still get your normal move.',
    rarity: RARITY_UNCOMMON,
    targetType: TARGET_SQUARE,
    targetFilter: 'kingAdjacentSafe',
    targetPrompt: 'Select an adjacent safe square for your king',
    artColor: '#5F9EA0', /* TODO: replace with card art */
  },
];

// Index by id for fast lookup
export const CARDS = {};
for (const card of CARD_LIST) {
  CARDS[card.id] = card;
}

export { CARD_LIST };
