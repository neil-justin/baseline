import type { Career } from "@/lib/types";
import { TRACK_LABELS } from "@/lib/fixtures/catalog";

/**
 * Surface copy fixture — hand-authored [GUESS-F3] why-lines + prototype display
 * strings for the demo trio (swd / da / its), with catalog fallbacks for the
 * other 33 catalog rows. Text is canon: m2-career.md Copy notes style,
 * re-cut to the college-roster role names (round 9).
 */

const WHAT: Record<string, string> = {
  swd: "You build and fix software — writing it to spec, supporting it, making it work for real people.",
  da: "You take messy numbers and turn them into charts and answers a team can act on.",
  its: "You monitor, deploy and fix the IT systems — and answer the tickets that keep the day moving.",
};

const WHY: Record<string, string> = {
  swd: "You said you enjoy figuring out how things work and building them step by step, and you like clear checks that prove something is done right. That's most of a developer's day: build, test, fix, repeat.",
  da: "You said you like problems with checkable answers, and you'd rather look at the numbers than go on a hunch. A junior data analyst takes messy datasets and turns them into charts and answers a team can act on.",
  its: "You said you'd rather fix a real problem right in front of you than argue theory. This one is hands-on: the network's down, the rollout is pending, the ticket is yours.",
};

const ENTRY: Record<string, string> = {
  swd: "BS CS / IT / IS — campus hiring or internship pipelines into a dev team.",
  da: "BS Statistics / Management Accounting / CS — junior analyst desks and analytics BPM.",
};

export function careerWhat(c: Career): string {
  return WHAT[c.id] ?? c.roleSummary;
}

export function careerWhyLine(c: Career): string {
  return WHY[c.id] ?? `Your plan measures toward ${c.name}: ${c.roleSummary}`;
}

export function entryDisplay(c: Career): string {
  return ENTRY[c.id] ?? `${c.entryRoute}`;
}

/** Track label is the college-era browse display (round 9). */
export function strandDisplay(c: Career): string {
  return TRACK_LABELS[c.track];
}

/** strip dev-notation parentheticals for compact badges: "Git (version control)" → "Git" */
export function shortSkill(name: string): string {
  return name.replace(/\s*\(.*\)$/, "");
}

/** prototype re-assessment screen wording (catalog-canonical names as keys) */
const REASSESS_WHAT: Record<string, string> = {
  "Software Testing": "Running test cases across levels of the build",
  "Test Planning": "Reading requirements into testable conditions",
  "Defect management": "Logging, tracking and verifying fixes",
  "Quality Assurance / Quality Standards": "Metrics, coverage, release readiness",
  "Applications Support and Enhancement": "Fixing and extending live applications",
  "Business Needs Analysis": "Translating user requirements into specs",
};

/** strip source-bundle rows to their headline skill for the re-assessment display */
export function reassessDisplay(name: string): string {
  if (name.includes("Enabling")) return "Enabling skills";
  return name;
}

export function reassessWhat(skill: string, fallback: string): string {
  return REASSESS_WHAT[skill] ?? fallback;
}
