// The bold improvements inside bullets, and the education years that only the
// Workday files print.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import JSZip from 'jszip';
import { EDUCATION, JOBS, TRACKS } from '../../src/resumes/data.js';
import { plain, spans } from '../../src/resumes/format.js';
import { buildModel, expectedLines } from '../../src/resumes/model.js';
import { resumeHtml } from './html.mjs';
import { resumeDocxBuffer } from './docx.mjs';
import { workdayLines } from './workday.mjs';

const models = TRACKS.map((t) => buildModel(t));
const rawBullets = Object.values(JOBS).flatMap((j) => Object.values(j.bullets).flat());

test('plain drops the marks and spans splits a bullet at them', () => {
  assert.equal(plain('Cut **the wait** in half.'), 'Cut the wait in half.');
  assert.deepEqual(spans('Cut **the wait** in half.'), [
    { text: 'Cut ', bold: false },
    { text: 'the wait', bold: true },
    { text: ' in half.', bold: false },
  ]);
  assert.deepEqual(spans('**Moved** it and **kept** it'), [
    { text: 'Moved', bold: true },
    { text: ' it and ', bold: false },
    { text: 'kept', bold: true },
    { text: ' it', bold: false },
  ]);
  assert.deepEqual(spans('No marks here.'), [{ text: 'No marks here.', bold: false }]);
});

test('every mark in the data is a closed pair around whole words', () => {
  rawBullets.forEach((b) => {
    assert.doesNotMatch(plain(b), /\*/, b);
    spans(b).filter((s) => s.bold).forEach((s) => {
      assert.equal(s.text, s.text.trim(), b);
      assert.ok(s.text.split(' ').length >= 2, b);
    });
    // A mark never splits a word, so a hyphenated word stays in one piece.
    assert.doesNotMatch(b, /[\w-]\*\*[\w-]/, b);
  });
});

test('the model keeps plain bullets beside their bold pieces', () => {
  models.forEach((m) => {
    m.jobs.forEach((j) => {
      assert.equal(j.rich.length, j.bullets.length, `${m.key} ${j.key}`);
      j.bullets.forEach((b, i) => {
        assert.doesNotMatch(b, /\*/, b);
        assert.equal(j.rich[i].map((s) => s.text).join(''), b);
      });
    });
    m.shortJobs.forEach((j) => assert.deepEqual(j.rich, [], `${m.key} ${j.key}`));
  });
});

const boldOf = (m) => m.jobs.flatMap((j) => j.rich.flat()).filter((s) => s.bold).map((s) => s.text);

test('every resume has bold improvements, on fewer than half its bullets', () => {
  models.forEach((m) => {
    const bullets = m.jobs.flatMap((j) => j.rich);
    const marked = bullets.filter((pieces) => pieces.some((s) => s.bold));
    assert.ok(marked.length >= 3, m.key);
    assert.ok(marked.length * 2 <= bullets.length + 1, `${m.key}: ${marked.length} of ${bullets.length}`);
  });
});

const esc = (s) => s.replace(/&/g, '&amp;');
const untag = (s) => s.replace(/<[^>]+>/g, '');

test('HTML prints each improvement bold inside its bullet, and no marks', () => {
  models.forEach((m) => {
    const html = resumeHtml(m);
    assert.doesNotMatch(html, /\*\*/, m.key);
    const items = [...html.matchAll(/<li>(.*?)<\/li>/g)].map((x) => x[1]);
    const bold = items.flatMap((li) => [...li.matchAll(/<b>(.*?)<\/b>/g)].map((x) => untag(x[1])));
    assert.deepEqual(bold, boldOf(m).map(esc), m.key);
  });
});

test('Word prints each improvement as a bold run inside its bullet, and no marks', async () => {
  for (const m of models) {
    const zip = await JSZip.loadAsync(await resumeDocxBuffer(m));
    const xml = await zip.file('word/document.xml').async('string');
    assert.doesNotMatch(xml, /\*\*/, m.key);
    const bullets = [...xml.matchAll(/<w:p\b[^>]*>.*?<\/w:p>/gs)].map((x) => x[0]).filter((p) => p.includes('<w:numPr>'));
    const bold = bullets.flatMap((p) => [...p.matchAll(/<w:r>(.*?)<\/w:r>/gs)]
      .filter((r) => /<w:b\/>|<w:b w:val="(true|1)"\/>/.test(r[1]))
      .map((r) => untag(r[1])));
    assert.deepEqual(bold, boldOf(m).map(esc), m.key);
  }
});

test('the site files leave the education years out', async () => {
  for (const m of models) {
    assert.ok(!expectedLines(m).includes(EDUCATION.dates), m.key);
    assert.ok(!untag(resumeHtml(m)).includes(EDUCATION.dates), m.key);
    const zip = await JSZip.loadAsync(await resumeDocxBuffer(m));
    const xml = await zip.file('word/document.xml').async('string');
    assert.ok(!untag(xml).includes(EDUCATION.dates), m.key);
    const school = [...xml.matchAll(/<w:p\b[^>]*>.*?<\/w:p>/gs)].map((x) => untag(x[0])).filter((t) => t.startsWith(esc(EDUCATION.school)));
    assert.ok(school.includes(esc(EDUCATION.school)), m.key);
  }
});

test('the Workday files keep the education years and print no bold marks', () => {
  models.forEach((m) => {
    const lines = workdayLines(m);
    const at = lines.findIndex((l) => l.text === EDUCATION.degree);
    assert.ok(at > 0, m.key);
    assert.deepEqual(lines[at + 1], { kind: 'line', text: EDUCATION.dates }, m.key);
    lines.forEach((l) => assert.doesNotMatch(l.text, /\*/, l.text));
  });
});
