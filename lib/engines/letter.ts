/**
 * Cover-letter check engine (ticket 12 — the LETTER factor's 5 points;
 * surfaces live in app/(app)/prep, persistence in lib/db/letter-run-store).
 * Plain structure: the student brings their own letter (uploaded .txt/​.pdf/​.docx
 * — written outside this system, same as the resume's hard fence), the system
 * never authors one, and the check is DETERMINISTIC (no LLM, no OCR):
 *
 *   parse-pass        — the intake gate (a letter that never parsed is
 *                       feedback, not a run; nothing persists)
 *   structural set    — salutation · employer named (OPTIONAL field) ·
 *                       closing ask · 250–500 words
 *   keyword alignment — the declared Target Role's CORE-tier skills found in
 *                       the letter text (same matcher as the resume run,
 *                       lib/engines/resume/analyze.ts keywordMatch)
 *
 * THE HONESTY CONTRACT (user ruling 2026-10-29, ticket 12):
 *  - a check skipped honestly is rendered "not evaluated — no employer
 *    declared" (EMPLOYER_SKIP_NOTE, lib/engines/air.ts) — never silently
 *    failed and never silently scored; the denominator drops it.
 *  - the ROLE anchor is ALWAYS the declared Target Role, regardless of the
 *    employer field (the employer is an anchor, never the role).
 *  - suggestions are feedback moves on a tiered rule — never generated text,
 *    never an "ATS pass" claim.
 *  - LATEST COUNTS (ADR 0002 amendment 3 ruling): the store keeps ONE run per
 *    student — the most recent check; re-running replaces it.
 */

import type { AirLetter, AirLetterInput } from "@/lib/engines/air";
import { EMPLOYER_SKIP_NOTE, computeLetterCheck } from "@/lib/engines/air";
import type { Career } from "@/lib/types";
import { keywordMatch } from "@/lib/engines/resume/analyze";

export const LETTER_MAX_BYTES = 5 * 1024 * 1024; // ≤5 MB (parity with the resume cap)

export type LetterKind = "pdf" | "docx" | "txt";

export type LetterRejectionCode =
  | "multi_file" // more than one file in a single upload
  | "oversize" // > 5 MB
  | "empty" // arrived empty or effectively blank
  | "encrypted" // password-protected/encrypted document
  | "scanned" // image-only PDF — NO OCR; re-export as real text
  | "wrong_type" // content is neither PDF, DOCX, nor plain text
  | "parse_error"; // parser threw for another reason

export interface LetterRejected {
  ok: false;
  code: LetterRejectionCode;
  /** user-facing one-liner (names the letter, not the resume) */
  detail: string;
}

export interface LetterParsed {
  ok: true;
  kind: LetterKind;
  /** normalized (\n-separated) letter text */
  text: string;
}

export type LetterIntakeResult = LetterParsed | LetterRejected;

export interface LetterCheckRow {
  /** the check's own label (mono ledger row, like the resume factor) */
  label: string;
  /** true/false = evaluated · null = honestly skipped (rendered, never scored) */
  ok: boolean | null;
  note?: string;
}

export interface LetterSuggestion {
  /** the concrete content move (tiered rule) */
  move: string;
}

export interface LetterFinding {
  id: string;
  level: "pass" | "watch" | "fix";
  title: string;
  detail: string;
  suggestion?: LetterSuggestion;
}

export interface LetterCheckRun {
  /** stable id — history ordering */
  id: string;
  at: string; // ISO
  kind: LetterKind;
  fileName: string;
  careerId: string;
  careerName: string;
  /** the optional employer anchor: false when the field stayed empty */
  employerDeclared: boolean;
  employerName?: string;
  wordCount: number;
  /** the engine record arithmetic (feeds 5 of the 15 AR points) */
  air: AirLetter;
  /** the structural ledger — carries the honest skip row verbatim */
  checks: LetterCheckRow[];
  /** role-alignment ledger: the Target Role's core-tier skills vs this text */
  keywords: LetterCheckRow[];
  findings: LetterFinding[];
  /** honest provenance line for the UI */
  engine: "deterministic-templates";
}

/* ── intake (content-sniffed; the letter's own locked matrix) ────────────── */

const normalize = (s: string) =>
  s
    .replace(/\r\n?/g, "\n")
    .replace(/\u00A0/g, " ")
    .replace(/\n{3,}/g, "\n\n")
    .trim();

const sniffLetter = (bytes: Buffer): LetterKind | "binary" => {
  if (bytes.length < 8) return "binary";
  const head = bytes.subarray(0, Math.min(1024, bytes.length)).toString("latin1");
  if (head.includes("%PDF-")) return "pdf";
  const isZip = bytes[0] === 0x50 && bytes[1] === 0x4b;
  if (isZip && bytes.toString("latin1").includes("word/document.xml")) return "docx";
  // plain-text carrier: a mostly-printable byte run (≥98%) reads as a letter;
  // anything else (rtf/exe/zip) is refused — the extension alone isn't trusted
  let printable = 0;
  for (const b of bytes) {
    if ((b >= 0x20 && b < 0x7f) || b === 0x09 || b === 0x0a || b === 0x0d || b >= 0x80) printable++;
    else if (b === 0x0b || b === 0x0c) printable++; // form feeds in exported text
  }
  return printable / bytes.length >= 0.98 ? "txt" : "binary";
};

const reject = (code: LetterRejectionCode, detail: string): LetterRejected => ({ ok: false, code, detail });

export interface LetterIntakeFile {
  bytes: Buffer;
  fileName: string;
  fileCount: number;
}

/**
 * One intake call: locked matrix (ONE file · ≤5 MB · content decides),
 * then the letter's parsers (unpdf / mammoth — same libraries as the resume
 * intake, round-6a parity), then "reads as a letter" sanity floor.
 * A rejected upload persists NOTHING — feedback, not a run.
 */
export async function intakeLetterFile(file: LetterIntakeFile): Promise<LetterIntakeResult> {
  if (file.fileCount > 1) {
    return reject("multi_file", "One file at a time — upload the cover letter as a single PDF, DOCX, or TXT.");
  }
  if (file.bytes.length === 0) {
    return reject("empty", "The file arrived completely empty — there is nothing on it to read.");
  }
  if (file.bytes.length > LETTER_MAX_BYTES) {
    return reject(
      "oversize",
      "Over the 5 MB limit — a plain, text-only letter export stays well under it. Remove images from the file and export the letter again."
    );
  }

  const kind = sniffLetter(file.bytes);
  if (kind === "binary") {
    return reject(
      "wrong_type",
      "This file's content is not readable text (or a PDF/Word carrier of one) — the extension alone isn't trusted. Export the letter as TXT, PDF, or DOCX with real text inside."
    );
  }

  try {
    if (kind === "pdf") {
      const { extractText, getDocumentProxy, inspectPages } = await import("unpdf");
      const proxy = await getDocumentProxy(new Uint8Array(file.bytes), { maxImageSize: 16_777_216 });
      const pages = await inspectPages(proxy);
      const merged = await extractText(proxy, { mergePages: true });
      const text = normalize(merged.text);
      const imageHeavy = pages.pages.some((p) => p.imageCoverage > 0.5);
      if (text.length < 25 && imageHeavy) {
        return reject(
          "scanned",
          "This PDF carries essentially no readable text — it reads as a scan or an image-only export. No OCR runs here: re-export the letter as a text-based PDF (or paste it into a .txt/.docx) so every word is real text."
        );
      }
      if (text.length < 25) {
        return reject("empty", "Almost no text came out of this PDF — its pages are effectively blank. Export the letter with real text inside.");
      }
      return { ok: true, kind: "pdf", text };
    }

    if (kind === "docx") {
      const mammoth = (await import("mammoth")).default;
      const { value } = await mammoth.extractRawText({ buffer: file.bytes });
      const text = normalize(value ?? "");
      if (text.length < 25) {
        return reject("empty", "Almost no text came out of this document — its body is effectively blank. Export the letter with real text inside.");
      }
      return { ok: true, kind: "docx", text };
    }

    // txt: strip a UTF-8 BOM if the exporter left one
    let text = file.bytes.toString("utf8");
    if (text.charCodeAt(0) === 0xfeff) text = text.slice(1);
    text = normalize(text);
    if (text.length < 25) {
      return reject("empty", "The file carries almost no text — a letter needs its body. Save the letter as real text and try again.");
    }
    return { ok: true, kind: "txt", text };
  } catch (e) {
    const m = e as { name?: string; message?: string };
    if (/password|encrypt/i.test(m?.name ?? "") || /password|encrypt/i.test(m?.message ?? "")) {
      return reject("encrypted", "This file is password-protected or encrypted — save an unlocked copy as a PDF, DOCX, or TXT and upload that.");
    }
    return reject("parse_error", "This file's structure couldn't be read — try exporting the letter again.");
  }
}

/* ── the deterministic structural set ───────────────────────────────────── */

/** salutation: the letter's opening addresses a reader (head of the text only) */
const SALUTATION_RE =
  /^(dear\b[^,\n]{0,60},|to whom it may concern\b[:,.]?|(?:hello|greetings|good (?:morning|day|afternoon|evening))\b[^,\n]{0,50},)/i;

/** closing ask: the closing asks for the next step (tail of the text only) */
const CLOSING_ASK_RE =
  /\b(look(?:s|ing)?\s?forward|hear(?:ing)? from you|further discuss|interview|consider(?:ed|ing)? (?:my|me for)|welcome the (?:chance|opportunity)|opportunity to|at your convenience|kind regards,?\s*\n|appreciate(?:s)? (?:the|your)|grateful if|hop(?:e|ing) to)/i;

export interface LetterStructural {
  salutation: boolean;
  closingAsk: boolean;
  /** 250–500 words (the locked band, inclusive) */
  wordBand: boolean;
  wordCount: number;
}

export const LETTER_WORD_MIN = 250;
export const LETTER_WORD_MAX = 500;

function detectStructural(text: string): LetterStructural {
  const head = text.slice(0, 400);
  const words = text.split(/\s+/).filter(Boolean);
  const wordCount = words.length;
  const tailStart = Math.floor(text.length * 0.55);
  const tail = text.slice(tailStart);
  return {
    salutation: SALUTATION_RE.test(head.trim()),
    closingAsk: CLOSING_ASK_RE.test(tail) || CLOSING_ASK_RE.test(head),
    wordBand: wordCount >= LETTER_WORD_MIN && wordCount <= LETTER_WORD_MAX,
    wordCount,
  };
}

/* ── the run (one call per successful parse) ─────────────────────────────── */

export interface LetterRunContext {
  career: Career;
  /** the normalized letter text from intake */
  text: string;
  kind: LetterKind;
  fileName: string;
  /** the OPTIONAL employer anchor — empty/undefined = honestly skipped */
  employerField?: string | null;
  at?: string;
}

export function runLetterCheck(ctx: LetterRunContext): LetterCheckRun {
  const { career, text } = ctx;
  const lower = text.toLowerCase();
  const structural = detectStructural(text);

  const declared = typeof ctx.employerField === "string" && ctx.employerField.trim().length > 0;
  const employerName = declared ? ctx.employerField!.trim().slice(0, 120) : undefined;
  const employerMentioned = declared
    ? lower.includes(employerName!.toLowerCase())
    : undefined; // undefined = the check never ran

  const { matched, missing } = keywordMatch(career, lower);
  const coreCount = career.skills.filter((s) => s.tier === "core").length;
  const keywordScore = coreCount === 0 ? 0 : matched.length / coreCount;

  const air = computeLetterCheck({
    parsePass: true,
    keywordScore,
    checks: {
      salutation: structural.salutation,
      closingAsk: structural.closingAsk,
      wordBand: structural.wordBand,
      ...(declared ? { employerMentioned: employerMentioned! } : {}),
    },
    employerDeclared: declared,
  });

  /* ledger rows — the rendered check record (the skip row prints verbatim) */
  const keywords: LetterCheckRow[] = career.skills
    .filter((s) => s.tier === "core")
    .map((spec) => ({
      label: `${spec.name}${matched.includes(spec.name) ? "" : " — not found"}`,
      ok: matched.includes(spec.name),
      note: `role anchor · ${career.name} core map (${coreCount} core skills)`,
    }));

  const checks: LetterCheckRow[] = [
    { label: "Salutation — the letter addresses a reader", ok: structural.salutation },
    declared
      ? { label: "Employer named — the letter mentions the declared employer", ok: employerMentioned!, note: employerName }
      : { label: "Employer named", ok: null, note: EMPLOYER_SKIP_NOTE },
    { label: "Closing ask — the letter asks for the next step", ok: structural.closingAsk },
    {
      label: `Word count inside ${LETTER_WORD_MIN}–${LETTER_WORD_MAX}`,
      ok: structural.wordBand,
      note: `reads ${structural.wordCount} words`,
    },
  ];

  /* findings — the tiered rule; feedback-only, never generated text */
  const findings: LetterFinding[] = [];
  if (!structural.salutation) {
    findings.push({
      id: "lf-salutation",
      level: "fix",
      title: "No salutation in the opening lines",
      detail: "A letter opens by addressing its reader — screening and humans both read the first line as the formal register's tell.",
      suggestion: {
        move: "Start with an honest greeting on its own line — “Dear Hiring Manager,” is the safe default when no name is on offer.",
      },
    });
  }
  if (declared && employerMentioned === false) {
    findings.push({
      id: "lf-employer-miss",
      level: "fix",
      title: `The declared employer doesn't appear in the letter`,
      detail: "You anchored this check to an employer, and the letter's text never mentions that employer's name.",
      suggestion: {
        move: `Name ${employerName} where the letter says why this role fits — the anchored check then has something real to read.`,
      },
    });
  }
  if (!structural.closingAsk) {
    findings.push({
      id: "lf-closing-ask",
      level: "fix",
      title: "No closing ask — the letter never asks for the next step",
      detail: "The locked set treats a letter as a request, not a biography: its close asks, plainly, for the reader's next move.",
      suggestion: {
        move: "Add one closing line that asks for the step — “I would welcome the chance to interview” names it.",
      },
    });
  }
  if (!structural.wordBand) {
    findings.push({
      id: "lf-words",
      level: "fix",
      title:
        structural.wordCount < LETTER_WORD_MIN
          ? `Under the word band — ${structural.wordCount} words (band: ${LETTER_WORD_MIN}–${LETTER_WORD_MAX})`
          : `Over the word band — ${structural.wordCount} words (band: ${LETTER_WORD_MIN}–${LETTER_WORD_MAX})`,
      detail:
        structural.wordCount < LETTER_WORD_MIN
          ? "A too-short letter can't carry the two things readers look for — one proof paragraph and an ask."
          : "Recruiters scan letters, not essays — the band keeps the strongest content in the read.",
      suggestion: {
        move:
          structural.wordCount < LETTER_WORD_MIN
            ? "Grow the proof paragraph: one concrete deliverable with its result is worth more than another adjective."
            : "Trim to the strongest proof paragraph and the ask — cut anything a resume already shows.",
      },
    });
  }
  for (const skill of missing) {
    findings.push({
      id: `lf-kw-${skill.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`,
      level: "fix",
      title: `“${skill}” doesn't appear for this role`,
      detail: `Role alignment runs against the declared Target Role's core map — ${career.name} — regardless of any employer named.`,
      suggestion: {
        move: `Name ${skill} where you actually used it — one sentence with the task, the tool, and the result. Proof over padding.`,
      },
    });
  }
  // the honest skip is a rendered row, never a finding — nothing to fix when
  // the field was left empty on purpose (ticket 12 ruling)

  return {
    id: `letter-${Date.now().toString(36)}-${Math.floor(Math.random() * 46656).toString(36)}`,
    at: ctx.at ?? new Date().toISOString(),
    kind: ctx.kind,
    fileName: ctx.fileName.replace(/[^\w .-]/g, "_").slice(0, 120) || "letter",
    careerId: career.id,
    careerName: career.name,
    employerDeclared: declared,
    ...(declared ? { employerName } : {}),
    wordCount: structural.wordCount,
    air,
    checks,
    keywords,
    findings,
    engine: "deterministic-templates",
  };
}
