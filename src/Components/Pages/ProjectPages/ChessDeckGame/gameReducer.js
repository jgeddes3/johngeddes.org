import {
  WHITE, BLACK, KING,
  PHASE_DRAW, PHASE_MOVE, PHASE_PROMOTION, PHASE_GAME_OVER,
  createInitialBoard, createDeck, MAX_HAND_SIZE, STARTING_HAND_SIZE, shuffleArray, PAWN,
} from './constants.js';
import {
  getValidMoves, getGameStatus, executeMove, executePromotion, deepCloneBoard,
  findSafeSquareForKing, isKingInCheck, isInsufficientMaterial, positionKey,
} from './gameLogic.js';
import { CARDS, CARD_LIST } from './cardDefinitions.js';
import { applyCardEffect, getValidCardTargets, canPlayCard, processTemporaryEffects } from './cardLogic.js';

// ── Initial state builder ────────────────────────────────────────────

export function createInitialState(startingColor = WHITE) {
  const deck = createDeck(CARD_LIST);
  const whiteHand = deck.splice(0, STARTING_HAND_SIZE);
  const blackHand = deck.splice(0, STARTING_HAND_SIZE);

  return {
    board: createInitialBoard(),
    currentPlayer: WHITE, // White always moves first
    startingColor,
    phase: PHASE_DRAW,
    hands: { white: whiteHand, black: blackHand },
    deck,
    discardPile: [],
    activeCard: null,
    cardTargets: [],
    cardTargetStep: 0,
    cardPlayedThisTurn: false,
    selectedSquare: null,
    validMoves: [],
    enPassantTarget: null,
    squareModifiers: {},
    temporaryEffects: [],
    capturedPieces: { white: [], black: [] },
    movesRemainingThisTurn: 1,
    halfmoveClock: 0,
    positionCounts: {},
    lastMove: null,
    promotionSquare: null,
    gameResult: null,
    fogActive: null,
    message: null,
  };
}

// ── Draw helper ──────────────────────────────────────────────────────

function drawCards(state, count) {
  let { deck, discardPile, hands } = state;
  deck = [...deck];
  discardPile = [...discardPile];
  const hand = [...hands[state.currentPlayer]];

  for (let i = 0; i < count; i++) {
    if (hand.length >= MAX_HAND_SIZE) break;
    if (deck.length === 0) {
      if (discardPile.length === 0) break;
      deck = shuffleArray(discardPile);
      discardPile = [];
    }
    hand.push(deck.pop());
  }

  return {
    deck,
    discardPile,
    hands: { ...hands, [state.currentPlayer]: hand },
  };
}

// ── Second Chance helper ─────────────────────────────────────────────

function trySecondChance(state, kingColor) {
  const hand = state.hands[kingColor];
  const idx = hand.indexOf('21');
  if (idx === -1) return null;

  const board = deepCloneBoard(state.board);

  // Remove the existing king from the board
  let theKing = null;
  for (let r = 0; r < 8; r++) {
    for (let c = 0; c < 8; c++) {
      const p = board[r][c];
      if (p && p.type === KING && p.color === kingColor) {
        theKing = p;
        board[r][c] = null;
      }
    }
  }

  const safeSquare = findSafeSquareForKing(board, kingColor, state.squareModifiers);
  if (!safeSquare) return null;

  // Keep the king's id and modifiers: it is the same piece teleporting, and
  // rebuilding it from scratch orphaned any effect that named it.
  board[safeSquare.row][safeSquare.col] = {
    ...(theKing || {}),
    type: KING, color: kingColor, hasMoved: true,
    modifiers: theKing ? [...theKing.modifiers] : [],
  };

  const newHand = hand.filter((_, i) => i !== idx);

  return {
    board,
    hands: { ...state.hands, [kingColor]: newHand },
    discardPile: [...state.discardPile, '21'],
    message: 'Second Chance! The king escapes to safety!',
  };
}

// ── Card legality ────────────────────────────────────────────────────

/**
 * A card may never leave your own king attacked.
 *
 * applyCardEffect writes straight to the board, and the reducer only ever ran
 * getGameStatus for the *opponent*. So Switcheroo, Recall, Catapult, Gambit,
 * Sinkhole and Hasty Retreat could each move or delete a pinned piece and pass
 * the turn with your own king under attack — which is the whole reason a
 * "king captured" branch had to exist downstream.
 *
 * Rejecting rather than merely warning also closes a soft-lock: without a move
 * that resolves the self-inflicted check, and with no way to pass, the game
 * simply stops.
 */
function leavesOwnKingInCheck(result, state) {
  return isKingInCheck(
    result.board || state.board,
    state.currentPlayer,
    result.squareModifiers || state.squareModifiers
  );
}

function refuseCard(state, card) {
  return {
    ...state,
    activeCard: null,
    cardTargets: [],
    cardTargetStep: 0,
    message: `${card.name} would leave your king in check.`,
  };
}

/**
 * Settle a turn that has become unplayable.
 *
 * A player with no legal move is checkmated or stalemated by definition — but
 * nothing ever asked. getGameStatus was only ever run for the *opponent*, so a
 * player who stranded themselves mid-turn (Immovable Rock on their king's last
 * escape square, or a Double Time whose second move has nowhere to go) sat in
 * the move phase with nothing on the board clickable and no way forward.
 *
 * Answering it here is what lets the interface have no Pass button: a turn
 * always costs a move, and if it cannot, the game is already over.
 */
function settleIfStranded(state) {
  const status = getGameStatus(
    state.board, state.currentPlayer, state.enPassantTarget,
    state.squareModifiers, state.temporaryEffects
  );
  if (status.isCheckmate) {
    const opponent = state.currentPlayer === WHITE ? BLACK : WHITE;
    const reprieve = trySecondChance(state, state.currentPlayer);
    if (reprieve) {
      return { ...state, board: reprieve.board, hands: reprieve.hands, discardPile: reprieve.discardPile, message: reprieve.message };
    }
    return {
      ...state,
      phase: PHASE_GAME_OVER,
      gameResult: { winner: opponent, reason: 'checkmate' },
      message: 'Checkmate!',
    };
  }
  if (status.isStalemate) {
    return {
      ...state,
      phase: PHASE_GAME_OVER,
      gameResult: { winner: null, reason: 'stalemate' },
      message: 'Stalemate!',
    };
  }
  return state;
}

/**
 * A pawn parked on the last rank by a card rather than by a move. Switcheroo
 * can swap a pawn onto the eighth rank, which used to leave it sitting there as
 * a pawn forever because only executeMove ever looked for promotions.
 */
function pendingPromotion(board, color) {
  const rank = color === WHITE ? 0 : 7;
  for (let c = 0; c < 8; c++) {
    const p = board[rank][c];
    if (p && p.type === 'pawn' && p.color === color) return { row: rank, col: c };
  }
  return null;
}

// ── Reducer ──────────────────────────────────────────────────────────

export function gameReducer(state, action) {
  switch (action.type) {

    case 'INIT_GAME':
      return createInitialState();

    case 'DRAW_CARD': {
      if (state.phase !== PHASE_DRAW) return state;
      const drawn = drawCards(state, 1);
      return {
        ...state,
        ...drawn,
        phase: PHASE_MOVE,
        cardPlayedThisTurn: false,
        message: null,
      };
    }

    // Player clicks a card from their hand during PHASE_MOVE
    case 'SELECT_CARD': {
      if (state.phase !== PHASE_MOVE) return state;
      if (state.cardPlayedThisTurn) return { ...state, message: 'Already played a card this turn.' };

      const cardId = action.cardId;
      const card = CARDS[cardId];
      if (!card) return state;

      if (!canPlayCard(card, state)) {
        return { ...state, message: `Cannot play ${card.name} right now.` };
      }

      // Instant cards (no target needed)
      if (card.targetType === 'none') {
        const result = applyCardEffect(card, state, []);
        if (leavesOwnKingInCheck(result, state)) return refuseCard(state, card);
        const newHand = state.hands[state.currentPlayer].filter((_, i) => i !== action.handIndex);

        // If card replaces move, go straight to end-of-turn check
        if (card.replacesMove) {
          const opp = state.currentPlayer === WHITE ? BLACK : WHITE;
          const status = getGameStatus(result.board, opp, result.enPassantTarget || state.enPassantTarget, result.squareModifiers || state.squareModifiers, result.temporaryEffects || state.temporaryEffects);
          const baseEndState = {
            ...result,
            hands: { ...result.hands, [state.currentPlayer]: newHand },
            discardPile: [...result.discardPile, cardId],
            activeCard: null,
            cardTargets: [],
            cardTargetStep: 0,
            cardPlayedThisTurn: true,
          };
          if (status.isCheckmate) {
            const reprieve = trySecondChance(baseEndState, opp);
            if (reprieve) {
              return endTurn({
                ...baseEndState,
                board: reprieve.board,
                hands: reprieve.hands,
                discardPile: reprieve.discardPile,
              }, false);
            }
            return {
              ...baseEndState,
              phase: PHASE_GAME_OVER,
              gameResult: { winner: state.currentPlayer, reason: 'checkmate' },
              message: 'Checkmate!',
            };
          }
          if (status.isStalemate) {
            return {
              ...baseEndState,
              phase: PHASE_GAME_OVER,
              gameResult: { winner: null, reason: 'stalemate' },
              message: 'Stalemate!',
            };
          }
          return endTurn(baseEndState, status.isCheck);
        }

        return settleIfStranded({
          ...result,
          hands: { ...result.hands, [state.currentPlayer]: newHand },
          discardPile: [...result.discardPile, cardId],
          activeCard: null,
          cardTargets: [],
          cardTargetStep: 0,
          cardPlayedThisTurn: true,
          phase: PHASE_MOVE,
          message: `${card.name} played!`,
        });
      }

      // Cards needing targets — enter targeting mode (still PHASE_MOVE)
      return {
        ...state,
        activeCard: { cardId, handIndex: action.handIndex, card },
        cardTargets: [],
        cardTargetStep: 0,
        selectedSquare: null,
        validMoves: [],
        message: card.targetPrompt || `Select a target for ${card.name}`,
      };
    }

    case 'SELECT_CARD_TARGET': {
      if (!state.activeCard) return state;
      const { card, cardId, handIndex } = state.activeCard;
      const target = action.target;

      const validTargets = getValidCardTargets(card, state, state.cardTargetStep);
      const isValid = validTargets.some(t => t.row === target.row && t.col === target.col);
      if (!isValid) {
        return { ...state, message: 'Invalid target.' };
      }

      const newTargets = [...state.cardTargets, target];

      // Check if we need more targets
      const stepsNeeded = card.targetSteps || 1;
      if (newTargets.length < stepsNeeded) {
        return {
          ...state,
          cardTargets: newTargets,
          cardTargetStep: state.cardTargetStep + 1,
          message: card.targetPrompts ? card.targetPrompts[newTargets.length] : `Select next target for ${card.name}`,
        };
      }

      // All targets collected — apply effect
      const result = applyCardEffect(card, state, newTargets);
      if (leavesOwnKingInCheck(result, state)) return refuseCard(state, card);
      const newHand = state.hands[state.currentPlayer].filter((_, i) => i !== handIndex);

      // If the card replaces the move, end the turn
      if (card.replacesMove) {
        const opp = state.currentPlayer === WHITE ? BLACK : WHITE;
        const status = getGameStatus(result.board, opp, result.enPassantTarget || state.enPassantTarget, result.squareModifiers || state.squareModifiers, result.temporaryEffects || state.temporaryEffects);
        const baseEndState2 = {
          ...result,
          hands: { ...result.hands, [state.currentPlayer]: newHand },
          discardPile: [...(result.discardPile || state.discardPile), cardId],
          activeCard: null,
          cardTargets: [],
          cardTargetStep: 0,
          cardPlayedThisTurn: true,
        };
        if (status.isCheckmate) {
          const reprieve = trySecondChance(baseEndState2, opp);
          if (reprieve) {
            return endTurn({
              ...baseEndState2,
              board: reprieve.board,
              hands: reprieve.hands,
              discardPile: reprieve.discardPile,
            }, false);
          }
          return {
            ...baseEndState2,
            phase: PHASE_GAME_OVER,
            gameResult: { winner: state.currentPlayer, reason: 'checkmate' },
            message: 'Checkmate!',
          };
        }
        if (status.isStalemate) {
          return {
            ...baseEndState2,
            phase: PHASE_GAME_OVER,
            gameResult: { winner: null, reason: 'stalemate' },
            message: 'Stalemate!',
          };
        }
        return endTurn(baseEndState2, status.isCheck);
      }

      const effectPhase = result.phase || PHASE_MOVE;
      // Promotion Decree sets the phase itself; the sweep catches a pawn a card
      // *moved* onto the last rank, which nothing else was looking for.
      const swept = effectPhase === PHASE_PROMOTION
        ? null
        : pendingPromotion(result.board || state.board, state.currentPlayer);
      const isPromotion = effectPhase === PHASE_PROMOTION || Boolean(swept);

      const afterCard = {
        ...result,
        hands: { ...result.hands, [state.currentPlayer]: newHand },
        discardPile: [...(result.discardPile || state.discardPile), cardId],
        activeCard: null,
        cardTargets: [],
        cardTargetStep: 0,
        cardPlayedThisTurn: true,
        phase: isPromotion ? PHASE_PROMOTION : PHASE_MOVE,
        promotionSquare: swept || result.promotionSquare || state.promotionSquare,
        message: isPromotion ? 'Choose promotion piece' : `${card.name} played! Now make your move.`,
      };
      // The card may have taken away your own last legal move.
      return isPromotion ? afterCard : settleIfStranded(afterCard);
    }

    // A turn can reach zero legal moves without being mate or stalemate: play
    // Immovable Rock on your king's only escape square, sinkhole your last
    // mobile piece, or spend the first half of a Double Time and find the
    // second has nowhere to go. With no way to end a turn, the game simply
    // stopped — phase stuck on move, player stuck on you, nothing clickable.
    case 'PASS_TURN': {
      if (state.phase !== PHASE_MOVE) return state;
      const opp = state.currentPlayer === WHITE ? BLACK : WHITE;
      const status = getGameStatus(
        state.board, opp, state.enPassantTarget, state.squareModifiers, state.temporaryEffects
      );
      if (status.isCheckmate) {
        return {
          ...state,
          phase: PHASE_GAME_OVER,
          gameResult: { winner: state.currentPlayer, reason: 'checkmate' },
          message: 'Checkmate!',
        };
      }
      return endTurn({ ...state, movesRemainingThisTurn: 0, selectedSquare: null, validMoves: [] }, status.isCheck);
    }

    case 'RESIGN': {
      if (state.phase === PHASE_GAME_OVER) return state;
      const winner = state.currentPlayer === WHITE ? BLACK : WHITE;
      return {
        ...state,
        phase: PHASE_GAME_OVER,
        gameResult: { winner, reason: 'resignation' },
        message: `${state.currentPlayer === WHITE ? 'White' : 'Black'} resigned.`,
      };
    }

    case 'CANCEL_CARD': {
      return {
        ...state,
        activeCard: null,
        cardTargets: [],
        cardTargetStep: 0,
        message: null,
      };
    }

    case 'SELECT_PIECE': {
      if (state.phase !== PHASE_MOVE) return state;
      if (state.activeCard) return state; // in card targeting mode, ignore piece selection
      const { row, col } = action;
      const piece = state.board[row][col];
      if (!piece || piece.color !== state.currentPlayer) return state;

      if (piece.modifiers.includes('petrified') || piece.modifiers.includes('immovable')) {
        return { ...state, message: 'This piece cannot move.' };
      }

      const moves = getValidMoves(
        state.board, row, col,
        state.enPassantTarget,
        state.squareModifiers,
        state.temporaryEffects
      );

      return {
        ...state,
        selectedSquare: { row, col },
        validMoves: moves,
        message: null,
      };
    }

    case 'DESELECT_PIECE': {
      return {
        ...state,
        selectedSquare: null,
        validMoves: [],
      };
    }

    case 'MAKE_MOVE': {
      if (state.phase !== PHASE_MOVE || !state.selectedSquare) return state;
      const { row, col } = action;
      const from = state.selectedSquare;
      const moveInfo = state.validMoves.find(m => m.row === row && m.col === col);
      if (!moveInfo) return state;

      const movingPiece = state.board[from.row][from.col];
      const { newBoard, captured, enPassantTarget, promotionNeeded, shieldBroken } =
        executeMove(state.board, from, { row, col }, moveInfo);

      if (shieldBroken) {
        const shieldMovesLeft = state.movesRemainingThisTurn - 1;
        const shieldState = {
          ...state,
          board: newBoard,
          selectedSquare: null,
          validMoves: [],
          lastMove: { from, to: { row, col } },
          movesRemainingThisTurn: shieldMovesLeft,
          cardPlayedThisTurn: true,
        };

        if (shieldMovesLeft > 0) {
          return { ...shieldState, phase: PHASE_MOVE, message: 'Shield broken! The piece survived.' };
        }

        const shieldOpp = state.currentPlayer === WHITE ? BLACK : WHITE;
        const shieldStatus = getGameStatus(newBoard, shieldOpp, state.enPassantTarget, state.squareModifiers, state.temporaryEffects);

        if (shieldStatus.isCheckmate) {
          const reprieve = trySecondChance(shieldState, shieldOpp);
          if (reprieve) {
            return endTurn({ ...shieldState, board: reprieve.board, hands: reprieve.hands, discardPile: reprieve.discardPile }, false);
          }
          return { ...shieldState, phase: PHASE_GAME_OVER, gameResult: { winner: state.currentPlayer, reason: 'checkmate' }, message: 'Checkmate!' };
        }
        if (shieldStatus.isStalemate) {
          return { ...shieldState, phase: PHASE_GAME_OVER, gameResult: { winner: null, reason: 'stalemate' }, message: 'Stalemate!' };
        }

        return endTurn(shieldState, shieldStatus.isCheck);
      }

      // King captured — capturer wins (or Second Chance saves)
      if (captured && captured.type === KING) {
        const opp = state.currentPlayer === WHITE ? BLACK : WHITE;
        // For king capture, use newBoard (king already gone) to find safe square
        const hand = state.hands[opp];
        const scIdx = hand.indexOf('21');
        if (scIdx !== -1) {
          const safeSquare = findSafeSquareForKing(newBoard, opp, state.squareModifiers);
          if (safeSquare) {
            const boardWithKing = deepCloneBoard(newBoard);
            boardWithKing[safeSquare.row][safeSquare.col] = {
              type: KING, color: opp, hasMoved: true, modifiers: [],
            };
            const newHand = hand.filter((_, i) => i !== scIdx);
            return endTurn({
              ...state,
              board: boardWithKing,
              hands: { ...state.hands, [opp]: newHand },
              discardPile: [...state.discardPile, '21'],
              capturedPieces: state.capturedPieces,
              selectedSquare: null,
              validMoves: [],
              enPassantTarget,
              lastMove: { from, to: { row, col } },
              movesRemainingThisTurn: 0,
              cardPlayedThisTurn: true,
            }, false);
          }
        }
        return {
          ...state,
          board: newBoard,
          capturedPieces: { ...state.capturedPieces, [state.currentPlayer]: [...state.capturedPieces[state.currentPlayer], captured] },
          selectedSquare: null,
          validMoves: [],
          lastMove: { from, to: { row, col } },
          phase: PHASE_GAME_OVER,
          gameResult: { winner: state.currentPlayer, reason: 'king_captured' },
          message: 'King Captured!',
        };
      }

      // Handle sinkhole
      const sinkKey = `${row}-${col}`;
      let boardAfterSinkhole = newBoard;
      let extraCaptured = null;
      const sqMods = { ...state.squareModifiers };

      if (sqMods[sinkKey] && sqMods[sinkKey].some(m => m.type === 'sinkhole') && !shieldBroken) {
        const landedPiece = boardAfterSinkhole[row][col];
        if (landedPiece && landedPiece.type !== 'king') {
          extraCaptured = landedPiece;
          boardAfterSinkhole = deepCloneBoard(boardAfterSinkhole);
          boardAfterSinkhole[row][col] = null;
          sqMods[sinkKey] = sqMods[sinkKey].filter(m => m.type !== 'sinkhole');
          if (sqMods[sinkKey].length === 0) delete sqMods[sinkKey];
        }
      }

      const newCaptured = { ...state.capturedPieces };
      if (captured) {
        const capturerColor = state.currentPlayer;
        newCaptured[capturerColor] = [...newCaptured[capturerColor], captured];
      }
      if (extraCaptured) {
        const oppColor = state.currentPlayer === WHITE ? BLACK : WHITE;
        newCaptured[oppColor] = [...newCaptured[oppColor], extraCaptured];
      }

      // Bounty bonus draws. Matched against the captured piece's id, not the
      // square it died on: the mark travels with the piece, which is what the
      // card says and what the badge drawn on it implies.
      let bonusDraws = 0;
      if (captured) {
        const claimed = state.temporaryEffects.some(
          e => e.type === 'bounty' &&
               e.color === state.currentPlayer &&
               (e.pieceId != null
                 ? e.pieceId === captured.id
                 : e.targetRow === row && e.targetCol === col)
        );
        if (claimed) bonusDraws = 2;
      }

      const movesLeft = state.movesRemainingThisTurn - 1;

      if (promotionNeeded) {
        return {
          ...state,
          board: boardAfterSinkhole,
          capturedPieces: newCaptured,
          selectedSquare: null,
          validMoves: [],
          enPassantTarget,
          squareModifiers: sqMods,
          phase: PHASE_PROMOTION,
          promotionSquare: { row, col },
          lastMove: { from, to: { row, col } },
          movesRemainingThisTurn: movesLeft,
          cardPlayedThisTurn: true, // moving counts as committing the turn
          message: 'Choose promotion piece',
        };
      }

      // The fifty-move counter: reset by a pawn move or any capture, since
      // either makes the position unrepeatable and restarts progress.
      const irreversible = Boolean(captured) || movingPiece?.type === PAWN;

      let tempState = {
        ...state,
        board: boardAfterSinkhole,
        capturedPieces: newCaptured,
        selectedSquare: null,
        validMoves: [],
        enPassantTarget,
        squareModifiers: sqMods,
        lastMove: { from, to: { row, col } },
        movesRemainingThisTurn: movesLeft,
        cardPlayedThisTurn: true,
        halfmoveClock: irreversible ? 0 : (state.halfmoveClock || 0) + 1,
        positionCounts: irreversible ? {} : state.positionCounts,
      };

      if (bonusDraws > 0) {
        const drawn = drawCards(tempState, bonusDraws);
        tempState = { ...tempState, ...drawn };
      }

      // If more moves remain (Double Time), stay in MOVE phase — unless the
      // first move gave check.
      //
      // Two unanswered moves plus a king that can be captured was an available
      // instant win in most middlegames: check with the first, take the king
      // with the second. Forfeiting the second move on check keeps the card
      // strong for development and attack while removing the one line that
      // ended games outright. The opponent still has to answer the check.
      if (movesLeft > 0) {
        const opponent = state.currentPlayer === WHITE ? BLACK : WHITE;
        if (isKingInCheck(boardAfterSinkhole, opponent, sqMods)) {
          return endTurn({ ...tempState, movesRemainingThisTurn: 0 }, true);
        }
        return settleIfStranded({ ...tempState, phase: PHASE_MOVE, message: `${movesLeft} move(s) remaining` });
      }

      // Check game status for the opponent
      const opp = state.currentPlayer === WHITE ? BLACK : WHITE;
      const status = getGameStatus(boardAfterSinkhole, opp, enPassantTarget, sqMods, state.temporaryEffects);

      if (status.isCheckmate) {
        const reprieve = trySecondChance(tempState, opp);
        if (reprieve) {
          return endTurn({
            ...tempState,
            board: reprieve.board,
            hands: reprieve.hands,
            discardPile: reprieve.discardPile,
            movesRemainingThisTurn: 0,
          }, false);
        }
        return {
          ...tempState,
          phase: PHASE_GAME_OVER,
          gameResult: { winner: state.currentPlayer, reason: 'checkmate' },
          message: 'Checkmate!',
        };
      }
      if (status.isStalemate) {
        return {
          ...tempState,
          phase: PHASE_GAME_OVER,
          gameResult: { winner: null, reason: 'stalemate' },
          message: 'Stalemate!',
        };
      }

      return endTurn(tempState, status.isCheck);
    }

    case 'CHOOSE_PROMOTION': {
      if (state.phase !== PHASE_PROMOTION) return state;
      const { row, col } = state.promotionSquare;
      const newBoard = executePromotion(state.board, row, col, action.pieceType);

      const movesLeft = state.movesRemainingThisTurn;

      if (movesLeft > 0) {
        return {
          ...state,
          board: newBoard,
          phase: PHASE_MOVE,
          promotionSquare: null,
          message: `${movesLeft} move(s) remaining`,
        };
      }

      const opp = state.currentPlayer === WHITE ? BLACK : WHITE;
      const status = getGameStatus(newBoard, opp, state.enPassantTarget, state.squareModifiers, state.temporaryEffects);

      if (status.isCheckmate) {
        const promoState = { ...state, board: newBoard, promotionSquare: null };
        const reprieve = trySecondChance(promoState, opp);
        if (reprieve) {
          return endTurn({
            ...promoState,
            board: reprieve.board,
            hands: reprieve.hands,
            discardPile: reprieve.discardPile,
          }, false);
        }
        return {
          ...promoState,
          phase: PHASE_GAME_OVER,
          gameResult: { winner: state.currentPlayer, reason: 'checkmate' },
          message: 'Checkmate!',
        };
      }
      if (status.isStalemate) {
        return {
          ...state,
          board: newBoard,
          phase: PHASE_GAME_OVER,
          promotionSquare: null,
          gameResult: { winner: null, reason: 'stalemate' },
          message: 'Stalemate!',
        };
      }

      return endTurn({ ...state, board: newBoard, promotionSquare: null }, status.isCheck);
    }

    case 'SKIP_DRAW': {
      if (state.phase !== PHASE_DRAW) return state;
      return {
        ...state,
        phase: PHASE_MOVE,
        cardPlayedThisTurn: false,
        message: null,
      };
    }

    case 'REMATCH':
      return createInitialState(state.startingColor === WHITE ? BLACK : WHITE);

    case 'REPLACE_STATE':
      return action.state;

    default:
      return state;
  }
}

// ── End turn helper ──────────────────────────────────────────────────

function endTurn(state, isCheck) {
  const nextPlayer = state.currentPlayer === WHITE ? BLACK : WHITE;

  const { temporaryEffects, board, squareModifiers } = processTemporaryEffects(
    state.temporaryEffects,
    state.board,
    state.squareModifiers,
    state.currentPlayer
  );

  let fogActive = state.fogActive;
  if (fogActive && fogActive === nextPlayer) {
    fogActive = null;
  }

  // Draws by rule. Without them a dead ending never ends — in self-play a third
  // of games ran to the move cap with two bare kings shuffling. Checkmate and
  // stalemate are already resolved by the callers; these three are the ones
  // that need history, so this is the one place that can see them.
  const key = positionKey(board, nextPlayer, state.enPassantTarget);
  const positionCounts = { ...(state.positionCounts || {}) };
  positionCounts[key] = (positionCounts[key] || 0) + 1;
  const halfmoveClock = state.halfmoveClock || 0;

  const base = {
    ...state,
    board,
    currentPlayer: nextPlayer,
    phase: PHASE_DRAW,
    selectedSquare: null,
    validMoves: [],
    activeCard: null,
    cardTargets: [],
    cardTargetStep: 0,
    cardPlayedThisTurn: false,
    temporaryEffects,
    squareModifiers,
    movesRemainingThisTurn: 1,
    positionCounts,
    fogActive,
    message: isCheck ? 'Check!' : null,
  };

  // Deliberately cheap: none of these need move generation, so the expensive
  // getGameStatus call the callers already made is not repeated here.
  let drawReason = null;
  if (isInsufficientMaterial(board)) drawReason = 'insufficient material';
  else if (halfmoveClock >= 100) drawReason = 'fifty-move rule';
  else if (positionCounts[key] >= 3) drawReason = 'threefold repetition';

  if (drawReason) {
    return {
      ...base,
      phase: PHASE_GAME_OVER,
      gameResult: { winner: null, reason: drawReason },
      message: `Draw — ${drawReason}.`,
    };
  }

  return base;
}
