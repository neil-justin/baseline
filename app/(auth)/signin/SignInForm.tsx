"use client";

import { useState } from "react";
import { ArrowRight, Eye, EyeOff } from "lucide-react";

/** Sign-in form — ported from prototype/signin.html, with the live credential POST
 * in place of the static prototype's always-failing submit. Posts to
 * `/api/auth/signin` with `{ email, password }`; the route is added in the
 * session task (lib/session.ts seeded accounts). One credential form — the
 * account's role lives in the session and decides the destination client-side
 * (via the route's {dest} — admin → /admin, student → dashboard/onboarding). */
export default function SignInForm() {
  const [showPw, setShowPw] = useState(false);
  const [pending, setPending] = useState(false);
  const [emailErr, setEmailErr] = useState(false);
  const [passErr, setPassErr] = useState(false);
  const [capsOn, setCapsOn] = useState(false);
  const [credsErr, setCredsErr] = useState<string | null>(null);

  // Caps-lock hint (auth round 2 polish): a small status line under the
  // password field while the modifier is engaged — never an error.
  // Detection covers the real toggling paths: keydown/keyup while the field
  // is focused, the state already engaged when the field GAINS focus
  // (UIEvent.getModifierState works on focus too), and a 120ms-debounced
  // blur reset so tabbing away doesn't flash the hint off/on.
  function trackCaps(e: React.FocusEvent<HTMLInputElement> | React.KeyboardEvent<HTMLInputElement>) {
    setCapsOn(
      "getModifierState" in e.nativeEvent ? e.nativeEvent.getModifierState("CapsLock") : false,
    );
  }

  function onPassBlur() {
    window.setTimeout(() => setCapsOn(false), 120);
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    const form = e.currentTarget as HTMLFormElement;
    const email = (form.elements.namedItem("email") as HTMLInputElement).value.trim();
    const password = (form.elements.namedItem("password") as HTMLInputElement).value;

    setEmailErr(!email);
    setPassErr(!password);
    setCredsErr(null);
    if (!email || !password) return;

    setPending(true);
    try {
      const res = await fetch("/api/auth/signin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      if (res.ok) {
        const data = await res.json().catch(() => ({}));
        const dest = data?.dest ?? "/dashboard";
        window.location.assign(dest);
        return;
      }
      const data = await res.json().catch(() => null);
      if (data?.error === "no_account") setCredsErr("no_account");
      else setCredsErr("mismatch");
    } catch {
      setCredsErr("mismatch");
    } finally {
      setPending(false);
    }
  }

  return (
    <form id="signin-form" noValidate onSubmit={onSubmit}>
      <div className="field" style={{ marginTop: 0 }}>
        <div className="field-label">
          <label htmlFor="f-email">Email</label>
        </div>
        <input
          type="email"
          id="f-email"
          name="email"
          autoComplete="email"
          aria-describedby="err-email"
          placeholder="you@example.com"
          aria-invalid={emailErr}
        />
        <p className="field-err" id="err-email" role="alert" style={{ display: emailErr ? "block" : undefined }}>
          Email goes here.
        </p>
      </div>

      <div className="field">
        <div className="field-label">
          <label htmlFor="f-pass">Password</label>
        </div>
        <div style={{ position: "relative" }}>
          <input
            type={showPw ? "text" : "password"}
            id="f-pass"
            name="password"
            autoComplete="current-password"
            aria-describedby="err-pass"
            placeholder="Your password"
            style={{ paddingRight: 64 }}
            aria-invalid={passErr}
            onKeyDown={trackCaps}
            onKeyUp={trackCaps}
            onFocus={trackCaps}
            onBlur={onPassBlur}
          />
          <button
            type="button"
            id="pass-toggle"
            aria-pressed={showPw}
            aria-label={showPw ? "Hide password" : "Show password"}
            style={{
              position: "absolute",
              right: 8,
              top: "50%",
              transform: "translateY(-50%)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "var(--ink-2)",
              padding: 10,
              margin: "0 -10px 0 0",
              borderRadius: 6,
            }}
            onClick={() => setShowPw((v) => !v)}
          >
            {showPw ? (
              <EyeOff size={16} strokeWidth={1.8} aria-hidden="true" />
            ) : (
              <Eye size={16} strokeWidth={1.8} aria-hidden="true" />
            )}
          </button>
        </div>
        {/* Caps hint (auth round 2 polish): rendered only while the modifier
            is engaged — never an error. The wrapper permanently reserves the
            hint's rendered height (12.5px font, ~1.5 line-height * 6px margin) so
            the layout never jumps in either direction. */}
        <div style={{ height: 25, overflow: "hidden" }} aria-hidden={!capsOn}>
          {capsOn && (
            <p className="caps-hint" role="status" style={{ margin: 0 }}>
              Caps Lock is on.
            </p>
          )}
        </div>
        <p className="field-err" id="err-pass" role="alert" style={{ display: passErr ? "block" : undefined }}>
          Password goes here.
        </p>
      </div>

      <button type="submit" className="btn btn-primary btn-block" disabled={pending}>
        {pending ? "Signing you in…" : "Sign in"}
      </button>

      <p className="forgot-link">
        <a href="/forgot">Forgot password?</a>
      </p>

      {credsErr && (
        <div className="field-err" id="err-creds" role="alert" style={{ display: "block", marginTop: 14 }}>
          {credsErr === "no_account" ? (
            <>
              No account for that email yet.{" "}
              <a href="/signup" style={{ textDecoration: "underline", textUnderlineOffset: 3 }}>
                Create one in 30 seconds{" "}
                <ArrowRight size={14} aria-hidden="true" />
              </a>
            </>
          ) : (
            <>
              That email and password don&apos;t match. Check both, or{" "}
              <a href="/signup" style={{ textDecoration: "underline", textUnderlineOffset: 3 }}>
                Create one in 30 seconds
              </a>
            </>
          )}
        </div>
      )}
    </form>
  );
}
