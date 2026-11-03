# My Plan → Mini-LMS (post-defense) — Design

**Date:** 2026-11-03 · **Status:** Draft for user review
**Scope:** the `/pathway` (My Plan) surface, rebuilt after the 2026-11-07 defense. Explored live via hash-gated mockups (`/pathway#mockup*`) so the defended layout is untouched.

## 1. The problem

Today's My Plan is a *personal status report*: a ranked gap table whose order and content re-sort as the student's evidence changes. It answers "what is your biggest gap today" — it never presents a **path**: one fixed, complete, ordered set of skills to enter a role, the thing roadmap.sh gets right (canonical curriculum; status is the overlay; the map never re-sorts).

## 2. Chosen direction (mockup D2, as explored)

A **flat canonical walk** on one vertical spine: one fixed list of the role's required skills, numbered top-to-bottom, each row = skill checkpoint + its learning material. The student's evidence state overlays nodes and only nodes.

- Layout: vertical spine (2px line), numbered node circles, one container card. The A/B/C layout variants and D1/D3 content variants were exploration; **D2 (flat spine, categories demolished) is the chosen direction.**
- **Categories are demolished** (user ruling): no Floor/Proof/Recommended/Optional/Entry regions. Satisfaction is carried entirely by the evidence chips; credential/entry matters live off this surface.
- Preview: a band select renders any of the 36 roles against the student's current evidence (mock chrome; never ships).

## 3. The required-skill set (O\*NET-as-law, Option 1)

- **Required = the entire role skill map, every role.** One dialect for all careers; office-track maps serve immediately.
- `sourceTag` (PSF / TESDA / O\*NET / PSOC…) **demotes to provenance metadata** on the row; it no longer gates anything.
- The "regulated minimum (TESDA/PSF)" rule is retired. TESDA/PSF facts stay: TESDA NCs and crediting bodies remain the *proof* layer (resources), not map placement.
- Naming stays as-is (no O\*NET re-projection) — `StudentState.bars`, `CHECK_SKILL`, resource `skillsAddressed`, engines, and e2e all key on the current names; re-projection was assessed and rejected (state decoupling, provenance falsification, no user-visible gain).

## 4. Resource-suggestion algorithm (replaces Q11v2 sort)

Per skill, the pool is the career's catalog rows claiming that skill. **Satisfaction-weighted, deterministic; first separation wins:**

1. Platform check pairs to this skill (`CHECK_SKILL[res] === skill`)
2. Crediting body attests (`creditingBody`)
3. Counts toward the entry route (`countsTowardEntryPath`)
4. Free beats paid
5. Resource id A–Z

Retired rules: `durationHours` leaves ranking (info-only); "most dedicated" (narrow-claim bonus) is abolished — a claim's narrowness is not evidence of fit (the Google-SRE-book-for-QA failure). Every row — open **and** closed — carries its suggestion.

## 5. Catalog policy (taught-only, self-serve)

- **Taught-only:** recursos must open actual teachable content. Reference/glossary and landing pages (cert overviews, index/search pages, provider homepages) are **omitted from the catalog** in the real wave; in the mock they are invisible to the picker.
- **Self-serve eligibility:** suggested slots only go to `direct` (open URL, learn), `account` (free signup), `exam-paid` (study free, credit paid). `paid` claims exist as data but never hold the suggested slot; **`provider`-gated entries are omitted** from the catalog.
- Wait-states are honest about *which* emptiness: "Resources exist but aren't vetted yet (audit pending)" ≠ "No learnable resource vetted yet — ask your adviser" (the latter only when the skill has no claims at all).

## 6. Per-row rendering (three facts, three lanes — user rulings)

1. **Skill side:** name, canon `what` line, evidence chip verbatim (`Verified ·✓` / `Checked ·✓✓` / hatched `Self-reported`), SP projection register (open rows), start-here pointer (first open node in walk order).
2. **Learn line (primary, authored per claim):** one sentence, authored in fixtures, "why this resource teaches this skill" — the attestation step made concrete. Rows without a draft render no line (never a fake one).
3. **Meta line:** `free · ~4 hrs · self-serve` — access folds here as one word. **The audit lane (why-picked receipts, access chips, landing notes, claims blocks) does not render.** Selection factors stay internal and become test assertions in the implementation wave.

Working-on hybrid marker (user-locked): open nodes carry a toggle that marks local "Working" intent — amber, never a checkmark, never touching bars/score. Persistence decision deferred to the implementation wave.

## 7. The API boundary (user ruling)

No runtime third-party fetching. Fixtures remain the curated, human-verified catalog (the "fetched LIVE" audit tradition). APIs fit only as *build-time* helpers: harvest scripts producing candidate rows for human verification; O\*NET Web Services usable as a read-only cross-checker for skill rows.

## 8. Maintainability plan (user concern: brittleness)

1. **Metadata lives on the resource row** after the audit wave (access field integrated into `lib/fixtures/resources.ts`); asserted by the existing `verify-fixtures.test.ts` so unvetted rows can't ship silently.
2. **Link rot becomes tooling:** `scripts/audit-resources.mjs` re-fetches every URL in CI/periodically — records final URL (soft home-redirects = landing detection), flags non-200s, diffs vs stored audit.
3. **Taxonomy shrinks:** with taught-only, the `form` classification and landing notes die; per-row metadata reduces to `access` alone.
4. **One picker:** the engine's `sortResourcePool` is replaced by the rule in §4 (single implementation, no mock duplicate), with vitest regression cases — the SRE-book reversal, tier order, paid-never-suggested.

## 9. What the real wave touches (and doesn't)

- Engine: replace `sortResourcePool`; add `access` (and learn-line claim data) to `Resource`; keep evidence model, SP math, mock realm retired after parity.
- Surface: `PathwayTabs` Plan/Resources tabs → the D2 walk as THE My Plan surface (hash gates removed post-migration). Resources tab content folds into rows; alternates live behind the node's material (details on demand — choice at implementation). **User-ruled 2026-11-03: the D2 walk REPLACES the Plan/Resources tabs — the old surface retire when the flip lands, this is the ratified end-state, not an option.**
- Mock files under `app/(app)/pathway/mockup/*` are scaffolding: canon/suggest/access/preview graduate; variants a/b/c/d1/d3 get deleted.
- Not touched: engines beyond §8, scoring, mobile-bottom-nav law, DESIGN.md color/dna rules (spine CSS obeys them).

## 10. Banked rulings (session log)

O\*NET-as-law Option 1 · categories demolished · D2 flat spine · satisfaction tiers · hours out of ranking · narrow-claim bonus dead · taught-only catalog · provider omitted · self-serve eligibility · audit lane unrendered · learn-line authorship · closed rows keep suggestions · unvetted ≠ absent wording · API boundary · maintainability plan · date: 2026-11-03.
