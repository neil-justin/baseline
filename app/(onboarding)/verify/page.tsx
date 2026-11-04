import type { Metadata } from "next";
import { redirect } from "next/navigation";
import VerifySitting from "./VerifySitting";
import { requireStudent } from "@/lib/session";
import { getStudentView } from "@/lib/db";
import type { VMCQ } from "@/app/(onboarding)/onboarding/banks";
import { SKILL_BANKS } from "@/lib/fixtures/skill-banks";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Skill verification — Baseline",
  description:
    "The retake sitting: confirm your self-reported skills, one short question each. A miss keeps the claim; a pass makes it verified.",
};

/**
 * /verify — the retake sitting (2026-11-04 ruling: a FOCUSED SCREEN —
 * the (onboarding) group's chrome gives it the bare header; the page adds
 * the back control to Assessments). The focused view shows the instrument
 * and nothing else.
 *
 * Content gate: a per-skill mode arrives as `?skill=<canonical name>` and
 * demands a banked CLAIMED row (an unclaimed skill has no route to a check
 * — the walk is how it earns a claim; the hub says so). The whole-battery
 * mode draws ≤5 banked questions across the claimed rows, the OB-3b way.
 * Writes: none here — POST /api/verify per answer under the session student
 * (a fail write is a no-op; the claim stays a claim).
 */
export default async function VerifyPage({
  searchParams,
}: {
  searchParams: Promise<{ skill?: string }>;
}) {
  const profile = await requireStudent();
  const { state, career } = await getStudentView(profile.studentId);
  if (!career) redirect("/assessments");

  const { skill } = await searchParams;
  const banked = new Map(SKILL_BANKS.map((q) => [q.catalogSkill, q]));

  let items: VMCQ[];
  if (skill) {
    const spec = career.skills.find((s) => s.name === skill);
    const quiz = banked.get(skill ?? "");
    if (!spec || state.bars[skill]?.source !== "claimed" || !quiz) {
      // the honest gates: an unbanked row and an unclaimed row both have no
      // verb here — /assessments carries the state that says so
      redirect("/assessments");
    }
    items = [quiz];
  } else {
    items = career.skills
      .filter((s) => state.bars[s.name]?.source === "claimed")
      .map((s) => banked.get(s.name))
      .filter((q): q is VMCQ => !!q)
      .slice(0, 5);
    if (items.length === 0) redirect("/assessments");
  }

  return <VerifySitting items={items} />;
}
