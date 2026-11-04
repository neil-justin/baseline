/**
 * BandArt.tsx — the assessments hub band's drawn CHECKSHEET (originally
 * declared in page.tsx, extracted so the page, the route skeleton and the
 * mockup realm mirror the SAME figure with one source of truth).
 *
 * An assessment sheet drawn in the family's tonal register (sheet on the
 * blue wash, two confirmed rows in solid discs with white checks, one
 * dashed open disc and a bare third bar). It depicts the TAB'S MECHANISM,
 * never a student state — decorative, aria-hidden (the h1 already names
 * the page). Drawn shapes only, no bitmaps, no glyphs.
 */
export default function AssBandArt() {
  const check = (cy: number) => `M${23.4} ${cy + 0.4} l2.8 2.8 5.2-5.8`;
  return (
    <svg className="assart" viewBox="0 0 96 96" aria-hidden="true">
      <rect x="10" y="8" width="76" height="80" rx="12" fill="var(--v-blue-wash)" />
      {/* two confirmed rows */}
      <circle cx="27" cy="29" r="9" fill="var(--v-blue)" />
      <path d={check(29)} fill="none" stroke="#fff" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
      <rect x="45" y="25" width="33" height="8" rx="4" fill="var(--v-surface)" />
      <circle cx="27" cy="51" r="9" fill="var(--v-blue)" />
      <path d={check(51)} fill="none" stroke="#fff" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
      <rect x="45" y="47" width="25" height="8" rx="4" fill="var(--v-surface)" />
      {/* the open remainder: a dashed disc (the walk there) and a bare bar */}
      <circle
        cx="27"
        cy="73"
        r="9"
        fill="none"
        stroke="var(--v-blue)"
        strokeWidth="1.8"
        strokeDasharray="2.6 2.6"
      />
      <rect x="45" y="69" width="33" height="8" rx="4" fill="var(--v-surface)" />
    </svg>
  );
}
