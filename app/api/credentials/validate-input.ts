import type { CredentialKind, CredentialInput } from "@/lib/db/credential-store";

/**
 * The credentials declaration contract (Round 7 re-cut) — shared by the
 * declare POST and the PATCH (edit-while-declared / revise-resubmit), so a
 * resubmission passes exactly the checks a first declaration would.
 * Returns an input object, or an honest rejection line.
 */
export const DECLARED_KINDS: CredentialKind[] = ["certification", "internship", "project"];

export function validateCredentialInput(body: Record<string, unknown>): string | { ok: CredentialInput } {
  const kind = DECLARED_KINDS.includes(body.kind as CredentialKind) ? (body.kind as CredentialKind) : null;
  if (!kind) return "Pick the credential's kind first — certification, internship or job, or personal project / org role.";
  const title = typeof body.title === "string" ? body.title.trim() : "";
  if (!title) return "The credential needs a title — what the record is, in plain words.";
  if (title.length > 120) return "Keep the title under 120 characters.";
  const organization = typeof body.organization === "string" && body.organization.trim() ? body.organization.trim() : null;
  if (organization && organization.length > 120) return "Keep the organization line under 120 characters.";
  if (kind === "internship" && !organization) return "An internship or job record names its employer — that's what the audit reads.";
  const evidenceUrl = typeof body.evidenceUrl === "string" && body.evidenceUrl.trim() ? body.evidenceUrl.trim() : null;
  const evidenceNote = typeof body.evidenceNote === "string" && body.evidenceNote.trim() ? body.evidenceNote.trim() : null;
  if (!evidenceUrl && !evidenceNote) return "Attach evidence — a link or file URL the audit can open (declared status waits on it).";
  if (evidenceUrl && !/^(https?):\/\/\S+$/i.test(evidenceUrl)) return "The evidence must read as a URL (https://…) — the audit opens it.";
  if (evidenceNote && evidenceNote.length > 300) return "Keep the evidence note under 300 characters.";
  const validDate = (v: unknown): string | null => {
    const s = typeof v === "string" ? v.trim() : "";
    return /^\d{4}-\d{2}-\d{2}$/.test(s) ? s : null;
  };
  const startedOn = validDate(body.startedOn);
  const endedOn = validDate(body.endedOn);
  if (startedOn && endedOn && endedOn < startedOn) return "Dates read back-to-front — the start can't come after the end.";
  const skills = Array.isArray(body.declaredSkills)
    ? Array.from(
        new Set(
          (body.declaredSkills as unknown[])
            .filter((s): s is string => typeof s === "string" && Boolean(s.trim()))
            .map((s) => s.trim().slice(0, 160))
        )
      ).slice(0, 12)
    : [];
  return {
    ok: {
      kind,
      title,
      organization,
      startedOn,
      endedOn,
      evidenceUrl,
      evidenceNote,
      declaredSkills: skills,
    },
  };
}
