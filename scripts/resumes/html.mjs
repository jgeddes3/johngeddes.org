// Model to print HTML for Chrome's PDF engine. One column, real text, no
// tables, icons or images, and nothing in a page header or footer, which is
// what resume parsers handle best.

const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

const CSS = `
  @page { size: Letter; }
  * { box-sizing: border-box; }
  body { font-family: Georgia, 'Times New Roman', serif; font-size: 10pt; line-height: 1.25; color: #1a1a1a; margin: 0; background: #fff; }
  h1 { font-size: 20pt; margin: 0; letter-spacing: .2pt; }
  .headline { font-size: 11.5pt; color: #333; margin: 1pt 0 2pt; }
  .contact { font-size: 9pt; color: #333; margin-bottom: 4pt; }
  h2 { font-size: 10.5pt; text-transform: uppercase; letter-spacing: .8pt; border-bottom: .75pt solid #888;
       padding-bottom: 1.5pt; margin: 6pt 0 3pt; }
  p { margin: 0; }
  .skill { margin-bottom: 1.5pt; }
  .job, .project { margin-bottom: 5pt; break-inside: avoid; }
  .job.short { margin-bottom: 2pt; }
  .title { font-weight: bold; font-size: 10.5pt; }
  .row { display: flex; justify-content: space-between; align-items: baseline; gap: 10pt; color: #333; }
  .row .right { white-space: nowrap; font-size: 9.5pt; }
  ul { margin: 2pt 0 0; padding-left: 13pt; }
  li { margin-bottom: 1pt; }
`;

function section(title, body) {
  return `<section><h2>${esc(title)}</h2>${body}</section>`;
}

function job(j) {
  if (!j.bullets.length) {
    return `<div class="job short"><div class="row"><span><b>${esc(j.title)}</b> · ${esc(j.line)}</span><span class="right">${esc(j.dates)}</span></div></div>`;
  }
  const bullets = j.bullets.length ? `<ul>${j.bullets.map((b) => `<li>${esc(b)}</li>`).join('')}</ul>` : '';
  return `<div class="job">
    <div class="title">${esc(j.title)}</div>
    <div class="row"><span>${esc(j.line)}</span><span class="right">${esc(j.dates)}</span></div>
    ${bullets}
  </div>`;
}

function project(p) {
  return `<div class="project">
    <div class="row"><span class="title">${esc(p.name)}</span><span class="right">${esc(p.link)}</span></div>
    <p>${esc(p.text)}</p>
  </div>`;
}

function education(e) {
  return `<div class="job">
    <div class="row"><span class="title">${esc(e.school)}</span><span class="right">${esc(e.dates)}</span></div>
    <p>${esc(e.degree)}</p>
    ${e.note ? `<p>${esc(e.note)}</p>` : ''}
  </div>`;
}

export function resumeHtml(m) {
  return `<!doctype html><html lang="en"><head><meta charset="utf-8">
<title>${esc(m.name)} Resume · ${esc(m.headline)}</title><style>${CSS}</style></head><body>
<header>
  <h1>${esc(m.name)}</h1>
  <div class="headline">${esc(m.headline)}</div>
  <div class="contact">${esc(m.contact)}</div>
</header>
${section('Summary', `<p>${esc(m.summary)}</p>`)}
${section('Skills', m.skills.map((s) => `<div class="skill"><b>${esc(s.group)}:</b> ${esc(s.items)}</div>`).join(''))}
${section('Work Experience', [...m.jobs, ...m.shortJobs].map(job).join(''))}
${m.projects.length ? section('Projects', m.projects.map(project).join('')) : ''}
${section('Education', education(m.education))}
</body></html>`;
}
