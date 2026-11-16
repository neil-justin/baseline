# Sysadmin slots pagination + accounts self-omit — design

**Date:** 2026-11-05
**Scope:** the sysadmin's APPROVALS and ACCOUNTS tabs (`app/admin/slots.tsx`) and the sysadmin skeleton (`app/admin/console-skeleton.tsx` → `SlotSkeleton`). No other file.

## Problem

The APPROVALS and ACCOUNTS tables render every row at once — no pagination — while the console's cohort roster, mockup tables, and (via the landed WAVES expectation) audit queue all page at the same furniture. The Accounts kebab also carries a dead "Profile" item, and the sysadmin sees their own account row (with a dash for a kebab) as a special case that exists only because of who is viewing.

## Decisions (user-ruled this round)

1. **Unified page size = 10 rows per page for BOTH tables** (user ruled over the mockups' 3/4 densities, consistent with the cohort ruling).
2. **Hide the sysadmin's own account row** from the ACCOUNTS list. The user is the viewer of the page; the row was only a special case because they were on it. The API response stays complete (server honest); the client omits the self row before rendering.
3. **Remove the "Profile" menu item** entirely. It is a dead placeholder (disabled menuitem, no handler) — dead code out rather than "someday."
4. **On refetch after a commit: keep the current page, clamped** to the last valid page if the list shrank (concurrent-change edge only; own actions never remove rows — decided requests keep their status chip, deactivated accounts stay struck-through).
5. **Skeleton mirror keeps its row count verbatim + gains the `PagerGhost` strip** (same blind-mirror ruling as the cohort round).
6. **Kebab retired** (user ruling 2026-11-05, option A): the ⋯ popover dies; the last cell carries VISIBLE row actions on the approvals register — REACTIVATE is one click (restoring access is safe), DEACTIVATE arms into the approvals-style two-step (`CONFIRM — DEACTIVATE` + CANCEL; access-loss echoes the armed irreversibility pattern). The popover's dead `Profile` line and the outside-click closer die with it.

## Design

### Both slots (`slots.tsx`)

- Import the landed `Pager` (`./Pager`) and `pagesOf`/`slicePage` (`./pager-math`). No new components, no new CSS — the pager already speaks `atabs-pager` and the register exists in `admin-tabs.css`.
- Each slot: `page` state; rows → filtered (accounts only: drop the self row) → `slicePage(rows, page, 10)`; `<Pager page pages setPage />` below the row list, hidden while `pages <= 1` (the Pager's own law).
- After-commit refetch (`load()`): clamp `page` so it never exceeds the fresh `pagesOf` count. Keep otherwise.
- Per-row logic untouched: armed two-step approve/deny, kebab popover (minus Profile), `acting`/`rowErr` render exactly as today — just on the visible page.
- Tab switches remount the pane (existing `key={active}`), so no cross-tab retention or reset code.

### ACCOUNTS specifics

- Filter out the self row (`selfUserId` already exists in the slot): `rows.filter((a) => a.userId !== selfUserId)` before slicing. The `isSelf` kebab-special-case branch ("—" dash cell) becomes dead and is deleted with it.
- Kebab/popover retired (see decision 6): `openFor` state, the outside-click `useEffect`, and the menu markup go away. The last cell becomes `atabs-acts` — REACTIVATE single click when `!active`; when `active`, DEACTIVATE arms (`CONFIRM — DEACTIVATE`) with a CANCEL, reusing the approvals armed register (`atabs-armed`, `atabs-armed-reject`).

### Skeleton (`SlotSkeleton`)

- Keep the three blind rows verbatim; append the identical `PagerGhost` strip the cohort round uses (import/reuse from the cohort skeleton's local component — copied if that would couple unrelated files oddly; Prefer: moved to a shared spot only if it stays trivial).

### Dependencies & parking

- The register exists in `admin-tabs.css` only once the parked WAVES 4 work lands. Implementation waits for that landing; the plan may be written beforehand.

## Error handling

No new error surface: pagination is client-side slicing of already-loaded lists; both existing load-failure and empty states render exactly as today (pager hidden when pages <= 1).

## Testing

- Extend `scripts/verify-pager.test.ts` registry pins: both slots' source contains `Pager` + `pager-math` usage (no third pagination implementation), and the self-row filter + Profile removal are pinned by source assertions (`Profile` line absent, `atabs-acts`/kebab contract preserved).
- Page math is already vitest-pinned (shared module).

## Out of scope

- The audit queue's pagination (WAVES 4's own work); server-side paging; sorting/filtering; the console-wide **table-format unification round**, which follows after the audit queue lands (user-ruled as its own round).

## Success criteria

- Both sysadmin tables slice at 10/page with the console's pager furniture; small lists render unchanged (pager hidden).
- The sysadmin no longer sees their own account row; the kebab holds only Deactivate/Reactivate.
- Test suite green; nothing else moved.
