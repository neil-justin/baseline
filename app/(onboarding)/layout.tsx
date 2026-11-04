import type { ReactNode } from "react";
import BrandMark from "../../components/BrandMark";
import "../(app)/v7.css";

export const dynamic = "force-dynamic";

/**
 * (onboarding) group — the FOCUSED first-run chrome (user ruling
 * 2026-11-04: the console sidebar must not appear during onboarding —
 * a setup flow carries no console nav; Element-budget logic). Same v7
 * token ground (the .v7 root), header band spans across with the brand
 * block only, and `.v7-focus` folds the 240px nav column away — no
 * sidebar, no ≤720px bottom rail. The Named-Surface band lives in the
 * page (ob-band); requireStudent still gates the route in page.tsx.
 */
export default function OnboardingLayout({ children }: { children: ReactNode }) {
  return (
    <div className="v7 v7-focus">
      <header className="v7-head" role="banner">
        <div className="side-brand">
          <BrandMark size={24} />
          <span className="brand">Baseline</span>
        </div>
      </header>
      <main id="main" className="v7-main">
        {children}
      </main>
    </div>
  );
}
