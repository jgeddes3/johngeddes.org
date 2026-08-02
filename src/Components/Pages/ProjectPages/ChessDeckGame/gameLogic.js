import { KING, QUEEN, ROOK, BISHOP, KNIGHT, PAWN, WHITE, BLACK } from './constants.js';

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

function isSinkhole(squareMods, r, c) {
  const key = `${r}-${c}`;
  return Boolean(squareMods[key] && squareMods[key].some(m => m.type === 'sinkhole'));
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

// ── Attack rays (what a piece aims at, not what it may legally take) ─
//
// Attack detection and move generation answer different questions, and sharing
// one generator between them is what let a king stand on Holy Ground and be
// immune to check: getSlidingMoves omits a capture it is not *allowed* to make,
// so the rook aimed at the king reported no attack at all.
//
// A square is attacked if an enemy piece is aimed at it. Whether taking the
// occupant would be permitted — Holy Ground, a shield, Vigil — is a separate
// question answered during move generation. Only physical blocking matters
// here: any piece stops a ray, and a rock fills its square so nothing can be
// attacked on or behind it.
function getSlidingAttacks(board, row, col, directions, squareMods = {}) {
  const attacks = [];
  for (const [dr, dc] of directions) {
    let r = row + dr;
    let c = col + dc;
    while (inBounds(r, c)) {
      if (isRock(squareMods, r, c)) break;
      attacks.push({ row: r, col: c });
      if (board[r][c]) break;
      r += dr;
      c += dc;
    }
  }
  return attacks;
}

const KNIGHT_OFFSETS = [[-2,-1],[-2,1],[-1,-2],[-1,2],[1,-2],[1,2],[2,-1],[2,1]];

function offsetAttacks(row, col, offsets, squareMods = {}) {
  return offsets
    .map(([dr, dc]) => ({ row: row + dr, col: col + dc }))
    .filter(s => inBounds(s.row, s.col) && !isRock(squareMods, s.row, s.col));
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

    // En passant, but only onto a genuinely empty square and only while the
    // pawn that double-pushed is still standing beside us. Cards move pieces
    // after the target is set, and without these guards a stale target both
    // duplicated an ordinary capture and let the move delete whatever happened
    // to be on that file — including a friendly piece.
    if (enPassant && enPassant.row === cr && enPassant.col === cc && !target) {
      const victim = board[row][cc];
      if (victim && victim.type === PAWN && victim.color !== color) {
        moves.push({ row: cr, col: cc, enPassant: true });
      }
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

// Castling moves the rook too, so a rook that cannot move cannot castle —
// getRawMoves already stops a petrified king, but the rook was never asked.
function canCastleWith(rook, color) {
  return Boolean(
    rook && rook.type === ROOK && rook.color === color && !rook.hasMoved &&
    !hasModifier(rook, 'petrified') && !hasModifier(rook, 'immovable')
  );
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
        canCastleWith(kRook, color) &&
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
        canCastleWith(qRook, color) &&
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

      // Petrified pieces still threaten squares — Petrify says so on the card.
      let attacks;
      switch (piece.type) {
        case PAWN: {
          const dir = byColor === WHITE ? -1 : 1;
          attacks = offsetAttacks(r, c, [[dir, -1], [dir, 1]], squareMods);
          break;
        }
        case ROOK:
          attacks = getSlidingAttacks(board, r, c, [[-1,0],[1,0],[0,-1],[0,1]], squareMods);
          break;
        case BISHOP:
          attacks = getSlidingAttacks(board, r, c, [[-1,-1],[-1,1],[1,-1],[1,1]], squareMods);
          break;
        case QUEEN:
          attacks = getSlidingAttacks(
            board, r, c,
            [[-1,0],[1,0],[0,-1],[0,1],[-1,-1],[-1,1],[1,-1],[1,1]],
            squareMods
          );
          break;
        case KNIGHT:
          attacks = offsetAttacks(r, c, KNIGHT_OFFSETS, squareMods);
          break;
        case KING:
          attacks = offsetAttacks(
            r, c,
            [[-1,-1],[-1,0],[-1,1],[0,-1],[0,1],[1,-1],[1,0],[1,1]],
            squareMods
          );
          break;
        default:
          attacks = [];
      }

      // Stallion Spirit on attackers
      if (piece.type !== KNIGHT && hasModifier(piece, 'knightMovement')) {
        const existing = new Set(attacks.map(a => `${a.row}-${a.col}`));
        for (const e of offsetAttacks(r, c, KNIGHT_OFFSETS, squareMods)) {
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

  // Each move must not leave our own king in check. The simulation runs through
  // applyMove — the same function that commits the real move — so a move can
  // never be judged legal under rules different from the ones it plays out
  // under. Hand-rolling the simulation here is what made "capture the shielded
  // rook" a legal escape from check: the test board removed the rook, the real
  // board bounced off the shield and left the king in check.
  return raw.filter(move => {
    const { newBoard } = applyMove(board, { row, col }, move, move);
    return !isKingInCheck(newBoard, piece.color, squareMods);
  });
}

// ── Game status ──────────────────────────────────────────────────────

/**
 * Neither side has enough material to force mate.
 *
 * The standard set: king v king, king and a minor piece v king, and king and
 * bishop v king and bishop with both bishops on the same colour square. Any
 * pawn, rook or queen anywhere means mate is still possible.
 */
export function isInsufficientMaterial(board) {
  const minors = { [WHITE]: [], [BLACK]: [] };
  for (let r = 0; r < 8; r++) {
    for (let c = 0; c < 8; c++) {
      const p = board[r][c];
      if (!p || p.type === KING) continue;
      if (p.type === PAWN || p.type === ROOK || p.type === QUEEN) return false;
      minors[p.color].push({ type: p.type, square: (r + c) % 2 });
    }
  }
  const w = minors[WHITE];
  const b = minors[BLACK];
  if (w.length + b.length === 0) return true;                  // K v K
  if (w.length + b.length === 1) return true;                  // K+minor v K
  if (w.length === 1 && b.length === 1 &&
      w[0].type === BISHOP && b[0].type === BISHOP &&
      w[0].square === b[0].square) {
    return true;                                               // KB v KB, same colour
  }
  return false;
}

export function getGameStatus(
  board, currentPlayer, enPassant, squareMods = {}, tempEffects = [], clocks = {}
) {
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

  const isCheckmate = isCheck && !hasLegalMove;
  const isStalemate = !isCheck && !hasLegalMove;

  // Draws by rule. Without these a dead-drawn ending simply never ends: in
  // self-play a third of games ran to the move cap with two lone kings shuffling.
  let drawReason = null;
  if (isStalemate) drawReason = 'stalemate';
  else if (!isCheckmate) {
    if (isInsufficientMaterial(board)) drawReason = 'insufficient material';
    else if ((clocks.halfmoveClock ?? 0) >= 100) drawReason = 'fifty-move rule';
    else if ((clocks.repetitions ?? 0) >= 3) drawReason = 'threefold repetition';
  }

  return {
    isCheck,
    isCheckmate,
    isStalemate,
    isDraw: Boolean(drawReason),
    drawReason,
  };
}

/**
 * A compact key for repetition detection: placement, side to move, castling
 * availability and the en passant file — the things that make two positions
 * genuinely the same position.
 */
export function positionKey(board, currentPlayer, enPassant) {
  let placement = '';
  for (let r = 0; r < 8; r++) {
    for (let c = 0; c < 8; c++) {
      const p = board[r][c];
      if (!p) { placement += '.'; continue; }
      const ch = p.type[0] === 'k' && p.type === KNIGHT ? 'n' : p.type[0];
      placement += p.color === WHITE ? ch.toUpperCase() : ch;
    }
  }
  let rights = '';
  for (const [color, rank] of [[WHITE, 7], [BLACK, 0]]) {
    const king = board[rank][4];
    const canCastle = king && king.type === KING && king.color === color && !king.hasMoved;
    for (const file of [0, 7]) {
      const rook = board[rank][file];
      rights += canCastle && rook && rook.type === ROOK && rook.color === color && !rook.hasMoved ? '1' : '0';
    }
  }
  return `${placement}|${currentPlayer}|${rights}|${enPassant ? enPassant.col : '-'}`;
}

// ── Move execution ───────────────────────────────────────────────────

// The single place a move is written onto a board. Both the legality filter in
// getValidMoves and the committed move in executeMove go through it, so the two
// cannot drift apart.
function applyMove(board, from, to, moveInfo = {}) {
  const newBoard = deepCloneBoard(board);
  const source = newBoard[from.row][from.col];
  if (!source) {
    return { newBoard, captured: null, enPassantTarget: null, promotionNeeded: false, shieldBroken: false };
  }
  const piece = { ...source, hasMoved: true, modifiers: [...source.modifiers] };
  let captured = null;
  let enPassantTarget = null;
  let promotionNeeded = false;

  const target = newBoard[to.row][to.col];

  // A shield absorbs the attempt: the shield is spent, the defender lives, and
  // the attacker never leaves its square. The attempt still costs the turn.
  if (target && hasModifier(target, 'shield')) {
    newBoard[to.row][to.col] = { ...target, modifiers: target.modifiers.filter(m => m !== 'shield') };
    newBoard[from.row][from.col] = piece;
    return { newBoard, captured: null, enPassantTarget: null, promotionNeeded: false, shieldBroken: true };
  }

  if (target) captured = target;

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
  if (moveInfo.castleKingside && newBoard[to.row][7]) {
    newBoard[to.row][5] = { ...newBoard[to.row][7], hasMoved: true };
    newBoard[to.row][7] = null;
  }
  if (moveInfo.castleQueenside && newBoard[to.row][0]) {
    newBoard[to.row][3] = { ...newBoard[to.row][0], hasMoved: true };
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

  return { newBoard, captured, enPassantTarget, promotionNeeded, shieldBroken: false };
}

export function executeMove(board, from, to, moveInfo = {}) {
  return applyMove(board, from, to, moveInfo);
}

// ── Find a safe square for a king (used by Second Chance card) ───────

export function findSafeSquareForKing(board, color, squareMods = {}) {
  const safeSquares = [];
  const opp = color === WHITE ? BLACK : WHITE;
  for (let r = 0; r < 8; r++) {
    for (let c = 0; c < 8; c++) {
      // "Empty and unattacked" is not the same as safe: a rock fills the square
      // so no piece can stand there, and a sinkhole captures the next piece to
      // land on it — teleporting the king onto one loses the game outright.
      if (board[r][c]) continue;
      if (isRock(squareMods, r, c) || isSinkhole(squareMods, r, c)) continue;
      if (isSquareAttacked(board, r, c, opp, squareMods)) continue;
      safeSquares.push({ row: r, col: c });
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
