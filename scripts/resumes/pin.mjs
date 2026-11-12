// Fixed timestamps for the generated files. Chrome stamps each PDF with the
// time it was printed, and docx stamps the Word file and every zip entry the
// same way, so an unchanged resume would still show up as a changed file in
// git after every build. Both functions overwrite those stamps with one fixed
// instant and leave everything else alone.
import JSZip from 'jszip';

export const PINNED_ISO = '2026-01-01T00:00:00Z';
const PINNED_DATE = new Date(PINNED_ISO);
const PINNED_PDF = 'D:20260101000000';

// A same-length replace, so the byte offsets in the PDF's cross-reference
// table stay correct. latin1 maps every byte to one character and back.
export function pinPdf(buffer) {
  const raw = Buffer.from(buffer).toString('latin1');
  return Buffer.from(raw.replace(/\/(CreationDate|ModDate) \(D:\d{14}/g, `/$1 (${PINNED_PDF}`), 'latin1');
}

export async function pinDocx(buffer) {
  const zip = await JSZip.loadAsync(buffer);
  const core = zip.file('docProps/core.xml');
  if (!core) throw new Error('Not a Word document: docProps/core.xml is missing');
  const xml = await core.async('string');
  zip.file(
    'docProps/core.xml',
    xml.replace(/(<dcterms:(created|modified)\b[^>]*>)[^<]*(<\/dcterms:\2>)/g, `$1${PINNED_ISO}$3`),
  );
  Object.values(zip.files).forEach((entry) => { entry.date = PINNED_DATE; });
  return zip.generateAsync({ type: 'nodebuffer', compression: 'DEFLATE' });
}
