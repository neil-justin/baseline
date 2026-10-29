import type { ReactNode } from "react";
import AppBar from "@/components/AppBar";
import { getCurrentProfile } from "@/lib/session";
import { db } from "@/lib/db";
import "./v7.css";

export const dynamic = "force-dynamic";

/**
 * DNA v7 app shell (LOCKED 2026-10-29) — top bar + 48px icon rail serving
 * every (app) surface; main content beside the rail. The avatar disc is
 * session-honest: the signed-in student's own store name initial, never a
 * hardcoded demo persona (ADR 0003).
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
