# Tier 2b build brief — header cards: one band register + signed content (2026-11-02)

Reader: implementation agent. Content was co-signed with the user; the register unification is
ruled in `2026-11-02-audit-fixes-design.md` §Tier 2b. Frozen facts below; do not re-derive or
re-decide. If reality blocks a frozen call, stop that item and report — never improvise.

## Scope & ownership

- YOU MAY EDIT: `app/(app)/dashboard/{dashboard.css,page.tsx}`,
  `app/(app)/career/{career.css,CareerClient.tsx}`, `app/(app)/pathway/{pathway.css,
  PathwayTabs.tsx}` (band section ONLY — Plan/Resources panels are committed and frozen),
  `app/(app)/prep/{prep.css,page.tsx}`, `app/(app)/profile/{profile.css,page.tsx}`,
  `app/(app)/progress/{progress.css,ProgressView.tsx,page.tsx}`, `app/(app)/v7.css`, plus
  `e2e/*.spec.ts` selector ports only.
- READ-ONLY: everything else (fixtures, scripts, engines, other surfaces). Do NOT touch the
  pathway plan table / resources rows.
- DO NOT commit. No dev servers, no Playwright. Never sweep unknown files.

## A. The shared band recipe (move to `v7.css`, strip per-surface clones)

One implementation of the band card lives in `app/(app)/v7.css` (the family file); each
surface's css drops its cloned band block. Recipe values (canon):

- `.band`: white card `var(--v-surface)`, 1px border, 8px radius, whisper shadow,
  **padding 16px 20px, margin-bottom 12px**, mobile ≤720 `12px 14px`.
- Modifier `.band--tray`: grey `#F1F3F4` fill, same border/radius/shadow (DESIGN.md:279 rule).
- `.bandrow`: `display:flex; align-items:center; justify-content:space-between; gap 28px;
  flex-wrap:wrap` (flex overrides all present variants — including progress's grid — while
  preserving each page's content split; where a page has no `.bandside`, space-between is
  neutral). `.who .t`: `500 15px/1.35` + `.m`: `400 13px/1.45, mt 2px` (the 11.5px outliers
  die: dashboard `.who .m`, profile `.band-meta` — see content exceptions below).
- `.bcell`/`.bcell-label` instrument cells: career/prep values as today (gap 5px, label
  register `500 11px ls .08em uppercase ink2`), one definition, no per-surface clones.
- `.cta`: ONE definition — dashboard's registered values (`height 40px; padding 0 20px;
  500 14px`). Pages that use `.btn-primary` family for their band CTA swap to `.cta` (per
  facts, progress does; career's 9px-20px variant dies).

Per-surface css keeps ONLY genuinely page-specific band bits (progress `.prog-scale`
inner two-column treatment minus its `border-left` grid trick, profile `.band-scale`,
`es/kpi` blocks are NOT band). Delete the leftover dead rules once grep-verified unused
(dashboard's redundant `font-weight/size` restatements, the diverged clones).

## B. Signed per-page content (user-locked; values table source: fact map)

| Page | Title | Subtitle | Instrument | Band CTA |
|---|---|---|---|---|
| Dashboard | `{name} · {year}` | `{career}` (11.5px → 13px scale fix only) | 5-channel bar + `.kpis` grid (unchanged) | "Your next step →" (unchanged label) |
| Careers | "Your career" | `{name} · {what}` | Track · Skill map · First 30 days | **"Open your plan →"** (was "See your gaps →") + "Switch career" quiet toggle |
| My Plan | "My Plan" | "For {career} — **your** next steps, ranked by what carries the most weight first." (restore "your") | none (tabs/counter in toolbar) | none |
| Prep | "Prep" | "For {career} — the Resume checker and the Cover-letter checker." | Resume · Letter · Presence · AR | none |
| Profile | "Profile" (h1 gains `className="t"`) | `{name} · {year} · Target: {career}` + `.band-meta` "As of {date}" (13px, not 11.5 — but keep the mt-4 two-line rhythm) | `.band-scale` five-channel mini bar | **"Open your plan →"** (was "Continue your plan →") |
| Progress | "Progress" (h1 gains `className="t"`) | `{persona} · Target: {career}` + `.prog-ctx` line (unchanged copy) | `.prog-scale` + ticks | **"Open your plan →"** (was "Open Pathway →"; jumps `/pathway`, swap `.btn-primary` → `.cta`) |

Undecided states keep their facts (career/progress "No career picked yet." paths, profile CTA
moves into the card) but render through the SAME shared classes — no bespoke register.

**Dashboard decided/undecided split cleanup**: the undecided band (`band-in`, "Readiness" /
"0 of 100" / "No career picked yet.") renders through the shared `.band` recipe and score
sequence — same classes as the decided path, content preserved. Delete its bespoke padding
block after grep confirms the switch.

**Pathway band**: `.planband` adopts `.band--tray` (grey), drops the `padding-bottom: 0`
quirk (recipe padding applies), subtitle text per ruling ("your"). The `.plan-lens` toolbar
(tabs + kicker) stays OUTSIDE the band untouched. The "slim grey tray band" markup comment
finally becomes true.

## C. Guardrails

1. Grep BEFORE deleting anything: e2e specs, other surfaces, TSX consumers. Any selector with
   consumers outside the band files stays until ported.
2. e2e selector ports: check `e2e/*.spec.ts` for band/CTA selectors and the three renamed CTA
   labels ("See your gaps", "Continue your plan", "Open Pathway"); port labels/ids in the same
   change; record old→new as a comment port list. Delete assertions of dead furniture only.
3. Copy is EXACTLY as tabled above — no rewording (user-locked).
4. Mobile: band pads `12px 14px` at ≤720; verify no page's band-specific fold logic breaks
   (prep's 2×2 `.bandcells` tray fold and progress's 1-col fold are content-level, keep them).

## D. Verification

`npx tsc --noEmit` → 0 · `npx vitest run scripts/verify-fixtures.test.ts` + `scripts/
link-audit.test.ts` → pass · `git status` at end, list touched vs unknown files. No commits.

## Report back

Files touched, the shared recipe as implemented (paste the final css block), old→new e2e port
list, any frozen call that didn't fit reality, verification results.
