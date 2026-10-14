/** Domain types — The canon is `features/content/_fixture-math.md`. **/

export type BarSource =
  | "verified" // ·✓ login-verified MCQ (transfers across career switches)
  | "checked" // ✓✓ comprehension-checked resource completion
  | "claimed"; // self-report only (flagged; never counts toward skills-match)

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

export interface DemoEvent {
  date: string;
  kind: "check-passed" | "bar-closed" | "goal-completed" | "goal-set" | "career-switched" | "scored";
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
  goals: Goal[];
  /** locked TP basis: snapshot of stage-① ranked queue at the last re-rank;
   *  a member closing increments stageOneDone (reset on switch/re-assessment) */
  stageOneDone: number;
  /** M8-lite framing prompt (Teamwork/Communication/Problem-solving) — unscored */
  softSkills: Record<string, string>;
  decisions: {
    verifiedTransferred: string[]; // skills whose ·✓ transferred across a switch
  };
  events: DemoEvent[];
}

export interface SkillSpec {
  name: string;
  tier: "core" | "secondary";
  what: string; // one-line student-facing "what it means"
}

export interface Career {
  id: string;
  name: string;
  strands: string[];
  /** RIASEC code — DEV-FACING ONLY, never rendered (conventions) */
  raCode: string;
  roleSummary: string;
  entryPath: string;
  skills: SkillSpec[];
  /** degree route leads stage ③ with subject/portfolio; TVL routes with NC */
  route: "degree" | "tvl";
  watch?: boolean; // LLM-adjacency — dev-facing only
}

export type ResourceType = "course" | "cert" | "NC" | "doc";

export interface Resource {
  id: string;
  title: string;
  provider: string;
  type: ResourceType;
  cost: "free" | { peso: number };
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
