"use client";

import { useEffect, useState, type ReactNode } from "react";

/**
 * Profile's tab chrome — the v7 family Tab Strip: Competencies ·
 * Credentials · Account over server-rendered panels. The strip renders
 * BARE (no wrapper card — the old `.card tabcard planframe` + `.cardtop`
 * was a card-in-card no other page has): the `.ptabs` tablist stands alone
 * on the shell ground like pathway/prep, the active tabpanel below it.
 *
 * Back/forward walks tab history: each select pushes a history entry
 * (pushState, not replaceState) and a hashchange listener syncs the active
 * tab (the initial hash too — the hash is the single source of truth).
 *
 * After the panels, the shared chip legend renders in flow on the two
 * evidence-bearing tabs (Competencies + Credentials) — it guides both
 * tabs' chips, so it left the Skills card.
 *
 * HOOKS (kept verbatim): `#tab-profile` → `#panel-profile` carries the
 * Credentials panel — the e2e money beat's selector is the contract; the
 * visible LABEL reads "Credentials".
 */

const TABS = [
  { id: "competencies", label: "Competencies" },
  { id: "profile", label: "Credentials", hooks: "profile" },
  { id: "account", label: "Account" },
] as const;

type TabId = (typeof TABS)[number]["id"];
const isTab = (v: string): v is TabId => TABS.some((t) => t.id === v);

/* the shared chip legend — rides both evidence-bearing tabs */
const LEGEND =
  "·✓ passed a verification quiz · ·✓✓ passed a comprehension check · self-reported = your claim, until its check passes";

export default function ProfileTabs({
  panels,
}: {
  panels: Partial<Record<TabId, ReactNode>>;
}) {
  const [active, setActive] = useState<TabId>("competencies");

  /* initial hash + back/forward: the hash is the single source of truth */
  useEffect(() => {
    const sync = () => {
      const id = (window.location.hash || "").replace("#", "");
      if (isTab(id)) setActive(id);
    };
    sync();
    window.addEventListener("hashchange", sync);
    return () => window.removeEventListener("hashchange", sync);
  }, []);

  /* pushState — each tab select is a history entry, so Back returns to the
     previous tab (the old replaceState overwrote the entry instead) */
  const select = (id: TabId) => {
    if (history.pushState) history.pushState(null, "", `#${id}`);
    setActive(id);
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
    <div>
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

      {/* the legend — in flow at the bottom of Competencies and Credentials */}
      {active !== "account" && (
        <p className="tab-legend num" role="note">
          {LEGEND}
        </p>
      )}
    </div>
  );
}
