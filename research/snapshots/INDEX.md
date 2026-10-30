# SNAPSHOTS INDEX — pin of every cited evidence artifact (peer of ADR 0005)

**Run:** 2026-10-29 · source-snapshot pass, no commits, no app/lib/e2e/role-spec files touched.
Scope per ADR 0005 (source model C): PH grounding shrinks to three load-bearing classes (**demand / degree maps / taxonomy**) snapshotted offline; PSF/TESDA extracts stay **cited secondary evidence**; O*NET content arrives later via the enrich pass with the user's API key.

**Mantra honored: nothing cited by the defense may rot; nothing blocked was substituted with an unverifiable mirror.**

## Totals (files with sha256 pinned under this tree)

| class | dir | files | bytes | pinned | needs-facsimile (official primary) |
|---|---|---|---|---|---|
| Taxonomy (PSOC via CRAN phscs v0.2.0) | `psoc/` | 3 | 1,413,636 | 3/3 (tarball MD5-verified vs CRAN: `1120ee03b98ca084ef84092474753c5b`, parsed CSV, package page) | 1 (psa.gov.ph PSOC revalidation — standing flag) |
| Demand (DOLE-BLE) | `demand-dole-ble/` | 18 | 447,810 | 18/18 (15 page images + 1 page-read transcript + 2 preview texts) | 3 (JobsFit 2013–20 official PDF, NJLMF 2025–26, Road-to-Recovery 2022 — all host-blocked) |
| Degree maps (CHED CMOs) | `ched-cmo/` | 29 | 148,816,445 | **29/29 (18/18 cited CMO PDFs + 9/9 year-index pages + NLP + FEU cross-check pages)** | 1 (eFOI "CMO on BS Data Science" — CHED response page 503/CF-challenge, standing) |
| Secondary evidence (PSF ebooks) | `psf/` | 10 | 100,373,813 | 10/10 (8 ebooks incl. newly fetched DAA + Skills Map + catalog page) | — |
| Secondary evidence (TESDA TRs/CS/SAG) | `tesda-tr/` | 8 | 16,105,607 | 8/8 (5 TRs + SOC CS + SAG + newly fetched SETG 2024) | — |
| Secondary evidence (official/canonical docs) | `official-docs/` | 15 | 8,419,370 | 15/15 (RA 10173, RA 9298, NWPC WSMB 2024, NACE Dec-2025 PDF + page, OWASP ×3, MITRE, NIST SP 800-61r3 PDF + page, Scrum Guide 2020 PDF + page, gov.uk data-ethics) | — |
| **TOTAL** | | **83** | **275.6 MB** | **83/83 snapshot files pinned** | **5 official-primary artifact lines needs-facsimile** (+1 OpenLearn locator cross-ref) |

## Coverage statement (the defense-facing summary)

- **Taxonomy: pinned 100%.** CRAN `phscs` v0.2.0 tarball is checksum-verified against CRAN's own published MD5sums; the parsed `psoc2012-parsed.csv` (639 rows) spot-validates against verify-notes (4225 possessive row exact). Official PSA host fetch remains a standing revalidation flag (needs-facsimile) — no alternative substituted.
- **Demand: pinned on the verified read-out side (100% of the corpus's demand basis), official-primary needs-facsimile.** The 15-page page-image set + transcript that every `JF-ID #n` demand line in 34 roles traces to is now byte-pinned. The official DOLE-BLE PDFs (JobsFit 2013–2020 publication, NJLMF 2025–2026) stay bot-blocked (403 / challenge pages; Wayback 500 window recorded) — flagged, never mirrored with an unverifiable URL.
- **Degree maps: pinned 100%** — every CMO the degree-map canon (`ched-major-lists.md`) cites, all 10 year-index pages, the NLP digital-library list, and the FEU cross-check page. Every PDF downloaded fresh this run and magic-byte validated (no re-verified-memory claims).
- **Secondary evidence: pinned 100%** — every PSF ebook quoted by role files (SDS, AAI, GIH, CCB, HCD-HREAP, BD, SCL, DAA) byte-matched to its official TESDA/HREAP/DepEd URL today; every TESDA TR/CS the defense leans on (Bookkeeping NC III + SAG, CS NC II, VGD NC III, CTM NC I, CTM NC II, SOC CS L3, SETG 2024, Skills Map 2020); the quoted official docs (RA 10173/9298, NWPC handbook 2024, NACE Dec-2025, OWASP Top 10:2025 + WSTG + DB cheat sheet, NIST SP 800-61r3, Scrum Guide 2020, MITRE ATT&CK, gov.uk Data Ethics Framework).
- **O*NET: deliberately absent.** Per ADR 0005 the O*NET Web Services API becomes the content spine once the user registers a key (`scripts/onet-api-key-wizard.sh`, user-run). O*NET summary pages quoted in role files will be re-diffed by the enrich pass at extraction time; no snapshot (and no manual download) is needed now.

## Needs-facsimile — what only the user (or a future unblocked host) can close

1. **DOLE-BLE JobsFit 2013–2020 official PDF(s)** — https://ble.dole.gov.ph/jobs-and-labor-market-forecast (bot-403; no direct PDF URL published in-page). Facsimile basis currently sits on the pinned Scribd page-image medium (mirror). Manual browser download of the official PDF would close the primary-side gap.
2. **DOLE-BLE National Jobs and Labor Market Forecast 2025–2026** — https://ble.dole.gov.ph/wp-content/uploads/2026/09/National-Jobs-and-Labor-Market-Forecast-2025-2026-Report.pdf (Cloudflare challenge to scripted fetch; Wayback 500). UNREAD; per-role in-demand/hard-to-fill/emerging tags land only after this is fetched (browser-only download candidate).
3. **DOLE-BLE JobsFit "Road to Recovery" (2022)** — same host, same wall (named in `ph-competency-frameworks.md` §1.5; not quoted in role files).
4. **PSA official PSOC pages/2022-Updates xlsx/Board Res. No. 12 s. 2022** — psa.gov.ph + psada.psa.gov.ph 403 (standing flag in all 35 role files).
5. **eFOI request page "CMO on BS Data Science" + CHED's response** — foi.gov.ph 503 history + Cloudflare challenge today; portal suspended since 2026-09-28 per FOI-PMO advisory.
6. **OpenLearn "Effective communication in the workplace"** — whole-site Cloudflare challenge wall (verify-notes V-B verdict: title + free status index-verified, keep-with-flag). *Learning resource, not evidence artifact* — locator here by cross-reference only.

## Intentionally NOT in this tree

- **Learning-resource URLs** (Coursera/freeCodeCamp/edx/e-tesda course pages/netacad/Google ADK, etc. — ~120 distinct URLs across role files): these are student-facing references verified with HTTP-200 checks inside the role files themselves; they carry no quoted facts for the defense and are out of the snapshot classes by ADR 0005's design.
- **O*NET pages** (see note above).
- Anything under `.scratch/` or the platform app code (untouched).

## Verification hooks

- Per-directory manifests each carry `path | source URL | access | sha256 | cited-by | status` lines; all 83 sha256 lines in the manifests re-verified against the pinned files at write time (ok=83, bad=0).
- Cited-by fields name catalog role ids (`swd, qa, da, csr, book, …`) / framework files, so any future "which file cites this artifact" lookup is mechanical.
