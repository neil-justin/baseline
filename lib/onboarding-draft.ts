/**
 * Onboarding local draft — the autosave layer behind the funnel rework
 * (2026-11-06). EVERY onboarding step writes a draft so an interrupted
 * sitting re-enters at the last step with its state restored.
 *
 * One JSON record per student under `onboarding-draft:v1:{studentId}`.
 * All functions are JSON-strict and guarded try/catch — a private-mode
 * browser or a full quota degrades to "no draft" and the funnel simply
 * runs without persistence; nothing crashes.
 *
 * Schema v2 (2026-11-06, one-card assessment cadence): the Assess step
 * autosave swaps `nacePage` (one competency per page) for `naceCard` — the
 * running index in the flat 42-card cadence. `naceLikert`/`naceMcq` keep
 * the same item-keyed shape across both versions, so a legacy v1 draft is
 * still readable: loadDraft accepts version 1 as a legacy read and the
 * restore re-derives the running card from the first unanswered item (a
 * v1 draft carries no card index — its page number has no analogue, so
 * the originals' page marker is simply dropped; answers survive.)
 */

export type DraftStep =
  | "strand"
  | "program"
  | "branch"
  | "careers"
  | "quiz"
  | "cards"
  | "verify"
  | "assessIntro"
  | "nace"
  | "assessResult"
  | "goal"
  | "reveal";

/** Schema v2 — every field optional except the identity + step + stamp.
 *  Version 1 is read back for legacy only (see the header note on v2). */
export interface OnboardingDraft {
  version: 1 | 2;
  studentId: string;
  /** the screen to resume at (validated against the screen graph on restore) */
  step: DraftStep;
  /** ISO stamp the banner prints ("Progress from {date} restored") */
  savedAt: string;
  /** Background step (①a track pick, ①b program pick) */
  track?: string;
  program?: string;
  /** Career step */
  careerId?: string;
  /** RIASEC answers: itemId → 1..5 (lib/fixtures/interest.ts item ids) */
  interest?: Record<string, number>;
  /** Skills step: one pick per drawn QuestionCard slot (null = unanswered) */
  vPicks?: (number | null)[];
  vIndex?: number;
  /** Assess step: the one-card cadence — running card index (0..41),
   *  schema v2 (legacy v1 drafted `nacePage`, dropped on read). */
  naceCard?: number;
  naceLikert?: Record<string, number>;
  naceMcq?: Record<string, number>;
}

export type OnboardingDraftPatch = Partial<Omit<OnboardingDraft, "version" | "studentId" | "savedAt">> & {
  step?: DraftStep;
};

const keyOf = (studentId: string) => `onboarding-draft:v1:${studentId}`;

export function loadDraft(studentId: string): OnboardingDraft | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(keyOf(studentId));
    if (!raw) return null;
    const d = JSON.parse(raw) as OnboardingDraft;
    if ((d?.version !== 1 && d?.version !== 2) || d.studentId !== studentId) return null;
    return d;
  } catch {
    return null;
  }
}

/** Shallow merge of `patch` onto the stored draft (creating it as needed). */
export function saveDraft(studentId: string, patch: OnboardingDraftPatch): void {
  if (typeof window === "undefined") return;
  try {
    const prev = loadDraft(studentId);
    const next: OnboardingDraft = {
      version: 2,
      studentId,
      ...prev,
      ...patch,
      step: patch.step ?? prev?.step ?? "strand",
      savedAt: new Date().toISOString(),
    };
    window.localStorage.setItem(keyOf(studentId), JSON.stringify(next));
  } catch {
    /* localStorage unavailable or full — the funnel keeps working unpersisted */
  }
}

export function clearDraft(studentId: string): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.removeItem(keyOf(studentId));
  } catch {
    /* nothing to do — absence is the same outcome */
  }
}
