"use client";

import { Fragment, useEffect, useRef, type ReactNode } from "react";

/**
 * Profile's two-tab chrome — direct port of prototype/profile.html's tab
 * script: ARIA tabs (arrow-key cycling) over server-rendered panels, plus the
 * "See the full plan" quiet-toggle handed back from the Profile tab.
 */
export default function ProfileTabs({
  profile,
  plan,
  foot,
}: {
  profile: ReactNode;
  plan: ReactNode;
  foot: ReactNode;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = ref.current;
    if (!root) return;
    const tabs = Array.from(root.querySelectorAll<HTMLElement>(".ptabs [role=tab]"));
    const panel = (name: string) => root.querySelector<HTMLElement>(`#panel-${name}`);

    function select(name: string) {
      for (const t of tabs) {
        const on = t.dataset.tab === name;
        t.setAttribute("aria-selected", on ? "true" : "false");
        t.tabIndex = on ? 0 : -1;
      }
      (["profile", "plan"] as const).forEach((k) => {
        const p = panel(k);
        if (p) p.hidden = k !== name;
      });
    }

    const onClick = (t: HTMLElement) => () => select(t.dataset.tab ?? "");
    const onKey = (i: number) => (e: KeyboardEvent) => {
      if (e.key !== "ArrowRight" && e.key !== "ArrowLeft") return;
      e.preventDefault();
      const next = tabs[(i + (e.key === "ArrowRight" ? 1 : tabs.length - 1)) % tabs.length];
      select(next.dataset.tab ?? "");
      next.focus();
    };
    const offs: Array<() => void> = [];
    tabs.forEach((t, i) => {
      const c = onClick(t);
      const k = onKey(i);
      t.addEventListener("click", c);
      t.addEventListener("keydown", k as EventListener);
      offs.push(() => {
        t.removeEventListener("click", c);
        t.removeEventListener("keydown", k as EventListener);
      });
    });
    // "See the full plan" + any [data-goto] cross-tab button (delegated — the
    // buttons themselves are server-rendered)
    const delegated = (e: Event) => {
      const target = (e.target as HTMLElement | null)?.closest<HTMLElement>("[data-goto]");
      if (!target) return;
      const name = target.dataset.goto ?? "";
      select(name);
      root.querySelector<HTMLElement>("#tab-" + name)?.focus();
      panel(name)?.scrollIntoView({ behavior: "smooth", block: "start" });
    };
    root.addEventListener("click", delegated);
    return () => {
      root.removeEventListener("click", delegated);
      offs.forEach((f) => f());
    };
  }, []);

  return (
    <div ref={ref}>
      <div className="ptabs" role="tablist" aria-label="Profile sections">
        <button role="tab" id="tab-profile" data-tab="profile" aria-selected="false" aria-controls="panel-profile" tabIndex={-1} type="button">
          Profile
        </button>
        <button role="tab" id="tab-plan" data-tab="plan" aria-selected="true" aria-controls="panel-plan" tabIndex={0} type="button">
          Plan
        </button>
      </div>
      {(
        [
          <Fragment key="profile">{profile}</Fragment>,
          <Fragment key="plan">{plan}</Fragment>,
          <Fragment key="foot">{foot}</Fragment>,
        ]
      )}
    </div>
  );
}
