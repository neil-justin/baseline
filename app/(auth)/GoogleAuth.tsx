"use client";

import { createBrowserClient } from "@supabase/ssr";

/**
 * "Continue with Google" — the browser-side OAuth kick-off (ADR 0006).
 * signInWithOAuth redirects the browser to Google's consent screen; the
 * session returns through /auth/confirm (PKCE — the same route recovery
 * links use), which hands to /auth/google for the dest decision. The
 * provider's keys live in the Supabase dashboard ONLY — nothing new in
 * package.json, nothing env-shaped beyond the public URL/anon key pair the
 * app already configures. NEXT_PUBLIC_* values are build-time-inlined, so
 * an unconfigured build renders the button disabled with an honest title
 * instead of swallowing clicks.
 */
export default function GoogleAuth() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  const ready = Boolean(url && anon);

  async function signInWithGoogle() {
    if (!url || !anon) return;
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
      <button
        type="button"
        className="btn btn-block btn-google"
        disabled={!ready}
        title={ready ? undefined : "Google sign-in isn't configured in this deployment."}
        onClick={signInWithGoogle}
      >
        {/* the four-color "G" mark — Google's official 18×18 paths, inline SVG
            (no assets, no dependencies); hover/label colors follow the brand
            spec (white surface, #dadce0 stroke, #3c4043 text) via .btn-google */}
        <svg width="18" height="18" viewBox="0 0 18 18" aria-hidden="true" focusable="false">
          <path fill="#4285F4" d="M17.64 9.2045c0-.6381-.0573-1.2518-.1636-1.8409H9v3.4814h4.8436c-.2086 1.125-.8427 2.0782-1.7959 2.7164v2.2581h2.9087c1.7018-1.5668 2.6836-3.874 2.6836-6.615z" />
          <path fill="#34A853" d="M9 18c2.43 0 4.4673-.806 5.9564-2.1805l-2.9087-2.2581c-.8059.54-1.8368.859-3.0477.859-2.344 0-4.3282-1.5831-5.036-3.7104H.9574v2.3318C2.4382 15.9832 5.4818 18 9 18z" />
          <path fill="#FBBC04" d="M3.964 10.71c-.18-.54-.2822-1.1168-.2822-1.71s.1023-1.17.2823-1.71V4.9582H.9573A8.9965 8.9965 0 0 0 0 9c0 1.4523.3477 2.8263.9573 4.0418L3.964 10.71z" />
          <path fill="#EA4335" d="M9 3.5795c1.3214 0 2.5077.4541 3.4405 1.346l2.5813-2.5813C13.4632.8918 11.4259 0 9 0 5.4818 0 2.4382 2.0168.9573 4.9582L3.964 7.29C4.6718 5.1627 6.6559 3.5795 9 3.5795z" />
        </svg>
        Continue with Google
      </button>
    </>
  );
}
