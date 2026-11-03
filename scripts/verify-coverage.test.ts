import { describe, it, expect } from "vitest";
import { pickMaterial } from "@/lib/engines/suggestions";
import { CAREERS } from "@/lib/fixtures/catalog";
import { RESOURCES } from "@/lib/fixtures/resources";
import type { AccessState } from "@/lib/types";

/**
 * Wave B acceptance gate (user bar, 2026-11-03: "all roles should have a
 * suggested resource for their skills; suggestions must be taught pages; must
 * actually satisfy the skill") — every career × skill cell resolves to a
 * VETTED taught suggestion with a self-serve access fact and an authored
 * learn line. Expected RED until the fixture audit lands: the printed red
 * list IS the audit work queue (career → skill → reason):
 *   no-claim       — no catalog row claims the skill (thin cell)
 *   unvetted       — claims exist but none passes the audit gates
 *   not-taught     — the vetted-slot contract broke (picker gates form)
 *   not-self-serve — the vetted-slot contract broke (picker gates access)
 *   no-learn-line  — the winning row lacks learnNotes[skill]
 * Honesty valve (plan Wave B): a skill with genuinely NO taught self-serve
 * resource on the open web stays red on purpose — the fixture comment marks
 * `adviser-only skill` and the user rules each such case (content owner).
 */

const SELF_SERVE = new Set<AccessState>(["direct", "account", "exam-paid"]);

interface Failure {
  career: string;
  skill: string;
  reason: string;
}

function auditOne(careerId: string, skill: string): string | null {
  // reason pass 1 — no claim at all
  const pool = RESOURCES.filter(
    (r) => r.careerId === careerId && r.skillsAddressed.includes(skill)
  );
  if (pool.length === 0) return "no-claim";

  const pick = pickMaterial(CAREERS.find((c) => c.id === careerId)!, skill);
  if (!pick.resource) return "unvetted";
  if (pick.resource.form !== "taught") return "not-taught";
  if (!pick.resource.access || !SELF_SERVE.has(pick.resource.access))
    return "not-self-serve";
  if (!pick.resource.learnNotes?.[skill]?.trim()) return "no-learn-line";
  return null;
}

describe("coverage gate — every career × skill has a vetted taught suggestion", () => {
  for (const career of CAREERS) {
    it(`${career.id} (${career.name}) — work queue empty`, () => {
      const failures: Failure[] = [];
      for (const s of career.skills) {
        const reason = auditOne(career.id, s.name);
        if (reason) failures.push({ career: career.id, skill: s.name, reason });
      }
      console.log(
        `[coverage] ${career.id}: ${career.skills.length - failures.length}/${career.skills.length} vetted` +
          (failures.length ? "\n  " + failures.map((f) => `${f.reason}: ${f.skill}`).join("\n  ") : "")
      );
      if (failures.length > 0) console.table(failures);
      expect(failures).toEqual([]);
    });
  }
});
