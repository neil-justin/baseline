import type { ReactNode } from "react";

/**
 * Marketing shell — the landing's own chrome (v7.2 wave-3): a white top bar
 * (brand mark with 6px blue inlay + wordmark, Sign in + Start check right)
 * over the `.v7land` ground, no rail, no headnav. The honest footer lives in
 * the page (evidence close). Scoped under `.v7land` in ./landing.css — the
 * Index system in globals.css is untouched by this file.
 */
export default function MarketingLayout({ children }: { children: ReactNode }) {
  return (
    <div className="v7land">
      <header className="mast">
        <div className="mast-in">
          <span className="brandline">
            <span className="mark" aria-hidden="true">
              <i></i>
            </span>
            <span className="word">Career Readiness</span>
          </span>
          <nav className="mast-nav" aria-label="Primary">
            <a className="mast-signin" href="/signin">
              Sign in
            </a>
            <a className="cta" href="/signup">
              Start check <span className="arr">→</span>
            </a>
          </nav>
        </div>
      </header>
      <main id="main">{children}</main>
    </div>
  );
}
