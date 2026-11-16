/**
 * Interest engine (RIASEC) — pure functions, no side effects, DATA+ENGINE only.
 *
 * Scoring arithmetic = the Interest Profiler's own frame, adapted
 * (docs/career-interest-riasec.md §3): per item a 1–5 answer nets to
 * v−3 (5→+2, 4→+1, 3→0, 2→−1, 1→−2), summed per the item's RIASEC letter.
 * Ranking = the user's locked rule (§4): the program gate filters FIRST
 * (lib/degree-gate.ts semantics reused by the caller), RIASEC only orders.
 */
import type { Career } from "@/lib/types";
import {
  CAREER_INTEREST_CODES,
  INTEREST_AREAS,
  INTEREST_ITEMS,
  type InterestAreaLetter,
} from "@/lib/fixtures/interest";

/** itemId → area letter, used to credit an answer to its letter's net. */
const ITEM_AREA = Object.fromEntries(
  INTEREST_ITEMS.map((i) => [i.id, i.area])
) as Record<string, InterestAreaLetter>;

export type InterestAnswers = Record<string, 1 | 2 | 3 | 4 | 5>;
export type InterestScores = Record<InterestAreaLetter, number>;

/** Student letter order position → credit against a career code letter (§4). */
const POSITION_WEIGHTS: Record<number, number> = { 1: 1.0, 2: 0.6, 3: 0.35 };

const ANSWER_NET: Record<1 | 2 | 3 | 4 | 5, number> = { 1: -2, 2: -1, 3: 0, 4: 1, 5: 2 };

/** Areas in canonical O*NET letter order — deterministic tie-break for rankings. */
const CANON_ORDER: Record<InterestAreaLetter, number> = { R: 0, I: 1, A: 2, S: 3, E: 4, C: 5 };

/** 1–5 answers → six per-letter nets (v−3 summed per the item's area letter). */
export function scoreInterest(answers: InterestAnswers): InterestScores {
  const nets = Object.fromEntries(INTEREST_AREAS.map((a) => [a, 0])) as InterestScores;
  for (const [itemId, v] of Object.entries(answers)) {
    const itemArea = ITEM_AREA[itemId];
    if (!itemArea || !(v in ANSWER_NET)) continue;
    nets[itemArea] += ANSWER_NET[v];
  }
  return nets;
}

/** Letters ranked descending by net; ties stay in canonical R I A S E C order. */
export function rankLetters(scores: InterestScores): InterestAreaLetter[] {
  return [...INTEREST_AREAS].sort(
    (a, b) => scores[b] - scores[a] || CANON_ORDER[a] - CANON_ORDER[b]
  );
}

export interface FitResult {
  careerId: string;
  fitScore: number;
  matchedLetters: InterestAreaLetter[];
}

/**
 * Gate FIRST, fit second. `gate` is the program predicate (caller applies
 * degreeGateAllows with the student's program, or a constant true when no
 * program is set — empty programs are a data fallback, not a veto, per
 * lib/degree-gate.ts). Gated-out careers never rank above gated-in ones.
 * Ties break by catalog roster order (= the input array order — pass
 * CAREERS for the canon rule).
 */
export function rankCareers(
  scores: InterestScores,
  careers: Career[],
  gate: (career: Career) => boolean
): FitResult[] {
  const order = rankLetters(scores);
  const results: FitResult[] = [];
  for (const career of careers) {
    if (!gate(career)) continue;
    const entry = CAREER_INTEREST_CODES.find((e) => e.careerId === career.id);
    if (!entry) continue;
    const codes = entry.interestCode.split("");
    const matched: InterestAreaLetter[] = [];
    let fit = 0;
    for (const c of codes) {
      const pos = order.indexOf(c as InterestAreaLetter) + 1;
      const w = POSITION_WEIGHTS[pos] ?? 0;
      if (w > 0) {
        fit += w;
        matched.push(c as InterestAreaLetter);
      }
    }
    results.push({ careerId: career.id, fitScore: fit, matchedLetters: matched });
  }
  return results.sort((a, b) => b.fitScore - a.fitScore);
}

/** Flat profile: top letter net − second letter net < 2 → low confidence. */
export function lowConfidence(scores: InterestScores): boolean {
  const ranked = rankLetters(scores);
  return scores[ranked[0]] - scores[ranked[1]] < 2;
}

const AREA_NAME: Record<InterestAreaLetter, string> = {
  R: "Realistic",
  I: "Investigative",
  A: "Artistic",
  S: "Social",
  E: "Enterprising",
  C: "Conventional",
};

/**
 * Card fit line, generated from the student's own top letters + the career's
 * interest code (no baked per-career copy; the career NAME is rendered by the
 * UI separately, never inside this line). Deterministic in both inputs.
 */
export function fitLine(
  topLetters: InterestAreaLetter[],
  career: Pick<Career, "id">
): string {
  const entry = CAREER_INTEREST_CODES.find((e) => e.careerId === career.id);
  const tops = topLetters.slice(0, 2);
  const leaned = tops.map((l) => AREA_NAME[l]).join(" + ");
  const profile = (entry?.interestCode.split("") ?? [])
    .map((l) => AREA_NAME[l as InterestAreaLetter])
    .join(", ");
  return `Your answers leaned ${leaned}. This role's own profile leans ${profile} — the same mix behind your top answers.`;
}
