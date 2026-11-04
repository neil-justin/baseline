# Prep feedback round — ring, icons, analyze motion, not-letter gate

Date: 2026-11-04 · Status: **implemented** (F1–F4 user-ruled)
Prior: `2026-11-03-prep-section-cards-design.md` (card inventory stands, untouched)

## 1. Feedback (user, 2026-11-04)

1. Add an image on the header card, just like the My Plan page.
2. Handle wrong-file uploads (non-resume / non-cover-letter), and edge cases
   like it.
3. A subtle analyzing animation with a little delay on upload; animate again
   when the result lands.
4. Dashboard cards have icons; Prep has none.

## 2. Findings recorded before ruling

- My Plan's header card visual is the 130px `plan-ring` (progress ring,
  `pathway.css`). Prep's band right slot is the plain AR composite text.
- The resume checker already rejects parsed-not-a-resume files
  (`isProbablyResume`, `lib/engines/resume/parse.ts` — `not_resume` with a
  what's-missing inventory). The letter checker has NO equivalent: a parsed
  non-letter (essay, recipe) clears the 25-char floor and gets measured as a
  letter run. Both checkers already reject: multi-file, oversize, empty,
  encrypted, scanned, wrong-content-type, parse errors.
- Busy state today = text "Reading the file…"; success reloads instantly;
  no motion anywhere on the page.

## 3. Decisions (user-ruled, 2026-11-04)

| # | Decision | Ruling |
|---|----------|--------|
| F1 | Band visual | The AR composite becomes a **130px readiness ring** — `9/15` inside, small label under, same geometry as `plan-ring` (track + blue arc, tabular nums). The ring CSS lifts to the shared register (`.v7 .readring` in `v7.css`); My Plan's ring rides the same base with its look and the `.lead-mono` e2e guard byte-kept. |
| F2 | Line gate | Add `isProbablyLetter` — mirror of `isProbablyResume`: reject `not_letter` when 2+ of {salutation-style opener, applying/position/role mention, closing/signature line} are missing; the rejection names what's missing; persists nothing. `LetterUpload` gains the `not_letter` copy entry. |
| F3 | Analyze motion | Dropzone swaps to an "Analyzing…" state (spinner + subtle zone pulse) with a **~900 ms** minimum delay beside the fetch. Rejections surface after the same floor. On the re-rendered page, cards make a short staggered fade/slide entrance (~250 ms, ~40 ms stagger) behind `prefers-reduced-motion`. |
| F4 | Card icons | The three channel cards (Resume / Letter / Presence) get the Dashboard `.kicon` wash-circle register: 34px disc, 18px inline stroke SVG, wash backgrounds. Factor cards stay icon-less. |

## 4. Design

### 4.1 Ring (F1)

- `v7.css` gains `.v7 .readring` (block: 130px box, rotated svg, 9px stroke,
  track `--v-rows` / arc `--v-blue` round cap, centred `.num` figures + small
  label) — the geometry ported verbatim from `.v7plan .plan-ring`.
- `pathway.css` re-points `.plan-ring` at the shared base (alias), My Plan's
  markup unchanged, `.lead-mono` counter unchanged; e2e guards intact.
- `prep.css`: `.composite-wrap.prep-readiness` is replaced by the ring slot on
  the band right; prep's composite-only rules (`prep-readiness` overrides)
  retire with it.
- Prep band markup: left = title + subtitle (unchanged); right = ring with
  `<b>{ar}</b>/{AR}`-style figures inside (ar count / `WEIGHTS.ar` = 15) and
  the `application readiness` label under the figures. No career / no score
  keeps the `—` figure ("—" inside the ring, same as today's composite).
- The ring's arc fraction = readiness factors met ÷ 15, matching the number —
  the ring is the same figure, not a new metric.

### 4.2 Channel-card icons (F4)

- `prep.css` gains `.v7prep .prep-kpi .kicon` = the Dashboard `.kicon` rules
  (34px disc, 18px svg, `margin-bottom: 10px`), first child of the card.
- Icons (inline stroke SVG, Dashboard's `strokeWidth 2.2` style):
  Resume = document/description, Letter = mail, Presence = person.
- Wash colors: Resume `--v-blue-wash`, Letter `--v-green-wash`, Presence
  `--v-amber-wash` (the Dashboard three-wash family). All `aria-hidden`.

### 4.3 Analyze motion (F3)

- `ResumeUpload` / `LetterUpload`: the busy branch becomes the analyzing
  state — the zone (`.dz-zone.dz-analyzing`) renders a spinner + "Analyzing…";
  the file-input/drop handlers stay inert while busy (unchanged rule).
- Timing: `run()` starts the fetch and a 900 ms floor in parallel
  (`Promise.all`); the reload/rejection happens only after both settle. A
  rejection renders the existing `.dz-err` copy after the floor (same
  `role="status"` / aria-live contract, hooks byte-kept).
- Result entrance: on the server-rendered page, `.prep-kpis` cards +
  `.prep-stack .card` animate in (opacity 0→1, translateY 5px→0, ~250 ms
  each, ~40 ms stagger via `animation-delay` on `nth-child`), all inside
  `@media (prefers-reduced-motion: no-preference)`. Route loading skeletons
  stay untouched (no entrance motion added to them).
- No hooks change: `.dz-zone`, `.rs-upload`, `.rs-readout`, `.dz-err`
  all byte-kept; e2e unaffected (waits key on the same selectors; the reload
  still carries the result).

### 4.4 not_letter gate (F2)

- `lib/engines/letter.ts`: new sanity floor `isProbablyLetter(text)` after
  parse, before a run can be produced. Signals (mirroring the resume's
  deliberately low floors):
  1. salutation-style opener (the existing `SALUTATION_RE` or a name-style
     opener on the first lines),
  2. applying/position/role mention (`/appl(y|ied|ying)|application|position|vacancy|role|hiring|candidate/i`),
  3. closing/signature line (`/sincerely|respectfully|regards|yours truly/i`
     or the existing `CLOSING_ASK_RE`).
  ≥2 missing → `reject("not_letter", "This doesn't read as a cover letter" + missing inventory + ".")`.
- The rejected upload persists nothing (same store rule as every rejection).
- `app/api/cover-letter/check/route.ts` already relays `{error, detail}` —
  no route change beyond wiring the new code.
- `LetterUpload.tsx` REJECT_COPY gains:
  `not_letter: "This doesn't read as a cover letter."` — with the engine's
  detail carrying the missing-things tail (same pattern as `not_resume`).

### 4.5 Tests

- Engine: letter-engine test pins the gate — an essay/recipe sample rejects
  `not_letter` (parity with `resume-engine.test.ts` `not_resume`); a plain
  real letter (no 'Dear', but applying + regards) still passes.
- e2e: no hook changes; `.dz-analyzing` is additive and unasserted (a
  follow-up pin may ride the record spec's busy-state wait if timing jars —
  out of scope here).

## 5. What does NOT change

Engines' scoring, rubrics, AIR weights, stores, `/api` routes' behavior,
honesty copy, 860px geometry, card inventory (R1–R13), tab deep links, the
dropzone auto-run, named rejections' codes other than the added one,
resume-side parse gates.

## 6. Implementation record (2026-11-04)

### 6.1 Execution

Executed via the subagent-driven flow on branch `prep-feedback-round`
(worktree): `8f3a76b` gate · `cdcfa75` relay/copy · `7387a4f` kicons ·
`356570f` ring · `402b379` analyze beat. Two review findings landed as a
fix commit (`119f296`): a zero-fraction arc paints a round-cap dot with the
register's linecap, so BOTH rings (prep + My Plan) now render their arc
only when the fraction is positive — never a painted zero; and the ≤720px
band fold regained the ring's right edge (`margin-left: auto`). Full vitest
bank 144/144 and `tsc --noEmit` green at every landing; `next build`
compiles (its page-export type check fails on pre-existing
`sortResourcePool`/`buildQueue` exports — reproduced on main, out of scope).

Merged to `main` (`651c2e5`), branch + worktree retired.

### 6.2 Round 2 — the in-place swap (user-ruled 2026-11-04, after live
measurement)

Live measurement showed the ~900 ms beat and the card cascade both RUN, but
`window.location.reload()` breaks the handoff: the old document blanks, the
new document's progressive paint reads as a skeleton, the scroll position
jumps (1765 → 870 in the probe), and the 0.25 s cascade finishes in a part
of the page the user isn't looking at. Ruling: **Option A — swap in place
via `router.refresh()`** (no document reload, scroll preserved); after the
refresh settles the entrance cascade is **replayed deliberately** via the
animation-restart trick, and the page **always auto-scrolls the verdict
card** (the readout, first card of the active tab's stack) to the top of
the viewport. Rationale: in-place swap is how comparable checkers
(Jobscan-style flows) land results; a dedicated results route was ruled
out = too disruptive for the one-surface Prep.

Follow-up obligation: the e2e specs in `.worktrees/google-signin/e2e/`
assume reload semantics (they still pass — assertions carry 45 s budgets —
but their "RELOADED document" comments need a visit on that branch).

Executed as plan Task 7 and landed on `main`: `43c6bb3` in-place swap —
`startTransition(() => router.refresh())`, landing signal = the sanctioned
`useTransition().isPending` flip cycle (verified live: flips false exactly
at the RSC commit), then the animation-restart trick replays the cascade
on the active panel's cards and the verdict card scrolls to the viewport
top (reduced motion → instant `auto`). Review fixes (`ecc0f5a`): the 8 s
watchdog now discriminates — an UNOBSERVED landing is the honest dead-end
(no replay, no scroll); the landing timer is an 80 ms interval (rAF
freezes on hidden tabs); the restart is one batched reflow; the probe
script's contract matches what it measures. Evidence: no document
navigation (perf entries 1→1), scroll preserved then animated to
`verdictTop = 0`, cascade replay recorded post-commit, zone idle after.
`tsc` clean + vitest 144/144 at both landings.

Round 2b landed as `7029b10` (probe `scripts/prep-feedback-probe-3.mjs`):
while the check runs the active panel's non-uploader cards are hidden and
the zone reads as a tall centered analyzing hero (the ruling's CSS kept,
except `pointer-events: none` was dropped by the executor then RESTORED in
review). The reviewer's independent evidence: class survives the RSC
commit (dataset-tag probe), exactly one visible card during the wait,
order-swap restore-first choreography, reduced-motion renders the hero
static. One noted flake: in an artificially throttled 14 s run the smooth
verdict scroll aborted at 501 — the choreography itself behaved per ruling
(cards restored, no dead-end); unthrottled runs land at 0 every time.

Round 2c: user feedback — (1) the ring label `APPLICATION READINESS` hugged
the ring's inner edges, so the figures stay inside and the caption moved
BELOW the ring (`.readring-slot` column; desktop caption right-aligned
under the ring, ≤720px fold centred — 390px screenshot-checked); My Plan's
ring untouched (its `checked` label is short). (`2f8aff8`) (2) the analyzing
hero grew abruptly — `hero-grow` now animates min-height 0→320px with a
fade/drift entry (reduced motion: static). Landed with the controller's
one unifying follow-up: `hero-grow` and the `dz-pulse` breathe are CHAINED
on the busy zone (grow 0.24s, then pulse), so the wait keeps both motions.

### 6.3 Round 2b — full content swap on busy (user-ruled 2026-11-04, live
screenshot review)

The measured complaint: same-file re-runs produce byte-identical results,
and the cascade (250–500 ms) finished before the ~600 ms scroll to the
verdict arrived — "all it does is the analyzing text". Ruling: **the busy
state REPLACES the tab's content**: while a file is being checked, the
active tabpanel hides its result cards (CSS, class-scoped — nothing is
deleted) so the panel shows ONE analyzing card — the running zone recast as
a tall hero: spinner, `Analyzing…`, a sub line ("your file is being
checked — the result lands here when it's ready") — no staged/fake progress
claims, no bar (honesty contract). On the landing signal: panel class
removed, the fresh stack arrives, the cascade replays, and the page scrolls
to the verdict card (the Resume checker readout = the section top). Same
reduced-motion gates. The busy zone keeps every e2e hook; the panel-class
swap is client-imperative and cleaned in `finally`.
