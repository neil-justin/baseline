import type { Career, StudentState } from "@/lib/types";
import { supabaseAdmin, supabaseEnv } from "@/lib/supabase/server";
import { RESOURCES } from "@/lib/fixtures/resources";

/**
 * The no-resume on-ramp's personalized list (Q7a): "what your resume must
 * contain to score" — derived ONLY from the student's own recorded state:
 *   - verified skills (·✓ / ✓✓ bars) → the Skills section they can already name;
 *   - the credentials table (`public.credentials`, service-role read) —
 *     internships/credits land there — TODO(catalog-round): the college-scope
 *     intake's internship answer feeds this list once that round ships; the
 *     table is the landing spot, the engine just reads it;
 *   - platform training completions (check-passed events) → experience lines;
 *   - the target role's core-tier skills → the keyword floor to score on.
 * No wizard, no generated starter (Builder rejected by essentiality): the
 * list tells the student WHAT their resume must contain; the resume is
 * written by the student themselves, outside the system.
 */

export interface MustContainItem {
  label: string;
  note: string;
  /** sourced marks — every row traces to state or a table */
  src: string;
}

export async function mustContainList(career: Career, s: StudentState): Promise<MustContainItem[]> {
  const items: MustContainItem[] = [
    {
      label: "A header with your name, email, and phone",
      note: "The first line a screen reads — every other list item hangs under it.",
      src: "format guide",
    },
    {
      label: "Education — your program, school, expected graduation",
      note: "Dated, near the top: it anchors the resume.",
      src: "format guide",
    },
  ];

  const verifiedSkills = career.skills
    .map((spec) => spec.name)
    .filter((name) => s.bars[name]?.source === "verified" || s.bars[name]?.source === "checked");

  items.push({
    label: "A Skills section naming these verified skills: " + (verifiedSkills.length ? verifiedSkills.join(", ") : "— none verified yet; claim them in setup first"),
    note: "For a student it stays a list, one skill per item —the same words the role is scored on.",
    src: "verified skills · your state",
  });

  /* Credentials table read (service-role client, server-only). Feature UI
     lands in a later round; the table exists and the diagnostic reads it
     honestly whatever it holds. */
  let internshipRows: { title: string; organization: string | null; status: string }[] = [];
  let credentialRows: { title: string; kind: string; status: string }[] = [];
  const { configured } = supabaseEnv();
  if (configured) {
    try {
      const { data } = await supabaseAdmin()
        .from("credentials")
        .select("kind, title, organization, status")
        .eq("student_id", s.id);
      internshipRows = (data ?? [])
        .filter((r) => r.kind === "internship")
        .map((r) => ({ title: r.title, organization: r.organization, status: r.status }));
      credentialRows = (data ?? [])
        // 'presence' (ticket 12) is not a resume credential line — it lives in
        // Profile → Credentials as the fourth kind and feeds AR's presence factor
        .filter((r) => r.kind !== "internship" && r.kind !== "presence")
        .map((r) => ({ title: r.title, kind: r.kind, status: r.status }));
    } catch {
      /* table not applied yet — the on-ramp renders its honest fallback */
    }
  }

  items.push(
    internshipRows.length > 0
      ? {
          label: `Experience entries starting with your internship: ${internshipRows.map((r) => r.title).join(", ")}`,
          note: "Newest first — org, role, and one bullet each.",
          src: "credentials table",
        }
      : {
          label: "Experience entries — internships, OJT, org roles, or class projects",
          note: "Your profile has no internship recorded yet (it lands in Profile → Credentials). Class projects count — write them up.",
          src: "your credentials · none yet",
        }
  );

  const passedTitles = s.events
    .filter((e) => e.kind === "check-passed")
    .map((e) => e.detail.split(" — ").slice(1).join(" — "))
    .map((t) => RESOURCES.find((r) => r.title === t)?.title ?? t);
  if (passedTitles.length > 0 || credentialRows.length > 0) {
    items.push({
      label:
        "Credentials worth naming: " +
        [...credentialRows.map((r) => `${r.title} (${r.kind})`), ...passedTitles].join(", "),
      note: "Certifications and check-passed trainings read as credential lines under their own heading.",
      src: "credentials table · check-passed events",
    });
  } else {
    items.push({
      label: "Any credential, certification, or completed training — nothing recorded yet",
      note: "Platform completions count when their check passes; external ones land in Profile → Credentials.",
      src: "your credentials · none yet",
    });
  }

  const coreSkills = career.skills.filter((spec) => spec.tier === "core").map((spec) => spec.name);
  items.push({
    label: "These role keywords, spelled out where they're used: " + coreSkills.join(", "),
    note: "Alignment is scored by matching their words to your text — a synonym counts, a silence doesn't.",
    src: `target role · ${career.name}`,
  });

  items.push({
    label: "One page, plain layout, standard section titles",
    note: "No photos, no text boxes, no graphics — the same properties the diagnostic's parseability and format factors measure.",
    src: "format guide · ATS-friendly (formatting property)",
  });

  return items;
}
