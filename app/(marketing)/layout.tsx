import type { ReactNode } from "react";
import BrandMark from "../../components/BrandMark";
import "./v9.css";

/**
 * Marketing shell — the landing's own chrome, DNA v9 (the M3 fidelity
 * upgrade, user-approved round-0 comp 2026-11-04 → cutover round 1):
 * a white top bar (brand mark + Google Sans wordmark, Sign in text
 * button + Start-the-check pill) over the `.v9` ground, no sidebar,
 * no rail. The honest footer lives in the page (evidence close).
 * Scoped under `.v9` in ./v9.css — m-prefixed classes, isolated from
 * globals.css (the Index system is untouched by this file and retired
 * from this surface).
 */
export default function MarketingLayout({ children }: { children: ReactNode }) {
  return (
    <div className="v9">
      <header className="m-mast">
        <div className="m-mast-in">
          <span className="m-brand">
            <BrandMark size={24} />
            <span className="m-word">Baseline</span>
          </span>
          <nav className="m-nav" aria-label="Primary">
            <a className="m-textbtn" href="/signin">
              Sign in
            </a>
            <a className="m-pill m-fill" href="/signup">
              Start the check
            </a>
          </nav>
        </div>
      </header>
      <main id="main">{children}</main>
    </div>
  );
}
