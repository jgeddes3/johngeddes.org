// Turns a track from data.js into everything a resume prints, in reading
// order. The PDF, the Word file, the Recruiters page and the build checks all
// use this one model, so they cannot disagree.
import { CONTACT, EDUCATION, JOBS, PROJECTS } from './data.js';
import { dateRange } from './format.js';

// The contact block as printed lines: one line, or two when the track adds
// GitHub, since six items on one line wrap at an arbitrary point.
export function contactLine(track) {
  const reach = [CONTACT.location, CONTACT.phone, CONTACT.email];
  const links = [CONTACT.site, CONTACT.linkedin];
  if (!track.github) return [[...reach, ...links].join(' · ')];
  return [reach.join(' · '), [...links, CONTACT.github].join(' · ')];
}

// "Company · City, ST · Part-time", skipping empty parts.
export function companyLine(job) {
  return [job.company, job.place, job.type].filter(Boolean).join(' · ');
}

function jobEntry(key, trackKey, ownerKey) {
  const job = JOBS[key];
  if (!job) throw new Error(`Unknown job "${key}" in track "${ownerKey}"`);
  const bullets = trackKey ? job.bullets[trackKey] : [];
  if (trackKey && !(bullets && bullets.length)) {
    throw new Error(`Job "${key}" has no bullets for track "${trackKey}"`);
  }
  return {
    key,
    title: job.title,
    company: job.company,
    line: companyLine(job),
    dates: dateRange(job.start, job.end),
    bullets: [...bullets],
  };
}

export function buildModel(track) {
  return {
    key: track.key,
    name: CONTACT.name,
    headline: track.headline,
    contact: contactLine(track),
    summary: track.summary,
    skills: track.skills.map(([group, items]) => ({ group, items })),
    jobs: track.jobs.map((k) => jobEntry(k, track.key, track.key)),
    shortJobs: (track.shortJobs || []).map((k) => jobEntry(k, null, track.key)),
    projects: (track.projects || []).map((k) => {
      if (!PROJECTS[k]) throw new Error(`Unknown project "${k}" in track "${track.key}"`);
      return { ...PROJECTS[k] };
    }),
    education: { ...EDUCATION, note: track.eduNote ? EDUCATION.note : null },
  };
}

// What a reader, or a resume parser, should find in a rendered file, in order.
export function expectedLines(m) {
  const out = [m.name, m.headline, ...m.contact, m.summary];
  m.skills.forEach((s) => out.push(`${s.group}: ${s.items}`));
  [...m.jobs, ...m.shortJobs].forEach((j) => out.push(j.title, j.line, j.dates, ...j.bullets));
  m.projects.forEach((p) => out.push(p.name, p.link, p.text));
  out.push(m.education.school, m.education.dates, m.education.degree);
  if (m.education.note) out.push(m.education.note);
  return out;
}
