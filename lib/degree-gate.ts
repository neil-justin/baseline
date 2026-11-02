/**
 * Degree gate (user ruling 2026-11-02, logic v2): a target role is locked
 * when the student's intake program isn't mapped by the target's
 * `degreeMap`. Single source of truth — shared by the switch API route
 * (server enforcement) and CareerClient (the locked modal's UX).
 *
 * Entry semantics (matching the catalog's own source phrases):
 *  - "open-door tier — any CHED canon program" / "open-tier canon" /
 *    "any CHED canon" → any program qualifies;
 *  - "any business-track canon …" → only BSBA-family programs;
 *  - everything else → substring match either direction (tolerant of roster
 *    label variants, e.g. "BSIT" vs a full program name).
 * An empty/missing program feeds no gate (data-quality fallback, not a veto).
 */

const norm = (s: string) => s.toLowerCase().replace(/[^a-z0-9]+/g, " ").trim();

export function degreeGateAllows(
  program: string | null | undefined,
  degreeMap: string[]
): boolean {
  if (!program || !norm(program)) return true;
  const p = norm(program);
  return degreeMap.some((entry) => {
    const e = norm(entry);
    if (!e) return false;
    if (e.includes("open tier") || e.includes("open door") || e.includes("any ched canon")) {
      return true;
    }
    if (e.includes("any business track canon")) {
      return p.includes("bsba");
    }
    return e.includes(p) || p.includes(e);
  });
}
