import React from 'react';
import Square from './Square.jsx';
import { WHITE, BLACK, PHASE_MOVE } from '../constants.js';
import { findKing, isKingInCheck } from '../gameLogic.js';
import { getValidCardTargets } from '../cardLogic.js';
import BoardBg from '../../ProjectPageImages/ChessDeck/ChessBoardtopdown.webp';

const Board = ({ state, dispatch, perspective }) => {
  const {
    board, currentPlayer, phase, selectedSquare, validMoves,
    lastMove, squareModifiers, fogActive, activeCard,
  } = state;

  // Flip board so current player's pieces are at the bottom
  // When perspective is provided, lock the board orientation to that color
  const flipped = perspective ? perspective === BLACK : currentPlayer === BLACK;

  // Determine which squares are in check
  const whiteKing = findKing(board, WHITE);
  const blackKing = findKing(board, BLACK);
  const whiteInCheck = isKingInCheck(board, WHITE, squareModifiers);
  const blackInCheck = isKingInCheck(board, BLACK, squareModifiers);

  // Valid card targets for highlighting (cards are played during PHASE_MOVE)
  let cardTargets = [];
  if (activeCard && phase === PHASE_MOVE) {
    const { card } = activeCard;
    cardTargets = getValidCardTargets(card, state, state.cardTargetStep);
  }

  const handleSquareClick = (row, col) => {
    // Card targeting mode
    if (activeCard && phase === PHASE_MOVE) {
      dispatch({ type: 'SELECT_CARD_TARGET', target: { row, col } });
      return;
    }

    // Move phase — piece selection and movement
    if (phase === PHASE_MOVE) {
      if (selectedSquare) {
        const isValid = validMoves.some(m => m.row === row && m.col === col);
        if (isValid) {
          dispatch({ type: 'MAKE_MOVE', row, col });
          return;
        }
      }

      const piece = board[row][col];
      if (piece && piece.color === currentPlayer) {
        if (selectedSquare && selectedSquare.row === row && selectedSquare.col === col) {
          dispatch({ type: 'DESELECT_PIECE' });
        } else {
          dispatch({ type: 'SELECT_PIECE', row, col });
        }
        return;
      }

      if (selectedSquare) {
        dispatch({ type: 'DESELECT_PIECE' });
      }
    }
  };

  // Keyboard navigation. The board is a grid of buttons with a single tab stop;
  // arrows walk it, Enter or Space activates. Coordinates here are *visual*, so
  // "up" is up on screen regardless of which side the board is flipped to.
  const [cursor, setCursor] = React.useState({ vi: 7, vj: 4 });
  const focusRef = React.useRef(null);
  const shouldRefocus = React.useRef(false);

  React.useEffect(() => {
    if (shouldRefocus.current && focusRef.current) {
      focusRef.current.focus();
      shouldRefocus.current = false;
    }
  }, [cursor]);

  const handleKeyDown = (event, vi, vj) => {
    const deltas = {
      ArrowUp: [-1, 0], ArrowDown: [1, 0], ArrowLeft: [0, -1], ArrowRight: [0, 1],
    };
    if (deltas[event.key]) {
      event.preventDefault();
      const [dv, dh] = deltas[event.key];
      shouldRefocus.current = true;
      setCursor({
        vi: Math.min(7, Math.max(0, vi + dv)),
        vj: Math.min(7, Math.max(0, vj + dh)),
      });
      return;
    }
    if (event.key === 'Home' || event.key === 'End') {
      event.preventDefault();
      shouldRefocus.current = true;
      setCursor({ vi, vj: event.key === 'Home' ? 0 : 7 });
      return;
    }
    if (event.key === 'Escape' && selectedSquare) {
      event.preventDefault();
      dispatch({ type: 'DESELECT_PIECE' });
    }
  };

  const squares = [];
  for (let vi = 0; vi < 8; vi++) {
    for (let vj = 0; vj < 8; vj++) {
      // Map visual position to actual board coordinates
      const r = flipped ? 7 - vi : vi;
      const c = flipped ? 7 - vj : vj;

      const piece = board[r][c];
      const isSelected = selectedSquare && selectedSquare.row === r && selectedSquare.col === c;
      const move = validMoves.find(m => m.row === r && m.col === c);
      const isValidMove = !!move;
      const isValidCapture = move && (move.capture || move.enPassant);
      const isLastMoveFrom = lastMove && lastMove.from.row === r && lastMove.from.col === c;
      const isLastMoveTo = lastMove && lastMove.to.row === r && lastMove.to.col === c;

      const isCheck =
        (whiteInCheck && whiteKing && whiteKing.row === r && whiteKing.col === c) ||
        (blackInCheck && blackKing && blackKing.row === r && blackKing.col === c);

      const isCardTarget = cardTargets.some(t => t.row === r && t.col === c);

      const fogged = fogActive && piece && piece.color === fogActive && currentPlayer !== fogActive;

      const key = `${r}-${c}`;
      const sqMods = squareModifiers[key] || [];

      squares.push(
        <Square
          key={key}
          row={r}
          col={c}
          piece={piece}
          onClick={() => handleSquareClick(r, c)}
          onKeyDown={(e) => handleKeyDown(e, vi, vj)}
          isFocusTarget={cursor.vi === vi && cursor.vj === vj}
          focusRef={focusRef}
          isSelected={isSelected}
          isValidMove={isValidMove}
          isValidCapture={isValidCapture}
          isLastMoveFrom={isLastMoveFrom}
          isLastMoveTo={isLastMoveTo}
          isCheck={isCheck}
          isCardTarget={isCardTarget}
          squareMods={sqMods}
          fogged={fogged}
        />
      );
    }
  }

  return (
    <div className="cd-board-wrapper" style={{ backgroundImage: `url(${BoardBg})` }}>
      {/* A labelled grid rather than a bag of divs, so the board announces
          itself and can be walked with the arrow keys. */}
      <div className="cd-board" role="grid" aria-label="Chess board">
        {squares}
      </div>
    </div>
  );
};

export default Board;
