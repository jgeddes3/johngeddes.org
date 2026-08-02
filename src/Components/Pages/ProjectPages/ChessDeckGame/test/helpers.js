// Shared fixtures for the Chess Deck suite.
//
// Boards are written as 8 strings of 8 characters, rank 8 first, so a test
// reads like the position it is testing. Uppercase is white, lowercase black,
// '.' is empty:
//
//   '....k...'   <- rank 8 (row 0)
//   ...
//   '....K...'   <- rank 1 (row 7)
import { makePiece, KING, QUEEN, ROOK, BISHOP, KNIGHT, PAWN, WHITE, BLACK } from '../constants.js';

const LETTER_TO_TYPE = { k: KING, q: QUEEN, r: ROOK, b: BISHOP, n: KNIGHT, p: PAWN };

/** Build a board from 8 rank strings, rank 8 first. */
export function boardFrom(rows) {
  if (rows.length !== 8) throw new Error(`expected 8 ranks, got ${rows.length}`);
  return rows.map((row, r) => {
    if (row.length !== 8) throw new Error(`rank ${8 - r} has ${row.length} files`);
    return [...row].map((ch) => {
      if (ch === '.') return null;
      const type = LETTER_TO_TYPE[ch.toLowerCase()];
      if (!type) throw new Error(`unknown piece '${ch}'`);
      return makePiece(type, ch === ch.toUpperCase() ? WHITE : BLACK);
    });
  });
}

/** An otherwise-empty board with just the two kings, so tests isolate one rule. */
export function bareKings() {
  return boardFrom([
    '....k...',
    '........',
    '........',
    '........',
    '........',
    '........',
    '........',
    '....K...',
  ]);
}

/** Algebraic square -> { row, col }. 'e1' -> { row: 7, col: 4 } */
export function sq(name) {
  const col = name.charCodeAt(0) - 97;
  const row = 8 - Number(name[1]);
  return { row, col };
}

/** Does a move list contain this square? */
export function includesSquare(moves, name) {
  const { row, col } = sq(name);
  return moves.some((m) => m.row === row && m.col === col);
}

/** Mark a piece as having moved, for castling-rights tests. */
export function markMoved(board, name) {
  const { row, col } = sq(name);
  board[row][col].hasMoved = true;
  return board;
}

/** Attach a modifier to the piece on a square. */
export function withModifier(board, name, mod) {
  const { row, col } = sq(name);
  board[row][col].modifiers = [...(board[row][col].modifiers || []), mod];
  return board;
}

/** Square-modifier map keyed the way gameLogic expects: 'row-col'. */
export function squareMods(entries) {
  const out = {};
  for (const [name, mods] of Object.entries(entries)) {
    const { row, col } = sq(name);
    out[`${row}-${col}`] = mods;
  }
  return out;
}
