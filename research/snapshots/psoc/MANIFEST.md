# MANIFEST — psoc/ (taxonomy class · PSOC 2012 via CRAN `phscs` v0.2.0)

Class: **Taxonomy** (PSOC 2012 codes/titles/unit-group text — carried from the verify agent's parsed CRAN `phscs` v0.2.0 dataset; ADR 0005 load-bearing class 3).
All entries access-verified 2026-10-29. Format: `path | source URL | access date | sha256 | cited-by | status`.

**Provenance anchor (verified today):** the pinned tarball's MD5 (`1120ee03b98ca084ef84092474753c5b`) matches CRAN's published `src/contrib/MD5sums` entry for `phscs_0.2.0.tar.gz`, byte-for-byte. The parse below was produced from this exact tarball (`R/sysdata.rda`, object `phscs_psoc["2012"]`) and spot-validated against verify-notes: the 4225 unit row carries the verbatim local-setup text incl. the curly possessive "organization's" (row `4,4225,Enquiry clerks` present in the CSV).

| path | source URL | access | sha256 | cited-by | status |
|---|---|---|---|---|---|
| `phscs_0.2.0.tar.gz` | https://cran.r-project.org/src/contrib/phscs_0.2.0.tar.gz | 2026-10-29 | `d6be2ba969244c28110f7e1478eb9af86c8a1dde5259a0b5c3a9210f65829e37` (MD5 CRAN-matched: `1120ee03b98ca084ef84092474753c5b`) | all 35 role files (PSOC anchor rows) + `lib/fixtures/catalog.ts` PSOC layer + `.scratch/career-path-readiness-research/catalog-roster-dole-ble.md` + `ched-major-lists.md` (mapping column) + review-pack verify-notes (desk VD1-1 row) | **pinned (checksum-verified vs CRAN)** |
| `psoc2012-parsed.csv` | derived locally from the pinned tarball (see provenance note) | 2026-10-29 | `fed5d2b02677632c830f4760f08f0bc2a60a5653df4ba013f37dd70b3a9df6f8` | same as above (row-level quote source: 639 rows, level/value/label/description) | **pinned (parse of pinned tarball)** |
| `cran-phscs-package-page.html` | https://cran.r-project.org/web/packages/phscs/ | 2026-10-29 | `de2580fc594953177d507eff05c7b5038fa9cedb41ac6bb3c94a6f47f53b69f3` | manifest provenance only | **pinned** |

## Needs-facsimile (blocked official PSA host — no substitution; standing revalidation flag)

| artifact | source URL | access | status / locator trail |
|---|---|---|---|
| PSA official PSOC pages + 2022-Updates xlsx + PSA Board Resolution No. 12, s. 2022 PDF | https://psa.gov.ph/classification/psoc · https://psa.gov.ph/sites/default/files/kmcd/files/2022-Updates-to-the-2012-PSOC.xlsx · https://psa.gov.ph/system/files/psa-board/PSA%20Board%20Resolution%20No.%2012%20Series%20of%202022.pdf | 2026-10-29 (403, standing) | **needs-facsimile.** psa.gov.ph/psada machine-blocked (403) in every session including today. Locator trail: PSOC 2012 structure = 10 major / 43 sub-major / 130 minor / 456 unit groups, ISCO-08-aligned; "2022 Updates" adopted by PSA Board Res. No. 12, s. 2022; the CRAN package documents itself as built "from official Philippines source materials" via the PSA API (package DESCRIPTION, pinned in tarball). Every role file carries the standing "re-validate against psa.gov.ph/psada once reachable" flag. **No unverifiable mirror substituted.** |

## Notes

- Nothing from O\*NET in this class (per ADR 0005 the O*NET API becomes the content spine once the user's key lands; PSOC remains the PH taxonomic anchor).
- `phscs` v0.2.0 is the only PSOC version the dataset exposes (package documents "PSOC: only version 2012"); "PSOC 2025" was verified-wanting in the roster research (PSIC Rev. 5 is an industry classification, not occupational).
