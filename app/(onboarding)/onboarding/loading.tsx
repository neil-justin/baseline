import { Skeleton } from "@/components/skeleton";

/**
 * /onboarding route skeleton (2026-11-06, mirrored per userwalk): it shows
 * what the rest of the page will look like — the stepper header card
 * ("Getting started" bar + 5 chip circles + STEP N bar) and then the
 * Background step's own content — centered title bar + the 4-card track
 * grid with its card anatomy (bold name bar → tagline ϩbars → count bar).
 * The program select is a SEPARATE page now, so this skeleton must NOT
 * include it. The page's server bootstrap (session + getStudentView) is
 * awaited before first paint, so this streams over the real chrome.
 * Text-free per the Skeleton Rule.
 */
export default function Loading() {
  return (
    <div className="v7ob" aria-live="polite" aria-busy="true" aria-label="Loading onboarding">
      {/* the stepper header card, mirrored */}
      <div className="shell ob-shell">
        <header className="ob-head">
          <div className="ob-head-left">
            <Skeleton className="skel-title" />
            <Skeleton className="skel-count" />
          </div>
          <div className="ob-head-steps">
            {Array.from({ length: 5 }, (_, i) => (
              <span key={i} className="skel-chipset">
                <Skeleton className="skel-num" />
                <Skeleton className="skel-label" />
              </span>
            ))}
          </div>
        </header>
        <section className="ob-screen wide">
          <div className="skel-head">
            <Skeleton />
          </div>
          <div className="skel-grid4">
            {Array.from({ length: 4 }, (_, i) => (
              <div key={i} className="skel-track">
                <Skeleton className="skel-name" />
                <Skeleton />
                <Skeleton />
                <Skeleton className="skel-count" />
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
