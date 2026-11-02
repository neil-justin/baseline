"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

/**
 * (app) shell chrome — v7.3 sidebar round (user-ruled 2026-11-02): the
 * 56px top bar RETIRES as nav but survives as the horizontal HEADER band
 * spanning the full frame (brand block: 6px-blue-inlay mark + "Career
 * Readiness" wordmark; no search, no bells). Desktop navigation is the
 * left SIDEBAR (.v7-side) spanning vertically beside the content:
 * professional icon+name tabs stacked in it (.sidenav: 13.5px/500 labels,
 * 12px radius, #E8F0FE wash + #1557B0 ink on the surface's own tab,
 * transparent hover), with the Sign out control pinned to the sidebar's
 * bottom edge (.signout — margin-top:auto; user ruling 2026-11-02 reverses
 * the v7.3 retirement of the student sign-out — a plain HTML form POST to
 * /api/auth/signout, which 303s to /signin). The avatar disc RETIRES
 * entirely — it duplicated the Profile tab (both linked /profile) against
 * the element-budget rule; no invented affordances.
 *
 * The ≤720px Material bottom nav is untouched: the .rail element stays a
 * sibling OUTSIDE the sidebar <aside> — desktop nav lives in the aside,
 * mobile nav in the rail (with the same Sign out control as its sixth item).
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
      <header className="v7-head" role="banner">
        <div className="side-brand">
          <span className="brandmark" aria-hidden="true">
            <i />
          </span>
          <span className="brand">Career Readiness</span>
        </div>
      </header>
      <aside className="v7-side">
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
          <form action="/api/auth/signout" method="post" className="signout">
            <button type="submit" title="Sign out">
              <span className="ms" aria-hidden="true">
                logout
              </span>
              <span>Sign out</span>
            </button>
          </form>
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
        <form action="/api/auth/signout" method="post">
          <button type="submit" title="Sign out">
            <span className="ms" aria-hidden="true">
              logout
            </span>
            <span className="rail-caption">Sign out</span>
          </button>
        </form>
      </nav>
    </>
  );
}
