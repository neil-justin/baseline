# Tier 2 build brief — Profile tab (frozen decisions; 2026-11-03)

Reader: implementation agent. Rulings live in `2026-11-02-audit-fixes-design.md` §Tier 2 plus
the 2026-11-03 additions below (all user-locked). Fact base: the 2026-11-03 fact-map of
app/(app)/profile/ (line numbers below cite it). Do not re-decide; if reality blocks a frozen
call, stop that item and report — never improvise.

## Scope & ownership

- EDIT: `app/(app)/profile/**` (page.tsx, ProfileTabs.tsx, profile.css) +
  `components/PasswordFeedback.tsx` / `password-feedback.css` only if the CLS fix requires it.
- READ-ONLY: everything else (fixtures, engines, other surfaces, scripts). No commits, no dev
  servers, no Playwright. Never sweep unknown files (an untracked `scripts/
  prep-engine-quality.test.ts` is session work — leave it byte-untouched).

## A. New deltas (2026-11-03 user calls)

1. **DELETE the "Score trajectory" card entirely** (page.tsx `TrajGraphic` renderer + card
   wrapper + its `.lcap`/doc-notes/`closeLine` foot: "You're at {n}…", "You switched careers…",
   "Your next score line arrives…", the "+2 since setup" kicker logic). Zero replacement —
   the band's five-channel segbar is the live state. With it, the old trajectory-whitespace
   ruling (§Tier 2 item 1, profile.css `.traj` 88px canvas) is MOOT — delete the `.traj`,
   `.tl`, `.tv`, `.node`, `.rise` CSS + the `.traj-rows` ≤560px fold after grep.
2. **DELETE the "Pathway stages" card** ("First 30 days / Next steps / Entry-ready" rows +
   routeLine prose) — including its count logic; do NOT fold anything back (user explicit).
   Remove now-unused stage-strip CSS after grep.
3. **DELETE the page footer** (`.pro-foot` "PROFILE REPORT · NEIL · 4TH YEAR · COMPUTER & IT"
   + "Back to dashboard" + its CSS).
4. **DELETE the pillbar kickers** for Competencies ("0 OF 8 CLOSED") and Credentials
   ("2 COUNTED") — they duplicate their card heads. Plan/Account have no kicker already;
   ProfileTabs.tsx `:112-116` logic simplifies to none (grep the kicker consumers).
5. **FIX the band segbar fills** (band from Tier 2b): each channel segment must FILL by its
   fraction (Skills 0/25 → 0%, Employability 17/30 → ~57%, Training 0/20 → 0%, Application
   11/15 → ~73%, Direction 10/10 → 100%). Today the segments render as uncolored track blocks
   (user screenshot 2026-11-03). Find where `page.tsx:653-694` / the Tier 2b mini-bar renders
   and wire the per-channel fill width/color; unmeasured channels stay track-grey.
6. **Flag-only (build NOT included, report at end)**: change-password lacks a
   current-password/re-auth step (Supabase re-auth flow — separate work); NACE retake still
   routes to /onboarding (assessment lives there — flag to the main session, don't reroute).

## B. The seven Tier-2 ruled fixes (§Tier 2 of the design doc — all pending, fact-verified)

1 ~~trajectory whitespace~~ — moot (deleted with the card, see A.1).
2. Starting levels strip: implemented per the demotion ruling — NO structural change. Leave.
3. Declare-a-credential disclosure (DeclaredCredentials.tsx): anchor the entry button (it must
   stay mounted/visible while the form is open — no `{!open && …}` unmount), add focus +
   scroll management (focus the form's first field on open; scrollIntoView block:"start"),
   keep "Close without saving" reachable WITHOUT scrolling the tall form (pin/sticky or
   duplicate a compact abandon control near the form top). Honors reduced-motion if any
   transition is added.
4. Copy pruning (hard) — apply the fact-map inventory: one short honest helper line per
   control; delete/merge the essay lines (`AccountForms.tsx:153`, `PresenceCard.tsx:134`,
   `DeclaredCredentials.tsx:395` & `:287`, the 3-line Credentials `.lcap` trio `page.tsx:
   477-479`, `PresenceCard.tsx:28-29` PRIVATE_NOTE essay → 1 line, the audit-rules ×3 family
   → keep ONE instance, the data-rights prose per item 7). KEEP the spec-protected legend
   (`page.tsx:305`). Targets: no helper line longer than ~1 sentence; zero duplicated
   explanations of the same fact on one surface.
5. Identity card (AccountForms.tsx:35-162): name gets `autoComplete="name"` + `required`;
   year level becomes a constrained `<select>` (1st-5th Year / Graduate; keep the stored
   value mapped in); per-field inline validation errors rendered next to each field
   (client + mirror the API detail onto its field); Save in the identity card sits directly
   under the field grid (still the card's primary action, not below the campus meta).
6. Password CLS: reserve the feedback slot — `PasswordFeedback` renders a min-height
   skeleton/placeholder when empty (no layout jump on first keystroke); clear the follow-up
   copy positioning after it (AccountForms.tsx:243-263 stays structurally).
7. Data rights (DpaArtifacts.tsx + page.tsx:519-561 + profile.css): real DOM order replaces
   the CSS grid-reversed `.dpa-line` (remove the grid placement rules); wrap erase
   (confirm-input + button) in a real `<form>` so Enter submits; remove `{studentId}` from
   the export inventory line; dedupe announcements (erase ×2 → 1, export inventory ×2 → 1,
   erase-order line may stay under the erase row); delete the "↵" glyph (`:57`); drop the
   "button stays dead until the word matches" lecture (`:80`) — the disabled state is self-
   evident, keep a 3-word honest line at most.

## Guardrails

- e2e selectors: grep `e2e/*.spec.ts` for `.traj`, `.pro-foot`, kickers, `.lvl-strip`,
  `skills-table`, `assess-table`, declared-credential selectors BEFORE deleting anything;
  port/delete assertions in the same change; record old→new as a comment port list.
- The Competencies/NACE/skills-table registers are committed canon — build on them, don't
  re-cut (they were ruled in Tier 2d wave + Q6 wording where seen: rows say
  "Verified ·✓" style compact forms only if a wording pass touches them — do NOT reword
  what isn't being touched).
- All panels are server-rendered sections; keep the tabs' remount hash/arrow-key behavior
  intact.

## Verification

`npx tsc --noEmit` → 0 · `npx vitest run scripts/verify-fixtures.test.ts` +
`scripts/link-audit.test.ts` → pass · `git status` clean of unknowns at the end · NO commits.

## Report back

Files touched; the deletions with their grep receipts; the CSS final state of the band segbar
fill; the ports list; any frozen call that didn't fit reality; verification output.
