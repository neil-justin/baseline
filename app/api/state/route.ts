import { NextResponse } from "next/server";
import { getStudentView } from "@/lib/db";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/** GET /api/state?student=neil — the computed readout every surface consumes. */
export async function GET(req: Request) {
  const url = new URL(req.url);
  const id = url.searchParams.get("student") ?? "neil";
  const view = await getStudentView(id);
  return NextResponse.json(view);
}
