import { test } from 'node:test';
import assert from 'node:assert/strict';
import { lintText, lintBullets, lintModel } from './lint.mjs';

test('flags em and en dashes', () => {
  assert.equal(lintText('Fast \u2014 and secure', 'x').length, 1);
  assert.equal(lintText('2019 \u2013 2023', 'x').length, 1);
  assert.equal(lintText('2019 to 2023', 'x').length, 0);
});

test('flags arrows', () => {
  assert.equal(lintText('API \u2192 SQL', 'x').length, 1);
});

test('flags banned words on word boundaries, case-insensitive', () => {
  assert.equal(lintText('Spearheaded the rollout', 'x').length, 1);
  assert.equal(lintText('We leverage tools', 'x').length, 1);
  assert.equal(lintText('It is not just a tool', 'x').length, 1);
  assert.equal(lintText('Built a dashboard', 'x').length, 0);
});

test('bullet length must be 8 to 32 words', () => {
  const short = ['Too short here.'];
  const long = [Array.from({ length: 33 }, () => 'word').join(' ')];
  assert.equal(lintBullets(short, 'x').length, 1);
  assert.equal(lintBullets(long, 'x').length, 1);
});

test('no opening verb more than twice per resume', () => {
  const b = [
    'Built one thing for the team that needed it badly.',
    'Built another thing for the team that also needed it.',
    'Built a third thing, which is one too many for a resume.',
  ];
  const problems = lintBullets(b, 'x');
  assert.ok(problems.some((p) => p.includes('"built"')));
});

test('flags bullets that are all nearly the same length', () => {
  const same = [
    'Installed and configured ten rooms across the main office floor.',
    'Configured and installed ten rooms across the second office floor.',
    'Supported and repaired ten rooms across the third office floor.',
    'Repaired and supported ten rooms across the fourth office floor.',
  ];
  assert.ok(lintBullets(same, 'x').some((p) => p.includes('same length')));
});

const wordsOf = (n) => Array.from({ length: n }, (_, i) => `w${String.fromCharCode(97 + (i % 26))}`).join(' ');

test('bullets of exactly 8 and 32 words pass the length check', () => {
  assert.equal(lintBullets([wordsOf(8)], 'x').length, 0);
  assert.equal(lintBullets([wordsOf(32)], 'x').length, 0);
});

test('two bullets sharing an opening verb pass', () => {
  const b = [
    'Built one thing for the team that needed it badly today.',
    'Built another thing for the team that also needed it, and then wrote it up for the whole floor.',
  ];
  assert.equal(lintBullets(b, 'x').length, 0);
});

test('four bullets of clearly varied lengths pass', () => {
  const b = ['alpha', 'bravo', 'charlie', 'delta'].map((v, i) => `${v} ${wordsOf([8, 13, 19, 26][i])}`);
  assert.equal(lintBullets(b, 'x').length, 0);
});

test('ordinary hyphens and number phrases pass', () => {
  for (const s of ['break/fix', 'first-line fixes', '360-degree cameras', 'Chicago-area sites', 'Q-SYS', 'Tier 2', 'Level 1 technicians', '2019 to 2023']) {
    assert.deepEqual(lintText(s, 'x'), [], s);
  }
});

test('number-led bullets are not grouped as one opening verb', () => {
  const b = [
    '88+ rooms configured and tested across the main campus over one summer.',
    '160 displays mounted, labelled and documented for the support team to maintain.',
    '24x7 monitoring set up for the conference spaces, with alerts that reached the on-call phone.',
  ];
  assert.ok(!lintBullets(b, 'x').some((p) => p.includes('opens')));
});

test('empty input is reported, not thrown', () => {
  assert.deepEqual(lintText('', 'x'), ['x: empty']);
  assert.deepEqual(lintText('   ', 'x'), ['x: empty']);
  assert.deepEqual(lintText(undefined, 'x'), ['x: empty']);
  assert.deepEqual(lintText(42, 'x'), ['x: empty']);
  const problems = lintBullets(['', wordsOf(12)], 'x');
  assert.ok(problems.some((p) => p.includes('empty')));
});

test('every banned phrase in a string is reported', () => {
  const problems = lintText('We leverage robust tools', 'x');
  assert.equal(problems.length, 2);
  assert.ok(problems.some((p) => p.includes('leverage')));
  assert.ok(problems.some((p) => p.includes('robust')));
});

test('wider arrow forms are flagged', () => {
  assert.equal(lintText('API -> SQL', 'x').length, 1);
  assert.equal(lintText('API => SQL', 'x').length, 1);
  assert.equal(lintText('API \u2794 SQL', 'x').length, 1);
});

test('wider dash forms are flagged', () => {
  assert.equal(lintText('Fast \u2212 and secure', 'x').length, 1);
  assert.equal(lintText('Fast - and secure', 'x').length, 1);
  assert.equal(lintText('Fast -- and secure', 'x').length, 1);
});

test('emoji are flagged', () => {
  const problems = lintText('Shipped it \u{1F680}', 'x');
  assert.equal(problems.length, 1);
  assert.ok(problems[0].includes('emoji'));
});

test('dash characters and spaced hyphens get separate messages', () => {
  for (const c of ['\u2012', '\u2013', '\u2014', '\u2015', '\u2212', '\u2E3A', '\u2E3B', '\uFF0D']) {
    assert.deepEqual(lintText(`Fast ${c} secure`, 'x'), ['x: contains a dash character'], c);
    assert.deepEqual(lintText(`2019${c}2023`, 'x'), ['x: contains a dash character'], c);
  }
  assert.deepEqual(lintText('Fast - secure', 'x'), ['x: uses a spaced hyphen as a dash']);
  assert.deepEqual(lintText('Fast -- secure', 'x'), ['x: uses a spaced hyphen as a dash']);
});

test('the left arrow form is flagged', () => {
  assert.deepEqual(lintText('SQL <- API', 'x'), ['x: contains an arrow']);
});

test('pictographic symbols use the emoji or decorative symbol message', () => {
  assert.deepEqual(lintText('Shipped it \u{1F680}', 'x'), ['x: contains an emoji or decorative symbol']);
});

test('lintModel covers education dates and project name and link', () => {
  const base = () => ({
    key: 'k', headline: 'h', summary: 's', skills: [], contact: 'c', jobs: [], shortJobs: [],
    projects: [{ name: 'Proj', link: 'example.org/proj', text: 'Text here.' }],
    education: { school: 'S', degree: 'D', dates: '2019 to 2023', note: null },
  });
  assert.deepEqual(lintModel(base()), []);
  const a = base();
  a.education.dates = '2019 \u2013 2023';
  assert.ok(lintModel(a).some((p) => p.includes('education dates')));
  const b = base();
  b.projects[0].link = 'example.org -> proj';
  assert.ok(lintModel(b).some((p) => p.includes('arrow')));
  const c = base();
  c.projects[0].name = 'Leverage';
  assert.ok(lintModel(c).some((p) => p.includes('leverage') || p.includes('Leverage')));
});
