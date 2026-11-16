/** Domain types — The canon is `features/content/_fixture-math.md`. **/

export type BarSource =
  | "verified" // ·✓ login-verified MCQ (transfers across career switches)
  | "checked" // ✓✓ comprehension-checked resource completion
  | "claimed"; // self-report only (flagged; never counts toward skills-match)

/**
 * The takeability fact behind a resource's front door (2026-11-03 audit
 * rulings — "free" can no longer do three jobs):
 *   direct    — open URL, learn, no gate
 *   account   — free with a (free) signup
 *   exam-paid — content free to study; the credit itself is a paid exam
 *   paidUni   — costs pesos (never holds the suggested slot)
 * The picker's self-serve gate is direct/account/exam-paid — paidUni never
 * wins, so a paid suggestion can never masquerade as a path in.
 */
export type AccessState = "direct" | "account" | "exam-paid" | "paidUni";

/** ES carrier — the step-③ competency assessment's per-competency result
 *  (7 NACE competencies, E&I excluded by recorded choice; ADR 0002). */
export type CompetencyStatus = "verified" | "claimed";

/**
 * The competency instrument's LATEST FULL ATTEMPT (42 items: 28 Likert +
 * 14 verification MCQs — lib/fixtures/instrument.ts, user-approved content
 * bank). The carrier sits beside `competencies` (engines read `competencies`
 * only); every full attempt OVERWRITES it — the state shows the current
 * assessment, never history ("Retake: latest attempt counts", Round 7 lock).
 * MCQ answers persist server-graded — a failed retake recomputes the whole
 * `competencies` map and can drop a verified competency (intended).
 */
export interface CompetencyAttempt {
  /** attempt completion stamp (demo-day date format "2026-10-17 09:31") */
  takenAt: string;
  /** statement id (COM-x.y) → rating 1–5 */
  likert: Record<string, number>;
  /** MCQ id (COM-x.Mn) → chosen option index (graded against the bank key) */
  mcq: Record<string, number>;
  /** the grade this attempt produced — mirrors `competencies` at this moment */
  competencies: Record<string, CompetencyStatus>;
}

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
  | "presence-stamped" // ticket 12: the machine-verified presence declaration (Profile → Credentials)
  | "scored";

export interface DemoEvent {
  date: string;
  kind: DemoEventKind;
  detail: string;
  source?: BarSource;
}

/**
 * Professional Presence (ticket 12, ADR 0002 amendment 2) — the declared
 * LinkedIn + professional contact email living in Profile → Credentials as
 * the FOURTH credential kind, distinguished from counselor-audited kinds by
 * its stamp: machine-verified (automatic, timestamped). Look-up is offline by
 * recorded ruling — the stamp grades what's deterministic without the network
 * (URL shape · email format) and the timestamp is what the offline demo
 * presents. Carrier is the state blob (JsonStore fallback included; engines
 * and fixtures stay offline-deterministic).
 */
export interface PresenceDeclaration {
  linkedinUrl: string;
  email: string;
  declaredAt: string;
  /** machine-verified, timestamped — see lib/engines/air.ts (stampPresence) */
  stamp: PresenceStamp;
}

export interface PresenceStamp {
  verifiedAt: string;
  checks: {
    linkedinUrlFormat: "pass" | "fail";
    professionalEmailFormat: "pass" | "fail";
  };
  /** honest sub-result: private account → "resolves, content not machine-verifiable" */
  contentNote?: string;
  /** no network look-up ran — the offline venue presents the stamp */
  offline: boolean;
}

export interface StudentState {
  id: string;
  name: string;
  /** live year-level print ("4th Year") — college scope, ACCOUNT-tab consistent
   *  (profiles.year_level); SHS-era `grade: "G11"` was swept 2026-10-30. */
  yearLevel: string;
  /** the student's college track — a TRACKS key from lib/fixtures/catalog.ts
   *  ("it" · "business" · "accounting" · "office"); "" = undecided. Print sites
   *  map it through TRACK_LABELS (SHS-era `strand` was swept 2026-10-30). */
  track: string;
  /** null = undecided (cold start) */
  careerId: string | null;
  /** closed gap bars for the current career's skill map, keyed by skill name */
  bars: Record<string, { source: BarSource }>;
  /** career-agnostic record of PROVEN bars earned in ANY role (verified ·✓ /
   *  checked ✓✓) — merges back into `bars` at re-assessment for whatever sits
   *  on the active map, so switching roles never loses proven skills.
   *  claimed bars never land here (self-ratings are per-role baselines). */
  provenArchive?: Record<string, { source: "verified" | "checked" }>;
  /** ES carrier: assessment result per NACE competency name (absent key /
   *  absent field = that competency has no assessment result yet). */
  competencies?: Record<string, CompetencyStatus>;
  /** the instrument's latest full attempt (retakes overwrite — latest counts) */
  assessment?: CompetencyAttempt;
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
  /** AR's presence factor (3 of 15): the declared entry; absent = not declared yet */
  presence?: PresenceDeclaration;
  /** the funnel-complete marker (2026-11-06): true once the onboarding goal
   *  step is SET or SKIPPED — signin routing's dashboard gate keys on this
   *  flag, never on the career pick or an assessment attempt alone. */
  onboarded?: boolean;
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
  /** authored one-suggestion flag (user ruling 2026-11-02): exactly one
   *  resource per skill should carry `pick: true`; the pathway's pick rule
   *  honors the flag FIRST and falls back to the computed order
   *  (free tier → fewer hours → provider) until flags exist */
  pick?: boolean;
  skillsAddressed: string[];
  /* ── the suggestion-audit layer (2026-11-03 rulings) ──
   * access: the takeability fact ("free" can no longer do three jobs).
   *   direct    — open URL, learn, no gate
   *   account   — free with a (free) signup
   *   exam-paid — content free to study; the credit itself is a paid exam
   *   paidUni   — costs pesos (never holds the suggested slot)
   * form: content-shape gate (taught-only catalog ruling).
   *   taught    — the URL opens teachable content
   *   reference — readable material, no teaching flow
   *   landing   — admin/index/search/marketing page: no learnable content
   * Rows WITHOUT these fields are UNVETTED: the walk renders the honest
   * "audit pending" wait-state for their skills, never a pretend pick.
   * learnNotes: the per-claim learn line ("why this teaches this skill"),
   * keyed by skill name — authored content, user-edited (spec §6). */
  access?: AccessState;
  form?: "taught" | "reference" | "landing";
  learnNotes?: Record<string, string>;
  creditingBody?: string;
  countsTowardEntryPath?: boolean;
  careerId: string;
}

export interface CheckQuestion {
  stem: string;
  options: string[];
  answer: number; // index into options
}
