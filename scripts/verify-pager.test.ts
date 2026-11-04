import { describe, it, expect } from "vitest";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { readFileSync } from "node:fs";
import { PER_PAGE, pagesOf, slicePage } from "@/app/admin/pager-math";
import Pager from "@/app/admin/Pager";

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

  it("parameterizes per (the audit queue's future knob)", () => {
    expect(pagesOf(11, 5)).toBe(3);
    expect(slicePage([1, 2, 3, 4, 5, 6, 7], 2, 5)).toEqual([6, 7]);
  });
});

const noop = () => {};

describe("pager render law (mockup register, atabs- hooks)", () => {
  it("renders the nav with the active page marked and the position label", () => {
    const html = renderToStaticMarkup(
      createElement(Pager, { page: 2, pages: 3, setPage: noop }),
    );
    expect(html).toContain('class="atabs-pager"');
    expect(html).toContain('aria-label="Table pagination"');
    expect(html).toContain('aria-current="page"');
    expect(html).toContain("PAGE 2 OF 3");
    expect(html).toContain('aria-label="Previous page"');
    expect(html).toContain('aria-label="Next page"');
    // exactly one active-numbered face, never two
    expect(html.match(/class="atabs-pager-btn on"/g)?.length).toBe(1);
  });

  it("hides itself while the table fits one page (mockup behavior)", () => {
    const html = renderToStaticMarkup(
      createElement(Pager, { page: 1, pages: 1, setPage: noop }),
    );
    expect(html).toBe("");
  });

  it("disables the chevrons at the bounds, never the numbers", () => {
    const first = renderToStaticMarkup(
      createElement(Pager, { page: 1, pages: 3, setPage: noop }),
    );
    expect(first.match(/disabled=""?/g)?.length).toBe(1);
    const last = renderToStaticMarkup(
      createElement(Pager, { page: 3, pages: 3, setPage: noop }),
    );
    expect(last.match(/disabled=""?/g)?.length).toBe(1);
    const middle = renderToStaticMarkup(
      createElement(Pager, { page: 2, pages: 3, setPage: noop }),
    );
    expect(middle.includes("disabled")).toBe(false);
  });
});

describe("hook-class registry (e2e-hook rule: atabs-, never mk-)", () => {
  const liveFiles = [
    "app/admin/Pager.tsx",
    "app/admin/AdminShell.tsx",
    "app/admin/console-skeleton.tsx",
  ];

  for (const f of liveFiles) {
    it(`${f}: no mockup hook (mk-) in any className`, () => {
      const src = readFileSync(f, "utf8");
      expect(src).not.toMatch(/className=['"`][^'"`]*\bmk-/);
    });
  }

  it("admin-tabs.css carries the pager register, mk-free", () => {
    const css = readFileSync("app/admin/admin-tabs.css", "utf8");
    expect(css).toContain(".v7admin .atabs-pager {");
    expect(css).toContain(".v7admin .atabs-pager-btn {");
    expect(css).toContain(".v7admin .atabs-pager-btn.on {");
    expect(css).toContain(".v7admin .atabs-pager-label {");
    expect(css).not.toMatch(/^\.v7admin \.mk-/m);
  });
});

describe("skeleton mirror + page margin (user-ruled 2026-11-05)", () => {
  it("keeps the cohort mirror's six rows verbatim", () => {
    expect(readFileSync("app/admin/console-skeleton.tsx", "utf8")).toContain(
      "const ROSTER_ROWS = [0, 1, 2, 3, 4, 5];"
    );
  });

  it("ghosts the pager furniture in BOTH skeletons", () => {
    const src = readFileSync("app/admin/console-skeleton.tsx", "utf8");
    // chevron · 4 page pills · chevron + right-anchored label pill
    expect(src).toContain("function PagerGhost()");
    expect(src.includes('className="atabs-pager atabs-pager-skel"')).toBe(true);
  });

  it("reserves bottom margin on every tab page", () => {
    const css = readFileSync("app/admin/admin-tabs.css", "utf8");
    expect(css).toMatch(/\.v7admin \.atabs-tabpage\s*\{[^}]*margin-bottom:[^}]*\}/s);
  });
});
