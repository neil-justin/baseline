/**
 * BandArt.tsx — the guide band's drawn ONE-PAGE RESUME SHEET (the
 * #mockups realm figure, graduated at the 2026-11-04 cutover; now the
 * single source of truth).
 *
 * A one-page resume drawn in the family's tonal register (the sheet on
 * the blue wash, its standard section blocks in page order — header,
 * education, experience with indented bullets, skills — and a dashed
 * offset page behind, the one-page rule drawn). It depicts the PAGE'S
 * MECHANISM, never a student state — decorative, aria-hidden (the h1
 * already names the page). Drawn shapes only, no bitmaps, no glyphs.
 * Hero-law: this figure is the guide's alone — imagery never shared
 * across pages.
 */
export default function GuideBandArt() {
  return (
    <svg className="g-art" viewBox="0 0 96 96" aria-hidden="true">
      {/* the beyond-the-page: dashed, behind, top-right */}
      <rect
        x="28"
        y="12"
        width="66"
        height="76"
        rx="10"
        fill="none"
        stroke="var(--v-blue)"
        strokeWidth="1.6"
        strokeDasharray="3 3"
        opacity="0.5"
      />
      {/* the one page */}
      <rect x="8" y="10" width="70" height="80" rx="10" fill="var(--v-blue-wash)" />
      {/* header contact block — name line, then the contact line */}
      <rect x="16" y="20" width="42" height="9" rx="4.5" fill="var(--v-surface)" />
      <rect x="16" y="32" width="30" height="5" rx="2.5" fill="var(--v-surface)" />
      {/* education */}
      <rect x="16" y="44" width="34" height="5" rx="2.5" fill="var(--v-surface)" />
      {/* experience — reverse-chron with indented bullets */}
      <rect x="16" y="55" width="48" height="5" rx="2.5" fill="var(--v-surface)" />
      <rect x="22" y="63" width="36" height="4" rx="2" fill="var(--v-surface)" />
      <rect x="22" y="69" width="28" height="4" rx="2" fill="var(--v-surface)" />
      {/* skills */}
      <rect x="16" y="77" width="30" height="5" rx="2.5" fill="var(--v-surface)" />
    </svg>
  );
}
