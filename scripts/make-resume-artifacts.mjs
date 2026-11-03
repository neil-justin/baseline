#!/usr/bin/env node
/**
 * Deterministic resume-artifact generator (round 6a) — builds, with NO runtime
 * dependencies, every file the Resume Diagnostic needs to be real:
 *
 *   public/resume-reference.pdf / .docx
 *       the downloadable reference template (format guide on-ramp)
 *   scripts/fixtures/resume-good.pdf / .docx
 *       synthetic small resumes — the vitest upload fixture artifacts (real files)
 *   scripts/fixtures/resume-irrelevant.pdf
 *       parses fine, doesn't read as a resume (rejection: not_resume)
 *   scripts/fixtures/resume-empty.pdf
 *       a page with nothing on it (rejection: empty)
 *   scripts/fixtures/resume-scanned.pdf
 *       image-only page — NO OCR path (rejection: scanned)
 *   scripts/fixtures/resume-mismatch.pdf
 *       DOCX bytes carrying a .pdf name (re-accepted by CONTENT sniffing)
 *   scripts/fixtures/resume-oversize.pdf
 *       valid PDF > 5 MB (rejection: oversize — enforced before parse)
 *
 * The PDFs are hand-built (catalog/pages/font/text objects); the DOCXes are
 * minimal OOXML ZIPs (stored entries + CRC32). Text in all of them is real
 * text — the scanned one is deliberately NOT (it's the no-OCR test).
 *
 * Run: node scripts/make-resume-artifacts.mjs
 */
import { mkdirSync, writeFileSync } from "node:fs";
import path from "node:path";

const ROOT = path.resolve(new URL("..", import.meta.url).pathname);

/* ── PDF writer (uncompressed streams; Helvetica core font) ─────────────── */

const pdfEscape = (s) => s.replace(/\\/g, "\\\\").replace(/\(/g, "\\(").replace(/\)/g, "\\)");

/** lines → one-page content stream (BT…ET) */
function textContentStream(lines, opts = {}) {
  const size = opts.size ?? 10.5;
  const leading = opts.leading ?? size * 1.42;
  const top = opts.top ?? 750;
  const left = 54;
  const out = [`BT`, `/F1 ${size} Tf`, `${left} ${top} Td`, `${Math.round(leading * 100) / 100} TL`];
  for (const line of lines) {
    if (line === "") out.push("T* T*");
    else out.push(`(${pdfEscape(line)}) Tj T*`);
  }
  out.push("ET");
  return out.join("\n");
}

/** PDF object list → bytes, with a correct xref table. objs[i] = object i+1. */
function buildPdf(objs) {
  const header = Buffer.from("%PDF-1.6\n%\xE2\xE3\xCF\xD3\n", "latin1");
  const parts = [header];
  let pos = header.length;
  const offsets = [0];
  for (let i = 1; i <= objs.length; i++) {
    const body = typeof objs[i - 1] === "string" ? Buffer.from(objs[i - 1], "latin1") : objs[i - 1];
    const head = Buffer.from(`${i} 0 obj\n`, "latin1");
    const tail = Buffer.from("\nendobj\n", "latin1");
    offsets.push(pos);
    parts.push(head, body, tail);
    pos += head.length + body.length + tail.length;
  }
  const xrefStart = pos;
  let xref = `xref\n0 ${objs.length + 1}\n0000000000 65535 f \n`;
  for (let i = 1; i <= objs.length; i++) xref += `${String(offsets[i]).padStart(10, "0")} 00000 n \n`;
  const trailer = `trailer\n<< /Size ${objs.length + 1} /Root 1 0 R /Info 2 0 R >>\nstartxref\n${xrefStart}\n%%EOF\n`;
  parts.push(Buffer.from(xref + trailer, "latin1"));
  return Buffer.concat(parts);
}

function makePdf({ lines, pages = null, imageOnly = false, pad = 0, maxLine = 84 }) {
  // wrap long lines so every stream stays within a printable width
  const wrap = (l) => {
    if (l.length <= maxLine) return [l];
    const out = [];
    for (let i = 0; i < l.length; i += maxLine) out.push(l.slice(i, i + maxLine));
    return out;
  };
  const pageLines = (lines ?? []).flatMap(wrap);
  if (imageOnly) {
    // one page with a stretched raster image, zero text (the no-OCR case)
    const w = 8, h = 8;
    const pixels = Buffer.alloc(w * h * 3);
    for (let i = 0; i < pixels.length; i += 3) {
      pixels[i] = 0xf3; pixels[i + 1] = 0xf4; pixels[i + 2] = 0xf2; // paper-ish
    }
    const objs = [];
    objs[0] = `<< /Type /Catalog /Pages 3 0 R >>`;
    objs[1] = `<< /Title (resume) /Producer (fixture) >>`;
    objs[2] = `<< /Type /Pages /Kids [4 0 R] /Count 1 >>`;
    objs[3] = `<< /Type /Page /Parent 3 0 R /MediaBox [0 0 595 842] /Resources << /XObject << /Im0 5 0 R >> >> /Contents 6 0 R >>`;
    objs[4] = Buffer.concat([
      Buffer.from(`<< /Type /XObject /Subtype /Image /Width ${w} /Height ${h} /ColorSpace /DeviceRGB /BitsPerComponent 8 /Length ${pixels.length} >>\nstream\n`, "latin1"),
      pixels,
      Buffer.from("\nendstream", "latin1"),
    ]);
    const stream = `q\n595 0 0 842 0 0 cm\n/Im0 Do\nQ`;
    objs[5] = `<< /Length ${stream.length} >>\nstream\n${stream}\nendstream`;
    let pdf = buildPdf(objs);
    if (pad > 0) pdf = Buffer.concat([pdf, Buffer.from(`%${"p".repeat(pad)}\n`, "latin1")]);
    return pdf;
  }
  if (pages) {
    // multi-page: chunk the lines
    const chunks = [];
    for (let i = 0; i < pageLines.length; i += pages.perPage) chunks.push(pageLines.slice(i, i + pages.perPage));
    const nPages = chunks.length;
    const objs = [];
    objs[0] = `<< /Type /Catalog /Pages 3 0 R >>`;
    objs[1] = `<< /Title (resume) /Producer (fixture) >>`;
    const kids = chunks.map((_, i) => `${4 + i * 2} 0 R`).join(" ");
    objs[2] = `<< /Type /Pages /Kids [${kids}] /Count ${nPages} >>`;
    const fontObjId = 4 + chunks.length * 2;
    chunks.forEach((chunk, pi) => {
      objs[3 + pi * 2] = `<< /Type /Page /Parent 3 0 R /MediaBox [0 0 595 842] /Resources << /Font << /F1 ${fontObjId} 0 R >> >> /Contents ${
        4 + pi * 2 + 1
      } 0 R >>`;
      const s = chunk.length ? textContentStream(chunk, pages.opts) : "BT ET";
      objs[4 + pi * 2] = `<< /Length ${s.length} >>\nstream\n${s}\nendstream`;
    });
    objs[3 + chunks.length * 2] = `<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>`;
    let pdf = buildPdf(objs);
    if (pad > 0) pdf = Buffer.concat([pdf, Buffer.from(`%${"p".repeat(pad)}\n`, "latin1")]);
    return pdf;
  }
  // single page
  const objs = [];
  objs[0] = `<< /Type /Catalog /Pages 3 0 R >>`;
  objs[1] = `<< /Title (resume) /Producer (fixture) >>`;
  objs[2] = `<< /Type /Pages /Kids [4 0 R] /Count 1 >>`;
  objs[3] = `<< /Type /Page /Parent 3 0 R /MediaBox [0 0 595 842] /Resources << /Font << /F1 6 0 R >> >> /Contents 5 0 R >>`;
  const stream = pageLines.length ? textContentStream(pageLines, {}) : "BT ET";
  objs[4] = `<< /Length ${stream.length} >>\nstream\n${stream}\nendstream`;
  objs[5] = `<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>`;
  let pdf = buildPdf(objs);
  if (pad > 0) pdf = Buffer.concat([pdf, Buffer.from(`%${"p".repeat(pad)}\n`, "latin1")]);
  return pdf;
}

/* ── DOCX writer (minimal OOXML, stored zip entries) ────────────────────── */

const CRC32_TABLE = (() => {
  const t = new Int32Array(256);
  for (let n = 0; n < 256; n++) {
    let c = n;
    for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
    t[n] = c;
  }
  return t;
})();

function crc32(buf) {
  let c = 0xffffffff;
  for (let i = 0; i < buf.length; i++) c = CRC32_TABLE[(c ^ buf[i]) & 0xff] ^ (c >>> 8);
  return (c ^ 0xffffffff) >>> 0;
}

function makeZip(entries) {
  // entries: {name, data:Buffer} — stored (no compression)
  const localChunks = [];
  const central = [];
  let offset = 0;
  for (const { name, data } of entries) {
    const nameBuf = Buffer.from(name, "latin1");
    const crc = crc32(data);
    const local = Buffer.alloc(30);
    local.writeUInt32LE(0x04034b50, 0);
    local.writeUInt16LE(20, 4); // version needed
    local.writeUInt16LE(0, 6); // flags
    local.writeUInt16LE(0, 8); // method: stored
    local.writeUInt16LE(0, 10); // mod time
    local.writeUInt16LE(0, 12); // mod date
    local.writeUInt32LE(crc, 14);
    local.writeUInt32LE(data.length, 18);
    local.writeUInt32LE(data.length, 22);
    local.writeUInt16LE(nameBuf.length, 26);
    local.writeUInt16LE(0, 28);
    localChunks.push(local, nameBuf, data);
    central.push({ nameBuf, data, crc, offset });
    offset += 30 + nameBuf.length + data.length;
  }
  const centralChunks = [];
  let centralSize = 0;
  for (const c of central) {
    const e = Buffer.alloc(46);
    e.writeUInt32LE(0x02014b50, 0);
    e.writeUInt16LE(20, 4); // version made by
    e.writeUInt16LE(20, 6); // version needed
    e.writeUInt16LE(0, 8); // flags
    e.writeUInt16LE(0, 10); // method
    e.writeUInt16LE(0, 12); // mod time
    e.writeUInt16LE(0, 14); // mod date
    e.writeUInt32LE(c.crc, 16);
    e.writeUInt32LE(c.data.length, 20);
    e.writeUInt32LE(c.data.length, 24);
    e.writeUInt16LE(c.nameBuf.length, 28);
    e.writeUInt16LE(0, 30); // extra len
    e.writeUInt16LE(0, 32); // comment len
    e.writeUInt16LE(0, 34); // disk start
    e.writeUInt16LE(0, 36); // internal attrs
    e.writeUInt32LE(0, 38); // external attrs
    e.writeUInt32LE(c.offset, 42);
    centralChunks.push(e, c.nameBuf);
    centralSize += 46 + c.nameBuf.length;
  }
  const end = Buffer.alloc(22);
  end.writeUInt32LE(0x06054b50, 0);
  end.writeUInt16LE(0, 4); // this disk
  end.writeUInt16LE(0, 6); // cd disk
  end.writeUInt16LE(central.length, 8);
  end.writeUInt16LE(central.length, 10);
  end.writeUInt32LE(centralSize, 12);
  end.writeUInt32LE(offset, 16); // offset of central directory
  end.writeUInt16LE(0, 20); // comment len
  return Buffer.concat([...localChunks, ...centralChunks, end]);
}

function esc(s) {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

function makeDocx(lines) {
  const body = lines
    .map((l) =>
      l === ""
        ? `<w:p/>`
        : `<w:p><w:r><w:t xml:space="preserve">${esc(l)}</w:t></w:r></w:p>`
    )
    .join("");
  const document = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<w:document xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main"><w:body>${body}<w:sectPr><w:pgSz w:w="11906" w:h="16838"/></w:sectPr></w:body></w:document>`;
  const types = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types"><Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/><Default Extension="xml" ContentType="application/xml"/><Override PartName="/word/document.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.document.main+xml"/></Types>`;
  const rels = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"><Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="word/document.xml"/></Relationships>`;
  return makeZip([
    { name: "[Content_Types].xml", data: Buffer.from(types) },
    { name: "_rels/.rels", data: Buffer.from(rels) },
    { name: "word/document.xml", data: Buffer.from(document) },
  ]);
}

/* ── the samples ────────────────────────────────────────────────────────── */

/** Reference template — deliberately generic placeholders (a reference, not a builder). */
const TEMPLATE_LINES = [
  "JUAN DELA CRUZ",
  "juandelacruz@email.com · 0917 000 0000 · Quezon City",
  "",
  "EDUCATION",
  "BS [Your Program] — [Your University] · Expected [Month] [Year]",
  "[Relevant coursework: two to four subjects, kept to one line]",
  "",
  "EXPERIENCE",
  "[Organization or Project] — [Your Role]                     [Start] - [End]",
  "- [Action verb] [what you did]: [count or result - one line]",
  "- [Action verb] [what you did]: [count or result - one line]",
  "",
  "[Organization or Project] — [Your Role]                     [Start] - [End]",
  "- [Action verb] [what you did]: [count or result - one line]",
  "",
  "SKILLS",
  "[Skill one] · [Skill two] · [Skill three] · [Skill four]",
  "",
  "Keep the whole resume on one page. Use standard section titles, plain",
  "single-column layout, no photos, and reverse-chronological order.",
];

/** A realistic entry-level resume for the Associate Software Developer role —
 *  real text, all five format checks pass, core-tier keywords present (named
 *  against the catalog round's verbatim PSF-SDS rows). */
const GOOD_LINES = [
  "Neil Mallari",
  "neil.mallari@campus.test · 0917 555 0101 · Quezon City",
  "",
  "EDUCATION",
  "BS Information Technology — AISAT College · Expected 2027",
  "Coursework: Software Engineering, Database Systems",
  "",
  "EXPERIENCE",
  "Capstone Prep Team — Student Developer   Jun 2026 - Oct 2026",
  "- Built application development work in Python and SQL used by 3 teammates",
  "- Handled application support and enhancement requests — fixed 12 reported bugs across 5 agile sprints",
  "Department IT Office — Student Aide   Jun 2025 - Mar 2026",
  "- Maintained 24 lab PCs (infrastructure support) and closed 40+ hardware tickets",
  "- Assisted network configuration for the lab LAN — 11 access points re-setup",
  "",
  "SKILLS",
  "Applications Development · Python · SQL · Secure-coding practices · Git",
];

/** The canon demo's Application Materials pass (ticket 12 recut): after the
 *  switch to Software QA Analyst, the money beat's resume diagnostic uploads
 *  the QA-targeted resume — same five format checks pass, and the role's four
 *  core-tier keyword rows all appear (bare names + the qa synonym seed). */
const GOOD_QA_LINES = [
  "Neil Mallari",
  "neil.mallari@campus.test · 0917 555 0101 · Quezon City",
  "",
  "EDUCATION",
  "BS Information Technology — AISAT College · Expected 2027",
  "Coursework: Software Quality Assurance, Database Systems",
  "",
  "EXPERIENCE",
  "Department IT Office — QA Student Aide   Jun 2025 - Mar 2026",
  "- Ran software testing cycles for the lab's 24-PC image — 3 regression suites each term",
  "- Drafted the department test plan and test data set for the enrollment system release",
  "- Kept defect tracking discipline on the bug board — logged 40+ tickets, verified 12 fixes",
  "Capstone Prep Team — Junior Tester   Jun 2026 - Oct 2026",
  "- Practiced quality assurance gates on the capstone build and read specs into testable conditions",
  "",
  "SKILLS",
  "Software Testing · Test Planning · Defect management · Quality Assurance / Quality Standards · Git",
];

/** Interpretation paragraphs — parses as text, reads as nothing like a resume. */
const IRRELEVANT_LINES = [
  "Chicken Adobo",
  "Serves 4. Marinate 1 kg chicken in soy sauce, vinegar, garlic, and",
  "whole peppercorns for 30 minutes. Simmer covered for 25 minutes, then",
  "uncover and reduce until the sauce thickens and turns glossy. Serve",
  "over hot rice. Best eaten the day after, when the flavor has settled.",
];

const makeOversize = () => {
  // valid 1-page PDF + a %comment pad pushing the file past the 5 MB cap —
  // enforced BEFORE parsing (locked order), so the pad never needs to parse.
  const pad = 5 * 1024 * 1024 + 200 * 1024;
  return makePdf({ lines: GOOD_LINES, pad });
};

/* ── write everything ───────────────────────────────────────────────────── */

mkdirSync(path.join(ROOT, "fixtures"), { recursive: true });
mkdirSync(path.join(ROOT, "public"), { recursive: true });

writeFileSync(path.join(ROOT, "public", "resume-reference.pdf"), makePdf({ lines: TEMPLATE_LINES }));
writeFileSync(path.join(ROOT, "public", "resume-reference.docx"), makeDocx(TEMPLATE_LINES));
writeFileSync(path.join(ROOT, "fixtures", "resume-good.pdf"), makePdf({ lines: GOOD_LINES }));
writeFileSync(path.join(ROOT, "fixtures", "resume-good.docx"), makeDocx(GOOD_LINES));
// the demo's QA-targeted application-materials pass (ticket 12 recut)
writeFileSync(path.join(ROOT, "fixtures", "resume-qa.pdf"), makePdf({ lines: GOOD_QA_LINES }));
writeFileSync(path.join(ROOT, "fixtures", "resume-irrelevant.pdf"), makePdf({ lines: IRRELEVANT_LINES }));
writeFileSync(path.join(ROOT, "fixtures", "resume-empty.pdf"), makePdf({ lines: [] }));
writeFileSync(path.join(ROOT, "fixtures", "resume-scanned.pdf"), makePdf({ imageOnly: true }));
// DOCX bytes under a .pdf name — the content sniff accepts it anyway
writeFileSync(path.join(ROOT, "fixtures", "resume-mismatch.pdf"), makeDocx(GOOD_LINES));
writeFileSync(path.join(ROOT, "fixtures", "resume-oversize.pdf"), makeOversize());

console.log("resume artifacts written: public/resume-reference.{pdf,docx} + 7 artifact fixtures");
