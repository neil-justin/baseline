"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

/**
 * (app) shell chrome — v7.3 sidebar round (user-ruled 2026-11-02): the 56px
 * top bar RETIRES; desktop navigation is now the left sidebar (.v7-side):
 * the brand block (6px-blue-inlay mark + "Career Readiness" wordmark) on
 * top, professional icon+name tabs stacked below it (.sidenav: 13.5px/500
 * labels, 12px radius, #E8F0FE wash + #1557B0 ink on the surface's own tab,
 * transparent hover). The avatar disc RETIRES entirely — it duplicated the
 * "Profile" tab (both linked /profile) against the element-budget rule; no
 * search, no notifications, no invented affordances.
 *
 * The ≤720px Material bottom nav is untouched: the .rail element stays a
 * sibling OUTSIDE the .v7-side <aside>, exactly as it rode beside the old
 * top bar — desktop nav lives in the aside, mobile nav in the rail.
 */
const NAV = [
  { href: "/dashboard", icon: "space_dashboard", label: "Dashboard" },
  { href: "/career", icon: "work", label: "Careers" },
  { href: "/pathway", icon: "checklist", label: "My Plan" },
  { href: "/prep", icon: "description", label: "Prep" },
  { href: "/profile", icon: "account_circle", label: "Profile" },
];

export default function Sidebar() {
  const pathname = usePathname();
  const current = (href: string) =>
    pathname === href || pathname.startsWith(href + "/");

  return (
    <>
      <aside className="v7-side">
        <div className="side-brand">
          <span className="brandmark" aria-hidden="true">
            <i />
          </span>
          <span className="brand">Career Readiness</span>
        </div>
        <nav className="sidenav" aria-label="Primary">
          {NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              title={item.label}
              className={current(item.href) ? "on" : ""}
              aria-current={current(item.href) ? "page" : undefined}
            >
              <span className="ms" aria-hidden="true">
                {item.icon}
              </span>
              <span>{item.label}</span>
            </Link>
          ))}
        </nav>
      </aside>
      <nav className="rail" aria-label="Primary">
        {NAV.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            title={item.label}
            className={current(item.href) ? "on" : ""}
            aria-current={current(item.href) ? "page" : undefined}
          >
            <span className="ms" aria-hidden="true">
              {item.icon}
            </span>
            <span className="rail-caption">{item.label}</span>
          </Link>
        ))}
      </nav>
    </>
  );
}
