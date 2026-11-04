# Console tables, one register — design

**Date:** 2026-11-05
**Scope:** `app/admin/AdminShell.tsx`, `app/admin/StudentRow.tsx`, `app/admin/page.tsx`, `app/admin/admin.css` (retirements + additions), `app/admin/admin-tabs.css`, `app/admin/console-skeleton.tsx`, `app/admin/slots.tsx` (header art only), `app/admin/AuditQueue.tsx` (header kept), `scripts/verify-pager.test.ts`.

## Problem

The console's four tables are built on two different registers: the Cohort roster is a real `<table>` (the old "Ledger-Table Rule"); Approvals, Accounts, and the Audit queue are `atabs-` grid rows. Headers differ too — Cohort and Audit carry 96×48 per-tab metaphor art; Approvals/Accounts carry none. Several name cells merge secondary facts into sub-lines.

## Decisions (user-ruled this round)

1. **One register: every table speaks the `atabs-` grid-row furniture.** This round's ruling SUPERSEDES the 2026-11-04 Ledger-Table Rule (the cohort's real `<table>`); the spec records the reversal as the user's.
2. **Merged cells break down into columns** (user ruling: "if a column merged info, break it down").
3. **All four headers carry the per-tab metaphor art** (user ruling).

## Column maps (final)

- **COHORT** — NAME (demo mark + row-marks chips) · YEAR · PROGRAM · TARGET ROLE · SCORE · LAST ACTIVE. The combined sub-line ("4th Year · Computer & IT") splits into real columns; `page.tsx` stops composing `personaMeta` into one string and ships `year` / `program` fields separately.
- **AUDIT QUEUE** — unchanged (STATUS · STUDENT · ENTRY · EVIDENCE · SKILLS · DECLARED · RULING) — already on the register.
- **APPROVALS** — APPLICANT · EMAIL · REQUEST · DECLARED · TRAIL · STATUS · ACTION. The name-cell's email sub-line becomes its own column.
- **ACCOUNTS** — ACCOUNT (avatar + name) · EMAIL · ROLE · STATUS · LAST SIGN-IN · ⋯ kebab.

## Design

### Cohort cutover

- `CohortTable` becomes a `section.atabs-panel` with `atabs-heads atabs-cohort-grid atabs-label` — the same chrome the other three wrap their rows in. The pager (10/page) and the empty/failed states carry over untouched.
- `StudentRow` re-renders as an `atabs-row atabs-cohort-grid` div: name-cell (name + demo mark + marks chips) → YEAR → PROGRAM → TARGET ROLE → SCORE (tabular numeral) → LAST ACTIVE (`atabs-meta`). The whole row stays the navigation target (`router.push` moves onto the row div; the accessible name link stays); row marks logic unchanged; no mutation controls appear (read-only law intact).
- `page.tsx` prop change: `LiveRow` gains `year: string` / `program: string`; `sub` retires from the roster row (no other consumer).

### Header art

- New `ApprovalsArt` and `AccountsArt` SVG components in the exact `ct-art` register (96×48, aria-hidden, flat neutral shapes) rendered into `slots.tsx`' two panels' heads. Motifs (metaphor law — a feeling, not data): Approvals = a request slip with a decision seal; Accounts = an identity card stack.
- Audit queue + Cohort keep their existing art verbatim.

### Skeleton + CSS

- `CohortSkeleton` rebuilds on the same blind furniture (6 blind rows verbatim + `PagerGhost` kept; pills re-grid to `atabs-cohort-grid`).
- `admin-tabs.css` learns `.atabs-cohort-grid` + `.atabs-cohort-grid-col` names; `admin.css` retires the `.ct-table`/`.ct-head`/`.cohort-table` blocks and their responsive re-grid block (dead on cutover) — deleted, not commented.
- Mobile behavior: the roster inherits the console's existing responsive grid-collapses.

## Error handling

No new failure states — the roster's data is server-shipped; the slots' existing load-failed/empty states carry over.

## Testing

- Registry/source pins extend `scripts/verify-pager.test.ts`: cohort row markup speaks `atabs-` only (no `ct-table` markup in AdminShell/StudentRow; no `isDemo`-driven special table classes), columns are the ruled 6, `ApprovalsArt`/`AccountArts` present, `ct-*` blocks absent from `admin.css`.
- Full suite + tsc + build must stay green.

## Out of scope

- The standalone counselor-requests page; any new columns for the queue; server-side paging; the slots round already in flight (its self-omit/Profile/blind-loading work lands as its own plan).

## Success criteria

- Visually: one register — the four tables read as one family (heads, rows, chips, hover, art).
- Cohort on the new furniture with the ruled 6 columns; merged cells split everywhere ruled.
- Suite green; dead `ct-*` CSS gone.
