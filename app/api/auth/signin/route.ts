import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { findAccount, newStudentState, SESSION_COOKIE, sessionCookieValue } from "@/lib/session";
import { db } from "@/lib/db";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * POST /api/auth/signin { email, password, role } → 200 {dest, role}
 * Dest: student with state → /dashboard; student fresh → /onboarding; admin → /admin.
 * Error contract (auth agent's client maps these): bad_credentials | wrong_role | no_account | server
 */
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const account = findAccount(String(body.email ?? ""));
    if (!account) return NextResponse.json({ error: "no_account" }, { status: 401 });
    if (account.password !== String(body.password ?? "")) {
      return NextResponse.json({ error: "bad_credentials" }, { status: 401 });
    }
    if (body.role && body.role !== account.role) {
      return NextResponse.json({ error: "wrong_role" }, { status: 403 });
    }
    // ensure the student's state document exists (Neil seeds canon; others fresh)
    if (account.role === "student") {
      await db.saveStudentState(account.studentId, newStudentState(account.studentId, account.fullName));
    }
    const store = await cookies();
    store.set(SESSION_COOKIE, sessionCookieValue(account), {
      httpOnly: true,
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 12, // demo-day session
    });
    const dest =
      account.role === "admin" ? "/admin" : account.studentId === "neil" ? "/dashboard" : "/onboarding";
    return NextResponse.json({ dest, role: account.role });
  } catch {
    return NextResponse.json({ error: "server" }, { status: 500 });
  }
}
