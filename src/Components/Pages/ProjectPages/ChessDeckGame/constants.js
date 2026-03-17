// Custom piece images
import WhiteKingImg from '../ProjectPageImages/ChessDeck/WhiteKingPiece.png';
import WhiteQueenImg from '../ProjectPageImages/ChessDeck/WhiteQueenPiece.png';
import WhiteBishopImg from '../ProjectPageImages/ChessDeck/WhiteBishopPiece.png';
import WhiteKnightImg from '../ProjectPageImages/ChessDeck/WhiteKnightPiece.png';
import WhiteRookImg from '../ProjectPageImages/ChessDeck/WhiteCastlePiece.png';
import WhitePawnImg from '../ProjectPageImages/ChessDeck/WhitePawnPiece.png';
import BlackKingImg from '../ProjectPageImages/ChessDeck/BlackKingPiece.png';
import BlackQueenImg from '../ProjectPageImages/ChessDeck/BlackQueenPiece.png';
import BlackBishopImg from '../ProjectPageImages/ChessDeck/BlackBishopPiece.png';
import BlackKnightImg from '../ProjectPageImages/ChessDeck/BlackKnightPiece.png';
import BlackRookImg from '../ProjectPageImages/ChessDeck/BlackCastlePiece.png';
import BlackPawnImg from '../ProjectPageImages/ChessDeck/BlackPawnPiece.png';

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
export const PIECE_IMAGES = {
  white: {
    [KING]: WhiteKingImg,
    [QUEEN]: WhiteQueenImg,
    [ROOK]: WhiteRookImg,
    [BISHOP]: WhiteBishopImg,
    [KNIGHT]: WhiteKnightImg,
    [PAWN]: WhitePawnImg,
  },
  black: {
    [KING]: BlackKingImg,
    [QUEEN]: BlackQueenImg,
    [ROOK]: BlackRookImg,
    [BISHOP]: BlackBishopImg,
    [KNIGHT]: BlackKnightImg,
    [PAWN]: BlackPawnImg,
  },
};

// Helper to create a piece object
export function makePiece(type, color) {
  return { type, color, hasMoved: false, modifiers: [] };
}

// Standard starting position
export function createInitialBoard() {
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

// Build the full deck: 2 copies of each card ID (1-20)
export function createDeck() {
  const deck = [];
  for (let id = 1; id <= 21; id++) {
    deck.push(String(id));
    deck.push(String(id));
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
