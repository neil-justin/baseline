import type { CheckQuestion } from "@/lib/types";

/**
 * Onboarding page-local fixtures (task 8) — the pre-baked content canon:
 *  - interest quiz: RIASEC-BANK-01 demo slice (onboarding.md OB-3a.3 verbatim)
 *  - suggestion-card narration: OB-3a.9–11 pre-baked fallback lines
 *  - verification MCQs: VMCQ-SWE-01 demo bank (OB-3b-3.4 verbatim where given;
 *    SQL + Technical documentation are hand-written twins in the same style)
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

/** Pre-baked ①fit / ④After-SHS lines per suggestion card (OB-3a.9–11). */
export const SUGGESTION_CARDS: Record<string, { fitLine: string; afterShs: string }> = {
  swd: {
    fitLine: "You said yes to digging into problems and building things — software is exactly that loop.",
    afterShs: "BS Computer Science / IT / IS — or TVL-ICT NC II + a bootcamp.",
  },
  da: {
    fitLine: "Your answers liked finding patterns and making sense of numbers — analysts do that all day.",
    afterShs: "BS Statistics, Math, or CS — or an analytics bootcamp.",
  },
  its: {
    fitLine: "If you like taking things apart and making them work again, shops, offices and schools all need this.",
    afterShs: "TESDA Computer Systems Servicing NC II.",
  },
};

/**
 * VMCQ-SWE-01 — one MCQ per top-claimed skill, max 5 (locked scope rule,
 * OB-3b-3.2). Canon demo: Neil claims 6 of 8 → 5 items drawn (Programming
 * logic, SQL, Git, Debugging, Technical documentation); SQL + Git pass.
 * `catalogSkill` must match the frozen /api/verify + /api/claim keys exactly.
 */
export interface VMCQ {
  skill: string; // student-facing display name
  catalogSkill: string; // canonical catalog row name (API key)
  stem: string;
  options: string[];
  answer: number;
}

export const VERIFY_BANK: VMCQ[] = [
  {
    skill: "Programming logic",
    catalogSkill: "Programming logic (Python/Java)",
    stem: "In Python, what does `for i in range(3):` do?",
    options: [
      "runs the indented block 3 times",
      "runs it once",
      "repeats forever until you stop it",
      "checks if `i` equals 3",
    ],
    answer: 0,
  },
  {
    skill: "SQL",
    catalogSkill: "SQL",
    stem: "You need a list of every row in the “students” table. Which query do you run?",
    options: ["SELECT * FROM students", "ADD students LIST", "PRINT students", "GET TABLE students"],
    answer: 0,
  },
  {
    skill: "Git",
    catalogSkill: "Git (version control)",
    stem: "You just fixed a bug. What does `git commit` do?",
    options: [
      "saves a snapshot of your changes to the project's history",
      "uploads your code to GitHub",
      "deletes your last change",
      "merges your code with a teammate's",
    ],
    answer: 0,
  },
  {
    skill: "Debugging",
    catalogSkill: "Debugging",
    stem: "Your program crashes with an error pointing to line 12. Best first move?",
    options: [
      "read the error message and look at line 12",
      "rewrite the whole program",
      "restart your computer and run it again",
      "delete line 12",
    ],
    answer: 0,
  },
  {
    skill: "Technical documentation",
    catalogSkill: "Technical documentation",
    stem: "What is the point of a README file in a project?",
    options: [
      "explains what the project is and how to use it",
      "stores the project's passwords",
      "makes the code compile faster",
      "lists every line of code",
    ],
    answer: 0,
  },
];

/** OB-4 pre-filled Training goal — canon demo suggestion (per career id). */
export const GOAL_SUGGESTION: Record<string, { title: string; resourceId: string; skill: string }> = {
  swd: {
    title: "Finish the Python basics course",
    resourceId: "res-python-basics",
    skill: "Programming logic (Python/Java)",
  },
};

/** OB-1 strand taglines (drafts per onboarding.md OB-1.2; card counts are computed from the catalog). */
export const STRAND_TAGLINES: Record<string, string> = {
  STEM: "Science, tech, engineering, math — from nurse to software developer.",
  ABM: "Business, money, running organizations — from accounting to entrepreneurship.",
  HUMSS: "People, communication, society — from teaching to journalism.",
  GAS: "Keep your options open while you decide — design, events, more.",
  TVL: "Hands-on certified skills — from electrician to IT support.",
};

export type { CheckQuestion };
