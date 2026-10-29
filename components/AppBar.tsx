"use client";

import { Fragment } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const NAV = [
  { href: "/dashboard", label: "Dashboard" },
  { href: "/career", label: "Career" },
  { href: "/pathway", label: "Pathway" },
  { href: "/prep", label: "Prep" },
  { href: "/progress", label: "Progress" },
  { href: "/profile", label: "Profile", ownRow: true },
];

/** Sticky app bar — 5-item nav (locked), CSS-geometric brand mark. The user
 * chip is the session-honest meta line passed by the (app) layout. */
export default function AppBar({ meta = "" }: { meta?: string }) {
  const pathname = usePathname();
  // Navy Shell chrome (user-pinned dashboard splice): on the dashboard the
  // app bar is the top edge of the page's one navy mass. The tone switches
  // at the class level; app/(app)/dashboard/dashboard.css owns the navy
  // visuals, so every other surface keeps the shared white bar untouched.
  // The nav labels/hrefs, aria-current and the POST sign-out form below are
  // the walk's e2e contract — never touched.
  const navy = pathname === "/dashboard";
  return (
    <header className={navy ? "bar bar-navy" : "bar"}>
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
          {/* POST, not a GET <Link>: Next prefetches links, and a prefetch
              against a GET sign-out route would silently end the session
              (the walk's own visits wiped the cookie — e2e-caught). A form
              POST is never prefetched. */}
          <form action="/api/auth/signout" method="post">
            <button
              type="submit"
              className="link-quiet"
              style={{ background: "none", border: 0, padding: 0, cursor: "pointer", fontFamily: "inherit" }}
            >
              Sign out
            </button>
          </form>
        </div>
      </div>
    </header>
  );
}
