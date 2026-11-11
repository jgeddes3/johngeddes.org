import { test } from 'node:test';
import assert from 'node:assert/strict';
import { normalize, findInOrder, docxText } from './check.mjs';
import { TRACKS } from '../../src/resumes/data.js';
import { buildModel, expectedLines } from '../../src/resumes/model.js';
import { resumeDocxBuffer } from './docx.mjs';

test('normalize folds ligatures, curly quotes and spacing', () => {
  assert.equal(normalize('of\uFB01ce  \u2019s\n'), "office 's");
});

test('findInOrder finds needles in sequence and ignores whitespace', () => {
  assert.deepEqual(findInOrder('Alpha  Beta\nGamma', ['Alpha', 'Gamma']), { ok: true });
  assert.deepEqual(findInOrder('Alpha Beta Gamma', ['Gamma', 'Alpha']), { ok: false, missing: 'Alpha' });
  assert.deepEqual(findInOrder('Alpha Beta', ['Delta']), { ok: false, missing: 'Delta' });
});

test('every expected line of the main resume is in its Word text, in order', async () => {
  const m = buildModel(TRACKS[0]);
  const text = await docxText(await resumeDocxBuffer(m));
  assert.deepEqual(findInOrder(text, expectedLines(m)), { ok: true });
});
