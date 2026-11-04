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
 */
import type { VMCQ } from "@/app/(onboarding)/onboarding/banks";
import { VERIFY_BANK } from "@/app/(onboarding)/onboarding/banks";
import { IT_BANK } from "./it";
import { BUSINESS_BANK } from "./business";
import { ACCOUNTING_BANK } from "./accounting";
import { OFFICE_BANK } from "./office";

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
