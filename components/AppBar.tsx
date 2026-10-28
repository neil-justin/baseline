"use client";

import { Fragment } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const NAV = [
  { href: "/dashboard", label: "Dashboard" },
  { href: "/career", label: "Career" },
  { href: "/pathway", label: "Pathway" },
  { href: "/progress", label: "Progress" },
  { href: "/profile", label: "Profile", ownRow: true },
];

/** Sticky app bar — 5-item nav (locked), CSS-geometric brand mark. The user
 * chip is the session-honest meta line passed by the (app) layout. */
export default function AppBar({ meta = "" }: { meta?: string }) {
  const pathname = usePathname();
  return (
    <header className="bar">
      <div className="app-bar-in">
        <div className="brand">
          <span className="brand-mark" aria-hidden="true" />
          <span className="brand-name">Career Readiness</span>
        </div>
        <nav className="app-nav" aria-label="Primary">
          {NAV.map((item) => {
            const current = pathname === item.href;
            return (
              <Fragment key={item.href}>
                {item.ownRow ? <span className="nav-spacer" aria-hidden="true" /> : null}
                {current ? (
                  <a href={item.href} aria-current="page">
                    {item.label}
                  </a>
                ) : (
                  <Link href={item.href}>{item.label}</Link>
                )}
              </Fragment>
            );
          })}
        </nav>
        <div className="app-user">
          <span className="user-chip">{meta}</span>
          <Link className="link-quiet" href="/api/auth/signout">
            Sign out
          </Link>
        </div>
      </div>
    </header>
  );
}
