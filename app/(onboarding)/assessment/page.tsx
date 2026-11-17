import type { Metadata } from "next";
import { redirect } from "next/navigation";
import AssessSitting from "./AssessSitting";
import { requireStudent } from "@/lib/session";
import { getStudentView } from "@/lib/db";
import "../onboarding/onboarding.css";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Competency assessment — Baseline",
  description:
    "The NACE competency instrument: seven core workplace competencies, self-rated then verified by short checks. Your latest full sitting always counts.",
};

/**
 * /assessment — the standalone NACE retake sitting (the /verify pattern,
 * 2026-11-18 user round: Role-based skill verification already runs its
 * retake on a focused screen; the competency instrument now does the
 * same instead of dropping a signed-in student back into the onboarding
 * funnel). The (onboarding) group's chrome gives it the bare header.
 *
 * Honesty gate (mirrors /verify's redirect-on-invalid-state): a student
 * who hasn't picked a career yet belongs in the funnel — the first-run
 * sitting lives inside onboarding ①–⑤. Writes: none here — ONE
 * POST /api/assessment at sitting end (latest full sitting counts).
 */
export default async function AssessmentPage() {
  const profile = await requireStudent();
  const { state } = await getStudentView(profile.studentId);
  if (state.careerId === null) redirect("/onboarding");

  return <AssessSitting />;
}
