// Custom piece images

// Piece types
export const KING = 'king';
export const QUEEN = 'queen';
export const ROOK = 'rook';
export const BISHOP = 'bishop';
export const KNIGHT = 'knight';
export const PAWN = 'pawn';

// Colors
export const WHITE = 'white';
export const BLACK = 'black';

// Phases
export const PHASE_DRAW = 'draw';
export const PHASE_CARD = 'card';
export const PHASE_MOVE = 'move';
export const PHASE_PROMOTION = 'promotion';
export const PHASE_GAME_OVER = 'gameOver';

// Unicode piece symbols (fallback)
export const PIECE_SYMBOLS = {
  white: {
    [KING]: '\u2654',
    [QUEEN]: '\u2655',
    [ROOK]: '\u2656',
    [BISHOP]: '\u2657',
    [KNIGHT]: '\u2658',
    [PAWN]: '\u2659',
  },
  black: {
    [KING]: '\u265A',
    [QUEEN]: '\u265B',
    [ROOK]: '\u265C',
    [BISHOP]: '\u265D',
    [KNIGHT]: '\u265E',
    [PAWN]: '\u265F',
  },
};

// Custom piece images


// Pieces carry a stable id so a timed effect can name the piece it is attached
// to. Without one, effects could only be tracked by square or by colour: a
// second Petrify unfroze the first target early, and a Bounty stayed on the
// square its victim had already walked off.
let pieceIdSeq = 0;

// Helper to create a piece object
export function makePiece(type, color, id) {
  return { id: id ?? ++pieceIdSeq, type, color, hasMoved: false, modifiers: [] };
}

/**
 * An id not already on the board, for pieces created mid-game (Conscription).
 * Derived from the board rather than a counter so it cannot collide after a new
 * game resets the sequence.
 */
export function nextPieceId(board) {
  let max = 0;
  for (const row of board) {
    for (const piece of row) {
      if (piece && typeof piece.id === 'number' && piece.id > max) max = piece.id;
    }
  }
  return max + 1;
}

// Standard starting position
export function createInitialBoard() {
  // Reset first, so the 32 pieces are always ids 1-32 in the same order and two
  // clients building the same opening agree on every piece's identity.
  pieceIdSeq = 0;
  const board = Array.from({ length: 8 }, () => Array(8).fill(null));

  const backRow = [ROOK, KNIGHT, BISHOP, QUEEN, KING, BISHOP, KNIGHT, ROOK];

  // Black back rank (row 0)
  for (let c = 0; c < 8; c++) {
    board[0][c] = makePiece(backRow[c], BLACK);
  }
  // Black pawns (row 1)
  for (let c = 0; c < 8; c++) {
    board[1][c] = makePiece(PAWN, BLACK);
  }
  // White pawns (row 6)
  for (let c = 0; c < 8; c++) {
    board[6][c] = makePiece(PAWN, WHITE);
  }
  // White back rank (row 7)
  for (let c = 0; c < 8; c++) {
    board[7][c] = makePiece(backRow[c], WHITE);
  }

  return board;
}

// Max hand size
export const MAX_HAND_SIZE = 5;

// Starting hand size
export const STARTING_HAND_SIZE = 1;

// Card rarities
export const RARITY_COMMON = 'common';
export const RARITY_UNCOMMON = 'uncommon';
export const RARITY_RARE = 'rare';

// Card target types
export const TARGET_NONE = 'none';
export const TARGET_OWN_PIECE = 'ownPiece';
export const TARGET_ENEMY_PIECE = 'enemyPiece';
export const TARGET_SQUARE = 'square';
export const TARGET_MULTI = 'multi';

// How many copies of a card go in the deck, by rarity.
//
// The deck used to hold exactly two copies of every card regardless of rarity,
// which made the eight rares 38% of it — a rare turned up as often as a common,
// and rarity did nothing but tint a gem on the card face. Weighting the counts
// is what makes the tiers mean something and lets the strong cards stay strong.
export const COPIES_BY_RARITY = {
  [RARITY_COMMON]: 4,
  [RARITY_UNCOMMON]: 2,
  [RARITY_RARE]: 1,
};

/**
 * Build the full deck, weighted by rarity.
 *
 * Takes the card table as an argument rather than importing it, because
 * cardDefinitions.js already imports this module and the cycle would leave
 * CARD_LIST undefined at module-evaluation time.
 */
export function createDeck(cardList) {
  const deck = [];
  const cards = cardList || [];
  for (const card of cards) {
    const copies = COPIES_BY_RARITY[card.rarity] ?? 2;
    for (let i = 0; i < copies; i++) deck.push(card.id);
  }
  return shuffleArray(deck);
}

// Fisher-Yates shuffle
export function shuffleArray(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}
