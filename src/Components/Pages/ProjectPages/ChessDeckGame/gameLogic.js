import { KING, QUEEN, ROOK, BISHOP, KNIGHT, PAWN, WHITE, BLACK } from './constants';

// ── Helpers ──────────────────────────────────────────────────────────

export function deepCloneBoard(board) {
  return board.map(row =>
    row.map(cell =>
      cell
        ? { ...cell, modifiers: [...cell.modifiers] }
        : null
    )
  );
}

function inBounds(r, c) {
  return r >= 0 && r < 8 && c >= 0 && c < 8;
}

function hasModifier(piece, mod) {
  return piece && piece.modifiers.includes(mod);
}

function isRock(squareMods, r, c) {
  const key = `${r}-${c}`;
  return squareMods[key] && squareMods[key].some(m => m.type === 'rock');
}

function isHolyGround(squareMods, r, c, forColor) {
  const key = `${r}-${c}`;
  return squareMods[key] && squareMods[key].some(m => m.type === 'holyGround' && m.color === forColor);
}

function opponent(color) {
  return color === WHITE ? BLACK : WHITE;
}

// ── Sliding Moves (rook, bishop, queen) ──────────────────────────────

function getSlidingMoves(board, row, col, color, directions, squareMods = {}) {
  const moves = [];
  for (const [dr, dc] of directions) {
    let r = row + dr;
    let c = col + dc;
    while (inBounds(r, c)) {
      // Rocks block sliding
      if (isRock(squareMods, r, c)) break;

      const target = board[r][c];
      if (!target) {
        moves.push({ row: r, col: c });
      } else if (target.color !== color) {
        // Can't capture on holy ground (for the piece's owner)
        if (!isHolyGround(squareMods, r, c, target.color)) {
          moves.push({ row: r, col: c, capture: true });
        }
        break;
      } else {
        break; // own piece
      }
      r += dr;
      c += dc;
    }
  }
  return moves;
}

// ── Piece-specific move generators ───────────────────────────────────

function getPawnMoves(board, row, col, color, enPassant, squareMods = {}) {
  const moves = [];
  const dir = color === WHITE ? -1 : 1;
  const startRow = color === WHITE ? 6 : 1;

  // Forward 1
  const r1 = row + dir;
  if (inBounds(r1, col) && !board[r1][col] && !isRock(squareMods, r1, col)) {
    moves.push({ row: r1, col });

    // Forward 2 from start
    const r2 = row + 2 * dir;
    if (row === startRow && !board[r2][col] && !isRock(squareMods, r2, col)) {
      moves.push({ row: r2, col, doublePush: true });
    }
  }

  // Captures
  for (const dc of [-1, 1]) {
    const cr = row + dir;
    const cc = col + dc;
    if (!inBounds(cr, cc)) continue;
    if (isRock(squareMods, cr, cc)) continue;

    const target = board[cr][cc];
    if (target && target.color !== color) {
      if (!isHolyGround(squareMods, cr, cc, target.color)) {
        moves.push({ row: cr, col: cc, capture: true });
      }
    }

    // En passant
    if (enPassant && enPassant.row === cr && enPassant.col === cc) {
      moves.push({ row: cr, col: cc, enPassant: true });
    }
  }

  return moves;
}

function getRookMoves(board, row, col, color, squareMods = {}) {
  return getSlidingMoves(board, row, col, color, [[-1,0],[1,0],[0,-1],[0,1]], squareMods);
}

function getBishopMoves(board, row, col, color, squareMods = {}) {
  return getSlidingMoves(board, row, col, color, [[-1,-1],[-1,1],[1,-1],[1,1]], squareMods);
}

function getQueenMoves(board, row, col, color, squareMods = {}) {
  return getSlidingMoves(
    board, row, col, color,
    [[-1,0],[1,0],[0,-1],[0,1],[-1,-1],[-1,1],[1,-1],[1,1]],
    squareMods
  );
}

function getKnightMoves(board, row, col, color, squareMods = {}) {
  const moves = [];
  const offsets = [[-2,-1],[-2,1],[-1,-2],[-1,2],[1,-2],[1,2],[2,-1],[2,1]];
  for (const [dr, dc] of offsets) {
    const r = row + dr;
    const c = col + dc;
    if (!inBounds(r, c)) continue;
    if (isRock(squareMods, r, c)) continue;
    const target = board[r][c];
    if (!target) {
      moves.push({ row: r, col: c });
    } else if (target.color !== color) {
      if (!isHolyGround(squareMods, r, c, target.color)) {
        moves.push({ row: r, col: c, capture: true });
      }
    }
  }
  return moves;
}

function getKingMoves(board, row, col, color, squareMods = {}) {
  const moves = [];
  for (let dr = -1; dr <= 1; dr++) {
    for (let dc = -1; dc <= 1; dc++) {
      if (dr === 0 && dc === 0) continue;
      const r = row + dr;
      const c = col + dc;
      if (!inBounds(r, c)) continue;
      if (isRock(squareMods, r, c)) continue;
      const target = board[r][c];
      if (!target) {
        moves.push({ row: r, col: c });
      } else if (target.color !== color) {
        if (!isHolyGround(squareMods, r, c, target.color)) {
          moves.push({ row: r, col: c, capture: true });
        }
      }
    }
  }

  // Castling
  const backRank = color === WHITE ? 7 : 0;
  if (row === backRank && col === 4) {
    const king = board[row][col];
    if (king && !king.hasMoved) {
      // Kingside
      const kRook = board[backRank][7];
      if (
        kRook && kRook.type === ROOK && kRook.color === color && !kRook.hasMoved &&
        !board[backRank][5] && !board[backRank][6] &&
        !isRock(squareMods, backRank, 5) && !isRock(squareMods, backRank, 6) &&
        !isSquareAttacked(board, backRank, 4, opponent(color), squareMods) &&
        !isSquareAttacked(board, backRank, 5, opponent(color), squareMods) &&
        !isSquareAttacked(board, backRank, 6, opponent(color), squareMods)
      ) {
        moves.push({ row: backRank, col: 6, castleKingside: true });
      }

      // Queenside
      const qRook = board[backRank][0];
      if (
        qRook && qRook.type === ROOK && qRook.color === color && !qRook.hasMoved &&
        !board[backRank][1] && !board[backRank][2] && !board[backRank][3] &&
        !isRock(squareMods, backRank, 1) && !isRock(squareMods, backRank, 2) && !isRock(squareMods, backRank, 3) &&
        !isSquareAttacked(board, backRank, 4, opponent(color), squareMods) &&
        !isSquareAttacked(board, backRank, 3, opponent(color), squareMods) &&
        !isSquareAttacked(board, backRank, 2, opponent(color), squareMods)
      ) {
        moves.push({ row: backRank, col: 2, castleQueenside: true });
      }
    }
  }

  return moves;
}

// ── Raw move generation (before filtering for check) ─────────────────

function getRawMoves(board, row, col, enPassant, squareMods = {}, tempEffects = []) {
  const piece = board[row][col];
  if (!piece) return [];

  // Immovable pieces can't move
  if (hasModifier(piece, 'immovable') || hasModifier(piece, 'petrified')) return [];

  let moves = [];

  switch (piece.type) {
    case PAWN:
      moves = getPawnMoves(board, row, col, piece.color, enPassant, squareMods);
      break;
    case ROOK:
      moves = getRookMoves(board, row, col, piece.color, squareMods);
      break;
    case BISHOP:
      moves = getBishopMoves(board, row, col, piece.color, squareMods);
      break;
    case QUEEN:
      moves = getQueenMoves(board, row, col, piece.color, squareMods);
      break;
    case KNIGHT:
      moves = getKnightMoves(board, row, col, piece.color, squareMods);
      break;
    case KING:
      moves = getKingMoves(board, row, col, piece.color, squareMods);
      break;
    default:
      break;
  }

  // Stallion Spirit: non-knight with knightMovement modifier also gets knight moves
  if (piece.type !== KNIGHT && hasModifier(piece, 'knightMovement')) {
    const knightMoves = getKnightMoves(board, row, col, piece.color, squareMods);
    // Deduplicate
    const existing = new Set(moves.map(m => `${m.row}-${m.col}`));
    for (const m of knightMoves) {
      if (!existing.has(`${m.row}-${m.col}`)) {
        moves.push(m);
      }
    }
  }

  return moves;
}

// ── Check detection ──────────────────────────────────────────────────

export function isSquareAttacked(board, row, col, byColor, squareMods = {}) {
  for (let r = 0; r < 8; r++) {
    for (let c = 0; c < 8; c++) {
      const piece = board[r][c];
      if (!piece || piece.color !== byColor) continue;

      // Petrified pieces still threaten squares
      let attacks;
      switch (piece.type) {
        case PAWN: {
          const dir = byColor === WHITE ? -1 : 1;
          const atkSquares = [
            { row: r + dir, col: c - 1 },
            { row: r + dir, col: c + 1 },
          ];
          attacks = atkSquares.filter(s => inBounds(s.row, s.col));
          break;
        }
        case ROOK:
          attacks = getSlidingMoves(board, r, c, byColor, [[-1,0],[1,0],[0,-1],[0,1]], squareMods);
          break;
        case BISHOP:
          attacks = getSlidingMoves(board, r, c, byColor, [[-1,-1],[-1,1],[1,-1],[1,1]], squareMods);
          break;
        case QUEEN:
          attacks = getSlidingMoves(
            board, r, c, byColor,
            [[-1,0],[1,0],[0,-1],[0,1],[-1,-1],[-1,1],[1,-1],[1,1]],
            squareMods
          );
          break;
        case KNIGHT: {
          const offsets = [[-2,-1],[-2,1],[-1,-2],[-1,2],[1,-2],[1,2],[2,-1],[2,1]];
          attacks = offsets
            .map(([dr, dc]) => ({ row: r + dr, col: c + dc }))
            .filter(s => inBounds(s.row, s.col) && !isRock(squareMods, s.row, s.col));
          break;
        }
        case KING: {
          attacks = [];
          for (let dr = -1; dr <= 1; dr++) {
            for (let dc = -1; dc <= 1; dc++) {
              if (dr === 0 && dc === 0) continue;
              const nr = r + dr;
              const nc = c + dc;
              if (inBounds(nr, nc) && !isRock(squareMods, nr, nc)) {
                attacks.push({ row: nr, col: nc });
              }
            }
          }
          break;
        }
        default:
          attacks = [];
      }

      // Stallion Spirit on attackers
      if (piece.type !== KNIGHT && hasModifier(piece, 'knightMovement')) {
        const knightOffsets = [[-2,-1],[-2,1],[-1,-2],[-1,2],[1,-2],[1,2],[2,-1],[2,1]];
        const extra = knightOffsets
          .map(([dr, dc]) => ({ row: r + dr, col: c + dc }))
          .filter(s => inBounds(s.row, s.col) && !isRock(squareMods, s.row, s.col));
        const existing = new Set(attacks.map(a => `${a.row}-${a.col}`));
        for (const e of extra) {
          if (!existing.has(`${e.row}-${e.col}`)) attacks.push(e);
        }
      }

      if (attacks.some(a => a.row === row && a.col === col)) return true;
    }
  }
  return false;
}

export function findKing(board, color) {
  for (let r = 0; r < 8; r++) {
    for (let c = 0; c < 8; c++) {
      const p = board[r][c];
      if (p && p.type === KING && p.color === color) return { row: r, col: c };
    }
  }
  return null;
}

export function isKingInCheck(board, color, squareMods = {}) {
  const kingPos = findKing(board, color);
  if (!kingPos) return false;
  return isSquareAttacked(board, kingPos.row, kingPos.col, opponent(color), squareMods);
}

// ── Legal moves (filtered for check) ─────────────────────────────────

export function getValidMoves(board, row, col, enPassant, squareMods = {}, tempEffects = []) {
  const piece = board[row][col];
  if (!piece) return [];

  const raw = getRawMoves(board, row, col, enPassant, squareMods, tempEffects);

  // Filter: each move must not leave own king in check
  return raw.filter(move => {
    const testBoard = deepCloneBoard(board);

    // Execute move on test board
    testBoard[move.row][move.col] = { ...testBoard[row][col], hasMoved: true };
    testBoard[row][col] = null;

    // En passant capture
    if (move.enPassant) {
      const capturedRow = piece.color === WHITE ? move.row + 1 : move.row - 1;
      testBoard[capturedRow][move.col] = null;
    }

    // Castling: also move the rook
    if (move.castleKingside) {
      const backRank = move.row;
      testBoard[backRank][5] = { ...testBoard[backRank][7], hasMoved: true };
      testBoard[backRank][7] = null;
    }
    if (move.castleQueenside) {
      const backRank = move.row;
      testBoard[backRank][3] = { ...testBoard[backRank][0], hasMoved: true };
      testBoard[backRank][0] = null;
    }

    return !isKingInCheck(testBoard, piece.color, squareMods);
  });
}

// ── Game status ──────────────────────────────────────────────────────

export function getGameStatus(board, currentPlayer, enPassant, squareMods = {}, tempEffects = []) {
  const isCheck = isKingInCheck(board, currentPlayer, squareMods);

  // Check if current player has any legal move
  let hasLegalMove = false;
  for (let r = 0; r < 8 && !hasLegalMove; r++) {
    for (let c = 0; c < 8 && !hasLegalMove; c++) {
      const p = board[r][c];
      if (p && p.color === currentPlayer) {
        const moves = getValidMoves(board, r, c, enPassant, squareMods, tempEffects);
        if (moves.length > 0) hasLegalMove = true;
      }
    }
  }

  return {
    isCheck,
    isCheckmate: isCheck && !hasLegalMove,
    isStalemate: !isCheck && !hasLegalMove,
  };
}

// ── Move execution ───────────────────────────────────────────────────

export function executeMove(board, from, to, moveInfo = {}) {
  const newBoard = deepCloneBoard(board);
  const piece = { ...newBoard[from.row][from.col], hasMoved: true, modifiers: [...newBoard[from.row][from.col].modifiers] };
  let captured = null;
  let enPassantTarget = null;
  let promotionNeeded = false;

  // Handle capture
  const target = newBoard[to.row][to.col];
  if (target) {
    // Shield check: if target has shield, break shield instead of capturing
    if (hasModifier(target, 'shield')) {
      const shieldedPiece = { ...target, modifiers: target.modifiers.filter(m => m !== 'shield') };
      newBoard[to.row][to.col] = shieldedPiece;
      // Move is blocked — piece stays where it is (shield absorbs the attack)
      // Actually per the card description: "the shield breaks instead and the piece survives"
      // The attacking piece doesn't move to the square; the attack just fails
      // But that would be weird for chess — let's say the attacker stays, target keeps square
      newBoard[from.row][from.col] = null;
      // Wait — that loses the attacker. Let's keep attacker in place.
      newBoard[from.row][from.col] = piece;
      return { newBoard, captured: null, enPassantTarget: null, promotionNeeded: false, shieldBroken: true };
    }
    captured = target;
  }

  // En passant capture
  if (moveInfo.enPassant) {
    const capturedRow = piece.color === WHITE ? to.row + 1 : to.row - 1;
    captured = newBoard[capturedRow][to.col];
    newBoard[capturedRow][to.col] = null;
  }

  // Place piece
  newBoard[to.row][to.col] = piece;
  newBoard[from.row][from.col] = null;

  // Castling: move the rook
  if (moveInfo.castleKingside) {
    const rook = { ...newBoard[to.row][7], hasMoved: true };
    newBoard[to.row][5] = rook;
    newBoard[to.row][7] = null;
  }
  if (moveInfo.castleQueenside) {
    const rook = { ...newBoard[to.row][0], hasMoved: true };
    newBoard[to.row][3] = rook;
    newBoard[to.row][0] = null;
  }

  // Pawn double push: set en passant target
  if (moveInfo.doublePush) {
    const epRow = piece.color === WHITE ? to.row + 1 : to.row - 1;
    enPassantTarget = { row: epRow, col: to.col };
  }

  // Pawn promotion check
  const promoRank = piece.color === WHITE ? 0 : 7;
  if (piece.type === PAWN && to.row === promoRank) {
    promotionNeeded = true;
  }

  return { newBoard, captured, enPassantTarget, promotionNeeded };
}

// ── Find a safe square for a king (used by Second Chance card) ───────

export function findSafeSquareForKing(board, color, squareMods = {}) {
  const safeSquares = [];
  const opp = color === WHITE ? BLACK : WHITE;
  for (let r = 0; r < 8; r++) {
    for (let c = 0; c < 8; c++) {
      if (!board[r][c] && !isSquareAttacked(board, r, c, opp, squareMods)) {
        safeSquares.push({ row: r, col: c });
      }
    }
  }
  if (safeSquares.length === 0) return null;
  return safeSquares[Math.floor(Math.random() * safeSquares.length)];
}

// ── Promotion ────────────────────────────────────────────────────────

export function executePromotion(board, row, col, newType) {
  const newBoard = deepCloneBoard(board);
  const piece = newBoard[row][col];
  if (piece) {
    newBoard[row][col] = { ...piece, type: newType };
  }
  return newBoard;
}
