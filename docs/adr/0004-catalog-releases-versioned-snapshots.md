# Catalog releases are versioned snapshots — extraction-time API pulls, runtime never live

## Status

Accepted (2026-10-29)

## Context

Role skill maps power three score-bearing behaviors: the Skills-Gap engine, the ranked plan, and the resume keyword-alignment synonym seeds. The underlying sources update on their own cycles (O*NET continuously; DOLE-BLE JobsFit annually; PSF sectors by edition). The team asked whether the catalog should therefore be "generated once", and whether an API could keep it live.

## Decision

**Each catalog release is a versioned, human-reviewed snapshot.** Every source-derived row carries its source + vintage ("as of O*NET Oct 2026 · PSF-AAI v1.0 · DOLE-BLE JobsFit 2013–2020"). When a source updates, a **refresh ritual** runs: extraction pass saves a dated snapshot artifact → produces a diff against the current release → the user reviews the diff → a new catalog release ships (students' maps carry the new as-of dates; verified skills stay verified). The O*NET Web Services API (free key, keyed per role's recorded SOC code) is the sanctioned **extraction-time** accelerator.

**Runtime never calls source APIs live.** The app reads only the reviewed snapshot fixtures.

## Why live data was rejected

- **Fairness:** live maps would drift students' scores mid-cohort for reasons unrelated to them — unacceptable in a counselor-run cohort product.
- **Honesty:** an unreviewed live feed is a claim nobody made; the evidence culture requires every number to trace to a recorded, reviewed state.
- **Determinism/verification:** e2e canon assertions, the demo arc, and future CVR/CVI-adjacent validation all require stable references.
- **Demonstration:** the defense venue runs offline; any runtime live dependency breaks the demo by construction.

## Consequences

- Future engineers will find no API client in the app runtime and may consider "fixing" it — the fix is forbidden; refreshes are release work, not application work.
- Snapshot artifacts (raw fetched JSON/PDF extracts) live beside the research docs with access dates, so any release can be rebuilt and re-audited from its raw inputs.
- The refresh ritual is cheap for O*NET-anchored roles (API diff) and manual for the PH-only layer (PSOC/PSF/DOLE-BLE/CHED — no public APIs exist; this is a fact of the sources, not the architecture).
