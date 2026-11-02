import { NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabase/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * POST /api/auth/signout — ends the Supabase session (clears the signed
 * cookies) and lands on /signin. The AdminBar sign-out is a form POST
 * (a GET link gets RSC-prefetched, which would end the session on a
 * mere page visit — e2e-caught; this also applied to the v7.2 student
 * top bar's sign-out before the v7.3 sidebar round retired it).
 */
async function endSession(req: Request) {
  try {
    const supabase = await supabaseServer();
    await supabase.auth.signOut();
  } catch {
    // env missing / already signed out — still land on /signin
  }
  // 303: a form POST must land on /signin as a GET (307 would re-POST)
  return NextResponse.redirect(new URL("/signin", req.url), 303);
}

export async function POST(req: Request) {
  return endSession(req);
}
