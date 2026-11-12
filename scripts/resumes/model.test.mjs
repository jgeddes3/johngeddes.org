import { test } from 'node:test';
import assert from 'node:assert/strict';
import { TRACKS, CONTACT } from '../../src/resumes/data.js';
import { buildModel, expectedLines, contactHref } from '../../src/resumes/model.js';

const C = CONTACT;

test('contactHref links the email, phone, site, LinkedIn and GitHub', () => {
  assert.equal(contactHref(C.email), `mailto:${C.email}`);
  assert.equal(contactHref(C.phone), 'tel:+16127903691');
  assert.equal(contactHref(C.site), `https://${C.site}`);
  assert.equal(contactHref(C.linkedin), `https://${C.linkedin}`);
  assert.equal(contactHref(C.github), `https://${C.github}`);
});

test('contactHref returns null for the location and unknown text', () => {
  assert.equal(contactHref(C.location), null);
  ['example.com', 'someone@example.com', '(555) 555-0100', '', 'toString', '__proto__', undefined]
    .forEach((s) => assert.equal(contactHref(s), null, String(s)));
});

test('every printed contact item except the location gets a link', () => {
  TRACKS.forEach((t) => {
    buildModel(t).contact.flatMap((line) => line.split(' · ')).forEach((part) => {
      if (part === C.location) assert.equal(contactHref(part), null, t.key);
      else assert.ok(contactHref(part), `${t.key}: ${part}`);
    });
  });
});

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
