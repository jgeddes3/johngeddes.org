// npm run resumes:workday
// A second Word layout for Workday's resume parser, which fills its own form
// from the upload and gets the site layout wrong: it read the headline as the
// address, and took a company name from a bullet when the real one shared a
// line with the place and dates. Here every field sits alone on its own line
// (place first under the name, then title, company, place and dates for each
// job), with no tabs and no separators. Same data and wording as the site
// files. Written to resumes-workday/, which git ignores: these are for
// uploading, not for the site.
import { mkdirSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { Document, Packer, Paragraph, TextRun } from 'docx';
import { CONTACT, JOBS, TRACKS } from '../../src/resumes/data.js';
import { buildModel } from '../../src/resumes/model.js';
import { docxText, findInOrder } from './check.mjs';
import { pinDocx } from './pin.mjs';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..');
const OUT = path.resolve(process.argv[2] || path.join(ROOT, 'resumes-workday'));

// Full registered names. The parser matches companies against names it knows,
// and "Discover" alone reads as an ordinary word.
const COMPANY = {
  discover: 'Discover Financial Services',
  abbott: 'Abbott Laboratories',
};

// A bare "Remote" was read as the title of a new job, so the line names the
// city John worked from.
const REMOTE = 'Chicago, IL (Remote)';
const BULLET = '• ';
const line = (text, opts = {}) => new Paragraph({ children: [new TextRun({ text, ...opts })] });
const heading = (text) => new Paragraph({
  spacing: { before: 200, after: 80 },
  keepNext: true,
  children: [new TextRun({ text, bold: true, size: 24 })],
});
// The bullet is typed text, not a Word list. Workday and some viewers show a
// Word list as "1." on every line.
const bullet = (text) => new Paragraph({ indent: { left: 220, hanging: 220 }, children: [new TextRun(BULLET + text)] });

// Everything the file prints, in order, as { kind, text }. One list feeds both
// the document and the read-back check.
export function workdayLines(m) {
  const out = [
    { kind: 'name', text: m.name },
    ...[CONTACT.location, CONTACT.phone, CONTACT.email].map((text) => ({ kind: 'line', text })),
    { kind: 'heading', text: 'Summary' },
    { kind: 'line', text: m.summary },
    { kind: 'heading', text: 'Skills' },
    ...m.skills.map((s) => ({ kind: 'line', text: `${s.group}: ${s.items}` })),
    { kind: 'heading', text: 'Work Experience' },
  ];
  [...m.jobs, ...m.shortJobs].forEach((j) => {
    const job = JOBS[j.key];
    out.push(
      { kind: 'title', text: job.type ? `${job.title} (${job.type})` : job.title },
      { kind: 'line', text: COMPANY[j.key] || job.company },
      // A job with no place was remote. It still gets the line: without it the
      // parser lost the company as well.
      { kind: 'line', text: job.place || REMOTE },
      { kind: 'line', text: j.dates },
      ...j.bullets.map((text) => ({ kind: 'bullet', text })),
    );
  });
  if (m.projects.length) {
    out.push({ kind: 'heading', text: 'Projects' });
    m.projects.forEach((p) => out.push({ kind: 'title', text: p.name }, { kind: 'line', text: p.link }, { kind: 'line', text: p.text }));
  }
  const e = m.education;
  out.push(
    { kind: 'heading', text: 'Education' },
    { kind: 'title', text: e.school },
    { kind: 'line', text: e.degree },
    { kind: 'line', text: e.dates },
  );
  if (e.note) out.push({ kind: 'line', text: e.note });
  // Full addresses in their own section at the end, where Workday's form keeps
  // its Websites list.
  out.push(
    { kind: 'heading', text: 'Websites' },
    ...[CONTACT.site, `www.${CONTACT.linkedin}`, CONTACT.github].map((u) => ({ kind: 'line', text: `https://${u}` })),
  );
  return out.filter((l) => l.text);
}

const PARAGRAPH = {
  name: (t) => line(t, { bold: true, size: 32 }),
  heading,
  title: (t) => new Paragraph({ spacing: { before: 140 }, keepNext: true, children: [new TextRun({ text: t, bold: true })] }),
  line: (t) => line(t),
  bullet,
};

export function workdayDocx(m) {
  return new Document({
    creator: m.name,
    lastModifiedBy: m.name,
    title: `${m.name} Resume`,
    styles: { default: { document: { run: { font: 'Arial', size: 21 } } } },
    sections: [{
      properties: { page: { size: { width: 12240, height: 15840 }, margin: { top: 1080, bottom: 1080, left: 1080, right: 1080 } } },
      children: workdayLines(m).map(({ kind, text }) => PARAGRAPH[kind](text)),
    }],
  });
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const files = [];
  for (const track of TRACKS) {
    const model = buildModel(track);
    const docx = await pinDocx(await Packer.toBuffer(workdayDocx(model)));
    const text = await docxText(docx);
    const found = findInOrder(text, workdayLines(model).map((l) => (l.kind === 'bullet' ? BULLET + l.text : l.text)), { keepSpaces: true });
    if (!found.ok) {
      console.error(`${track.file}_Workday.docx: missing or out of order: "${found.missing}"`);
      process.exit(1);
    }
    if (/[\t ·–—]/.test(text)) {
      console.error(`${track.file}_Workday.docx: holds a tab, no-break space, middle dot or dash`);
      process.exit(1);
    }
    files.push([`${track.file}_Workday.docx`, docx]);
  }
  mkdirSync(OUT, { recursive: true });
  files.forEach(([name, buf]) => writeFileSync(path.join(OUT, name), buf));
  console.log(`${files.length} files written to ${OUT}`);
}
