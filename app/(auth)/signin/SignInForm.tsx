"use client";

import { useEffect, useState } from "react";
import { BackArrow } from "../glyphs";

/** Sign-in form — ported from prototype/signin.html, with the live credential POST
 * in place of the static prototype's always-failing submit. Posts to
 * `/api/auth/signin` with `{ email, password, role }`; the route is added in the
 * session task (lib/session.ts seeded accounts). */
export default function SignInForm() {
  const [role, setRole] = useState<"student" | "admin">("student");
  const [showPw, setShowPw] = useState(false);
  const [pending, setPending] = useState(false);
  const [emailErr, setEmailErr] = useState(false);
  const [passErr, setPassErr] = useState(false);
  const [credsErr, setCredsErr] = useState<string | null>(null);

  // Remembers the role of the last successful sign-in on this device (content plan §10).
  useEffect(() => {
    try {
      const last = window.localStorage.getItem("signin:lastRole");
      if (last === "student" || last === "admin") setRole(last);
    } catch {
      /* private mode — default Student */
    }
  }, []);

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
        body: JSON.stringify({ email, password, role }),
      });
      if (res.ok) {
        const data = await res.json().catch(() => ({}));
        try {
          window.localStorage.setItem("signin:lastRole", role);
        } catch {
          /* ignore */
        }
        const dest =
          data?.dest ?? (role === "admin" ? "/admin" : "/onboarding");
        window.location.assign(dest);
        return;
      }
      const data = await res.json().catch(() => null);
      if (data?.error === "no_account") setCredsErr("no_account");
      else if (data?.error === "wrong_role") setCredsErr("wrong_role");
      else setCredsErr("mismatch");
    } catch {
      setCredsErr("mismatch");
    } finally {
      setPending(false);
    }
  }

  return (
    <form id="signin-form" noValidate onSubmit={onSubmit}>
      <div className="rolewise" role="group" aria-label="Account type">
        <button type="button" aria-pressed={role === "student"} onClick={() => setRole("student")}>
          Student
        </button>
        <button type="button" aria-pressed={role === "admin"} onClick={() => setRole("admin")}>
          Admin
        </button>
      </div>

      <div className="field" style={{ marginTop: 6 }}>
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
          />
          <button
            type="button"
            id="pass-toggle"
            aria-pressed={showPw}
            style={{
              position: "absolute",
              right: 8,
              top: "50%",
              transform: "translateY(-50%)",
              fontFamily: "var(--mono)",
              fontSize: 11,
              letterSpacing: "0.04em",
              color: "var(--ink-2)",
              padding: "6px 8px",
            }}
            onClick={() => setShowPw((v) => !v)}
          >
            {showPw ? "HIDE" : "SHOW"}
          </button>
        </div>
        <p className="field-err" id="err-pass" role="alert" style={{ display: passErr ? "block" : undefined }}>
          Password goes here.
        </p>
      </div>

      <button type="submit" className="btn btn-primary btn-block" disabled={pending}>
        {pending ? "Signing you in…" : "Sign in"}
      </button>

      {credsErr && (
        <div className="field-err" id="err-creds" role="alert" style={{ display: "block", marginTop: 14 }}>
          {credsErr === "no_account" ? (
            <>
              No account for that email yet.{" "}
              <a href="/signup" style={{ textDecoration: "underline", textUnderlineOffset: 3 }}>
                Create one in 30 seconds →
              </a>
            </>
          ) : credsErr === "wrong_role" ? (
            <>That&apos;s an admin account — switch the toggle above and retry.</>
          ) : (
            <>
              That email and password don&apos;t match. Check both, or →{" "}
              <a href="/signup" style={{ textDecoration: "underline", textUnderlineOffset: 3 }}>
                Start check <BackArrow />
              </a>
            </>
          )}
        </div>
      )}
    </form>
  );
}
