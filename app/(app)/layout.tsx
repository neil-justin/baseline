import type { ReactNode } from "react";
import AppBar from "@/components/AppBar";
import { getCurrentProfile } from "@/lib/session";
import { db } from "@/lib/db";

export const dynamic = "force-dynamic";

/**
 * Post-login shell: sticky 5-item app bar (locked nav). The user chip is
 * session-honest (ADR 0003): the signed-in student's name + grade from their
 * state, or the staff member's name + role — never a hardcoded demo student.
 */
export default async function AppLayout({ children }: { children: ReactNode }) {
  const profile = await getCurrentProfile();

  let meta = "";
  if (profile) {
    if (profile.role === "student" && profile.studentId) {
      const state = await db.getStudentState(profile.studentId);
      meta = `${state.name} · ${state.grade}`;
    } else if (profile.role === "counselor") {
      meta = `${profile.fullName} · Counselor`;
    } else if (profile.role === "sysadmin") {
      meta = `${profile.fullName} · System Admin`;
    }
  }

  return (
    <>
      <AppBar meta={meta} />
      <main id="main">{children}</main>
    </>
  );
}
