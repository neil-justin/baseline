import type { Metadata } from "next";
import Onboarding from "./Onboarding";
import { requireStudent } from "@/lib/session";
import { getStudentView } from "@/lib/db";
import "./onboarding.css";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Getting started — Baseline",
  description:
    "Five short steps: your track, your career, a baseline, one goal, one computed starting score.",
};

/** Onboarding ①–⑤ — markup from prototype/onboarding.html, copy from features/content/onboarding.md.
 *  Gated like every (app) page — this one HAD no session gate (audit 2026-11-02).
 *  `?step=assessIntro` opens the NACE retake mode (2026-11-04 hub round): an
 *  already-onboarded student (a picked career is the onboarding-complete
 *  marker) resumes straight at the instrument, and its results return to
 *  /assessments. Anyone without a career yet keeps the first-run flow. */
export default async function OnboardingPage({
  searchParams,
}: {
  searchParams: Promise<{ step?: string }>;
}) {
  const profile = await requireStudent();
  const { step } = await searchParams;
  const { state } = await getStudentView(profile.studentId);
  const retake = step === "assessIntro" && state.careerId !== null;
  return <Onboarding retake={retake} />;
}
