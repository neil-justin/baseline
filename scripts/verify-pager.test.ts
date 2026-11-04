import { describe, it, expect } from "vitest";
import { PER_PAGE, pagesOf, slicePage } from "@/app/admin/pager-math";

/**
 * Pager verification — the cohort pagination round (spec
 * 2026-11-04-cohort-roster-pagination-design.md). Three registers:
 *   1. the page-math law: PER_PAGE = 10, ceil onto pages, honest slices;
 *   2. the pager render law: atabs- classes, aria-current, bounds
 *      disabled, hidden while the table fits one page;
 *   3. the registry law: live files speak atabs-, never the mockup's
 *      mk- hooks, and the skeleton ghosts the new furniture.
 */
describe("pager page math (10 per page, user-ruled 2026-11-04)", () => {
  it("pins the page size at 10", () => {
    expect(PER_PAGE).toBe(10);
  });

  it("ceilings any count onto whole pages (0 renders as 1)", () => {
    expect(pagesOf(0)).toBe(1);
    expect(pagesOf(7)).toBe(1); // today's cohort: pager hidden
    expect(pagesOf(10)).toBe(1);
    expect(pagesOf(11)).toBe(2);
    expect(pagesOf(25, 10)).toBe(3);
  });

  it("slices each page out of the roster", () => {
    const rows = Array.from({ length: 25 }, (_, i) => i);
    expect(slicePage(rows, 1)).toEqual([0, 1, 2, 3, 4, 5, 6, 7, 8, 9]);
    expect(slicePage(rows, 2)[0]).toBe(10);
    expect(slicePage(rows, 3)).toEqual([20, 21, 22, 23, 24]);
  });

  it("slices an empty roster without throwing", () => {
    expect(slicePage([], 1)).toEqual([]);
  });
});
