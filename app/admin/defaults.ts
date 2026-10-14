/**
 * Admin fixture cohort — transcribed 1:1 from the JS fixture object in
 * prototype/admin-student.html (plus the table-only `lastActive` column from
 * prototype/admin.html). The 6 ghost students are seeded fixtures; their
 * integers are DERIVED below (score = SP + ES + TP + CC) under the locked
 * rubric SP 40 / ES 25 / TP 20 / CC 15 — same no-hardcode rule as everywhere.
 *
 * The demo student (Neil) is NOT a static fixture: his row and detail page
 * recompute live from the store via `getStudentView` + `computeScore`.
 * Only his presentation identity (display name, sub-line) is fixed here.
 */

export type RubricPart = [earned: number, max: number];

export interface RubricValues {
  sp: RubricPart; // Skill progress — of 40
  es: RubricPart; // Employability skills — of 25
  tp: RubricPart; // Training progress — of 20
  cc: RubricPart; // Career clarity — of 15
}

export interface AdminFixtureStudent extends RubricValues {
  id: string;
  /** display name in the table and detail heading, incl. surname initial */
  name: string;
  /** compact table sub-line ("G11 · STEM") */
  sub: string;
  /** detail-page meta line ("Grade 11 · STEM") */
  grade: string;
  /** declared target career; null = "Still deciding" (cold-start edge case) */
  career: string | null;
  /** relative last-active stamp (fixture column from prototype/admin.html) */
  lastActive: string;
  spNote: string;
  tpNote: string;
  ccNote: string;
  context: string;
}

/** Locked rubric weights (mirrors lib/engines/score.ts WEIGHTS). */
export const RUBRIC_MAX = { sp: 40, es: 25, tp: 20, cc: 15 } as const;

/** Row ORDER — the admin cohort table order and the prev/next walk. */
export const COHORT_ORDER = ["neil", "karla", "marco", "liza", "bea", "jomar", "rafael"] as const;

/**
 * The 6 seeded ghost students. Values verbatim from the prototype fixture
 * object (`features/content/admin.md`: scores spread 34–55, avg ≈ 47, odd
 * cohort size so the demo student isn't the outlier).
 */
export const GHOSTS: Record<string, AdminFixtureStudent> = {
  karla: {
    id: "karla",
    name: "Karla M.",
    sub: "G12 · ABM",
    grade: "Grade 12 · ABM",
    career: "Accounting Staff",
    lastActive: "Today",
    sp: [33, 40],
    es: [0, 25],
    tp: [7, 20],
    cc: [15, 15],
    spNote: "Counted from her setup claims and check passes — the same rubric as every student.",
    tpNote: "An early training step is done on her entry route.",
    ccNote: "Career confirmed.",
    context: "Same values as her row in the cohort table.",
  },
  marco: {
    id: "marco",
    name: "Marco D.",
    sub: "G12 · TVL-IA",
    grade: "Grade 12 · TVL-IA",
    career: "Electrician",
    lastActive: "1 day ago",
    sp: [34, 40],
    es: [0, 25],
    tp: [13, 20],
    cc: [5, 15],
    spNote: "Counted from his TESDA-route claims and check passes — same rubric as every student.",
    tpNote: "Well underway on his NC II route.",
    ccNote: "Direction not fully locked — the rest is earned as he confirms it.",
    context: "Same values as his row in the cohort table.",
  },
  liza: {
    id: "liza",
    name: "Liza C.",
    sub: "G11 · STEM",
    grade: "Grade 11 · STEM",
    career: "Registered Nurse",
    lastActive: "2 days ago",
    sp: [33, 40],
    es: [0, 25],
    tp: [0, 20],
    cc: [15, 15],
    spNote: "Counted from her setup claims and check passes — the same rubric as every student.",
    tpNote: "None yet — her pathway hasn’t opened its first step.",
    ccNote: "Career confirmed.",
    context: "Same values as her row in the cohort table.",
  },
  bea: {
    id: "bea",
    name: "Bea T.",
    sub: "G11 · HUMSS",
    grade: "Grade 11 · HUMSS",
    career: "Teacher (Elem/SHS)",
    lastActive: "3 days ago",
    sp: [27, 40],
    es: [0, 25],
    tp: [7, 20],
    cc: [10, 15],
    spNote: "Counted from her setup claims and check passes — the same rubric as every student.",
    tpNote: "An early training step is done on her entry route.",
    ccNote: "One direction step still open.",
    context: "Same values as her row in the cohort table.",
  },
  jomar: {
    id: "jomar",
    name: "Jomar P.",
    sub: "G12 · TVL-HE",
    grade: "Grade 12 · TVL-HE",
    career: "Commis Cook (Chef track)",
    lastActive: "5 days ago",
    sp: [24, 40],
    es: [0, 25],
    tp: [7, 20],
    cc: [10, 15],
    spNote: "Counted from his TESDA-route claims and check passes — same rubric as every student.",
    tpNote: "An early training step is done on his NC II route.",
    ccNote: "One direction step still open.",
    context: "Same values as his row in the cohort table.",
  },
  rafael: {
    id: "rafael",
    name: "Rafael G.",
    sub: "G12 · GAS",
    grade: "Grade 12 · GAS",
    career: null, // still deciding — the undecided default state
    lastActive: "6 days ago",
    sp: [33, 40],
    es: [0, 25],
    tp: [0, 20],
    cc: [5, 15],
    spNote: "Baseline from his setup claims only — no career map is measured against yet.",
    tpNote: "No career picked — his pathway isn’t open yet.",
    ccNote: "Still deciding — direction locks the remaining points when he picks a career.",
    context: "Same values as his row in the cohort table.",
  },
};

/** Neil's fixed presentation identity — every number about him is live. */
export const NEIL_IDENTITY = {
  id: "neil",
  name: "Neil R.",
  sub: "G11 · STEM",
  lastActive: "Today",
} as const;

/** Ghost scores are derived, never typed: total = SP + ES + TP + CC. */
export function totalFromParts(p: RubricValues): number {
  return p.sp[0] + p.es[0] + p.tp[0] + p.cc[0];
}

/**
 * Resolve `?student=` — missing or unknown falls back to the demo student
 * (Neil). Returns the resolved id ("neil" included, live-recomputed).
 */
export function resolveStudentId(raw: string | undefined): string {
  if (raw && COHORT_ORDER.includes(raw as (typeof COHORT_ORDER)[number])) return raw;
  return "neil";
}

/** "G11" → "Grade 11" (live-state grade format → admin meta line). */
export function gradeLabel(grade: string): string {
  const m = grade.match(/^G(\d+)/i);
  return m ? `Grade ${m[1]}` : grade;
}
