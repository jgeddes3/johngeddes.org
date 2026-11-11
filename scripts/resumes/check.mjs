// Reads the generated files back the way a parser would and compares them
// with the model: page count, and every expected line present in order.
import JSZip from 'jszip';
import { getDocument } from 'pdfjs-dist/legacy/build/pdf.mjs';
import { expectedLines } from '../../src/resumes/model.js';

export function normalize(s) {
  return String(s)
    .normalize('NFKC')
    .replace(/[\u2018\u2019]/g, "'")
    .replace(/[\u201C\u201D]/g, '"')
    .replace(/\s+/g, ' ')
    .trim();
}

// Whitespace is dropped on both sides: PDF text extraction splits and joins
// lines in its own way, and a missing space is not what this check is for.
const squeeze = (s) => normalize(s).replace(/\s+/g, '');

export function findInOrder(haystack, needles) {
  const h = squeeze(haystack);
  let pos = 0;
  for (const needle of needles) {
    const n = squeeze(needle);
    const at = h.indexOf(n, pos);
    if (at < 0) return { ok: false, missing: needle };
    pos = at + n.length;
  }
  return { ok: true };
}

export async function pdfText(buffer) {
  const doc = await getDocument({ data: new Uint8Array(buffer), isEvalSupported: false, useSystemFonts: false }).promise;
  let text = '';
  for (let i = 1; i <= doc.numPages; i += 1) {
    const page = await doc.getPage(i);
    const content = await page.getTextContent();
    text += content.items.map((it) => it.str + (it.hasEOL ? ' ' : '')).join('') + ' ';
  }
  const pages = doc.numPages;
  await doc.destroy();
  return { pages, text };
}

export async function docxText(buffer) {
  const zip = await JSZip.loadAsync(buffer);
  const xml = await zip.file('word/document.xml').async('string');
  return xml
    .replace(/<w:tab\/>/g, ' ')
    .replace(/<\/w:p>/g, ' ')
    .replace(/<[^>]+>/g, '')
    .replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"').replace(/&apos;/g, "'")
    .replace(/&amp;/g, '&');
}

export async function checkTrack(track, model, { pdf, docx }) {
  const problems = [];
  const lines = expectedLines(model);
  const p = await pdfText(pdf);
  if (p.pages !== track.pages) problems.push(`${track.file}.pdf: ${p.pages} pages, expected ${track.pages}`);
  const inPdf = findInOrder(p.text, lines);
  if (!inPdf.ok) problems.push(`${track.file}.pdf: missing or out of order: "${inPdf.missing}"`);
  const inDocx = findInOrder(await docxText(docx), lines);
  if (!inDocx.ok) problems.push(`${track.file}.docx: missing or out of order: "${inDocx.missing}"`);
  return problems;
}
