import { test } from 'node:test';
import assert from 'node:assert/strict';
import { resolveRole } from '../../src/resumes/roles.js';

test('current keys pass through', () => {
  ['main', 'av', 'asset', 'lead', 'software'].forEach((k) => assert.equal(resolveRole(k), k));
});

test('legacy keys map to current tracks', () => {
  assert.equal(resolveRole('web'), 'software');
  assert.equal(resolveRole('manager'), 'lead');
  assert.equal(resolveRole('executive'), 'main');
});

test('missing or unknown falls back to main', () => {
  assert.equal(resolveRole(null), 'main');
  assert.equal(resolveRole(''), 'main');
  assert.equal(resolveRole('astronaut'), 'main');
});
