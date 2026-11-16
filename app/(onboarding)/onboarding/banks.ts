import type { CheckQuestion } from "@/lib/types";

/**
 * Onboarding page-local fixtures — the pre-baked demo content canon.
 *
 * IMPORTANT (instrument round, 2026-10-29): the 42-item competency
 * instrument is NOT demo-local — its user-approved content bank lives in
 * `lib/fixtures/instrument.ts` (verbatim from
 * .scratch/career-path-readiness-platform/features/content/
 * instrument-competencies-draft.md; server-graded via app/api/assessment).
 * This file keeps only the page-local demo narration:
 *  - interest quiz: RIASEC-BANK-01 demo slice (onboarding.md OB-3a.3 verbatim)
 *  - suggestion-card narration: OB-3a.9–11 pre-baked fallback lines
 *  - verification MCQs: VMCQ-SWE-01 demo bank — re-keyed to the college
 *    catalog's verbatim PSF-SDS rows (round 9). Bank ORDER = draw order: the
 *    demo draws the first 5 bank items that the student claimed; canon needs
 *    "Data Design / SQL + data modeling" and "Business Needs Analysis" drawn
 *    and passed ("2 of 5"), with Applications Development only claimed (not
 *    drawn) so the Python-goal skill stays self-reported.
 *  - goal suggestion: the OB-4 pre-filled Training goal (resource row resolved
 *    against `lib/fixtures/resources.ts` at render, never painted)
 * RIASEC codes/type keys are internal — never rendered (conventions Q4).
 */

export const INTEREST_QUIZ: string[] = [
  // [R — Practical]
  "Given a free Saturday, you'd usually rather fix, build, or make something than read about it.",
  // [I — Analytical]
  "When something doesn't add up — a math problem, a glitch, a weird statistic — you want to dig in until you know why.",
  // [A — Creative]
  "You enjoy making things that look or sound good — writing, drawing, editing photos or videos.",
  // [S — Helping]
  "Friends come to you when they need help or someone to listen.",
  // [E — Persuasive]
  "You don't mind leading a group project, planning an event, or pitching an idea.",
  // [C — Organized]
  "You like things in order — clean notes, exact steps, double-checked lists.",
];

/** Interest-quiz answer chips — Yes=strong · Kind of=mid · Not really=low. */
export const INTEREST_OPTIONS: { v: "strong" | "mid" | "low"; label: string }[] = [
  { v: "strong", label: "Yes, that's me" },
  { v: "mid", label: "Kind of" },
  { v: "low", label: "Not really" },
];

/** Pre-baked ①fit / ④entry-route lines per suggestion card (OB-3a.9–11). */
export const SUGGESTION_CARDS: Record<string, { fitLine: string; entryLine: string }> = {
  swd: {
    fitLine: "You said yes to digging into problems and building things — software is exactly that loop.",
    entryLine: "BS CS / IT / IS — campus hiring or internship pipelines into a dev team.",
  },
  da: {
    fitLine: "Your answers liked finding patterns and making sense of numbers — analysts do that all day.",
    entryLine: "BS Statistics / Management Accounting / CS — junior analyst desks and analytics BPM.",
  },
  its: {
    fitLine: "If you like taking things apart and making them work again, offices and schools all need this.",
    entryLine: "BS IT / IS / CS — Tier-1 support ladders in in-house IT or an MSP.",
  },
};

/**
 * VMCQ-SWE-01 — one MCQ per top-claimed skill, max 5 (locked scope rule,
 * OB-3b-3.2). Canon demo: Neil claims 6 of 8 → 5 items drawn (support,
 * agile, SQL-design, business needs, enabling); SQL-design + business needs
 * pass ("2 of 5 confirmed"). `catalogSkill` must match the frozen
 * /api/verify + /api/claim keys exactly.
 *
 * Relation to the swd ladders (wave-1 pilot, 2026-11-05): all 5 skills this
 * bank draws are swd-owned catalog rows, and each ALSO holds its swd 3-item
 * ladder identity in `lib/fixtures/skill-banks/it.ts` — the wiring handles
 * both shapes (a claimed ladder-wired skill sits the ladder at /verify, a
 * legacy-only skill keeps this single item). No `// wave-2: pending ladder`
 * rows exist: no demo-path skill belongs to another career.
 */
export interface VMCQ {
  skill: string; // student-facing display name
  catalogSkill: string; // canonical catalog row name (API key)
  stem: string;
  options: string[];
  answer: number;
  /** Ladder items only (optional so the legacy banks stay untouched):
   *  the item's on-disk official statement anchor, e.g.
   *  "O*NET 15-1252.00 · task 21661" · "PSOC 2512 · b" · "PSF-SDS · <desc>". */
  ref?: string;
  /** Ladder items only: one why-wrong line per WRONG option, in option
   *  order EXCLUDING the key (length 3 for a 4-option item). Verbatim
   *  source quotes live here, never in the key (stem-discipline rule 4). */
  distractorNotes?: string[];
}

/**
 * One skill's 3-rung verification ladder — the wave-1 pilot shape
 * (docs/assessment-blueprint-swd.md, user-approved 2026-11-05 "go"):
 * Q1 recognition → Q2 application → Q3 judgment, ALL THREE correct →
 * markVerified (independent items; guess rate per skill ≈ (1/4)³ ≈ 1.6%).
 * `catalogSkill` byte-matches the catalog row name. The bank file that owns
 * the ladders is `lib/fixtures/skill-banks/it.ts` (swd rides the IT track);
 * byte-lock: the shipped singles above stay, the ladders live alongside.
 */
export interface SkillLadder {
  skill: string; // student-facing display name (the ladder's shared identity)
  catalogSkill: string; // canonical catalog row name (API key, byte-match)
  /** tier order fixed: [recognition, application, judgment] */
  items: [VMCQ, VMCQ, VMCQ];
}

export const VERIFY_BANK: VMCQ[] = [
  {
    skill: "Applications Support",
    catalogSkill: "Applications Support and Enhancement",
    stem: "A feature you shipped last month breaks for users. What does 'support and enhancement' mean here?",
    options: [
      "fix it so the live app works again, and extend it carefully afterwards",
      "delete the feature and rewrite the app from scratch",
      "wait for users to give up and stop reporting it",
      "tell the users the bug is a hardware problem",
    ],
    answer: 0,
  },
  {
    skill: "Agile Software Development",
    catalogSkill: "Agile Software Development",
    stem: "In an agile sprint, what does the team do at the daily stand-up?",
    options: [
      "each person says what they did, what they're picking up, and what's blocking them",
      "replan the entire product roadmap from zero",
      "deploy everything built so far straight to production",
      "nobody speaks; the developers read the meeting notes silently",
    ],
    answer: 0,
  },
  {
    skill: "SQL",
    catalogSkill: "Data Design / SQL + data modeling",
    stem: "You need a list of every row in the “students” table. Which query do you run?",
    options: ["SELECT * FROM students", "ADD students LIST", "PRINT students", "GET TABLE students"],
    answer: 0,
  },
  {
    skill: "Business Needs Analysis",
    catalogSkill: "Business Needs Analysis",
    stem: "A department says 'reports are slow.' What is a business analyst's job with that input?",
    options: [
      "turn it into a defined requirement: what's slow, why, and what 'fixed' looks like",
      "buy new laptops for the whole department right away",
      "silently ignore it until the sprint ends",
      "tell the department to write their own software",
    ],
    answer: 0,
  },
  {
    skill: "Enabling skills",
    catalogSkill:
      "Collaboration · Communication · Digital Fluency · Learning Agility · Problem Solving · Self Management (Enabling Skills, Basic/Intermediate)",
    stem: "Your teammate's pull request conflicts with yours. The professional first move is",
    options: [
      "talk it through, agree where the change should live, keep the record clean",
      "force-push your branch over theirs",
      "open a second repository so you never merge",
      "let the conflict sit until the release date passes",
    ],
    answer: 0,
  },
];

/** OB-4 pre-filled Training goal — canon demo suggestion (per career id). */
export const GOAL_SUGGESTION: Record<string, { title: string; resourceId: string; skill: string }> = {
  swd: {
    title: "Finish the Python basics course",
    resourceId: "res-python-basics",
    skill: "Applications Development",
  },
};

/** OB-1 track taglines (round 9: four college tracks; card counts compute live). */
export const TRACK_TAGLINES: Record<string, string> = {
  it: "Code, data, networks, cybersecurity — from developer to SOC analyst.",
  business: "People, money, campaigns, customers — from HR to marketing to sales.",
  accounting: "Books, ledgers, audit, credit — from bookkeeper to audit associate.",
  office: "Records, coordination, front desks — the administrative backbone.",
};

export type { CheckQuestion };
