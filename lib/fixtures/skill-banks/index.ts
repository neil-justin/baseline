/**
 * fixtures/skill-banks/index.ts — the skill-verification banks, joined.
 *
 * One MCQ per canonical `catalogSkill` across all 36 college roles: the
 * shipped canon bank (VERIFY_BANK, the hand-authored SWE demo path in
 * onboarding/banks.ts) plus the four track slices authored 2026-11-04
 * (content round; the AI-rot register applies to them too). Every item's
 * `catalogSkill` byte-matches a `career.skills[].name` — the 2026-11-04
 * user ruling behind the coverage gate (`scripts/verify-banks.test.ts`):
 * one banked skill serves every role that maps to it (backlog §3).
 *
 * ── Ladders (wave-1 pilot, user-approved 2026-11-05 "go") ─────────────────
 * `SKILL_LADDERS` joins the track slices' 3-item skill-verification
 * ladders (`SkillLadder`, onboarding/banks.ts; the swd pilot's 8 live in
 * skill-banks/it.ts per docs/assessment-blueprint-swd.md). Ladders are a
 * SECOND channel beside `SKILL_BANKS`: a skill with a ladder verifies
 * through its 3-question sequence (POST /api/verify `answers[3]`, all
 * three → markVerified); every other skill keeps the shipped single
 * question and legacy wire byte-for-byte. Later waves append their
 * ladders to their track slice here — `scripts/skill-ladder-coverage.
 * test.ts` gates coverage per COMPLETED_WAVES.
 */
import type { SkillLadder, VMCQ } from "@/app/(onboarding)/onboarding/banks";
import { VERIFY_BANK } from "@/app/(onboarding)/onboarding/banks";
import { IT_BANK, IT_LADDERS } from "./it";
import { BUSINESS_BANK, BUSINESS_LADDERS } from "./business";
import { ACCOUNTING_BANK, ACCOUNTING_LADDERS } from "./accounting";
import { OFFICE_BANK, OFFICE_LADDERS } from "./office";

/** canon first, then the tracks in catalog-track order. The runtime
    dedupe guards the ONE-KEY rule (a skill added to another track's map
    later can't double-bank): first occurrence in this order wins. */
export const SKILL_BANKS: VMCQ[] = [...VERIFY_BANK, ...IT_BANK, ...BUSINESS_BANK, ...ACCOUNTING_BANK, ...OFFICE_BANK].reduce(
  (acc: VMCQ[], q) => {
    if (!acc.some((p) => p.catalogSkill === q.catalogSkill)) acc.push(q);
    return acc;
  },
  []
);

/**
 * The joined ladder channel (track slices in the same order). Byte-match
 * rule: a ladder's `catalogSkill` names the catalog row it verifies;
 * `getSkillLadder` is the one lookup the wiring (POST /api/verify,
 * /verify page) reads — a skill with a ladder here and a single in
 * SKILL_BANKS verifies ONLY through the ladder now (the wave-1 pilot's
 * D-ruling); legacy-only skills keep the single-item behavior.
 */
export const SKILL_LADDERS: SkillLadder[] = [...IT_LADDERS, ...BUSINESS_LADDERS, ...ACCOUNTING_LADDERS, ...OFFICE_LADDERS].reduce(
  (acc: SkillLadder[], q) => {
    if (!acc.some((p) => p.catalogSkill === q.catalogSkill)) acc.push(q);
    return acc;
  },
  []
);

export function getSkillLadder(catalogSkill: string): SkillLadder | undefined {
  return SKILL_LADDERS.find((l) => l.catalogSkill === catalogSkill);
}
