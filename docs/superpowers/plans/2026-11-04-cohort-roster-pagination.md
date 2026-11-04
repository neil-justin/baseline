# Cohort Roster Pagination + Skeleton Mirror — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** The counselor's COHORT roster slices at 10 students/page behind a mockup-faithful `Pager` (hidden while the roster fits one page), with the streamed skeleton mirroring the new pager furniture as a text-free ghost strip.

**Architecture:** Pure client-side pagination — the `LiveRow[]` array is already fully built server-side inside the page's Suspense boundary, so `CohortTable` just slices it. The page math (`PER_PAGE = 10`, `pagesOf`, `slicePage`) lives in its own tiny module so vitest pins it without rendering React. The `Pager` is a presentational sibling component ported from the approved mockup (`app/admin/mockups/console-tabs.tsx`) onto `atabs-` hook classes; `CohortSkeleton` gains a blind ghost strip using the existing `.skel` recipe.

**Tech Stack:** Next.js App Router ("use client" components), React 19, lucide-react (existing dep — no new dependencies), vitest 3 + `react-dom/server` for render pins.

**Spec:** `docs/superpowers/specs/2026-11-04-cohort-roster-pagination-design.md`

---

### Task 1: The page math (`pager-math.ts`)

**Files:**
- Create: `app/admin/pager-math.ts`
- Test: `scripts/verify-pager.test.ts` (new file)

- [ ] **Step 1: Write the failing test**

Create `scripts/verify-pager.test.ts` with the math describe-first (header comment matching the repo's comment-with-a-story register):

```ts
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
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run scripts/verify-pager.test.ts`
Expected: FAIL — "Cannot find module '@/app/admin/pager-math'"

- [ ] **Step 3: Write the implementation**

Create `app/admin/pager-math.ts`:

```ts
/**
 * Pager page math (cohort pagination round, 2026-11-04). The two pure
 * units the live pager and scripts/verify-pager.test.ts pin — no React
 * here, so the test imports run without DOM machinery. Sized at 10 per
 * page (user ruling over the mockup's 5); the audit queue reuses the
 * module when its own pager round lands.
 */
export const PER_PAGE = 10;

/** Ceiling onto whole pages; a 0-row table still counts as 1 page so
 *  callers can render `Pager` unconditionally. */
export function pagesOf(count: number, per: number = PER_PAGE): number {
  return Math.max(1, Math.ceil(count / per));
}

/** The caller's page slice — page is 1-based, matching the Pager's
 *  numbered buttons. Never throws on an empty list. */
export function slicePage<T>(
  list: readonly T[],
  page: number,
  per: number = PER_PAGE,
): T[] {
  return list.slice((page - 1) * per, page * per);
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run scripts/verify-pager.test.ts`
Expected: PASS (4 tests)

- [ ] **Step 5: Commit**

```bash
git add app/admin/pager-math.ts scripts/verify-pager.test.ts
git commit -m "admin: pager page math keyed at 10/page with vitest pins"
```

---

### Task 2: The `Pager` component

**Files:**
- Create: `app/admin/Pager.tsx`
- Modify: `scripts/verify-pager.test.ts` (append the render describe)

- [ ] **Step 1: Write the failing render tests**

Append to the bottom of `scripts/verify-pager.test.ts` (extending the existing import list — add these two lines at the top of the file alongside the pager-math import):

```ts
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import Pager from "@/app/admin/Pager";
```

Then append:

```ts
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
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run scripts/verify-pager.test.ts`
Expected: FAIL — "Cannot find module '@/app/admin/Pager'"

- [ ] **Step 3: Write the implementation**

Create `app/admin/Pager.tsx`:

```tsx
"use client";

/**
 * Pager — the realm's pagination, ported from the approved mockup
 * (console-tabs.tsx, "every table gets one") onto `atabs-` hook classes
 * (e2e-hook rule: no `mk-` hooks leak into live chrome). Purely
 * presentational: the caller owns the page state and the row slice
 * (pager-math.ts). Hidden while a table fits one page — the mockup's
 * contract; today's cohort renders pager-free until growth.
 */
import { ChevronLeft, ChevronRight } from "lucide-react";

export default function Pager({
  page,
  pages,
  setPage,
}: {
  page: number;
  pages: number;
  setPage: (n: number) => void;
}) {
  if (pages <= 1) return null;
  return (
    <nav className="atabs-pager" aria-label="Table pagination">
      <button
        type="button"
        className="atabs-pager-btn"
        disabled={page <= 1}
        onClick={() => setPage(page - 1)}
      >
        <ChevronLeft size={14} aria-hidden="true" />
      </button>
      {Array.from({ length: pages }, (_, i) => i + 1).map((n) => (
        <button
          key={n}
          type="button"
          className={`atabs-pager-btn${page === n ? " on" : ""}`}
          aria-current={page === n ? "page" : undefined}
          onClick={() => setPage(n)}
        >
          {n}
        </button>
      ))}
      <button
        type="button"
        className="atabs-pager-btn"
        disabled={page >= pages}
        onClick={() => setPage(page + 1)}
      >
        <ChevronRight size={14} aria-hidden="true" />
      </button>
      <span className="atabs-pager-label">
        PAGE {page} OF {pages}
      </span>
    </nav>
  );
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run scripts/verify-pager.test.ts`
Expected: PASS (7 tests)

- [ ] **Step 5: Commit**

```bash
git add app/admin/Pager.tsx scripts/verify-pager.test.ts
git commit -m "admin: Pager — mockup register on atabs- hooks, a11y per mock"
```

---

### Task 3: The CSS register + the hook-class registry law

**UPDATE (2026-11-05, post-WAVES-4 landing, commit 902c8b5):** the `.atabs-pager`
register now EXISTS in `app/admin/admin-tabs.css` (landed with the audit queue's
pager: 16px padding, tabular numerals on label, queue-scoped padding rule).
Implement this task as **registry-test-only** — write the checks below, expect
them to pass immediately (the failing-first provision was consumed by the
parallel landing; note that in the commit), wire nothing. Delete no CSS.

**Files:**
- Modify: `app/admin/admin-tabs.css` (append at end)
- Modify: `scripts/verify-pager.test.ts` (append the registry describe)

- [ ] **Step 1: Write the failing registry checks**

Append to the bottom of `scripts/verify-pager.test.ts`:

```ts
import { readFileSync } from "node:fs";

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
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run scripts/verify-pager.test.ts`
Expected: FAIL — "admin-tabs.css carries the pager register, mk-free" (the `.atabs-pager` rules don't exist yet). The three `no mockup hook` checks PASS already (the live files are currently mk-free — they just pin the rule before the wiring in Task 4).

- [ ] **Step 3: Write the CSS**

Append at the end of `app/admin/admin-tabs.css`:

```css
/* ---------- the pager (cohort pagination round, 2026-11-04) — the
   mockup's .mk-pager register ported verbatim onto atabs- hooks (the
   e2e-hook rule banned the mk- prefix from live chrome). Skeleton
   ghosts reuse the same face via .atabs-pager-skel (a marker class;
   no rules of its own — the ghost pills are .skel spans). */
.v7admin .atabs-pager {
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 10px 12px;
  border-top: 1px solid var(--v-rows);
  background: var(--v-surface);
  font-variant-numeric: tabular-nums;
}
.v7admin .atabs-pager-btn {
  min-width: 26px;
  padding: 4px 8px;
  border: 1px solid var(--v-border);
  border-radius: 6px;
  background: var(--v-surface);
  color: var(--v-ink2);
  font: 500 12px/1.4 Roboto, system-ui, sans-serif;
  cursor: pointer;
}
.v7admin .atabs-pager-btn:hover:not(:disabled) {
  background: var(--v-grey-wash);
  color: var(--v-ink);
}
.v7admin .atabs-pager-btn.on {
  background: var(--v-blue-deep);
  border-color: var(--v-blue-deep);
  color: #fff;
}
.v7admin .atabs-pager-btn:disabled {
  opacity: 0.4;
  cursor: default;
}
.v7admin .atabs-pager-label {
  margin-left: auto;
  font: 500 11px/1.4 Roboto, system-ui, sans-serif;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--v-ink2);
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run scripts/verify-pager.test.ts`
Expected: PASS (10 tests)

- [ ] **Step 5: Commit**

```bash
git add app/admin/admin-tabs.css scripts/verify-pager.test.ts
git commit -m "admin: pager CSS register on atabs- hooks + registry pin"
```

---

### Task 4: Wire `CohortTable` to paginate

**Files:**
- Modify: `app/admin/AdminShell.tsx` (imports ~line 26-36, `CohortTable` lines 66-112)

This task has no new unit test (the component wiring is already covered by the
math + render pins from Tasks 1-2); verification is typecheck + the existing
suite + a visual smoke.

- [ ] **Step 1: Make `CohortTable` paginate**

In `app/admin/AdminShell.tsx`, add to the import block (after the `./tabs` import):

```tsx
import Pager from "./Pager";
import { pagesOf, slicePage } from "./pager-math";
```

Replace the `CohortTable` function body (keep the doc comment, extend it):

```tsx
/** COHORT — the existing roster table, paginated client-side per the
 *  2026-11-04 spec: the full rows array is already shipped, so the
 *  slice is local state only (10/page, Pager hidden while it fits).
 *  Same grid classes, same row markup; the hooks stay verbatim. */
function CohortTable({ rows }: { rows: LiveRow[] }) {
  const [page, setPage] = useState(1);
  const pages = pagesOf(rows.length);
  return (
    <section className="panel cohort-table" aria-label="Cohort roster">
      <div className="ct-head">
        <div className="ct-headline">
          <h2 className="ct-title">Cohort roster</h2>
          <p className="ct-meta">{rows.length} students</p>
        </div>
        <CohortArt />
      </div>
      {/* the family ledger register (Ledger-Table Rule): a real table —
          tracked heads, #E8EAED row rules, tabular numerals, hover wash.
          The whole row navigates — no Open column, no progress strip
          (user ruling 2026-11-04: redundant with the row affordance;
          progression detail lives on the per-student surface). */}
      <table className="ct-table">
        <thead>
          <tr>
            <th className="col-name" scope="col">Name</th>
            <th className="col-career" scope="col">Career</th>
            <th className="col-score" scope="col">Score</th>
            <th className="col-active" scope="col">Last active</th>
          </tr>
        </thead>
        <tbody>
          {slicePage(rows, page).map((r) => (
            <StudentRow
              key={r.id}
              id={r.id}
              isDemo={r.id === "neil"}
              name={r.name}
              sub={r.sub}
              career={r.career}
              score={r.score}
              pending={r.pending}
              belowAvg={r.belowAvg}
              noActivity={r.events === 0}
              active={r.active}
            />
          ))}
        </tbody>
      </table>
      <Pager page={page} pages={pages} setPage={setPage} />
    </section>
  );
}
```

Notes for the implementer:
- The header meta stays the honest TOTAL ("N students"); the pager carries
  position ("PAGE 2 OF 3") — do NOT add a per-page count beside it.
- `AdminShell.tsx` already runs `"use client"` and imports `useState` (line 26) —
  no import changes beyond the two lines above.
- Page state lives inside `CohortTable`, which remounts per tab switch (the pane
  is `key={active}`), so no cross-tab retention or reset logic.

- [ ] **Step 2: Verify**

Run: `npx vitest run scripts/verify-pager.test.ts`
Expected: PASS (10 tests — the Task-3 registry pinning `AdminShell.tsx` re-confirms no `mk-` leakage post-wiring)

Run: `npx tsc --noEmit`
Expected: exit 0, no type errors

- [ ] **Step 3: Commit**

```bash
git add app/admin/AdminShell.tsx
git commit -m "admin: cohort roster paginates at 10/page behind the Pager"
```

---

### Task 5: The skeleton pager ghost

**Files:**
- Modify: `app/admin/console-skeleton.tsx` (`CohortSkeleton` lines 40-82)
- Modify: `scripts/verify-pager.test.ts` (append a ghost describe)

- [ ] **Step 1: Write the failing ghost checks**

Append to the bottom of `scripts/verify-pager.test.ts`:

```ts
describe("skeleton mirror (spec: 6 rows verbatim + text-free pager ghost)", () => {
  const skel = () => readFileSync("app/admin/console-skeleton.tsx", "utf8");

  it("keeps the six-row blind mirror verbatim", () => {
    expect(skel()).toContain("const ROSTER_ROWS = [0, 1, 2, 3, 4, 5];");
  });

  it("ghosts the pager furniture below the table", () => {
    const src = skel();
    expect(src).toContain("atabs-pager atabs-pager-skel");
    // ghost pills: 2 chevron pills + 4 page pills + 1 label pill, all .skel
    expect(src).toContain("PagerGhost");
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run scripts/verify-pager.test.ts`
Expected: FAIL — the "ghosts the pager furniture" check (no `PagerGhost`/`atabs-pager-skel` in the skeleton yet)

- [ ] **Step 3: Write the ghost**

In `app/admin/console-skeleton.tsx`, add the ghost component just above `function CohortSkeleton()` (after `ROSTER_COL_WIDTHS`):

```tsx
/** The pager ghost (spec 2026-11-04: blind mirror of the paginated
 *  furniture) — chevron pill · 4 page pills · chevron pill, plus the
 *  right-anchored label pill. ALL greys through .skel: text-free, no
 *  countable claims, footprint-fixed against the real pager's faces
 *  (26px chevrons/pages, 96px label). The strip ships even when the
 *  incoming roster fits one page — accepted mismatch; the swap paints
 *  OVER the skeleton, so the ghost only ever fades, never jumps. */
function PagerGhost() {
  return (
    <div className="atabs-pager atabs-pager-skel">
      <span className="skel" style={{ width: 26, height: 24, borderRadius: 6 }} />
      <span className="skel" style={{ width: 24, height: 24, borderRadius: 6 }} />
      <span className="skel" style={{ width: 24, height: 24, borderRadius: 6 }} />
      <span className="skel" style={{ width: 24, height: 24, borderRadius: 6 }} />
      <span className="skel" style={{ width: 24, height: 24, borderRadius: 6 }} />
      <span className="skel" style={{ width: 26, height: 24, borderRadius: 6 }} />
      <span className="skel" style={{ marginLeft: "auto", width: 96, height: 11 }} />
    </div>
  );
}
```

Inside `CohortSkeleton`, immediately after the closing `</table>` (before `</section>`), render it:

```tsx
      </table>
      <PagerGhost />
    </section>
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run scripts/verify-pager.test.ts`
Expected: PASS (12 tests)

- [ ] **Step 5: Commit**

```bash
git add app/admin/console-skeleton.tsx scripts/verify-pager.test.ts
git commit -m "admin: skeleton mirrors the pager furniture as a text-free ghost"
```

---

### Task 6: Full verification + visual smoke

**Files:**
- None (verification only)

- [ ] **Step 1: Run the whole script-test suite**

Run: `npx vitest run scripts/`
Expected: ALL suites PASS (verify-pager alongside verify-canon, verify-fixtures, verify-coverage, letter-engine, resume-engine, etc.)

- [ ] **Step 2: Typecheck and build**

Run: `npx tsc --noEmit`
Expected: exit 0

Run: `npm run build`
Expected: compiles clean (no new warnings pointing at `app/admin/*`)

- [ ] **Step 3: Visual smoke — two states**

Run the counselor capture (the script already seeds `ana.villanueva@…` and screenshots the COHORT tab):

Run: `node scripts/shot-admin-shell.mjs`
Expected in the capture (`shots/` output the script prints):
1. **Today's 7-student cohort:** the roster is UNCHANGED — no pager strip visible (7 ≤ 10, `pages === 1`), the skeleton ghost still appears mid-stream and fades.
2. **Grown cohort (optional):** temporarily bump a seeded roster past 10 accounts (or trust `pagesOf` pins) and re-capture — expect chevrons ‹ ›, numbered buttons, blue "on" face, right-anchored `PAGE 1 OF 2` label.
(If the shot script's seeding makes state 2 awkward, skip it — the math/render pins already cover the behavior. Revert any temp seed changes.)

- [ ] **Step 4: Commit any capture artifacts the round keeps** (only if the repo's habit is to store round shots)

```bash
git status --short   # inspect; commit shots/ if that's the round habit
```

---

## Self-review notes

- **Spec coverage:** page size 10 (Task 1), client-side slice + hidden ≤1 page + honest total meta (Task 4), Pager on atabs- hooks in its own file (Task 2/3), a11y contract aria-label/aria-current/bounds (Task 2), skeleton 6 rows + ghost strip (Task 5), tests for math + render + class registry (Tasks 1/2/3), no server/API change (no task touches the server build — correct).
- **Type consistency:** `Pager` props `{ page, pages, setPage }` used identically in Task 2 render tests and Task 4 wiring; `pagesOf`/`slicePage` names match between `pager-math.ts`, the component, and the test imports.
- **Placeholders:** none — every step carries full code; the only optional item is the grown-cohort capture in Task 6, marked as skippable with the reason.
