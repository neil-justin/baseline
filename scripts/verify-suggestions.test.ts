import { describe, it, expect } from "vitest";
import { pickMaterial } from "@/lib/engines/suggestions";
import { getCareer } from "@/lib/fixtures/catalog";

const qa = getCareer("qa")!;

describe("pickMaterial — satisfaction tiers (user-ruled 2026-11-03)", () => {
  it("Quality Assurance / Quality Standards resolves to the taught SLO chapter — never the landing-grade claims", () => {
    // Wave B batch 2 ruling (2026-11-03): res-qa-sre-books was re-pointed
    // user-ruled from the books INDEX to the taught Ch. 4 deep-link; the
    // founding failure of the old Q11v2 sort (pre-re-point index URL) is
    // retired. Guards: the winner is the re-pointed TAUGHT claim, and the
    // CTFL cert overview (still landing — no taught flow at the URL) can
    // never win instead.
    const pick = pickMaterial(qa, "Quality Assurance / Quality Standards");
    expect(pick?.resource?.id).toBe("res-qa-sre-books");
    expect(pick?.resource?.form).toBe("taught");
    expect(pick?.resource?.access).toBe("direct");
    expect(pick?.learn).toMatch(/quality|SLO|objective/i);
    expect(pick!.unvetted).toBeGreaterThanOrEqual(1); // the landing CTFL overview stays unvetted
  });

  it("picks the credited taught resource when a skill has one", () => {
    // res-qa-fcc-qa: creditingBody freeCodeCamp, form taught, access account.
    const pick = pickMaterial(qa, "Defect management");
    expect(pick?.resource?.id).toBe("res-qa-fcc-qa");
    expect(pick?.learn).toMatch(/bugs/i);
  });

  it("Applications Support and Enhancement resolves via the Wave B batch 2 re-point (was census-thin)", () => {
    // user-ruled fill 2026-11-03: res-qa-google-bi was re-pointed to Google's
    // taught Technical Support course — the honest attach, no new row.
    const pick = pickMaterial(qa, "Applications Support and Enhancement");
    expect(pick?.resource?.id).toBe("res-qa-google-bi");
    expect(pick?.resource?.form).toBe("taught");
    expect(pick?.resource?.access).toBe("exam-paid");
    expect(pick?.learn).toMatch(/software|troubleshoot/i);
    expect(pick!.unvetted).toBe(0); // sole claim — no unvetted red left in the cell
  });

  it("returns unvetted counts instead of pretending a pick", () => {
    // the honest wait-state still exists where it should: the CTFL overview
    // row counts unvetted inside a cell whose claims partially fail
    const pick = pickMaterial(qa, "Quality Assurance / Quality Standards");
    expect(pick!.unvetted).toBeGreaterThanOrEqual(1);
    // a landing-only pool must never pretend a pick: TAU paths index rides
    // Test Planning without a taught sibling at grading time it would return
    // resource null — pin the contract shape with a real engineered call
    const noVetted = pickMaterial(qa, "Test Planning");
    expect(noVetted!.resource).not.toBeNull(); // taught siblings exist for Test Planning
    expect(noVetted!.resource?.form).toBe("taught");
  });
});
