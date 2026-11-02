"use client";

import { Fragment, useEffect, useRef, useState, type ReactNode } from "react";

/**
 * Profile's four-tab chrome — the v7 family Tab Strip (DEPENDS 2026-10-30
 * Round-7 re-cut): Plan · Competencies · Credentials · Account over server-
 * rendered panels. The strip rides a slim card of its own (cardtop,
 * v7.2 Composition A idiom), arrow-key roving focus, hash deep-links
 * (default: Plan — the demo walk opens beat 9 there).
 *
 * PHASE-2 REVAMP (2026-11-02): the frame class is unconditional — every
 * tab renders the floating-cards frame (`.planframe`): the wrapper drops
 * its own card chrome, the tab strip stands alone, and the active
 * tabpanel's content floats on the shell ground (Plan/Competencies as
 * stacked Dashboard-register `.card` units; the tabs then on the psblock
 * register kept one married surface via their inner `.stack` — that
 * bridge is retired below by the Phase-4 re-cut).
 *
 * HOOKS (kept verbatim through the re-cut): `#tab-profile` → `#panel-profile`
 * carries the Credentials panel — the e2e money beat clicks the tab by its
 * legacy id and fills the presence fields inside (demo-arc / record / the
 * capture rounds). The visible LABEL is content and reads "Credentials";
 * the selectors are the contract.
 *
 * PHASE-3 (2026-11-02): Credentials joined the card register (its panel is
 * real `.plancards .card` units).
 * PHASE-4 (2026-11-02): Account joined too — three separate cards — so the
 * inner `.stack` married-surface bridge and its ACCOUNT-ONLY stylesheet
 * rule are retired; every tabpanel's content floats on the shell ground.
 */

const TABS = [
  { id: "plan", label: "Plan" },
  { id: "competencies", label: "Competencies" },
  { id: "profile", label: "Credentials", hooks: "profile" },
  { id: "account", label: "Account" },
] as const;

type TabId = (typeof TABS)[number]["id"];
const isTab = (v: string): v is TabId => TABS.some((t) => t.id === v);

export default function ProfileTabs({
  panels,
  kickers,
  foot,
}: {
  panels: Partial<Record<TabId, ReactNode>>;
  /** computed instrument counters, one per tab (the cardtop kicker register,
   *  v7.2 Composition A) — absent key = no kicker on that tab */
  kickers?: Partial<Record<TabId, string>>;
  foot: ReactNode;
}) {
  const [active, setActive] = useState<TabId>("plan");
  const ref = useRef<HTMLDivElement>(null);

  /* hash deep-link (default: Plan — beat 9 lands here without a hash) */
  useEffect(() => {
    const initial = (window.location.hash || "").replace("#", "");
    if (isTab(initial)) setActive(initial);
  }, []);

  const select = (id: TabId) => {
    setActive(id);
    if (history.replaceState) history.replaceState(null, "", `#${id}`);
  };

  /* arrow-key roving focus on the tablist */
  const onTablistKey = (e: React.KeyboardEvent) => {
    const target = e.target as HTMLElement;
    const id = target.getAttribute("id")?.replace("tab-", "") ?? "";
    if (!isTab(id)) return;
    const i = TABS.findIndex((t) => t.id === id);
    const next =
      e.key === "ArrowRight"
        ? TABS[(i + 1) % TABS.length].id
        : e.key === "ArrowLeft"
          ? TABS[(i + TABS.length - 1) % TABS.length].id
          : null;
    if (next) {
      e.preventDefault();
      select(next);
      document.getElementById(`tab-${next}`)?.focus();
    }
  };

  return (
    <div ref={ref}>
      {/* the tab chrome: a slim card of its own (cardtop), with the active
          tabpanel floating below it on the shell ground (`.planframe` —
          unconditional since the Phase-2 re-cut). HOOKS unchanged:
          `#tab-profile` → `#panel-profile` is the e2e contract. */}
      <div className="card tabcard planframe">
        <div className="cardtop">
          <div className="ptabs" role="tablist" aria-label="Profile sections" onKeyDown={onTablistKey}>
            {TABS.map((t) => (
              <button
                key={t.id}
                type="button"
                role="tab"
                id={`tab-${t.id}`}
                data-tab={t.id}
                aria-selected={active === t.id}
                aria-controls={`panel-${t.id}`}
                tabIndex={active === t.id ? 0 : -1}
                onClick={() => select(t.id)}
              >
                {t.label}
              </button>
            ))}
          </div>
          {kickers?.[active] ? (
            <span className="kicker num">
              {kickers[active]}
            </span>
          ) : null}
        </div>
        {TABS.map((t) => (
          <section
            key={t.id}
            className="tabpanel"
            id={`panel-${t.id}`}
            role="tabpanel"
            aria-labelledby={`tab-${t.id}`}
            tabIndex={0}
            hidden={active !== t.id}
          >
            {panels[t.id] as ReactNode}
          </section>
        ))}
      </div>
      {foot && <Fragment key="foot">{foot}</Fragment>}
    </div>
  );
}
