import { NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabase/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * POST (and GET for the AppBar/AdminBar link) /api/auth/signout — ends the
 * Supabase session (clears the signed cookies) and lands on /signin.
 */
async function endSession(req: Request) {
  try {
    const supabase = await supabaseServer();
    await supabase.auth.signOut();
  } catch {
    // env missing / already signed out — still land on /signin
  }
  return NextResponse.redirect(new URL("/signin", req.url));
}

export async function POST(req: Request) {
  return endSession(req);
}

export async function GET(req: Request) {
  return endSession(req);
}
