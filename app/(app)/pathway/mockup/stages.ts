/**
 * Mockup stage model — post-defense Mini-LMS exploration (user-ruled
 * 2026-11-03, decisions: journey-phase slice, resources absorbed into the
 * path, evidence-state read-only + a "working-on" intent marker owned by
 * the variant components). THIS IS PROTOTYPE MAPPING, not a locked engine:
 * the assignment rules below are the deterministic prototype slice the
 * mockups render; the frame copy is draft, user-reviewed before any
 * implementation wave (collaboration rule — treat as non-authoritative).
 *
 * Frame = journey phases, shared per track (user-agreed shape): four stage
 * headings per track instead of 36 bespoke frames. Stage ① Foundations and
 * ② Core slice the ranked plan rows; ③ Credential and ④ Entry hold the
 * cert/NC-type and entry-route resources respectively (materials only).
 */
import type { PlanRow, PlanTab, ResRow, ResourcesTab } from "../PathwayTabs";
import type { Career } from "@/lib/types";

export type TrackId = Career["track"];

/** one skill checkpoint inside a stage card */
export interface StageItem {
  skill: string;
  /** canon "what it means" line (already authored in the catalog) */
  what: string;
  /** engine state — read-only; a tick NEVER writes here */
  state: PlanRow["kind"];
  /** SP projection slot (open rows); null on closed rows */
  effect: PlanRow["effect"];
  /** the ONE suggested resource pointer; null → honest no-resource line */
  suggestion: PlanRow["suggestion"];
  /** CHECK_SKILL join — platform check exists for this skill */
  hasCheck: boolean;
  /** open row with no platform check (§6.2 honest line) */
  noCheck: boolean;
  /** the path's "start here" pointer: the first ranked open item */
  startHere: boolean;
}

/** a material (resource card) inside a stage — the old Resources tab, folded in */
export interface StageMaterial {
  title: string;
  provider: string;
  url: string | null;
  type: string;
  cost: string;
  time: string;
  /** skills this resource covers (plain names — chips stay variant-owned) */
  covers: string[];
  route: string | null;
  /** engine-derived start-here flag (stage-① queue head's resource) */
  startHere: boolean;
}

export interface Stage {
  id: "found" | "core" | "cred" | "entry";
  title: string;
  blurb: string;
  /** skill checkpoints — empty on the credential/entry stages (draft shape) */
  items: StageItem[];
  materials: StageMaterial[];
  /** closed items of the stage's skill checkpoints (materials don't count) */
  closed: number;
  /** total skill checkpoints in the stage (0 on material-only stages) */
  total: number;
}

/** the props every variant component MUST accept (switcher contract) */
export interface MockupProps {
  careerName: string;
  stages: Stage[];
}

/** frame copy is DRAFT (collaboration rule): user reviews before any real wave */
const BLURBS = {
  found: "Start here — the basics the role assumes before anything else.",
  core: "The capabilities the role runs on day to day — the heart of the path.",
  cred: "Certifications and platform checks that turn learned skills into proof an employer can verify.",
  entry: "Entry-route resources and notes that turn a checked map into a first offer.",
} as const;

const TITLES: Record<TrackId | "generic", [string, string, string, string]> = {
  it: ["Foundations", "Core tools & practice", "Get certified", "Ready to hire"],
  business: ["Foundations", "Core business practice", "Get credentialed", "Ready to hire"],
  accounting: ["Foundations", "Core accounting skills", "Get credentialed", "Ready to hire"],
  office: ["Foundations", "Core office skills", "Get credentialed", "Ready to hire"],
  generic: ["Foundations", "Core skills of the job", "Get credentialed", "Ready to hire"],
};

const toMaterial = (r: ResRow): StageMaterial => ({
  title: r.title,
  provider: r.provider,
  url: r.url,
  type: r.type,
  cost: r.cost,
  time: r.time,
  covers: r.feeds.map((f) => f.skill),
  route: r.route,
  startHere: r.startHere,
});

/** suggested-first, then title — mirrors the old Suggested card's intent */
const sortMaterials = (a: StageMaterial, b: StageMaterial) =>
  a.startHere === b.startHere ? a.title.localeCompare(b.title) : a.startHere ? -1 : 1;

/**
 * The prototype slice (deterministic, documented for the mock):
 * ① Foundations takes the first slice of the ranked rows; ② Core the rest
 * (ranked order preserved — open rows lead, closed rows stay where the
 * catalog order leaves them darker). ③/④ hold cert/NC and entry-route
 * resources. Boundaries are shape-only prototype choices, not engine law.
 */
export function buildStages(plan: PlanTab, resources: ResourcesTab, track: string | null): Stage[] {
  const rows = plan.rows;
  if (rows.length === 0) return [];

  const titles = TITLES[(track as TrackId) ?? "generic"] ?? TITLES.generic;
  const splitIdx = rows.length <= 12 ? Math.max(3, Math.ceil(rows.length / 4)) : 6;
  const toItem = (r: PlanRow, startHere: boolean): StageItem => ({
    skill: r.skill,
    what: r.what,
    state: r.kind,
    effect: r.effect,
    suggestion: r.suggestion,
    hasCheck: r.hasCheck,
    noCheck: r.noCheck,
    startHere,
  });

  const foundItems = rows.slice(0, splitIdx).map((r) => toItem(r, false));
  const coreItems = rows.slice(splitIdx).map((r) => toItem(r, false));
  /* the path's pointer rides whichever stage holds the ranked head */
  if (rows[0]?.open) foundItems[0] = { ...foundItems[0], startHere: true };
  const firstOpen = rows.findIndex((r) => r.open);
  if (firstOpen >= splitIdx) {
    const at = firstOpen - splitIdx;
    coreItems[at] = { ...coreItems[at], startHere: true };
  }

  /* materials: cert/NC-type → ③, entry-route-but-not-cred → ④, everything
     else (course/doc) rides the stage holding its first covered skill */
  const cred = resources.rows.filter((r) => /(^|\b)(cert|nc)\b/i.test(r.type));
  const credSet = new Set(cred);
  const entry = resources.rows.filter((r) => r.route && !credSet.has(r));
  const foundSkills = new Set(rows.slice(0, splitIdx).map((r) => r.skill));
  const skillStage: Record<"found" | "core", StageMaterial[]> = { found: [], core: [] };
  for (const r of resources.rows) {
    if (credSet.has(r)) continue;
    const lead = r.feeds[0]?.skill;
    if (!lead) continue;
    (foundSkills.has(lead) ? skillStage.found : skillStage.core).push(toMaterial(r));
  }
  skillStage.found.sort(sortMaterials);
  skillStage.core.sort(sortMaterials);

  const count = (items: StageItem[]) => ({
    closed: items.filter((i) => i.state !== "open").length,
    total: items.length,
  });

  return [
    { id: "found", title: titles[0], blurb: BLURBS.found, items: foundItems, materials: skillStage.found, ...count(foundItems) },
    { id: "core", title: titles[1], blurb: BLURBS.core, items: coreItems, materials: skillStage.core, ...count(coreItems) },
    { id: "cred", title: titles[2], blurb: BLURBS.cred, items: [], materials: cred.map(toMaterial).sort(sortMaterials), closed: 0, total: 0 },
    { id: "entry", title: titles[3], blurb: BLURBS.entry, items: [], materials: entry.map(toMaterial).sort(sortMaterials), closed: 0, total: 0 },
  ];
}
