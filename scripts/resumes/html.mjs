// Model to print HTML for Chrome's PDF engine. One column, real text, no
// tables, icons or images, and nothing in a page header or footer, which is
// what resume parsers handle best.

const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

// Printed text: escaped, a no-break space before each " · " so a separator
// never ends a line, and hyphenated words (C-Suite, Q-SYS) kept whole rather
// than split at the hyphen.
const SEP = ' · ';
const NBSP_SEP = '\u00A0· ';
const text = (s) => esc(String(s).split(SEP).join(NBSP_SEP))
  .replace(/\S+-\S+/g, (w) => `<span style="white-space:nowrap">${w}</span>`);

const CSS = `
  @page { size: Letter; }
  * { box-sizing: border-box; }
  body { font-family: Georgia, 'Times New Roman', serif; font-size: 10pt; line-height: 1.25; color: #1a1a1a; margin: 0; background: #fff; }
  h1 { font-size: 20pt; margin: 0; letter-spacing: .2pt; }
  .headline { font-size: 11.5pt; color: #333; margin: 1pt 0 2pt; }
  .contact { font-size: 9pt; color: #333; }
  header { margin-bottom: 4pt; }
  h2 { font-size: 10.5pt; text-transform: uppercase; letter-spacing: .8pt; border-bottom: .75pt solid #888;
       padding-bottom: 1.5pt; margin: 6pt 0 3pt; break-after: avoid; }
  p { margin: 0; text-wrap: pretty; }
  .skill { margin-bottom: 1.5pt; text-wrap: pretty; }
  .job, .project { margin-bottom: 5pt; break-inside: avoid; }
  .job.short { margin-bottom: 2pt; }
  .title { font-weight: bold; font-size: 10.5pt; }
  .row { display: flex; justify-content: space-between; align-items: baseline; gap: 10pt; color: #333; }
  .row .right { white-space: nowrap; font-size: 9.5pt; }
  ul { margin: 2pt 0 0; padding-left: 13pt; }
  li { margin-bottom: 1pt; text-wrap: pretty; }
`;

// A bullet from its pieces, the marked improvement in bold.
const rich = (pieces) => pieces.map((s) => (s.bold ? `<b>${text(s.text)}</b>` : text(s.text))).join('');

function section(title, body) {
  return `<section><h2>${text(title)}</h2>${body}</section>`;
}

function job(j) {
  if (!j.bullets.length) {
    return `<div class="job short"><div class="row"><span><b>${text(j.title)}</b>${NBSP_SEP}${text(j.line)}</span><span class="right">${text(j.dates)}</span></div></div>`;
  }
  return `<div class="job">
    <div class="title">${text(j.title)}</div>
    <div class="row"><span>${text(j.line)}</span><span class="right">${text(j.dates)}</span></div>
    <ul>${j.rich.map((pieces) => `<li>${rich(pieces)}</li>`).join('')}</ul>
  </div>`;
}

function project(p) {
  return `<div class="project">
    <div class="row"><span class="title">${text(p.name)}</span><span class="right">${text(p.link)}</span></div>
    <p>${text(p.text)}</p>
  </div>`;
}

// No years here: the site files leave them out.
function education(e) {
  return `<div class="job">
    <div class="title">${text(e.school)}</div>
    <p>${text(e.degree)}</p>
    ${e.note ? `<p>${text(e.note)}</p>` : ''}
  </div>`;
}

export function resumeHtml(m) {
  return `<!doctype html><html lang="en"><head><meta charset="utf-8">
<title>${esc(m.name)} Resume · ${esc(m.headline)}</title><style>${CSS}</style></head><body>
<header>
  <h1>${text(m.name)}</h1>
  <div class="headline">${text(m.headline)}</div>
  ${m.contact.map((line) => `<div class="contact">${text(line)}</div>`).join('\n  ')}
</header>
${section('Summary', `<p>${text(m.summary)}</p>`)}
${section('Skills', m.skills.map((s) => `<div class="skill"><b>${text(s.group)}:</b> ${text(s.items)}</div>`).join(''))}
${section('Work Experience', [...m.jobs, ...m.shortJobs].map(job).join(''))}
${m.projects.length ? section('Projects', m.projects.map(project).join('')) : ''}
${section('Education', education(m.education))}
</body></html>`;
}
