import { NextResponse } from "next/server";
import { actingStudentId } from "@/lib/session";
import { db } from "@/lib/db";
import { withStateLock } from "@/lib/state-queue";
import { stampPresence, presenceMeasured } from "@/lib/engines/air";
import type { PresenceDeclaration } from "@/lib/types";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/** Demo-day date stamp (mirrors lib/actions.ts nowStamp()) — the statute the
 *  whole demo timeline keeps; the clock time is the real moment. */
const demoStamp = () => `2026-10-17 ${new Date().toTimeString().slice(0, 5)}`;

/**
 * POST /api/credentials/presence — the FOURTH credential kind's declaration
 * (ticket 12; Profile → Credentials, 2026-10-30 Prep pass):
 *
 *   { linkedinUrl, email, privateAccount? }  (JSON body)
 *
 * Machine-verified AT DECLARATION: stampPresence grades the DETERMINISTIC
 * checks (URL shape · professional-email format) and stamps the timestamp —
 * offline by recorded ruling: NOTHING here fetches the URL or pings a mail
 * service; the timestamped stamp is what the demo presents. A declaration
 * whose format checks fail persists NOTHING — the surface renders the named
 * feedback and the factor stays unmeasured (never a painted zero, never a
 * "resolves" lie). A private account records the honest sub-result
 * "resolves, content not machine-verifiable" inside the stamp (recorded,
 * never silently hidden).
 *
 * CARRIER (locked for this round): the declared entry lives in StudentState
 * (`state.presence`) via the EXISTING state seam — the state row is the same
 * store every engine and surface reads. The `credentials` TABLE already
 * carries kind 'presence' (supabase/schema.sql, migration note in-file); a
 * credentials writer/API mirroring the declaration there is the recorded
 * surface seam for the post-Full-DPA-build rounds (ticket-7/credential-
 * writer work): the table row would be identity `presence`, status
 * 'verified', verified_at = the stamp (never counselor-audited).
 *
 * Re-declaration (latest counts): stamping again REPLACES the entry with a
 * new timestamp — the factor's 3 points stay all-or-nothing on the LATEST
 * stamp's checks.
 */
export async function POST(req: Request) {
  const id = await actingStudentId(undefined);
  if (!id) return NextResponse.json({ error: "unauthorized" }, { status: 401 });

  let body: { linkedinUrl?: unknown; email?: unknown; privateAccount?: unknown };
  try {
    body = (await req.json()) as typeof body;
  } catch {
    return NextResponse.json({ error: "bad_json", detail: "The declaration didn't arrive complete — try again." }, { status: 400 });
  }

  const linkedinUrl = typeof body.linkedinUrl === "string" ? body.linkedinUrl.trim() : "";
  const email = typeof body.email === "string" ? body.email.trim() : "";
  const privateAccount = body.privateAccount === true;

  const missing: string[] = [];
  if (!linkedinUrl) missing.push("LinkedIn URL");
  if (!email) missing.push("professional contact email");
  if (missing.length > 0) {
    return NextResponse.json(
      {
        error: "missing_fields",
        detail: `Both fields are required to stamp: the ${missing.join(" and ")}.`,
      },
      { status: 400 }
    );
  }

  // graded FIRST — a malformed declaration is feedback, never a stored stamp
  const stamp = stampPresence({ linkedinUrl, email, privateAccount }, demoStamp());
  const failed: string[] = [];
  if (stamp.checks.linkedinUrlFormat === "fail") {
    failed.push("the LinkedIn URL doesn't read as a profile link — the format check needs https://(www.)linkedin.com/in/<handle>");
  }
  if (stamp.checks.professionalEmailFormat === "fail") {
    failed.push("the contact email isn't a well-formed address — name@provider.domain");
  }
  if (failed.length > 0) {
    return NextResponse.json(
      {
        error: "format_check_failed",
        detail:
          "No stamp was written — the format checks are honest: fix " + failed.join("; and ") + ". Nothing was saved or scored.",
      },
      { status: 422 }
    );
  }

  const saved = await withStateLock(id, async () => {
    const state = await db.getStudentState(id);
    const declaration: PresenceDeclaration = {
      linkedinUrl,
      email,
      declaredAt: demoStamp(),
      stamp,
    };
    const next: typeof state = {
      ...state,
      // the zero-throw declaration overwrites the LATEST one (latest counts)
      presence: declaration,
      events: [
        ...state.events,
        {
          date: demoStamp(),
          kind: "presence-stamped" as const,
          detail: `Professional presence declared — machine-verified stamp (offline; LinkedIn ${linkedinUrl})`,
        },
      ],
    };
    await db.saveStudentState(id, next);
    return next.presence;
  });

  return NextResponse.json({
    declaration: saved,
    measured: presenceMeasured(saved),
    note: privateAccount
      ? `stamped ${stamp.verifiedAt} · private account: content not machine-verifiable — noted, not scored differently`
      : `stamped ${stamp.verifiedAt} · machine-verified offline — the stamp is what's presented, no network look-up ran`,
  });
}

/** GET — the signed-in student's current declaration (the page reads JSON too). */
export async function GET() {
  const id = await actingStudentId(undefined);
  if (!id) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  const state = await db.getStudentState(id);
  return NextResponse.json({ presence: state.presence ?? null, measured: presenceMeasured(state.presence) });
}
