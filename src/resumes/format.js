// Date helpers shared by the resume files, the Recruiters page and the About
// timeline. Dates are stored as 'YYYY-MM' strings; null means the job is current.
// Ranges use the word "to" because the site's copy rules allow no dashes.

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

const YM_RE = /^\d{4}-(0[1-9]|1[0-2])$/;

function checkYm(ym) {
  if (typeof ym !== 'string' || !YM_RE.test(ym)) {
    throw new Error(`Bad date ${JSON.stringify(ym)}: expected "YYYY-MM"`);
  }
}

export function monthYear(ym) {
  if (ym === null) return 'Present';
  checkYm(ym);
  const [year, month] = ym.split('-').map(Number);
  return `${MONTHS[month - 1]} ${year}`;
}

export function dateRange(start, end) {
  return `${monthYear(start)} to ${monthYear(end)}`;
}

// "24", "21-23", or "25~" for a current job, as the About page boxes show them.
export function shortYears(start, end) {
  checkYm(start);
  if (end !== null) checkYm(end);
  const from = start.slice(2, 4);
  if (!end) return `${from}~`;
  const to = end.slice(2, 4);
  return from === to ? from : `${from}-${to}`;
}
