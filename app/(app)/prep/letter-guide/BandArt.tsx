/**
 * BandArt.tsx — the cover-letter guide band's drawn OPEN ENVELOPE: the
 * letter rising out of it, carrying the letter's three signals in page
 * order (the opener · the body's evidence lines · the closing ask and
 * sign-off in solid blue — the same signals the checker's deterministic
 * set reads). Family register: self-drawn shapes, tonal washes, depicts
 * the page's mechanism never a student state, aria-hidden (the h1
 * already names the page). Drawn shapes only, no bitmaps, no glyphs.
 * Hero-law: this figure is the letter guide's alone — imagery never
 * shared across pages.
 */
export default function LetterGuideBandArt() {
  return (
    <svg className="g-art" viewBox="0 0 96 96" aria-hidden="true">
      {/* the letter, rising out of the envelope */}
      <rect
        x="26"
        y="12"
        width="46"
        height="58"
        rx="6"
        fill="var(--v-surface)"
        stroke="var(--v-blue)"
        strokeWidth="1.6"
      />
      {/* opener — the salutation face */}
      <rect x="34" y="22" width="26" height="5" rx="2.5" fill="var(--v-blue)" />
      {/* the body's evidence lines */}
      <rect x="34" y="33" width="28" height="4" rx="2" fill="var(--v-border)" />
      <rect x="34" y="41" width="22" height="4" rx="2" fill="var(--v-border)" />
      {/* closing ask + sign-off */}
      <rect x="34" y="50" width="24" height="4" rx="2" fill="var(--v-blue)" />
      <rect x="34" y="58" width="14" height="4" rx="2" fill="var(--v-blue)" />
      {/* the open envelope holding the letter */}
      <rect x="8" y="56" width="80" height="30" rx="7" fill="var(--v-blue-wash)" />
    </svg>
  );
}
