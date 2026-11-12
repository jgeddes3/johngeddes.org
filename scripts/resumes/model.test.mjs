import { test } from 'node:test';
import assert from 'node:assert/strict';
import { TRACKS, CONTACT } from '../../src/resumes/data.js';
import { buildModel, expectedLines } from '../../src/resumes/model.js';

const C = CONTACT;

test('contact is one line, or two when the track shows GitHub', () => {
  TRACKS.filter((t) => !t.github).forEach((t) => {
    assert.deepEqual(buildModel(t).contact, [[C.location, C.phone, C.email, C.site, C.linkedin].join(' · ')], t.key);
  });
  const software = TRACKS.find((t) => t.key === 'software');
  assert.equal(software.github, true);
  assert.deepEqual(buildModel(software).contact, [
    [C.location, C.phone, C.email].join(' · '),
    [C.site, C.linkedin, C.github].join(' · '),
  ]);
});

test('expectedLines lists each contact line after the headline', () => {
  TRACKS.forEach((t) => {
    const m = buildModel(t);
    const lines = expectedLines(m);
    assert.deepEqual(lines.slice(2, 2 + m.contact.length), m.contact, t.key);
    assert.equal(lines[2 + m.contact.length], m.summary, t.key);
  });
});

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
