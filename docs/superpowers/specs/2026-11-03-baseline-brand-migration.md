# Baseline — brand-name migration design (2026-11-03)

## Decision

The product name is **Baseline** (user-locked, single word). Gloss: *the measured floor of
your target role — climb until you reach it.* The app's existing language supports it
("on your baseline" band cells; channels close toward it; "· your starting line" meter note).

## Scope

REPLACE the product-name strings (ALL case variants of "Career Readiness" /
"Career Path Readiness" that NAME the product) with "Baseline":

- `components/Sidebar.tsx:45` shell brand
- `app/layout.tsx:6` metadata title
- `app/(marketing)/page.tsx:11` metadata + hero copy if it names the product
- `app/(marketing)/layout.tsx` wordmark `.word`
- All five auth pages: metadata title/description + `.brand-name` (signin, signup, forgot,
  reset, any confirm variant)
- Onboarding/admin/etc.: grep-driven sweep for product-naming usages anywhere under `app/`
  + `components/`

HOLD-UNCHANGED: generic noun-phrase "career readiness" in body prose (descriptive, not
branding); `.scratch/**` historical archive; no code renames; no visual changes (the
wordmark simply reads shorter). If "readiness" appears in prose that reads as product claim
(strings like "career-readiness platform"), rewrite only where it names the product.

## e2e ports

grep e2e/*.spec.ts for "Career Readiness" brand assertions and port to "Baseline" in the
same change; record old→new in the port-list convention.

## Verification

`npx tsc --noEmit` → 0 · fixtures + link-audit suites pass · grep receipt: zero
product-naming leftovers in app/components (matching case-insensitive, excluding .scratch).
No commits by the executor.
