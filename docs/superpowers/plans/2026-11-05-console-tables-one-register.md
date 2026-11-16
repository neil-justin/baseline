# Console Tables, One Register — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**COMMIT GATE (user ruling 2026-11-05):** implement and verify, COMMIT NOTHING. The user reviews the working tree in the morning; only then commit. Uncommitted work may coexist with other sessions' changes — stage NOTHING, ever.

**Goal:** All four console tables (COHORT, AUDIT, APPROVALS, ACCOUNTS) read as one family: `atabs-` grid-row furniture, per-tab header art on every panel, merged cells split into real columns, the cohort's real `<table>` retired.

**Spec:** `docs/superpowers/specs/2026-11-05-console-tables-one-register-design.md` (records the Ledger-Table-Rule reversal). Sequenced AFTER the slots round's uncommitted work (already in the tree: `app/admin/slots.tsx`, `scripts/verify-pager.test.ts`).

**Tech Stack:** React 19 client components, Next App Router, vitest source pins (`scripts/verify-pager.test.ts`).

---

### Task 1: Failing pins (append to the SAME verify-pager.test.ts)

**Files:**
- Test: `scripts/verify-pager.test.ts` (append; the slots-round pins are already in there, uncommitted, 19 green — do not disturb them)

- [ ] **Step 1: Append**

```ts
describe("one console register (cohort cutover + column splits + art, 2026-11-05)", () => {
  const shell = () => readFileSync("app/admin/AdminShell.tsx", "utf8");
  const studentRow = () => readFileSync("app/admin/StudentRow.tsx", "utf8");

  it("the cohort roster cut over to the console furniture", () => {
    const row = studentRow();
    expect(row).toContain('className="atabs-row atabs-cohort-grid');
    expect(row).not.toContain("<tr");
    expect(row).not.toMatch(/className=["'][^"']*\bs-row\b/);
    const s = shell();
    expect(s).not.toContain("<table");
    expect(s).toContain("atabs-cohort-grid");
  });

  it("the cohort's merged sub-line broke into YEAR and PROGRAM columns", () => {
    const s = shell();
    expect(s).toContain("<span>YEAR</span>");
    expect(s).toContain("<span>PROGRAM</span>");
    expect(s).toContain("<span>TARGET ROLE</span>");
    expect(studentRow()).toContain("year=");
    expect(studentRow()).toContain("program=");
  });

  it("merged name cells split their sub-lines where ruled", () => {
    const slots = readFileSync("app/admin/slots.tsx", "utf8");
    // approvals + accounts: email leaves the name cell for its own column
    expect(slots).toContain("<span>EMAIL</span>");
  });

  it("every table header carries its panel art", () => {
    const slots = readFileSync("app/admin/slots.tsx", "utf8");
    expect(slots).toContain("function ApprovalsArt()");
    expect(slots).toContain("function AccountsArt()");
  });

  it("the retired ct-table CSS is gone from the realm", () => {
    const admin = readFileSync("app/admin/admin.css", "utf8");
    expect(admin).not.toContain(".v7admin .ct-table");
    expect(admin).not.toContain(".v7admin .ct-head");
    expect(admin).not.toContain(".v7admin .cohort-table");
  });

  it("the cohort skeleton mirrors the new furniture", () => {
    expect(readFileSync("app/admin/console-skeleton.tsx", "utf8")).not.toContain("ct-table");
  });
});
```

- [ ] **Step 2: Run** `npx vitest run scripts/verify-pager.test.ts` — expect 5 new FAILs (19 prior still green).

- [ ] **Step 3: NO commit.** Report the red state.

---

### Task 2: Ship `year` / `program` on the roster rows

**Files:**
- Modify: `app/admin/page.tsx` (`LiveRow` type ~line 25; the two view builders ~line 91 and ~line 134 producing `sub: personaMeta(...)`)
- Modify: `app/admin/StudentRow.tsx` (props) — done вместе with Task 3's rewrite
- Modify: `app/admin/AdminShell.tsx` (LiveRow import already there)

- [ ] **Step 1: In `page.tsx`, extend `LiveRow`** — add after `sub: string;`:

```ts
  /** split of the old sub-line (user ruling 2026-11-05: columns, not merges) */
  year: string;
  program: string;
```

- [ ] **Step 2: In the view builders** (the two `sub: personaMeta(state.yearLevel, state.track)` sites), REPLACE the `sub` entry with:

```ts
        sub: personaMeta(state.yearLevel, state.track),
        year: state.yearLevel || "—",
        program: trackLabelOf(state.track) || "—",
```

Import `trackLabelOf` from `./defaults` (same module as `personaMeta`). The `sub` field stays on the rows — the AUDIT queue builder also ships `sub` and nothing rules against it; only the ROSTER rendering stops consuming it (Task 3). For the `state ? … : ""` fallback site, use the same shape with `"—"` defaults when `state` is null.

- [ ] **Step 3: Run** `npx tsc --noEmit` — EXPECT two transient errors (StudentRow/AdminShell not yet consuming the new props) — acceptable mid-round; if OTHER files error, stop and report.

---

### Task 3: The cohort cutover (`StudentRow` + `AdminShell`)

**Files:**
- Modify: `app/admin/StudentRow.tsx` (full component rewrite — target below)
- Modify: `app/admin/AdminShell.tsx` (`CohortTable` pane)

- [ ] **Step 1: `AdminShell.tsx` — REPLACE `CohortTable` with:**

```tsx
/** COHORT — the roster on the console's one register (2026-11-05 one-
 *  register ruling, superseding the Ledger-Table Rule): atabs- grid
 *  rows, its own per-tab art kept, columns per the split ruling
 *  (YEAR/PROGRAM out of the merged sub-line), 10/page pager kept. */
function CohortTable({ rows }: { rows: LiveRow[] }) {
  const [page, setPage] = useState(1);
  return (
    <section className="atabs-panel" aria-label="Cohort roster">
      <div className="atabs-panel-head">
        <h2 className="atabs-panel-title">Cohort roster</h2>
        <CohortArt />
      </div>
      <div className="atabs-heads atabs-cohort-grid atabs-label">
        <span>NAME</span>
        <span>YEAR</span>
        <span>PROGRAM</span>
        <span>TARGET ROLE</span>
        <span>SCORE</span>
        <span>LAST ACTIVE</span>
      </div>
      {slicePage(rows, page).map((r) => (
        <StudentRow
          key={r.id}
          id={r.id}
          isDemo={r.id === "neil"}
          name={r.name}
          year={r.year}
          program={r.program}
          career={r.career}
          score={r.score}
          pending={r.pending}
          belowAvg={r.belowAvg}
          noActivity={r.events === 0}
          active={r.active}
        />
      ))}
      <Pager page={page} pages={pagesOf(rows.length)} setPage={setPage} />
    </section>
  );
}
```

(The `cohART`'s `ct-art` class stays — the register rule only bans new hooks; the art class is shared furniture.)

- [ ] **Step 2: `StudentRow.tsx` — REPLACE the return block and props** (imports: drop `MouseEvent`? NO — row click stays; keep `Link`/`useRouter`):

```tsx
export default function StudentRow({
  id,
  name,
  year,
  program,
  career,
  score,
  pending,
  belowAvg,
  noActivity,
  active,
  isDemo = false,
}: {
  id: string;
  name: string;
  /** the year column ("4th Year"), split from the old merged sub-line */
  year: string;
  /** the program column ("Computer & IT"), its sibling split */
  program: string;
  /** declared career, or null for "Still deciding" */
  career: string | null;
  /** computed integer, sub-scores already summed upstream */
  score: number;
  /** declared credentials waiting on the counselor audit (queue-backed) */
  pending: number;
  /** strictly under the cohort average (a measurement fact, never a verdict) */
  belowAvg: boolean;
  /** the state's event log is empty — nothing done since seeding */
  noActivity: boolean;
  active: string;
  isDemo?: boolean;
}) {
  const router = useRouter();

  const href = `/admin/student?student=${id}`;

  function onRowClick(e: MouseEvent<HTMLDivElement>) {
    if ((e.target as HTMLElement).closest("a")) return; // real links handle themselves
    router.push(href);
  }

  const marks: { label: string; tone: "warn" | "blue" }[] = [];
  if (pending > 0) marks.push({ label: `NEEDS AUDIT — ${pending}`, tone: "warn" });
  if (belowAvg) marks.push({ label: "BELOW AVG", tone: "blue" });
  if (noActivity) marks.push({ label: "NO ACTIVITY YET", tone: "blue" });

  return (
    <div
      className={`atabs-row atabs-cohort-grid${isDemo ? " atabs-row-demo" : ""}`}
      onClick={onRowClick}
    >
      <div className="atabs-cellname">
        <span className="atabs-name">
          <Link className="atabs-name-link" href={href}>
            {name}
          </Link>
          {isDemo && <span className="atabs-chip atabs-chip-warn">DEMO</span>}
        </span>
        {marks.length > 0 && (
          <span className="atabs-marks">
            {marks.map((m) => (
              <span className={`atabs-chip atabs-chip-${m.tone}`} key={m.label}>
                {m.label}
              </span>
            ))}
          </span>
        )}
      </div>
      <span className="atabs-meta">{year}</span>
      <span className="atabs-copy">{program}</span>
      <span className="atabs-copy">{career ?? "Still deciding"}</span>
      <span className="atabs-num">{score}</span>
      <span className="atabs-meta">{active}</span>
    </div>
  );
}
```

Notes: `sub` prop is DELETED from StudentRow's interface (retired from the roster); the old `s-`/`chip mark-*` classes are dead after this file's cutover. If any other consumer imports StudentRow (grep first — it should be only AdminShell), stop and report.

- [ ] **Step 3: CSS — append to `app/admin/admin-tabs.css`:**

```css
/* ---------- the cohort joins the register (one-register round,
   2026-11-05; the real <table> retired, the grid-row faces shared):
   column proportions carried over from the ct-table widths, the
   name-chips wrap under the name, the whole row navigates. */
.v7admin .atabs-cohort-grid {
  display: grid;
  grid-template-columns: minmax(220px, 26fr) minmax(72px, 8fr) minmax(150px, 18fr) minmax(180px, 22fr) minmax(64px, 8fr) minmax(110px, 14fr);
  gap: 8px 14px;
  align-items: center;
}
.v7admin .atabs-cohort-grid.atabs-row {
  cursor: pointer;
}
.v7admin .atabs-name-link,
.v7admin .atabs-marks {
  display: block;
}
.v7admin .atabs-marks {
  margin-top: 4px;
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
}
.v7admin .atabs-copy {
  font: 400 12.5px/1.5 Roboto, system-ui, sans-serif;
  color: var(--v-ink2);
}
.v7admin .atabs-num {
  font: 500 13px/1.4 Roboto, system-ui, sans-serif;
  font-variant-numeric: tabular-nums;
  color: var(--v-ink);
}
.v7admin .atabs-panel-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 18px 10px;
}
.v7admin .atabs-panel-title {
  margin: 0;
  font: 600 15px/1.3 Roboto, system-ui, sans-serif;
  color: var(--v-ink);
}
.v7admin .atabs-row-demo {
  border-left: 3px solid var(--v-blue-deep);
}
```

Then RETIRE the dead blocks from `app/admin/admin.css`: grep each candidate (`.v7admin .ct-table ...`, `.ct-head`, `.cohort-table`, `.s-row`, `.s-name`, `.s-career`, `.s-score`, `.s-active`, `.demo-tag`, `.s-sub`, `.s-name-line`, `.s-name-link`, `.s-marks`, `chip.mark-*`) — delete rules whose consumers are now ZERO after this cutover (StudentRow was their only consumer; verify with grep before each delete). KEEP `.v7admin .ct-art` (shared art face). ALSO check the responsive block around line 750 — delete the cohort re-grid subsection there, and add a mobile collapse for the new grid in `admin-tabs.css` scoped to `@media (max-width: 720px)`: hide YEAR + PROGRAM (`display: none` on those grid areas is impossible to target without nth — so give the cells `data-col` attributes? NO — instead give YEAR/PROGRAM cells a class `.atabs-col-collapsible` in StudentRow and hide THAT class in the media query):

Correction for the implementer: in the StudentRow target above, add `className="atabs-col-collapsible"` to the YEAR and PROGRAM spans; heads' YEAR/PROGRAM spans get the same class; then:

```css
@media (max-width: 720px) {
  .v7admin .atabs-cohort-grid .atabs-col-collapsible {
    display: none;
  }
  .v7admin .atabs-cohort-grid {
    grid-template-columns: minmax(200px, 1fr) minmax(150px, 1fr) 64px 110px;
  }
}
```

(Keep heads and rows in lockstep — if the heads' spans need the class too, apply it there.)

- [ ] **Step 4: Run** `npx vitest run scripts/verify-pager.test.ts` — expect 24 passing (19 + 5).

- [ ] **Step 5: NO commit.** Report the diff stat.

---

### Task 4: Header art + heads for the slots

**Files:**
- Modify: `app/admin/slots.tsx` (two art components + two panel heads)

- [ ] **Step 1: Add the art components** (above `AdminApprovalsSlot`, same `ct-art` face as CohortArt/AuditArt — 96×48, aria-hidden, flat neutral + blue-wash shapes):

```tsx
/** ApprovalsArt — the APPROVALS head (one-register round 2026-11-05):
 *  a request slip behind the decision seal. Metaphor, not data. */
function ApprovalsArt() {
  return (
    <svg className="ct-art" width="96" height="48" viewBox="0 0 96 48" aria-hidden="true">
      <g transform="translate(8 9) rotate(-4)">
        <rect width="30" height="30" rx="4" fill="#F1F3F4" />
        <rect x="5" y="8" width="14" height="2.4" rx="1.2" fill="#5F6368" opacity="0.45" />
        <rect x="5" y="13" width="20" height="2.4" rx="1.2" fill="#5F6368" opacity="0.45" />
        <rect x="5" y="18" width="10" height="2.4" rx="1.2" fill="#5F6368" opacity="0.45" />
      </g>
      <g transform="translate(44 6)">
        <rect width="36" height="34" rx="6" fill="var(--v-blue-wash)" />
        <circle cx="23" cy="17" r="7.5" fill="#0842A0" opacity="0.85" />
        <circle cx="23" cy="17" r="4.2" fill="none" stroke="#FFFFFF" strokeWidth="2" strokeDasharray="2.4 2.2" />
      </g>
    </svg>
  );
}

/** AccountsArt — the ACCOUNTS head: a stack of identity cards with the
 *  front one in the blue-wash moment. Metaphor, not data. */
function AccountsArt() {
  return (
    <svg className="ct-art" width="96" height="48" viewBox="0 0 96 48" aria-hidden="true">
      <g transform="translate(6 14) rotate(-6)">
        <rect width="30" height="20" rx="4" fill="#F1F3F4" />
      </g>
      <g transform="translate(18 10) rotate(-2)">
        <rect width="30" height="20" rx="4" fill="#F1F3F4" stroke="#FFFFFF" strokeWidth="2" />
      </g>
      <g transform="translate(34 6)">
        <rect width="42" height="30" rx="7" fill="var(--v-blue-wash)" />
        <circle cx="11" cy="15" r="4.5" fill="#0842A0" />
        <rect x="20" y="8" width="17" height="3" rx="1.5" fill="#0842A0" opacity="0.6" />
        <rect x="20" y="14" width="11" height="3" rx="1.5" fill="#0842A0" opacity="0.35" />
      </g>
    </svg>
  );
}
```

- [ ] **Step 2: Panel heads with titles + art** — inside `AdminApprovalsSlot`'s `<section className="atabs-panel">`, as the FIRST child:

```tsx
      <div className="atabs-panel-head">
        <h2 className="atabs-panel-title">Counselor approvals</h2>
        <ApprovalsArt />
      </div>
```

Inside `AdminAccountsSlot`'s section, its first child:

```tsx
      <div className="atabs-panel-head">
        <h2 className="atabs-panel-title">Staff accounts</h2>
        <AccountsArt />
      </div>
```

- [ ] **Step 3: EMAIL column split (both slots).** Approvals: the name cell's email sub-line (`<span className="atabs-line atabs-small">{r.email}</span>`) moves OUT of `atabs-cellname` into its own grid cell placed right after the name cell; heads gain `<span>EMAIL</span>` after APPLICANT (grid grows to 7 — extend the `.atabs-appr-grid` definition's column count in admin-tabs.css accordingly following its existing pattern). Accounts: same split (email out of `atabs-idcell`'s stacked lines; heads gain EMAIL after ACCOUNT; `.atabs-acc-grid` gains a column). Keep every other cell verbatim.

- [ ] **Step 4: Run** `npx vitest run scripts/verify-pager.test.ts` — expect 24 passing.

- [ ] **Step 5: NO commit.** Report.

---

### Task 5: Full verification

- [ ] `npx vitest run scripts/` — all suites green
- [ ] `npx tsc --noEmit` — 0
- [ ] `npm run build` — clean, no app/admin warnings
- [ ] `git status --short` — report the EXACT list (expect: slots.tsx, verify-pager.test.ts, AdminShell.tsx, StudentRow.tsx, page.tsx, admin-tabs.css, admin.css, + the unowned docs/*)
- [ ] NO commit. Final report accumulates everything for the morning gate.

---

## Self-review

- Spec coverage: one register (Tasks 3-4), splits YEAR/PROGRAM (2-3) + EMAIL (4), art everywhere (3 CohortArt kept, 4), skeleton on the new furniture — WAIT: gap. `CohortSkeleton` in console-skeleton.tsx still clones `<table className="ct-table">` — dead markup after the cutover. Task 3.5 (inside Task 3, between steps 3 and 4): REPLACE `CohortSkeleton`'s `<table>` block with the blind atabs- furniture — heads row (6 spans, `.skel` label pills at the col widths) + 6 blind `atabs-row atabs-cohort-grid` divs (cellname pill pair, 4 meta/copy pills, score pill) + existing `PagerGhost` last. The ROSTER_ROWS array and the `aria-hidden` section stay.- Pins for it are already in Task 1 ("the cohort skeleton mirrors the new furniture").
- Presence counts: Task 1 pins = 6; prior 19 → total 25 green.
- Presence counts: Task 1 pins = 6; prior 19 → total 25 green.
- Type consistency: `year`/`program` flow page.tsx → AdminShell → StudentRow; `BlindRows` stays slot-local; art faces share `ct-art`.
