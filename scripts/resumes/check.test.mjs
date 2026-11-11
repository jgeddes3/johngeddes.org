import { test } from 'node:test';
import JSZip from 'jszip';
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

test('findInOrder fails at once on a needle that is not a non-empty string', () => {
  for (const bad of ['', undefined, null, 42, {}]) {
    assert.deepEqual(findInOrder('Alpha Beta', ['Alpha', bad]), { ok: false, missing: String(bad) });
  }
});

test('keepSpaces compares exact text; the default tolerates PDF word splits', () => {
  assert.deepEqual(findInOrder('Built a back- end service', ['back-end']), { ok: true });
  assert.deepEqual(findInOrder('Built a back- end service', ['back-end'], { keepSpaces: true }), { ok: false, missing: 'back-end' });
  assert.deepEqual(findInOrder('Built a back-end  service', ['back-end service'], { keepSpaces: true }), { ok: true });
  assert.deepEqual(findInOrder('Built a back-end service', ['back-endservice'], { keepSpaces: true }), { ok: false, missing: 'back-endservice' });
});

test('docxText rejects a zip with no word/document.xml', async () => {
  const zip = new JSZip();
  zip.file('hello.txt', 'hi');
  const buf = await zip.generateAsync({ type: 'nodebuffer' });
  await assert.rejects(() => docxText(buf), /Not a Word document: word\/document\.xml is missing/);
});
