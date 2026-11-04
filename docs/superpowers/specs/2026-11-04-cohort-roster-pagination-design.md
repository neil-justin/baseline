# Cohort roster pagination + skeleton mirror — design

**Date:** 2026-11-04
**Scope:** counselor console COHORT tab (`app/admin/AdminShell.tsx` → `CohortTable`) and the console's streamed skeleton (`app/admin/console-skeleton.tsx` → `CohortSkeleton`).

## Problem

The live Cohort roster renders every student in one unbounded table. The approved
mockup (`app/admin/mockups/console-tabs.tsx`) already defines the pagination
strategy — a `Pager` (prev/next chevrons, numbered buttons, "PAGE x OF y") with
the note "every table gets one" — but the live shell never received it. The
streamed `CohortSkeleton` likewise paints no pager furniture, so once the roster
spans pages the swap-in shows furniture the skeleton hid.

## Decisions (user-ruled this round)

1. **Page size = 10 students per page.** (User chose 10 over the mockup's 5.)
2. **Skeleton mirror = current 6-row mirror + a text-free pager ghost strip** under
   the table. Blind furniture: accepted that when the cohort fits one page the
   ghost fades out on swap; the swap paints OVER the skeleton, so the mismatch is
   transient. (User ruled: "6 rows + pager ghost".)

## Design

### Live table (`AdminShell.tsx`)

`CohortTable` gains local pagination state:

- `page` (`useState(1)`), sliced client-side from the full `rows` prop — the data
  is already fully shipped to the counselor shell; no server/API change.
- `PER_PAGE = 10`; `pages = Math.max(1, Math.ceil(rows.length / PER_PAGE))`; the
  tbody maps `rows.slice((page - 1) * PER_PAGE, page * PER_PAGE)`.
- Page state lives inside `CohortTable`, which remounts per tab switch (the pane is
  keyed by `active`), so no cross-tab retention and no reset logic is needed.
- **New `Pager` component** placed in a sibling `app/admin/Pager.tsx` (concrete: a
  sibling file, imported by `AdminShell` — modeled on the mockup's but rendered
  below the real table):
  `<nav class="atabs-pager" aria-label="Table pagination">` → prev button
  (`‹` chevron), one numbered button per page, next button (`›` chevron), and a
  `PAGE x OF y` label. Numbered buttons take `aria-current="page"` when active;
  prev/next disable at bounds.
- **Hidden when `pages <= 1`** — the mockup's behavior; today's 7-student cohort
  renders exactly as before, pager-free, until growth. No layout furniture appears
  for small cohorts.
- The header meta stays the **total count** ("N students" — honest about the whole
  roster); the pager carries position ("PAGE 2 OF 3"). No redundant per-page count.
- Page math must clamp: if `rows` shrinks under a persisted state it cannot (the
  array is server-built per navigation), so no defensive clamp beyond `Math.max(1, …)`
  in `pagesOf`, and prev/next bounds keep `page` in range.

### Hook classes / styling (e2e-hook rule)

Everything new uses `atabs-` prefixes in `app/admin/admin-tabs.css` — never the
mockup's `mk-` classes:

- `atabs-pager` — flex row, table-width, top margin off the last row rule,
  tabular numerals.
- `atabs-pager-btn` — the shared button face (chevrons + numbers): small square,
  neutral border, hover wash, `:disabled` at 40% opacity.
- `atabs-pager-btn.on` / `[aria-current="page"]` — active page: filled
  blue-wash accent face matching the console's button register.
- `atabs-pager-label` — the `PAGE x OF y` text, the console's small-label style.
- `atabs-pager-skel` — skeleton-only ghost strip (see below).

### Skeleton mirror (`console-skeleton.tsx`)

`CohortSkeleton` stays text-free and blind (no countable claims), updated to:

- Keep the current 6 grey rows and head furniture verbatim.
- Append a **pager ghost strip** below the table: `div.atabs-pager.atabs-pager-skel`
  containing a small grey chevron-pill, 3–4 small grey number-pills (one visually
  "on" via the neutral wash, no color claim beyond greys), another chevron-pill,
  and a wider grey label pill — all `.skel` spans, fixed footprint so the strip is
  footprint-stable.
- The whole skeleton section remains `aria-hidden="true"`.

### Error handling

There is no error surface to add: pagination is pure client-side slicing of
already-loaded rows. Empty roster renders zero rows exactly as today (pager still
hidden via `pages <= 1`).

### Testing

Consistent with the repo's `scripts/*.test.ts` habit:

- A test asserting the page math (slice offsets, `pagesOf` ceilings, 1-page → no
  pager, 7 students @ 10/page → 1 page, 11 → 2 pages).
- A render check that the live `CohortTable` and `CohortSkeleton` markup satisfy
  the class-registry rule (`atabs-` prefix, no `mk-` leakage) and the a11y
  contract (`aria-label` on nav, `aria-current` behavior).

### Out of scope

- Pagination on the Audit Queue tab (the `Pager` lives in its own `Pager.tsx`
  precisely so that round can import it — that queue's cutover is its own round,
  untouched here).
- Filters, sorting, server-side paging, or URL-state persistence.

## Success criteria

- The counselor's COHORT tab slices at 10 rows and shows the mockup-faithful pager
  only when the roster exceeds one page.
- The streamed skeleton mirrors the paginated furniture (6 blind rows + pager
  ghost) with the swap painting over it, per the Skeleton-Contract.
- Existing e2e / script suites stay green; the new math/class tests pass.
