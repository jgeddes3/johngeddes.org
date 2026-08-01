/* Renders the four role-targeted resumes to PDF. ATS-safe: real text, one
   column, no tables, no images, standard headings. */
const puppeteer = require('C:/Users/LeoArkos/RamblerRegistrar/backend/node_modules/puppeteer');
const path = require('path');
const { CONTACT, EDUCATION, ROLES, PROJECTS, SKILLS } = require('./data.js');

const OUT = 'C:/Users/LeoArkos/johngeddes.org/public/resumes/';

const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

// key = which bullet set to pull; order = which roles appear, top first
const VARIANTS = [
  {
    file: 'Geddes_AV_Engineer.pdf', key: 'av',
    title: 'Audio Visual Engineer',
    summary: 'Audio visual engineer with five years across corporate, legal, healthcare and higher-education environments. Currently leading an enterprise AV modernisation on Q-SYS, Crestron, Biamp and Shure, and supporting the executive floor while it happens.',
    order: ['tag', 'discover', 'abbott', 'kirkland', 'loyola'],
    skills: null, projects: false,
  },
  {
    file: 'Geddes_Executive_Technician.pdf', key: 'exec',
    title: 'Executive Support Engineer',
    summary: 'Support engineer for executive floors. Five years of AV and endpoint work, currently the dedicated technical support for a full C-Suite, with enterprise device management across JAMF, Intune, ServiceNow and Entra ID.',
    order: ['tag', 'discover', 'abbott', 'kirkland', 'loyola'],
    skills: null, projects: false,
  },
  {
    file: 'Geddes_Manager.pdf', key: 'mgmt',
    title: 'Technical Lead / Manager',
    summary: 'Technical lead who came up through the work. Mentored a team of five technicians at Discover, now sets priorities and coordinates project execution for an AV engineering team while building the internal tooling that team runs on.',
    order: ['tag', 'discover', 'abbott', 'kirkland', 'loyola'],
    skills: null, projects: false,
  },
  {
    file: 'Geddes_Web_Developer.pdf', key: 'dev',
    title: 'Software Engineer',
    summary: 'Software engineer with a Computer Science degree and five years in enterprise IT. Ships production systems solo: a React Native app with on-device encryption, a course scheduler with a real constraint solver, and an internal platform reconciling eleven vendor APIs into one record per machine.',
    // A dev reader cares about the two software internships and the platform
    // built at TAG. The four junior AV roles are continuity, not content, so
    // they collapse to one line each rather than eating half of page two.
    order: ['brag', 'tlc', 'tag'],
    condense: ['discover', 'abbott', 'kirkland', 'loyola'],
    skills: SKILLS, projects: true,
  },
];

const section = (t) => `<h2>${esc(t)}</h2>`;

// Flows as one paragraph rather than one row per job: four rows plus their
// heading cost enough vertical space to push Education onto a second sheet.
function condensedBlock(keys) {
  if (!keys || !keys.length) return '';
  const parts = keys.map((k) => {
    const r = ROLES[k];
    return `<b>${esc(r.company)}</b> — ${esc(r.title)} (${esc(r.dates.replace(/(\w+) (\d{4})/g, '$1 $2'))})`;
  }).join(' &nbsp;·&nbsp; ');
  return section('Additional Experience') + `<div class="cond">${parts}</div>`;
}

function roleBlock(role, key) {
  const bullets = role[key] || [];
  if (!bullets.length) return '';
  return `<article>
    <div class="row"><span class="co">${esc(role.company)}</span><span class="dt">${esc(role.dates)}</span></div>
    <div class="row"><span class="ti">${esc(role.title)}</span><span class="pl">${esc(role.place)}</span></div>
    <ul>${bullets.map((b) => `<li>${esc(b)}</li>`).join('')}</ul>
  </article>`;
}

function html(v) {
  return `<style>
  /* Margins come from page.pdf() only — declaring them here as well made
     Chrome apply both and pushed a one-page layout onto a second sheet. */
  @page { size: Letter; }
  * { box-sizing: border-box; }
  body { font-family: Georgia, 'Times New Roman', serif; font-size: 9.1pt; line-height: 1.31; color: #1a1a1a; margin: 0; background: #fff; }
  h1 { font-size: 18.5pt; margin: 0; letter-spacing: .3px; }
  .role { font-size: 10.5pt; color: #444; margin: 1px 0 4px; }
  .contact { font-size: 8.3pt; color: #333; margin-bottom: 7px; }
  .summary { margin: 0 0 8px; }
  h2 { font-size: 9.4pt; text-transform: uppercase; letter-spacing: 1.1px; border-bottom: 1px solid #999;
       padding-bottom: 2px; margin: 9px 0 6px; }
  article { margin-bottom: 6px; break-inside: avoid; }
  .row { display: flex; justify-content: space-between; align-items: baseline; gap: 10px; }
  .co { font-weight: bold; font-size: 10.2pt; }
  .ti { font-style: italic; }
  .dt, .pl { font-size: 8.4pt; color: #444; white-space: nowrap; }
  ul { margin: 3px 0 0; padding-left: 15px; }
  li { margin-bottom: 2.5px; }
  .sk { display: flex; gap: 7px; margin-bottom: 2.5px; }
  .sk b { flex: 0 0 78px; }
  .pj { margin-bottom: 6px; break-inside: avoid; }
  .pj .row { margin-bottom: 1px; }
  .pj .lk { font-size: 8.4pt; color: #444; }
  .edu { display: flex; justify-content: space-between; }
  .cond { line-height: 1.45; }
</style>
<h1>${esc(CONTACT.name)}</h1>
<div class="role">${esc(v.title)}</div>
<div class="contact">${esc(CONTACT.line)}</div>
<p class="summary">${esc(v.summary)}</p>

${v.skills ? section('Technical Skills') + v.skills.map(([k, val]) => `<div class="sk"><b>${esc(k)}</b><span>${esc(val)}</span></div>`).join('') : ''}

${v.projects ? section('Selected Projects') + PROJECTS.map((p) => `<div class="pj">
  <div class="row"><span class="co">${esc(p.name)}</span><span class="lk">${esc(p.link)}</span></div>
  <div>${esc(p.text)}</div></div>`).join('') : ''}

${section('Experience')}
${v.order.map((k) => roleBlock(ROLES[k], v.key)).join('')}

${condensedBlock(v.condense)}

${section('Education')}
<article>
  <div class="row"><span class="co">${esc(EDUCATION.school)}</span></div>
  <div>${esc(EDUCATION.detail)}</div>
  ${v.projects ? '' : `<div>${esc(EDUCATION.note)}</div>`}
</article>`;
}

(async () => {
  require('fs').mkdirSync(OUT, { recursive: true });
  const browser = await puppeteer.launch({ headless: 'new', args: ['--no-sandbox'] });
  for (const v of VARIANTS) {
    const page = await browser.newPage();
    await page.setContent(html(v), { waitUntil: 'load' });
    await page.pdf({ path: path.join(OUT, v.file), format: 'Letter', printBackground: true,
      margin: { top: '0.5in', bottom: '0.5in', left: '0.55in', right: '0.55in' } });
    const h = await page.evaluate(() => document.body.scrollHeight);
    console.log(v.file.padEnd(34), 'body height', h, 'px');
    await page.setViewport({width:816,height:1056,deviceScaleFactor:2});
    await page.screenshot({path:'C:/Users/LeoArkos/AppData/Local/Temp/claude/C--Users-LeoArkos-johngeddes-org/4545876c-2e21-4a1a-a610-795f4e0f8ffa/scratchpad/resumes/'+v.file.replace('.pdf','.png'), fullPage:true});
    await page.close();
  }
  await browser.close();
})();
