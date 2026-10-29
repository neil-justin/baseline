"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

/**
 * DNA v7 shell chrome (LOCKED 2026-10-29): a 56px top bar — brand mark with
 * the 6px blue inlay, the "Career Readiness" wordmark, and on the right ONLY
 * the user avatar disc linking to Profile (no search, no notifications, no
 * invented affordances — the element-budget rule) — over a 48px icon rail
 * (Material Symbols, active pill). The rail is the primary nav for every
 * (app) surface; at ≤720px it collapses to a Material bottom nav.
 *
 * The avatar initial is the session-honest signed-in student's name initial
 * (passed by the (app) layout from the store) — never a hardcoded persona.
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
    <header className="v7-head" role="banner">
      <div className="topbar">
        <span className="brandmark" aria-hidden="true">
          <i />
        </span>
        <span className="brand">Career Readiness</span>
        <span className="spacer" aria-hidden="true" />
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
    </header>
  );
}
