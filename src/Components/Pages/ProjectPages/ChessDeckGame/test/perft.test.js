// Perft — count every leaf node to depth N and compare against the published
// reference values for these positions.
//
// Unit tests check the rules a person thought to write down. Perft checks the
// combinations nobody thinks of: a pin that only exists after an en passant
// capture removes the blocker, a castle that is legal until the rook is taken,
// a discovered check from the piece you just moved past. With no cards in play
// this engine has to be ordinary chess, so any divergence from these numbers is
// a bug.
//
// Depth is kept low so the suite stays quick. PERFT_DEEP=1 adds the slow
// depth-4 run (~8s), which is where castling first appears from the opening.
import { test, describe } from 'node:test';
import assert from 'node:assert/strict';

import { getValidMoves, executeMove } from '../gameLogic.js';
import {
  createInitialBoard, WHITE, BLACK, makePiece, KING, QUEEN, ROOK, BISHOP, KNIGHT, PAWN,
} from '../constants.js';

function perft(board, color, enPassant, depth) {
  if (depth === 0) return 1;
  let nodes = 0;
  for (let r = 0; r < 8; r++) {
    for (let c = 0; c < 8; c++) {
      const piece = board[r][c];
      if (!piece || piece.color !== color) continue;
      for (const move of getValidMoves(board, r, c, enPassant)) {
        const res = executeMove(board, { row: r, col: c }, { row: move.row, col: move.col }, move);
        nodes += perft(res.newBoard, color === WHITE ? BLACK : WHITE, res.enPassantTarget, depth - 1);
      }
    }
  }
  return nodes;
}

const LETTERS = { k: KING, q: QUEEN, r: ROOK, b: BISHOP, n: KNIGHT, p: PAWN };
const position = (rows) => rows.map((row) => [...row].map((ch) => (
  ch === '.' ? null : makePiece(LETTERS[ch.toLowerCase()], ch === ch.toUpperCase() ? WHITE : BLACK)
)));

describe('perft — opening position', () => {
  const cases = [[1, 20], [2, 400], [3, 8902]];
  if (process.env.PERFT_DEEP) cases.push([4, 197281]);

  for (const [depth, expected] of cases) {
    test(`depth ${depth} visits ${expected} positions`, () => {
      assert.equal(perft(createInitialBoard(), WHITE, null, depth), expected);
    });
  }
});

describe('perft — Kiwipete', () => {
  // Castling available on both wings for both colours, an en passant chance one
  // ply in, and several pinned pieces. The standard second perft position
  // precisely because it catches what the opening position does not.
  const kiwipete = () => position([
    'r...k..r',
    'p.ppqpb.',
    'bn..pnp.',
    '...PN...',
    '.p..P...',
    '..N..Q.p',
    'PPPBBPPP',
    'R...K..R',
  ]);

  const cases = [[1, 48], [2, 2039]];
  if (process.env.PERFT_DEEP) cases.push([3, 97862]);

  for (const [depth, expected] of cases) {
    test(`depth ${depth} visits ${expected} positions`, () => {
      assert.equal(perft(kiwipete(), WHITE, null, depth), expected);
    });
  }
});
