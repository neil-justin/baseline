/**
 * Resume document intake (round 6a brief) — content-sniffed PDF/DOCX text
 * extraction + the locked rejection matrix. Server-only (route handlers).
 *
 * Locked decisions honored here:
 *  - PDF + DOCX, ONE file at a time, ≤5 MB — enforced BEFORE any parse.
 *  - Parse content, not extensions (a .docx-named PDF parses as a PDF; an
 *    extension mismatch is reported, never trusted).
 *  - NO OCR: an image-only/scanned PDF is REJECTED with re-export guidance.
 *
 * Parsers (verified per the repo dependency rule 2026-10-29):
 *  - unpdf 2.0.0 (latest stable; 0 deps; pure-JS PDF.js build) — text +
 *    per-page inspection (image coverage powers the scanned-PDF reject).
 *  - mammoth 1.13.0 (latest stable; pure JS) — DOCX → raw text.
 */

import { getDocumentProxy, extractText, inspectPages } from "unpdf";
import mammoth from "mammoth";

export const MAX_BYTES = 5 * 1024 * 1024; // ≤5 MB cap (locked)

export type ResumeKind = "pdf" | "docx";

export type RejectionCode =
  | "multi_file" // more than one file in a single upload
  | "oversize" // > 5 MB
  | "empty" // 0 bytes or no extractable content
  | "encrypted" // password-protected/encrypted document
  | "scanned" // image-only PDF — NO OCR, re-export guidance instead
  | "not_resume" // parsed fine, but doesn't read as a resume (+ what's missing)
  | "wrong_type" // content is neither PDF nor DOCX
  | "parse_error"; // parser threw for another reason

export interface ParsedResume {
  ok: true;
  kind: ResumeKind;
  /** normalized (\n-separated) document text */
  text: string;
  /** lowercased text, once, for matchers */
  lower: string;
  /** authoritative for PDF; DOCX carries no page count (null → length estimate) */
  pages: number | null;
  /** per-page text length (index 0 = page 1); null for DOCX */
  pageTextLengths: number[] | null;
  /** declared extension disagrees with sniffed content — accepted anyway (content rules) */
  extMismatch: boolean;
  bytes: number;
}

export interface RejectedResume {
  ok: false;
  code: RejectionCode;
  /** user-facing one-liner */
  detail: string;
  /** missing-things inventory for `not_resume` ("this doesn't read as a resume") */
  missing?: string[];
}

export type IntakeResult = ParsedResume | RejectedResume;

/* ── sniffing (content, never extension) ─────────────────────────────────── */

function sniff(bytes: Buffer): ResumeKind | null {
  if (bytes.length < 8) return null;
  // PDF: "%PDF-" may legally sit a little way into the header — scan 1 KiB.
  const head = bytes.subarray(0, Math.min(1024, bytes.length)).toString("latin1");
  if (head.includes("%PDF-")) return "pdf";
  // DOCX: a ZIP container whose central structure mentions word/document.xml.
  const isZip = bytes[0] === 0x50 && bytes[1] === 0x4b;
  if (isZip && bytes.toString("latin1").includes("word/document.xml")) return "docx";
  return null;
}

/* ── helpers ─────────────────────────────────────────────────────────────── */

const normalize = (s: string) =>
  s
    .replace(/\r\n?/g, "\n")
    // a parser's single line break inside wrapped paragraphs isn't structure;
    // inside a section it is. Keep one blank line max, keep single breaks.
    .replace(/\n{3,}/g, "\n\n")
    .trim();

function reject(code: RejectionCode, detail: string, missing?: string[]): RejectedResume {
  return { ok: false, code, detail, missing };
}

const isPasswordError = (e: unknown): boolean => {
  const m = e as { name?: string; message?: string };
  return /password|encrypt/i.test(m?.name ?? "") || /password|encrypt/i.test(m?.message ?? "");
};

/* ── the one intake call a route makes ───────────────────────────────────── */

export interface IntakeFile {
  bytes: Buffer;
  /** declared filename — used for the extension-mismatch note only */
  fileName: string;
  /** how many files arrived with this upload (locked: exactly one) */
  fileCount: number;
}

export async function intakeResumeFile(file: IntakeFile): Promise<IntakeResult> {
  // locked matrix, enforcement-ordered (cheapest/most type-honest first)
  if (file.fileCount > 1) {
    return reject("multi_file", "One file at a time — upload the resume as a single PDF or DOCX.");
  }
  if (file.bytes.length === 0) {
    return reject("empty", "The file arrived completely empty — there is nothing on it to read.");
  }
  if (file.bytes.length > MAX_BYTES) {
    return reject(
      "oversize",
      "Over the 5 MB limit — exports with embedded photos or graphics easily grow past it. " +
        "Remove images and export the resume again."
    );
  }

  const kind = sniff(file.bytes);
  if (!kind) {
    return reject(
      "wrong_type",
      "This file's content is neither a PDF nor a Word document — the extension alone isn't trusted."
    );
  }
  const declaredExt = (file.fileName.split(".").pop() ?? "").toLowerCase();
  const extMismatch = declaredExt.length > 0 && declaredExt !== kind;

  try {
    if (kind === "pdf") {
      const proxy = await getDocumentProxy(new Uint8Array(file.bytes), {
        maxImageSize: 16_777_216, // defensive limit — unpdf's documented guard
      });
      const pages = await inspectPages(proxy);
      const pageTextLengths = pages.pages.map((p) => p.textLength);
      const totalText = pageTextLengths.reduce((a, b) => a + b, 0);
      const extracted = await extractText(proxy, { mergePages: true });
      const text = normalize(extracted.text);
      const imageHeavy = pages.pages.some((p) => p.imageCoverage > 0.5);

      // Scanned / image-only → REJECT with re-export guidance. No OCR, ever.
      if (text.length < 120 && imageHeavy) {
        return reject(
          "scanned",
          "This PDF carries essentially no readable text — it reads as a scan or an image-only export. " +
            "Re-export a text-based PDF from Word or Google Docs (File → Export → PDF); the resume you " +
            "typed has to be real text, not a picture of it."
        );
      }
      if (text.length < 20) {
        return reject("empty", "Almost no text came out of this PDF — its pages are effectively blank.", [
          "text content",
        ]);
      }
      return {
        ok: true,
        kind: "pdf",
        text,
        lower: text.toLowerCase(),
        pages: pages.totalPages,
        pageTextLengths,
        extMismatch,
        bytes: file.bytes.length,
      };
    }

    // DOCX
    const { value } = await mammoth.extractRawText({ buffer: file.bytes });
    const text = normalize(value ?? "");
    if (text.length < 20) {
      return reject("empty", "Almost no text came out of this document — its body is effectively blank.", [
        "text content",
      ]);
    }
    return {
      ok: true,
      kind: "docx",
      text,
      lower: text.toLowerCase(),
      pages: null,
      pageTextLengths: null,
      extMismatch,
      bytes: file.bytes.length,
    };
  } catch (e) {
    if (isPasswordError(e)) {
      return reject(
        "encrypted",
        "This file is password-protected or encrypted — save an unlocked copy as a PDF or DOCX and upload that."
      );
    }
    return reject("parse_error", "This file's structure couldn't be read — try exporting the resume again.", [
      "readable document structure",
    ]);
  }
}

/* ── "doesn't read as a resume" gate (locked matrix item) ────────────────── */

/**
 * Parsed fine, but the text carries none of a resume's structural signals.
 * Rejects WITH the what's-missing inventory (the locked brief asks for the
 * reason plus what's missing). Signal floors deliberately low — a real junior
 * resume that only says "Education" and "Skills" is still a resume; a recipe
 * or an essay is not.
 */
export function isProbablyResume(p: ParsedResume): RejectedResume | null {
  const missing: string[] = [];
  if (!/@|[0-9]{7}/.test(p.text)) missing.push("any contact detail (email or phone)");
  if (
    !/\b(education|skills|experience|internship|ojt|projects?|certification|volunteer|objective|summary|qualifications)\b/.test(
      p.lower
    )
  ) {
    missing.push("any section heading (Education, Experience, Skills…)");
  }
  if (p.text.split("\n").filter((l) => l.trim().length > 8).length < 4) {
    missing.push("enough distinct lines to carry sections");
  }
  if (missing.length >= 2) {
    return reject(
      "not_resume",
      "This doesn't read as a resume" + (missing.length ? ` — it's missing ${missing.join(" and ")}` : "") + ".",
      missing
    );
  }
  return null;
}
