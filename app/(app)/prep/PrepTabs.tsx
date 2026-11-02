"use client";

import { useEffect, useState } from "react";
import type { ReactNode } from "react";

/**
 * Prep — the two application-materials tools as a SUITE (v7.4 recut, user
 * ruling 2026-11-02): the `.prep-lens` segmented toolbar OUTSIDE the card
 * switches the active tool — Resume checker / Cover-letter checker — and each
 * tab is its own v7 card carrying one full tool flow (dropzone intake →
 * result dashboard). Presence is NOT a tab: the declaring/stamping factor
 * lives in Profile → Credentials; the named band's computed counter cell
 * carries its state. Sequence is DECLARED via in-content handoff links
 * (#letter hashchange; the factors measure on their own files, no wizard).
 *
 * Deep-links #resume/#letter + a hashchange listener; the roving tablist
 * keyboard pattern is the family's (Careers/My Plan register). The
 * hidden-guard (.tabpanel[hidden] display:none !important) is the
 * profile/v7.2 pattern. No entrance motion (DNA lock).
 */
const TABS = [
  { id: "resume", label: "Resume checker" },
  { id: "letter", label: "Cover-letter checker" },
] as const;
type TabId = (typeof TABS)[number]["id"];
const isTab = (v: string): v is TabId => TABS.some((t) => t.id === v);

export default function PrepTabs({
  panels,
  kickers,
}: {
  panels: { resume: ReactNode; letter: ReactNode };
  kickers: { resume: string | null; letter: string | null };
}) {
  const [active, setActive] = useState<TabId>("resume");
  const [seq, setSeq] = useState(0); // >0 only after a user-initiated switch

  /* open tab from the URL hash, and follow in-content handoff links —
     an <a href="#letter"> bumps the hash, the tab follows (declared
     sequence, no wizard gate) */
  useEffect(() => {
    const applyHash = () => {
      const h = (window.location.hash || "").replace("#", "");
      if (isTab(h)) setActive(h);
    };
    applyHash();
    window.addEventListener("hashchange", applyHash);
    return () => window.removeEventListener("hashchange", applyHash);
  }, []);

  const selectTab = (id: TabId, user = true) => {
    setActive(id);
    if (user) setSeq((n) => n + 1);
    if (history.replaceState) history.replaceState(null, "", `#${id}`);
  };

  /* roving arrow-key focus on the toolbar tablist */
  const onTablistKey = (e: React.KeyboardEvent) => {
    const target = e.target as HTMLElement;
    const t = target.getAttribute("id")?.replace("tab-", "") ?? "";
    if (!isTab(t)) return;
    const i = TABS.findIndex((x) => x.id === t);
    let next: TabId | null = null;
    if (e.key === "ArrowRight") next = TABS[(i + 1) % TABS.length].id;
    if (e.key === "ArrowLeft") next = TABS[(i + TABS.length - 1) % TABS.length].id;
    if (next) {
      e.preventDefault();
      selectTab(next);
      document.getElementById(`tab-${next}`)?.focus();
    }
  };

  const tab = (id: TabId) => ({
    id: `tab-${id}`,
    "aria-controls": `panel-${id}`,
    role: "tab" as const,
    "aria-selected": active === id,
    tabIndex: active === id ? 0 : -1,
    onClick: () => selectTab(id),
  });

  return (
    <>
      {/* the lens-row toolbar OUTSIDE the card + the active tool's kicker */}
      <div className="prep-lens">
        <div className="ptabs" role="tablist" aria-label="Application materials tools" onKeyDown={onTablistKey}>
          {TABS.map((t) => (
            <button key={t.id} type="button" {...tab(t.id)}>
              {t.label}
            </button>
          ))}
        </div>
        {kickers[active] ? <span className="kicker num">{kickers[active]}</span> : null}
      </div>

      {(TABS.map((t) => t.id) as TabId[]).map((id) => (
        <section
          key={`${id}-${seq}`}
          className="card tabpanel"
          id={`panel-${id}`}
          role="tabpanel"
          aria-labelledby={`tab-${id}`}
          hidden={active !== id}
        >
          {panels[id]}
        </section>
      ))}
    </>
  );
}
