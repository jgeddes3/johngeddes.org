import { test } from 'node:test';
import assert from 'node:assert/strict';
import JSZip from 'jszip';
import { TRACKS } from '../../src/resumes/data.js';
import { buildModel } from '../../src/resumes/model.js';
import { resumeHtml } from './html.mjs';
import { resumeDocxBuffer } from './docx.mjs';

const main = buildModel(TRACKS[0]);
const software = buildModel(TRACKS.find((t) => t.key === 'software'));

test('HTML uses the plain section headings in order', () => {
  const html = resumeHtml(main);
  const order = ['Summary', 'Skills', 'Work Experience', 'Projects', 'Education'].map((h) => html.indexOf(`<h2>${h}</h2>`));
  order.forEach((i) => assert.ok(i > 0));
  assert.deepEqual([...order].sort((a, b) => a - b), order);
});

test('HTML has no tables, images or page header/footer elements', () => {
  const html = resumeHtml(main);
  assert.doesNotMatch(html, /<table|<img|<svg/i);
});

test('HTML escapes ampersands in company names', () => {
  assert.match(resumeHtml(main), /Kirkland &amp; Ellis/);
});

test('short jobs render without bullets', () => {
  const html = resumeHtml(software);
  const discover = html.slice(html.indexOf('Audio Visual Specialist II'));
  const nextJob = discover.indexOf('class="job"', 10);
  const block = nextJob > 0 ? discover.slice(0, nextJob) : discover;
  assert.doesNotMatch(block, /<li>/);
});

const bodyOf = (html) => html.slice(html.indexOf('<body>'), html.indexOf('</body>'));
const textOf = (markup) => markup.replace(/<[^>]+>/g, ' ');
const NOWRAP = /<span style="white-space:nowrap">([^<]*)<\/span>/g;

test('HTML keeps headings with their section and asks for balanced line breaks', () => {
  const html = resumeHtml(main);
  assert.match(html, /\bh2 \{[^}]*break-after: avoid;/);
  for (const sel of ['li', 'p', '\\.skill']) {
    assert.match(html, new RegExp(`(^|\\s)${sel} \\{[^}]*text-wrap: pretty;`), sel);
  }
});

test('HTML never breaks a hyphenated word at its hyphen', () => {
  TRACKS.forEach((t) => {
    const body = bodyOf(resumeHtml(buildModel(t)));
    const wrapped = [...body.matchAll(NOWRAP)].map((m) => m[1]);
    wrapped.forEach((w) => assert.match(w, /^\S+-\S+$/, t.key));
    assert.doesNotMatch(textOf(body.replace(NOWRAP, '')), /\S-\S/, t.key);
  });
  assert.ok(bodyOf(resumeHtml(main)).includes('<span style="white-space:nowrap">C-Suite</span>'));
});

test('HTML prints one contact line per model line', () => {
  [main, software].forEach((m) => {
    const lines = [...resumeHtml(m).matchAll(/<div class="contact">(.*?)<\/div>/g)].map((x) => x[1]);
    assert.equal(lines.length, m.contact.length, m.key);
  });
  assert.equal(software.contact.length, 2);
});

test('HTML puts a no-break space before every dot separator', () => {
  [main, software].forEach((m) => {
    const text = textOf(bodyOf(resumeHtml(m)));
    assert.ok(text.includes('\u00A0· '), m.key);
    assert.doesNotMatch(text, / ·/, m.key);
  });
});

const docxParts = async (m) => {
  const zip = await JSZip.loadAsync(await resumeDocxBuffer(m));
  const xml = await zip.file('word/document.xml').async('string');
  const core = await zip.file('docProps/core.xml').async('string');
  const paras = [...xml.matchAll(/<w:p\b[^>]*>.*?<\/w:p>/gs)].map((x) => ({
    xml: x[0],
    text: x[0].replace(/<w:tab\/>/g, '\t').replace(/<[^>]+>/g, '').replace(/&amp;/g, '&'),
    keepNext: x[0].includes('<w:keepNext/>'),
  }));
  return { xml, core, paras };
};

test('Word keeps each section heading, the school, and a degree with a note on the next line', async () => {
  for (const m of [main, software]) {
    const { paras } = await docxParts(m);
    const headings = ['Summary', 'Skills', 'Work Experience', 'Projects', 'Education'];
    headings.forEach((h) => {
      const p = paras.find((x) => x.text === h);
      assert.ok(p, `${m.key} ${h}`);
      assert.ok(p.keepNext, `${m.key} ${h}`);
    });
    const school = paras.find((x) => x.text.startsWith(m.education.school));
    assert.ok(school.keepNext, m.key);
    const degree = paras.find((x) => x.text === m.education.degree);
    assert.equal(degree.xml.includes('<w:keepNext'), Boolean(m.education.note), m.key);
    assert.equal(degree.keepNext, Boolean(m.education.note), m.key);
  }
  assert.ok(main.education.note);
  assert.equal(software.education.note, null);
});

test('Word file names the author as last modifier', async () => {
  const { core } = await docxParts(main);
  assert.match(core, /<cp:lastModifiedBy>John Geddes<\/cp:lastModifiedBy>/);
});

test('Word prints one contact paragraph per model line, with a no-break space before each dot', async () => {
  for (const m of [main, software]) {
    const { paras } = await docxParts(m);
    const start = paras.findIndex((p) => p.text === m.headline) + 1;
    const contact = paras.slice(start, start + m.contact.length).map((p) => p.text);
    assert.deepEqual(contact, m.contact.map((l) => l.replace(/ · /g, '\u00A0· ')), m.key);
    const all = paras.map((p) => p.text).join('\n');
    assert.ok(all.includes('\u00A0· '), m.key);
    assert.doesNotMatch(all, / ·/, m.key);
  }
});

test('Word file is a real docx whose text holds every bullet', async () => {
  const buf = await resumeDocxBuffer(main);
  const zip = await JSZip.loadAsync(buf);
  const xml = await zip.file('word/document.xml').async('string');
  const styles = await zip.file('word/styles.xml').async('string');
  assert.match(styles, /<w:docDefaults>.*?w:ascii="Georgia".*?<\/w:docDefaults>/s);
  assert.doesNotMatch(xml, /<w:tbl>|<w:txbxContent>/);
  main.jobs.flatMap((j) => j.bullets).forEach((b) => {
    const words = b.split(' ').slice(0, 4).join(' ').replace(/&/g, '&amp;').replace(/'/g, '&apos;');
    assert.ok(xml.includes(words) || xml.includes(words.replace(/&apos;/g, "'")), b);
  });
});
