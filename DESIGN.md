---
name: Career Readiness (v7 — the Google-school official console)
description: A dense official scoring console on cool white-grey ground — white cards with 1px Material borders and whisper shadows, self-hosted Roboto, and a blue command economy where honest state washes (blue/green/amber/grey) verdict every reading.
colors:
  ground: "#F8F9FA"
  surface: "#FFFFFF"
  ink: "#202124"
  ink-2: "#5F6368"
  meta: "#80868B"
  blue: "#1A73E8"
  blue-deep: "#1557B0"
  blue-wash: "#E8F0FE"
  blue-pill: "#C2E7FF"
  blue-ink: "#012B53"
  green: "#188038"
  green-text: "#137333"
  green-wash: "#E6F4EA"
  amber: "#B45309"
  amber-text: "#96590A"
  amber-wash: "#FEF7E0"
  grey-text: "#3C4043"
  grey-wash: "#F1F3F4"
  border: "#DADCE0"
  rows: "#E8EAED"
  track: "#E8EAED"
  row-hover: "#F5F8FC"
typography:
  readout:
    fontFamily: "Roboto, system-ui, sans-serif"
    fontSize: "46px"
    fontWeight: 500
    lineHeight: 1
  kpi-score:
    fontFamily: "Roboto, system-ui, sans-serif"
    fontSize: "22px"
    fontWeight: 500
    lineHeight: 1.1
  page-head:
    fontFamily: "Roboto, system-ui, sans-serif"
    fontSize: "22px"
    fontWeight: 400
    lineHeight: 1.4
  section-head:
    fontFamily: "Roboto, system-ui, sans-serif"
    fontSize: "16px"
    fontWeight: 500
    lineHeight: 1.3
  band-title:
    fontFamily: "Roboto, system-ui, sans-serif"
    fontSize: "15px"
    fontWeight: 500
    lineHeight: 1.35
  cell-name:
    fontFamily: "Roboto, system-ui, sans-serif"
    fontSize: "14.5px"
    fontWeight: 500
    lineHeight: 1.4
  body:
    fontFamily: "Roboto, system-ui, sans-serif"
    fontSize: "13.5px"
    fontWeight: 400
    lineHeight: 1.5
  row-title:
    fontFamily: "Roboto, system-ui, sans-serif"
    fontSize: "13px"
    fontWeight: 500
    lineHeight: 1.4
  data:
    fontFamily: "Roboto, system-ui, sans-serif"
    fontSize: "12px"
    fontWeight: 400
    lineHeight: 1.5
  meta-line:
    fontFamily: "Roboto, system-ui, sans-serif"
    fontSize: "11.5px"
    fontWeight: 400
    lineHeight: 1.4
  caption:
    fontFamily: "Roboto, system-ui, sans-serif"
    fontSize: "11px"
    fontWeight: 400
    lineHeight: 1.55
  label:
    fontFamily: "Roboto, system-ui, sans-serif"
    fontSize: "11px"
    fontWeight: 500
    lineHeight: 1.4
    letterSpacing: "0.08em"
  nav-caption:
    fontFamily: "Roboto, system-ui, sans-serif"
    fontSize: "11px"
    fontWeight: 500
    lineHeight: 1
rounded:
  thumb: "4px"
  tab-thumb: "6px"
  brandmark: "6px"
  bar: "2px"
  panel: "8px"
  control: "8px"
spacing:
  xs: "4px"
  sm: "8px"
  md: "12px"
  lg: "16px"
  xl: "24px"
components:
  button-primary:
    backgroundColor: "{colors.blue}"
    textColor: "#FFFFFF"
    typography: "500 13px Roboto"
    rounded: "{rounded.control}"
    padding: "8px 20px"
  button-primary-hover:
    backgroundColor: "{colors.blue-deep}"
  button-ghost:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.blue-deep}"
    typography: "500 13px Roboto"
    rounded: "{rounded.control}"
    padding: "8px 20px"
  card:
    backgroundColor: "{colors.surface}"
    rounded: "{rounded.panel}"
  chip-blue:
    backgroundColor: "{colors.blue-wash}"
    textColor: "{colors.blue-deep}"
    typography: "500 11px Roboto"
    rounded: "{rounded.thumb}"
    padding: "3px 8px"
  chip-green:
    backgroundColor: "{colors.green-wash}"
    textColor: "{colors.green-text}"
    typography: "500 11px Roboto"
    rounded: "{rounded.thumb}"
    padding: "3px 8px"
  chip-amber:
    backgroundColor: "{colors.amber-wash}"
    textColor: "{colors.amber-text}"
    typography: "500 11px Roboto"
    rounded: "{rounded.thumb}"
    padding: "3px 8px"
  chip-grey:
    backgroundColor: "{colors.grey-wash}"
    textColor: "{colors.grey-text}"
    typography: "500 11px Roboto"
    rounded: "{rounded.thumb}"
    padding: "3px 8px"
  rail-active:
    backgroundColor: "{colors.blue-pill}"
    textColor: "{colors.blue-ink}"
    rounded: "{rounded.panel}"
  avatar-disc:
    backgroundColor: "{colors.blue}"
    textColor: "#FFFFFF"
  cta:
    backgroundColor: "{colors.blue}"
    textColor: "#FFFFFF"
    typography: "500 14px Roboto"
    rounded: "{rounded.control}"
    height: "40px"
---

# Design System: Career Readiness (v7 — the Google-school official console)

## Overview

**Creative North Star: "The Google-school official console — an honest scoring instrument, our name."** (DNA v7, user-locked 2026-10-29 with "love it"; the mockup comp is `.impeccable/mocks/decision/v7-design-dna.html`, approved capture `.impeccable/review/v7-design-dna-1440.png`.)

The signed-in app reads as real product software running a scoring instrument: a cool white-grey ground (#F8F9FA), white cards drawn with 1px #DADCE0 borders and whisper shadows at an 8px radius, a 56px top bar and a 48px Material icon rail with the blue-pill active state. Roboto carries everything (self-hosted variable woff2, `font-display: block` — the venue runs offline; zero hosted-font runtime refs), tracked uppercase labels appear sparingly, and every numeral is tabular. One command economy: **blue #1A73E8 owns action and in-progress**; a semantic wash family (blue / green #188038 / amber #B45309 / grey) states every verdict as a chip or text tint — never red, never a region fill. Density is a feature: the whole story (header band → five channel cells → dense plan table → queue → ledger) fits 1440×900.

**The Element-budget rule (the user's lock condition, applies on every surface):** every on-screen element must map to a real feature or a data need — no search bars, no notification bells, no invented affordances (nothing backs them in the 7-feature scope). Prune, don't dress.

Honesty is the material: numbers are computed (`lib/engines/*`, locked by `scripts/verify-fixtures.test.ts`), never painted; verified state reads solid, self-report hatched, unmeasured empty with an honest "not yet measured"/"—", and nothing is ever red. Material state language only — no entrance motion, no scroll theatrics.

## Colors

The neutral family is cool and disciplined; the semantic family is quiet-but-real. Wash chips state verdicts; washes never fill regions.

### Primary
- **Command Blue** (#1A73E8): the one CTA fill ("Your next step →"), rail icon paint, in-progress fills and the SP channel bar, wash-chip ground for in-progress chips, selection. Hover/press deepens to **Command Blue Deep** (#1557B0), the same value that reads as text on white (4.5:1+).
- **Rail Pill** (#C2E7FF): the 48px icon rail's active pill, inked with **Pill Ink** (#012B53) — the shell's one loud Material gesture.

### Semantic family
- **Verified Green** (#188038 · text **#137333** · wash **#E6F4EA**): verified/checked evidence — ES channel fill, "·✓ verified quiz", closed evidence bars, "Complete" chips.
- **Pending Amber** (#B45309 · text **#96590A** · wash **#FEF7E0**): pending evidence (TP before an internship datum or assessment).
- **Unmeasured Grey** (text **#3C4043** on white; wash **#F1F3F4**, optionally grey-hatched): not-yet-measured, self-report, "no resource cataloged", "—". The most honest color in the system.

### Neutral
**Ground** #F8F9FA · **Surface** #FFFFFF · **Instrument Ink** #202124 · **Softened Ink** #5F6368 (secondary ≥4.5:1) · **Meta Grey** #80868B (captions/fine print) · **Hairline Border** #DADCE0 · **Row Rules #E8EAED** (inner dividers + idle rail hover) · **Bar Track** #E8EAED · **Row Hover** #F5F8FC (blue-leaning tint).

### Named Rules
**The Wash Rule.** A verdict is stated by a chip or a text tint from the semantic family. A wash never colors a region, and the family contains no red — partial is blue, evidence-closed is green, waiting-for-evidence is amber, not-yet is grey.

**The Blue Command Rule.** Blue is action's color — one primary CTA per view (the plan's next step), the rail pill, in-progress fills. Blue never masquerades as "success"; verified is green's meaning.

**The Honest Fraction Rule.** Bar fills render at their computed fraction at rest: solid green/blue for earned/verifiable portions, the self-report portion hatched (45°, blue 16% or grey 9%), unmeasured empty track. Never a full-length tint, never a painted number.

## Typography

**Font:** Roboto (variable 100–900, self-hosted `/fonts/roboto-var-latin.woff2` with `font-display: block`, system-ui fallback). Material Symbols is self-hosted as a **7-glyph subset** (`/fonts/material-symbols-outlined-var.woff2`: `space_dashboard`, `work`, `checklist`, `description`, `account_circle` + ledger's `verified`/`task_alt`) — no glyph expansion without re-subsetting. The contractor's own exemplars: re-subset before adding a new glyph surface.

### Hierarchy
- **Readout** (500, 46px, lh 1): the composite score, one per page, min-width 2ch, tabular.
- **Page head** (400, 22px, lh 1.4, ≤52ch, balanced): surface h1 / tab headings; **KPI score** (500, 22px) with a 12px "of N" companion in the five channel cells.
- **Section head** (500, 16px) · **Band title** (500, 15px) · **Cell name** (500, 13–14.5px): queue names and channel names.
- **Body** (400, 13.5px/1.5): prose, rationales (≤62ch), notes; receipts and fine print at **Meta line** (11.5px) and **Caption** (11px).
- **Data** (400, 12px, tabular): table cells, cost/time; **Row title** (500, 13px).
- **Label** (500, 11px, +0.08em, uppercase, #5F6368): tracked instrument counters ("0 OF 3 DONE", "2 OPEN", table column heads) — sparingly, at most one per instrument block; **Nav captions** (11px) under bottom-nav icons. *(v7.1: floors amended — see amendments section.)*

### Named Rules
**The Tabular Rule.** `font-variant-numeric: tabular-nums` on every number-bearing element; the readout and table numerals min-width–guarded.

**The Sparing Label Rule.** Tracked uppercase is calibration, not decoration — one per block; a numeral without its label or chip is uncalibrated.

## Layout

The shell is a fixed grid: 56px top bar full-width, 48px icon rail column, content beside the rail (`.v7` in `app/(app)/v7.css`). Surface content runs 16–24px page padding on My Plan (≤1400px) and 12px/16px on the Dashboard, cards stacked on a 12px rhythm. Gap arithmetic: 12px between cards, 24–28px between instrument levels; queue rows breathe 16–17px vertically.

Responsive: 1180px KPI cells fold 5→3; 1020px deck collapses to one column; 860px queue rows fold their CTA under content; **720px the rail becomes a Material bottom nav** (64px, captions on) and bands/tables stack; 560px tables fold their least-critical column.

## Elevation & Depth

Quietly lifted, still official: the whisper shadow (`0 1px 2px rgba(60,64,67,.10)`) is the standing card depth; the blue CTA carries its own tinted lift (`0 1px 3px rgba(26,115,232,.3)`); the segmented thumb shares the whisper register. Hover states tint surfaces (#F5F8FC; rail hover #E8EAED) — depth never grows on hover except the CTA's intended 2px/6px press-forward.

### Shadow Vocabulary
**card-whisper** `0 1px 2px rgba(60,64,67,0.10)` · **cta-lift** `0 1px 3px rgba(26,115,232,0.30)` · **tab-thumb** (whisper register). Nothing else; no zero-offset halos, no hard offsets.

## Shapes

8px radius everywhere structural (cards, tables, CTA, buttons, tab-strip track); 6px inner controls inside their 8px container (tab thumbs, brand mark); 4px wash chips and small thumbs; the rail pill, avatar, and step numerals are the only circles. Borders are always exactly 1px #DADCE0 (external) and #E8EAED (inner rows). Step numerals and chevrons are CSS-drawn (ink circle / border chevron) — glyphs come only from the 7-glyph subset.

## Components

- **v7 App Shell** — 56px top bar (brand mark with 6px blue inlay, wordmark, spacer, avatar disc → Profile as the ONLY right affordance), 48px icon rail (blue pill active), main column. ≤720px → bottom nav.
- **Button — Primary/Ghost** (see frontmatter). One primary per view.
- **Wash Chips** — blue/green/amber/grey 500 11px +0.04em, 4px radius; grey chip optionally grey-hatched for self-report.
- **Honest bars** — 4px (KPI) / 8px (gap ledger) tracks at 2px radius; solid/hatched/empty per the fraction rules.
- **Dense tables** — plan + resource catalogs: collapsed borders, #E8EAED row rules, row hover, tracked head row (My Plan's head band sits on #FAFBFC), `↗`/`→` arrows are copy, not icons.
- **Stage band** — three instrument cells with CSS-drawn 26px ink-circle numerals; current emphasis is chip + ink treatment (band cell stays unfilled per the v7.1 Wash Rule). *On the re-cut My Plan surface the live implementation is the band-resident tab strip with stage counters as band furniture; this entry reworded 2026-10-29 (v7.1 round) — the pre-amendment "blue wash" wording is superseded.* Collapses to a column ≤720px.
- **Tab strip** — Material segmented on #F1F3F4: white thumb, whisper shadow, roving arrow-key tablist, hash deep-links (`#steps` default — My Plan's beat-8 open location).

## Do's and Don'ts

**Do**
- Start from the `--v-` tokens in `app/(app)/v7.css`; scope new surface CSS under its own `.v7<surface>` root.
- State every verdict with the wash family; keep one CTA per view — it is the plan's next step.
- Keep content strings and e2e hooks verbatim through any presentation change (`#panel-*`, `.lead-mono`, `.stagepanel .qrow .q-skill`, dashboard set).
- Reseed canon (delete the `student_state` row for neil via `scripts/delete-neil-state.mjs`) before evidence captures; play captures in before/after named pairs into `.impeccable/review/`.
- Draw structural glyphs in CSS; keep the Material subset frozen until a deliberate re-subset.
- Run the finish pipeline: detector → desktop+mobile captures → finish review → documenter (DESIGN.md + design.json + surface doc from built truth) → clean build.

**Don't**
- Don't add search, bells, sign-out, or invented affordances on the student chrome (element-budget rule); sign-out stays pruned.
- Don't paint a number or confirm a claim the engine didn't compute; no red anywhere.
- Don't fill regions with wash colors or ship entrance animations — state language only.
- Don't use hosted font sheets; don't expand glyphs beyond the subset.
- Don't exceed the shadow vocabulary or the 8px radius ceiling-in-reverse (no bigger-radius children than container).
- Don't consult the superseded worlds as reference: The Index (green hairline instrument, 6px ceiling, drafting grid) and the Navy Console (gradient mass) are both rejected directions, kept only as anti-references on legacy surfaces awaiting their own v7 re-skin.
- Don't rely on the network or an LLM during the demo — template fallbacks everywhere.

## v7.1 amendments — binding for every future surface (user-ruled 2026-10-29)

Born from the My-Plan DNA critique (29/40). These extend, never replace, the v7 law above.

1. **The Floor Rule.** Minimum UI text = 11px (label and nav-caption tokens amended from 10.5px). State-bearing grey text uses ink-2 `#5F6368` or darker (≥4.5:1 on white); `meta` `#80868B` (3.7:1) is demoted to decorative non-state fine print only, always adjacent to a labeled instrument. Detector floors (`undersized-ui-text`, `low-contrast`) are gates, not style opinions.
2. **The Wash Rule (settled).** Washes color chips, tints, and text — never REGION fills, anywhere. The stage-band blue-wash cell (pathway) was ruled out-of-family on 2026-10-29; emphasis on a current stage = chip + tactile treatment, not a filled band.
3. **The Effort-Number Rule.** Any ranked, queued, or next-step item carries the number it moves (weight/effect, e.g. `SP 19 → 22 · +3`) — computed from `lib/engines`, never painted. Dashboard parity everywhere; a plan surface whose rows say "carries the most weight" while hiding the weights fails the family.
4. **The Named-Surface Rule.** Every surface opens with a header band naming itself and carrying its instrument counters. No nameless pages; a bare tab strip on bare ground is not a page head.
5. **Traceability.** Ruling record: `.scratch/career-readiness-platform/map.md` (2026-10-29 evening entries). Dashboard already-approved captures get re-shot once the token floor lands; `design.json` regenerates from built truth after that round (currently stale by doctor report — do not treat its typed values as current law).
6. **The Icon-Rail Rule (user-ruled 2026-10-29 evening).** The icon rail reads as a white surface strip: `#FFFFFF` ground, 1px `#DADCE0` border, whisper shadow, 8px radius — never a bare strip floating on page ground. The active state is a rounded RECTANGLE blue-wash pill (12px radius, `#E8F0FE` wash, blue `#1A73E8` glyph) — circular active effects are out-of-family. Applies to the shared shell now and to every future surface sweep. *(Superseded on desktop by the v7.2 Top-Nav Rule below — the bottom-nav ≤720 restyles are exempt.)*

## v7.2 amendments — binding for every future surface (user-ruled 2026-10-30 morning; built truth from the shell round)

Born from the live review + variant mocks (`.impeccable/mocks/decision/rail-margin-variants.html` "top" + "cap + shared gutters" · `.impeccable/mocks/decision/myplan-header-variants.html` variant A — both ruled states). These extend, never replace, the v7 law. Ruling record: `map.md` (2026-10-30 morning entries).

1. **The Top-Nav Rule.** Desktop navigation = the 56px top bar itself: brand left, icon+name tabs center (`.headnav` — 13.5px/500 Material-icon tabs, 12px radius, ink-2 idle, `#E8F0FE` wash + `#1557B0` ink active, transparent hover), avatar right as the ONLY right-side element (element-budget rule holds). The 48px icon rail retires on desktop; the `.rail` element survives exclusively as the ≤720px Material bottom nav (its 11px captions and wash pill unchanged). `header a[href=…]` locators stay strict-mode-unique: the bottom nav `<nav>` is a sibling OUTSIDE the `<header>`.
2. **The Gutters-Cap Rule.** The signed-in app frame (topbar included) caps at 1240px, centered with shared 8px gutters — ground reads beyond the cap. Kills the full-bleed stretch at every surface; future sweeps inherit it, never re-derive it.
3. **Composition A — the My-Plan band (The Mega-Line Rule).** The band is a grey tray (`#F1F3F4`, 1px border, 8px radius, whisper shadow): h1 "My Plan" + the ruled one-line description ("For {role} — your next steps, ranked by what carries the most weight first.") + the stage strip as band furniture. Tabs live ON the content card they control (cardtop = tablist left + computed "X OF N DONE" kicker right); forced-break mega headlines are abolished everywhere — a tab's content card opens with the instrument, not a sentence break. The band tray is structure, not a semantic wash verdict (the Wash Rule still governs state language).
4. **Panel sizing (built truth).** The v7.1 equalize-panels reservation is dead: the married card sizes per tab. Any future surface reviving stacked panels must equalize panels, not reserve white voids.
