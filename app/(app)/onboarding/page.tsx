import type { Metadata } from "next";
import Onboarding from "./Onboarding";
import { requireStudent } from "@/lib/session";
import "./onboarding.css";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Getting started — Career Readiness",
  description:
    "Five short steps: your track, your career, a baseline, one goal, one computed starting score.",
};

/** Onboarding ①–⑤ — markup from prototype/onboarding.html, copy from features/content/onboarding.md.
 *  Gated like every (app) page — this one HAD no session gate (audit 2026-11-02). */
export default async function OnboardingPage() {
  await requireStudent();
  return <Onboarding />;
}
