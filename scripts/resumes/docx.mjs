// Model to a Word document built from plain paragraphs: no tables, text boxes,
// headers or footers, so Workday and other parsers read it in order. Sizes are
// half-points (20 = 10pt); distances are twips (1440 = 1 inch).
import {
  AlignmentType, BorderStyle, Document, LevelFormat, Packer, Paragraph, Tab, TabStopType, TextRun,
} from 'docx';

const PAGE_W = 12240;
const MARGIN_X = 864; // 0.6in
const MARGIN_Y = 792; // 0.55in
const RIGHT = PAGE_W - 2 * MARGIN_X;
const GREY = '333333';

const heading = (text) => new Paragraph({
  spacing: { before: 160, after: 80 },
  border: { bottom: { style: BorderStyle.SINGLE, size: 6, color: '888888', space: 1 } },
  children: [new TextRun({ text, bold: true, allCaps: true, size: 21 })],
});

const rightTab = { tabStops: [{ type: TabStopType.RIGHT, position: RIGHT }] };

function jobParagraphs(j) {
  if (!j.bullets.length) {
    return [new Paragraph({
      ...rightTab,
      spacing: { before: 60 },
      children: [
        new TextRun({ text: j.title, bold: true }),
        new TextRun({ text: ` · ${j.line}`, color: GREY }),
        new TextRun({ children: [new Tab(), j.dates], color: GREY, size: 19 }),
      ],
    })];
  }
  return [
    new Paragraph({ spacing: { before: 60 }, keepNext: true, children: [new TextRun({ text: j.title, bold: true, size: 21 })] }),
    new Paragraph({
      ...rightTab,
      keepNext: j.bullets.length > 0,
      children: [new TextRun({ text: j.line, color: GREY }), new TextRun({ children: [new Tab(), j.dates], color: GREY, size: 19 })],
    }),
    ...j.bullets.map((b) => new Paragraph({
      numbering: { reference: 'bullets', level: 0 },
      spacing: { after: 20 },
      children: [new TextRun(b)],
    })),
  ];
}

export function resumeDocx(m) {
  const children = [
    new Paragraph({ children: [new TextRun({ text: m.name, bold: true, size: 40 })] }),
    new Paragraph({ children: [new TextRun({ text: m.headline, size: 23, color: GREY })] }),
    new Paragraph({ spacing: { after: 60 }, children: [new TextRun({ text: m.contact, size: 18, color: GREY })] }),
    heading('Summary'),
    new Paragraph({ children: [new TextRun(m.summary)] }),
    heading('Skills'),
    ...m.skills.map((s) => new Paragraph({
      spacing: { after: 20 },
      children: [new TextRun({ text: `${s.group}: `, bold: true }), new TextRun(s.items)],
    })),
    heading('Work Experience'),
    ...[...m.jobs, ...m.shortJobs].flatMap(jobParagraphs),
  ];
  if (m.projects.length) {
    children.push(heading('Projects'));
    m.projects.forEach((p) => {
      children.push(
        new Paragraph({
          ...rightTab,
          spacing: { before: 60 },
          keepNext: true,
          children: [new TextRun({ text: p.name, bold: true, size: 21 }), new TextRun({ children: [new Tab(), p.link], color: GREY, size: 19 })],
        }),
        new Paragraph({ children: [new TextRun(p.text)] }),
      );
    });
  }
  const e = m.education;
  children.push(
    heading('Education'),
    new Paragraph({
      ...rightTab,
      children: [new TextRun({ text: e.school, bold: true, size: 21 }), new TextRun({ children: [new Tab(), e.dates], color: GREY, size: 19 })],
    }),
    new Paragraph({ children: [new TextRun(e.degree)] }),
  );
  if (e.note) children.push(new Paragraph({ children: [new TextRun(e.note)] }));

  return new Document({
    creator: m.name,
    title: `${m.name} Resume · ${m.headline}`,
    styles: { default: { document: { run: { font: 'Georgia', size: 20 } } } },
    numbering: {
      config: [{
        reference: 'bullets',
        levels: [{
          level: 0,
          format: LevelFormat.BULLET,
          text: '\u2022',
          alignment: AlignmentType.LEFT,
          style: { paragraph: { indent: { left: 300, hanging: 200 } } },
        }],
      }],
    },
    sections: [{
      properties: {
        page: {
          size: { width: PAGE_W, height: 15840 },
          margin: { top: MARGIN_Y, bottom: MARGIN_Y, left: MARGIN_X, right: MARGIN_X },
        },
      },
      children,
    }],
  });
}

export function resumeDocxBuffer(m) {
  return Packer.toBuffer(resumeDocx(m));
}
