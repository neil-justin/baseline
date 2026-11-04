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

Honesty is the material: numbers are computed (`lib/engines/*`, locked by `scripts/verify-fixtures.test.ts`), never painted; verified state reads solid, self-report hatched, unmeasured empty with an honest "not yet measured"/"—", and nothing is ever red. Motion follows the **v9.1 M3 Motion Rule** (below — the v7 no-motion law is repealed, user-ruled 2026-11-04): subtle, M3 durations and emphasized easing, transform/opacity only, reduced-motion honored.

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

- **v7 App Shell** — 56px header band across the top (brand mark with 6px blue inlay + wordmark, nothing else), left sidebar column (icon+name tabs stacked, blue wash active, Profile pinned at the bottom) beside the main column. The avatar disc retired with the v7.3 sidebar round (it duplicated the Profile tab). ≤720px → bottom nav.
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
- Don't fill regions with wash colors — state language only. (Motion is governed by the **v9.1 M3 Motion Rule**, below — subtle M3-conformant motion is sanctioned; theatrics are not.)
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

1. **The Sidebar-Nav Rule (v7.3, user-ruled 2026-11-02).** The 56px header band (brand mark with the 6px blue inlay + wordmark, nothing else) spans the frame ACROSS the top; desktop navigation = the left sidebar spanning VERTICALLY: icon+name tabs stacked in it (`.sidenav` — 13.5px/500 Material-icon tabs, 12px radius, ink-2 idle, `#E8F0FE` wash + `#1557B0` ink active, transparent hover), with the Profile tab pinned to the sidebar's bottom edge (`.tail`). The old top-bar headnav and the avatar disc RETIRED (the avatar duplicated the Profile tab — element-budget rule); the 48px icon rail survives exclusively as the ≤720px Material bottom nav (its 11px captions and wash pill unchanged). Nav locators are `aside a[href=…]` / `nav[aria-label=…]`: the bottom nav `<nav>` remains a sibling OUTSIDE the sidebar `<aside>`.
2. **The Gutters-Cap Rule (re-ruled v7.3, 2026-11-02).** The shell chrome (header band + sidebar) runs edge-to-edge with the viewport; the CONTENT column keeps the cap — `.v7-main` maxes at 1240px, centered with shared 8px gutters — so tables and dashboards never sprawl but the sidebar reads as full-height console chrome, not a floating card. Future sweeps inherit the rule, never re-derive it.
3. **Composition A — the My-Plan band (The Mega-Line Rule).** The band is the family's SHARED white card register (`.band` in `app/(app)/v7.css` — one recipe, all six app bands): h1 "My Plan" + the ruled one-line description ("For {role} — your next steps, ranked by what carries the most weight first."). Tabs live ON the content card they control (cardtop = tablist left + computed "X OF N DONE" kicker right); forced-break mega headlines are abolished everywhere — a tab's content card opens with the instrument, not a sentence break. Grey-tray badge: the original grey-tray fill (`#F1F3F4`, "Composition A tray") was user-revised to the shared white card on 2026-11-02 ("why is My Plan the only grey one?" — one grey band among six white ones reads as an anomaly, not an intent); do NOT re-apply a grey band.
4. **Panel sizing (built truth).** The v7.1 equalize-panels reservation is dead: the married card sizes per tab. Any future surface reviving stacked panels must equalize panels, not reserve white voids.
5. **The Ledger-Table Rule (user-ruled 2026-11-02 browse round).** Any rows × fixed-columns data renders as a REAL `<table>` — tracked 11px/500 heads, `#E8EAED` row rules, row hover, wash chips in the State cell, tabular numerals, honest "—" for unmeasured cells. Prose (findings, rationales, notes) is never force-tabled; the family register (pathway plan/gap tables) is the pattern each surface clones into its own CSS. Long ledgers (the 36-career one-list, pathway gaps/resources) paginate at 10/page through the shared stepper (`components/TablePager.tsx`, `.vpager` in v7.css): absolute ranks/indices, the true SHOWING range in the kicker, hidden when `pageCount ≤ 1`, no scroll behavior.
6. **The Route-Stable Viewport Rule (user-ruled 2026-11-02 browse round).** Document height varies per route, so classic scrollbars toggled viewport width and re-centered the capped frame while layout chrome shifted between navigations. The root reserves the gutter: `html { scrollbar-gutter: stable; }` (+ `overflow-y: scroll` fallback behind `@supports`). Probe receipt: zero shell shift + `clsSum 0` across Dashboard→Careers→My Plan→Prep→Profile at 1440 and 390.

## v9 amendments — the M3 fidelity upgrade (user-ruled 2026-11-04)

Born from the user ruling that the shipped app "follows the Google design DNA but looks underwhelming": v7's vocabulary is 2019-URL Material (hairline-bordered white cards, 8px radii, flat quiet surfaces) while **current** Google products (Gmail/Drive 2025-26) render Material 3. This amendment upgrades the DNA to today's Google look. It supersedes the v7 law **only on the points listed here**; everything unamended (honesty laws, element budget, content-verbatim, detector floors) stays binding. The frontmatter payload above remains the v7 record and is superseded point-wise by the tokens below.

```yaml
v9:
  colors:
    ground: "#F8F9FA"          # unchanged
    surface: "#FFFFFF"         # unchanged
    primary: "#0B57D0"         # Google's current primary — supplants #1A73E8 as command blue
    primary-hover: "#0842A0"
    primary-container: "#D3E3FD"   # tonal moments / tonal buttons
    on-primary-container: "#041E49"
    secondary-container: "#EEF3FC" # quiet tonal card tint on the ground
    # semantic family (green/amber/grey washes) unchanged from v7
    # #1A73E8/#E8F0FE survive as legacy aliases during the migration surfaces
  typography:
    headings-ui: '"Google Sans", "Roboto", system-ui, sans-serif'  # NEW — page heads, section heads, buttons, chips, nav labels, marketing display
    body-data: '"Roboto", system-ui, sans-serif'                    # unchanged carrier of prose AND every numeral
    mono: '"Roboto Mono", ui-monospace, monospace'                  # supplants Fragment Mono on visible surfaces
    # The Tabular Rule keeps numerals in Roboto (tabular) — Google Sans carries
    # hierarchy only, never the instrument's numbers. Marketing display sizes:
    # hero clamp(40–64px) 400, section heads 28px 400, card heads 22–24px 400.
  rounded: { panel: 16px, frame: 24px, control: 999px, chip: 8px, thumb: 6px, bar: 2px }
  elevation:
    card: "0 1px 2px 0 rgba(60,64,67,.30), 0 1px 3px 1px rgba(60,64,67,.15)"  # M3 level-1 replaces the whisper register on structural cards
    cta: "none → state layers"   # pills get hover/press state tints, not baked shadows
  buttons:
    primary: "filled pill — #0B57D0 bg, white Google Sans 500 14px, hover #0842A0 + state layer 8%"
    tonal: "#D3E3FD bg / #041E49 text pill — the new 'ghost' register"
    text: "no fill, #0B57D0 text, pill hover wash"
  loading:
    skeleton: "state language, permitted: #E8EAED blocks pulsing to #F1F3F4 (1.4s ease, respects prefers-reduced-motion). Skeleton = the M3 shape of the block it stands in, never a spinner."
```

**Rule changes (each names the v7 rule it amends):**

1. **The Surface-Tone Rule** (amends hairline+whisper card law). Structural surfaces are drawn by *tone + M3 level-1 shadow*, borderless; the 1px `#DADCE0` border retires from cards, panels, tables, and the shell (tables keep their `#E8EAED` *inner row rules*). A quiet `secondary-container` tint (`#EEF3FC`) is legal card ground where a card must separate from white siblings.
2. **The Pill Rule** (amends the 8px-control register). Every interactive control — buttons, chips-as-controls, CTA — is a full pill; text wounds heal with padding, not radius. Non-interactive wash chips sit at 8px.
3. **The Radius Ladder** (amends the 8px ceiling). Cards 16px · large frames/hero media 24px · controls pill · chips 8px · thumbs 6px · bars 2px. Children never exceed their container's rung (v7 law stands).
4. **The Marketing-Four-Color Exception** (extends the Blue Command Rule). The single-blue command economy holds for **every signed-in surface**. The *marketing* landing may use Google's four-color accents (the hero dots, icon tiles `#4285F4/#EA4335/#FBBC04/#34A853`) as decorative moments — never as verdicts. *(User ruling 2026-11-04: the auth shape panel tried the four-color composition and was RECOLORED to the single-blue tonal register — the logo palette reads "obviously Google" on an auth surface; the M3 shape language stays, the Google doodle palette doesn't.)*
5. **The Skeleton Rule** (new; amends the strict no-motion reading). Loading is state language: an M3-shaped skeleton that pulses `#E8EAED → #F1F3F4` is permitted wherever a fetch resolves late — per-route `loading.tsx` and in-page tab loads. No entrance animations, no scroll theatrics (those bans stand).
6. **The Stage Rule** (transition contract for the migration): the landing + auth pages migrate first (off the Index register), then each console surface sweeps token-by-token onto v9 in the user-gated screen order. During migration, old registers stay untouched on un-migrated surfaces — mid-tree mixed registers are inspected surface-by-surface, not file-by-file.
7. **The Offline Font Rule holds**: "Google Sans" must be a **self-hosted** woff2 or it does not ship — the fallback stack (`Roboto`) is the enforced floor, so the offline demo venue never loads a hosted sheet. Phases that cannot reach self-hosted Google Sans ship Roboto-only without treating it as a breach of this amendment.

Ruling record: session 2026-11-04 (`/#mockup` realm = the approved comp target for the marketing register). The mockup realm does not touch the server page; the landing cutover is a later, user-gated round. *(Round 1, 2026-11-04: the comp was user-approved ("this is the way") and CUT OVER — the live landing now runs this register under `.v9` in `app/(marketing)/v9.css`; the `#mockup` realm files retired with it. Next in queue: auth pages.)*

7. **The v9 Type Scale** (user-ruled 2026-11-04, protected surfaces only). The v7 hierarchy's 13.5px body / 11px floors read dense — the other half of the "underwhelming" verdict. The console (onboarding, dashboard, and every surface after) bumps ~10–15%: **body 15px, page heads 26px, band titles 17px, section heads 16px, floors to 11.5/12px, readout 52px**, buttons 14–14.5px, chips 12px. Families unchanged (Google Sans hierarchy / Roboto body+numerals). The marketing + auth registers are exempt (they already run larger). Implemented as appended override blocks per surface file + the shared block in `v7.css`.

8. **The v9.1 M3 Motion Rule** (user-ruled 2026-11-04 — "remove that v7 no motion law… as long as the animation is subtle and conforms to Google Material Design 3, go crazy"). The v7 no-motion law is REPEALED. Motion is now a sanctioned register everywhere, bounded by Material 3:

   - **Vocabulary**: durations 150–450ms; standard easing `cubic-bezier(0.2, 0, 0, 1)`, emphasized easing `cubic-bezier(0.16, 1, 0.3, 1)`; entrance = fade-through (opacity + translateY ≤14px or scale 97→100%); stagger = 40–80ms per child.
   - **Animate ONLY transform / opacity / filter** — the CLS contract (v7.2 #6) still holds: never animate layout properties; entrances reserve final space.
   - **Sanctioned**: staggered hero/list entrances; scroll-triggered reveals (marketing register); drawer/tab/dialog state transitions; bar fills on reveal; hover lift ≤2px with shadow growth; press scale ≤0.97; the pre-existing count-up and skeleton pulse (instruments).
   - **Still banned**: parallax, autoplaying media, painted/computed-fake numbers, motion that shifts layout, any motion not honoring `prefers-reduced-motion` (final state renders immediately).
   - Rollout order follows the screen queue: landing first, then auth, then the console surfaces.

## v9 amendments (cont.) — console sweep rulings (user-ruled 2026-11-04, careers/my-plan/dashboard rounds)

9. **The Ordered-Fit Rule** (careers ruling). In ranked/sorted lists, fit and rank live in the ORDER and its rank markers — never in a derived column. Careers table is `RANK / CAREER / ENTRY PATH`; an "x of y" fit column and any in-list fit readout are retired; the full skill comparison belongs in the expanded row, not the table.
10. **The Furniture-Retirement Rule.** When the user cuts a piece of band furniture (the careers KPI bar cells), no replacement furniture gets invented without a user-approved mock. Retired cells may hand their FACTS to a sanctioned carrier (the SKILL LEDGER chips); the band's meta line folds the page's role facts (`name · track · what`). Provenance/legend/counts captions on ledgers are provenance noise — retired with the cells.
11. **The Ledger-Register Rule.** Skill ledgers and spec-sheet registers (careers band row + detail) render as tonal-chip lists keyed to state color (chip filled where matching bars overlap, outline otherwise) — no counts lines, no detail legends.
12. **The One-Progress-Visual Rule.** Each page carries exactly ONE computed-state progress visual, derived from engine truth (dashboard = D1 readiness gauge arc+needle at 1.8°/point; my plan = 130px ring). A second numeric readout of the same fact is redundant (the dashboard hero numeral was deleted; the AT announcement rides `sr-only`). Header imagery is never shared across pages ("don't reuse My Plan's imagery") — each hero owns a metaphor semantically its own, self-drawn SVG (D1 gauge / C3 career fork / my-plan ring).
13. **The Skeleton-Contract Rule.** Skeletons are part of the surface contract: a restructure must re-mirror its skeleton in the SAME commit; a stale-mirrored skeleton renders as a bug (careers + pathway skeletons re-aligned this way).
14. **The Tail-Block Cascade Rule.** Any appended tail-block override of a shell-responsive rule must carry its own media guard — the unscoped `.v7` grid bump squeezed every console page's main into 264px at ≤720 (bug `a3b2f75`'s fix, 974540d's correction).
15. **The Mid-Width Sweep Rule.** Verification includes the intermediate widths 1024 + 1200 — breakpoints leave seams that fire only there (verified twice this session; always alongside 1440/720/390).
16. **The Guide-Recut Record** (prep guide, user-approved via the `#mockups` realm 2026-11-04 — "looks good" → same-day cutover, realm retired). The format guide (`/prep/guide`) moves off its pre-v9 v7.4 anatomy: band carries a top back chip (ArrowLeft · "Back to Prep", M3 tonal pill) and the drawn ONE-PAGE RESUME SHEET leading the title cluster (hero-law: the guide's figure alone); the body becomes FOUR own-cards (the 2026-11-03 ruling applied to the guide) at the 860px reading column; state-language color only — step numerals to blue-wash discs, ONE amber watch line (the parser-blank caution, never red), the single blue primary stays on the Harvard link. Content byte-kept; the buried foot back pointer retired. The guide's doorway on /prep lives on the Resume channel card's card-foot link (see the `-door` record in prep.css). Gap fix riding the round: prep.css lacked `.chip.c-amber` while the surface's factor watch-chips emit it.
17. **The Letter-Guide Record** (2026-11-04, user ruling: "no need for me to review it. Build it directly on site; no mockup"). `/prep/letter-guide` — the resume guide's slim counterpart riding the SAME g-register: band (back chip + the drawn OPEN ENVELOPE letter — its own figure, hero-law) · four own-cards (letter shape table · five self-mark checks · plain layout with the ONE amber watch · how the check reads it). Sourcing register: SHRM 2024 verbatim quote is the only non-vendor external claim; JobStreet PH (vendor, labeled) carries the structure/PH conventions/250–400 words; the letter-structure signals stay the checker's OWN deterministic set and the page says so — no external letter standard claimed, no new outcome promises (Q1b register). The Letter channel card's peer door ignites with the page (`Letter guide →`), completing the two-door ruling; Presence stays doorless.

**Admin sweep queue (user-ruled 2026-11-04):** the other-roles realm — `AdminShell` (`app/admin/`), `admin.css` + `admin-tabs.css`, serving coach + sysadmin via Cohort · Audit queue · Approvals · Accounts tabs — is the next v9 sweep. Order: shell (header band + sidebar) first, then tabs starting with Cohort (user decision: we plan together → build one screen → capture → review → commit → repeat). Imagery: ONE self-drawn SVG metaphor per TAB (Cohort/Audit/Approvals/Accounts each own theirs — never repeated). Skeletons: admin currently ships none (no `loading.tsx`, no `loading` states) — added per the Skeleton Rule during the sweep. Review-capture widths 1440/720/390; full 5-width sweep probe (1440/1200/960/720/390) runs at round end.
