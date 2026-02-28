import {
  WHITE, BLACK, KING, PAWN, KNIGHT, ROOK,
} from './constants';
import { deepCloneBoard, isSquareAttacked, findKing } from './gameLogic';

// ── Can a card be played? ────────────────────────────────────────────

export function canPlayCard(card, state) {
  const targets = getValidCardTargets(card, state, 0);
  // For instant cards, always playable (unless Sabotage with no opponent cards)
  if (card.targetType === 'none') {
    if (card.id === '4') { // Sabotage
      const opp = state.currentPlayer === WHITE ? BLACK : WHITE;
      return state.hands[opp].length > 0;
    }
    return true;
  }
  return targets.length > 0;
}

// ── Get valid targets for a card at a given step ─────────────────────

export function getValidCardTargets(card, state, step = 0) {
  const { board, currentPlayer, squareModifiers } = state;
  const opp = currentPlayer === WHITE ? BLACK : WHITE;

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
          if (p && p.color === opp && p.type !== KING && !isProtectedByWatchtower(r, c)) {
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
          if (p && p.color === opp && p.type !== KING && !isProtectedByWatchtower(r, c)) {
            targets.push({ row: r, col: c });
          }
        }
      }
      break;
    }

    // Bodyguard: own non-king
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
          if (p && p.color === opp && p.type !== KING && p.type !== PAWN && !isProtectedByWatchtower(r, c)) {
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
    case '13': {
      for (let r = 0; r < 8; r++) {
        for (let c = 0; c < 8; c++) {
          const p = board[r][c];
          if (!p || p.type !== KING) {
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
        // From the rook, find valid catapult targets
        const rookPos = state.cardTargets[0];
        if (rookPos) {
          const dirs = [[0,1],[0,-1],[1,0],[-1,0]];
          for (const [dr, dc] of dirs) {
            let r = rookPos.row + dr;
            let c = rookPos.col + dc;
            let foundFriendly = false;
            let dist = 1;
            while (r >= 0 && r < 8 && c >= 0 && c < 8) {
              const p = board[r][c];
              if (!foundFriendly) {
                if (p && p.color === currentPlayer) {
                  foundFriendly = true;
                }
              } else {
                if (p) {
                  if (p.color === opp && dist >= 3) {
                    targets.push({ row: r, col: c });
                  }
                  break;
                }
              }
              r += dr;
              c += dc;
              dist++;
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
            if (p && p.color === opp && p.type !== KING) {
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
        for (let dr = -1; dr <= 1; dr++) {
          for (let dc = -1; dc <= 1; dc++) {
            if (dr === 0 && dc === 0) continue;
            const r = kingPos.row + dr;
            const c = kingPos.col + dc;
            if (r < 0 || r > 7 || c < 0 || c > 7) continue;
            if (board[r][c]) continue;
            // Check safety
            if (!isSquareAttacked(board, r, c, opp, squareModifiers)) {
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
    // Fortify: shield all unmoved pieces
    case '1': {
      for (let r = 0; r < 8; r++) {
        for (let c = 0; c < 8; c++) {
          const p = board[r][c];
          if (p && p.color === currentPlayer && !p.hasMoved && !p.modifiers.includes('shield')) {
            board[r][c] = { ...p, modifiers: [...p.modifiers, 'shield'] };
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

    // Bounty
    case '8': {
      const t = targets[0];
      tempEffects.push({
        type: 'bounty',
        targetRow: t.row, targetCol: t.col,
        color: currentPlayer,
        turnsLeft: 6, // 3 turns = 6 half-turns
      });
      const p = board[t.row][t.col];
      if (p) {
        board[t.row][t.col] = { ...p, modifiers: [...p.modifiers, 'bounty'] };
      }
      break;
    }

    // Bodyguard
    case '9': {
      const t = targets[0];
      const p = board[t.row][t.col];
      if (p) {
        board[t.row][t.col] = { ...p, modifiers: [...p.modifiers, 'bodyguard'] };
        tempEffects.push({
          type: 'bodyguard',
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
      // Update tracking for moved pieces (bounty, bodyguard)
      // Bounty and bodyguard track by position, which may have changed
    }
  }

  // Clean up empty square modifier entries
  for (const key of Object.keys(squareMods)) {
    if (squareMods[key].length === 0) delete squareMods[key];
  }

  return { temporaryEffects: remaining, board, squareModifiers: squareMods };
}

function removeEffectFromBoard(effect, board, squareMods) {
  switch (effect.type) {
    case 'knightMovement': {
      // Find piece at tracked position and remove modifier
      // Piece may have moved, so scan the board
      for (let r = 0; r < 8; r++) {
        for (let c = 0; c < 8; c++) {
          const p = board[r][c];
          if (p && p.color === effect.color && p.modifiers.includes('knightMovement')) {
            board[r][c] = { ...p, modifiers: p.modifiers.filter(m => m !== 'knightMovement') };
          }
        }
      }
      break;
    }
    case 'petrified': {
      for (let r = 0; r < 8; r++) {
        for (let c = 0; c < 8; c++) {
          const p = board[r][c];
          if (p && p.color === effect.color && p.modifiers.includes('petrified')) {
            board[r][c] = { ...p, modifiers: p.modifiers.filter(m => m !== 'petrified') };
          }
        }
      }
      break;
    }
    case 'bounty': {
      for (let r = 0; r < 8; r++) {
        for (let c = 0; c < 8; c++) {
          const p = board[r][c];
          if (p && p.modifiers.includes('bounty')) {
            board[r][c] = { ...p, modifiers: p.modifiers.filter(m => m !== 'bounty') };
          }
        }
      }
      break;
    }
    case 'bodyguard': {
      for (let r = 0; r < 8; r++) {
        for (let c = 0; c < 8; c++) {
          const p = board[r][c];
          if (p && p.color === effect.color && p.modifiers.includes('bodyguard')) {
            board[r][c] = { ...p, modifiers: p.modifiers.filter(m => m !== 'bodyguard') };
          }
        }
      }
      break;
    }
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
