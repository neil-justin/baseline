# ADR 0005 — Source model C: O*NET-first content, thin snapshotted PH grounding

Date: 2026-10-29 · Status: ACTIVE (user-ruled 2026-10-29 evening) · Supersedes: none (extends ADR 0002/0004; amends the source-chain posture recorded under ticket 04 and PRODUCT.md positioning)

## Context

The role-specification pass produced 35 role files + 1 draft sourced through facsimile-verified PH documents (PSF rungs, TESDA TRs, PSOC unit text, JobsFit demand lines), with O*NET used only as anchor/gap-filler. Live-host behavior during that pass demonstrated real brittleness: psa.gov.ph 403 (machine-blocked), dole.gov.ph/bsp.gov.ph bot-blocks, OpenLearn 200→Cloudflare-403 flip, Coursera free-audit→Preview drift, TESDA-hosted TOP 504s, a dead RA 3765 citation. The user judged the stable O*NET Web Services API preferable wherever it substitutes, and ruled that skill content across PH and US entry-level expectations is substantially similar.

## Decision (user-ruled, Model C)

1. **O*NET Web Services API = primary content/verification reference for all 36 roles** — deterministic pulls at extraction time, pinned to a single O*NET version per release. Every role's skill/task rows cross-checked; all diffs logged and routed to user review; never applied silently. Runtime never calls the API live (per ADR 0004: offline demo, determinism, fairness).
2. **PH sources shrink to three load-bearing document classes**, exactly the claims O*NET cannot produce, each **snapshotted offline** into `research/snapshots/` with a checksum manifest (source URL, access date, checksum):
   - **Demand:** DOLE-BLE JobsFit (per-role in-demand/hard-to-fill lines)
   - **Degree mapping:** CHED CMO program lists
   - **Taxonomy:** PSOC 2012 codes/descriptions — carried by the locally parsed CRAN `phscs` v0.2.0 dataset (already verified; row-level quotes land at extraction time)
3. **PSF/TESDA extracts remain as cited secondary evidence** where already recorded (they stay in the role files; no rework required). New content extraction prefers the O*NET API path over further ministry-site scraping.
4. **The snapshot pass** pins every cited artifact it can fetch; blocked hosts keep their printed-code/page locator trails instead of substitution (no unverifiable URLs, ever).
5. **Wizard dependency:** `scripts/onet-api-key-wizard.sh` (user-run) enables 2's cross-check; until the key is registered, 2 is queued behind it.

## Consequences

- PRODUCT.md positioning re-worded to match (done at adoption).
- The enrich pass (ADR 0004) broadens from O*NET-anchored rows to all-36 verification.
- Future role additions follow Model C by default; PH facsimile work is exceptional, justified by a claim O*NET cannot serve.
- The thesis claim shifts from "a mechanism O*NET-first tools can't copy" to "**deterministic, O*NET-grounded content with document-snapshotted PH grounding**" — still an evidence-first differentiator (counselor verifiability, provenance tags), without live-ministry dependence.
