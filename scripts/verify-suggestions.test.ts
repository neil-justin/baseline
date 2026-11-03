import { describe, it, expect } from "vitest";
import { pickMaterial } from "@/lib/engines/suggestions";
import { getCareer } from "@/lib/fixtures/catalog";

const qa = getCareer("qa")!;

describe("pickMaterial — satisfaction tiers (user-ruled 2026-11-03)", () => {
  it("never suggests the SRE books for Quality Assurance / Quality Standards", () => {
    // res-qa-sre-books: reference/landing-grade claim, no creditingBody.
    // This row is the founding failure of the old Q11v2 sort.
    const pick = pickMaterial(qa, "Quality Assurance / Quality Standards");
    expect(pick?.resource?.id).not.toBe("res-qa-sre-books");
  });

  it("picks the credited taught resource when a skill has one", () => {
    // res-qa-fcc-qa: creditingBody freeCodeCamp, form taught, access account.
    const pick = pickMaterial(qa, "Defect management");
    expect(pick?.resource?.id).toBe("res-qa-fcc-qa");
    expect(pick?.learn).toMatch(/bugs/i);
  });

  it("returns unvetted counts instead of pretending a pick", () => {
    const pick = pickMaterial(qa, "Quality Assurance / Quality Standards");
    expect(pick!.resource).toBeNull();
    expect(pick!.unvetted).toBeGreaterThanOrEqual(1);
  });
});
