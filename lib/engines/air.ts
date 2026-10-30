/**
 * Application-Readiness factor engines (ADR 0002 amendment 2 — ticket 12,
 * 2026-10-29). The locked 15-point AR channel splits THREE per-file factors
 * that each measure independently — unmeasured factors contribute nothing and
 * never paint (score.ts carries the arithmetic; this file owns the factor
 * engines and their honest check records):
 *
 *   Resume    7 — parse-pass gate × format-conformance × keyword-coverage
 *               (`computeAirResume` — the round-6a diagnostic, unchanged;
 *               `lib/db/resume-run-store.ts` keeps the latest run — the
 *               score's selection is the LATEST full attempt, amendment 3
 *               2026-10-29: latest counts; unlimited re-runs).
 *   Letter    5 — parse-pass gate × keyword-role alignment vs the declared
 *               Target Role's core map × the structural set (salutation ·
 *               employer named · closing ask · 250–500 words). The employer
 *               check is OPTIONAL: when the student typed no employer it is
 *               honestly skipped — "not evaluated — no employer declared" —
 *               and drops out of the denominator, never silently failed and
 *               never silently scored. Feedback-only; never auto-writes; no
 *               "ATS pass" claims anywhere.
 *   Presence  3 — a DECLARED entry (LinkedIn URL + professional contact
 *               email) machine-verified by a timestamped stamp. Look-up is
 *               OFFLINE by recorded ruling: nothing here fetches LinkedIn or
 *               mail — the stamp grades what is deterministic without the
 *               network (URL shape · email format) and the timestamped stamp
 *               is what the offline demo presents. A private account records
 *               the honest sub-result "resolves, content not machine-
 *               verifiable" — recorded, never silently hidden.
 *
 * Half-down rounding throughout (the locked convention, mirrors score.ts).
 */

import type { PresenceDeclaration } from "@/lib/types";

/* ── the resume factor (7) ───────────────────────────────────────────────── */

export interface AirResumeInput {
  /** false = the run never parsed a resume (parse-failed runs don't count) */
  parsePass: boolean;
  /** 0–1 fraction of format checks met (contact, education, experience, skills, one page) */
  formatScore: number;
  /** 0–1 fraction of the target role's core-tier skills found in the text */
  keywordScore: number;
}

export interface AirResume {
  /** 0 (gate closed) · 1 (parsed) — rolls up as ×1 in the product */
  parsePass: 0 | 1;
  formatScore: number; // 0–1, half-down rounded to 3 decimals
  keywordScore: number; // 0–1, half-down rounded to 3 decimals
  /** parsePass × formatScore × keywordScore, 0–100 for readouts; feeds 7 of the 15 AR points */
  airResume: number;
}

/** nearest integer, .5 rounds DOWN (locked convention, mirrors score.ts) */
function roundHalfDown(x: number): number {
  return Math.floor(x + 0.5 - 1e-9);
}

function frac(x: number): number {
  const r = Math.round(x * 1000) / 1000;
  return Math.max(0, Math.min(1, r));
}

export function computeAirResume(input: AirResumeInput): AirResume {
  const parsePass: 0 | 1 = input.parsePass ? 1 : 0;
  const formatScore = frac(input.formatScore);
  const keywordScore = frac(Math.min(1, input.keywordScore));
  const airResume = parsePass === 0 ? 0 : roundHalfDown(100 * parsePass * formatScore * keywordScore);
  return { parsePass, formatScore, keywordScore, airResume };
}

/* ── the cover-letter factor (5) — ticket 12, deterministic structural set ── */

export interface AirLetterInput {
  /** false = the file never parsed (a parse-failed letter run contributes nothing) */
  parsePass: boolean;
  /** 0–1 keyword-role alignment vs the declared Target Role's core-tier map */
  keywordScore: number;
  /** the structural determinism set (absent key = honest not-evaluated) */
  checks: {
    salutation?: boolean;
    closingAsk?: boolean;
    /** 250–500-word band */
    wordBand?: boolean;
    employerMentioned?: boolean;
  };
  /** did the student declare an employer anchor? (optional field — user ruling 2026-10-29) */
  employerDeclared?: boolean;
}

export interface AirLetter {
  parsePass: 0 | 1;
  /** 0–1, half-down rounded — against the Target Role's skill map (always the anchor) */
  keywordScore: number;
  salutation: boolean | null; // null = not evaluated
  closingAsk: boolean | null;
  wordBand: boolean | null;
  /** null = not evaluated — "not evaluated — no employer declared", never a silent fail */
  employerMentioned: boolean | null;
  employerEvaluated: boolean;
  /** fraction over the EVALUABLE structural checks only */
  structuralScore: number;
  /** parsePass × keywordScore × structuralScore × 100 — feeds 5 of the 15 AR points */
  airLetter: number;
}

export const EMPLOYER_SKIP_NOTE = "not evaluated — no employer declared";

export function computeLetterCheck(input: AirLetterInput): AirLetter {
  const parsePass: 0 | 1 = input.parsePass ? 1 : 0;
  const keywordScore = frac(Math.min(1, input.keywordScore));
  const declared = input.employerDeclared === true;

  const salutation = input.checks.salutation ?? null;
  const closingAsk = input.checks.closingAsk ?? null;
  const wordBand = input.checks.wordBand ?? null;
  const employerMentioned = declared ? (input.checks.employerMentioned ?? false) : null;

  // evaluables: every check that ran (absent = not evaluated, dropped from the
  // fraction honestly — an optional check never denominates itself in)
  const run = [
    { ok: salutation, present: input.checks.salutation !== undefined },
    { ok: closingAsk, present: input.checks.closingAsk !== undefined },
    { ok: wordBand, present: input.checks.wordBand !== undefined },
    { ok: employerMentioned, present: declared },
  ];
  const evaluated = run.filter((c) => c.present);
  const structuralScore =
    evaluated.length === 0 ? 1 : evaluated.filter((c) => c.ok === true).length / evaluated.length;

  const airLetter =
    parsePass === 0 ? 0 : roundHalfDown(100 * parsePass * keywordScore * structuralScore);

  return {
    parsePass,
    keywordScore,
    salutation,
    closingAsk,
    wordBand,
    employerMentioned,
    employerEvaluated: declared,
    structuralScore,
    airLetter,
  };
}

/* ── the presence factor (3) — declared + machine-verified timestamp ─────── */

/** deterministic-gradable check mark on a presence entry */
export type PresenceCheckMark = "pass" | "fail";

export interface PresenceStamp {
  /** the machine-verified timestamp — the offline demo presents THIS stamp */
  verifiedAt: string;
  checks: {
    /** URL is a well-formed profile link (shape only — no look-up ran) */
    linkedinUrlFormat: PresenceCheckMark;
    /** the contact address is a well-formed professional email (format only) */
    professionalEmailFormat: PresenceCheckMark;
  };
  /** honest sub-result when the account is private: content can't be machine-read */
  contentNote?: string;
  /** stamped offline (venue ruling): no network look-up ran — recorded literally */
  offline: boolean;
}

/** OFFLINE presence grading: deterministic shape checks + the timestamped stamp. */
export function stampPresence(
  input: { linkedinUrl: string; email: string; privateAccount?: boolean },
  verifiedAt: string
): PresenceStamp {
  const url = input.linkedinUrl.trim();
  const email = input.email.trim();
  const urlOk = /^https:\/\/(www\.)?linkedin\.com\/in\/[\w:%.-]+\/?$/i.test(url);
  const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email);
  return {
    verifiedAt,
    checks: { linkedinUrlFormat: urlOk ? "pass" : "fail", professionalEmailFormat: emailOk ? "pass" : "fail" },
    // the honest sub-result, recorded when it applies — never silently hidden
    ...(input.privateAccount ? { contentNote: "resolves, content not machine-verifiable" } : {}),
    offline: true,
  };
}

/** Presence measures only when its stamp exists and both format checks pass —
 *  a malformed entry renders its feedback and stays unmeasured (never a painted zero). */
export function presenceMeasured(p?: PresenceDeclaration | null): boolean {
  if (!p || !p.stamp) return false;
  return p.stamp.checks.linkedinUrlFormat === "pass" && p.stamp.checks.professionalEmailFormat === "pass";
}
