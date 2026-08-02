import React from 'react';
import ModGlyph from './ModGlyph.jsx';
import Piece from './Piece.jsx';

const Square = ({
  row, col, piece, onClick, onKeyDown,
  isSelected, isValidMove, isValidCapture,
  isLastMoveFrom, isLastMoveTo, isCheck,
  isCardTarget, squareMods, fogged,
  isFocusTarget, focusRef,
}) => {
  const isLight = (row + col) % 2 === 0;
  let className = `cd-square ${isLight ? 'cd-square-light' : 'cd-square-dark'}`;

  if (isSelected) className += ' cd-square-selected';
  if (isLastMoveFrom || isLastMoveTo) className += ' cd-square-last-move';
  if (isCheck) className += ' cd-square-check';
  if (isCardTarget) className += ' cd-square-card-target';

  // Square modifier indicators
  const modIndicators = [];
  if (squareMods && squareMods.length > 0) {
    for (const mod of squareMods) {
      switch (mod.type) {
        case 'rock':
          modIndicators.push(<span key="rock" className="cd-square-mod cd-mod-rock" title="Immovable Rock"><ModGlyph name="rock" label="immovable rock" /></span>);
          break;
        case 'holyGround':
          modIndicators.push(<span key="holyGround" className="cd-square-mod cd-mod-holyground" title="Holy Ground"><ModGlyph name="holyGround" label="holy ground" /></span>);
          break;
        case 'sinkhole':
          modIndicators.push(<span key="sinkhole" className="cd-square-mod cd-mod-sinkhole" title="Sinkhole"><ModGlyph name="sinkhole" label="sinkhole" /></span>);
          break;
        case 'watchtower':
          modIndicators.push(<span key="watchtower" className="cd-square-mod cd-mod-watchtower" title="Watchtower"><ModGlyph name="watchtower" label="watchtower" /></span>);
          break;
        default:
          break;
      }
    }
  }

  // Spoken description of the square. Board state was previously carried
  // entirely by colour — a yellow tint for selected, a red one for check — which
  // is invisible both to a screen reader and to anyone who cannot separate
  // those hues from the wood behind them.
  const name = `${'abcdefgh'[col]}${8 - row}`;
  const occupant = piece
    ? `${fogged ? 'unknown piece' : `${piece.color} ${piece.type}`}`
    : 'empty';
  const notes = [
    isSelected && 'selected',
    isCheck && 'in check',
    isValidCapture ? 'can capture here' : isValidMove && 'can move here',
    isCardTarget && 'card target',
    isLastMoveTo && 'last move',
    ...modIndicators.map((m) => m.key),
  ].filter(Boolean);

  return (
    <button
      type="button"
      className={className}
      onClick={onClick}
      onKeyDown={onKeyDown}
      data-row={row}
      data-col={col}
      // Roving tabindex: one stop for the whole board, then arrow keys. Sixty-
      // four separate tab stops would bury the rest of the page.
      tabIndex={isFocusTarget ? 0 : -1}
      ref={isFocusTarget ? focusRef : undefined}
      aria-label={`${name}, ${occupant}${notes.length ? `, ${notes.join(', ')}` : ''}`}
      aria-pressed={isSelected || undefined}
    >
      {modIndicators.length > 0 && (
        <div className="cd-square-mods">{modIndicators}</div>
      )}
      {piece && <Piece piece={piece} fogged={fogged} />}
      {isValidMove && !piece && <div className="cd-move-dot" />}
      {(isValidCapture || (isValidMove && piece)) && <div className="cd-capture-ring" />}
    </button>
  );
};

export default Square;
