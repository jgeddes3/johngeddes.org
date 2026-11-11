// Copy checks run before any file is rendered. They encode John's standing
// rules: no dashes, no arrows, none of the stock phrases that mark text as
// generated, and bullets that do not all share one rhythm.

const BANNED = [
  'spearhead\\w*', 'leverag\\w*', 'utiliz\\w*', 'seamless\\w*', 'robust', 'cutting-edge',
  'innovative', 'dynamic', 'synergy', 'passionate', 'results-driven', 'proven track record',
  'comprehensive', 'facilitat\\w*', 'holistic', 'empower\\w*', 'elevat\\w*', 'unlock\\w*',
  'delve\\w*', 'showcas\\w*', 'testament', 'pivotal', 'orchestrat\\w*', 'high-touch',
  'best-in-class', 'world-class', 'end-to-end', 'not just', 'not only', 'whether you',
  'streamlin\\w*', 'game-changer', 'next-level', 'journey', 'landscape', 'ensur\\w*',
  'foster\\w*', 'tapestry', 'meticulous\\w*', 'adept', 'thrive\\w*', 'spirit of',
];
const BANNED_RE = new RegExp(`\\b(${BANNED.join('|')})\\b`, 'i');
const DASH_RE = /[\u2013\u2014]/;
const ARROW_RE = /[\u2190-\u21FF\u27F0-\u27FF]/;

export function lintText(text, where) {
  const problems = [];
  if (DASH_RE.test(text)) problems.push(`${where}: contains an em or en dash`);
  if (ARROW_RE.test(text)) problems.push(`${where}: contains an arrow`);
  const banned = text.match(BANNED_RE);
  if (banned) problems.push(`${where}: banned phrase "${banned[0]}"`);
  return problems;
}

const words = (s) => s.trim().split(/\s+/).filter(Boolean);

export function lintBullets(bullets, where) {
  const problems = [];
  const counts = new Map();
  const lengths = [];
  bullets.forEach((b, i) => {
    problems.push(...lintText(b, `${where} bullet ${i + 1}`));
    const n = words(b).length;
    lengths.push(n);
    if (n < 8 || n > 32) problems.push(`${where} bullet ${i + 1}: ${n} words (allowed 8 to 32)`);
    const first = words(b)[0].toLowerCase().replace(/[^a-z]/g, '');
    counts.set(first, (counts.get(first) || 0) + 1);
  });
  for (const [verb, n] of counts) {
    if (n > 2) problems.push(`${where}: "${verb}" opens ${n} bullets (max 2)`);
  }
  if (lengths.length >= 4 && Math.max(...lengths) - Math.min(...lengths) < 5) {
    problems.push(`${where}: every bullet is nearly the same length (${Math.min(...lengths)} to ${Math.max(...lengths)} words)`);
  }
  return problems;
}

// Every string a resume prints, checked as one document.
export function lintModel(m) {
  const where = m.key;
  const problems = [];
  problems.push(...lintText(m.headline, `${where} headline`));
  problems.push(...lintText(m.summary, `${where} summary`));
  m.skills.forEach((s) => problems.push(...lintText(`${s.group}: ${s.items}`, `${where} skills`)));
  m.projects.forEach((p) => problems.push(...lintText(p.text, `${where} project ${p.name}`)));
  problems.push(...lintBullets(m.jobs.flatMap((j) => j.bullets), where));
  return problems;
}
