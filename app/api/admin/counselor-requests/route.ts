import { NextResponse } from "next/server";
import { getCurrentProfile } from "@/lib/session";
import { supabaseAdmin } from "@/lib/supabase/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export interface CounselorRequestRow {
  userId: string;
  email: string;
  fullName: string;
  note: string;
  status: string;
  requestedAt: string;
  decidedAt: string | null;
  decidedBy: string | null;
}

/**
 * GET /api/admin/counselor-requests — the APPROVALS tab's read (Wave 2).
 * SYSADMIN-only (same roles wall as the [id] PATCH shape). Returns every
 * counselor_requests row — pending AND decided (the trail is the table's
 * 5th column) — pending first (oldest application first, the [id] page's
 * order), decided after (latest ruling first).
 */
export async function GET() {
  const profile = await getCurrentProfile();
  if (!profile) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  if (profile.role !== "sysadmin") return NextResponse.json({ error: "forbidden" }, { status: 403 });

  const admin = supabaseAdmin();
  const { data, error } = await admin
    .from("counselor_requests")
    .select("user_id, email, full_name, note, status, requested_at, decided_at, decided_by")
    .order("requested_at", { ascending: true });
  if (error) return NextResponse.json({ error: "server" }, { status: 500 });

  const rows = (data ?? []) as Array<{
    user_id: string;
    email: string;
    full_name: string;
    note: string;
    status: string;
    requested_at: string;
    decided_at: string | null;
    decided_by: string | null;
  }>;
  const pending = rows.filter((r) => r.status === "pending");
  const decided = rows
    .filter((r) => r.status !== "pending")
    .sort((a, b) => (b.decided_at ?? "").localeCompare(a.decided_at ?? ""));

  return NextResponse.json({
    requests: [...pending, ...decided].map((r) => ({
      userId: r.user_id,
      email: r.email,
      fullName: r.full_name,
      note: r.note,
      status: r.status,
      requestedAt: r.requested_at,
      decidedAt: r.decided_at,
      decidedBy: r.decided_by,
    })),
  });
}
