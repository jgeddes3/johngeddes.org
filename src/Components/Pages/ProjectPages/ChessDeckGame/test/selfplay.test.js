// Whole games driven through the real reducer, cards included.
//
// Every other test in this suite asks a targeted question. This one just plays
// the game and asserts the invariants that must hold no matter what sequence of
// cards and moves comes up:
//
//   - a turn never ends with the mover's own king attacked
//   - neither king ever leaves the board
//   - a dispatched move always changes the state, so the UI cannot spin
//   - the game reaches a conclusion rather than stalling
//
// Six AI-vs-AI games used to produce zero exceptions while breaking all four of
// those, because every defect in the card layer was a silent rule violation.
//
// One game by default — the AI's search makes each take ~12s, and a suite you
// hesitate to run is a suite that stops being run. SELFPLAY_GAMES=25 for the
// thorough sweep.
import { test, describe } from 'node:test';
import assert from 'node:assert/strict';

import { gameReducer, createInitialState } from '../gameReducer.js';
import { chooseBestMove, chooseCardAction } from '../ai.js';
import { isKingInCheck, findKing } from '../gameLogic.js';
import { WHITE, BLACK, PHASE_DRAW, PHASE_MOVE, PHASE_PROMOTION, PHASE_GAME_OVER } from '../constants.js';

const GAMES = Number(process.env.SELFPLAY_GAMES || 1);
const MAX_STEPS = 4000;

function playOneGame(violations) {
  let s = createInitialState();
  let steps = 0;

  while (s.phase !== PHASE_GAME_OVER && steps++ < MAX_STEPS) {
    const mover = s.currentPlayer;

    if (s.phase === PHASE_DRAW) { s = gameReducer(s, { type: 'DRAW_CARD' }); continue; }
    if (s.phase === PHASE_PROMOTION) { s = gameReducer(s, { type: 'CHOOSE_PROMOTION', pieceType: 'queen' }); continue; }
    if (s.phase !== PHASE_MOVE) break;

    if (!s.cardPlayedThisTurn) {
      const action = chooseCardAction(s);
      if (action) {
        let next = gameReducer(s, { type: 'SELECT_CARD', cardId: action.cardId, handIndex: action.handIndex });
        for (const t of action.targets || []) next = gameReducer(next, { type: 'SELECT_CARD_TARGET', target: t });
        if (next.activeCard) next = gameReducer(next, { type: 'CANCEL_CARD' });
        s = next;
        if (s.phase !== PHASE_MOVE || s.currentPlayer !== mover) continue;
      }
    }

    const move = chooseBestMove(s);
    if (!move) { s = gameReducer(s, { type: 'PASS_TURN' }); continue; }

    const before = s;
    s = gameReducer(s, { type: 'SELECT_PIECE', row: move.from.row, col: move.from.col });
    s = gameReducer(s, { type: 'MAKE_MOVE', row: move.to.row, col: move.to.col });

    if (s === before) { violations.push('a dispatched move changed nothing — the UI would spin'); break; }
    if (s.currentPlayer !== mover && isKingInCheck(s.board, mover, s.squareModifiers)) {
      violations.push(`${mover} ended the turn with its own king in check`);
      break;
    }
    if (!findKing(s.board, WHITE) || !findKing(s.board, BLACK)) {
      violations.push(`a king left the board (${s.gameResult?.reason})`);
      break;
    }
  }

  return { finished: s.phase === PHASE_GAME_OVER, reason: s.gameResult?.reason, steps };
}

describe('self-play', () => {
  test(`${GAMES} full games break no rules and all reach a conclusion`, () => {
    const violations = [];
    const results = [];

    for (let i = 0; i < GAMES; i++) results.push(playOneGame(violations));

    assert.deepEqual(violations, [], 'rule violations during self-play');

    const unfinished = results.filter((r) => !r.finished);
    assert.equal(
      unfinished.length, 0,
      `${unfinished.length} game(s) never concluded — before the draw rules existed, a third of them ran forever`
    );
  });
});
