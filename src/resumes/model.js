// Turns a track from data.js into everything a resume prints, in reading
// order. The PDF, the Word file, the Recruiters page and the build checks all
// use this one model, so they cannot disagree.
import { CONTACT, EDUCATION, JOBS, PROJECTS } from './data.js';
import { dateRange, plain, spans } from './format.js';

// The contact block as printed lines: one line, or two when the track adds
// GitHub, since six items on one line wrap at an arbitrary point.
export function contactLines(track) {
  const reach = [CONTACT.location, CONTACT.phone, CONTACT.email];
  const links = [CONTACT.site, CONTACT.linkedin];
  if (!track.github) return [[...reach, ...links].join(' · ')];
  return [reach.join(' · '), [...links, CONTACT.github].join(' · ')];
}

// Where each printed contact item links on the Recruiters page. Built from
// CONTACT rather than guessed from the text, so a changed phone number or
// address cannot produce a wrong link. A Map, so "toString" or "__proto__"
// finds nothing inherited. The location and any unknown text return null.
const CONTACT_HREFS = new Map([
  [CONTACT.email, `mailto:${CONTACT.email}`],
  [CONTACT.phone, `tel:+1${CONTACT.phone.replace(/\D/g, '')}`],
  [CONTACT.site, `https://${CONTACT.site}`],
  [CONTACT.linkedin, `https://${CONTACT.linkedin}`],
  [CONTACT.github, `https://${CONTACT.github}`],
]);

export function contactHref(part) {
  return CONTACT_HREFS.get(part) ?? null;
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
    // bullets is the text alone, which the Workday files, the lint and the
    // read-back checks use. rich is the same bullets split into plain and
    // bold pieces, for the files and the page that print the bold.
    bullets: bullets.map(plain),
    rich: bullets.map(spans),
  };
}

export function buildModel(track) {
  return {
    key: track.key,
    name: CONTACT.name,
    headline: track.headline,
    contact: contactLines(track),
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
// The site files leave the education years out; only the Workday files, which
// have their own list, print them.
export function expectedLines(m) {
  const out = [m.name, m.headline, ...m.contact, m.summary];
  m.skills.forEach((s) => out.push(`${s.group}: ${s.items}`));
  [...m.jobs, ...m.shortJobs].forEach((j) => out.push(j.title, j.line, j.dates, ...j.bullets));
  m.projects.forEach((p) => out.push(p.name, p.link, p.text));
  out.push(m.education.school, m.education.degree);
  if (m.education.note) out.push(m.education.note);
  return out;
}
