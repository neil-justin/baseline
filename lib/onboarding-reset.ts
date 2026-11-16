import type { StudentState } from "@/lib/types";
import { newStudentState } from "@/lib/session";

/**
 * Onboarding reset — the pure wipe behind POST /api/onboarding/reset.
 *
 * Wipe semantics = a FULL FRESH state, byte-for-byte the shape
 * lib/session.ts newStudentState produces (imported here — no drift):
 * careerId null, track "", bars {}, softSkills {}, goals [], stageOneDone 0,
 * stageOneQueue [] (requeued/canonical — see below), decisions cleared,
 * events [], competencies {} (as newStudentState produces — no ninth-place
 * drift), and the optional carriers simply ABSENT: provenArchive, the
 * assessment attempt, presence — engines read those as "nothing measured". A fresh
 * student's canonical "starter queue" is the EMPTY stageOneQueue: it only
 * fills on career pick (actions.ts requeueStageOne needs a Career to rank
 * from; careerId is null here, so the queue is [] by construction — exactly
 * what a new student gets).
 *
 * SCOPE GUARD (irreversible, so written down): this reset touches ONLY the
 * onboarding draft in student_state. It does NOT touch:
 *   - credentials declarations / presence credential rows (Profile →
 *     Credentials facts, not onboarding draft)
 *   - resume_runs / letter_runs (/profile-scoped run artifacts)
 *   - the Supabase profile or auth user (account delete owns that cascade)
 */

export function resetOnboardingState(id: string, fullName: string): StudentState {
  // no drift: newStudentState is the single source of the fresh shape —
  // every optional carrier (provenArchive · competencies · assessment ·
  // presence · stageOneQueue) is simply absent, the same "nothing measured"
  // reading engines and the AR give a brand-new student.
  return newStudentState(id, fullName) as StudentState;
}
