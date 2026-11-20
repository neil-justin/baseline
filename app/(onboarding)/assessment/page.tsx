import type { Metadata } from "next";
import { redirect } from "next/navigation";
import AssessSitting from "./AssessSitting";
import { requireStudent } from "@/lib/session";
import { getStudentView } from "@/lib/db";
import { fmtEventDate } from "@/lib/fmt";
import "../onboarding/onboarding.css";
import "./assessment.css";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Competency assessment — Baseline",
  description:
    "The NACE competency instrument: seven core workplace competencies, self-rated then verified by short checks. Your latest attempt always counts.",
};

/**
 * /assessment — the standalone NACE retake instrument (the /verify pattern,
 * 2026-11-18 user round: Role-based skill verification already runs its
 * retake on a focused screen; the competency instrument now does the
 * same instead of dropping a signed-in student back into the onboarding
 * funnel). The (onboarding) group's chrome gives it the bare header.
 *
 * Honesty gate (mirrors /verify's redirect-on-invalid-state): a student
 * who hasn't picked a career yet belongs in the funnel — the first-run
 * sitting lives inside onboarding ①–⑤. Writes: none here — ONE
 * POST /api/assessment at sitting end (latest attempt counts).
 *
 * The confirm-guard (phase 2, 2026-11-20): the page hands the sitting the
 * student's CURRENT recorded standing (engine truth — the competencies map
 * and the attempt stamp), so the first card shows "Your latest: n of 7
 * verified · date" with the replace line, and the final Finish control
 * names the replacement when an attempt exists. No modal — honest labels.
 */
export default async function AssessmentPage() {
  const profile = await requireStudent();
  const { state } = await getStudentView(profile.studentId);
  if (state.careerId === null) redirect("/onboarding");

  /* the confirm-guard's standing — the same verified count the hub's NACE
     card reads (the competencies map is the recorded grade; the attempt
     stamp is its date). No attempt → null → plain Finish. */
  const latest = state.assessment
    ? {
        verified: Object.values(state.competencies ?? {}).filter((c) => c === "verified").length,
        date: fmtEventDate(state.assessment.takenAt),
      }
    : null;

  return <AssessSitting latest={latest} />;
}
