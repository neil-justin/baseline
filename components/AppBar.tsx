"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

/**
 * DNA v7 shell chrome (LOCKED 2026-10-29; v7.2 shell round 2026-10-30): the
 * 56px top bar is now the desktop navigation — brand mark with the 6px blue
 * inlay + "Career Readiness" wordmark left, professional icon+name tabs
 * (headnav: 13.5px/500 labels, 12px radius, #E8F0FE wash + #1557B0 ink on the
 * surface's own tab, transparent hover) center, and the user avatar disc
 * linking to Profile on the right (still the ONLY right-side element — no
 * search, no notifications, no invented affordances: the element-budget rule).
 *
 * The 48px left icon rail RETIRES on desktop (v7.2 Rail Retirement, ruled
 * from the rail-margin-variants mock): the .rail DOM element stays — a
 * sibling OUTSIDE the <header> element so `header a[href=…]` locators stay
 * strict-mode-unique on the headnav (e2e contract kept verbatim) — and
 * survives solely as the ≤720px Material bottom nav. The avatar initial is
 * the session-honest signed-in student's name initial (passed by the (app)
 * layout from the store) — never a hardcoded persona.
 */
const NAV = [
  { href: "/dashboard", icon: "space_dashboard", label: "Dashboard" },
  { href: "/career", icon: "work", label: "Careers" },
  { href: "/pathway", icon: "checklist", label: "My Plan" },
  { href: "/prep", icon: "description", label: "Prep" },
  { href: "/profile", icon: "account_circle", label: "Profile" },
];

export default function AppBar({ initial = "" }: { initial?: string }) {
  const pathname = usePathname();
  const current = (href: string) =>
    pathname === href || pathname.startsWith(href + "/");

  return (
    <>
      <header className="v7-head" role="banner">
        <div className="topbar">
          <span className="brandmark" aria-hidden="true">
            <i />
          </span>
          <span className="brand">Career Readiness</span>
          <nav className="headnav" aria-label="Primary">
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
          {initial ? (
            <Link
              className="avatar"
              href="/profile"
              aria-label="Profile"
              title="Profile"
            >
              {initial}
            </Link>
          ) : null}
        </div>
      </header>
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
