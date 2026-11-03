# Prep page — per-section cards (revamp 2)

Date: 2026-11-03 · Status: **implemented** (R1–R13 user-ruled)
Supersedes: the result-view structure in `2026-11-02-prep-revamp-design.md` D7
(employer field placement) and D8 (single results card). Everything else in
that spec — naming, dropzone intake, honesty contract, Harvard link — stands.

Mocks: the live page is the record (`.shots/` design-review artifacts were
removed per user ruling 2026-11-03). Source of the signed-off layout:
`/tmp/opencode/prep-final-b.html` rendered at the 860 cap.

## 1. Problem

The `/prep` result is one card that nests everything: verdict strip → a
three-factor KPI strip → three factor groups → Findings → re-run dropzone.
The user's requirements, given over the 2026-11-03 mock rounds:

1. Every section must be **its own card**, like Dashboard's — no card-in-card
   nesting anywhere on the page.
2. The band's instrument cells (Resume / Letter / Presence / Application
   readiness) must **stop being packed inside one card**; each channel should
   read as its own card, as Dashboard's five channel cards do.
3. The page is **too stretched** at full width. 960px was rejected.
4. Resume: the "Check another version" dropzone gets its **own full-width
   line** with more spacing; the "First resume?" link line is **centred**.
5. Letter: the employer field was floating oddly — it moves **above** the
   dropzone as a labelled field with helper text.

## 2. Decisions (user-ruled, 2026-11-03)

| # | Decision | Ruling |
|---|----------|--------|
| R1 | Page width | Whole surface capped at **860px**, centred. The band, tabs and every card share that width. |
| R2 | Band | Title + subtitle on the left, **application readiness 9/15** as the composite on the right (the slot Dashboard gives 36/100). Uses the shared `.composite` / `.score-big` / `.c-of` / `.ratemsg` register. |
| R3 | Channel cards | Resume, Letter, Presence become **three** KPI cards under the band (Dashboard `.kpis` geometry: 12px grid gap, 14px 16px 16px padding, 8px radius). Application readiness stays in the band — it is the page's headline number, so it is not duplicated as a fourth card. |
| R4 | Card internals (channel) | Dashboard KPI order: name → fraction (`6 /7`) → 4px honest bar → wash chip → one-line 11px note. Notes: Resume `parse 1/1 · format 5/5 · evidence 2/4`; Letter `cover-letter checker still open`; Presence `all three presence checks passed`. |
| R5 | Factor sections | Each factor is its **own card**: head row (label + %), 4px bar, one-line meaning, then the checks table. The old three-factor KPI strip in the readout dies — the factor card owns its own number and bar. |
| R6 | Readout | Its own card, unchanged content: run label, file line, big score, weighting line. |
| R7 | Re-run dropzone | Its **own card** at the bottom, full-width zone, extra vertical spacing. |
| R8 | Link line | `First resume? …` centred under the dropzone. |
| R9 | Employer field | Rendered **above** the dropzone inside the same card, labelled `EMPLOYER optional`, helper line under the input. Supersedes 2026-11-02 D7 ("below the drop zone"). |
| R10 | Section labels | The uppercase `RESUME CHECKER` / `COVER-LETTER CHECKER` label above each stack duplicates the active tab verbatim → **dropped**. |
| R11 | Letter checks | Evidence and Structure are **surfaced as their own cards**; the `The checks` fold is removed. The honestly-skipped employer row lives in the Structure card. |
| R12 | Findings measure | The Findings card's 70ch reading caps are gone — on an 860px surface they left a ragged right edge (user feedback on the first build, 2026-11-03). `.rs-f-hidden` n/a: applies to `.rs-findings .rs-f-detail`, `.rs-move`, `.rs-example`. |
| R13 | Re-run zone | The two labels read as a **centred stack inside the box** — icon, `Check another version`, format line beneath (the old slim variant was a left-aligned one-row slot). |

## 3. Card inventory

Resume tab, top to bottom:

| Card | Content |
|---|---|
| Prep band | `Prep` + target subtitle · `9/15` application readiness right |
| Resume | `6/7` · bar · `6 of 7 checks` chip · factor receipt line |
| Letter | `—` · empty bar · `Not yet checked` chip · open line |
| Presence | `3/3` · full green bar · `Complete` chip · receipt line |
| tabs | Resume checker / Cover-letter checker (`.prep-lens`, not a card) |
| Readout | run label · file · target · `84/100` · `parse 20% + format 40% + evidence 40% · your latest run counts` |
| Parse | `100%` · bar · `what the file gives the reader` · 1-row table |
| Format | `100%` · bar · `section conformance` · 5-row table (Note column) |
| Evidence | `60%` · bar · `core skills of …` · N-row table |
| Findings | `Findings — no fixes found` (or `N to review`) + finding cards |
| Re-run | `Check another version` full-width zone · centred `First resume?` line |

Letter tab: same band + three channel cards, then readout → Parse card (score,
bar, meaning, **no rows**) → Evidence card → Structure card (includes the
honestly-skipped `Employer named — Skipped — not evaluated — no employer
declared` row) → Findings card → employer field + full-width dropzone card.

Never-run tabs keep the upload-first hero (unchanged) and still need the band
+ channel cards above them.

## 4. Component plan

- `app/(app)/prep/page.tsx`
  - `PrepPage`: band loses `.bandcells`; keeps one composite (`ArCell` recast
    as `.composite`), then renders `<section className="prep-kpis">` with the
    three `BandCell`s.
  - `RunResult`: readout card keeps `.rs-readout*` hooks but drops `.rs-kpis`;
    each `FactorGroup` becomes `<section className="card">`; Findings becomes
    `<section className="card">` wrapping the `.rs-disc` details; footer
    becomes `<section className="card prep-rerun">`.
  - `LetterResult`: same, plus structure rows surfaced (pending §7 item 1) and
    the employer field rendered above the zone.
  - `ResumeLinks` moves inside the re-run card, centred.
- `app/(app)/prep/prep.css`
  - New `.v7prep { max-width: 860px; margin: 0 auto; }`.
  - New `.prep-kpis` / `.prep-kpi` block, ported from `.v7dash .kpis` /
    `.v7dash .kpi`.
  - `.rs-fgroup` loses its "group inside a card" padding and becomes a card
    body; `.card > .rs-fgroup` border-top rule dies.
  - `.rs-readout`, `.cl-readout`, `.rs-disc`, `.rs-footer`, `.rs-upload`
    padding re-tuned for card-per-section.
  - Delete `.rs-kpis` / `.rs-kpi*` rules once the strip is gone.
- `app/(app)/prep/LetterUpload.tsx`: employer field renders before the
  `.dz-zone`; `.mock-employer` equivalent styles land in `prep.css`.
- `app/(app)/prep/ResumeUpload.tsx`: no structural change; the `slim` variant
  just needs its zone to fill the new card.
- `app/(app)/prep/PrepTabs.tsx`: no change (divider between band and tabs is
  CSS-only).

## 5. e2e impact

Hooks preserved: `.rs-readout`, `.rs-readout-score`, `.cl-readout`,
`.cl-readout-score`, `.rs-upload .dz-zone`, `.rs-air-note`, `.rs-disc`,
`.rs-check` row text, `#tab-letter` / `#panel-letter`.

At risk:
- `e2e/demo-arc.spec.ts:396` clicks `.rs-disc summary` "The checks" to read the
  employer honesty row. Dies if §7 item 1 surfaces the structure rows.
- `e2e/resume-diagnostic.spec.ts` asserts `.rs-disc summary` "no fixes found"
  — survives (Findings keeps its fold).
- `e2e/record.spec.ts` waits on `.rs-readout` / `.cl-readout` — survives.

## 6. What does NOT change

Engines, rubrics, AIR weights, stores, `/api` routes, honesty contract, tab
deep links, dropzone auto-run, named rejections, persistence notices, the
stale-run banner, Harvard template link.

## 7. Ruled items (were open)

1. **Letter checks** — surfaced as cards. The `The checks` fold and its
   `demo-arc.spec.ts` summary click are removed; the employer honesty row
   stays in the Structure card under `.rs-check`.
2. **Duplicate section label** — dropped. Cards start directly after the tabs.

## 8. Out of scope

Dashboard/Careers/My Plan/Profile band geometry, the Presence declaration flow
in Profile, tokens, mobile nav.
