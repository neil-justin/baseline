import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { findAccount, newStudentState, SESSION_COOKIE, sessionCookieValue } from "@/lib/session";
import { db } from "@/lib/db";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * POST /api/auth/signup { name, email, password, role } → 200 {dest, role}
 * Creates a student-format account (admin self-serve provisioning is
 * post-defense; the Admin toggle may only sign in to the seeded admin).
 */
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const email = String(body.email ?? "").trim().toLowerCase();
    const name = String(body.name ?? "").trim();
    const password = String(body.password ?? "");
    if (name.length === 0) return NextResponse.json({ error: "name_required" }, { status: 400 });
    if (password.length < 8) return NextResponse.json({ error: "password_short" }, { status: 400 });
    if (findAccount(email)) return NextResponse.json({ error: "email_taken" }, { status: 409 });

    const role: "student" | "admin" = body.role === "admin" && email === "admin@demo.ph" ? "admin" : "student";
    const account = {
      email,
      password,
      role,
      studentId: email.split("@")[0].replace(/[^a-z0-9-]/g, "") || "student",
      fullName: name,
    };
    const cookieVal = sessionCookieValue({ ...account, studentId: account.studentId });
    if (role === "student") {
      await db.saveStudentState(account.studentId, newStudentState(account.studentId, name));
    }
    const store = await cookies();
    store.set(SESSION_COOKIE, cookieVal, {
      httpOnly: true,
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 12,
    });
    return NextResponse.json({ dest: role === "admin" ? "/admin" : "/onboarding", role });
  } catch {
    return NextResponse.json({ error: "server" }, { status: 500 });
  }
}
