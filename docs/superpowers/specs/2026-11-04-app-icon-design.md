# App Icon ("Baseline" mark) — Design

**Date:** 2026-11-04
**Status:** Approved direction (Option C — "B monogram, underlined"), pending user review of this spec.

## Overview

The app currently ships **no icon at all** (no `favicon.ico`, no `icon.*`, nothing in `app/` or `public/`). This spec adds a minimal, complete icon bundle based on the approved concept: a bold white **B** monogram on a Blue-Ink tile, underlined by a Command Blue baseline bar.

## Deliverables

| File | Purpose |
|---|---|
| `app/icon.svg` | Primary icon — modern browsers, browser tabs, bookmarks. Source of truth. |
| `app/apple-icon.png` | 180×180 PNG export for iOS home-screen icons. |
| `app/favicon.ico` | 32×32 ICO fallback for legacy browsers/crawlers. |
| `scripts/generate-icons.mjs` | One-off script that renders `app/icon.svg` to the PNG and ICO via `sharp`. Re-runnable if the mark changes. |

No changes to `app/layout.tsx` or any existing file — Next.js file conventions auto-generate the `<link>` tags. (Coordination note: another session (`ses_e5b0cd1a7ffehsc8H2NGbFnQc4`) is revamping the app in parallel; this work adds only new files and touches no shared surface.)

## Design spec

- **Canvas:** 64×64 viewBox.
- **Tile:** rounded square, rx ≈ 14 (22% of canvas — standard app-icon curvature), fill Blue-Ink `#012B53`.
- **Monogram:** bold geometric "B" (~800 weight), white `#FFFFFF`, optically centered. Drawn as **vector paths, not `<text>`** — a favicon SVG must render identically across browsers/OSes, and `text` depends on system fonts. Exact path is authored during implementation and visually verified at 16 / 32 / 64 px against the approved mockup (browser tab strip check).
- **Baseline bar:** Command Blue `#1A73E8`, rounded caps, sitting beneath the B, width ≈ 44% of canvas.
- All colors are verbatim DESIGN.md tokens; no new palette values.

## Implementation notes

- `sharp` **v0.35.5 is already present** in `node_modules` (Next.js transitive dependency) — **no new dependency**, nothing to install. If it ever disappears from the tree, surface it; do not silently add it as a direct dependency without user sign-off.
- ICO generation: `sharp` has no ICO writer, but modern ICO supports embedded PNG. The script emits a minimal ICO container (6-byte header + 16-byte directory entry) wrapping the 32px PNG — ~20 lines, no library.
- Script is deterministic and offline (the venue runs offline; no hosted-font or network refs in the icon).
- The script lives with the other `scripts/*.mjs` utilities and is run manually (`node scripts/generate-icons.mjs`), not wired into the build — regenerating is a rare, deliberate act.

## Verification

1. `node scripts/generate-icons.mjs` produces `app/apple-icon.png` and `app/favicon.ico`; byte-level sanity check of the ICO header.
2. `next dev` and inspect the served `<head>` for `rel="icon"`, `rel="apple-touch-icon"` links pointing at the three files.
3. Visual check of the mark at 16 / 32 / 180 px (browser tab strip + direct URL).

## Out of scope

- In-page logo / wordmark treatment in the marketing header or sidebar (separate concern; the parallel session owns the visual revamp).
- Dark-mode variant, PWA manifest icons, and og-image — none requested.
