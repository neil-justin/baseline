import { NextResponse } from "next/server";
import { getStudentView } from "@/lib/db";
import { actingStudentId } from "@/lib/session";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * GET /api/state?student=… — the computed readout every surface consumes.
 * The signed-in student reads their own view; a `student` param is honored
 * only for staff (counselor/sysadmin cohort reads) — a student can never
 * address another student's state. 401 when not signed in.
 */
export async function GET(req: Request) {
  const url = new URL(req.url);
  const id = await actingStudentId(url.searchParams.get("student"));
  if (!id) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  const view = await getStudentView(id);
  return NextResponse.json(view);
}
