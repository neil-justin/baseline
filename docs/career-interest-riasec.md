# Career interest → RIASEC → career suggestion (review draft)

**Status:** awaiting user review (2026-11-06). Nothing in `lib/` changes until the
curated set + scoring rules below are approved.

## 1. What replaces what

| Layer | Today | This draft |
| --- | --- | --- |
| Onboarding interest quiz (`INTEREST_QUIZ`, 6 statements) | fixture text; answers **ignored** — cards are `DEMO_SUGGESTION_ORDER` (`["swd","da","its"]`), hardcoded | O*NET **Interest Profiler** items (pulled, CC-BY) filtered to a corporate subset; answers **scored** per RIASEC |
| Suggestion cards | hardcoded trio + baked copy per card | ranked **top-3 from the program-gated career list**, fit lines generated from the student's own scoring profile |

Provenance: `research/onet-enrich/pulls/onet-interest-profiler-{60,mini-30}.json`
(+ pagination receipts `.url.txt`), pulled live 2026-11-06 with the repo's API key
discipline (X-API-Key header, never logged). Scale: 1 Strongly Dislike · 2 Dislike ·
3 Unsure · 4 Like · 5 Strongly Like.

## 2. Curated corporate subset (16 items, all six letters 2–3 each)

Selection rule (fixed, reviewable): an item stays if its work **object** exists in
entry-level corporate settings in PH (ledgers, contracts, departments, shipments,
record-keeping, service); the correct verb class of its RIASEC area is preserved.
Every item below keeps its O*NET source ref (question index within the pulled JSON).

| # | Area | Item (verbatim O*NET text) | Source ref |
| --- | --- | --- | --- |
| 1 | R | Test the quality of parts before shipment | 60-form q37 |
| 2 | R | Assemble electronic parts | 60-form q25 |
| 3 | I | Help people understand and use data or records correctly | **gap — no pulled I item is corporate-phrased; see §2.1** |
| 4 | I | Study and compare products, costs, or reports before deciding | **gap — see §2.1** |
| 5 | A | Arrange and present written material so it is easy to read and appealing | **gap — see §2.1** |
| 6 | A | Choose colors, layouts, or images for a company's display or page | **gap — see §2.1** |
| 7 | S | Give career guidance to people | mini q10 |
| 8 | S | Help people resolve a complaint calmly and fairly | **gap — see §2.1** |
| 9 | E | Buy and sell stocks and bonds | 60-form q9 (financial-desk corporate; keep unless user drops) |
| 10 | E | Negotiate business contracts | mini q17 + 60-form q34 (duplicate item across instruments — dedupe to one) |
| 11 | E | Manage a department within a large company | 60-form q22 |
| 12 | E | Sell merchandise at a department store | mini q29 + 60-form q57 (duplicate — dedupe to one) |
| 13 | C | Develop a spreadsheet using computer software | 60-form q11 |
| 14 | C | Calculate the wages of employees | 60-form q36 |
| 15 | C | Keep inventory records | 60-form q59 |
| 16 | C | Keep shipping and receiving records | mini q18 + 60-form q35 (duplicate — dedupe to one) |

### §2.1 — the honest gap the curation exposes

The Interest Profiler was written to cover *all* of work life, so after the
corporate filter the **Investigative and Artistic areas have no corporate-native
items left** (their pulled items are labs, planets, bands, movie sets). A balanced
6-area instrument therefore needs **4–6 authored corporate-native items** (2 I + 2 A,
anchored verbatim to O*NET's official interest-area *descriptions* — the `1.B.1.b`
Investigative and `1.B.1.a` Artistic definition text already on disk in the pulls,
e.g. I's "studying and researching…", A's "designing… without regard to
commercial context is secondary").

**Decision asked of the user:** pick ONE —
- **(A) Pure-pull subset, accept the skew** (12–16 items; letters I/A may under-score
  for some students; card ranking still program-gated so it never invents outside
  careers),
- **(B) Pull + minimal authored patch** (16 pulled + 4–6 authored I/A items anchored
  to the pulled O*NET interest descriptions; the authored items carry
  `ref: O*NET-on-disk interest description` exactly like every other fixture, and
  ~16–20 items total — balanced 6 areas).

**Draft recommends (B).**

## 3. Scoring (the instrument's own arithmetic, adapted)

- Per item the answer is 1–5 (`Strongly Dislike … Strongly Like`).
- The Interest Profiler's own mapping converts each item to its RIASEC letter;
  raw letter total = Σ answers-rarity-adjustment. The official instrument weights
  by **Job Zone/Preparation levels**; for a 3-chip corporate shortlist we keep the
  arithmetic simple and inspectable:
  - per letter `L`: `score(L) = Σ (answer value) over items of L`
  - neutral answer (3, Unsure) contributes nothing (− 3 back per item), so
    `net(L) = Σ (v − 3)` over that letter's items → range −2n…+2n.
- Student vector = six `net(L)` values. **No normalization, no surprises** — sort
  letters descending; ties broken by O*NET's own letter ORDER inside the
  student's ranked letters (`interest_code` letter order as documented in §4).

## 4. Career matching with the program gate (the user's rule)

1. **Gate first:** only careers whose `degreeMap` accepts the student's
   program/strand survive (the SAME gate `/careers` enforces — `lib/degree-gate.ts`
   semantics reused; the gate is the filter, never RIASEC).
2. **Then rank** survivors by fit score — computed per career from its
   `interest_code` (the pulled O*NET "IC", "CES" style code, ordered
   primary→tertiary):
   - head letter at position 1 of the student's letter order earns full credit,
     position 2 → second-credit per the two-letter rule; O*NET letter-codes map
     three levels deep, so only the career code's letters that fall within the
     student's top-2 letters earn (position-weighted: 1.0 / 0.6 / 0.35).
   - ties inside a letter set → career stays tied; tie broken by catalog order
     (roster order is the canon rule, same as `DEMO_SUGGESTION_ORDER` used today).
3. **Low-confidence path (user rule locked):** if the student's net scores are
   flat (max − second < 2) → **the cards still render, but ranked by the gate's
   natural ordering with a low-confidence note**, plus a link to browse ALL
   program-relevant careers. RIASEC never manufactures a pick.
4. **Fit lines become data-driven:** each rendered card's "fit" sentence is
   composed from the STUDENT's own scoring profile (top letters) and the career's
   O*NET interest code — no baked per-career copy. Example generation:
   `"Your answers leaned Investigative + Conventional — {career} involves exactly that loop."`

## 5. Placement in the existing flow (no branch redesign)

- The quiz runs **only** on the branch `No — help me figure it out` (unchanged).
- "Yes — I know what I want to do" keeps today's `/career` browse exit (its
  in-onboarding compact picker variant stays a later-ticket option unless the
  user folds it into this round).
- Card list length: top 3 as today; "See more careers for {track}" link unchanged;
  "None of these quite fit" link unchanged.
- Question count: 16–20 (per the §2 decision). Mini-IP's 30-question tether is
  released in favor of the curated corporate subset — the source instrument stays
  cited (CC-BY attribution line lives in the quiz intro footer for thesis
  provenance).

## 6. Constants the build will own

- `INTEREST_ITEMS` — **DECIDED (user, 2026-11-06): option B landed as the full
  authored corporate instrument**: 18 items (3 per RIASEC letter) authored at
  activity-verb level for PH entry-level corporate contexts; the O*NET
  Interest Profiler stays cited as the SCORING FRAME reference only. Every
  item carries `ref` + `sourceQuote` against on-disk canon — the official
  interest-area definitions (`research/onet-enrich/pulls/interests/
  interest-areas.json`, pulled live 2026-11-06 · `1.B.1.a–f`), catalog
  skill `what` lines, and O*NET task quotes carried by the catalog rows.
- `CAREER_INTEREST_CODES` — pulled `interest_code` per career id, 36 rows
  (live 2026-11-06 → `research/onet-enrich/pulls/interests/<code>.json`):
  21 careers carry their OWN rowspec anchor code (18 distinct codes);
  the 15 track-less careers inherit their track anchor's code, flagged
  `codeSource: "track-anchor"` in `lib/fixtures/interest.ts`.
- scoring helper + ranking helper — shipped as pure functions in
  `lib/engines/interest.ts` (unit-tested: `scripts/interest-engine.test.ts`).

## 7. REVIEW ASK — RESOLVED (2026-11-06)

The final decision: the **authored corporate instrument is approved** —
§2 decision (B) superseded by the fully authored 18-item set (the pulled
16-item list stands down as reference copy); §3 arithmetic (per-letter
net v−3), §4 gate-first matching + tie-by-roster-order and the §4.3
low-confidence rule are as written above; placement (§5) unchanged.
