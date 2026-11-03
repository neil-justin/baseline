"use client";

import { createBrowserClient } from "@supabase/ssr";

/**
 * "Continue with Google" — the browser-side OAuth kick-off (ADR 0006).
 * signInWithOAuth redirects the browser to Google's consent screen; the
 * session returns through /auth/confirm (PKCE — the same route recovery
 * links use), which hands to /auth/google for the dest decision. The
 * provider's keys live in the Supabase dashboard ONLY — nothing new in
 * package.json, nothing env-shaped beyond the public URL/anon key pair the
 * app already configures.
 */
export default function GoogleAuth() {
  async function signInWithGoogle() {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    if (!url || !anon) return; // no Supabase env — the button renders but must no-op honestly
    const supabase = createBrowserClient(url, anon);
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/auth/confirm?via=google&next=/auth/google`,
      },
    });
    // control leaves this page via full redirect — nothing after this runs
  }

  return (
    <>
      <p className="auth-or" aria-hidden="true">— or —</p>
      <button type="button" className="btn btn-block" onClick={signInWithGoogle}>
        Continue with Google
      </button>
    </>
  );
}
