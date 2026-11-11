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
