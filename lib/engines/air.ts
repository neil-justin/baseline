/**
 * AIR resume component (Q5a, round 6a) — deterministic, template-only.
 *
 * AIR_resume = parse-pass gate × format-conformance × keyword-coverage.
 *  - parse-pass gate: a parse-failed run contributes nothing (scope decision:
 *    one SUCCESSFUL diagnostic run = the Plan's "resume diagnostic done").
 *  - format conformance: fraction of the format checks the resume meets
 *    (NACE-guided: contact header · education · experience · skills · one page).
 *  - keyword coverage: fraction of the target role's core-tier skills found in
 *    the resume text (with the role's curated synonym seed).
 *
 * WIRED IN (ADR 0002 re-lock, 2026-10-29): the score's AR channel is
 * 15 × bestAir ÷ 100 — `lib/db.ts` feeds the best persisted run into
 * `computeScore` via the AR input; `lib/db/resume-run-store.ts` keeps the
 * best-run semantics (unlimited re-runs). Unmeasured (no run) = the channel
 * sits out — no earned points, no painted zero.
 */

export interface AirResumeInput {
  /** false = the run never parsed a resume (parse-failed runs don't count) */
  parsePass: boolean;
  /** 0–1 fraction of format checks met (contact, education, experience, skills, one page) */
  formatScore: number;
  /** 0–1 fraction of the role's core-tier skills found in the text */
  keywordScore: number;
}

export interface AirResume {
  /** 0 (gate closed) · 1 (parsed) — rolls up as ×1 in the product */
  parsePass: 0 | 1;
  formatScore: number; // 0–1, half-down rounded to 3 decimals
  keywordScore: number; // 0–1, half-down rounded to 3 decimals
  /** parsePass × formatScore × keywordScore, 0–100 for readouts */
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
