import type { ReactNode } from "react";
import { CATALOG_TOTAL } from "@/lib/fixtures/catalog";
import { ReturnArrow } from "./ArrowMark";

/** Marketing shell — the public bar (brand + quiet links + primary CTA). */
export default function MarketingLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <header className="bar">
        <div className="bar-in">
          <div className="brand">
            <span className="brand-mark" aria-hidden="true"></span>
            <span className="brand-name">Career Readiness</span>
            <span className="brand-meta">{CATALOG_TOTAL} careers · sample score</span>
          </div>
          <nav className="bar-right" aria-label="Primary">
            <a className="link-quiet" href="/signin">
              Sign in
            </a>
            <a className="btn btn-primary" href="/signup">
              Start check <ReturnArrow />
            </a>
          </nav>
        </div>
      </header>
      <main id="main">{children}</main>
    </>
  );
}
