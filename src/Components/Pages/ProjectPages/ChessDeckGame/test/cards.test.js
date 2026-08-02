// Card data integrity and deck composition.
//
// The deck is small enough that every card can be checked individually, which
// is worth doing: a typo in an id or a duplicated colour is invisible in play
// but breaks the art pass and the AI's scoring.
import { test, describe } from 'node:test';
import assert from 'node:assert/strict';

import { CARDS, CARD_LIST } from '../cardDefinitions.js';
import { CARD_ART, artInkContrast, artInkFor, monogramFor } from '../cardArt.js';
import { createDeck, RARITY_COMMON, RARITY_UNCOMMON, RARITY_RARE } from '../constants.js';

const RARITIES = [RARITY_COMMON, RARITY_UNCOMMON, RARITY_RARE];

describe('card definitions', () => {
  test('every card has the fields the UI and AI read', () => {
    for (const card of CARD_LIST) {
      assert.ok(card.id, 'id');
      assert.ok(card.name, `name for ${card.id}`);
      assert.ok(card.description, `description for ${card.name}`);
      assert.ok(RARITIES.includes(card.rarity), `valid rarity for ${card.name}`);
      assert.ok(card.targetType, `targetType for ${card.name}`);
      assert.ok(card.artColor, `artColor for ${card.name}`);
    }
  });

  test('ids and names are unique', () => {
    const ids = CARD_LIST.map((c) => c.id);
    const names = CARD_LIST.map((c) => c.name);
    assert.equal(new Set(ids).size, ids.length, 'duplicate id');
    assert.equal(new Set(names).size, names.length, 'duplicate name');
  });

  test('ids are contiguous from 1, so createDeck cannot skip one', () => {
    const ids = CARD_LIST.map((c) => Number(c.id)).sort((a, b) => a - b);
    assert.deepEqual(ids, ids.map((_, i) => i + 1));
  });

  test('artColor is unique per card — it is the only thing distinguishing them until the art lands', () => {
    const seen = new Map();
    for (const card of CARD_LIST) {
      const clash = seen.get(card.artColor);
      assert.equal(clash, undefined, `${card.name} shares ${card.artColor} with ${clash}`);
      seen.set(card.artColor, card.name);
    }
  });

  test('CARDS is keyed by id and agrees with CARD_LIST', () => {
    assert.equal(Object.keys(CARDS).length, CARD_LIST.length);
    for (const card of CARD_LIST) assert.equal(CARDS[card.id].name, card.name);
  });

  test('no card still carries a placeholder art marker in its description', () => {
    for (const card of CARD_LIST) {
      assert.ok(!/TODO|placeholder/i.test(card.description), `${card.name} description`);
    }
  });
});

describe('deck composition', () => {
  test('the deck only contains ids that exist', () => {
    for (const id of createDeck(CARD_LIST)) assert.ok(CARDS[id], `unknown card id ${id}`);
  });

  test('every card appears at least once', () => {
    const present = new Set(createDeck(CARD_LIST));
    for (const card of CARD_LIST) {
      assert.ok(present.has(card.id), `${card.name} is unreachable in the deck`);
    }
  });

  test('shuffling does not change the multiset', () => {
    const a = createDeck(CARD_LIST).sort();
    const b = createDeck(CARD_LIST).sort();
    assert.deepEqual(a, b, 'two decks differ in composition, not just order');
  });

  test('rarity changes how often a card is drawn', () => {
      const deck = createDeck(CARD_LIST);
      const countFor = (rarity) => deck.filter((id) => CARDS[id].rarity === rarity).length
        / CARD_LIST.filter((c) => c.rarity === rarity).length;
      assert.ok(countFor(RARITY_COMMON) > countFor(RARITY_UNCOMMON),
        'commons should be more numerous per card than uncommons');
      assert.ok(countFor(RARITY_UNCOMMON) > countFor(RARITY_RARE),
        'uncommons should be more numerous per card than rares');
    });
});

describe('Vigil (replaces Bodyguard, which did nothing)', () => {
  test('an opponent cannot target a piece under vigil', async () => {
    const { getValidCardTargets } = await import('../cardLogic.js');
    const { boardFrom, sq, withModifier } = await import('./helpers.js');
    const board = boardFrom([
      '....k...', '........', '........', '........',
      '........', '........', '....n...', '....K...',
    ]);
    const state = { board, currentPlayer: 'white', squareModifiers: {}, cardTargets: [] };
    const petrify = CARDS['6'];

    const before = getValidCardTargets(petrify, state, 0);
    assert.ok(before.some((t) => t.row === sq('e2').row && t.col === sq('e2').col),
      'the knight is targetable to begin with');

    withModifier(board, 'e2', 'vigil');
    const after = getValidCardTargets(petrify, state, 0);
    assert.ok(!after.some((t) => t.row === sq('e2').row && t.col === sq('e2').col),
      'vigil removes it from the target list');
  });

  test('vigil does not protect against your own cards', async () => {
    const { getValidCardTargets } = await import('../cardLogic.js');
    const { boardFrom, sq, withModifier } = await import('./helpers.js');
    // A bishop, not a knight — Stallion Spirit excludes knights by design, so a
    // knight here would fail the assertion for the wrong reason.
    const board = boardFrom([
      '....k...', '........', '........', '........',
      '........', '........', '....B...', '....K...',
    ]);
    withModifier(board, 'e2', 'vigil');
    const state = { board, currentPlayer: 'white', squareModifiers: {}, cardTargets: [] };
    const stallion = CARDS['5'];
    const targets = getValidCardTargets(stallion, state, 0);
    assert.ok(targets.some((t) => t.row === sq('e2').row && t.col === sq('e2').col),
      'your own piece stays targetable by your own cards');
  });
});

describe('card art', () => {
  test('every card resolves to a non-empty monogram', () => {
    for (const card of Object.values(CARDS)) {
      const mono = monogramFor(card.name);
      assert.match(mono, /^[A-Za-z]{1,2}$/, `${card.name} -> "${mono}"`);
    }
  });

  test('monograms are unique, so no two cards share a placeholder plate', () => {
    const byMonogram = new Map();
    for (const card of Object.values(CARDS)) {
      const mono = monogramFor(card.name);
      const clash = byMonogram.get(mono);
      assert.equal(clash, undefined, `${card.name} and ${clash} both render "${mono}"`);
      byMonogram.set(mono, card.name);
    }
  });

  test('drops articles rather than letting them win a slot', () => {
    assert.equal(monogramFor('Fog of War'), 'FW');
    assert.equal(monogramFor('Sabotage'), 'Sa');
  });

  test('only ships art for ids that are real cards', () => {
    for (const id of Object.keys(CARD_ART)) {
      assert.ok(CARDS[id], `CARD_ART has "${id}", which is not a card`);
      assert.ok(CARD_ART[id].d, `CARD_ART["${id}"] has no path data`);
    }
  });

  test('the art ink clears 3:1 on every field, the bar for 30px display type', () => {
    for (const card of Object.values(CARDS)) {
      const ratio = artInkContrast(card.artColor);
      assert.ok(ratio >= 3, `${card.name} (${card.artColor}) only reaches ${ratio.toFixed(2)}:1`);
    }
  });

  test('picks the ink that measures better, not the one a threshold would guess', () => {
    // Hasty Retreat's teal is the case a luminance cutoff gets wrong.
    assert.ok(artInkFor('#5F9EA0').startsWith('rgba(18'), 'mid-tone teal takes dark ink');
    assert.ok(artInkFor('#2C1810').startsWith('rgba(248'), 'near-black takes light ink');
    assert.ok(artInkFor('#FFFACD').startsWith('rgba(18'), 'cream takes dark ink');
  });
});
