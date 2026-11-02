# Tier 2d build brief — My Plan merge (frozen spec, user-locked 2026-11-02)

Reader: you are the implementation agent. The user decisions live in
`2026-11-02-audit-fixes-design.md` §Tier 2d "Decisions log" — read it first. This brief is the
mechanical application. Do NOT re-decide anything listed there; if code reality makes a frozen
call impossible, STOP that item and report, don't improvise.

## Scope & ownership

- YOU MAY EDIT: `app/(app)/pathway/PathwayTabs.tsx`, `app/(app)/pathway/page.tsx`,
  `app/(app)/pathway/pathway.css`, `app/e2e/*.spec.ts` (selector ports only).
- READ-ONLY: everything else. `lib/fixtures/resources.ts` and `scripts/verify-fixtures.test.ts`
  are being concurrently edited by another agent (§6.1 stream) — never touch them, and do not
  block on changes you see there. `lib/fixtures/checks.ts` already contains the landed
  `CHECK_SKILL` map (uncommitted) — read it, use it, do not edit it.
- DO NOT commit. Leave everything uncommitted. Do not start dev servers or run Playwright.
- Do not sweep unknown files (the user's other-window work may ride the tree).

## A. `page.tsx` — data layer

1. **Suggestion ranking — DEFERRED, do NOT rewire.** The Q11v2 ranking
   (check-linked → dedicated → free → hours → id) and pick-flag retirement move to the
   signal-gated background batch (user ruling: ALL algorithmic changes defer). The engine keeps
   `pickResource` EXACTLY as-is (authored `pick: true` wins; computed fallback free → fewer
   hours → provider). `CHECK_SKILL` may be READ (read-only) for the `noCheck` presentation flag
   (A.2) — no behavioral use. Leave a one-line comment at `pickResource` noting the deferred
   rewire + date.
2. **PlanTab rows** — merge the current StepsTab + GapsTab computations into one dataset:
   every career skill = one row, `open: boolean` from the gaps engine. Open rows keep the
   ranked order of the steps engine; closed rows append after, dimmed. Per row carry: skill
   name, `what` (`whatFor`), state (verified/checked/claimed provenance from the gaps engine),
   bar fill + hatch info, effect values the steps engine already computes (SP from→to · +Δ),
   suggestion `{title, costText, timeText, url}` or null, `hasCheck` =
   suggestion exists && `CHECK_SKILL[suggestion.id] === skill` and its inverse flag
   `noCheck` for the honest micro-line.
3. **Dead code removal** (fact-mapped earlier): `steps.band`/`StageBandCell`,
   `bandLabel`, `sub`, `qfoot`, `catchUp`, `peek`, the page-level `RATIONALE` bank,
   `QRow.why`, `ResourcesTab.counts`, unused `careerName` fields. Do not remove anything the
   Plan/Resources rows actually consume — verify by grep before deleting.
4. Keep the ES (employability skills) strip computation; it renders as the first row of the
   Plan table, cells aligned to the new 4-column template.

## B. `PathwayTabs.tsx` — client

1. **Two tabs**: `Plan` / `Resources`. Tab keys `plan`|`resources`; aria/tablist/tabs structure
   kept; hash deep-link: `#plan` / `#resources`; legacy `#steps` and `#gaps` hashes map to
   `#plan` when read (one-line compat), so old bookmarks don't 404 the panel.
2. **Plan panel** = one `section.card.tabpanel` `#panel-plan` with a real `<table>`:
   - Head: keep `h2` +  the `.lead-mono.num` counter — new text: `{closed} of {mapSize} skills
     checked` (keep the `.lead-mono` class byte-exact: e2e guard). Keep `.stagewide` treatment
     for the all-cleared state.
   - Columns: `Skill | Resource | State | Effect`. `th` register: 11px w500 uppercase
     .08em ink2 (existing).
   - Row anatomy:
     - Skill: `.p-skill` 13.5px w500 name + `.row-what` (11px ink2, existing 2-line clamp,
       reuse class).
     - Resource: title as `<a>` (external, `target=_blank`, `.r-ext` ↗) + "· {costText} ·
       {timeText}" muted; unmapped open rows: `.p-nores` honest line "No resource for this
       skill yet — ask your adviser." (11px ink2); closed rows: the closing resource title as
       plain text when the data carries it (grep the gaps-engine state for the closing
       resource; if absent, the provenance line only — do NOT invent data).
     - State: evidence bar (`.g-bar`, 8px, fill `--earn`) + chip ONLY on closed rows:
       `Verified ·✓` (c-green) / `Checked ·✓✓` (c-green) / `Self-reported` (c-grey hatch).
       Open rows: empty bar, no chip. Claimed rows keep the hatch ×bar appearance.
     - `noCheck` open rows: a muted 11px line INSIDE the State cell under the bar:
       "No platform check yet" (no red, no fake urgency).
     - Effect: open rows (no suggestion) → "SP {from} → {to} · +Δ" (`.eff num`); unmapped
       open rows → "—"; closed rows → closing provenance ("Closed via quiz", "Closed via
       checked resource", "Self-reported" + " · transferred" where the engine emits it).
   - Pagination: `components/TablePager` over the WHOLE table (open + closed, open first,
     stable order across pages), `PAGE_SIZE = 10`. Keep `:has(+ .vpager)` closing-hairline
     behavior.
   - Closed rows: `.closed-row` (dim: reduced opacity/muted ink, hover neutral) — quiet, not
     hidden.
3. **Resources panel** `#panel-resources`: unchanged structure (two cards, `.res-row`
   anatomy, `Start here` chip stays — e2e) except: column head `Feeds` → `Covers skills`;
   canonical wording only (no structural redesign this wave). Keep `.row-what` usage.
4. Toolbar right-side kicker: plan tab → `{closed} of {mapSize} CHECKED`? — NO: the Plan head
   already carries the counter; give the kicker to Resources only (current behavior), and hide
   or mirror for Plan per the existing `.kick` mechanics — mirror the gaps-colored logic:
   when a separate per-tab kicker exists for gaps/steps today, keep the Resources kicker, drop
   the Plan one (counter lives in the head).

## C. `pathway.css`

- New/renamed classes per B2 (`.p-skill`, `.p-nores`, `.closed-row`, `no-check` line) in the
  existing file, following current 2-level scoping (`.v7plan …`).
- Dead selectors from the fact map: `.v7plan .chip.c-amber`, `.v7plan .foot`,
  `.v7plan .stage-expand .plan-table th/td`, the `.softpanel .gap-row` media rule, and the
  orphan `.xrow` class usage in TSX. Also fold now-unused gaps/steps-only styles (accordion
  `.stage-rowbtn`/`.stage-expand`/`.sr-*`, `.ledger`-open-gap remnants) — delete ONLY after
  grep confirms no other consumer.
- Keep responsive breakpoints: ≤920px / ≤720px folds re-tested against the 4-column layout
  (block-stack the table at the fold like the current steps table does).

## D. e2e selector ports (`app/e2e/*.spec.ts`)

Map old→new, minimal diffs: `#panel-steps` → `#panel-plan`; `.qrow`/`.q-skill` → new plan-row
classes (keep a `.plan-row` stable class + `.q-skill` name if cheap); `#panel-gaps` refs →
`#panel-plan` closed/verified assertions where they still test the right fact — DELETE
assertions that tested now-dead furniture (accordion counts) rather than inventing replacements.
Add nothing new. Record the port list as a comment block in the touched spec. Do not try to run
the specs.

## E. Verification (must all pass before you report)

1. `npx tsc --noEmit` → 0.
2. `npx vitest run scripts/verify-fixtures.test.ts` → pass (if it fails ONLY because of the
   concurrent §6.1 stream's in-flight fixture edits, say so precisely and proceed).
3. `npx vitest run scripts/link-audit.test.ts` → pass.
4. No commits; `git status` at the end, list your touched files vs unknown files.

## Report back

Summary of: files touched, the e2e port list, which dead code got removed, the ranking as
implemented (paste the sort function), any frozen call that didn't fit code reality, and the
verification results.
