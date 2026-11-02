import type { ReactNode } from "react";
import Sidebar from "@/components/Sidebar";
import "./v7.css";

export const dynamic = "force-dynamic";

/**
 * (app) shell (v7.3 sidebar round, user-ruled 2026-11-02) — the 56px header
 * band spans the frame across the top (brand block only); navigation is the
 * left sidebar spanning vertically (sidenav tabs, Profile pinned at its
 * bottom edge); the .rail element rides along ONLY to become the ≤720px
 * Material bottom nav; the frame caps at 1240px centered with 8px shared
 * gutters. The avatar disc retired with the top bar (it duplicated the
 * Profile tab).
 */
export default function AppLayout({ children }: { children: ReactNode }) {
  return (
    <div className="v7">
      <Sidebar />
      <main id="main" className="v7-main">
        {children}
      </main>
    </div>
  );
}
