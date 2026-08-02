import React from 'react';
import Background from '../../ForEveryPage/Background';
import PageFooter from '../../ForEveryPage/PageFooter';
import SEO from '../../ForEveryPage/SEO';
import { Link } from 'react-router-dom';
import './ProjectTemplate.css';
import Glyph from './icons/Glyph';
import CaseHero from './ProjectPageImages/ChessDeck/case-hero.webp';

const FEATURES = [
  {
    glyph: 'chessBoard',
    title: 'Chess first, cards second',
    body: `The engine generates every legal move before a card is ever considered: castling
      rights, en passant, promotion, pins, discovered check, checkmate and stalemate. That
      layer is verified by perft — an exhaustive node count against published reference
      values — matching exactly to depth four from the opening position, 197,281 positions,
      and 97,862 from Kiwipete, the standard test position for castling and en passant.
      With no cards in play the game is ordinary chess, and the tests prove it rather than
      assume it.`,
  },
  {
    glyph: 'chessCard',
    title: 'Twenty-one cards, one targeting grammar',
    body: `Every card is data: a rarity, a target type drawn from five values, an optional
      filter, and the number of steps its targeting takes. The board becomes a filtered
      picker driven by that declaration, so a card that captures an enemy piece and a card
      that blesses an empty square use the same machinery. The constraint was deliberate —
      no card gets bespoke UI code, because twenty-one bespoke paths is twenty-one places
      for the rules to drift.`,
  },
  {
    glyph: 'chessClock',
    title: 'Effects that outlive the turn',
    body: `Nine states can linger after the card that created them is discarded: five on
      pieces — shielded, frozen, moving like a knight, bounty-marked, under vigil — and four
      on squares. Each carries its own expiry and the id of the piece it was cast on, so two
      copies of the same card cannot cancel one another. They used to: a second Petrify
      expiring unfroze the first victim early, which with duplicates in the deck happened
      routinely.`,
  },
  {
    glyph: 'chessCpu',
    title: 'An opponent that plays eight of the twenty-one',
    body: `The computer searches with alpha-beta minimax over material values and
      per-piece-square tables, and it plays cards — but only the eight whose effects it can
      evaluate. The rest it holds rather than playing badly. That is a limit worth stating
      plainly: a card-aware search would need to score board states that the evaluation
      function has no vocabulary for, like a square that will swallow the next piece to
      land on it.`,
  },
  {
    glyph: 'chessLink',
    title: 'Online without a server of my own',
    body: `Two-player games run over Firebase Realtime Database rooms with onDisconnect
      presence, so a room cleans itself up when a player closes the tab. There is no backend
      process to deploy or keep awake — you get a link, you send it, the game starts. An
      earlier peer-to-peer WebRTC implementation was abandoned and its dead module deleted
      rather than left in the tree to imply an architecture the game does not use.`,
  },
  {
    glyph: 'chessKnight',
    title: 'One reducer, five phases',
    body: `Draw, card, move, promotion, game over — the whole game is one reducer of fourteen
      actions with no state outside it, which is what makes the engine testable in Node with
      no browser and no framework. The same reducer drives hot-seat, computer and online
      play; the modes differ only in who dispatches.`,
  },
];

const LEDGER = [
  { label: 'Cards in the game', value: '21' },
  { label: 'Cards in a shuffled deck', value: '44' },
  { label: 'Lingering effects a card can leave', value: '9' },
  { label: 'Turn phases in the state machine', value: '5' },
  { label: 'Cards the computer knows how to play', value: '8 of 21' },
  { label: 'Engine tests, zero dependencies', value: '84' },
];

const ChessDeckCase = () => (
  <>
    <SEO
      title="Chess Deck"
      description="Chess Deck — a card-based chess variant by John Geddes. Full legal chess move generation verified by perft, twenty-one cards that bend the rules, and a computer opponent, playable in the browser."
      path="/ChessDeck"
    />
    <Background />
    <div id="centerpiece2" className="main-content">
      <h1>Chess Deck</h1>
    </div>
    <div className="proj-page main-content">
      <div className="proj-hero">
        <p className="proj-hero-tagline">
          Every legal chess move, and twenty-one ways to break it.
        </p>
        <div className="proj-tech-pills">
          <span className="proj-pill">React</span>
          <span className="proj-pill">Vite</span>
          <span className="proj-pill">useReducer</span>
          <span className="proj-pill">Alpha-beta minimax</span>
          <span className="proj-pill">Firebase Realtime Database</span>
          <span className="proj-pill">node:test</span>
        </div>
        <div className="proj-actions">
          <Link to="/ChessDeck/play" className="proj-action-link">
            Play it in your browser
          </Link>
        </div>
        <p className="proj-status">
          Playable now in three modes: hot-seat, against the computer, and online over a
          shared link. Two things are worth knowing before you start. The computer opponent
          plays eight of the twenty-one cards and holds the rest, because scoring the other
          thirteen needs an evaluation vocabulary it does not have. And the card art is a set
          of drawn silhouettes rather than illustration — a floor I could reach and verify at
          the size cards actually render, not a finished ceiling.
        </p>
      </div>

      <div className="proj-hero-screenshot">
        <img
          loading="lazy"
          decoding="async"
          src={CaseHero}
          alt="A Chess Deck game in progress: a mid-game board in a gilt frame, the opponent's five face-down cards above it, and a hand of five cards below showing Sabotage, Hasty Retreat, Fortify, Recall and Petrify"
        />
      </div>

      <div className="proj-about">
        <p>
          Chess Deck is chess with a deck built on top of it. Each turn you draw a card, may
          play one, and then move. The cards do things chess does not allow: freeze a piece
          where it stands, drop a rock on a square nothing can cross, mark a piece with a
          bounty, swap two of your own pieces, teleport your king out of a mating net. The
          chess underneath stays real — the cards bend it, and the engine's job is to make
          sure they never quietly break it.
        </p>
        <p>
          That is the whole design constraint, and it decided the architecture. Every card
          had to be expressible as data plus one branch of a reducer rather than bespoke
          code, so the rules live in one place and can be tested without a browser. It is
          also where the hard problems were. A card that moves a pinned piece has to be
          refused, not merely warned about. Attack detection has to be separated from legal
          move generation, or a card that makes a piece uncapturable accidentally makes a
          king unable to be checked. Both of those shipped as bugs before the tests existed
          to catch them.
        </p>
      </div>

      <h2 className="proj-section-heading">What it does</h2>
      <div className="proj-features">
        {FEATURES.map((feature) => (
          <div className="proj-feature-card" key={feature.title}>
            <div className="proj-feature-head">
              <span className="proj-feature-icon">
                <Glyph name={feature.glyph} size={26} />
              </span>
              <h3>{feature.title}</h3>
            </div>
            <p>{feature.body}</p>
          </div>
        ))}
      </div>

      <div className="proj-ledger">
        {LEDGER.map((row) => (
          <div className="proj-ledger-row" key={row.label}>
            <span className="proj-ledger-label">{row.label}</span>
            <span className="proj-ledger-value">{row.value}</span>
          </div>
        ))}
      </div>

    </div>
    <PageFooter />
  </>
);

export default ChessDeckCase;
