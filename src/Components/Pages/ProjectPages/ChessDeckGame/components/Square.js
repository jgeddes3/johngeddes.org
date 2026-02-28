import React from 'react';
import Piece from './Piece';

const Square = ({
  row, col, piece, onClick,
  isSelected, isValidMove, isValidCapture,
  isLastMoveFrom, isLastMoveTo, isCheck,
  isCardTarget, squareMods, fogged,
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
          modIndicators.push(<span key="rock" className="cd-square-mod cd-mod-rock" title="Immovable Rock">{'\u{1FAA8}'}</span>);
          break;
        case 'holyGround':
          modIndicators.push(<span key="holy" className="cd-square-mod cd-mod-holy" title="Holy Ground">{'\u2728'}</span>);
          break;
        case 'sinkhole':
          modIndicators.push(<span key="sink" className="cd-square-mod cd-mod-sinkhole" title="Sinkhole">{'\u{1F573}'}</span>);
          break;
        case 'watchtower':
          modIndicators.push(<span key="tower" className="cd-square-mod cd-mod-watchtower" title="Watchtower">{'\u{1F3F0}'}</span>);
          break;
        default:
          break;
      }
    }
  }

  return (
    <div className={className} onClick={onClick} data-row={row} data-col={col}>
      {modIndicators.length > 0 && (
        <div className="cd-square-mods">{modIndicators}</div>
      )}
      {piece && <Piece piece={piece} fogged={fogged} />}
      {isValidMove && !piece && <div className="cd-move-dot" />}
      {(isValidCapture || (isValidMove && piece)) && <div className="cd-capture-ring" />}
    </div>
  );
};

export default Square;
