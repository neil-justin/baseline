/** Domain types — The canon is `features/content/_fixture-math.md`. **/

export type BarSource =
  | "verified" // ·✓ login-verified MCQ (transfers across career switches)
  | "checked" // ✓✓ comprehension-checked resource completion
  | "claimed"; // self-report only (flagged; never counts toward skills-match)

/** ES carrier — the step-③ competency assessment's per-competency result
 *  (7 NACE competencies, E&I excluded by recorded choice; ADR 0002). */
export type CompetencyStatus = "verified" | "claimed";

export type GoalType = "training" | "milestone";
export type GoalStatus = "active" | "completed";

export interface Goal {
  id: string;
  title: string;
  type: GoalType;
  status: GoalStatus;
  /** training goals link a resource; auto-complete when its check passes */
  resourceId?: string;
  skill?: string;
  completedAt?: string;
}

export type DemoEventKind =
  | "check-passed"
  | "check-failed"
  | "bar-closed"
  | "goal-completed"
  | "goal-set"
  | "career-switched"
  | "scored";

export interface DemoEvent {
  date: string;
  kind: DemoEventKind;
  detail: string;
  source?: BarSource;
}

export interface StudentState {
  id: string;
  name: string;
  grade: string;
  strand: string;
  /** null = undecided (cold start) */
  careerId: string | null;
  /** closed gap bars for the current career's skill map, keyed by skill name */
  bars: Record<string, { source: BarSource }>;
  /** ES carrier: assessment result per NACE competency name (absent key /
   *  absent field = that competency has no assessment result yet). */
  competencies?: Record<string, CompetencyStatus>;
  goals: Goal[];
  /** locked TP basis: snapshot of stage-① ranked queue at the last re-rank;
   *  a member closing increments stageOneDone (reset on switch/re-assessment) */
  stageOneDone: number;
  /** ranked stage-① queue at the last re-rank (3 slots; refills from stage ②) */
  stageOneQueue?: string[];
  /** M8-lite framing prompt (Teamwork/Communication/Problem-solving) — unscored */
  softSkills: Record<string, string>;
  decisions: {
    verifiedTransferred: string[]; // skills whose ·✓ transferred across a switch
  };
  events: DemoEvent[];
}

/**
 * SkillSpec — one row of a source artifact's skill table, transcribed verbatim
 * (catalog-roster-dole-ble.md round). `sourceTag` names the framework artifact
 * the row came from; when a source row bundles several skills (the PSF
 * "Enabling Skills" lines), the row's name keeps the bundle verbatim.
 */
export interface SkillSpec {
  name: string;
  tier: "core" | "secondary";
  /** framework artifact the row is transcribed from (PSOC = unit-group text) */
  sourceTag: "PSF" | "TESDA" | "O*NET" | "ESCO" | "NACE" | "PSOC";
  what: string; // one-line student-facing "what it means"
}

/** The four college tracks (browse keys). */
export type CareerTrack = "it" | "business" | "accounting" | "office";

/**
 * College-scope Career (round 9 type reshape). One PSOC-anchored entry-level
 * role; `demandBlock` carries the DOLE-BLE JobsFit citation; extensions E1–E4
 * carry `institutional-judgment` (never DOLE-BLE demand).
 */
export interface Career {
  id: string;
  name: string;
  /** PSOC 2012 unit-group code (as updated 2022) */
  psocCode: string;
  psocTitle: string;
  track: CareerTrack;
  /** CHED canon majors (ched-major-lists.md round) */
  degreeMap: string[];
  /** one line — the common way fresh graduates enter this role */
  entryRoute: string;
  demandBlock: {
    status: "in-demand" | "hard-to-fill" | "institutional-judgment";
    /** JobsFit LMI 2013–2020 entry number / label, or the extension label */
    source: string;
    note: string;
  };
  roleSummary: string;
  skills: SkillSpec[];
}

export type ResourceType = "course" | "cert" | "NC" | "doc";

export interface Resource {
  id: string;
  title: string;
  provider: string;
  type: ResourceType;
  cost: "free" | { peso: number };
  /** verified live URL of the real (free) resource this row points to */
  url?: string;
  durationHours: number;
  skillsAddressed: string[];
  creditingBody?: string;
  countsTowardEntryPath?: boolean;
  careerId: string;
}

export interface CheckQuestion {
  stem: string;
  options: string[];
  answer: number; // index into options
}
