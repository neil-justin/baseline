# Audit session design — bug fixes, profile UX, header register, animation, landing, mobile

Session date: 2026-11-02. All decisions below are user-locked in the working session.

## Context

A manual QA pass by the user surfaced 17 issues. Investigations (see session transcript) confirmed
root causes in code. Decisions and scope per issue are recorded here as the single source of truth
for the implementation tiers.

## Tier 1 — Bug fixes

### 1.1 Career lens chip bug (root cause confirmed)

`app/(app)/career/CareerClient.tsx` renders chips from
`LENS_CHIPS = ["Best matches for you", "All", "Computer & IT", …]` and clicking runs
`switchLens(s as Lens)` (line ~480) — the literal string `"Best matches for you"` is cast to `Lens`
instead of mapped to `"ranked"`. Consequences (both user-observed):

- On load `lens = "ranked"` never matches `s === "Best matches for you"`, so the first chip never
  shows as selected.
- Clicking "Best matches for you" sets `lens` to a value matching neither `"ranked"`, `"All"`, nor
  any track label → `rows = []` → the "No careers indexed for this track yet — try All…" message
  renders (`CareerClient.tsx:528-535`).

Fix:
- Map the chip label to the lens value (`"Best matches for you"` → `"ranked"`) in `switchLens`
  calls and `aria-pressed` comparisons.
- Delete the unreachable zero-result branch; keep the real "Nothing confirmed yet" state
  (zero-confirmed + ranked, `:509-527`).
- Default remains Best matches for you (already `"ranked"`; the bug was the missing mapping).

### 1.2 Switch modal polish (user-reported: whitespace, divider, copy, no animation)

`CareerClient.tsx:677-683` nests the page `.band` card inside `.sw-dialog` as its header
(`career.css:484-491`: band padding + `border-bottom` + panel top padding = doubled paddings and a
divider line under the title). Body line "Switching to X resets skill progress and training
progress." duplicates the title's info. No entrance animation exists (`career.css:471-482`).

Fix:
- Un-nest the band treatment: title sits directly in the dialog with one consistent padding scale;
  remove the doubled border/box lines.
- Dedupe copy: one cost line stating only what's not obvious (progress built for the current role
  resets; proven skills stay).
- Subtle spawn animation: scrim fades in (~150ms), dialog scales from ~97% + fades (~180ms,
  ease-out cubic), honoring `prefers-reduced-motion` and the transform/opacity-only CLS contract
  (lib/motion.ts contract, globals.css:854-856).

### 1.3 Role flip on reload (user never changed role manually)

The persisted `careerId` in the `student_state` blob was found persisted as `"qa"` (Software QA
Analyst) though the user never switched. Writer vectors:

1. `e2e/helpers.ts:24-53` `resetStore()` deletes **all** student rows; `demo-arc.spec.ts:246-252`
   performs the QA switch against the running/`reuseExistingServer` server (primary suspect).
2. Switch flow commits at confirm click (accepted flow semantics; NOT deferred — the flow's
   post-confirm screens render server-computed results). Confirm copy made honest instead.
3. Mutating routes lack the `withStateLock` serialization (`lib/state-queue.ts`; only `/api/profile`
   uses it).

Fix:
- Isolate e2e/capture runs to dedicated test student rows (never wipe/rewrite real student rows).
- Apply `withStateLock` to mutating student-state routes: `/api/switch`, `/api/claim`, `/api/goal`,
  `/api/check`, `/api/verify`, `/api/assessment`, `/api/credentials/presence`,
  `/api/credentials`, `/api/credentials/[id]`, `/api/admin/credentials/[id]` (following the
  `/api/profile` usage pattern).
- Reset the user account's stored `careerId` back to `swd` (preserving all other state fields).
- Confirm modal copy states the switch saves immediately (and remains reversible via switching back).

### 1.4 Auth routing + sign-out

- Signed-in user hitting `/`: `(marketing)/page.tsx` checks the server session and redirects
  students to `/onboarding` (no career yet) or `/dashboard` (same rule as `app/api/auth/signin`).
- `app/(app)/onboarding/page.tsx` gets the missing `requireStudent()` guard (pattern: any other
  `(app)` page).
- **Sign out** re-added (reverses the v7.3 removal — user decision): form POST to
  `POST /api/auth/signout`, pinned at the bottom of the sidebar (desktop) and included in the
  mobile bottom rail. Pattern: `app/admin/AdminBar.tsx:22-25`.

## Tier 2 — Profile tab (all fixes, hard copy pruning)

All confirmed with code evidence (see transcript):

1. **Score trajectory whitespace** — fixed 88px `.traj` canvas with top ~25px always dead
   (`profile.css:660-708`); collapse dead vertical space, fix dead horizontal zones in
   one/two-point states.
2. **"Starting levels with people"** — rebuilt onto the sibling Competencies table register
   (column header, row structure, badge/verdict treatment) matching "Skills for this career" and
   "NACE assessment" cards.
3. **Declare a credential** — anchored disclosure with focus/scroll management; the entry button
   stays visible/consistent; abandoning is reachable without scrolling the tall form
   (`DeclaredCredentials.tsx:282-406`).
4. **Copy pruning (hard)** — keep one short honest helper line per control; delete the ~25
   essay-length explanation lines (notably `AccountForms.tsx:153`, `PresenceCard.tsx:134`,
   `DeclaredCredentials.tsx:395`, triple-redundant data-rights prose).
5. **Identity card** — proper input types/attributes (name `autoComplete="name"` + required,
   year level as a constrained select, validation with inline errors next to each field), Save
   placement adjacent to the fields it validates (`AccountForms.tsx:35-162`).
6. **Password CLS** — reserve the feedback slot (min-height/mounted skeleton) so typing in the
   password fields never moves layout (`PasswordFeedback.tsx:73-79`,
   `AccountForms.tsx:243-251`).
7. **Data rights card** — fix the CSS-reversed DOM order (`profile.css:552-561`), wrap erase flow
   in a `<form>` (Enter submits), remove the raw student id from copy, dedupe the tripled
   announcements, drop the "↵" glyph (`DpaArtifacts.tsx`).

## Tier 2b — Header cards

- **Shared register, one implementation**: extract the cloned "white dashboard register" band CSS
  into a single shared recipe (kill margin 12-vs-14, subtitle 11.5-vs-13px, flex-vs-grid drift);
  restore My Plan to the DESIGN.md-ruled grey tray (Composition A, `DESIGN.md:279`).
- **Content differences stay intentional** (Named-Surface Rule, `DESIGN.md:269`: each band carries
  that page's instrument). A per-page content draft (title / subtitle / instrument cells / CTA)
  is presented to the user for sign-off BEFORE any markup change.

## Tier 2c — My Plan (Ranked steps / Gaps / Resources) restructure (queued by user 2026-11-02)

New manual-QA findings; design decisions run through the grilling session (2026-11-02) before code:

1. **Tab-panel header register inconsistent** — the Ranked steps panel's "title" is the
   counter line (spec-guarded lead-mono), while Your gaps renders `h2 "Open gaps"` and Resources
   renders section h2s ("Mapped to your open gaps" / "The rest of the catalog").
   (Steps merged-table change is already in the working tree: one ranked table, no stage digits,
   deduped counts.)
2. **Zero-data groups render empty tables** — "Closed bars" (gaps) and "The rest of the catalog"
   (Resources) render expandable+headered tables even at 0 rows; the *argument* on record for
   separating these groups ("a naked skill list reads as noise" ruling) vs a merged/filter
   alternative is being re-examined.
3. **Resource suggestion algorithm rethink** — `resourceFor` is `RESOURCES.find(...)` (first
   fixture match in array order, no ranking); the Resources tab lists ALL matching resources per
   gap (multiple per single gap); hand-typed fixture URLs drift/redirect over time. Decisions
   pending: one-suggested-resource-per-gap policy + explicit pick rule, link-health audit, URL
   canonicalization.
4. **"What you'll learn" expectation copy** — each plan/gap/resource row should tersely say what
   the student gets from closing/undertaking it.

Queue position: after Tier 2b (header content plan), before Tier 3 (animation/landing).

## Tier 3 — Design pass

- **Animation (subtle, existing kit)**: `components/Reveal.tsx`, `components/CountUp.tsx`,
  `lib/motion.ts` app-wide: scroll reveals on card/section entrance, CSS hover elevation/underline
  states, armed counters. No new dependencies. `prefers-reduced-motion` honored, CLS contract kept.
- **Landing page restructure + rewrite**: tighten narrative flow, rewrite weak copy, fix stale
  "SHS students" metadata (deprecated scope; `app/layout.tsx:6-7`), dedupe "Start check →" from 5
  occurrences to 2, align landing with the app's design tokens without losing the marketing look.
- User reviews the landing draft at the checkpoint before final acceptance.

## Tier 3.5 — Skeleton loaders (queued by user 2026-11-02, before the mobile audit)

User-reported: moving between tabs feels delayed while server pages fetch (session + state +
engines run on every navigation — some surfaces are DB/API-bound before content paints).

- Route-level `loading.tsx` skeletons per `(app)` surface (dashboard, career, pathway, prep,
  profile, progress) matching each page's stage structure (band placeholder + card rows), so the
  perceived load is instant and the shift is structured.
- Must respect the CLS contract (reserve the eventual layout's dimensions — no reflow on swap),
  honor `prefers-reduced-motion`, and work at mobile breakpoints (the shell's 720px fold).
- Architecture depends on Next 16's current loading-convention docs
  (`node_modules/next/dist/docs/`) — consult before writing code.

## Tier 4 — Mobile audit + fix (LAST; autonomous background)

Playwright-driven manual-QA pass at 390px / 768px / 1024px viewports over landing → auth
(sign-in/sign-up/forgot) → all `(app)` pages. Audit element appearance, section structure, font
sizes, tap targets, spacing. Apply fixes, then re-verify. Known gaps from investigation: auth
surfaces have zero media queries; only the app shell was ever audited beyond the landing.

## Verification strategy

- Each stream runs `tsc --noEmit` + relevant vitest suites; final integration after tier 1
  runs `npm run build` once.
- No dev servers started by agents (user's server may be running; e2e uses `reuseExistingServer`).
- The user re-tests manually at each checkpoint.

## Constraints honored

- Collaboration rule: user participates in every decision (this doc = the record).
- Dependency rule: no new dependencies (animation uses the existing kit).
- Parallel-work rule: executable streams run in background subagents; decisions stay in-session.
- Next.js 16: consult `node_modules/next/dist/docs/` before any API/convention change.
