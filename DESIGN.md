---
name: Career Readiness (The Index)
description: Precision-instrument landing for PH career readiness — cool quiet ground, hairline data tables, one earned-green accent on computed states.
colors:
  quiet-ground: "#F4F5F4"
  panel-white: "#FFFFFF"
  ink: "#16181A"
  ink-secondary: "#515651"
  ink-micro: "#666C66"
  hairline: "#DFE1DE"
  hairline-soft: "#EAEBE9"
  earned-green: "#0B5F45"
  earned-green-deep: "#08492F"
  earned-green-wash: "#0B5F4522"
  hover-wash: "#F7F8F7"
  slot-unearned: "#E9EBE8"
  border-strong: "#C4C8C3"
  placeholder-grey: "#9AA09A"
typography:
  display:
    fontFamily: "Archivo, system-ui, -apple-system, sans-serif"
    fontSize: "clamp(2.5rem, 5.2vw, 4.35rem)"
    fontWeight: 660
    lineHeight: 1.04
    letterSpacing: "-0.032em"
  headline:
    fontFamily: "Archivo, system-ui, -apple-system, sans-serif"
    fontSize: "clamp(1.5rem, 2.6vw, 1.9rem)"
    fontWeight: 640
    lineHeight: 1.15
    letterSpacing: "-0.025em"
  title:
    fontFamily: "Archivo, system-ui, -apple-system, sans-serif"
    fontSize: "15.5px"
    fontWeight: 620
    lineHeight: 1.3
    letterSpacing: "-0.015em"
  body:
    fontFamily: "Archivo, system-ui, -apple-system, sans-serif"
    fontSize: "15.5px"
    fontWeight: 420
    lineHeight: 1.6
  label:
    fontFamily: "Fragment Mono, ui-monospace, SFMono-Regular, Menlo, monospace"
    fontSize: "11px"
    fontWeight: 400
    letterSpacing: "0.13em"
  readout-numeral:
    fontFamily: "Fragment Mono, ui-monospace, SFMono-Regular, Menlo, monospace"
    fontSize: "44px"
    fontWeight: 400
    lineHeight: 1
    letterSpacing: "-0.01em"
rounded:
  slot: "2px"
  badge: "3px"
  inner-control: "4px"
  panel: "6px"
spacing:
  xs: "4px"
  sm: "8px"
  md: "16px"
  lg: "24px"
  xl: "56px"
  section: "64px"
components:
  button-primary:
    backgroundColor: "{colors.earned-green}"
    textColor: "#FFFFFF"
    typography: "600 13px Archivo"
    rounded: "{rounded.panel}"
    padding: "10px 18px"
  button-primary-hover:
    backgroundColor: "{colors.earned-green-deep}"
  button-ghost:
    backgroundColor: "{colors.panel-white}"
    textColor: "{colors.ink}"
    rounded: "{rounded.panel}"
    padding: "10px 18px"
  panel:
    backgroundColor: "{colors.panel-white}"
    rounded: "{rounded.panel}"
  input-text:
    backgroundColor: "{colors.panel-white}"
    textColor: "{colors.ink}"
    rounded: "{rounded.panel}"
    padding: "10px 12px"
  instrument-label:
    textColor: "{colors.ink-micro}"
---

# Design System: Career Readiness (The Index)

## Overview

**Creative North Star: "The Index — a precision instrument."**

The landing is a measurement, not a pitch. The page reads a student aloud: cited labor statistics, a career index table, a computed rubric readout — so a thesis panel and an undecided Grade 11–12 student both see an instrument, not a promise. Everything sits on a cool quiet ground (#F4F5F4) with white panels drawn only by hairline rules; depth comes from tonal layering and 1px lines, never from shadows or gradients. One deep green (#0B5F45) is the entire accent economy, reserved for what is earned: the primary action, honest bar fills, the selected index row, verified numerals, focus, and error. The category default this world refuses is hero-copy-plus-testimonial-cards: there are no cards, only calibrated surfaces and hairline-ruled tables.

Density is deliberately higher than a marketing page — mono data voices at 11–12.5px, three-stat full-bleed band, 12-row index preview — but the register stays calm: generous section padding (64px), tabular numerals everywhere, and microcopy that names its source under every number. Copy is never decorated: no badge chips on stats, no tagline pills; the source line sits under the numeral in tracked mono.

**Key Characteristics:**
- Cool quiet ground, white flat panels, hairline borders — no gradients, no ambient shadows.
- One accent (#0B5F45) on earned/verified states and the primary action only.
- Two self-hosted voices: Archivo (variable sans, weights chosen in 10-steps off the axis) and Fragment Mono (labels, data rows, the 44px readout score).
- Tabular numerals on every number, sans or mono.
- Structure drawn with 1px hairlines; full-bleed bands bounded top and bottom by hairlines.
- 6px radius ceiling; sub-element radii step down (4px / 3px / 2px).
- Fonts self-hosted woff2 with `font-display: block` — the venue runs offline.

## Colors

A green-cast neutral family on a cool paper ground, with a single deep signal green that almost never appears — its rarity is the point. There is no Secondary or Tertiary accent; one voice, one meaning.

### Primary
- **Earned Green** (#0B5F45): the primary CTA fill, earned bar fills in the readout, the selected index row's 2px edge and its fit numerals, the readout's fit line, error text and error borders, the focus ring, the caret, and the footer's repeated "Start check ↵". Appears only on states that were earned, verified, or are the one action. Hover deepens to **Earned Green Deep** (#08492F). Text-safe on white at large sizes and always paired with white text when used as a fill.
- **Earned Green Wash** (#0B5F4522, ~13% alpha): the selected row's background tint, the text-selection color, and the 3px input focus halo. The accent's quiet form — it tints, it never shouts.

### Neutral
- **Quiet Ground** (#F4F5F4): the page background; everything rests on it.
- **Panel White** (#FFFFFF): all panels, the stat band, the rubric block, the evidence footer, buttons, inputs.
- **Instrument Ink** (#16181A): primary text, headline numerals, the strongest border (brand mark).
- **Softened Ink** (#515651): secondary text and mono data rows — ≥4.5:1 on white.
- **Microcopy Ink** (#666C66): instrument labels, source lines, legend entries — ≥4.5:1 on white.
- **Hairline Grey-Green** (#DFE1DE): the structural hairline — panel borders, band edges, column rules.
- **Hairline Soft** (#EAEBE9): inner-row dividers inside a panel.
- **Hover Wash** (#F7F8F7): row and cell hover tint, one step off the ground.
- **Unearned Slot** (#E9EBE8): the empty segment background behind earned bar fills.
- **Border Strong** (#C4C8C3): input hover border, text-underline decoration (#B9BDB8 shares this mid-grey register for scrollbars and quiet underlines).
- **Placeholder Grey** (#9AA09A): input placeholders only — exempt from the 4.5:1 text rule because it is pre-interaction hint text.

### Named Rules
**The Earned Green Rule.** Green is not decoration; it is a verdict. It appears on the primary CTA, earned bar fills, the selected index row plus its fit numerals, error states, focus, and the footer action — and nowhere else. If a state isn't earned, verified, or the primary action, it stays ink.

**The Green-Cast Grey Rule.** Every grey in the system is tinted from the ground's hue (a whisper of green in each), never a pure industrial grey. New neutrals must mix from the same family, and text tints must hold ≥4.5:1 on white.

## Typography

**Display Font:** Archivo (variable, 100–900, self-hosted woff2, with system-ui fallback)
**Body Font:** Archivo (same variable file)
**Label/Mono Font:** Fragment Mono (400–500, self-hosted woff2, with ui-monospace fallback)

**Character:** One humanist grotesque carries all prose with tight, engineered tracking on headings; Fragment Mono is the instrument's voice — uppercase tracked labels, data rows, and the readout score. The pairing reads like lab equipment: quiet serifless prose over mono readouts. Both faces ship locally (`font-display: block`) because the venue runs offline; a hosted font sheet is never acceptable.

### Hierarchy
- **Display** (660, clamp(2.5rem, 5.2vw, 4.35rem), lh 1.04, −0.032em, balanced wrap): the single h1 per page — "Know exactly where you stand."
- **Stat numeral** (560, clamp(2.6rem, 4.5vw, 3.6rem), lh 1, −0.035em, tabular, unit as 0.42em sub): the three-stat band's headline numbers. Archivo, not mono — the page's one exception to the mono-numeral voice.
- **Headline** (640, clamp(1.5rem, 2.6vw, 1.9rem), lh 1.15, −0.025em): section h2.
- **Title** (620, 15.5px, lh 1.3, −0.015em): step/card headings (h3).
- **Body** (420, 15.5px, lh 1.6): running prose; lede paragraphs at 15.5px/1.62 in Softened Ink, capped ~52ch.
- **Data row** (Fragment Mono 400, 12–12.5px, lh 1.45–1.6): index rows, source lists, legend lines.
- **Readout numeral** (Fragment Mono 400, 44px, lh 1, −0.01em): the score, with `/100` at 15px in Microcopy Ink.
- **Label** (Fragment Mono 400, 11px, +0.13em, uppercase, Microcopy Ink): every instrument label — CAREER INDEX, READINESS · SAMPLE STUDENT, source lines, footer colophon.

### Named Rules
**The Tabular Rule.** Every numeral is tabular — `font-variant-numeric: tabular-nums` on every number-bearing element, sans or mono alike. Readout and table numerals speak in Fragment Mono; the stat band's display numerals are the sanctioned Archivo-tabular exception.

**The Variable Weight Ladder.** Weights are picked in 10-steps off Archivo's variable axis — 420 body, 480–530 quiet emphasis, 550–570 links and soft-strong, 600–620 buttons and titles, 640–660 headings. Never snap to the 400/700 defaults; the fine ladder is what keeps the register calm.

**The Tracked Label Rule.** Instrument labels are 11px Fragment Mono, uppercase, +0.13em, in Microcopy Ink. (The direction contract pinned 10px; the shipped build uses 11px — the build wins.) Every readout, table, and band carries one; a number without its tracked label is an uncalibrated reading.

## Layout

Content lives in a 1200px wrap with 32px gutters (20px under 720px); full-bleed bands — app bar, stat band, rubric block, evidence footer — run edge-to-edge, bounded by hairlines, with their inner grids capped at 1360px. The page alternates between these two modes: quiet ground sections (hero, index preview, work loop) and full-bleed white bands (stats, rubric, evidence).

The first viewport is a two-column instrument: left ~55% headline + claim + CTAs, right ~45% the gauge (mini index over readout), columns aligned to start, 56px gap. The rubric block splits 42/58, evidence 46/54, always with 56px gaps. Sections breathe at 64px vertical padding (48px under 720px); the hero sits at 52/56px.

Spacing runs on a 4px base: 8–16px inside components (panel padding 16px, row padding 10–12px), 24–28px between blocks, 56px between columns and 64px between sections. Breakpoints at 1020px (columns collapse to one; stat dividers rotate from left-border to top-border; loop grid stacks) and 720px (column heads hide, index rows re-grid to career/strand/entry with skills right-aligned, instrument labels and quiet links drop).

## Elevation & Depth

Flat by construction. Depth is tonal and linear: white panels on Quiet Ground, separated by 1px hairlines; nothing floats. There are no gradients anywhere, and no ambient or drop shadows — the single sanctioned shadow in the system is the 1px lift on a segmented control's selected thumb. Focus and selection use the accent's wash form (3px halo, 13% selection tint), which reads as calibration, not elevation.

### Shadow Vocabulary
- **Thumb lift** (`box-shadow: 0 1px 3px rgba(22, 24, 26, 0.07)`): the selected thumb of a segmented control (e.g. the role toggle). The only resting shadow in the system; do not generalize it to panels or cards.

### Named Rules
**The Flat Instrument Rule.** Panels are flat white with 1px hairline borders at rest. Shadows are not depth — the only permissible one is the segmented-control thumb lift. Depth is conveyed by tonal layering (white on ground) and hairline rules.

## Shapes

The form language is small-radius rectangular, drawn with lines rather than fills. Panels, buttons, and inputs share the 6px radius; sub-elements step down inside their containers — 4px for inner segmented thumbs, 3px for mono badges, 2px for rubric bar segments, 2px on focus outlines. Borders are always 1px hairlines (#DFE1DE externally, #EAEBE9 between rows of the same panel); the brand mark is the one 1.5px stroke. Adjacent cells in a grid (stat band, loop steps, source list) are separated by 1px shared borders, not gaps-in-space. Nothing is clipped to circles or pills; the silhouette vocabulary is the ruled rectangle.

## Components

### Buttons
- **Shape:** softly squared (6px radius), inline-flex, 9px glyph gap.
- **Primary:** Earned Green fill, white text, 600 weight at 13px, padding 10px 18px (hero variant 14px / 13px 22px). Trailing glyph (↵) set in Fragment Mono at 0.85 opacity.
- **Hover / Active / Focus:** hover deepens to Earned Green Deep; active presses `translateY(1px)`; focus-visible is a 2px accent outline offset 2px. Transitions 0.12–0.15s ease on background/border/transform.
- **Ghost:** Panel White fill, 1px Hairline border, Instrument Ink text at 550 weight; hover shifts border to Softened Ink. Green never appears on ghost buttons.
- **Quiet links:** 12.5px Softened Ink; hover underlines with 3px offset. The underlined sub-action ("Browse the career index →", 13.5px, #B9BDB8 underline) turns accent-green on hover — hover is a sanctioned green moment.

### Inputs / Fields
- **Style:** Panel White fill, 1px Hairline border, 6px radius, padding 10px 12px, 14px Archivo, Instrument Ink text; caret colored Earned Green.
- **Hover:** border shifts to Border Strong (#C4C8C3).
- **Focus:** border turns Earned Green with a 3px Earned Green Wash halo (`box-shadow: 0 0 0 3px var(--selection)`); no outline.
- **Error:** the message and the border both take Earned Green at 530/12px — this world earns its errors with the same accent, never a red. Field rules ("required" etc.) render as 9.5px tracked mono microcopy.

### Panels / Containers
- **Corner Style:** 6px radius, the system ceiling.
- **Background:** Panel White only.
- **Shadow Strategy:** none — see the Flat Instrument Rule.
- **Border:** 1px Hairline externally; 1px Hairline Soft between internal rows.
- **Internal Padding:** 16px in the readout and mini-index head/rows; 26px on auth forms.

### Chips / Badges
- **Style:** Fragment Mono 11px, 1px Hairline border, 3px radius, 1px 6px padding, Softened Ink on Panel White. Used only as inline metadata ("SAMPLE 40") inside step beats — never as colored status pills.

### Navigation
- **App bar:** sticky Panel White strip with a bottom hairline; 18px CSS-geometric brand mark (1.5px Instrument Ink square containing a 6px Earned Green square — the one decorative green), 640-weight 14px wordmark, mono 11px meta ("32 careers · sample score"). Quiet links right; the primary CTA is the only filled element. Under 720px the quiet links and meta drop, leaving brand + CTA.

### Signature Component: the readiness gauge
The page's memorable instrument, and the pattern all score surfaces must follow. Two stacked panels: the **mini index** — mono 12px rows with a hairline-soft divider each, hover wash, and a selected state that earns a 13% green wash, a 2px green left edge, and green fit numerals; and the **readout** — 44px mono tabular score over a 10px-tall segmented rubric bar (2px gaps, 2px segment radius) whose fills are honest `scaleX` fractions of the earned score (SP 30/40 → 0.75), animated 1.1s on `cubic-bezier(0.16, 1, 0.3, 1)` with 80ms stagger and disabled under `prefers-reduced-motion`, over Unearned Slot backgrounds. Below: an 11px mono legend (SP/ES/TP/CC with fractions) and the fit line whose key numeral is green. Selecting an index row swaps the fit line live; the bar and the row stay in sync — the instrument visibly takes a measurement.

## Do's and Don'ts

### Do:
- **Do** set every numeral tabular (`tabular-nums`), and voice data (index rows, legends, sources, the score) in Fragment Mono at 11–12.5px.
- **Do** label every readout with the 11px tracked uppercase instrument label before its data.
- **Do** keep text tints ≥4.5:1 on white — Softened Ink (#515651) and Microcopy Ink (#666C66) are the floor, not placeholders for lighter greys.
- **Do** draw structure with 1px hairlines (#DFE1DE outer, #EAEBE9 inner) and separate full-bleed bands with hairlines top and bottom.
- **Do** animate bar fills as honest fractions of earned state (scaleX of the earned share, 1.1s cubic-bezier(0.16,1,0.3,1), 80ms stagger, `prefers-reduced-motion` kills it).
- **Do** self-host both faces as woff2 with `font-display: block`; the venue runs offline.
- **Do** pick weights in 10-steps off Archivo's variable axis (420 body … 660 display).

### Don't:
- **Don't** paint readiness: a bar never fills past its earned fraction, and no number appears without computation behind it or a named source under it.
- **Don't** use green decoratively — background tints, headings, borders, or icons that aren't earned/verified/primary-action/error/focus stay ink.
- **Don't** add gradients, glows, or ambient shadows; panels stay flat with hairline borders (the segmented thumb's 1px lift is the sole exception).
- **Don't** build the category-default hero-plus-testimonial-cards layout: no cards, no quote components, no student photos, no fabricated social proof — tables and calibrated panels only.
- **Don't** exceed the 6px radius, and never give a sub-element a radius larger than its container's.
- **Don't** reach for icon fonts or glyph-icon sets; marks are geometric CSS (squares, hairlines) and arrows are typographic punctuation in the mono voice.
