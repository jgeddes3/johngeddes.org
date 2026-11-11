import { test } from 'node:test';
import assert from 'node:assert/strict';
import { lintText, lintBullets } from './lint.mjs';

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
