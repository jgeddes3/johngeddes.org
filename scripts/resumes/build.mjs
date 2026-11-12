// npm run resumes
// Lints the copy, then renders each track to PDF (Chrome) and Word (docx) in
// memory, pins their timestamps so an unchanged resume gives the same bytes,
// and reads every file back to check it. Only when every track passes are the
// ten files written to public/resumes/. On any problem nothing there changes:
// the files that did render go to <os tmpdir>/resume-build-failed for a look,
// and the script exits non-zero so a bad resume never gets committed.
// Needs a local Chrome, like the share-card script; Vercel does not run it.
import { mkdirSync, rmSync, writeFileSync } from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { ROOT, launchBrowser } from '../seo/common.mjs';
import { TRACKS } from '../../src/resumes/data.js';
import { buildModel } from '../../src/resumes/model.js';
import { lintModel, lintText } from './lint.mjs';
import { resumeHtml } from './html.mjs';
import { resumeDocxBuffer } from './docx.mjs';
import { checkTrack } from './check.mjs';
import { pinPdf, pinDocx } from './pin.mjs';

const OUT = path.join(ROOT, 'public', 'resumes');
const FAILED = path.join(os.tmpdir(), 'resume-build-failed');
const models = TRACKS.map((t) => [t, buildModel(t)]);

const lintProblems = models.flatMap(([t, m]) => [
  ...lintModel(m),
  ...lintText(t.note, `${t.key} note`),
  ...t.figures.flatMap(([v, l]) => lintText(`${v} ${l}`, `${t.key} figure`)),
]);
if (lintProblems.length) {
  console.error('Copy lint failed:\n  ' + lintProblems.join('\n  '));
  process.exit(1);
}

async function renderPdf(browser, model) {
  const page = await browser.newPage();
  try {
    await page.setContent(resumeHtml(model), { waitUntil: 'load' });
    await page.evaluate(async () => { await document.fonts.ready; });
    return await page.pdf({
      format: 'Letter',
      printBackground: true,
      margin: { top: '0.55in', bottom: '0.55in', left: '0.6in', right: '0.6in' },
    });
  } finally {
    await page.close();
  }
}

const rendered = [];
const problems = [];
const { browser } = await launchBrowser();
try {
  for (const [track, model] of models) {
    try {
      // Pinned before the check, so the bytes checked are the bytes written.
      const pdf = pinPdf(await renderPdf(browser, model));
      const docx = await pinDocx(await resumeDocxBuffer(model));
      rendered.push({ track, pdf, docx });
      const found = await checkTrack(track, model, { pdf, docx });
      problems.push(...found);
      console.log(`${found.length ? 'FAIL' : 'ok  '}  ${track.file}  (${track.pages} page${track.pages > 1 ? 's' : ''} expected)`);
    } catch (err) {
      problems.push(`${track.file}: ${err.message}`);
      console.log(`FAIL  ${track.file}  (${err.message})`);
    }
  }
} finally {
  await browser.close();
}

const dir = problems.length ? FAILED : OUT;
if (problems.length) rmSync(FAILED, { recursive: true, force: true });
mkdirSync(dir, { recursive: true });
for (const { track, pdf, docx } of rendered) {
  writeFileSync(path.join(dir, `${track.file}.pdf`), pdf);
  writeFileSync(path.join(dir, `${track.file}.docx`), docx);
}

if (problems.length) {
  console.error('\nResume checks failed:\n  ' + problems.join('\n  '));
  console.error(`\nNothing in public/resumes/ was changed. The files that rendered are in ${FAILED}`);
  process.exit(1);
}
console.log(`\n${rendered.length * 2} files written to public/resumes/`);
