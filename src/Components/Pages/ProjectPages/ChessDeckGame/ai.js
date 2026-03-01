import {
  KING, QUEEN, ROOK, BISHOP, KNIGHT, PAWN, WHITE, BLACK,
} from './constants';
import { getValidMoves, executeMove, isKingInCheck } from './gameLogic';
import { canPlayCard, getValidCardTargets } from './cardLogic';
import { CARDS } from './cardDefinitions';

// ── Material values ─────────────────────────────────────────────────

const PIECE_VALUES = {
  [PAWN]: 100,
  [KNIGHT]: 320,
  [BISHOP]: 330,
  [ROOK]: 500,
  [QUEEN]: 900,
  [KING]: 20000,
};

// ── Piece-square tables (from White's perspective; flipped for Black) ──

const PST_PAWN = [
  [0,  0,  0,  0,  0,  0,  0,  0],
  [50, 50, 50, 50, 50, 50, 50, 50],
  [10, 10, 20, 30, 30, 20, 10, 10],
  [5,  5, 10, 25, 25, 10,  5,  5],
  [0,  0,  0, 20, 20,  0,  0,  0],
  [5, -5,-10,  0,  0,-10, -5,  5],
  [5, 10, 10,-20,-20, 10, 10,  5],
  [0,  0,  0,  0,  0,  0,  0,  0],
];

const PST_KNIGHT = [
  [-50,-40,-30,-30,-30,-30,-40,-50],
  [-40,-20,  0,  0,  0,  0,-20,-40],
  [-30,  0, 10, 15, 15, 10,  0,-30],
  [-30,  5, 15, 20, 20, 15,  5,-30],
  [-30,  0, 15, 20, 20, 15,  0,-30],
  [-30,  5, 10, 15, 15, 10,  5,-30],
  [-40,-20,  0,  5,  5,  0,-20,-40],
  [-50,-40,-30,-30,-30,-30,-40,-50],
];

const PST_BISHOP = [
  [-20,-10,-10,-10,-10,-10,-10,-20],
  [-10,  0,  0,  0,  0,  0,  0,-10],
  [-10,  0, 10, 10, 10, 10,  0,-10],
  [-10,  5,  5, 10, 10,  5,  5,-10],
  [-10,  0,  5, 10, 10,  5,  0,-10],
  [-10, 10, 10, 10, 10, 10, 10,-10],
  [-10,  5,  0,  0,  0,  0,  5,-10],
  [-20,-10,-10,-10,-10,-10,-10,-20],
];

const PST_ROOK = [
  [0,  0,  0,  0,  0,  0,  0,  0],
  [5, 10, 10, 10, 10, 10, 10,  5],
  [-5,  0,  0,  0,  0,  0,  0, -5],
  [-5,  0,  0,  0,  0,  0,  0, -5],
  [-5,  0,  0,  0,  0,  0,  0, -5],
  [-5,  0,  0,  0,  0,  0,  0, -5],
  [-5,  0,  0,  0,  0,  0,  0, -5],
  [0,  0,  0,  5,  5,  0,  0,  0],
];

const PST_QUEEN = [
  [-20,-10,-10, -5, -5,-10,-10,-20],
  [-10,  0,  0,  0,  0,  0,  0,-10],
  [-10,  0,  5,  5,  5,  5,  0,-10],
  [ -5,  0,  5,  5,  5,  5,  0, -5],
  [  0,  0,  5,  5,  5,  5,  0, -5],
  [-10,  5,  5,  5,  5,  5,  0,-10],
  [-10,  0,  5,  0,  0,  0,  0,-10],
  [-20,-10,-10, -5, -5,-10,-10,-20],
];

const PST_KING = [
  [-30,-40,-40,-50,-50,-40,-40,-30],
  [-30,-40,-40,-50,-50,-40,-40,-30],
  [-30,-40,-40,-50,-50,-40,-40,-30],
  [-30,-40,-40,-50,-50,-40,-40,-30],
  [-20,-30,-30,-40,-40,-30,-30,-20],
  [-10,-20,-20,-20,-20,-20,-20,-10],
  [ 20, 20,  0,  0,  0,  0, 20, 20],
  [ 20, 30, 10,  0,  0, 10, 30, 20],
];

const PST = {
  [PAWN]: PST_PAWN,
  [KNIGHT]: PST_KNIGHT,
  [BISHOP]: PST_BISHOP,
  [ROOK]: PST_ROOK,
  [QUEEN]: PST_QUEEN,
  [KING]: PST_KING,
};

// ── Modifier bonuses ────────────────────────────────────────────────

function modifierBonus(piece) {
  let bonus = 0;
  if (!piece.modifiers) return bonus;
  for (const mod of piece.modifiers) {
    if (mod === 'shield') bonus += 50;
    if (mod === 'petrified') bonus -= 80;
    if (mod === 'knightMovement') bonus += 40;
    if (mod === 'bodyguard') bonus += 30;
  }
  return bonus;
}

// ── Board evaluation ────────────────────────────────────────────────

function evaluateBoard(board) {
  let score = 0;
  for (let r = 0; r < 8; r++) {
    for (let c = 0; c < 8; c++) {
      const piece = board[r][c];
      if (!piece) continue;

      const value = PIECE_VALUES[piece.type] || 0;
      const pst = PST[piece.type];
      // PST is from White's perspective; for Black, mirror the row
      const pstRow = piece.color === WHITE ? r : 7 - r;
      const positional = pst ? pst[pstRow][c] : 0;
      const modBonus = modifierBonus(piece);

      const total = value + positional + modBonus;
      score += piece.color === WHITE ? total : -total;
    }
  }
  return score;
}

// ── Get all moves for a color ───────────────────────────────────────

function getAllMovesForColor(board, color, enPassantTarget, squareModifiers, temporaryEffects) {
  const moves = [];
  for (let r = 0; r < 8; r++) {
    for (let c = 0; c < 8; c++) {
      const piece = board[r][c];
      if (!piece || piece.color !== color) continue;
      const pieceMoves = getValidMoves(board, r, c, enPassantTarget, squareModifiers, temporaryEffects);
      for (const move of pieceMoves) {
        moves.push({ from: { row: r, col: c }, to: move, piece });
      }
    }
  }
  return moves;
}

// ── Move ordering (MVV-LVA for better pruning) ────────────────────

function scoreMoveForOrdering(move, board) {
  let score = 0;
  const target = board[move.to.row][move.to.col];
  if (target || move.to.capture || move.to.enPassant) {
    // MVV-LVA: value of captured piece minus value of attacker
    const victimValue = target ? (PIECE_VALUES[target.type] || 0) : 100; // en passant captures a pawn
    const attackerValue = PIECE_VALUES[move.piece.type] || 0;
    score = 10 * victimValue - attackerValue + 10000; // bias captures first
  }
  return score;
}

function orderMoves(moves, board) {
  return moves
    .map(m => ({ ...m, sortScore: scoreMoveForOrdering(m, board) }))
    .sort((a, b) => b.sortScore - a.sortScore);
}

// ── Minimax with alpha-beta pruning ─────────────────────────────────

function minimax(board, depth, alpha, beta, isMaximizing, enPassantTarget, squareModifiers, temporaryEffects) {
  if (depth === 0) {
    return evaluateBoard(board);
  }

  const color = isMaximizing ? WHITE : BLACK;
  const allMoves = getAllMovesForColor(board, color, enPassantTarget, squareModifiers, temporaryEffects);

  if (allMoves.length === 0) {
    // No legal moves: checkmate or stalemate
    if (isKingInCheck(board, color, squareModifiers)) {
      // Checkmate: very bad for the side to move
      return isMaximizing ? -100000 + (3 - depth) : 100000 - (3 - depth);
    }
    return 0; // stalemate
  }

  const ordered = orderMoves(allMoves, board);

  if (isMaximizing) {
    let maxEval = -Infinity;
    for (const move of ordered) {
      const { newBoard, enPassantTarget: newEP } = executeMove(board, move.from, move.to, move.to);
      const evalScore = minimax(newBoard, depth - 1, alpha, beta, false, newEP, squareModifiers, temporaryEffects);
      maxEval = Math.max(maxEval, evalScore);
      alpha = Math.max(alpha, evalScore);
      if (beta <= alpha) break;
    }
    return maxEval;
  } else {
    let minEval = Infinity;
    for (const move of ordered) {
      const { newBoard, enPassantTarget: newEP } = executeMove(board, move.from, move.to, move.to);
      const evalScore = minimax(newBoard, depth - 1, alpha, beta, true, newEP, squareModifiers, temporaryEffects);
      minEval = Math.min(minEval, evalScore);
      beta = Math.min(beta, evalScore);
      if (beta <= alpha) break;
    }
    return minEval;
  }
}

// ── Choose best move (~1100 Elo with randomness) ───────────────────

export function chooseBestMove(state) {
  const { board, enPassantTarget, squareModifiers, temporaryEffects, currentPlayer } = state;
  const isMaximizing = currentPlayer === WHITE;
  const allMoves = getAllMovesForColor(board, currentPlayer, enPassantTarget, squareModifiers, temporaryEffects);

  if (allMoves.length === 0) return null;

  // Score all moves
  const scored = allMoves.map(move => {
    const { newBoard, enPassantTarget: newEP } = executeMove(board, move.from, move.to, move.to);
    const score = minimax(newBoard, 2, -Infinity, Infinity, !isMaximizing, newEP, squareModifiers, temporaryEffects);
    return { ...move, score };
  });

  // Sort by score (best for current player first)
  scored.sort((a, b) => isMaximizing ? b.score - a.score : a.score - b.score);

  // ~1100 Elo randomness: 60% best, 25% 2nd best, 15% 3rd best
  const rand = Math.random();
  if (scored.length >= 3 && rand > 0.85) {
    return scored[2];
  } else if (scored.length >= 2 && rand > 0.60) {
    return scored[1];
  }
  return scored[0];
}

// ── Card decision logic ─────────────────────────────────────────────

// Safe cards the AI knows how to play well
const SAFE_CARD_IDS = ['1', '2', '3', '4', '5', '6', '9', '15'];

export function chooseCardAction(state) {
  const { hands, currentPlayer, cardPlayedThisTurn } = state;
  if (cardPlayedThisTurn) return null;

  const hand = hands[currentPlayer];
  if (!hand || hand.length === 0) return null;

  // Check for safe playable cards
  for (let i = 0; i < hand.length; i++) {
    const cardId = hand[i];
    const card = CARDS[cardId];
    if (!card) continue;
    if (!SAFE_CARD_IDS.includes(cardId)) continue;
    if (!canPlayCard(card, state)) continue;

    // For instant cards, just play them
    if (card.targetType === 'none') {
      return { cardId, handIndex: i, targets: [] };
    }

    // For targeting cards, pick a reasonable target
    const targets = getValidCardTargets(card, state, 0);
    if (targets.length === 0) continue;

    let chosenTarget;

    switch (cardId) {
      case '6': {
        // Petrify: pick highest-value enemy piece
        chosenTarget = pickHighestValueTarget(state.board, targets);
        break;
      }
      case '5': {
        // Stallion Spirit: pick a piece near the center
        chosenTarget = pickCentralTarget(targets);
        break;
      }
      case '9': {
        // Bodyguard: pick highest-value own piece
        chosenTarget = pickHighestValueTarget(state.board, targets);
        break;
      }
      case '15': {
        // Conscription: pick a central empty square
        chosenTarget = pickCentralTarget(targets);
        break;
      }
      default:
        chosenTarget = targets[Math.floor(Math.random() * targets.length)];
    }

    return { cardId, handIndex: i, targets: [chosenTarget] };
  }

  // 30% chance to play any other playable card (excluding complex multi-step)
  if (Math.random() < 0.3) {
    for (let i = 0; i < hand.length; i++) {
      const cardId = hand[i];
      const card = CARDS[cardId];
      if (!card) continue;
      // Skip complex multi-step cards
      if (card.targetSteps && card.targetSteps > 1) continue;
      if (!canPlayCard(card, state)) continue;

      if (card.targetType === 'none') {
        return { cardId, handIndex: i, targets: [] };
      }

      const targets = getValidCardTargets(card, state, 0);
      if (targets.length === 0) continue;

      const chosenTarget = targets[Math.floor(Math.random() * targets.length)];
      return { cardId, handIndex: i, targets: [chosenTarget] };
    }
  }

  return null;
}

// ── Helpers for card targeting ──────────────────────────────────────

function pickHighestValueTarget(board, targets) {
  let best = targets[0];
  let bestValue = -Infinity;
  for (const t of targets) {
    const piece = board[t.row][t.col];
    if (piece) {
      const val = PIECE_VALUES[piece.type] || 0;
      if (val > bestValue) {
        bestValue = val;
        best = t;
      }
    }
  }
  return best;
}

function pickCentralTarget(targets) {
  // Prefer squares closer to the center (3.5, 3.5)
  let best = targets[0];
  let bestDist = Infinity;
  for (const t of targets) {
    const dist = Math.abs(t.row - 3.5) + Math.abs(t.col - 3.5);
    if (dist < bestDist) {
      bestDist = dist;
      best = t;
    }
  }
  return best;
}
