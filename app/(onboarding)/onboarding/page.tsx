import type { Metadata } from "next";
import Onboarding from "./Onboarding";
import { requireStudent } from "@/lib/session";
import { getStudentView } from "@/lib/db";
import "./onboarding.css";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Getting started — Baseline",
  description:
    "Five short steps: your background, your career, your skills, a competency check, one goal and a computed starting score.",
};

/** Onboarding ①–⑤ — markup from prototype/onboarding.html, copy from features/content/onboarding.md.
 *  Gated like every (app) page — this one HAD no session gate (audit 2026-11-02).
 *  `?step=assessIntro` opens the NACE retake mode (2026-11-04 hub round): an
 *  already-onboarded student (a picked career is the onboarding-complete
 *  marker) resumes straight at the instrument, and its results return to
 *  /assessments. Anyone without a career yet keeps the first-run flow.
 *  The funnel rework (2026-11-06) threads the signed-in identity down so
 *  every POST keys the actual signed-in student and the local draft's
 *  autosave is per-student (`lib/onboarding-draft.ts`). */
export default async function OnboardingPage({
  searchParams,
}: {
  searchParams: Promise<{ step?: string }>;
}) {
  const profile = await requireStudent();
  const { step } = await searchParams;
  const { state } = await getStudentView(profile.studentId);
  const retake = step === "assessIntro" && state.careerId !== null;
  return <Onboarding retake={retake} studentId={profile.studentId} program={profile.program} />;
}
