import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { setTimeout as sleep } from 'node:timers/promises';
import JSZip from 'jszip';
import { TRACKS } from '../../src/resumes/data.js';
import { buildModel } from '../../src/resumes/model.js';
import { resumeDocxBuffer } from './docx.mjs';
import { pdfText, docxText } from './check.mjs';
import { pinPdf, pinDocx, PINNED_ISO } from './pin.mjs';

const main = TRACKS[0];
const pdfPath = new URL(`../../public/resumes/${main.file}.pdf`, import.meta.url);

// The same PDF printed at another moment: only the Info dates differ.
const restamp = (buf, stamp) => Buffer.from(
  Buffer.from(buf).toString('latin1').replace(/\/(CreationDate|ModDate) \(D:\d{14}/g, `/$1 (D:${stamp}`),
  'latin1',
);

test('pinPdf gives identical bytes for PDFs printed at different times', () => {
  const a = restamp(readFileSync(pdfPath), '20301231235959');
  const b = restamp(readFileSync(pdfPath), '20310615120000');
  assert.notDeepEqual(a, b);
  const pa = pinPdf(a);
  assert.deepEqual(pa, pinPdf(b));
  assert.deepEqual(pinPdf(pa), pa);
  assert.equal(pa.length, a.length);
  const raw = pa.toString('latin1');
  assert.match(raw, /\/CreationDate \(D:20260101000000/);
  assert.match(raw, /\/ModDate \(D:20260101000000/);
});

test('pinPdf leaves the PDF text unchanged', async () => {
  const before = readFileSync(pdfPath);
  const a = await pdfText(before);
  const b = await pdfText(pinPdf(before));
  assert.equal(b.pages, a.pages);
  assert.equal(b.text, a.text);
});

test('pinDocx gives identical bytes for Word files built at different times', async () => {
  const m = buildModel(main);
  const a = await resumeDocxBuffer(m);
  await sleep(15);
  const b = await resumeDocxBuffer(m);
  assert.notDeepEqual(a, b);
  const pa = await pinDocx(a);
  assert.deepEqual(pa, await pinDocx(b));
  assert.deepEqual(await pinDocx(pa), pa);
});

test('pinDocx sets the core dates and every zip entry date, and keeps the text', async () => {
  const raw = await resumeDocxBuffer(buildModel(main));
  const pinned = await pinDocx(raw);
  const zip = await JSZip.loadAsync(pinned);
  const core = await zip.file('docProps/core.xml').async('string');
  assert.match(core, new RegExp(`<dcterms:created[^>]*>${PINNED_ISO}</dcterms:created>`));
  assert.match(core, new RegExp(`<dcterms:modified[^>]*>${PINNED_ISO}</dcterms:modified>`));
  Object.values(zip.files).forEach((f) => assert.equal(f.date.toISOString(), '2026-01-01T00:00:00.000Z', f.name));
  assert.equal(await docxText(pinned), await docxText(raw));
});

test('pinDocx rejects a zip with no docProps/core.xml', async () => {
  const zip = new JSZip();
  zip.file('word/document.xml', '<w:document/>');
  const buf = await zip.generateAsync({ type: 'nodebuffer' });
  await assert.rejects(() => pinDocx(buf), /docProps\/core\.xml is missing/);
});
