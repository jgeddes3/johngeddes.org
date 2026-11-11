import { test } from 'node:test';
import assert from 'node:assert/strict';
import { TRACKS } from '../../src/resumes/data.js';
import { buildModel } from '../../src/resumes/model.js';

test('mutating a built model does not change the data or later models', () => {
  const t = TRACKS[0];
  const a = buildModel(t);
  const first = a.jobs[0].bullets[0];
  a.jobs[0].bullets.push('extra');
  a.jobs[0].bullets[0] = 'changed';
  a.projects[0].name = 'changed';
  const b = buildModel(t);
  assert.equal(b.jobs[0].bullets[0], first);
  assert.ok(!b.jobs[0].bullets.includes('extra'));
  assert.notEqual(b.projects[0].name, 'changed');
});

const fake = (over) => ({ key: 'fake', headline: 'h', summary: 's', skills: [], jobs: [], ...over });

test('build errors name the track key', () => {
  assert.throws(() => buildModel(fake({ jobs: ['nope'] })), /Unknown job "nope" in track "fake"/);
  assert.throws(() => buildModel(fake({ shortJobs: ['nope'] })), /Unknown job "nope" in track "fake"/);
  assert.throws(() => buildModel(fake({ projects: ['nope'] })), /Unknown project "nope" in track "fake"/);
  assert.throws(() => buildModel(fake({ jobs: ['tag'] })), /no bullets for track "fake"/);
});
