/**
 * canon.ts — the CANONICAL path model (post-defense rethink, user-ruled
 * 2026-11-03: "My Plan is not a gap report" — the page shows ONE FIXED path
 * per career (the entire role skill map) and the student's
 * evidence state overlays it; the path never re-sorts).This module is the
 * mock seam: three content-structure variants share one canonical builder,
 * all spine-formatted by the d-variant components.
 *
 * Placement rules are DETERMINISTIC from catalog facts — §3 of the design
 * doc, the O*NET-as-law ruling (user-ruled 2026-11-03, "O*NET everything —
 * Option 1"): required = THE ENTIRE ROLE SKILL MAP for every career; the
 * "regulated = TESDA/PSF sourceTag" gate is retired. `sourceTag` demotes
 * to provenance metadata (stays on rows/props — no data changes, no
 * renames). The TESDA/PSF facts remain relevant only through resources
 * (creditingBody, NC-type proof → the gate/entry milestones).
 * Copy is DRAFT (collaboration rule — non-authoritative until the user
 * signs off the frame wording).
 */
import type { PlanRow, PlanTab, ResourcesTab } from "../PathwayTabs";
import { pickSuggestion } from "./suggest";
import type { AccessState } from "./access";

/** the catalog facts the canonical builders need (page.tsx projects these) */
export interface Spec {
  name: string;
  tier: "core" | "secondary";
  sourceTag: string;
}

/** one node on the canonical walk — a skill checkpoint or a milestone */
export interface PathNode {
  /** skill name, or the milestone's resource id */
  id: string;
  kind: "skill" | "gate" | "entry";
  label: string;
  what: string | null;
  sourceTag: string | null;
  tier: Spec["tier"] | null;
  /** O*NET-as-law (2026-11-03): true on EVERY skill node — required =
      the whole role map; there is no recommended/optional concept to be
      false on. Gate milestones keep required = kind === "gate"; entry
      milestones stay false. */
  required: boolean;
  /** solid vs quiet lane treatment: core-tier within its own section */
  emphasis: boolean;
  /** OVERLAY state from the engine — read-only, never user-tickable */
  state: PlanRow["kind"];
  /** SP projection slot (open rows); null on closed */
  effect: PlanRow["effect"];
  /** the ONE suggested resource pointer (null on closed rows, honest line) */
  suggestion: PlanRow["suggestion"];
  hasCheck: boolean;
  noCheck: boolean;
  /** the canonical walk's pointer = the FIRST OPEN node (overlay: engine
      closure decides it, not a queue) */
  startHere: boolean;
  /* gate/entry milestones only */
  /** covered skills (floor skill names this proof certifies) */
  covers: string[];
  /** verified catalog url (null → plain text) */
  url: string | null;
  /** provider · cost · time receipt line (typed catalog, verbatim data) */
  meta: string | null;
  /* the RETHOUGHT pick's student-facing shape (mock realm — user ruling:
     the audit lane doesn't render): the authored per-claim learn line,
     plus the access state folded into the meta registers */
  learn: string | null;
  access: AccessState | null;
  /** claims that exist but aren't vetted (audit pending) — the honest
      wait-state distinguishes this from no-coverage */
  unvetted: number;
}

/** the canonical path's regions — fixed per career, fixed names (draft) */
export type SectionId = "floor" | "gate" | "recommended" | "optional" | "entry";

export interface CanonSection {
  id: SectionId;
  title: string;
  blurb: string;
  nodes: PathNode[];
  /** closed skill checkpoints (milestones never count) */
  closed: number;
  /** total skill checkpoints (0 on gate/entry) */
  total: number;
}

/* === canonical section copy — DRAFT, user-reviews before any real wave ===
   O*NET-as-law register (§3, user-ruled 2026-11-03): the floor IS the whole
   map; recommended/optional are retired as placement concepts but their
   section shape stays (the d1/d3 sibling variants and CanonProps keep
   compiling — D2 reads only the floor). */
const SECTION_COPY: Record<SectionId, { title: string; blurb: string }> = {
  floor: {
    title: "The Floor",
    blurb: "The whole role skill map — every skill this role requires, whatever its provenance. Every node here is required.",
  },
  gate: {
    title: "Get your proof",
    blurb: "The certification milestones that verify the floor — what an employer can check.",
  },
  recommended: {
    title: "Recommended by industry",
    blurb: "Retired section (O*NET-as-law, 2026-11-03): placement no longer splits by source — the whole map sits on the floor. Always empty.",
  },
  optional: {
    title: "Optional breadth",
    blurb: "Retired section (O*NET-as-law, 2026-11-03): there is no non-required tier of skills. Always empty.",
  },
  entry: {
    title: "Enter the role",
    blurb: "Route milestones — materials that count toward the entry path the engines already track.",
  },
};

/** d3 only — units of competence (syllabus reading of the floor). Authored
 *  for the demo role `da` (Data Analyst junior, PSF-AAI) as DRAFT clusters;
 *  any floor skill the authoring doesn't name falls to a fallback unit. */
const UNITS_DA: { title: string; blurb: string; skills: string[] }[] = [
  {
    title: "Unit 1 · Read the business need",
    blurb: "Nail the question before touching data.",
    skills: ["Business Needs Analysis", "Data Analytics"],
  },
  {
    title: "Unit 2 · Build the data spine",
    blurb: "Gather, clean, assemble — keep records trustworthy.",
    skills: ["ETL (extract-transform-load workflows)", "Data Engineering", "Applications Development"],
  },
  {
    title: "Unit 3 · Show the answer",
    blurb: "The dashboard or visual that makes the finding land.",
    skills: ["Data Visualization and Storytelling"],
  },
  {
    title: "Unit 4 · Work by the book",
    blurb: "Legal, governance and quality guardrails on every deliverable.",
    skills: [
      "Artificial Intelligence Ethics and Governance",
      "Data Ethics",
      "Cyber and Data Breach Incident Management",
      "Software Testing",
      "Configuration Tracking",
    ],
  },
  {
    title: "Unit 5 · Work with people",
    blurb: "Stakeholders, teams and the enabling skills the framework prints.",
    skills: [
      "Stakeholder Management",
      "Enabling Skills & Competencies (ESC) — Collaboration, Communication, Digital Fluency, Learning Agility",
    ],
  },
];

const FALLBACK_UNIT = {
  title: "Role competencies",
  blurb: "The floor's full required set — the whole role map, in framework order.",
};

export interface CanonUnit {
  title: string;
  blurb: string;
  nodes: PathNode[];
  closed: number;
  total: number;
}

/** the props every d-variant consumes */
export interface CanonProps {
  closedCount: number;
  totalSkills: number;
  /** count of map skill rows that resolve to NO canonical node (honest
      accounting line; null when 0) */
  offPathNote: string | null;
  sections: CanonSection[];
  units: CanonUnit[];
}

export function buildCanon(specs: Spec[], plan: PlanTab, resources: ResourcesTab): CanonProps {
  const rows = plan.rows;
  const rowBySkill = new Map(rows.map((r) => [r.skill, r] as const));

  const skillNode = (spec: Spec): PathNode | null => {
    const row = rowBySkill.get(spec.name);
    if (!row) return null;
    /* the RETHOUGHT pick (user rulings 2026-11-03: satisfaction tiers +
       self-serve + taught-form eligibility): the engine's per-row pointer
       is overridden by mockup/suggest.ts — the canonical walk shows the
       result for EVERY row (user rule: closed skills still carry a
       suggested resource) */
    /* the RETHOUGHT pick (mockup/suggest.ts): runs for EVERY row — user
       rule — closed skills still carry a suggested resource */
    const pick = pickSuggestion(spec.name, resources.rows);
    return {
      id: spec.name,
      kind: "skill",
      label: spec.name,
      what: row.what,
      sourceTag: spec.sourceTag,
      tier: spec.tier,
      /** O*NET-as-law (2026-11-03): every skill on the map is required —
          required = the whole role map; sourceTag rides along as provenance
          metadata only */
      required: true,
      emphasis: spec.tier === "core",
      state: row.kind,
      effect: row.effect,
      suggestion: pick.suggestion,
      hasCheck: row.hasCheck,
      noCheck: row.noCheck,
      startHere: false,
      covers: [],
      url: null,
      meta: null,
      learn: pick.learn,
      access: pick.access,
      unvetted: pick.unvetted,
    };
  };

  const milestoneNode = (kind: "gate" | "entry") => (id: string, covers: string[]): PathNode | null => {
    /* typed-catalog receipts reused from the page's own build (ResRow rows)
       — the canonical model never recomputes costs/times */
    const urlCache = new Map(resources.rows.map((r) => [r.title, r.url] as const));
    const metaCache = new Map(
      resources.rows.map(
        (r) => [r.title, [r.provider, r.type, r.cost, r.time].join(" · ")] as const
      )
    );
    const covered = covers.filter((s) => rowBySkill.has(s));
    return {
      id: `${kind}:${id}`,
      kind,
      label: id,
      what: null,
      sourceTag: null,
      tier: null,
      required: kind === "gate",
      emphasis: false,
      state: "open",
      effect: null,
      suggestion: null,
      hasCheck: false,
      noCheck: false,
      startHere: false,
      covers: covered,
      url: urlCache.get(id) ?? null,
      meta: metaCache.get(id) ?? null,
      learn: null,
      access: null,
      unvetted: 0,
    };
  };

  /* the ORDER LAW as re-ruled (§3 O*NET-as-law, 2026-11-03): ONE bucket —
     the whole role map IS the floor; core before secondary, stable catalog
     order otherwise (framework-document order carries the day). The old
     regulated/unregulated split is retired; recommended/optional sections
     emit EMPTY (shape kept for the sibling variants' contract). */
  const order = (list: Spec[], key: (s: Spec) => boolean) =>
    list
      .map((s, i) => ({ s, i }))
      .sort((a, b) =>
        key(a.s) === key(b.s) ? a.i - b.i : key(a.s) ? -1 : 1
      )
      .map(({ s }) => s);

  const floorSpecs = order(specs, (s) => s.tier === "core");

  const floorNodes = floorSpecs.map(skillNode).filter((n): n is PathNode => n !== null);

  const gateNodes = resources.rows
    .filter((r) => /(^|\b)(cert|nc)\b/i.test(r.type) && r.feeds.length > 0)
    .map((r) =>
      milestoneNode("gate")(r.title, r.feeds.map((f) => f.skill))
    )
    .filter((n): n is PathNode => n !== null);

  const gateTitles = new Set(resources.rows.filter((r) => /(^|\b)(cert|nc)\b/i.test(r.type)).map((r) => r.title));
  const entryNodes = resources.rows
    .filter((r) => r.route && !gateTitles.has(r.title))
    .map((r) => milestoneNode("entry")(r.title, r.feeds.map((f) => f.skill)))
    .filter((n): n is PathNode => n !== null);

  const count = (nodes: PathNode[]) => {
    const skills = nodes.filter((n) => n.kind === "skill");
    return { closed: skills.filter((n) => n.state !== "open").length, total: skills.length };
  };

  /* THE CANONICAL POINTER: the first open skill node in walk order
     (the floor IS the whole map — the retired sections are empty) —
     engine closure moves it */
  for (const n of floorNodes) {
    if (n.state === "open") {
      n.startHere = true;
      break;
    }
  }

  const sections: CanonSection[] = (
    [
      { id: "floor" as SectionId, nodes: floorNodes },
      { id: "gate" as SectionId, nodes: gateNodes },
      /* retired sections (O*NET-as-law, 2026-11-03): emitted EMPTY — the
         shape stays so the d1/d3 sibling variants and CanonProps compile */
      { id: "recommended" as SectionId, nodes: [] as PathNode[] },
      { id: "optional" as SectionId, nodes: [] as PathNode[] },
      { id: "entry" as SectionId, nodes: entryNodes },
    ] as const
  ).map(({ id, nodes }) => ({
    id,
    ...SECTION_COPY[id],
    nodes,
    ...count(nodes),
  }));

  /* units (d3): the authored da clusters, else the whole floor as one unit */
  const byName = new Map(floorNodes.map((n) => [n.label, n] as const));
  let units: CanonUnit[] = [];
  if (floorNodes.length > 0) {
    const used = new Set<string>();
    if (UNITS_DA.some((u) => u.skills.some((s) => byName.has(s)))) {
      units = UNITS_DA.map((u) => {
        const nodes = u.skills
          .map((s) => byName.get(s))
          .filter((n): n is PathNode => n !== undefined);
        nodes.forEach((n) => used.add(n.label));
        return { title: u.title, blurb: u.blurb, nodes, ...count(nodes) };
      });
      const rest = floorNodes.filter((n) => !used.has(n.label));
      if (rest.length > 0) {
        units.push({ title: FALLBACK_UNIT.title, blurb: FALLBACK_UNIT.blurb, nodes: rest, ...count(rest) });
      }
    } else {
      units = [
        { title: FALLBACK_UNIT.title, blurb: FALLBACK_UNIT.blurb, nodes: floorNodes, ...count(floorNodes) },
      ];
    }
  }

  const totalSkills = sections.reduce((n, s) => n + s.total, 0);
  const closedCount = sections.reduce((n, s) => n + s.closed, 0);
  const offPath = specs.length - rowBySkill.size;
  return {
    closedCount,
    totalSkills,
    offPathNote: offPath > 0 ? `${offPath} skill rows on the map are not resolvable to canonical nodes` : null,
    sections,
    units,
  };
}
