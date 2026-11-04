# Prep guide recut — design record (2026-11-04)

**Surface:** `/prep/guide` (format guide) · round sentenced by the `#mockups`
realm on `/prep/guide#mockups`, user-approved ("looks good") and recut the
same day. Realm retired with the cutover.

## Problem (user's critique, 2026-11-04)

- The guide page's structure/design pre-dated the v9 console register
  (v9 token sweep had passed it by — "hooks byte-untouched" — but no
  v9.1 structure/visual round ever ran on it).
- Band carried no drawn imagery while every sibling band does
  (Dashboard gauge, Prep ring, Assessments checksheet).
- No visible back affordance (the only exit was a buried ghost link at
  the page's foot, also mislabeled "Back to the Resume checker").
- One all-white card of flush sections; no state color; sections not
  compartmentalized.
- On `/prep` itself the guide's only doorway was the quiet links line
  under the re-run card.

## Decisions (all user-gated)

1. **Doorway on `/prep`** — the Resume channel card carries a card-foot
   `Format guide →` link (the Presence→Profile cross-link register).
   Letter/Presence cards get no door until a letter guide exists (no
   dead links). The `ResumeLinks` quiet line stays.
2. **Compartmentalization** — four own-cards (the 2026-11-03 "every
   section its OWN card" ruling applied to the guide): sections-order
   table · five self-mark checks · plain layout · Harvard template.
3. **Band** — top back chip `‹ Back to Prep` (Progress overlay's
   ArrowLeft register, M3 tonal pill; the buried foot pointer is gone)
   + the drawn ONE-PAGE RESUME SHEET leading the title cluster
   (`guide/BandArt.tsx`; hero-law: the guide's figure alone). The
   dashed offset page behind the sheet draws the one-page rule.
4. **Color** — state language only: step numerals → blue-wash discs;
   green pass marks kept on the five checks; exactly ONE amber watch
   tone (the parser-blank caution); the single blue primary stays on
   the Harvard link (locked Q1b).
5. **Column** — the guide joins the 860px reading column (R1, same
   precedent as the checker surface).

## Honesty contract

Byte-kept content: same tables, checks, rules, sources caption, and
external links (Harvard MCS + the locked Docs copy). No outcome claims
added; the watch chip is a format caution, not a verdict. Nothing
dynamic rides the page — it stays static curated reference.

## Found gap fixed in this round

prep.css shipped `c-green` / `c-blue` / `c-grey` chips but **no
`c-amber`**, while `/prep`'s factor tables emit `chip c-amber` for
watch-class rows (unstyled on the live page). The rule lands with this
round's CSS block.

## Next (separate round, not in this one)

The letter format guide (curated + sourced, slim counterpart riding
this same register) — the Letter channel card's door lights up when
it lands.
