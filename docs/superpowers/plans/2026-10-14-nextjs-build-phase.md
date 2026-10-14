# Next.js Build Phase — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Port the verified `prototype/` static demo into a Next.js 16.3 app — same world, computed-not-painted score, demo-arc beats 1–10 wired end-to-end, E2E-verified against `features/content/_fixture-math.md`.

**Architecture:** Direct port — prototype markup + its CSS system (The Index) become the app's foundation; interactions become small client components; all scoring/gap/pathway logic lives in pure TS engines called by route handlers; fixture data layer mirrors `_fixture-math.md` exactly. Execution is phased: shared foundation built serially and frozen, then one agent per surface in parallel with a strict file-ownership contract, then E2E integration, then the dry-run.

**Tech Stack:** Next.js 16.3 (App Router, TS) · Tailwind v4 (`@theme` mapping) + ported global CSS · local Supabase (fallback: JSON-file store behind identical `db.ts` signature) · Playwright E2E.

**Spec:** `docs/superpowers/specs/2026-10-14-nextjs-build-design.md` · **Canon:** `.scratch/career-readiness-platform/features/content/_fixture-math.md` (contradictions lose to it) · **Source of truth for all markup:** `prototype/*.html` + `prototype/css/*` (this is the direct-port contract — port, don't redesign).

---

## Execution rules (apply to every task)

1. **Single committer (me).** Agents never run `git`. I make one atomic commit per unit with the exact message given in each task.
2. **File ownership.** FROZEN shared files after Task 5 exact list: `package.json`, `app/globals.css`, `app/fonts/*`, `app/layout.tsx`, `components/**`, `lib/**` wholesale (engines, fixtures, db, session, demo-walk), `app/api/**`, `next.config.ts`, `tsconfig.json`, `postcss.config.mjs`, `playwright.config.ts`. Agent dirs are exactly the nine directories in Tasks 6–14. Any shared-file need goes to me; I batch it, land it, re-point the agent. This makes git conflicts structurally impossible. Surface agents (Tasks 6–14) may write ONLY inside their own directory listed in the task. Any shared-file need goes to me; I batch it, land it, re-point the agent. This makes git conflicts structurally impossible.
3. **The port contract for every surface agent:** markup and classes come 1:1 from the named `prototype/*.html` file; global classes from `app/globals.css` (pre-ported); per-surface `<style>` blocks become the page's `page.module.css` (copy verbatim); inline `<script>` behaviors become one client component per page (TSX, `"use client"`); `motion.js` behavior comes from the shared `<Measure>` machinery (Task 2) — never re-implement count-up/reveal inside a surface.
4. **Canon rule.** Every displayed number must be computed from app state, which derives from `_fixture-math.md` beat states. If a brief contradicts `_fixture-math.md`, `_fixture-math.md` wins — report the contradiction, don't code it in.
5. **Never render:** AI interview, resume builder, university finder, thesis module names (M1–M12 / thesis feature names), "AI-generated", gamified language (points/streaks/badges/unlock). Every claim carries its cited source (catalog extract §landing-stats).
6. **Offline contract.** Fonts self-hosted woff2 with `font-display: block` (already in `prototype/fonts/`); no CDN, no external images, no hosted anything. Demo width contract: 390 / 768 / 1440 / 1920.
7. **Local-only demo.** Everything must run with `npm run build && npm start` on a laptop, no network.

---

## Phase 0 — skeleton (serial, me)

### Task 0: Repo bootstrap

**Files:**
- Create: `.gitignore` (exists — verify it covers `node_modules/`, `.next/`)
- Create: `package.json`, `tsconfig.json`, `next.config.ts`, `postcss.config.mjs`, `app/layout.tsx` (shell; content in Task 2)

- [ ] **Step 1: Verify the pending-decision sweep state.** Confirm the four 2026-10-13 decisions are applied in the prototype (stage-① queue re-cut, "People skills" vocabulary, onboarding counter copy, fixtures ship-as-is). If any pending sweep edits exist in `.scratch/` plans but not in `prototype/*.html`, apply them to the prototype first (they are the port source). Commit only if edits were needed.
- [ ] **Step 2: Scaffold Next.js manually** (not `create-next-app` — this dir is not empty). Write:

```json
// package.json
{
  "name": "thesis-career-path-readiness",
  "private": true,
  "scripts": { "dev": "next dev", "build": "next build", "start": "next start" },
  "dependencies": { "next": "16.3.0", "react": "^19", "react-dom": "^19" },
  "devDependencies": {
    "typescript": "^5", "@types/node": "^22", "@types/react": "^19",
    "@playwright/test": "^1", "vitest": "^3"
  }
}
```

```ts
// next.config.ts
import type { NextConfig } from "next";
const nextConfig: NextConfig = { reactStrictMode: true };
export default nextConfig;
```

Tailwind v4 via PostCSS (`postcss.config.mjs`: `export default { plugins: { "@tailwindcss/postcss": {} } }`, devDep `tailwindcss@^4` + `@tailwindcss/postcss`).
- [ ] **Step 3: Docker/Supabase gate (timebox 45 min).** Test `docker run --rm hello-world` with WSL integration. If it works → keep Supabase local on the roadmap (Task 5 path A); if not → record the fallback decision in this file's UPDATE note and use the JSON store (Task 5 path B) behind the same `db.ts` interface. **Either way, Task 4's engine code and all surface agents see identical `db.ts` signatures — no agent ever imports Supabase directly.**
- [ ] **Step 4: `npm install`, verify `npm run build` on an empty app passes.**
- [ ] **Step 5: Initial commit.** If `.git` has zero commits, first: `git add -A && git commit -m "chore: repo state at build-phase start (prototype + docs)"`. Then after scaffold: `git commit` per unit.

### Task 1: Design tokens + global CSS port

**Files:**
- Create: `app/globals.css` (from `prototype/css/styles.css` + `app.css` + `motion.css`, concatenated in that order with only path fixes)
- Create: `app/fonts/` (copy all 4 woff2 from `prototype/fonts/`)

- [ ] **Step 1:** Concatenate the three CSS files into `app/globals.css`; rewrite the `@font-face` URLs to `./fonts/…`. No other edits — this file IS the design system (The Index tokens, hairline vocabulary, segbar/gap-row/skill-row/q-band components, reveal system). Tailwind's `@tailwindcss/postcss` runs alongside; add a Tailwind `@theme` block mirroring the token values (colors `earned-green: #0B5F45` etc.) so any agent who reaches for a utility gets the world's values, while the ported classes remain the primary vocabulary.

```css
/* appended head of app/globals.css */
@import "tailwindcss";
@theme {
  --color-ground: #F4F5F4; --color-panel: #FFFFFF;
  --color-ink: #16181A; --color-ink-2: #515651; --color-ink-3: #666C66;
  --color-line: #DFE1DE; --color-line-soft: #EAEBE9;
  --color-earned: #0B5F45; --color-earned-deep: #08492F;
  --radius-slot: 2px; --radius-badge: 3px; --radius-panel: 6px;
}
```
- [ ] **Step 2: Verify** by rendering a throwaway page with `.app-nav`, `.segbar`, `.gap-row` markup — visual parity with `prototype/dashboard.html`. Expected: identical.
- [ ] **Step 3: Commit** — `feat: port The Index design system (tokens, fonts, shared CSS)`.

### Task 2: Shell + shared components

**Files:**
- Create: `app/layout.tsx` (root), `components/AppBar.tsx`, `components/Measure.tsx`, `components/CountUp.tsx`, `components/SegRubricBar.tsx`, `components/GapRow.tsx`, `components/HairlinePanel.tsx`, `components/SkillRow.tsx`, `components/Choice.tsx` (segmented 3-state), `components/QBand.tsx`, `components/OkBand.tsx`, `components/NextCard.tsx`, `components/Tickers.tsx`, `components/VBadge.tsx`, `components/Label.tsx` (mono tracked label), `lib/motion.ts`
- Modify: `app/layout.tsx` (mount globals)

- [ ] **Step 1: `lib/motion.ts`** — TS port of `prototype/js/motion.js`: count-up with width reservation (inline-block + min-width before first frame, digit-count change never re-wraps), reveal/re-unreveal via IntersectionObserver (threshold 0.18, rootMargin '0px 0px -6%'), `data-sequence` callback arming `.segbar i` transforms 160ms after count completes, full disable + instant final values under `prefers-reduced-motion`. Reveal/reset only toggle `transform`/`opacity`/custom props — never layout properties (CLS contract).
- [ ] **Step 2: Components** — each is the CSS-class wrapper JSX'd (they carry classes from `globals.css`; props are typed, no business logic):
  `AppBar` (sticky panel bar, brand-mark CSS square with the one decorative green 6px inset, 5-item nav from `app/` paths with `aria-current`, `NEIL · G11 · STEM` chip, sign-out → `/signin`); `SegRubricBar(props: {parts: {name,pct,earnedFrac}[]})` — flex segments `style={{flex: pct}}`, inner `<i style={{'--earn': frac}}>`, `armed` class gates the `scaleX` transition (1.1s cubic-bezier(0.16,1,0.3,1), 80ms stagger across segments); `GapRow` (name + 8px bar + `g-badge` mono badge with source mark `·✓`/`✓✓`/self-report flag; `--earn` scaleX fill); `CountUp(props: {to, dec?, dur?, sequenceArm?})`.
- [ ] **Step 3: `app/layout.tsx`** — ground background, `<main id="main">` slot, skip link, AppBar slotted via a layout group (marketing pages get the landing variant; app group gets the 5-item nav). Registry of client components (`"use client"` where interactive only).
- [ ] **Step 4: Verify** — a test page renders the gauge pattern (mini-index + readout 40/100 with SP 0.75 / CC 0.667 fracs) pixel-near-identical to `dashboard.html` beat-5 state. Playwright screenshot diff by eye + zero CLS entries ≥0.02.
- [ ] **Step 5: Commit** — `feat: app shell + shared instrument components (gauge, bars, count-up)`.

### Task 3: Fixture data (the canon, verified)

**Files:**
- Create: `lib/fixtures/catalog.ts`, `lib/fixtures/resources.ts`, `lib/fixtures/banks.ts`, `lib/fixtures/neil.ts`, `lib/fixtures/cohort.ts`, `scripts/verify-fixtures.ts`

- [ ] **Step 1: `catalog.ts`** — all **32** careers from `features/content/_catalog-extract.md` (12-row hero table + remaining 20). Each row: `{id, name, strand[] , raCode (dev-facing, string), skills: [{name, tier: "core"|"secondary", }], entryPath, roleSummary}`. **Skill maps verbatim from the extract**: SDA = programming logic(Python/Java), SQL, Git, debugging, API basics, unit testing, agile teamwork, technical documentation (8); DA = spreadsheets, SQL, data cleaning, dashboards (Power BI/Tableau), basic statistics, chart interpretation, report writing (7). Mark ⚠️ LLM-adjacency as a `watch` boolean (dev-facing; never rendered).
- [ ] **Step 2: `banks.ts`** — RIASEC 6-item compressed bank (onboarding.md OB-3a.3 verbatim) + type→top-3 map producing **IT Support Technician / Data Analyst / Software Developer** for the demo profile IAC; verification MCQ banks VMCQ-SWE-01 + VMCQ-DA-01 (onboarding.md OB-3b-3.4 gives exact SWE items; write DA twins in the same style, hand-verified); comprehension check for the money-shot resource: 5 Qs on Power BI dashboards basics, pass ≥4/5.
- [ ] **Step 3: `neil.ts`** — the beat-state machine, exactly `_fixture-math.md`'s table: setup(6-of-8 claims, SQL+Git verified → 40) → switch-dip(DA 0 closed → 10) → post-re-assessment(+3 self-claims + SQL transfers → 33) → money-shot(dashboards ·✓✓ + goal auto-complete → 51). Also: Python-course resource row; DA typed resource set (money shot = "Build your first dashboard" — Microsoft Learn, Power BI, free + course/doc/cert slices; Trendline: GA4-cert/doc display-only).
- [ ] **Step 4: `cohort.ts`** — 7 admin fixture students (values from `prototype/admin.html`'s JS object), Neil recomputes from live state; Marco (Electrician) and Jomar (Cook) with TESDA TOP resource pointers per edge-case-audit §3.
- [ ] **Step 5: `scripts/verify-fixtures.ts`** — run the engines (Task 4; stub engines acceptable to land first, full assertions land in Task 4 step 6) against each beat state and assert canon: beat setup **40** (SP 30 + CC 10) · switch dip **10** · post-re-assessment **33** (SP 23: 4-of-7 closed, 40×4/7 = 22.86 rounds half-down to 23) · money-shot **51** (SP 29 + TP 7 + CC 15). Run: `npx tsx scripts/verify-fixtures.ts` (or `vitest`). **This script is the "computed, never painted" proof and stays forever.**
- [ ] **Step 6: Commit** — `feat: fixture canon (32-career catalog, banks, Neil beat states, cohort)`.

### Task 4: Engines (pure TS, no framework imports) + API route handlers

**Files:**
- Create: `lib/engines/score.ts`, `lib/engines/gaps.ts`, `lib/engines/pathway.ts`, `lib/engines/verification.ts`, `lib/db.ts`, `app/api/state/route.ts`, `app/api/switch/route.ts`, `app/api/claim/route.ts`, `app/api/verify/route.ts`, `app/api/check/route.ts`, `app/api/goal/route.ts`, `app/api/demo/route.ts`
- Test: `scripts/verify-fixtures.ts` (extends Task 3 step 5)

- [ ] **Step 1: `score.ts`** — exact formulas, nearest-integer **round half down** (`.5` rounds down):

```ts
export const WEIGHTS = { sp: 40, es: 25, tp: 20, cc: 15 } as const;
export function computeScore(s: StudentState): Score {
  const sp = roundHalfDown(WEIGHTS.sp * s.closedBars / s.careerSkillMapSize);
  const es = 0;                                       // post-defense battery
  const tp = roundHalfDown(WEIGHTS.tp * s.stageOneDone / 3);
  const cc = (s.decided ? 5 : 0) + (s.hasActiveTrainingGoal ? 5 : 0) + (s.hasCompletedTrainingGoal ? 5 : 0);
  return { sp, es, tp, cc, total: sp + es + tp + cc };
}
function roundHalfDown(x: number): number { return Math.floor(x + 0.5 - 1e-9); }
```

- [ ] **Step 2: `gaps.ts`** — open set = career map minus closed (closed = `verified·✓ | checked·✓✓`; self-report claims occupy a bar but are flagged `claimed`, never count toward skills-match); `skillsMatch(career, demonstrated)` = unweighted "X of Y" (closed **excluding self-report**); ranking = tier weight (core ×3 / secondary ×1) → tie: free-PH-resource-first → stable catalog order; stages: ① next 3 highest-priority open, ② remainder, ③ cert/NC + portfolio milestones (degree route → subject/portfolio first). Goals never reorder.
- [ ] **Step 3: `verification.ts`** — MCQ grade, pass aggregation, aggregate-copy state class (3/3 · partial · 0/3 per onboarding.md OB-3b-3.7).
- [ ] **Step 4: `db.ts`** — interface both store backends share: `getStudent(id) · getCareer(id) · listCareers() · listResources(careerId?) · getBanks() · saveClaim(studentId, skill, level) · markVerified(studentId, skill) · closeBar(studentId, skill, source) · switchCareer(studentId, from, to) · addGoal(studentId, goal) · completeGoalAuto(studentId, resourceId) · getGoals(studentId) · addEvent(studentId, event) · getEvents(studentId)`. Path A (Docker OK): Supabase-local Postgres + `@supabase/supabase-js`; seed = SQL insert of fixtures. Path B (fallback): `lib/db/json-store.ts` reading/writing `data/state.json` — small, offline-safe, same signatures.
- [ ] **Step 5: Route handlers** under `app/api/*` call engines + `db` only (thin controllers). `POST /api/check` (comprehension check submit) is the money-shot chain trigger: pass ≥4/5 → `closeBar(dashboards, 'checked')` → auto-complete linked Training goal → add event. `POST /api/switch` (beat 6): verified skills + goals survive, gap bars + downstream reset (locked semantics), re-assessment records 3 new self-claims (+SQL transfers with its `·✓`).
- [ ] **Step 6: Extend `scripts/verify-fixtures.ts`** to drive the full beat chain through the engines (not the HTTP layer): assert headline 40 → 10 → 33 → 51 + beat-8 pathway order (remaining open: basic statistics → report writing → chart interpretation, free tie-break) + TP 7 + stage ① "1 of 3". Run; expected PASS.
- [ ] **Step 7: Commit** — `feat: scoring/gap/pathway engines + route handlers (canon-verified)`.

### Task 5: App stores skeleton (auth + demo state)

**Files:**
- Create: `lib/session.ts` (cookie session, seeded accounts), `lib/demo-walk.ts`
- Details: seeded sign-in against fixture accounts (Neil demo + 6 cohort); no registration complexity beyond the signup form writing a seeded-format account. Demo-state corridor: sign-in as Neil → app surfaces read Neil's live state from the store.

**Phase 0 exit gate:** `npm run build` passes; engines assert canon; `prototype/` untouched. Freeeze shared files.

---

## Phase 1 — parallel surface agents (one agent per directory; zero overlap)

Each agent gets: this file + its task below + the named content plan + surface brief (`.impeccable/surfaces/<name>.md`) + edge-case handoff §2 (its surface's section). Verification every agent runs before reporting: `npm run dev`, drive its states via a script or manually, capture 390/768/1440/1920 screenshots, zero horizontal overflow, CLS < 0.02 per state, no console errors. Report includes: files written, states verified, canon numbers observed (e.g. "switch dips 40→10").

### Task 6: Agent — Landing (`app/(marketing)/`)
**Owner dir: `app/(marketing)/`, plus `app/(marketing)/page.tsx`. Sources: `prototype/index.html`, `features/content/landing-auth.md`, catalog hero rows.**
Port the landing 1:1: three-stat band (6.0% / 12.9% / 38.2% — exact PSA source lines per `_catalog-extract` landing-stats block), 12-row index preview (`Showing 12 of 32` count line), sample readout **40 labeled SAMPLE**, rubric as "% of your score" proportions, evidence footer with EDCOM2 ₱69→74→96/hr, scanline + count-up wired through the frozen Measure machinery. No fake social proof or photos. Hero CTA → `/signup`.

### Task 7: Agent — Auth (`app/(auth)/signin|signup/`)
**Owner dir: `app/(auth)/`. Sources: `prototype/signin.html`, `signup.html`, `landing-auth.md`.** Port both forms; seeded-account sign-in hits `lib/session.ts`; signup = name/email/password (+role student/admin check? — per plan: auth without confirm-password, seeded accounts; signup writes a student row). Redirect: student → `/onboarding` (fresh) or `/dashboard` (has state); admin → `/admin`.

### Task 8: Agent — Onboarding (`app/(app)/onboarding/`)
**Owner dir: `app/(app)/onboarding/`. Sources: `prototype/onboarding.html`, `features/content/onboarding.md` (the single most detailed plan — 22 scripted states), `features/app-flow.md` §1.** One client-side stepper (strand → branch → 6 interest Qs → 3 suggestion cards → 8-row self-report → M8-lite framing prompt → verification mini-quiz → goal → OB-5 reveal). Beats 2–5 = the demo script table (onboarding.md, memorized input list) + all its empty/loading states; OB-5's segmented labels use "People skills … full battery after setup" vocabulary. The API calls it posts are the frozen ones (`/api/claim`, `/api/verify`, `/api/goal`).

**⚠️ CANON CONFLICT — resolved for the agent, do not re-litigate:** `onboarding.md` OB-3b-3.9/OB-3b-3.6 scripts a 3-question quiz (Programming logic ✓ · Git ✓ · Debugging ✗ → aggregate "2 of 3"), while `_fixture-math.md` says "verification quiz (5 items) passes 2 → SQL, Git verified". **`_fixture-math.md` wins (its header rule).** Implement: quiz draws one MCQ per top-claimed skill, max 5 (canon: 5 items for Neil's 6 claims, per OB-3b-3.2's own scope rule); passes = SQL + Git; aggregate "2 of 5" with partial-pass phrasing ("what you missed stays as your own rating"). Beat-5 arithmetic is canon-locked regardless: 6 claims of 8 → SP 30 + CC 10 → **headline 40 exactly** (Recipe A). If beat 5 doesn't read 40, the fixture seed is wrong, not the formula.

### Task 9: Agent — Dashboard (`app/(app)/dashboard/`)
**Owner dir: `app/(app)/dashboard/`. Sources: `prototype/dashboard.html`, `features/content/m1-dashboard.md`, `_fixture-math.md` beat-5 row.** Score band (readout 40, SP segbar 0.75), sub-rows, journey-row, next-step card (programming-logic course), tickers (6 of 8 · 2 confirmed ·✓, goal active), switch disclosure (⏳ default states for undecided + zero-progress + post-completion students per edge-case audit §2.1).

### Task 10: Agent — Career (`app/(app)/career/`)
**Owner dir: `app/(app)/career/`. Sources: `prototype/career.html`, `features/content/m2-career.md` + `m3-exploration.md`.** 3 tabs: current-career card (⏳ undecided default: "You haven't picked yet — explore by strand" + Explore CTA), Explore-by-strand (live live `SHOWING n OF 32` count + zero-result default 🔧 already in prototype), skills-match tab (`X of Y` unweighted, demonstrated-only, zero-overlap compressed default row). Switch flow: confirm → reset-10 → quick re-assessment (3 self-claims + SQL transfer note) → recovered 33 → "Build my first dashboard" DA goal. Switch posts `/api/switch`; bars reset semantics come from `gaps.ts`.

### Task 11: Agent — Pathway (`app/(app)/pathway/`)
**Owner dir: `app/(app)/pathway/`. Sources: `prototype/pathway.html`, `features/content/m7-pathway-glance.md`, beat-8 row.** 3 tabs (Your gaps · Ranked steps · Resources), stage band ①②③, ranked rows with rationale lines + `Start` CTA, stage-② accordion, cross-tab footer, ranked-list order from `gaps.ts` (statistics → report writing → chart interpretation at beat 8). ⏳ defaults: all-7-closed, undecided student, zero-cost gap row ("No resource cataloged for this yet — your adviser can suggest one").

### Task 12: Agent — Progress (`app/(app)/progress/`)
**Owner dir: `app/(app)/progress/`. Sources: `prototype/progress.html`, `features/content/m6-m9-progress.md`.** Completions + comprehension-check feed (money-shot check lands here: pass band + dated event + source mark), gap-closure history rows (SQL transferred ·✓, 3 self-reported, dashboards ·✓✓), goals section ("Finish Python basics" in progress + "Build my first dashboard" auto-completing at beat 7). ⏳ defaults: zero completions, zero goals, "0 of 0" unreachable (no delete affordance yet).

### Task 13: Agent — Profile/Plan (`app/(app)/profile/`)
**Owner dir: `app/(app)/profile/`. Sources: `prototype/profile.html`, `features/content/m11-m12-profile-plan.md`, beat 9 row.** 2 tabs: Profile snapshot (score, skills block with per-bar source marks, credentials, honest ES note) + Plan tab (career + goals + pathway *summary only* — stages + % + next milestone, never the ranked list — + trajectory 40→51 two dated points + provenance of the +11). ⏳ defaults per edge-case audit §2.6.

### Task 14: Agent — Admin (`app/admin/` + shared admin data)
**Owner dir: `app/admin/`. Sources: `prototype/admin.html` + `admin-student.html`, `features/content/admin.md`.** Cohort table (7 fixtures, avg ≈47 labeled fixture-derived, Neil recomputed from live state) + per-student read-only page (breadcrumb, score readout, 4-part rubric bar, per-part notes, prev/next; no Activity section). Unknown/missing `?student=` → Neil default; Rafael-class "Still deciding" dedicated default state.

---

## Phase 2 — integration + E2E (testing agent owns `e2e/`)

### Task 15: Demo-arc E2E

**Files:**
- Create: `e2e/demo-arc.spec.ts` (Playwright), `playwright.config.ts` (test against `npm start` production build on 1440×900; separate 390 pass on onboarding only)

- [ ] **Step 1: `playwright.config.ts`** — `testDir: './e2e'`, `webServer: { command: 'npm run start', reuseExistingServer: true }`, `use: { viewport: { width: 1440, height: 900 } }`, `retries: 1`, project `chromium` only (venue browser).
- [ ] **Step 2: `e2e/demo-arc.spec.ts`** — one test walking beats 1–10, driving the onboarding script table (onboarding.md) with the exact demo inputs, asserting canon numbers at each beat:

```ts
// assertions skeleton (fixture-math is the spec)
expect(scoreReadout()).toBe("40");            // beat 5 dashboard
await switchToDataAnalyst();                   // beat 6
expect(scoreReadout()).toBe("10");             // honest dip
await reAssess();                              // 3 self-claims + SQL transfers
expect(scoreReadout()).toBe("33");
await completeMoneyShot();                     // beat 7: Power BI resource → check 4/5 pass
expect(scoreReadout()).toBe("51");             // crosses 50 live
expect(bannerLine()).toContain("5 of 7");      // beat 8 pathway context
expect(planTrajectory()).toEqual(["40", "51"]); // beat 9
await adminClose();                            // beat 10: admin row shows 51
```
Also assert: ES row reads 0-of-25 with the "full battery after setup" line; sub-scores at beat 7 = 29/0/7/15; journey-row "First 30 days, 1 of 3 done"; rubric segments' `--earn` fractions match their amounts. Beat-5 verification-quiz aggregate reads "2 of 5" (SQL, Git pass — canon per `_fixture-math.md`, resolving onboarding.md's older 3-item script).
- [ ] **Step 3: Run, fix through owners** (test agent files bugs with failing-state screenshot; I route to the owning surface agent; retest only the fixed surface + full arc once at the end — bounded round).
- [ ] **Step 4: Commit** — `test: demo-arc e2e (beats 1-10, canon-s asserted)`.

### Task 16: Cross-surface integration fixes

- [ ] **Step 1:** Run the full suite + every demo width sweep; collect any shared-file breaks that surfaced (the one place the freeze is lifted — I apply them myself, agents don't).
- [ ] **Step 2: Commit** — `fix: integration round from demo-arc run`.

---

## Phase 3 — defense dry-run (me)

### Task 17: Dry-run + backup recording

- [ ] **Step 1:** `npm run build && npm start`; walk the full beat script on the laptop **offline** (airplane mode) — the venue contract. Timing: beats 1–10 in ~10 min target.
- [ ] **Step 2:** Capture a screen recording of the full walk as the backup artifact; save next to `prototype/` with date suffix.
- [ ] **Step 3:** Width audit on the integrated app: 1920 (projector) / 1440 (laptop) / 768 (tablet) / 390 (phone), all 10 beat states — zero horizontal overflow, CLS < 0.02.
- [ ] **Step 4:** Fix any last issues, update this file with an UPDATE note, commit any deltas.
