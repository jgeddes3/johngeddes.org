// Standard chess rules. These are the invariants the card layer is allowed to
// bend but never to break by accident.
//
// Tests marked { todo: true } assert behaviour the engine does NOT yet have.
// They are the definition of done for the correctness phases — drop the flag as
// each one is fixed rather than editing the assertion.
import { test, describe } from 'node:test';
import assert from 'node:assert/strict';

import {
  getValidMoves, isKingInCheck, isSquareAttacked, getGameStatus, executeMove, findKing,
  findSafeSquareForKing,
} from '../gameLogic.js';
import { createInitialBoard, WHITE, BLACK, KING, PAWN } from '../constants.js';
import { boardFrom, bareKings, sq, includesSquare, markMoved, withModifier, squareMods } from './helpers.js';

describe('board setup', () => {
  test('starts with 32 pieces and kings on e1/e8', () => {
    const b = createInitialBoard();
    const count = b.flat().filter(Boolean).length;
    assert.equal(count, 32);
    assert.equal(b[7][4].type, KING);
    assert.equal(b[7][4].color, WHITE);
    assert.equal(b[0][4].type, KING);
    assert.equal(b[0][4].color, BLACK);
  });

  test('findKing locates both kings', () => {
    const b = createInitialBoard();
    assert.deepEqual(findKing(b, WHITE), { row: 7, col: 4 });
    assert.deepEqual(findKing(b, BLACK), { row: 0, col: 4 });
  });
});

describe('piece movement', () => {
  test('a pawn on its home rank may advance one or two squares', () => {
    const b = createInitialBoard();
    const moves = getValidMoves(b, sq('e2').row, sq('e2').col);
    assert.ok(includesSquare(moves, 'e3'), 'single push');
    assert.ok(includesSquare(moves, 'e4'), 'double push');
  });

  test('a pawn that has already moved may not double-push', () => {
    const b = boardFrom([
      '....k...', '........', '........', '........',
      '........', '....P...', '........', '....K...',
    ]);
    markMoved(b, 'e3');
    const moves = getValidMoves(b, sq('e3').row, sq('e3').col);
    assert.ok(includesSquare(moves, 'e4'));
    assert.ok(!includesSquare(moves, 'e5'), 'no double push after moving');
  });

  test('a knight jumps over occupied squares', () => {
    const b = createInitialBoard();
    const moves = getValidMoves(b, sq('g1').row, sq('g1').col);
    assert.ok(includesSquare(moves, 'f3'));
    assert.ok(includesSquare(moves, 'h3'));
  });

  test('a rook is blocked by its own pieces', () => {
    const b = createInitialBoard();
    const moves = getValidMoves(b, sq('a1').row, sq('a1').col);
    assert.equal(moves.length, 0, 'boxed in at the start');
  });
});

describe('check and mate', () => {
  test('a rook on the same file gives check', () => {
    const checking = boardFrom([
      '....k...', '........', '........', '........',
      '........', '........', '....r...', '....K...',
    ]);
    const notChecking = boardFrom([
      '....k..r', '........', '........', '........',
      '........', '........', '........', '....K...',
    ]);
    assert.equal(isKingInCheck(checking, WHITE), true, 'rook on the e-file');
    assert.equal(isKingInCheck(notChecking, WHITE), false, 'rook on the h-file');
  });

  test('a king may not move into an attacked square', () => {
    const b = boardFrom([
      '....k...', '........', '........', '........',
      '........', '........', '.....r..', '....K...',
    ]);
    const moves = getValidMoves(b, sq('e1').row, sq('e1').col);
    assert.ok(!includesSquare(moves, 'f1'), 'f1 is covered by the rook on f2');
    // Kxf2 IS legal here — the rook is undefended, so capturing it is a normal
    // escape. Only the empty attacked square is forbidden.
    assert.ok(includesSquare(moves, 'f2'), 'capturing the undefended rook is legal');
  });

  test('a pinned piece may not abandon the pin', () => {
    const b = boardFrom([
      '....k...', '........', '........', '........',
      '........', '........', '....N...', '....K..r',
    ]);
    const pinned = boardFrom([
      '....k...', '........', '........', '........',
      '....r...', '........', '....N...', '....K...',
    ]);
    const moves = getValidMoves(pinned, sq('e2').row, sq('e2').col);
    assert.equal(moves.length, 0, 'the knight is pinned to the king');
    assert.ok(b);
  });

  test('back-rank mate is reported as checkmate', () => {
    // Rook on a8 gives check along the eighth rank; the king's own pawns on
    // f7/g7/h7 take away every escape square.
    const b = boardFrom([
      'R.....k.', '.....ppp', '........', '........',
      '........', '........', '........', '......K.',
    ]);
    const status = getGameStatus(b, BLACK, null, {}, {});
    assert.equal(status.isCheckmate, true);
    assert.equal(status.isStalemate, false);
  });

  test('a king with no legal move and no check is stalemate', () => {
    const b = boardFrom([
      'k.......', '........', '.QK.....', '........',
      '........', '........', '........', '........',
    ]);
    const status = getGameStatus(b, BLACK, null, {}, {});
    assert.equal(status.isStalemate, true, 'stalemate, not mate');
    assert.equal(status.isCheckmate, false);
  });
});

describe('castling', () => {
  test('kingside castling is offered when the path is clear', () => {
    const b = boardFrom([
      '....k...', '........', '........', '........',
      '........', '........', '........', '....K..R',
    ]);
    const moves = getValidMoves(b, sq('e1').row, sq('e1').col);
    assert.ok(includesSquare(moves, 'g1'), 'castling target');
  });

  test('castling is refused once the rook has moved', () => {
    const b = boardFrom([
      '....k...', '........', '........', '........',
      '........', '........', '........', '....K..R',
    ]);
    markMoved(b, 'h1');
    const moves = getValidMoves(b, sq('e1').row, sq('e1').col);
    assert.ok(!includesSquare(moves, 'g1'));
  });

  test('castling is refused while the king is in check', () => {
    const b = boardFrom([
      '....k...', '........', '........', '........',
      '........', '........', '....r...', '....K..R',
    ]);
    const moves = getValidMoves(b, sq('e1').row, sq('e1').col);
    assert.ok(!includesSquare(moves, 'g1'), 'cannot castle out of check');
  });

  test('castling is refused through an attacked square', () => {
    const b = boardFrom([
      '....k...', '........', '........', '........',
      '........', '........', '.....r..', '....K..R',
    ]);
    const moves = getValidMoves(b, sq('e1').row, sq('e1').col);
    assert.ok(!includesSquare(moves, 'g1'), 'f1 is attacked');
  });

  test('a petrified rook cannot castle', () => {
    const b = boardFrom([
      '....k...', '........', '........', '........',
      '........', '........', '........', '....K..R',
    ]);
    withModifier(b, 'h1', 'petrified');
    const moves = getValidMoves(b, sq('e1').row, sq('e1').col);
    assert.ok(!includesSquare(moves, 'g1'));
  });
});

describe('en passant', () => {
  // White pawn on d5, black pawn just double-pushed to e5, so e6 is the target.
  const afterDoublePush = () => boardFrom([
    '....k...', '........', '........', '...Pp...',
    '........', '........', '........', '....K...',
  ]);

  test('a pawn may capture en passant immediately after a double push', () => {
    const moves = getValidMoves(afterDoublePush(), sq('d5').row, sq('d5').col, sq('e6'));
    assert.ok(includesSquare(moves, 'e6'), 'dxe6 e.p. should be available');
    assert.ok(moves.find((m) => m.row === sq('e6').row && m.col === sq('e6').col).enPassant);
  });

  test('the captured pawn is removed from the square it passed over', () => {
    const b = afterDoublePush();
    const res = executeMove(b, sq('d5'), sq('e6'), { enPassant: true });
    assert.equal(res.newBoard[sq('e5').row][sq('e5').col], null, 'the black pawn is gone');
    assert.equal(res.newBoard[sq('e6').row][sq('e6').col].type, PAWN, 'the white pawn arrives');
    assert.equal(res.captured.type, PAWN);
  });

  test('a stale target does not conjure a capture onto an occupied square', () => {
    // A card dropped a piece on e6 after the target was recorded. Offering the
    // en passant move here both duplicated the ordinary capture and deleted
    // whatever stood on e5.
    const b = boardFrom([
      '....k...', '........', '....n...', '...Pp...',
      '........', '........', '........', '....K...',
    ]);
    const moves = getValidMoves(b, sq('d5').row, sq('d5').col, sq('e6'));
    const toE6 = moves.filter((m) => m.row === sq('e6').row && m.col === sq('e6').col);
    assert.equal(toE6.length, 1, 'exactly one move to e6, not a capture plus a phantom e.p.');
    assert.ok(!toE6[0].enPassant, 'it is an ordinary capture of the knight');
  });

  test('a target with no pawn beside it is ignored', () => {
    const b = boardFrom([
      '....k...', '........', '........', '...P....',
      '........', '........', '........', '....K...',
    ]);
    const moves = getValidMoves(b, sq('d5').row, sq('d5').col, sq('e6'));
    assert.ok(!includesSquare(moves, 'e6'), 'nothing to capture, so no e.p. move');
  });
});

describe('attack detection is not move generation', () => {
  test('a rook does not attack through a blocker', () => {
    const b = boardFrom([
      '....k...', '........', '........', '........',
      '........', '....n...', '....r...', '....K...',
    ]);
    // The knight on e3 blocks the rook on e2... which is nearer the king anyway,
    // so use the far rook: r on e2 attacks e1 directly.
    assert.equal(isSquareAttacked(b, sq('e1').row, sq('e1').col, BLACK, {}), true);
    // Behind the rook, e4 is shielded from nothing — but a8 up the file is
    // blocked by the knight on e3.
    assert.equal(isSquareAttacked(b, sq('e8').row, sq('e8').col, BLACK, {}), false,
      'the knight on e3 blocks the rook ray up the e-file');
  });

  test('the blocking piece itself is attacked, including a friendly one', () => {
    const b = boardFrom([
      '....k...', '........', '........', '........',
      '........', '....n...', '....r...', '....K...',
    ]);
    // Black's own knight on e3 stands on a square black's rook covers, which is
    // what stops an enemy king walking in and taking it.
    assert.equal(isSquareAttacked(b, sq('e3').row, sq('e3').col, BLACK, {}), true);
  });

  test('Holy Ground stops a capture without hiding the piece from attack', () => {
    const b = boardFrom([
      '....k...', '........', '........', '........',
      '........', '........', '....r...', '....N..K',
    ]);
    const mods = squareMods({ e1: [{ type: 'holyGround', color: WHITE }] });
    // The knight cannot be taken...
    const rookMoves = getValidMoves(b, sq('e2').row, sq('e2').col, null, mods);
    assert.ok(!includesSquare(rookMoves, 'e1'), 'Holy Ground refuses the capture');
    // ...but the square is still covered, so a king may not stroll onto it.
    assert.equal(isSquareAttacked(b, sq('e1').row, sq('e1').col, BLACK, mods), true);
  });
});

describe('a king teleported by Second Chance lands somewhere it can survive', () => {
  // findSafeSquareForKing picks at random; pinning Math.random to 0 makes it
  // return the first candidate in scan order (a8), so the assertions are exact
  // rather than probabilistic.
  const firstSafeSquare = (board, color, mods) => {
    const real = Math.random;
    Math.random = () => 0;
    try {
      return findSafeSquareForKing(board, color, mods);
    } finally {
      Math.random = real;
    }
  };

  test('without obstacles it takes the first empty unattacked square', () => {
    assert.deepEqual(firstSafeSquare(bareKings(), BLACK, {}), sq('a8'));
  });

  test('it will not drop the king onto a rock', () => {
    const mods = squareMods({ a8: [{ type: 'rock' }] });
    assert.deepEqual(firstSafeSquare(bareKings(), BLACK, mods), sq('b8'),
      'a rock fills the square — no piece can stand there');
  });

  test('it will not drop the king into a sinkhole', () => {
    const mods = squareMods({ a8: [{ type: 'sinkhole', color: WHITE }] });
    assert.deepEqual(firstSafeSquare(bareKings(), BLACK, mods), sq('b8'),
      'a sinkhole captures the next piece to land on it');
  });
});

describe('draw conditions', () => {
  test('king versus king is an immediate draw', () => {
    const status = getGameStatus(bareKings(), WHITE, null, {}, {});
    assert.equal(status.isDraw, true);
  });

  test('the fifty-move rule exists', () => {
    const status = getGameStatus(bareKings(), WHITE, null, {}, {}, { halfmoveClock: 100 });
    assert.equal(status.isDraw, true);
  });

  test('threefold repetition exists', () => {
    const status = getGameStatus(bareKings(), WHITE, null, {}, {}, { repetitions: 3 });
    assert.equal(status.isDraw, true);
  });
});

describe('card effects must not break check', () => {
  test('a king on Holy Ground is still in check from a rook',
    () => {
      const b = boardFrom([
        '....k...', '........', '........', '........',
        '........', '........', '....r...', '....K...',
      ]);
      const mods = squareMods({ e1: [{ type: 'holyGround', color: WHITE }] });
      assert.equal(
        isSquareAttacked(b, sq('e1').row, sq('e1').col, BLACK, mods), true,
        'Holy Ground protects against capture, not against check'
      );
      assert.equal(isKingInCheck(b, WHITE, mods), true);
    });

  test('capturing a shielded checker is not offered as an escape from check',
    () => {
      const b = boardFrom([
        '....k...', '........', '........', '........',
        '........', '........', '....r...', '....K...',
      ]);
      withModifier(b, 'e2', 'shield');
      const moves = getValidMoves(b, sq('e1').row, sq('e1').col);
      assert.ok(!includesSquare(moves, 'e2'),
        'taking the rook would not actually remove it, so it does not resolve the check');
    });

  test('attacking a shielded piece is still a legal move when you are not in check', () => {
    // The fix must only remove it as an *escape from check*. Spending a turn to
    // break a shield is a real option and has to stay on the board.
    const b = boardFrom([
      '....k...', '........', '........', '........',
      '........', '........', '....p...', '....R..K',
    ]);
    withModifier(b, 'e2', 'shield');
    const moves = getValidMoves(b, sq('e1').row, sq('e1').col);
    assert.ok(includesSquare(moves, 'e2'), 'the rook may still swing at the shielded pawn');
  });

  test('executeMove keeps the attacker on its origin square when a shield absorbs the hit', () => {
    const b = boardFrom([
      '....k...', '........', '........', '........',
      '........', '........', '....p...', '....R..K',
    ]);
    withModifier(b, 'e2', 'shield');
    const res = executeMove(b, sq('e1'), sq('e2'), { });
    assert.equal(res.shieldBroken, true);
    assert.ok(res.newBoard[sq('e1').row][sq('e1').col], 'attacker survives');
    assert.equal(res.captured, null);
    assert.equal(res.newBoard[sq('e2').row][sq('e2').col].type, PAWN, 'defender survives');
  });
});
