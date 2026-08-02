// The card layer is allowed to bend chess. It is not allowed to break it.
//
// Every case here reproduces a bug that shipped: a card that left its own king
// in check, an effect that cancelled its own duplicate, a bounty that stayed on
// a square its victim had walked off. They are silent rule violations — no
// exception is thrown, the game just stops being chess — which is exactly the
// class of defect that survives a manual playthrough.
import { test, describe } from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

import { getValidCardTargets, canPlayCard, applyCardEffect, processTemporaryEffects } from '../cardLogic.js';
import { CARDS } from '../cardDefinitions.js';
import { isKingInCheck } from '../gameLogic.js';
import { WHITE, BLACK, PAWN, KING, PHASE_MOVE, PHASE_PROMOTION, PHASE_GAME_OVER, makePiece, nextPieceId, createInitialBoard } from '../constants.js';
import { gameReducer, createInitialState } from '../gameReducer.js';
import { boardFrom, sq, includesSquare, squareMods } from './helpers.js';

/** Minimal state shaped the way cardLogic reads it. */
const stateOn = (board, extra = {}) => ({
  board,
  currentPlayer: WHITE,
  squareModifiers: {},
  temporaryEffects: [],
  hands: { white: [], black: [] },
  deck: [],
  discardPile: [],
  capturedPieces: { white: [], black: [] },
  cardTargets: [],
  ...extra,
});

describe('pieces have stable identity', () => {
  test('a fresh board hands out 32 distinct ids', () => {
    const ids = createInitialBoard().flat().filter(Boolean).map((p) => p.id);
    assert.equal(ids.length, 32);
    assert.equal(new Set(ids).size, 32, 'no duplicates');
  });

  test('nextPieceId does not collide with anything already on the board', () => {
    const board = createInitialBoard();
    const id = nextPieceId(board);
    assert.ok(!board.flat().filter(Boolean).some((p) => p.id === id));
  });
});

describe('a card may not leave your own king in check', () => {
  // The white bishop on e2 is pinned to the king on e1 by the rook on e8.
  const pinned = () => boardFrom([
    '....r.k.', '........', '........', '........',
    '........', '........', '....B...', '....K...',
  ]);

  test('the pin is real', () => {
    assert.equal(isKingInCheck(pinned(), WHITE), false, 'not yet — the bishop blocks');
  });

  test('Switcheroo is safe by construction — the partner backfills the square', () => {
    // Worth pinning down: a swap cannot open a pin, because whatever leaves the
    // pinned square is immediately replaced by the piece it swapped with.
    const board = pinned();
    board[7][0] = makePiece('knight', WHITE, 99);
    const result = applyCardEffect(CARDS['17'], stateOn(board), [sq('e2'), sq('a1')]);
    assert.equal(isKingInCheck(result.board, WHITE), false, 'the knight now blocks instead');
  });

  test('Gambit can sacrifice the very piece holding the pin', () => {
    const board = pinned();
    board[0][0] = makePiece('knight', BLACK, 98); // something to capture
    const result = applyCardEffect(CARDS['18'], stateOn(board), [sq('e2'), sq('a8')]);
    assert.equal(
      isKingInCheck(result.board, WHITE), true,
      'the effect itself still produces the illegal position — the reducer is what must refuse it'
    );
  });

  test('Recall cannot pull a pinned piece off the file', () => {
    const board = pinned();
    const result = applyCardEffect(CARDS['19'], stateOn(board), [sq('e2'), sq('a1')]);
    assert.equal(isKingInCheck(result.board, WHITE), true);
  });
});

describe('Hasty Retreat does not treat the king as its own blocker', () => {
  test('a king fleeing along the checking file is not offered the next square down', () => {
    // Rook on e8, king on e2. Standing on e2 the king blocks the ray, so e3
    // measured as safe — it is not: it is still on the e-file.
    const board = boardFrom([
      '....r.k.', '........', '........', '........',
      '........', '........', '....K...', '........',
    ]);
    const targets = getValidCardTargets(CARDS['20'], stateOn(board), 0);
    assert.ok(!includesSquare(targets, 'e3'), 'e3 is still on the rook file');
    assert.ok(!includesSquare(targets, 'e1'), 'e1 too');
    assert.ok(includesSquare(targets, 'd3'), 'stepping off the file is fine');
  });

  test('it will not step onto a rock', () => {
    const board = boardFrom([
      '......k.', '........', '........', '........',
      '........', '........', '....K...', '........',
    ]);
    const mods = squareMods({ d3: [{ type: 'rock' }] });
    const targets = getValidCardTargets(CARDS['20'], stateOn(board, { squareModifiers: mods }), 0);
    assert.ok(!includesSquare(targets, 'd3'), 'a rock fills the square');
    assert.ok(includesSquare(targets, 'e3'), 'the rest are still available');
  });
});

describe('Sinkhole targets what the card says', () => {
  const board = () => boardFrom([
    '....k...', '...p....', '........', '........',
    '........', '........', '...P....', '....K...',
  ]);

  test('an enemy piece and empty squares are targetable', () => {
    const targets = getValidCardTargets(CARDS['13'], stateOn(board()), 0);
    assert.ok(includesSquare(targets, 'd7'), 'the enemy pawn');
    assert.ok(includesSquare(targets, 'd4'), 'an empty square, armed as a trap');
  });

  test('your own pieces are not', () => {
    const targets = getValidCardTargets(CARDS['13'], stateOn(board()), 0);
    assert.ok(!includesSquare(targets, 'd2'), 'you cannot feed it your own pawn');
  });

  test('neither king is', () => {
    const targets = getValidCardTargets(CARDS['13'], stateOn(board()), 0);
    assert.ok(!includesSquare(targets, 'e8'));
    assert.ok(!includesSquare(targets, 'e1'));
  });

  test('a piece under Vigil is not', () => {
    const b = board();
    b[1][3].modifiers = ['vigil'];
    const targets = getValidCardTargets(CARDS['13'], stateOn(b), 0);
    assert.ok(!includesSquare(targets, 'd7'), 'Sinkhole was one of three removal cards ignoring protection');
  });
});

describe('Catapult targets the piece the card describes', () => {
  test('rook, adjacent friendly pawn, enemy directly beyond', () => {
    // The canonical case, which the old dist >= 3 scan rejected outright.
    const board = boardFrom([
      '....k...', '........', '........', '........',
      '........', 'r.......', 'P.......', 'R...K...',
    ]);
    const state = stateOn(board, { cardTargets: [sq('a1')] });
    const targets = getValidCardTargets(CARDS['16'], state, 1);
    assert.ok(includesSquare(targets, 'a3'), 'the first enemy beyond the hop piece');
  });

  test('the hop piece must be adjacent', () => {
    const board = boardFrom([
      '....k...', '........', '........', '........',
      'r.......', 'P.......', '........', 'R...K...',
    ]);
    const state = stateOn(board, { cardTargets: [sq('a1')] });
    assert.equal(getValidCardTargets(CARDS['16'], state, 1).length, 0,
      'a2 is empty, so there is nothing to jump over');
  });

  test('an enemy standing before the hop piece is not jumped', () => {
    const board = boardFrom([
      '....k...', '........', '........', '........',
      '........', 'P.......', 'r.......', 'R...K...',
    ]);
    const state = stateOn(board, { cardTargets: [sq('a1')] });
    const targets = getValidCardTargets(CARDS['16'], state, 1);
    assert.equal(targets.length, 0, 'the enemy rook on a2 is the adjacent square, not a friendly piece');
  });
});

describe('duplicate cards do not cancel each other', () => {
  test('a second Petrify expiring does not unfreeze the first victim', () => {
    // Two black knights, both petrified by separate casts. The first effect
    // expires; only its own target should thaw.
    const board = boardFrom([
      '....k...', '........', 'n.n.....', '........',
      '........', '........', '........', '....K...',
    ]);
    const left = board[2][0];
    const right = board[2][2];
    left.modifiers = ['petrified'];
    right.modifiers = ['petrified'];

    const effects = [
      { type: 'petrified', pieceId: left.id, color: BLACK, turnsLeft: 1 },
      { type: 'petrified', pieceId: right.id, color: BLACK, turnsLeft: 4 },
    ];
    const out = processTemporaryEffects(effects, board, {}, WHITE);

    assert.ok(!out.board[2][0].modifiers.includes('petrified'), 'the expired one thaws');
    assert.ok(out.board[2][2].modifiers.includes('petrified'), 'the other stays frozen');
    assert.equal(out.temporaryEffects.length, 1);
  });
});

describe('Bounty follows the piece', () => {
  test('the effect records the piece, not the square', () => {
    const board = boardFrom([
      '....k...', '........', '..n.....', '........',
      '........', '........', '........', '....K...',
    ]);
    const knightId = board[2][2].id;
    const result = applyCardEffect(CARDS['8'], stateOn(board), [sq('c6')]);
    const bounty = result.temporaryEffects.find((e) => e.type === 'bounty');
    assert.equal(bounty.pieceId, knightId, 'named by id, so the mark travels');
    assert.equal(bounty.color, WHITE, 'and remembers who collects');
    assert.ok(result.board[2][2].modifiers.includes('bounty'));
  });
});

describe('multi-step cards do not advertise a dead end', () => {
  test('Recall is unplayable when the back rank is full', () => {
    // The opening position: every square on white's back rank is occupied, so
    // step 1 has no targets no matter which piece step 0 picks.
    const state = stateOn(createInitialBoard());
    assert.equal(canPlayCard(CARDS['19'], state), false);
  });

  test('Recall becomes playable once a back-rank square opens', () => {
    const board = createInitialBoard();
    board[7][0] = null; // a1 vacated
    assert.equal(canPlayCard(CARDS['19'], stateOn(board)), true);
  });

  test('Switcheroo needs two swappable pieces, not one', () => {
    const lonely = boardFrom([
      '....k...', '........', '........', '........',
      '........', '........', '....P...', '....K...',
    ]);
    assert.equal(canPlayCard(CARDS['17'], stateOn(lonely)), false, 'one pawn cannot swap with itself');
  });
});

describe('the reducer is what refuses the illegal play', () => {
  const withCard = (board, cardId) => ({
    ...createInitialState(),
    board,
    phase: PHASE_MOVE,
    cardPlayedThisTurn: false,
    hands: { white: [cardId], black: [] },
  });

  const pinnedBoard = () => {
    const b = boardFrom([
      '....r.k.', '........', '........', '........',
      '........', '........', '....B...', '....K...',
    ]);
    b[0][0] = makePiece('knight', BLACK, 98);
    return b;
  };

  test('Gambit that would expose the king is rejected and the card is kept', () => {
    const start = withCard(pinnedBoard(), '18');
    const step1 = gameReducer(start, { type: 'SELECT_CARD', cardId: '18', handIndex: 0 });
    const step2 = gameReducer(step1, { type: 'SELECT_CARD_TARGET', target: sq('e2') });
    const after = gameReducer(step2, { type: 'SELECT_CARD_TARGET', target: sq('a8') });

    assert.match(after.message, /leave your king in check/);
    assert.deepEqual(after.hands.white, ['18'], 'the card is not spent');
    assert.equal(after.activeCard, null, 'targeting mode is exited');
    assert.equal(isKingInCheck(after.board, WHITE), false, 'the board is untouched');
  });

  test('a legal Gambit still goes through', () => {
    // Same idea, but the sacrificed piece is not the one holding the pin.
    const b = pinnedBoard();
    b[7][0] = makePiece('knight', WHITE, 97);
    const start = withCard(b, '18');
    const step1 = gameReducer(start, { type: 'SELECT_CARD', cardId: '18', handIndex: 0 });
    const step2 = gameReducer(step1, { type: 'SELECT_CARD_TARGET', target: sq('a1') });
    const after = gameReducer(step2, { type: 'SELECT_CARD_TARGET', target: sq('a8') });

    assert.equal(after.hands.white.length, 0, 'the card is spent');
    assert.equal(after.board[0][0], null, 'the black knight is gone');
  });

  test('a pawn a card lands on the last rank goes to the promotion phase', () => {
    // Switcheroo swaps a pawn onto the eighth rank. Only executeMove used to
    // look for promotions, so it sat there as a pawn for the rest of the game.
    const b = boardFrom([
      'R.....k.', 'P.......', '........', '........',
      '........', '........', '........', '....K...',
    ]);
    const start = withCard(b, '17');
    const step1 = gameReducer(start, { type: 'SELECT_CARD', cardId: '17', handIndex: 0 });
    const step2 = gameReducer(step1, { type: 'SELECT_CARD_TARGET', target: sq('a7') });
    const after = gameReducer(step2, { type: 'SELECT_CARD_TARGET', target: sq('a8') });

    assert.equal(after.board[0][0].type, PAWN, 'the pawn is on a8');
    assert.equal(after.phase, PHASE_PROMOTION);
    assert.deepEqual(after.promotionSquare, sq('a8'));
  });
});

describe('Double Time', () => {
  const doubleTimeState = (board) => ({
    ...createInitialState(),
    board,
    phase: PHASE_MOVE,
    cardPlayedThisTurn: false,
    hands: { white: ['3'], black: [] },
  });

  const playCard = (s) => gameReducer(s, { type: 'SELECT_CARD', cardId: '3', handIndex: 0 });
  const move = (s, from, to) => gameReducer(
    gameReducer(s, { type: 'SELECT_PIECE', row: from.row, col: from.col }),
    { type: 'MAKE_MOVE', row: to.row, col: to.col }
  );

  test('grants a second move when the first does not give check', () => {
    const board = boardFrom([
      '.......k', '........', '........', '........',
      '........', '........', 'PP......', '....K...',
    ]);
    let s = playCard(doubleTimeState(board));
    assert.equal(s.movesRemainingThisTurn, 2);

    s = move(s, sq('a2'), sq('a3'));
    assert.equal(s.currentPlayer, WHITE, 'still your turn');
    assert.equal(s.movesRemainingThisTurn, 1);
  });

  test('forfeits the second move when the first gives check', () => {
    // Rook to h-file checks the black king on h8; the second move would have
    // been free rein to walk over and take it.
    const board = boardFrom([
      '.......k', '........', '........', '........',
      'R.......', '........', '........', '....K...',
    ]);
    let s = playCard(doubleTimeState(board));
    assert.equal(s.movesRemainingThisTurn, 2);

    s = move(s, sq('a4'), sq('h4'));
    assert.equal(s.currentPlayer, BLACK, 'the turn passes instead');
    assert.equal(s.message, 'Check!');
  });
});

describe('a turn with no legal move can still be ended', () => {
  test('a card that strands you ends the game instead of freezing it', () => {
    // White's king on h1 has one legal move, Kg1. Immovable Rock on g1 takes it
    // away: that is stalemate, and the reducer has to say so rather than leave
    // the player in the move phase with nothing clickable.
    const board = boardFrom([
      '.......k', '........', '........', '........',
      '........', '........', 'r.......', '.......K',
    ]);
    const start = {
      ...createInitialState(), board, phase: PHASE_MOVE,
      currentPlayer: WHITE, cardPlayedThisTurn: false,
      hands: { white: ['11'], black: [] },
    };
    const picked = gameReducer(start, { type: 'SELECT_CARD', cardId: '11', handIndex: 0 });
    const after = gameReducer(picked, { type: 'SELECT_CARD_TARGET', target: sq('g1') });

    assert.equal(after.phase, PHASE_GAME_OVER, 'the game settles rather than stalling');
    assert.equal(after.gameResult.reason, 'stalemate');
  });

  test('resigning ends the game for the other side', () => {
    const s = { ...createInitialState(), phase: PHASE_MOVE, currentPlayer: WHITE };
    const after = gameReducer(s, { type: 'RESIGN' });
    assert.equal(after.phase, PHASE_GAME_OVER);
    assert.equal(after.gameResult.winner, BLACK);
    assert.equal(after.gameResult.reason, 'resignation');
  });
});

describe('every ending names itself', () => {
  // The modal used to have two named cases and an `else` that read "Stalemate",
  // so resigning — and all three draw rules — announced a stalemate that had not
  // happened. These are the reasons the reducer can actually produce.
  const REASONS = [
    'checkmate', 'stalemate', 'resignation',
    'insufficient material', 'fifty-move rule', 'threefold repetition',
  ];

  test('the modal has a distinct line for each one', async () => {
    const src = await readFile(
      new URL('../components/GameOverModal.jsx', import.meta.url), 'utf8'
    );
    for (const reason of REASONS) {
      assert.ok(
        src.includes(`'${reason}'`) || src.includes(`${reason}:`),
        `GameOverModal does not handle "${reason}" and would fall back`
      );
    }
    assert.ok(!/\}\s*else\s*\{\s*\n\s*title = 'Stalemate'/.test(src),
      'no catch-all that calls everything a stalemate');
  });

  test('resigning reports resignation, not a draw', () => {
    const s = { ...createInitialState(), phase: PHASE_MOVE, currentPlayer: WHITE };
    const after = gameReducer(s, { type: 'RESIGN' });
    assert.equal(after.gameResult.reason, 'resignation');
    assert.equal(after.gameResult.winner, BLACK);
  });
});
