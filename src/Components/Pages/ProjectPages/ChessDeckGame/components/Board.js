import React from 'react';
import Square from './Square';
import { WHITE, BLACK, PHASE_MOVE } from '../constants';
import { findKing, isKingInCheck } from '../gameLogic';
import { getValidCardTargets } from '../cardLogic';
import BoardBg from '../../ProjectPageImages/ChessDeck/ChessBoardtopdown.png';

const Board = ({ state, dispatch }) => {
  const {
    board, currentPlayer, phase, selectedSquare, validMoves,
    lastMove, squareModifiers, fogActive, activeCard,
  } = state;

  // Flip board so current player's pieces are at the bottom
  const flipped = currentPlayer === BLACK;

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
      <div className="cd-board">
        {squares}
      </div>
    </div>
  );
};

export default Board;
