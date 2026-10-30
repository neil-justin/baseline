import { NextResponse } from "next/server";
import { actingStudentId } from "@/lib/session";
import { credentialStore, credentialsPersistenceNotice, type CredentialInput } from "@/lib/db/credential-store";
import { validateCredentialInput } from "./validate-input";
import { CAREERS } from "@/lib/fixtures/catalog";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * POST /api/credentials — declare a credential (the Round-7 entry flow):
 * title, organization, dates, evidence URL/note, and declared skills from
 * the framework vocabulary. The new row enters `declared` — pending the
 * counselor audit via the Admin surface. Nothing scores yet: verified
 * credentials close gaps; declared ones wait honestly ("Needs check"),
 * never a painted point.
 *
 * GET — the signed-in student's declared-kind credential rows.
 */
export async function GET() {
  const id = await actingStudentId(undefined);
  if (!id) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  const rows = await credentialStore.list(id);
  return NextResponse.json({ credentials: rows, persistence: credentialsPersistenceNotice() });
}

export async function POST(req: Request) {
  const id = await actingStudentId(undefined);
  if (!id) return NextResponse.json({ error: "unauthorized" }, { status: 401 });

  let body: Record<string, unknown>;
  try {
    body = (await req.json()) as Record<string, unknown>;
  } catch {
    return NextResponse.json({ error: "bad_json", detail: "The declaration didn't arrive complete — try again." }, { status: 400 });
  }

  const check = validateCredentialInput(body);
  if (typeof check === "string") return NextResponse.json({ error: "bad_input", detail: check }, { status: 400 });

  // framework vocabulary: every catalog role's skill names (cross-track
  // declared skills stay honest — org leadership cites the NACE
  // cross-cutting evidence regardless of the role picked)
  const known = new Set<string>();
  for (const c of CAREERS) for (const s of c.skills) known.add(s.name);
  const rogue = check.ok.declaredSkills?.filter((s) => !known.has(s)) ?? [];
  if (rogue.length > 0) {
    return NextResponse.json(
      {
        error: "bad_input",
        detail: `Declared skills must come from the framework vocabulary — not found there: ${rogue.join(", ")}. Re-pick from the list.`,
      },
      { status: 400 }
    );
  }

  let row: Awaited<ReturnType<typeof credentialStore.declare>>;
  try {
    row = await credentialStore.declare(id, check.ok);
  } catch (e) {
    return NextResponse.json({ error: "storage_failed", detail: (e as Error).message }, { status: 500 });
  }

  return NextResponse.json({
    credential: row,
    note: row.degraded
      ? "Declared — stored locally (the credentials table isn't applied yet). It waits on the counselor audit."
      : "Declared — it now waits on the counselor audit. Nothing scores until the audit verifies it.",
  });
}
