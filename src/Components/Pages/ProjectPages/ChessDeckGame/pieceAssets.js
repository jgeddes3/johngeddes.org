// Image imports for the chess pieces, split out of constants.js so the pure
// game rules stay importable by Node for testing — constants.js used to pull in
// twelve PNGs, which no test runner can resolve.
//
// Exported at 160px WebP: a piece renders 52 CSS px (75% of a 69.7px square on
// the 750px board), so 160 covers DPR 3 with headroom. The 1024px PNG sources
// are kept in ProjectPageImages/ChessDeck/_source/ and are not bundled.
//
// ?no-inline because every piece now lands under Vite's 4 KB inline threshold —
// without it all twelve get base64'd into the always-loaded JS bundle, which is
// ~52 KB of uncacheable text for images the browser would otherwise fetch only
// when the board renders.
import WhiteKingImg from '../ProjectPageImages/ChessDeck/WhiteKingPiece.webp?no-inline';
import WhiteQueenImg from '../ProjectPageImages/ChessDeck/WhiteQueenPiece.webp?no-inline';
import WhiteBishopImg from '../ProjectPageImages/ChessDeck/WhiteBishopPiece.webp?no-inline';
import WhiteKnightImg from '../ProjectPageImages/ChessDeck/WhiteKnightPiece.webp?no-inline';
import WhiteRookImg from '../ProjectPageImages/ChessDeck/WhiteCastlePiece.webp?no-inline';
import WhitePawnImg from '../ProjectPageImages/ChessDeck/WhitePawnPiece.webp?no-inline';
import BlackKingImg from '../ProjectPageImages/ChessDeck/BlackKingPiece.webp?no-inline';
import BlackQueenImg from '../ProjectPageImages/ChessDeck/BlackQueenPiece.webp?no-inline';
import BlackBishopImg from '../ProjectPageImages/ChessDeck/BlackBishopPiece.webp?no-inline';
import BlackKnightImg from '../ProjectPageImages/ChessDeck/BlackKnightPiece.webp?no-inline';
import BlackRookImg from '../ProjectPageImages/ChessDeck/BlackCastlePiece.webp?no-inline';
import BlackPawnImg from '../ProjectPageImages/ChessDeck/BlackPawnPiece.webp?no-inline';

import { KING, QUEEN, ROOK, BISHOP, KNIGHT, PAWN } from './constants.js';

export const PIECE_IMAGES = {
  white: {
    [KING]: WhiteKingImg,
    [QUEEN]: WhiteQueenImg,
    [ROOK]: WhiteRookImg,
    [BISHOP]: WhiteBishopImg,
    [KNIGHT]: WhiteKnightImg,
    [PAWN]: WhitePawnImg,
  },
  black: {
    [KING]: BlackKingImg,
    [QUEEN]: BlackQueenImg,
    [ROOK]: BlackRookImg,
    [BISHOP]: BlackBishopImg,
    [KNIGHT]: BlackKnightImg,
    [PAWN]: BlackPawnImg,
  },
};
