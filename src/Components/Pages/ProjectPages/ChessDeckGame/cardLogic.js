import {
  WHITE, BLACK, KING, PAWN, KNIGHT, ROOK,
} from './constants.js';
import { deepCloneBoard, isSquareAttacked, findKing } from './gameLogic.js';

// ── Can a card be played? ────────────────────────────────────────────

export function canPlayCard(card, state) {
  // Passive cards can't be actively played
  if (card.isPassive) return false;

  // For instant cards, always playable (unless Sabotage with no opponent cards)
  if (card.targetType === 'none') {
    if (card.id === '4') { // Sabotage
      const opp = state.currentPlayer === WHITE ? BLACK : WHITE;
      return state.hands[opp].length > 0;
    }
    return true;
  }
  return hasCompletableTargets(card, state);
}

/**
 * Can this card actually be seen through to its last step?
 *
 * Only step 0 used to be checked, so a multi-step card could advertise itself
 * as playable and then dead-end with nothing highlighted — at the opening,
 * Recall offered every piece and then zero back-rank squares, leaving the
 * player stuck in targeting mode with the Cancel button below the fold.
 *
 * Step-0 lists are bounded by piece count rather than by squares, so walking
 * them is cheap.
 */
function hasCompletableTargets(card, state, step = 0, chosen = []) {
  const steps = card.targetSteps || 1;
  const targets = getValidCardTargets(card, { ...state, cardTargets: chosen }, step);
  if (targets.length === 0) return false;
  if (step + 1 >= steps) return true;
  return targets.some(t => hasCompletableTargets(card, state, step + 1, [...chosen, t]));
}

// ── Get valid targets for a card at a given step ─────────────────────

export function getValidCardTargets(card, state, step = 0) {
  const { board, currentPlayer, squareModifiers } = state;
  const opp = currentPlayer === WHITE ? BLACK : WHITE;

  // Is this enemy piece shielded from being chosen as a card target?
  // Covers Watchtower (protects an area) and Vigil (protects one piece), so
  // every enemy-targeting card honours both without repeating the check.
  function isCardProtected(r, c) {
    const piece = board[r][c];
    if (piece && piece.color !== currentPlayer && (piece.modifiers || []).includes('vigil')) {
      return true;
    }
    return isProtectedByWatchtower(r, c);
  }

  // Check watchtower protection for enemy piece targeting
  function isProtectedByWatchtower(r, c) {
    const piece = board[r][c];
    if (!piece || piece.color === currentPlayer) return false;
    // Check if there's a watchtower owned by the opponent within 2 squares
    for (const [key, mods] of Object.entries(squareModifiers)) {
      const wt = mods.find(m => m.type === 'watchtower' && m.color === opp);
      if (wt) {
        const [wr, wc] = key.split('-').map(Number);
        const dist = Math.max(Math.abs(r - wr), Math.abs(c - wc));
        if (dist <= 2) return true;
      }
    }
    return false;
  }

  const targets = [];

  switch (card.id) {
    // Fortify: any square adjacent to at least one friendly pawn without shield
    case '1': {
      for (let r = 0; r < 8; r++) {
        for (let c = 0; c < 8; c++) {
          let hasAdjacentPawn = false;
          for (let dr = -1; dr <= 1 && !hasAdjacentPawn; dr++) {
            for (let dc = -1; dc <= 1 && !hasAdjacentPawn; dc++) {
              if (dr === 0 && dc === 0) continue;
              const nr = r + dr, nc = c + dc;
              if (nr < 0 || nr > 7 || nc < 0 || nc > 7) continue;
              const p = board[nr][nc];
              if (p && p.color === currentPlayer && p.type === PAWN && !p.modifiers.includes('shield')) {
                hasAdjacentPawn = true;
              }
            }
          }
          if (hasAdjacentPawn) targets.push({ row: r, col: c });
        }
      }
      break;
    }

    // Stallion Spirit: own non-knight
    case '5': {
      for (let r = 0; r < 8; r++) {
        for (let c = 0; c < 8; c++) {
          const p = board[r][c];
          if (p && p.color === currentPlayer && p.type !== KNIGHT && p.type !== KING) {
            targets.push({ row: r, col: c });
          }
        }
      }
      break;
    }

    // Petrify: enemy non-king
    case '6': {
      for (let r = 0; r < 8; r++) {
        for (let c = 0; c < 8; c++) {
          const p = board[r][c];
          if (p && p.color === opp && p.type !== KING && !isCardProtected(r, c)) {
            targets.push({ row: r, col: c });
          }
        }
      }
      break;
    }

    // Promotion Decree: own pawn
    case '7': {
      for (let r = 0; r < 8; r++) {
        for (let c = 0; c < 8; c++) {
          const p = board[r][c];
          if (p && p.color === currentPlayer && p.type === PAWN) {
            targets.push({ row: r, col: c });
          }
        }
      }
      break;
    }

    // Bounty: enemy non-king
    case '8': {
      for (let r = 0; r < 8; r++) {
        for (let c = 0; c < 8; c++) {
          const p = board[r][c];
          if (p && p.color === opp && p.type !== KING && !isCardProtected(r, c)) {
            targets.push({ row: r, col: c });
          }
        }
      }
      break;
    }

    // Vigil: own non-king
    case '9': {
      for (let r = 0; r < 8; r++) {
        for (let c = 0; c < 8; c++) {
          const p = board[r][c];
          if (p && p.color === currentPlayer && p.type !== KING) {
            targets.push({ row: r, col: c });
          }
        }
      }
      break;
    }

    // Excommunicate: enemy non-king, non-pawn
    case '10': {
      for (let r = 0; r < 8; r++) {
        for (let c = 0; c < 8; c++) {
          const p = board[r][c];
          if (p && p.color === opp && p.type !== KING && p.type !== PAWN && !isCardProtected(r, c)) {
            targets.push({ row: r, col: c });
          }
        }
      }
      break;
    }

    // Immovable Rock: empty square
    case '11': {
      for (let r = 0; r < 8; r++) {
        for (let c = 0; c < 8; c++) {
          if (!board[r][c] && !hasSquareMod(squareModifiers, r, c, 'rock')) {
            targets.push({ row: r, col: c });
          }
        }
      }
      break;
    }

    // Holy Ground: empty square
    case '12': {
      for (let r = 0; r < 8; r++) {
        for (let c = 0; c < 8; c++) {
          if (!board[r][c]) {
            targets.push({ row: r, col: c });
          }
        }
      }
      break;
    }

    // Sinkhole: any square without a king
    // Sinkhole: an empty square to arm as a trap, or an enemy piece to swallow
    // now. It used to accept any non-king square, so you could feed it your own
    // pieces, and it was one of the three removal cards that ignored Watchtower
    // entirely — the card that most needed to respect it.
    case '13': {
      for (let r = 0; r < 8; r++) {
        for (let c = 0; c < 8; c++) {
          const p = board[r][c];
          if (!p) {
            targets.push({ row: r, col: c });
          } else if (p.color === opp && p.type !== KING && !isCardProtected(r, c)) {
            targets.push({ row: r, col: c });
          }
        }
      }
      break;
    }

    // Watchtower: empty square
    case '14': {
      for (let r = 0; r < 8; r++) {
        for (let c = 0; c < 8; c++) {
          if (!board[r][c]) {
            targets.push({ row: r, col: c });
          }
        }
      }
      break;
    }

    // Conscription: own second rank, empty
    case '15': {
      const secondRank = currentPlayer === WHITE ? 6 : 1;
      for (let c = 0; c < 8; c++) {
        if (!board[secondRank][c]) {
          targets.push({ row: secondRank, col: c });
        }
      }
      break;
    }

    // Catapult: step 0 = own rook, step 1 = valid catapult target
    case '16': {
      if (step === 0) {
        for (let r = 0; r < 8; r++) {
          for (let c = 0; c < 8; c++) {
            const p = board[r][c];
            if (p && p.color === currentPlayer && p.type === ROOK) {
              targets.push({ row: r, col: c });
            }
          }
        }
      } else {
        // "Your rook jumps over one adjacent friendly piece and captures the
        // first enemy piece beyond." The old scan matched none of that: the hop
        // piece could be any distance away, an enemy standing before it was
        // silently jumped, and `dist >= 3` excluded the first enemy beyond —
        // which is the only one the card is about. The canonical case (rook,
        // own pawn next to it, enemy behind the pawn) produced zero targets, so
        // the card was usually unplayable.
        const rookPos = state.cardTargets[0];
        if (rookPos) {
          for (const [dr, dc] of [[0, 1], [0, -1], [1, 0], [-1, 0]]) {
            const hop = board[rookPos.row + dr]?.[rookPos.col + dc];
            if (!hop || hop.color !== currentPlayer) continue; // must be adjacent and friendly

            let r = rookPos.row + 2 * dr;
            let c = rookPos.col + 2 * dc;
            while (r >= 0 && r < 8 && c >= 0 && c < 8) {
              if (hasSquareMod(squareModifiers, r, c, 'rock')) break;
              const p = board[r][c];
              if (p) {
                // The first piece beyond the hop, and only if it is a takeable enemy.
                if (p.color === opp && p.type !== KING && !isCardProtected(r, c)) {
                  targets.push({ row: r, col: c });
                }
                break;
              }
              r += dr;
              c += dc;
            }
          }
        }
      }
      break;
    }

    // Switcheroo: step 0 = own non-king, step 1 = own non-king (different from step 0)
    case '17': {
      if (step === 0) {
        for (let r = 0; r < 8; r++) {
          for (let c = 0; c < 8; c++) {
            const p = board[r][c];
            if (p && p.color === currentPlayer && p.type !== KING) {
              targets.push({ row: r, col: c });
            }
          }
        }
      } else {
        const first = state.cardTargets[0];
        for (let r = 0; r < 8; r++) {
          for (let c = 0; c < 8; c++) {
            if (r === first.row && c === first.col) continue;
            const p = board[r][c];
            if (p && p.color === currentPlayer && p.type !== KING) {
              targets.push({ row: r, col: c });
            }
          }
        }
      }
      break;
    }

    // Gambit: step 0 = own non-king, step 1 = enemy non-king
    case '18': {
      if (step === 0) {
        for (let r = 0; r < 8; r++) {
          for (let c = 0; c < 8; c++) {
            const p = board[r][c];
            if (p && p.color === currentPlayer && p.type !== KING) {
              targets.push({ row: r, col: c });
            }
          }
        }
      } else {
        for (let r = 0; r < 8; r++) {
          for (let c = 0; c < 8; c++) {
            const p = board[r][c];
            if (p && p.color === opp && p.type !== KING && !isCardProtected(r, c)) {
              targets.push({ row: r, col: c });
            }
          }
        }
      }
      break;
    }

    // Recall: step 0 = own non-king piece, step 1 = empty back rank square
    case '19': {
      if (step === 0) {
        for (let r = 0; r < 8; r++) {
          for (let c = 0; c < 8; c++) {
            const p = board[r][c];
            if (p && p.color === currentPlayer && p.type !== KING) {
              targets.push({ row: r, col: c });
            }
          }
        }
      } else {
        const backRank = currentPlayer === WHITE ? 7 : 0;
        for (let c = 0; c < 8; c++) {
          if (!board[backRank][c]) {
            targets.push({ row: backRank, col: c });
          }
        }
      }
      break;
    }

    // Hasty Retreat: king's adjacent empty safe squares
    case '20': {
      const kingPos = findKing(board, currentPlayer);
      if (kingPos) {
        // Test safety on a board with the king lifted off. Standing on its own
        // square, the king blocks the very ray it is fleeing along, so sliding
        // back one square down a checking rook's file measured as "safe" —
        // the king's own body was the blocker.
        const lifted = deepCloneBoard(board);
        lifted[kingPos.row][kingPos.col] = null;

        for (let dr = -1; dr <= 1; dr++) {
          for (let dc = -1; dc <= 1; dc++) {
            if (dr === 0 && dc === 0) continue;
            const r = kingPos.row + dr;
            const c = kingPos.col + dc;
            if (r < 0 || r > 7 || c < 0 || c > 7) continue;
            if (board[r][c]) continue;
            if (hasSquareMod(squareModifiers, r, c, 'rock')) continue;
            if (!isSquareAttacked(lifted, r, c, opp, squareModifiers)) {
              targets.push({ row: r, col: c });
            }
          }
        }
      }
      break;
    }

    default:
      break;
  }

  return targets;
}

// ── Apply card effect ────────────────────────────────────────────────

export function applyCardEffect(card, state, targets) {
  const newState = { ...state };
  const board = deepCloneBoard(state.board);
  const squareMods = { ...state.squareModifiers };
  const tempEffects = [...state.temporaryEffects];
  const capturedPieces = {
    white: [...state.capturedPieces.white],
    black: [...state.capturedPieces.black],
  };
  const currentPlayer = state.currentPlayer;
  const opp = currentPlayer === WHITE ? BLACK : WHITE;

  switch (card.id) {
    // Fortify: shield all friendly pawns adjacent to selected square
    case '1': {
      const t = targets[0];
      for (let dr = -1; dr <= 1; dr++) {
        for (let dc = -1; dc <= 1; dc++) {
          if (dr === 0 && dc === 0) continue;
          const nr = t.row + dr, nc = t.col + dc;
          if (nr < 0 || nr > 7 || nc < 0 || nc > 7) continue;
          const p = board[nr][nc];
          if (p && p.color === currentPlayer && p.type === PAWN && !p.modifiers.includes('shield')) {
            board[nr][nc] = { ...p, modifiers: [...p.modifiers, 'shield'] };
          }
        }
      }
      break;
    }

    // Fog of War
    case '2': {
      newState.fogActive = currentPlayer; // current player's pieces are fogged for opponent's turn
      break;
    }

    // Double Time
    case '3': {
      newState.movesRemainingThisTurn = 2;
      break;
    }

    // Sabotage
    case '4': {
      const oppHand = [...state.hands[opp]];
      if (oppHand.length > 0) {
        const idx = Math.floor(Math.random() * oppHand.length);
        const discarded = oppHand.splice(idx, 1)[0];
        newState.hands = { ...state.hands, [opp]: oppHand };
        newState.discardPile = [...state.discardPile, discarded];
      }
      break;
    }

    // Stallion Spirit
    case '5': {
      const t = targets[0];
      const p = board[t.row][t.col];
      if (p) {
        board[t.row][t.col] = { ...p, modifiers: [...p.modifiers, 'knightMovement'] };
        tempEffects.push({
          type: 'knightMovement',
          pieceId: p.id,
          row: t.row, col: t.col,
          color: currentPlayer,
          turnsLeft: 6, // 3 of each player's turns = 6 half-turns
        });
      }
      break;
    }

    // Petrify
    case '6': {
      const t = targets[0];
      const p = board[t.row][t.col];
      if (p) {
        board[t.row][t.col] = { ...p, modifiers: [...p.modifiers, 'petrified'] };
        tempEffects.push({
          type: 'petrified',
          pieceId: p.id,
          row: t.row, col: t.col,
          color: opp,
          turnsLeft: 4, // 2 of opponent's turns = 4 half-turns
        });
      }
      break;
    }

    // Promotion Decree — triggers promotion modal-like behavior, but we'll promote inline
    // For simplicity, auto-promote to queen. Or we could set promotionSquare.
    // Let's set a special state to trigger the promotion modal.
    case '7': {
      const t = targets[0];
      // We'll handle this in the reducer by setting promotionSquare
      newState.promotionSquare = { row: t.row, col: t.col };
      newState.phase = 'promotion';
      break;
    }

    // Bounty — "Mark an enemy piece". The mark used to be recorded against the
    // square, so it died the moment the piece moved off it, and capturing an
    // unrelated piece that later stood there paid out instead.
    case '8': {
      const t = targets[0];
      const p = board[t.row][t.col];
      if (p) {
        board[t.row][t.col] = { ...p, modifiers: [...p.modifiers, 'bounty'] };
        tempEffects.push({
          type: 'bounty',
          pieceId: p.id,
          color: currentPlayer, // who collects the reward
          turnsLeft: 6, // 3 turns = 6 half-turns
        });
      }
      break;
    }

    // Vigil
    case '9': {
      const t = targets[0];
      const p = board[t.row][t.col];
      if (p) {
        board[t.row][t.col] = { ...p, modifiers: [...p.modifiers, 'vigil'] };
        tempEffects.push({
          type: 'vigil',
          pieceId: p.id,
          row: t.row, col: t.col,
          color: currentPlayer,
          turnsLeft: 4,
        });
      }
      break;
    }

    // Excommunicate
    case '10': {
      const t = targets[0];
      const p = board[t.row][t.col];
      if (p) {
        board[t.row][t.col] = { ...p, type: PAWN, modifiers: p.modifiers.filter(m => m !== 'knightMovement') };
      }
      break;
    }

    // Immovable Rock
    case '11': {
      const t = targets[0];
      const key = `${t.row}-${t.col}`;
      squareMods[key] = [...(squareMods[key] || []), { type: 'rock' }];
      break;
    }

    // Holy Ground
    case '12': {
      const t = targets[0];
      const key = `${t.row}-${t.col}`;
      squareMods[key] = [...(squareMods[key] || []), { type: 'holyGround', color: currentPlayer }];
      tempEffects.push({
        type: 'holyGround',
        squareKey: key,
        color: currentPlayer,
        turnsLeft: 8, // 4 turns = 8 half-turns
      });
      break;
    }

    // Sinkhole
    case '13': {
      const t = targets[0];
      const p = board[t.row][t.col];
      if (p && p.type !== KING) {
        // Capture the piece on the square
        capturedPieces[currentPlayer] = [...capturedPieces[currentPlayer], p];
        board[t.row][t.col] = null;
      } else if (!p) {
        // Place a sinkhole trap
        const key = `${t.row}-${t.col}`;
        squareMods[key] = [...(squareMods[key] || []), { type: 'sinkhole', color: currentPlayer }];
      }
      break;
    }

    // Watchtower
    case '14': {
      const t = targets[0];
      const key = `${t.row}-${t.col}`;
      squareMods[key] = [...(squareMods[key] || []), { type: 'watchtower', color: currentPlayer }];
      tempEffects.push({
        type: 'watchtower',
        squareKey: key,
        color: currentPlayer,
        turnsLeft: 6,
      });
      break;
    }

    // Conscription
    case '15': {
      const t = targets[0];
      board[t.row][t.col] = { type: PAWN, color: currentPlayer, hasMoved: false, modifiers: [] };
      break;
    }

    // Catapult
    case '16': {
      const rookPos = targets[0];
      const enemyPos = targets[1];
      const enemyPiece = board[enemyPos.row][enemyPos.col];
      if (enemyPiece) {
        capturedPieces[currentPlayer] = [...capturedPieces[currentPlayer], enemyPiece];
      }
      // Move rook to enemy position
      board[enemyPos.row][enemyPos.col] = { ...board[rookPos.row][rookPos.col], hasMoved: true };
      board[rookPos.row][rookPos.col] = null;
      break;
    }

    // Switcheroo
    case '17': {
      const pos1 = targets[0];
      const pos2 = targets[1];
      const piece1 = board[pos1.row][pos1.col];
      const piece2 = board[pos2.row][pos2.col];
      board[pos1.row][pos1.col] = piece2;
      board[pos2.row][pos2.col] = piece1;
      break;
    }

    // Gambit
    case '18': {
      const sacrificePos = targets[0];
      const enemyPos = targets[1];
      const sacrificedPiece = board[sacrificePos.row][sacrificePos.col];
      const enemyPiece = board[enemyPos.row][enemyPos.col];
      if (sacrificedPiece) {
        capturedPieces[opp] = [...capturedPieces[opp], sacrificedPiece];
      }
      if (enemyPiece) {
        capturedPieces[currentPlayer] = [...capturedPieces[currentPlayer], enemyPiece];
      }
      board[sacrificePos.row][sacrificePos.col] = null;
      board[enemyPos.row][enemyPos.col] = null;
      break;
    }

    // Recall
    case '19': {
      const piecePos = targets[0];
      const destPos = targets[1];
      board[destPos.row][destPos.col] = board[piecePos.row][piecePos.col];
      board[piecePos.row][piecePos.col] = null;
      break;
    }

    // Hasty Retreat
    case '20': {
      const dest = targets[0];
      const kingPos = findKing(board, currentPlayer);
      if (kingPos) {
        board[dest.row][dest.col] = { ...board[kingPos.row][kingPos.col], hasMoved: true };
        board[kingPos.row][kingPos.col] = null;
      }
      break;
    }

    default:
      break;
  }

  return {
    ...newState,
    board,
    squareModifiers: squareMods,
    temporaryEffects: tempEffects,
    capturedPieces,
  };
}

// ── Process temporary effects at end of turn ─────────────────────────

export function processTemporaryEffects(effects, boardIn, squareModsIn, currentPlayer) {
  const board = deepCloneBoard(boardIn);
  const squareMods = {};
  // Deep copy squareMods
  for (const [key, mods] of Object.entries(squareModsIn)) {
    squareMods[key] = mods.map(m => ({ ...m }));
  }

  const remaining = [];

  for (const effect of effects) {
    const newTurns = effect.turnsLeft - 1;
    if (newTurns <= 0) {
      // Effect expired — remove modifiers from pieces/squares
      removeEffectFromBoard(effect, board, squareMods);
    } else {
      remaining.push({ ...effect, turnsLeft: newTurns });
      // Update tracking for moved pieces (bounty, vigil)
      // Bounty and vigil track by position, which may have changed
    }
  }

  // Clean up empty square modifier entries
  for (const key of Object.keys(squareMods)) {
    if (squareMods[key].length === 0) delete squareMods[key];
  }

  return { temporaryEffects: remaining, board, squareModifiers: squareMods };
}

/**
 * Strip a piece modifier when its effect expires — from the one piece the
 * effect was cast on, found by id.
 *
 * This used to scan the board and clear the modifier from every piece of that
 * colour, which meant two copies of the same card cancelled each other: a
 * second Petrify expiring unfroze the first victim early and left a phantom
 * effect ticking. With two copies of every card in the deck it fired routinely.
 */
function removePieceModifier(effect, board, modifier) {
  for (let r = 0; r < 8; r++) {
    for (let c = 0; c < 8; c++) {
      const p = board[r][c];
      if (!p || !p.modifiers.includes(modifier)) continue;
      // Fall back to the old colour-wide sweep only for effects saved before
      // pieces had ids, so a game in progress still expires cleanly.
      const matches = effect.pieceId != null ? p.id === effect.pieceId : p.color === effect.color;
      if (matches) {
        board[r][c] = { ...p, modifiers: p.modifiers.filter(m => m !== modifier) };
        if (effect.pieceId != null) return;
      }
    }
  }
}

function removeEffectFromBoard(effect, board, squareMods) {
  switch (effect.type) {
    case 'knightMovement':
      removePieceModifier(effect, board, 'knightMovement');
      break;
    case 'petrified':
      removePieceModifier(effect, board, 'petrified');
      break;
    case 'bounty':
      removePieceModifier(effect, board, 'bounty');
      break;
    case 'vigil':
      removePieceModifier(effect, board, 'vigil');
      break;
    case 'holyGround': {
      const key = effect.squareKey;
      if (squareMods[key]) {
        squareMods[key] = squareMods[key].filter(m => !(m.type === 'holyGround' && m.color === effect.color));
      }
      break;
    }
    case 'watchtower': {
      const key = effect.squareKey;
      if (squareMods[key]) {
        squareMods[key] = squareMods[key].filter(m => !(m.type === 'watchtower' && m.color === effect.color));
      }
      break;
    }
    default:
      break;
  }
}

// ── Helpers ──────────────────────────────────────────────────────────

function hasSquareMod(squareMods, r, c, type) {
  const key = `${r}-${c}`;
  return squareMods[key] && squareMods[key].some(m => m.type === type);
}
