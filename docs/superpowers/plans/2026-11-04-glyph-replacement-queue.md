# V9 remaining queue — glyph replacement (queued 2026-11-04, non-prio)

**User ruling:** the app leans on unicode characters (✓, ✓✓, →, ↵, —) where a real icon belongs; it reads badly. Fix later — not a priority, but committed work.

## The constraint

DESIGN.md freezes the Material Symbols subset at 7 glyphs (`space_dashboard`, `work`, `checklist`, `description`, `account_circle`, `verified`, `task_alt`) — glyph expansion requires a deliberate **re-subset** of the self-hosted woff2 (offline venue, no hosted sheets).

## Spots (grep sweep at queue time — re-sweep when picking up)

- Wash chips' verdict marks: `✓` / `✓✓` (onboarding chips, dashboard, career, pathway ledger, prep, admin) — candidates: re-subset `check`/`done_all`, or keep CSS-drawn
- The honest "or" divider on auth (`— or —`) — replace with hairline + label (Google's pattern)
- Arrows inside copy strings: `→` (CTAs, links), `↵` (auth alt links via `glyphs.tsx` BackArrow — the component draws a return glyph; audit whether it should be a real icon or kept)
- Footer/legal separators and any `·` middots in kickers (fine to keep — typographic, not iconographic)

## Fix strategy (when picked up)

1. Re-subset Material Symbols Outlined to the deliberate set (add `check`, `done_all`, `arrow_forward`, `arrow_back`, `logout` if needed) via the same subsetting pipeline that froze the current 7
2. Replace unicode verdict marks with `.ms` glyphs; keep tabular copy separators
3. Arrows that are CONTENT (`→` inside a sentence) may stay as typographic arrows — decide per-spot against Google's own usage (Google uses real glyph arrows in buttons, text arrows in prose)
4. Update DESIGN.md subset note + the frozen-glyph rule
