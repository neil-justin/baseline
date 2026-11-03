# Pathway Cutover — D2 Walk Replaces My Plan — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the My Plan surface (Plan/Resources tabs) with the D2 flat canonical walk, and graduate the mock's suggestion algorithm into the real engine — surface is the priority ahead of the Nov 7 defense.

**Architecture:** Three additive waves then a cutover: (A) the satisfaction-tier picker lands in `lib/engines` with regression tests while the old engine still feeds the existing table; (B) the resource fixture audit fields (`access`, `form`) and per-claim `learnNotes` are authored for the demo-slice careers first; (C) `PathwayTabs` is rewritten as the walk (presentation graduated from `mockup/variant-d2.*`), the tabs retire, and e2e hooks are re-pointed in the same landing; (D) mock scaffolding is deleted. The O\*NET-as-law required-set (whole map, sourceTag as provenance) is already landing via the background migration in `mockup/canon.ts`; Wave C consumes that shape.

**Tech stack:** Next.js 16 App Router, TypeScript strict, vitest (fixture-level tests in `scripts/*.test.ts`), hand-written scoped CSS under the v7 law (`DESIGN.md`), Playwright e2e in `e2e/`.

**Law that binds every task:** evidence chips verbatim (`Verified ·✓` / `Checked ·✓✓` / hatched `Self-reported`); every numeral tabular; no red; no animation/transition; blue = action only, green = earned only, amber = working only; draft copy is user-owned. Source: `DESIGN.md`, `CONTEXT.md`.

---

## File structure (wave map)

| Wave | Create | Modify | Delete |
|---|---|---|---|
| A | `lib/engines/suggestions.ts`, `scripts/verify-suggestions.test.ts` | `lib/types.ts` (Resource fields) | — |
| B | — | `lib/fixtures/resources.ts` (audit fields + learnNotes, demo slice), `lib/types.ts` | — |
| C | `lib/engines/walk.ts`, `app/(app)/pathway/walk.css` | `app/(app)/pathway/PathwayTabs.tsx` (full rewrite), `app/(app)/pathway/page.tsx`, `e2e/*` hook re-points | old tab markup (in-file) |
| D | — | — | `app/(app)/pathway/mockup/**` |

**PRECONDITION:** the background O\*NET migration (canon.ts + `scripts/verify-canon.test.ts`) must be COMMITTED before Wave C starts. Waves A/B can start immediately.

---

## Wave A — Engine graduation: satisfaction-tier picker

### Task A1: Resource audit-field types

**Files:**
- Modify: `lib/types.ts` (the `Resource` interface, near line 130–180; sourceTag block at 135–143 stays)

- [ ] **Step 1: Add the audit fields to `Resource`**

Insert after the `skillsAddressed` property of `Resource`:

```ts
  /* ── the suggestion-audit layer (2026-11-03 rulings) ──
   * access: the takeability fact ("free" can no longer do three jobs).
   *   direct    — open URL, learn, no gate
   *   account   — free with a (free) signup
   *   exam-paid — content free to study; the credit itself is a paid exam
   *   paidUni   — costs pesos (never holds the suggested slot)
   * form: content-shape gate (taught-only catalog ruling).
   *   taught    — the URL opens teachable content
   *   reference — readable material, no teaching flow
   *   landing   — admin/index/search/marketing page: no learnable content
   * Rows WITHOUT these fields are UNVETTED: the walk renders the honest
   * "audit pending" wait-state for their skills, never a pretend pick.
   * learnNotes: the per-claim learn line ("why this teaches this skill"),
   * keyed by skill name — authored content, user-edited (spec §6). */
```

```ts
  access?: AccessState;
  form?: "taught" | "reference" | "landing";
  learnNotes?: Record<string, string>;
```

and the union, placed near `BarSource`:

```ts
export type AccessState = "direct" | "account" | "exam-paid" | "paidUni";
```

(Read `lib/types.ts` first — if a `paid` literal already exists elsewhere use `"paid"`; the engine gate in A2 must match this union EXACTLY.)

- [ ] **Step 2: Typecheck** — `npx tsc --noEmit` → exit 0 (fields are optional; no fixture edits yet).

- [ ] **Step 3: Commit** — `git add lib/types.ts && git commit -m "feat(types): Resource audit fields — access/form/learnNotes (2026-11-03 rulings)"`

### Task A2: The picker + regression tests

**Files:**
- Create: `lib/engines/suggestions.ts`
- Test: `scripts/verify-suggestions.test.ts` (match the vitest conventions of `scripts/verify-fixtures.test.ts` — read it first)

- [ ] **Step 1: Write the failing tests**

```ts
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
```

- [ ] **Step 2: Run** — `npx vitest run scripts/verify-suggestions.test.ts` → FAIL (module not found).

- [ ] **Step 3: Implement `lib/engines/suggestions.ts`**

The rule bank (spec §4, all user-ruled 2026-11-03):
tier 1 platform check (`CHECK_SKILL[resource.id] === skill`), tier 2 creditingBody, tier 3 countsTowardEntryPath, tier 4 free beats paid, tier 5 resource id A–Z; durationHours OUT of ranking; narrow-claim ("most dedicated") bonus DEAD; eligibility = taught form + self-serve access; unvetted rows count, never win.

```ts
import { CHECK_SKILL } from "@/lib/fixtures/checks";
import type { AccessState, Career, Resource } from "@/lib/types";

const SELF_SERVE = new Set<AccessState>(["direct", "account", "exam-paid"]);

export interface MaterialPick {
  resource: Resource | null;
  /** authored learn line: resource.learnNotes[skill] */
  learn: string | null;
  access: AccessState | null;
  /** claims that exist but failed the audit gates */
  unvetted: number;
}

const creditBody = (r: Resource): string | null =>
  /* corroborated by the route render the old build derived from this field */
  r.creditingBody ?? null;

const tierScores = (r: Resource, skill: string): [number, number, number, number] => [
  CHECK_SKILL[r.id] === skill ? 0 : 1,
  creditBody(r) ? 0 : 1,
  r.countsTowardEntryPath ? 0 : 1,
  r.cost === "free" ? 0 : 1,
];

const canWin = (r: Resource): boolean =>
  r.form === "taught" && r.access != null && SELF_SERVE.has(r.access);

/** THE suggestion rule (spec §4). Deterministic; claim pools only. */
export function pickMaterial(career: Career, skill: string): MaterialPick {
  const pool = RESOURCES_BY_CAREER(career.id).filter((r) =>
    r.skillsAddressed.includes(skill)
  );
  const vetted = pool.filter(canWin);
  const unvetted = pool.length - vetted.length;
  if (vetted.length === 0) return { resource: null, learn: null, access: null, unvetted };

  const ranked = [...vetted]
    .map((r) => ({ r, s: tierScores(r, skill) }))
    .sort((a, b) => {
      for (let i = 0; i < a.s.length; i++) if (a.s[i] !== b.s[i]) return a.s[i] - b.s[i];
      return a.r.id.localeCompare(b.r.id);
    })
    .map(({ r }) => r);

  const w = ranked[0];
  return {
    resource: w,
    learn: w.learnNotes?.[skill] ?? null,
    access: w.access ?? null,
    unvetted,
  };
}

/* the typed catalog filter — imported once at module top:
   import { RESOURCES } from "@/lib/fixtures/resources";
   const RESOURCES_BY_CAREER = (id: string) =>
     RESOURCES.filter((r) => r.careerId === id); */
```

(Pull the `RESOURCES` import up to the module top as the comment states — do not leave it inline.)

- [ ] **Step 4: Run** — `npx vitest run scripts/verify-suggestions.test.ts` → PASS.

- [ ] **Step 5: Full typecheck + fixtures** — `npx tsc --noEmit && npx vitest run scripts/verify-fixtures.test.ts` → both green.

- [ ] **Step 6: Commit** — `git add lib/engines/suggestions.ts scripts/verify-suggestions.test.ts && git commit -m "feat(engines): satisfaction-tier suggestion picker (user-ruled 2026-11-03)"`

**The old engine (`sortResourcePool` in pathway/page.tsx) stays in place through Wave A/B** — the table still runs the defended logic until Wave C switches the page.

---

## Wave B — FULL-ROSTER fixture audit (user bar, 2026-11-03: "all roles should have a suggested resource for their skills; suggestions must be taught pages; must actually satisfy the skill")

**Definition of done = a coverage test that stays green forever after:**

### Task B0: The coverage gate
**Files:**
- Test: `scripts/verify-coverage.test.ts`

- [ ] **Step 1: Write the acceptance test** — iterate `CAREERS` × `career.skills`; for each skill run `pickMaterial(career, skill)` and assert: `resource != null`, `resource.form === "taught"`, `access ∈ {direct, account, exam-paid}`, `learnNotes[skill]` non-empty. The test prints the failing set as a work queue (career → skill → reason: unvetted | no-claim | not-taught | not-self-serve | no-learn-line). Run: `npx vitest run scripts/verify-coverage.test.ts` → **expected RED initially** (that red list IS the audit work queue).

### Task B1: Audit + fill, per career until the gate is green
**Files:**
- Modify: `lib/fixtures/resources.ts` (+ occasionally `lib/fixtures/checks.ts` when a found resource pairs a platform check)
- Modify: `lib/types.ts` (only if Task A1 left a gap)

Per career (start with the demo slice `da, qa, book, swd, its`, then the remaining 31):

- [ ] **Step 1: Classify existing claims** — apply `access` + `form` from each row's fixture audit comments (the "fetched LIVE" facts). Landing/reference rows stay in data but can never win (the picker gates them); the coverage test only counts taught wins.
- [ ] **Step 2: Fill the holes** — for every skill the test flags with `no-claim`/`not-taught`: find a real, taught, self-serve resource (web search + live fetch to verify 200 + content is teachable, not a landing page); add the row (`id` per the fixture convention, `access`, `form: "taught"`, `skillsAddressed: [skill]`, `creditingBody` when one exists, `url` deep-linked). Every new row carries a fixture-comment citing the live check (repo tradition).
- [ ] **Step 3: Author the learn line** — `learnNotes[skill]` per claim, drafted from the resource's actual content, user-reviewable (mark `learn draft — user review pending` in the row comment when drafted by an agent).
- [ ] **Step 4: Gate check** — `npx vitest run scripts/verify-coverage.test.ts` → the career's red list shrinks to zero before moving to the next career.
- [ ] **Step 5: Commit per career batch** — `feat(fixtures): resource audit — <career(s)> (taught-only, self-serve, learn lines)`.

**Honesty valve:** if a skill genuinely has NO taught self-serve resource on the open web, the row that satisfies the bar cannot exist — the test stays red for it and the fixture comment marks `adviser-only skill` — the user rules on each such case individually (they are the content owner). The plan does not fabricate.

---

## Wave C — Surface cutover: the walk IS `/pathway`

### Task C1: `lib/engines/walk.ts` — the canonical walk builder

**Files:**
- Create: `lib/engines/walk.ts`

Required-set law (O\*NET-as-law, user-ruled, spec §3): required = the whole role map; `sourceTag` = provenance only. Sorted: core tier first (`tier === "core"`), then catalog order — the O\*NET-law ordering (the resort is REQUIRED here because the steps engine's gap-rank no longer defines this page's order).

```ts
import { openSkills } from "@/lib/engines/gaps";
import { CHECK_SKILL } from "@/lib/fixtures/checks";
import { pickMaterial } from "@/lib/engines/suggestions";
import { roundHalfDown, WEIGHTS } from "@/lib/engines/score";
import type { BarSource, Career } from "@/lib/types";

export interface WalkNode {
  skill: string;
  what: string;
  state: BarSource | "open";
  effect: { from: number; to: number } | null;
  material: { title: string; cost: string; hrs: string; url: string | null; learn: string | null } | null;
  hasCheck: boolean;
  noCheck: boolean;
  startHere: boolean;
  unvetted: number;
}

export interface WalkView {
  careerName: string;
  nodes: WalkNode[];
  closed: number;
  total: number;
}

function costText(r: Pick<Resource from lib/types, "cost">): string {
  return r.cost === "free" ? "free" : `₱${r.cost.peso}`;
}

/** THE My Plan walk (O*NET-as-law): the whole map, core-first, fixed. */
export function buildWalk(
  career: Career,
  bars: Record<string, { source: BarSource }>,
  transferred: string[]
): WalkView {
  const skills = [...career.skills]
    .map((s, i) => ({ s, i }))
    .sort((a, b) =>
      a.s.tier === b.s.tier ? a.i - b.i : a.s.tier === "core" ? -1 : 1
    )
    .map(({ s }) => s);

  const closedCount = Object.keys(bars).filter((k) =>
    career.skills.some((s) => s.name === k)
  ).length;
  const mapSize = career.skills.length;
  const spAt = (n: number) => roundHalfDown((WEIGHTS.sp * (closedCount + n)) / mapSize);

  let openIdx = 0;
  const nodes = skills.map((s): WalkNode => {
    const state = (bars[s.name]?.source ?? "open") as WalkNode["state"];
    const open = state === "open";
    const effect = open ? { from: spAt(openIdx), to: spAt(openIdx + 1) } : null;
    if (open) openIdx += 1;
    const pick = pickMaterial(career, s.name);
    return {
      skill: s.name,
      what: s.what,
      state,
      effect,
      material: pick.resource
        ? { title: pick.resource.title, cost: costText(pick.resource), hrs: `~${pick.resource.durationHours} hrs`, url: pick.resource.url ?? null, learn: pick.learn }
        : null,
      hasCheck: false,
      noCheck: false,
      startHere: false,
      unvetted: pick.unvetted,
    };
  });

  /* the walk's start-here pointer = FIRST OPEN node (canonical-pointer
     ruling); hasCheck/noCheck ride the material's check pairing */
  for (const n of nodes) {
    if (n.state === "open") { n.startHere = true; break; }
  }
  for (const n of nodes) {
    if (!n.material) continue;
    const byId = CHECK_SKILL[...] // resolve via career+skill → see suggestions.ts
  }

  return { careerName: career.name, nodes, closed: closedCount, total: mapSize };
}
```

Type note: import `Resource` and the CHECK helper properly (the `Resource` type comes from `lib/types`; resolve the check pairing as `CHECK_SKILL[pick.resource.id] === s.name` — set `hasCheck`/`noCheck` from that comparison; the code comment above marks the intent, the engineer wires the two loops into the single node map.

- [ ] **Step 1: Implement as above (doctrine: exact fields, sorting law, pointer law).**
- [ ] **Step 2: Typecheck** — exit 0.

### Task C2: PathwayTabs rewrite — walk replaces the tabs

**Files:**
- Modify: `app/(app)/pathway/PathwayTabs.tsx` (full rewrite)
- Modify: `app/(app)/pathway/page.tsx` (feed the walk)
- Create: `app/(app)/pathway/walk.css` (content = `app/(app)/pathway/mockup/variant-d2.css`, root class kept `.v7mock-d2`, plus the additions already committed there)

- [ ] **Step 1: page.tsx** — replace `buildPlan`/`buildResources` calls with:

```tsx
const walk = buildWalk(career, state.bars, state.decisions.verifiedTransferred);
return <PathwayTabs careerName={career.name} undecided={false} walk={walk} />;
```

Keep: `requireStudent`/`getStudentView`/undecided branch (defaultElement card stays in PathwayTabs). DELETE: `buildPlan`, `buildResources`, `pickResource`/`sortResourcePool` (dead after A2), unused imports (`gaps` engines stay only where walk.ts lives now), the `SpecLite` projection and mock imports.

- [ ] **Step 2: PathwayTabs.tsx rewrite** — presentation is the committed `variant-d2.tsx` graduated:
  - Copy the variant's row grammar verbatim (skill row, chips via the closedChip helper, SP register, working-on `aria-pressed` toggle, learn line, folded access word, honest wait-states incl. the unvetted-vs-adviser distinction, spine geometry classes from walk.css).
  - DELETE from the component: the hash-mockup effect, the `MockupMount` import, variant switching, the career-preview `<select>` (mock chrome never ships), the mocked `buildPreview` wiring.
  - Head: `<h2>Your path to {careerName}</h2>` + `<b>{closed}</b> of {total} required skills checked` + the standing line (spec §6 copy) + offPathNote is NOT rendered (O\*NET law: none exists).
  - e2e hooks (preserve byte-exact where carried): keep `.q-skill` on skill names, keep a `.lead-mono` counter on the head, root class `.v7plan` retained, root element `<div className="v7plan">` with the walk inside.
  - The band header (`.band` My Plan h1 + career line) stays as the page band; the walk replaces BOTH tab panels — no `.ptabs` toolbar, no TablePager import.
- [ ] **Step 3: Typecheck + run existing vitest** — green (no fixture deps broken).
- [ ] **Step 4: Delete the e2e suite (user ruling 2026-11-03: "I don't care about that e2e demo. that should be remove").**

```
git rm -r e2e/
```

No hook re-pointing, no test rewrites — the Playwright suite is removed wholesale in the cutover commit. The vitest suite (`scripts/*.test.ts`) STAYS (it is the regression net: canon, fixtures, suggestions).

- [ ] **Step 5: Verify** — `npx tsc --noEmit && npx vitest run` → both green (no Playwright run — the suite is gone).

- [ ] **Step 6: Commit** — `feat(pathway): cutover — D2 walk is My Plan; engine picker live; tabs + e2e retired (user-ruled 2026-11-03)`.

### Task C2-note (risk): defense demo de-risk
`git tag pre-cutover d419266` — rollback reference only; walkthrough careers (book/da/qa) must read COMPLETE in the walk before the defense, else surface reverts to the tag until reviewed. Fallback procedure, not a blocker: the plan proceeds.

---

## Wave D — Cleanup

### Task D1
- [ ] Delete `app/(app)/pathway/mockup/**` (variants a/b/c/d1/d3, Mount, stages, canon, suggest, access, preview, mockup.css) — their graduates (engine + component) are live.
- [ ] Strip the Playwright runner leftovers: remove the e2e scripts (e.g. `test:e2e` keys) from `package.json` scripts and any playwright.config referenced only by the deleted suite. The `@playwright/test` package entry stays until a post-defense dependency pass (dependency rule: never uninstall unilaterally here).
- [ ] `npx tsc --noEmit && npx vitest run` green; commit `chore(pathway): mock scaffolding retired after cutover`.

---

## Self-review notes (already applied)

- Spec §8 maintainability: picker (A2), audit-metadata-on-row (B1), one-engine-picker (C1 uses it), LINK-audit script is a POST-DEFENSE wave (not here — YAGNI for the defense window).
- The working-on persistence decision stays deferred (spec §6): the cutover ships the LOCAL marker exactly as the mock did.
- Alternates display: not in this plan (spec noted "choice at implementation" — the walk shows THE material; alternates sheets are a post-defense wave).
