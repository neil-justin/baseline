/**
 * mock/suggest.ts — the RETHOUGHT suggestion picker (mock realm; user
 * rulings 2026-11-03):
 *   (a) satisfaction tiers, first separation wins:
 *       1. platform check pairs to this skill (CHECK_SKILL join)
 *       2. crediting body attests ("Credited by …" in the route line)
 *       3. counts toward the entry route
 *       4. learning flow — taught materials over reference reading
 *       5. free beats paid
 *       6. resource id A–Z
 *   (b) durationHours LEAVES the ranking (still rendered as info)
 *   (c) "most dedicated" (narrow-claim) bonus is ABOLISHED
 *   (d) TAUGHT-ONLY catalog (user ruling: everything else is omitted from
 *       the fixtures in the real wave) — landing/reference rows are
 *       invisible here; unvetted rows are invisible too
 *   (e) self-serve eligibility — direct/account/exam-paid only
 *   (f) RENDER SHAPE (user ruling: the audit lane doesn't render): every
 *       pick returns its authored LEARN_LINES sentence and the access
 *       word; why-picked factors stay internal (test-asserted later).
 *
 * The engine in page.tsx is untouched; canon.ts overrides the engine's
 * per-row pointers with these picks for every row (open AND closed).
 */
import { CHECK_SKILL } from "@/lib/fixtures/checks";
import type { ResRow, Suggestion } from "../PathwayTabs";
import { ACCESS, FORM, LEARN_LINES, type AccessState } from "./access";

const ELIGIBLE = new Set<AccessState>(["direct", "account", "exam-paid"]);

export interface PickResult {
  suggestion: Suggestion | null;
  /** the authored per-claim learn line ("why this teaches the skill") */
  learn: string | null;
  /** access state — folded into the meta line, never a separate chip */
  access: AccessState | null;
  /** claims that exist but failed the audit gates (unvetted/unaudit-
      eligible) — the wait-state wording is honest about WHICH emptiness */
  unvetted: number;
}

/** claim/eligibility helpers: taught-only content, self-serve access */
const canWin = (id: string) => {
  const a = ACCESS[id]?.access;
  return a != null && ELIGIBLE.has(a) && FORM[id] === "taught";
};

const creditBody = (r: ResRow): string | null => {
  const m = r.route?.match(/^Credited by ([^·]+)/);
  return m ? m[1].trim() : null;
};

/** satisfaction tiers — first separation picks the winner */
const tierScores = (r: ResRow, skill: string): [number, number, number, number, number] => [
  CHECK_SKILL[r.id] === skill ? 0 : 1,
  creditBody(r) ? 0 : 1,
  r.route?.includes("counts toward entry route") ? 0 : 1,
  0, // all catalog rows are taught (taught-only catalog ruling)
  /free/i.test(r.cost) ? 0 : 1,
];

export function pickSuggestion(skill: string, rows: ResRow[]): PickResult {
  const claims = rows.filter((r) => r.feeds.some((f) => f.skill === skill));
  const pool = claims.filter(
    (r) => FORM[r.id] === "taught" && canWin(r.id)
  );
  const unvetted = claims.length - pool.length;
  if (pool.length === 0) {
    return { suggestion: null, learn: null, access: null, unvetted };
  }

  const order = pool
    .map((r) => ({ r, s: tierScores(r, skill) }))
    .sort((a, b) => {
      for (let i = 0; i < a.s.length; i++) {
        if (a.s[i] !== b.s[i]) return a.s[i] - b.s[i];
      }
      return a.r.id.localeCompare(b.r.id);
    });
  const w = order[0].r;
  const access = ACCESS[w.id]?.access ?? "unclassified";

  return {
    suggestion: { title: w.title, cost: w.cost, hrs: w.time, url: w.url },
    learn: LEARN_LINES[`${w.id}::${skill}`] ?? null,
    access,
    unvetted,
  };
}
