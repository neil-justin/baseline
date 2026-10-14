import type { Metadata } from "next";
import Onboarding from "./Onboarding";
import "./onboarding.css";

export const metadata: Metadata = {
  title: "Getting started — Career Readiness",
  description:
    "Five short steps: your strand, your career, a baseline, one goal, one computed starting score.",
};

/** Onboarding ①–⑤ — markup from prototype/onboarding.html, copy from features/content/onboarding.md. */
export default function OnboardingPage() {
  return <Onboarding />;
}
