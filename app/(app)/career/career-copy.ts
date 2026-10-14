import type { Career } from "@/lib/types";

/**
 * Surface copy fixture — hand-authored [GUESS-F3] why-lines + prototype display
 * strings for the demo trio (swd / da / its), with catalog fallbacks for the
 * other 29 catalog rows. Text is canon: m2-career.md Copy notes, verbatim.
 */

const WHAT: Record<string, string> = {
  swd: "You build and fix software — writing it, testing it, making it work for real people.",
  da: "You take messy numbers and turn them into answers a team can act on.",
  its: "You install and fix computers and networks.",
};

const WHY: Record<string, string> = {
  swd: "You said you enjoy figuring out how things work and building them step by step, and you like clear checks that prove something is done right. That's most of a developer's day: build, test, fix, repeat.",
  da: "You said you like problems with checkable answers, and you'd rather look at the numbers than go on a hunch. A data analyst takes messy figures and turns them into answers a team can act on.",
  its: "You said you'd rather fix a real problem right in front of you than argue theory. This one is hands-on: something's broken, you find out why, and you make it work.",
};

const ENTRY: Record<string, string> = {
  swd: "BS Computer Science / IT / IS — or TVL-ICT NC II + a bootcamp.",
  da: "BS Statistics / Math / CS; analytics bootcamps.",
};

export function careerWhat(c: Career): string {
  return WHAT[c.id] ?? c.roleSummary;
}

export function careerWhyLine(c: Career): string {
  return WHY[c.id] ?? `Your plan measures toward ${c.name}: ${c.roleSummary}`;
}

export function entryDisplay(c: Career): string {
  return ENTRY[c.id] ?? `${c.entryPath}.`;
}

/** "STEM (any)" → "STEM · open to any strand", "STEM/ABM" → "STEM · ABM" (m3 row rule) */
export function strandDisplay(c: Career): string {
  return c.strands
    .map((s) => s.replace(/\s*\/\s*/g, " · ").replace(/\s*\(any\)/, " · open to any strand"))
    .join(" · ");
}

/** strip dev-notation parentheticals for compact badges: "Git (version control)" → "Git" */
export function shortSkill(name: string): string {
  return name.replace(/\s*\(.*\)$/, "");
}

/** prototype re-assessment screen wording (catalog-canonical names as keys) */
const REASSESS_WHAT: Record<string, string> = {
  Spreadsheets: "Formulas, sorting, pivot tables",
  SQL: "asking questions of a database",
  "Data cleaning": "Fixing missing or messy entries",
  "Dashboards (Power BI)": "Charts that update from the data",
  "Basic statistics": "Averages, spread, correlation",
  "Chart interpretation": "Reading what a chart actually says",
  "Report writing": "Turning findings into a short, clear document",
};

export function reassessWhat(skill: string, fallback: string): string {
  return REASSESS_WHAT[skill] ?? fallback;
}

/** prototype display names where they differ from the catalog-canonical claim name */
const DISPLAY: Record<string, string> = {
  "Dashboards (Power BI)": "Dashboards (Power BI/Tableau)",
};

export function reassessDisplay(name: string): string {
  return DISPLAY[name] ?? name;
}
