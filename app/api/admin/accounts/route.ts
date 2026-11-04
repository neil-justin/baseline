import { NextResponse } from "next/server";
import { getCurrentProfile } from "@/lib/session";
import { listAccounts, setAccountActive } from "@/lib/admin/accounts";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * Wave 3 (2026-11-03 admin-replacement.md) — the ACCOUNTS tab backend, the
 * admin replacement's one new route pair. SYSADMIN-only: counselor/student
 * calls hit the roles wall (403) — provisioning accounts is the sysadmin's
 * seat (Carried decisions), the counselor reads + audits the cohort only.
 *
 *   GET    → every identity (auth users ↔ profiles) as `{ accounts }`
 *            for the tab's table, including deactivated (banned) rows.
 *   PATCH  → { userId, active } → soft-deactivate / reactivate via a
 *            Supabase Auth ban (lib/admin/accounts.setAccountActive). No
 *            schema change, no hard delete; the DPA erasure route is never
 *            touched. No self-deactivation special-case here — the UI never
 *            offers it; the API answers ok on the sysadmin's own row.
 */

export async function GET() {
  const profile = await getCurrentProfile();
  if (!profile) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  if (profile.role !== "sysadmin") {
    return NextResponse.json({ error: "forbidden" }, { status: 403 });
  }
  const accounts = await listAccounts();
  // selfUserId marks the sysadmin's own row — the kebab never renders for
  // it (the mockup's "—" law); operations stay allowed through the PATCH.
  return NextResponse.json({ accounts, selfUserId: profile.userId });
}

export async function PATCH(req: Request) {
  const profile = await getCurrentProfile();
  if (!profile) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  if (profile.role !== "sysadmin") {
    return NextResponse.json({ error: "forbidden" }, { status: 403 });
  }

  let body: Record<string, unknown>;
  try {
    body = (await req.json()) as Record<string, unknown>;
  } catch {
    return NextResponse.json({ error: "bad_request", detail: "The action didn't arrive complete — try again." }, { status: 400 });
  }
  const userId = body.userId;
  const active = body.active;
  if (typeof userId !== "string" || userId.length === 0) {
    return NextResponse.json({ error: "bad_request", detail: "Name the account to change." }, { status: 400 });
  }
  if (typeof active !== "boolean") {
    return NextResponse.json({ error: "bad_request", detail: "The action is deactivate or reactivate — nothing between." }, { status: 400 });
  }

  await setAccountActive(userId, active);
  return NextResponse.json({ userId, active });
}
