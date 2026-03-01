import {
  WHITE, BLACK,
  PHASE_DRAW, PHASE_MOVE, PHASE_PROMOTION, PHASE_GAME_OVER,
  createInitialBoard, createDeck, MAX_HAND_SIZE, STARTING_HAND_SIZE, shuffleArray,
} from './constants';
import {
  getValidMoves, getGameStatus, executeMove, executePromotion, deepCloneBoard,
} from './gameLogic';
import { CARDS } from './cardDefinitions';
import { applyCardEffect, getValidCardTargets, canPlayCard, processTemporaryEffects } from './cardLogic';

// ── Initial state builder ────────────────────────────────────────────

export function createInitialState() {
  const deck = createDeck();
  const whiteHand = deck.splice(0, STARTING_HAND_SIZE);
  const blackHand = deck.splice(0, STARTING_HAND_SIZE);

  return {
    board: createInitialBoard(),
    currentPlayer: WHITE,
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
        const newHand = state.hands[state.currentPlayer].filter((_, i) => i !== action.handIndex);

        // If card replaces move, go straight to end-of-turn check
        if (card.replacesMove) {
          const opp = state.currentPlayer === WHITE ? BLACK : WHITE;
          const status = getGameStatus(result.board, opp, result.enPassantTarget || state.enPassantTarget, result.squareModifiers || state.squareModifiers, result.temporaryEffects || state.temporaryEffects);
          if (status.isCheckmate || status.isStalemate) {
            return {
              ...result,
              hands: { ...result.hands, [state.currentPlayer]: newHand },
              discardPile: [...result.discardPile, cardId],
              activeCard: null,
              cardTargets: [],
              cardTargetStep: 0,
              cardPlayedThisTurn: true,
              phase: PHASE_GAME_OVER,
              gameResult: status.isCheckmate
                ? { winner: state.currentPlayer, reason: 'checkmate' }
                : { winner: null, reason: 'stalemate' },
              message: status.isCheckmate ? 'Checkmate!' : 'Stalemate!',
            };
          }
          const endState = {
            ...result,
            hands: { ...result.hands, [state.currentPlayer]: newHand },
            discardPile: [...result.discardPile, cardId],
            activeCard: null,
            cardTargets: [],
            cardTargetStep: 0,
            cardPlayedThisTurn: true,
          };
          return endTurn(endState, status.isCheck);
        }

        return {
          ...result,
          hands: { ...result.hands, [state.currentPlayer]: newHand },
          discardPile: [...result.discardPile, cardId],
          activeCard: null,
          cardTargets: [],
          cardTargetStep: 0,
          cardPlayedThisTurn: true,
          phase: PHASE_MOVE,
          message: `${card.name} played!`,
        };
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
      const newHand = state.hands[state.currentPlayer].filter((_, i) => i !== handIndex);

      // If the card replaces the move, end the turn
      if (card.replacesMove) {
        const opp = state.currentPlayer === WHITE ? BLACK : WHITE;
        const status = getGameStatus(result.board, opp, result.enPassantTarget || state.enPassantTarget, result.squareModifiers || state.squareModifiers, result.temporaryEffects || state.temporaryEffects);
        if (status.isCheckmate || status.isStalemate) {
          return {
            ...result,
            hands: { ...result.hands, [state.currentPlayer]: newHand },
            discardPile: [...(result.discardPile || state.discardPile), cardId],
            activeCard: null,
            cardTargets: [],
            cardTargetStep: 0,
            cardPlayedThisTurn: true,
            phase: PHASE_GAME_OVER,
            gameResult: status.isCheckmate
              ? { winner: state.currentPlayer, reason: 'checkmate' }
              : { winner: null, reason: 'stalemate' },
            message: status.isCheckmate ? 'Checkmate!' : 'Stalemate!',
          };
        }
        const endState = {
          ...result,
          hands: { ...result.hands, [state.currentPlayer]: newHand },
          discardPile: [...(result.discardPile || state.discardPile), cardId],
          activeCard: null,
          cardTargets: [],
          cardTargetStep: 0,
          cardPlayedThisTurn: true,
        };
        return endTurn(endState, status.isCheck);
      }

      const effectPhase = result.phase || PHASE_MOVE;
      const isPromotion = effectPhase === PHASE_PROMOTION;

      return {
        ...result,
        hands: { ...result.hands, [state.currentPlayer]: newHand },
        discardPile: [...(result.discardPile || state.discardPile), cardId],
        activeCard: null,
        cardTargets: [],
        cardTargetStep: 0,
        cardPlayedThisTurn: true,
        phase: isPromotion ? PHASE_PROMOTION : PHASE_MOVE,
        message: isPromotion ? 'Choose promotion piece' : `${card.name} played! Now make your move.`,
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

      const { newBoard, captured, enPassantTarget, promotionNeeded, shieldBroken } =
        executeMove(state.board, from, { row, col }, moveInfo);

      if (shieldBroken) {
        return {
          ...state,
          board: newBoard,
          selectedSquare: null,
          validMoves: [],
          message: 'Shield broken! The piece survived. Choose another move.',
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

      // Bounty bonus draws
      let bonusDraws = 0;
      if (captured) {
        const bountyEffects = state.temporaryEffects.filter(
          e => e.type === 'bounty' &&
               e.targetRow === row && e.targetCol === col &&
               e.color === state.currentPlayer
        );
        if (bountyEffects.length > 0) {
          bonusDraws = 2;
        }
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
      };

      if (bonusDraws > 0) {
        const drawn = drawCards(tempState, bonusDraws);
        tempState = { ...tempState, ...drawn };
      }

      // If more moves remain (Double Time), stay in MOVE phase
      if (movesLeft > 0) {
        return { ...tempState, phase: PHASE_MOVE, message: `${movesLeft} move(s) remaining` };
      }

      // Check game status for the opponent
      const opp = state.currentPlayer === WHITE ? BLACK : WHITE;
      const status = getGameStatus(boardAfterSinkhole, opp, enPassantTarget, sqMods, state.temporaryEffects);

      if (status.isCheckmate) {
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
        return {
          ...state,
          board: newBoard,
          phase: PHASE_GAME_OVER,
          promotionSquare: null,
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
      return createInitialState();

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

  return {
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
    fogActive,
    message: isCheck ? 'Check!' : null,
  };
}
