import { test } from 'node:test';
import assert from 'node:assert/strict';
import { TRACKS, JOBS, PROJECTS, LEGACY_ROLES } from '../../src/resumes/data.js';
import { buildModel, expectedLines } from '../../src/resumes/model.js';
import { lintModel, lintText } from './lint.mjs';

// The only numbers the copy may contain. Each traces to John (2026-11-11) or
// to a case-study page. A new number means a new fact: add it here only after
// checking its source. A small number such as 1, 2 or 19 is allowed because
// it appears in "Level 1", "Tier 2", "React 19" and "COVID-19", so this test
// cannot catch a fabricated small number; human review covers that.
const ALLOWED_NUMBERS = new Set([
  '0', '1', '2', '5', '6', '14', '19', '19.5', '1.3', '20', '36', '41', '43', '88', '100',
  '102', '120', '144', '160', '228', '256', '314', '360', '568', '716', '910', '2,082',
  '2026', '3,822', '11,942', '48,243', '200,000',
]);

test('five tracks with the agreed keys, files and page counts', () => {
  assert.deepEqual(TRACKS.map((t) => t.key), ['main', 'av', 'asset', 'lead', 'software']);
  assert.equal(TRACKS.find((t) => t.key === 'main').pages, 2);
  TRACKS.filter((t) => t.key !== 'main').forEach((t) => assert.equal(t.pages, 1, t.key));
  TRACKS.forEach((t) => assert.match(t.file, /^John_Geddes_Resume(_[A-Za-z_]+)?$/));
});

test('every track builds, has four figures and a note', () => {
  TRACKS.forEach((t) => {
    const m = buildModel(t);
    assert.ok(m.jobs.length >= 3, t.key);
    assert.equal(t.figures.length, 4, t.key);
    assert.ok(t.note.length > 10, t.key);
  });
});

test('the Discover team line is kept word for word wherever Discover leads', () => {
  ['main', 'asset', 'lead'].forEach((k) => {
    assert.ok(
      JOBS.discover.bullets[k].some((b) => b.startsWith('Led and mentored a team of five Level 1 technicians')),
      k,
    );
  });
});

test('TAG title and dates are fixed', () => {
  assert.equal(JOBS.tag.title, 'Senior Desktop Support Engineer');
  assert.equal(JOBS.tag.company, 'The Aspen Group (TAG)');
  assert.equal(JOBS.tag.start, '2025-09');
  assert.equal(JOBS.tag.end, null);
});

test('copy passes the lint for every track', () => {
  const problems = TRACKS.flatMap((t) => lintModel(buildModel(t)));
  TRACKS.forEach((t) => {
    problems.push(...lintText(t.note, `${t.key} note`));
    t.figures.forEach(([v, l]) => problems.push(...lintText(`${v} ${l}`, `${t.key} figure`)));
  });
  assert.deepEqual(problems, []);
});

// Spelled-out numbers get the same treatment as digits. The same note applies:
// "one" or "two" can be ordinary words (or "Level one"), so this test cannot
// catch a fabricated small number; human review covers that.
const ALLOWED_NUMBER_WORDS = new Set(['zero', 'one', 'two', 'four', 'five', 'six', 'seven', 'eight']);
const NUMBER_WORD_RE = /\b(zero|one|two|three|four|five|six|seven|eight|nine|ten|eleven|twelve|thirteen|fourteen|fifteen|sixteen|seventeen|eighteen|nineteen|twenty|thirty|forty|fifty|sixty|seventy|eighty|ninety|hundreds?|thousands?|dozens?|millions?|billions?)\b/gi;

test('the number-word pattern catches plurals and larger words', () => {
  const hits = (s) => [...s.matchAll(NUMBER_WORD_RE)].map((m) => m[0].toLowerCase());
  assert.deepEqual(
    hits('hundreds of rooms, thousands of assets, dozens of sites, sixty seventy eighty ninety, millions and billions'),
    ['hundreds', 'thousands', 'dozens', 'sixty', 'seventy', 'eighty', 'ninety', 'millions', 'billions'],
  );
  assert.deepEqual(hits('a hundred, a thousand, a dozen, a million, a billion'), ['hundred', 'thousand', 'dozen', 'million', 'billion']);
  assert.deepEqual(hits('someone, often, tenant, nineteenth'), []);
});

function copyStrings() {
  const strings = [];
  TRACKS.forEach((t) => {
    strings.push(t.summary, t.note, t.headline);
    t.skills.forEach(([g, i]) => strings.push(g, i));
    t.figures.forEach(([v, l]) => strings.push(v, l));
  });
  Object.values(JOBS).forEach((j) => {
    strings.push(j.title);
    Object.values(j.bullets).forEach((list) => strings.push(...list));
  });
  Object.values(PROJECTS).forEach((p) => strings.push(p.text));
  return strings;
}

test('no number appears that is not on the allowed list', () => {
  const found = copyStrings().join(' ').match(/\d[\d,]*(?:\.\d+)?/g) || [];
  const unknown = [...new Set(found.map((n) => n.replace(/,$/, '')))].filter((n) => !ALLOWED_NUMBERS.has(n));
  assert.deepEqual(unknown, []);
});

test('no spelled-out number appears that is not on the allowed list', () => {
  const unknown = [];
  copyStrings().forEach((str) => {
    for (const m of str.matchAll(NUMBER_WORD_RE)) {
      if (!ALLOWED_NUMBER_WORDS.has(m[0].toLowerCase())) unknown.push(`${m[0]} in "${str}"`);
    }
  });
  assert.deepEqual(unknown, []);
});

test('expectedLines lists name first and education last', () => {
  const lines = expectedLines(buildModel(TRACKS[0]));
  assert.equal(lines[0], 'John Geddes');
  assert.equal(lines.at(-1), 'Student Government representative for the Computer Science department.');
});

test('legacy role values map to current tracks', () => {
  assert.equal(LEGACY_ROLES.web, 'software');
  assert.equal(LEGACY_ROLES.manager, 'lead');
  assert.equal(LEGACY_ROLES.executive, 'main');
});

test('software track prints the short entries after TLC and before the projects', () => {
  const software = TRACKS.find((t) => t.key === 'software');
  const m = buildModel(software);
  const lines = expectedLines(m);
  const tlc = m.jobs.find((j) => j.key === 'tlc');
  const start = lines.lastIndexOf(tlc.bullets.at(-1)) + 1;
  const expected = ['discover', 'abbott', 'kirkland', 'loyola']
    .map((k) => m.shortJobs.find((j) => j.key === k))
    .flatMap((j) => [j.title, j.line, j.dates]);
  assert.deepEqual(lines.slice(start, start + expected.length), expected);
  assert.equal(lines[start + expected.length], m.projects[0].name);
});
