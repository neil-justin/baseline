---
name: Career Readiness (Navy Console)
description: Enterprise Operations-Console for the college readiness score home — one committed deep-ink navy mass over a cool light field, full-width merit rows, tabular data ink, green speaks verified only.
colors:
  navy-0: "#0F1B2D"
  navy-1: "#13223A"
  navy-ink: "#FFFFFF"
  navy-2: "#AFC2DE"
  navy-3: "#8FA3C0"
  field: "#F8F9FB"
  row-hover: "#F1F4F9"
  panel-white: "#FFFFFF"
  ink-1: "#111827"
  ink-2: "#5A6473"
  ink-3: "#6B7280"
  glyph-grey: "#748093"
  rule: "#E5E7EB"
  blue: "#4F7CF0"
  blue-action: "#4666E0"
  blue-press: "#3D5CE0"
  blue-down: "#3350C4"
  blue-ring: "#9DB8FF"
  verified: "#34C08B"
  verified-ink: "#12805C"
  verified-wash: "rgba(52, 192, 139, 0.13)"
typography:
  readout:
    fontFamily: "\"IBM Plex Mono\", \"Fragment Mono\", ui-monospace, Menlo, monospace"
    fontSize: "clamp(3.4rem, 6vw, 5.4rem)"
    fontWeight: 500
    lineHeight: 0.95
    letterSpacing: "-0.02em"
  readout-denominator:
    fontFamily: "\"IBM Plex Mono\", \"Fragment Mono\", ui-monospace, Menlo, monospace"
    fontSize: "clamp(1rem, 1.4vw, 1.25rem)"
    fontWeight: 400
    letterSpacing: "0.01em"
  start-line:
    fontFamily: "Inter, \"Archivo Fallback\", system-ui, -apple-system, sans-serif"
    fontSize: "clamp(1.05rem, 1.6vw, 1.3rem)"
    fontWeight: 550
    lineHeight: 1
    letterSpacing: "-0.015em"
  band-body:
    fontFamily: "Inter, \"Archivo Fallback\", system-ui, -apple-system, sans-serif"
    fontSize: "15.5px"
    fontWeight: 400
    lineHeight: 1.6
  headline:
    fontFamily: "Inter, \"Archivo Fallback\", system-ui, -apple-system, sans-serif"
    fontSize: "clamp(1.35rem, 2vw, 1.7rem)"
    fontWeight: 650
    lineHeight: 1.15
    letterSpacing: "-0.02em"
  section-head:
    fontFamily: "Inter, \"Archivo Fallback\", system-ui, -apple-system, sans-serif"
    fontSize: "16px"
    fontWeight: 640
    letterSpacing: "-0.015em"
  row-title:
    fontFamily: "Inter, \"Archivo Fallback\", system-ui, -apple-system, sans-serif"
    fontSize: "14px"
    fontWeight: 600
    lineHeight: 1.3
    letterSpacing: "-0.005em"
  body:
    fontFamily: "Inter, \"Archivo Fallback\", system-ui, -apple-system, sans-serif"
    fontSize: "13.5px"
    fontWeight: 400
    lineHeight: 1.55
  note:
    fontFamily: "Inter, \"Archivo Fallback\", system-ui, -apple-system, sans-serif"
    fontSize: "12.5px"
    fontWeight: 400
    lineHeight: 1.6
  numeral:
    fontFamily: "\"IBM Plex Mono\", \"Fragment Mono\", ui-monospace, Menlo, monospace"
    fontSize: "14px"
    fontWeight: 500
    letterSpacing: "-0.01em"
  data-line:
    fontFamily: "\"IBM Plex Mono\", \"Fragment Mono\", ui-monospace, Menlo, monospace"
    fontSize: "12.5px"
    fontWeight: 400
    lineHeight: 1.6
  chip-mono:
    fontFamily: "\"IBM Plex Mono\", \"Fragment Mono\", ui-monospace, Menlo, monospace"
    fontSize: "12px"
    fontWeight: 400
    letterSpacing: "0.02em"
  micro:
    fontFamily: "\"IBM Plex Mono\", \"Fragment Mono\", ui-monospace, Menlo, monospace"
    fontSize: "11px"
    fontWeight: 400
    letterSpacing: "0.01em"
rounded:
  tick: "1px"
  track: "2px"
  chip: "4px"
  control: "6px"
spacing:
  xs: "8px"
  sm: "16px"
  md: "24px"
  section: "64px"
  column: "72px"
components:
  app-bar-navy:
    backgroundColor: "{colors.navy-0}"
    textColor: "{colors.navy-2}"
    typography: "640 14px Inter"
    padding: "11px 32px"
  cta-primary:
    backgroundColor: "{colors.blue-action}"
    textColor: "#FFFFFF"
    typography: "600 13.5px Inter"
    rounded: "{rounded.control}"
    padding: "11px 18px"
  cta-primary-hover:
    backgroundColor: "{colors.blue-press}"
  cta-primary-active:
    backgroundColor: "{colors.blue-down}"
  delta-chip:
    backgroundColor: "{colors.verified-wash}"
    textColor: "{colors.verified}"
    typography: "500 12px IBM Plex Mono"
    rounded: "{rounded.chip}"
    padding: "5px 10px"
  merit-row:
    backgroundColor: "{colors.panel-white}"
    textColor: "{colors.ink-1}"
    typography: "400 12.5px Inter"
    padding: "22px 32px"
  merit-track:
    backgroundColor: "{colors.rule}"
    textColor: "{colors.blue}"
    rounded: "{rounded.track}"
    height: "10px"
  receipt-row:
    backgroundColor: "{colors.panel-white}"
    textColor: "{colors.ink-2}"
    typography: "400 12.5px Inter"
    padding: "5px 0"
  tickline:
    backgroundColor: "{colors.panel-white}"
    textColor: "{colors.ink-2}"
    typography: "400 12.5px IBM Plex Mono"
    padding: "14px 2px"
---

# Design System: Career Readiness (Navy Console)

## Overview

**Creative North Star: "The Navy Console — an operations desk, not a brochure."**

This surface is a console in the enterprise sense: one committed deep-ink navy mass (#0F1B2D falling to #13223A in a subtle vertical gradient — the gradient IS the material, the only sanctioned one) carries brand, navigation, user, the `40 of 100` headline, the verified delta chip, and the single CTA. Below it a cool light field (#F8F9FB) answers the five score questions as full-width merit rows — channel label, honest state, a 10px track drawn as data, a tabular mono fraction — separated by single hairlines. Nothing in the field is a tile, a card, or a callout: the rows ARE the data, drawn the way an operations console draws a worklist. Color is meaning, never decoration: blue (#4F7CF0 family) speaks "measured", green speaks only "verified", grey speaks only "not yet measured".

This world replaces the prior instrument-table look (the SHS-era hairline tables with tracked instrument labels over everything — the flagged anti-reference). What survives is honesty and hairlines as row separators; what is rejected is that register: rows read as disciplined enterprise furniture-free data lines, captions are reduced to at most one instrument caption on a data instrument ("Breakdown", "Readiness"), and there are no stat tiles, no picture cards, no decorative eyebrows. Every number is computed from the store; absence renders as honest grey, never as an error; a delta chip exists only when two real readings exist.

**Key Characteristics:**
- One navy mass (bar + band fused into a single body) over a cool light field; the field's content rowwork is full-bleed within the sheet.
- Two voices self-hosted as woff2 with `font-display: block` (the venue runs offline — a hosted font sheet is never acceptable): Inter for prose, IBM Plex Mono for every numeral and data line.
- Tabular numerals everywhere numbers appear (`tabular-nums` + `"tnum"`); fractions read `n of m` in mono.
- 10px merit tracks drawn as data: honest `scaleX` fraction of the channel's earned share, blue, with a 2px ink target tick for the verified boundary; green only at verified-complete.
- Hairline discipline: #E5E7EB rules between rows only; the sheet's edges are carried by the sheet's own top/bottom rules. No boxes-in-boxes.
- Radius is ceilinged at 6px (controls); 4px chips, 2px tracks, 1px ticks. Nothing rounded into pill/blob shapes.
- State transitions at 120–160ms ease; one authored motion moment (count-up → armed breakdown), dead under `prefers-reduced-motion`.

## Colors

A cool, disciplined family: one deep blue-navy mass, one light field, three greys of ink, one measured-blue voice, one verified-green voice. Blue and green never overlap jobs on this surface.

### Primary
- **Console Blue** (#4F7CF0): the non-text accent — merit-track fills, the breakdown bar's segments, the active nav underline, and the focus outline. It speaks "measured/progress" on light ground and is legible there; it is NOT the CTA fill on the light field.
- **Action Blue** (#4666E0): the CTA fill — Console Blue stepped one honest stop deeper so white text holds contrast on the light field. Press steps to **Press Blue** (#3D5CE0) and **Down Blue** (#3350C4); the CTA's focus outline is **Ring Blue** (#9DB8FF).

### Secondary
- **Verified Green** (#34C08B): the verified verdict, in near-raw form on navy ground (the delta chip's text/border over its 13% wash) and as completed-track fill on the light field. **Verified Ink** (#12805C) is its light-field text-safe form for the check glyphs. Green never errors, never decorates, never labels a partial progress — its only job is "verified-complete".

### Neutral
- **Navy 0** (#0F1B2D): the app bar's flat fill and the band gradient's top stop — the fused mass's surface.
- **Navy 1** (#13223A): the band gradient's bottom stop.
- **Navy Ink** (#FFFFFF): all text on the navy mass.
- **Navy 2** (#AFC2DE): secondary text and quiet links on navy (band prose, start line).
- **Navy 3** (#8FA3C0): tertiary text on navy — instrument captions, denominator `/100`, target lines, chip borders.
- **Field** (#F8F9FB): the content field's page background.
- **Row Hover** (#F1F4F9): merit-row and footer-line hover tint.
- **Panel White** (#FFFFFF): the data sheet and footer surfaces.
- **Ink 1** (#111827): primary text on light ground, the target tick, and the strongest marks.
- **Ink 2** (#5A6473): secondary text — leads, notes, receipt names.
- **Ink 3** (#6B7280): tertiary text — channel states, receipt sources, denominators.
- **Glyph Grey** (#748093): the open-ring glyphs and neutral check marks — the grey an honest "not yet" wears when it is a glyph rather than text.
- **Rule** (#E5E7EB): every hairline, and the empty merit-track ground behind fills.
- **Verified Wash** (rgba(52, 192, 139, 0.13)): the delta chip's tint — green's quiet form.

### Named Rules
**The Two-Voice Rule.** Blue speaks "measured": track fills, bar segments, active nav, focus, and the one CTA. Green speaks "verified": verified-complete tracks, the delta chip, check glyphs, the footer's confirmed count. A state may never wear the other voice's color.

**The Contrast Step Rule.** #4F7CF0 is the accent, not the action color on light ground. Any filled action on the field steps to #4666E0 so white text keeps its contrast; the accent's full-brilliance form stays on non-text ink (fills, segments, underlines, outline).

**The Honest Absence Rule.** Grey means "not yet measured, nothing broken". Unopened channels (Application readiness before a first run, the situations battery) render as an empty grey track with an open-ring glyph and a plain-text state ("not yet measured") — never an error color, never a disabled-looking block, never a fake zero with numerals.

## Typography

**Display/Numeral Font:** IBM Plex Mono (self-hosted woff2, 400/500/600; fallback `ui-monospace`, Menlo)
**Body/Prose Font:** Inter (self-hosted variable woff2, 100–900; fallback `system-ui`, -apple-system)

**Character:** The classic operations-console pairing — a workhorse UI sans (Inter) carries every word of prose with tight engineered tracking on heads, while IBM Plex Mono is the machine's voice: the giant score readout, every fraction, every receipt source, every timestamped data line. Numerals without exception live in Plex Mono, tabular, so columns of data never reprice as values change. The pairing reads like credible enterprise product software; the old surface-note voice (tracked uppercase labels on every block) is retired — captions now number at most one per instrument.

### Hierarchy
- **Readout** (Plex Mono 500, clamp(3.4rem → 5.4rem), lh 0.95, −0.02em, tabular): the score headline — one per page, always paired with **Readout denominator** (Plex Mono 400, clamp(1rem → 1.25rem), Navy 3) and the **Start line** (Inter 550, clamp(1.05rem → 1.3rem), −0.015em, Navy 2, em-dash lead).
- **Headline** (Inter 650, clamp(1.35rem → 1.7rem), lh 1.15, −0.02em): section h2 in the field ("The five answers"), Ink 1.
- **Section head** (Inter 640, 16px, −0.015em): "Your next step" on the band, Navy Ink.
- **Band body** (Inter 400, 15.5px, lh 1.6, max 52ch): the band's running prose, Navy 2; inline `b` at 600 holds score numerals.
- **Row title** (Inter 600, 14px, −0.005em): the channel name at the head of each merit row, Ink 1.
- **Body** (Inter 400, 13.5px, lh 1.55, max 68–78ch): leads and why-lines, Ink 2.
- **Note** (Inter 400, 12.5px, lh 1.4–1.6): channel states (Ink 3), row notes (Ink 2), receipt rows.
- **Numeral** (Plex Mono 400/500, 14px, −0.01em, tabular): the right-aligned fraction `n of m`; the denominator slot drops to 11.5px in Ink 3.
- **Data line** (Plex Mono 400, 12.5px, lh 1.6): footer tick lines, charter rows.
- **Chip mono** (Plex Mono 400/500, 12px, +0.02em): the delta chip, journey line, target line.
- **Micro** (Plex Mono 400, 11px): receipt source tags only.

### Named Rules
**The Tabular Rule.** Every numeral on this surface is mono, tabular (`tabular-nums` + `"tnum"`, the `.num` discipline), and states its denominator. A number without its mono face or its "of m" is an uncalibrated reading — it does not ship.
**The Self-Host Rule.** Both faces ship locally as woff2 (`font-display: block`), score-critical fonts preloaded on first paint. The defense demo runs offline; a hosted font sheet is never acceptable.

## Layout

The page is two bodies in one stack. **The navy mass**: a sticky bar (flat navy-0) fused to the band's gradient so bar and band read as one body; its inner grid caps at 1360px with 32px gutters and is a two-column band (7fr score-left / 5fr actions+breakdown, 72px column gap) with a full-width journey line ruled beneath (`margin/padding 36/14px`, a soft navy rule at 22% alpha). **The light field**: sections capped at 1360px/32px gutters; the data sheet is full-bleed-out-to-college-gutter (rows run edge-to-edge of the container via −32px margins) so hover wash and hairlines run the full width without boxes-in-boxes.

Spacing runs on an 8px base: 8/16/24 inside and between components (row padding 22px top/bottom, internal gaps 7–18px, 24px between sheet and its heading block), 64px of section air before the answer block, 72px between band columns, and the footer breathes at 48px/64px. Band paddings: 56px top / 40px bottom (decided-state), 48/44px in the zero state.

Responsive: at 1020px the band collapses to one column (score → actions → breakdown → journey) and merit-row grids re-balance to rem-clamped columns; receipts lose their label-column indent. At 720px gutters drop to 20px, rows stack vertically as `flex` (name → state → track → fraction, all left-aligned), the CTA goes full-width, and the footer's tick lines remain the furniture.

## Elevation & Depth

Depth is tonal and linear, never lifted. The single strong mass (navy) sits above the field as a color fact — no shadow sells it, the gradient and the bar's fused flat fill do the work. The field is flat white/darkness-on-cool-paper separated by hairlines. The system's only shadow is the CTA's 1px structural lift (`0 1px 2px rgba(15, 27, 45, 0.35)`) — a seat-cushion shadow that keeps the button from dissolving against the navy, not decoration. Hover is answered in tint (Row Hover) or underline, never elevation.

### Named Rules
**The One-Lift Rule.** The CTA's 1px shadow is the only shadow in the system. No elevation may be added to sell depth; if a surface needs presence, it earns it with color mass or hairlines.

## Shapes

Small-radius rectangular, drawn with lines. The radius ladder steps down with containment: 6px controls (CTA), 4px the delta chip, 2px the merit track, 1px the target tick. Hairlines (#E5E7EB) are the only drawn borders on the light field — between rows only, with the sheet's own top/bottom rules carrying its edges. On navy, borders are translucent: the brand mark at 55% white, the user chip at 35% Navy 3, the journey rule at 22% Navy 2. Focus is a 2px outline offset 2px (Console Blue everywhere, Ring Blue on the CTA). Arrows are authored inline SVG strokes (1.7–1.8 width), never box decorations; the silhouette vocabulary is the ruled data line.

## Components

### Buttons
- **Shape:** softly squared inline-flex (6px radius), 9px glyph gap.
- **Primary (the one CTA):** Action Blue fill, white 600 at 13.5px, padding 11px 18px, the spaced trailing arrow (0.85 opacity, nudges +2px on hover).
- **Hover / Active / Focus:** hover to Press Blue; active to Down Blue with `translateY(1px)`; focus-visible is a Ring Blue 2px outline, offset 2px. All color/transform moves at 120ms ease.
- **Disabled:** 0.5 opacity, cursor not-allowed, transform frozen.
- **Quiet links:** navy-quiet (`link-quiet`) hover white on navy; field sub-links underlined in a mid-grey tint, hover turns Action Blue with currentColor underline.

### Chips / Badges
- **Delta chip (the only chip):** Verified Wash fill, Verified border at 42% alpha, Verified text, Plex Mono 500 at 12px (+0.02em), 4px radius, 5px 10px padding, 11px authored up-arrow SVG. Exists only on a proven two-reading trajectory (`+n since setup`) — never painted from nothing, never on a first reading.
- **There are no other chips.** Per-row source tags ("verified quiz", "checked resource", "self-report") are data-layer text in the receipts list (Plex Mono 11px, Ink 3), NOT UI chips — this is a user-locked product rule; they are evidence, not decoration, and must never be re-skinned as pills or badges.

### The data sheet and merit rows
- **Sheet:** Panel White, bounded by top/bottom hairlines only; its rows are full-bleed so hover and rules run edge-to-edge.
- **Merit row (channel row):** a four-lane grid — 15rem title / 12–24rem state / track / 10rem right-aligned fraction — baseline-aligned, 24px lane gap, 22px padding, hover washes Row Hover. Hairlines appear ONLY between rows.
- **State glyph discipline:** filled-dash check (13px, Verified Ink) for closed/verified, dashed open ring (Glyph Grey) for open/unmeasured. The check is green only where evidence runs verified-complete.
- **Merit track:** 10px tall, 2px radius, Rule ground; the fill is an honest `scaleX(var(--earn))` of the channel's earned fraction, Console Blue — turning Verified Green ONLY when `.is-done` (verified-complete). The 2px Ink-1 target tick sits at the verified boundary (2px overshoot top/bottom, 1px radius): left of the tick is proof, the remainder rides checked completions.
- **Honest-absence track** (Application readiness before a run): the same geometry, empty — plain Rule ground, open-ring state, "—" in the fraction lane, and a prose note that names the absence ("nothing is broken and nothing is logged yet").

### Receipts (sub-rows)
- Inline indented data rows under a channel (indented to the title column at 15rem+24px, unindented under 1020px): a summary line ("n of m closed bars carry receipts · k self-reported", receipt-leading order: verified → checked → claimed-last), then a simple list — glyph / name / source tag — 5px gap, 16px glyph lane. No boxes, no strip, no chips.

### Navigation (the navy bar)
- Sticky, flat navy-0 (borderless so it fuses with the band), 1360px inner, 11px/32px padding. Brand mark: 18px 1.5px white-55% square with a 6px Action-Blue square inside; wordmark Inter 640/14px white.
- Nav links: Navy 2, hover Navy Ink; the active page is Navy Ink with a 1px Console-Blue underline. Session chip: Navy 3 text, 35%-alpha Navy-3 border, 4% white fill. Sign out is a quiet POST form button, Navy 3 → white on hover.
- Scoped: the navy chrome applies ONLY where the route renders `.bar-navy` (dashboard); every other surface keeps the shared white bar untouched.

### Signature: the measurement sequence (band)
The one authored motion moment. On first paint the score counts up (900ms), width-guarded by a 2ch min on the readout so digits never reprice the line; ~160ms after it settles the breakdown bar arms (its segments run Console-Blue `scaleX` fractions of 40/25/20/15). The whole sequence is dead under `prefers-reduced-motion` (reads armed). Everything else on the surface answers in the same grammar: 120ms ease on color/underline/transform, hover nudges ≤2px. No parallax, no scroll choreography, no second moment.

## Do's and Don'ts

### Do:
- **Do** draw all five answers as full-width merit rows — title · honest state · 10px track · tabular fraction — with hairlines only between rows.
- **Do** keep blue = "measured" on #4F7CF0 for non-text ink and step any light-field action fill to #4666E0.
- **Do** reserve green for verified: completed tracks, the two-reading delta chip, verified check glyphs, the footer's confirmed count.
- **Do** render absence honestly: empty grey track + open ring + plain "not yet measured" state — never an error, never a fake zero.
- **Do** put every numeral in tabular IBM Plex Mono and state every denominator.
- **Do** scope the navy chrome to this surface via `.bar-navy`/`.dash` and keep the `:has()` gate so it cannot leak across client-side navigation.
- **Do** honor the delta-chip lineage rule: chip renders only on a proven two-reading trajectory; no trajectory data, no chip.
- **Do** prefer authored inline SVG glyphs (checks, rings, arrows) over glyph icon sets or unicode pictographs.

### Don't:
- **Don't** build stat-tile grids or picture-card grids: no `2×2` stat cards, no image tiles, no cards at all in the field — the row is the unit.
- **Don't** add kickers, eyebrows, or decorative overlines above headings; the tracked caption may exist only as an instrument caption directly atop a data instrument ("Breakdown", "Readiness") — at most one per instrument.
- **Don't** use hard-offset shadows, layered neo-brutalist lifts, or drop shadows on rows/panels — the CTA's 1px lift is the sole sanctioned shadow.
- **Don't** set gradient text, or any gradient fill, except the navy band's material gradient and the mandated 13% alpha washes/segment tints.
- **Don't** synthesize a verdict: no chip, tint, or green/blue meaning on an unverified reading; partial progress is blue, everything-not-yet is grey.
- **Don't** turn per-row source tags into UI chips or pills — they are data-layer text in the receipts list (user-locked product rule, not negotiable).
- **Don't** exceed the 6px radius ceiling, and never give a sub-element a radius larger than its container's.
- **Don't** rely on hosted font CDNs — both faces self-host (`font-display: block`), score fonts prefetched; the venue runs offline.
- **Don't** rename the e2e contract hooks (`.score-big`, `.sub-row ×4`, `.segbar .seg i`, `.journey-row`) or break the ScoreSequence verdict→arm order; structure changes never rename them.
