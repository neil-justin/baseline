"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const NAV = [
  { href: "/dashboard", label: "Dashboard" },
  { href: "/career", label: "Career" },
  { href: "/pathway", label: "Pathway" },
  { href: "/progress", label: "Progress" },
  { href: "/profile", label: "Profile" },
];

/** Sticky app bar — 5-item nav (locked), CSS-geometric brand mark. */
export default function AppBar({ meta = "NEIL · G11 · STEM" }: { meta?: string }) {
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
            return current ? (
              <a key={item.href} href={item.href} aria-current="page">
                {item.label}
              </a>
            ) : (
              <Link key={item.href} href={item.href}>
                {item.label}
              </Link>
            );
          })}
        </nav>
        <div className="app-user">
          <span className="user-chip">{meta}</span>
          <Link className="link-quiet" href="/signin">
            Sign out
          </Link>
        </div>
      </div>
    </header>
  );
}
