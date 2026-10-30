import type { ReactNode } from "react";
import AppBar from "@/components/AppBar";
import { getCurrentProfile } from "@/lib/session";
import { db } from "@/lib/db";
import "./v7.css";

export const dynamic = "force-dynamic";

/**
 * DNA v7 app shell (v7.2 shell round, 2026-10-30) — the 56px top bar is the
 * desktop navigation (headnav tabs inside the bar); the .rail element rides
 * along ONLY to become the ≤720px Material bottom nav; the frame caps at
 * 1240px centered with 8px shared gutters. The avatar disc is session-honest:
 * the signed-in student's own store name initial, never a hardcoded demo
 * persona (ADR 0003).
 */
export default async function AppLayout({ children }: { children: ReactNode }) {
  const profile = await getCurrentProfile();

  let initial = "";
  if (profile?.role === "student" && profile.studentId) {
    const state = await db.getStudentState(profile.studentId);
    initial = state.name.charAt(0).toUpperCase();
  }

  return (
    <div className="v7">
      <AppBar initial={initial} />
      <main id="main" className="v7-main">
        {children}
      </main>
    </div>
  );
}
