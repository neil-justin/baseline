# Sysadmin Slots: Pagination + Self-Omit + Blind Loading — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** The sysadmin's APPROVALS and ACCOUNTS tables paginate at 10/page behind the console's shared `Pager`, omit the viewer's own account row, drop the dead Profile menu item, and paint blind skeleton rows while loading instead of a growing empty line.

**Architecture:** Pure client-side slicing of the full lists both slots already fetch — reuse the landed `app/admin/Pager.tsx` (hidden while pages ≤ 1) and `app/admin/pager-math.ts` (`PER_PAGE = 10` via the default). After-commit refetches clamp the page; loading states paint grid-aligned `.skel` blind rows (no pager ghost — the loaded table decides whether a pager exists at all, unlike the streamed-shell mirrors).

**Tech Stack:** Next.js App Router, React 19 client components, vitest 3 (source pins join `scripts/verify-pager.test.ts`).

**Spec:** `docs/superpowers/specs/2026-11-05-sysadmin-slots-pagination-design.md`

---

### Task 1: The failing pins

**Files:**
- Test: `scripts/verify-pager.test.ts` (append)

- [ ] **Step 1: Append the pins**

```ts
describe("sysadmin slots pagination + self-omit (user-ruled 2026-11-05)", () => {
  it("both slots page through the shared pager machinery", () => {
    const src = readFileSync("app/admin/slots.tsx", "utf8");
    expect(src).toContain('import Pager from "./Pager"');
    expect(src).toContain("{ pagesOf, slicePage } from \"./pager-math\"");
    // each slot clamps its page against its own (filtered) count on
    // refetch — approvals AND accounts each clamp once
    expect((src.match(/Math\.min\(p, pagesOf/g) ?? []).length).toBe(2);
  });

  it("accounts omits the viewer's own row (the dash-kebab case dies with it)", () => {
    const src = readFileSync("app/admin/slots.tsx", "utf8");
    expect(src).toContain("a.userId !== selfUserId");
    expect(src).not.toContain("isSelf");
  });

  it("the dead Profile item is gone (one menuitem left: deactivate)", () => {
    const src = readFileSync("app/admin/slots.tsx", "utf8");
    expect((src.match(/role="menuitem"/g) ?? []).length).toBe(1);
    expect(src).not.toMatch(/Profile<\/button>/);
  });

  it("loading paints blind rows, not a growing empty line", () => {
    const src = readFileSync("app/admin/slots.tsx", "utf8");
    expect(src).toContain("function BlindRows()");
  });
});
```

- [ ] **Step 2: Run** `npx vitest run scripts/verify-pager.test.ts`
  Expected: 4 new pins FAIL (slots.tsx untouched); the 15 prior pins hold.

- [ ] **Step 3: Commit** the pins so the red state is on record:

```bash
git add scripts/verify-pager.test.ts
git commit -m "admin: pin the sysadmin slots round (pagination, self-omit, blind loading)"
```

---

### Task 2: Wire `slots.tsx`

**Files:**
- Modify: `app/admin/slots.tsx` (all hunks below; current file is 378 lines, unchanged since the round's context read)

- [ ] **Step 1: Imports** — after the `lucide-react` import line (`import { Ellipsis, X } from "lucide-react";`), add:

```tsx
import Pager from "./Pager";
import { pagesOf, slicePage } from "./pager-math";
```

- [ ] **Step 2: The blind-loading rows** — add above `export function AdminApprovalsSlot()`:

```tsx
/** The load-blind mirror (user-ruled 2026-11-05: no more empty-line →
 *  growth — a fetch hold paints blind rows in the REAL grid, and the
 *  truth lands in place; no pager ghost here, the loaded table decides
 *  whether a pager exists at all). cells come pre-shaped per grid. */
function BlindRows({ grid, cells }: { grid: string; cells: () => React.ReactNode }) {
  return (
    <>
      {[0, 1, 2].map((r) => (
        <div key={r} className={`atabs-row ${grid}`}>
          {cells()}
        </div>
      ))}
    </>
  );
}
```

Approvals' loading branch — REPLACE:

```tsx
      {rows === null && !loadFailed && <p className="atabs-empty" />}
```

with:

```tsx
      {rows === null && !loadFailed && (
        <BlindRows
          grid="atabs-appr-grid"
          cells={() => (
            <>
              <div className="atabs-cellname">
                <span className="skel" style={{ width: 128, height: 14, display: "inline-block" }} />
                <span className="skel" style={{ width: 168, height: 11, marginTop: 5 }} />
              </div>
              <span><span className="skel" style={{ width: 86, height: 18, display: "inline-block" }} /></span>
              <span><span className="skel" style={{ width: 84, height: 11, display: "inline-block" }} /></span>
              <span><span className="skel" style={{ width: 104, height: 11, display: "inline-block" }} /></span>
              <span><span className="skel" style={{ width: 78, height: 18, display: "inline-block" }} /></span>
              <span><span className="skel" style={{ width: 64, height: 24, display: "inline-block" }} /></span>
            </>
          )}
        />
      )}
```

- [ ] **Step 3: APPROVALS pagination** — in `AdminApprovalsSlot`:

(a) add to the state block (after `const [rowErr, setRowErr] = ...`):

```tsx
  const [page, setPage] = useState(1);
```

(b) in `load()`, REPLACE:

```tsx
      if (live.current && res.ok) {
        setRows(data?.requests ?? []);
        setLoadFailed(false);
        setArmed(null);
      }
```

with:

```tsx
      const list = data?.requests ?? [];
      if (live.current && res.ok) {
        setRows(list);
        setLoadFailed(false);
        setArmed(null);
        // a ruling that shrank the list must not strand the page
        setPage((p) => Math.min(p, pagesOf(list.length)));
      }
```

(c) REPLACE the rows render open ({ `rows !== null &&` / `rows.map((r) => {`}) with:

```tsx
      {rows !== null &&
        slicePage(rows, page).map((r) => {
```

(entity-wise, ONLY the map source changes; the body stays verbatim.)

(d) just before the closing `</section>`, after the rows map block, add:

```tsx
      {rows !== null && (
        <Pager page={page} pages={pagesOf(rows.length)} setPage={setPage} />
      )}
```

- [ ] **Step 4: ACCOUNTS rework** — in `AdminAccountsSlot`:

(a) state: add `const [page, setPage] = useState(1);` as in approvals.

(b) in `load()`, REPLACE:

```tsx
      if (live.current) {
        setLoadFailed(!res.ok);
        if (res.ok) {
          setRows(data?.accounts ?? []);
          setSelfUserId(data?.selfUserId ?? null);
          setRowErr(null);
        }
      }
```

with:

```tsx
      const selfId = data?.selfUserId ?? null;
      const list = (data?.accounts ?? []).filter((a) => a.userId !== selfId);
      if (live.current) {
        setLoadFailed(!res.ok);
        if (res.ok) {
          setRows(data?.accounts ?? []);
          setSelfUserId(selfId);
          setRowErr(null);
          // the visible list is the SELF-OMITTED one; clamp against it
          setPage((p) => Math.min(p, pagesOf(list.length)));
        }
      }
```

(Note: `setRows` keeps the full list — self-omission is a VIEW rule; sleeping on the raw list keeps the kebab/campus logic honest. The filter runs at render + count.)

(c) compute the visible list once — directly after the outside-click `useEffect` block, add:

```tsx
  // the view's honest list: the viewer's own row never renders (user-
  // ruled 2026-11-05); everything downstream slices THIS list
  const visibleRows =
    rows === null ? null : rows.filter((a) => a.userId !== selfUserId);
```

(d) REPLACE the loading line `{rows === null && !loadFailed && <p className="atabs-empty" />}` with the accounts blind rows:

```tsx
      {visibleRows === null && !loadFailed && (
        <BlindRows
          grid="atabs-acc-grid"
          cells={() => (
            <>
              <div className="atabs-cellname atabs-idcell">
                <span className="skel" style={{ width: 30, height: 30, borderRadius: 8, display: "inline-block" }} />
                <span className="skel" style={{ width: 128, height: 14, marginLeft: 10, display: "inline-block" }} />
              </div>
              <span><span className="skel" style={{ width: 94, height: 18, display: "inline-block" }} /></span>
              <span><span className="skel" style={{ width: 92, height: 18, display: "inline-block" }} /></span>
              <span><span className="skel" style={{ width: 84, height: 11, display: "inline-block" }} /></span>
              <span><span className="skel" style={{ width: 24, height: 24, borderRadius: 6, display: "inline-block" }} /></span>
            </>
          )}
        />
      )}
```

(e) REPLACE the empty + rows render block from:

```tsx
      {loadFailed && rows === null && <p className="atabs-empty">Not loaded.</p>}

      {rows !== null &&
        rows.map((a) => {
          const isSelf = selfUserId !== null && a.userId === selfUserId;
```

with:

```tsx
      {loadFailed && visibleRows === null && <p className="atabs-empty">Not loaded.</p>}

      {visibleRows !== null &&
        visibleRows.map((a) => {
```

(i.e. the `isSelf` line is deleted; the map body below it stays verbatim EXCEPT the self-kebab branch.)

(f) REPLACE the kebab cell's conditional open:

```tsx
              {isSelf ? (
                <span className="atabs-meta atabs-kebab-cell">—</span>
              ) : (
                <span className="atabs-kebab-cell" data-atabs-kebab>
```

...through the closing... end of the ternary — FULL REPLACEMENT of the kebab cell region: delete the `isSelf ? (...) : (` wrapper lines and their matching `)}` close, updating indentation so the kebab cell spans unconditionally:

```tsx
              <span className="atabs-kebab-cell" data-atabs-kebab>
                <button
                  type="button"
                  className="atabs-kebab"
                  aria-label={`Account actions: ${a.fullName || a.email}`}
                  aria-expanded={openFor === a.userId}
                  aria-haspopup="menu"
                  disabled={acting !== null}
                  onClick={() => setOpenFor(openFor === a.userId ? null : a.userId)}
                >
                  <Ellipsis size={14} aria-hidden="true" />
                </button>
                {openFor === a.userId && (
                  <span className="atabs-menu" role="menu">
                    <button
                      type="button"
                      role="menuitem"
                      disabled={acting !== null}
                      onClick={() => toggleActive(a.userId, !a.active)}
                    >
                      {a.active ? "Deactivate" : "Reactivate"}
                    </button>
                  </span>
                )}
              </span>
```

(That is also the Profile removal: the menu holds ONLY Deactivate/Reactivate.)

(g) just before the closing `</section>`, add the pager:

```tsx
      {visibleRows !== null && (
        <Pager
          page={page}
          pages={pagesOf(visibleRows.length)}
          setPage={setPage}
        />
      )}
```

- [ ] **Step 5: Run** `npx vitest run scripts/verify-pager.test.ts` — expect 19 passing (15 + 4).

- [ ] **Step 6: Run** `npx tsc --noEmit` — expect exit 0 (watch: `React.ReactNode` usage needs no new import — `React` type namespace is ambient in this repo; if tsc disagrees, change the `cells` prop type to `() => import("react").ReactNode` equivalent by importing `{ type ReactNode }` from "react" in slots.tsx — import line already has `useCallback...` so extend it).

- [ ] **Step 7: Commit**

```bash
git add app/admin/slots.tsx
git commit -m "admin: approvals+accounts page at 10/page, omit the viewer's row, blind loading, Profile out"
```

---

### Task 3: Full verification

**Files:** none (read-only)

- [ ] **Step 1:** `npx vitest run scripts/` — ALL suites pass
- [ ] **Step 2:** `npx tsc --noEmit` — exit 0
- [ ] **Step 3:** `npm run build` — clean, no `app/admin/*` warnings
- [ ] **Step 4:** `git status --short` — empty
- [ ] **Step 5:** Report the observed outputs; commit nothing.

---

## Self-review

- **Spec coverage:** 10/page both slots (Task 2c/2g + shared math), self-omit + dead isSelf/kebab dash case (2b/2c-variants/2e/2f), Profile removal (2f), keep-page-clamp on refetch (2b both), blind loading rows for BOTH slots (2 approaches, one shared `BlindRows`) — matches the 2026-11-05 spec decision set.
- **Placeholders:** none — every hunk carries exact code; task descriptions include the full replacement blocks.
- **Type consistency:** `Pager({page, pages, setPage})` and `slicePage(list, page)` signatures match the landed modules; `BlindRows({grid, cells})` used symmetrically in both slots.
