// npm run resumes
// Lints the copy, renders each track to PDF (Chrome) and Word (docx), writes
// them to public/resumes/, then reads every file back and checks it. Exits
// non-zero on any problem so a bad resume never gets committed by accident.
// Needs a local Chrome, like the share-card script; Vercel does not run it.
import { mkdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { ROOT, launchBrowser } from '../seo/common.mjs';
import { TRACKS } from '../../src/resumes/data.js';
import { buildModel } from '../../src/resumes/model.js';
import { lintModel, lintText } from './lint.mjs';
import { resumeHtml } from './html.mjs';
import { resumeDocxBuffer } from './docx.mjs';
import { checkTrack } from './check.mjs';

const OUT = join(ROOT, 'public', 'resumes');
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

mkdirSync(OUT, { recursive: true });
const { browser } = await launchBrowser();
const problems = [];
try {
  for (const [track, model] of models) {
    const page = await browser.newPage();
    await page.setContent(resumeHtml(model), { waitUntil: 'load' });
    await page.evaluate(async () => { await document.fonts.ready; });
    const pdf = await page.pdf({
      format: 'Letter',
      printBackground: true,
      margin: { top: '0.55in', bottom: '0.55in', left: '0.6in', right: '0.6in' },
    });
    await page.close();
    const docx = await resumeDocxBuffer(model);
    writeFileSync(join(OUT, `${track.file}.pdf`), pdf);
    writeFileSync(join(OUT, `${track.file}.docx`), docx);
    const found = await checkTrack(track, model, { pdf, docx });
    problems.push(...found);
    console.log(`${found.length ? 'FAIL' : 'ok  '}  ${track.file}  (${track.pages} page${track.pages > 1 ? 's' : ''} expected)`);
  }
} finally {
  await browser.close();
}

if (problems.length) {
  console.error('\nResume checks failed:\n  ' + problems.join('\n  '));
  process.exit(1);
}
console.log(`\n${models.length * 2} files written to public/resumes/`);
