"use client";

import { useState } from "react";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/** Forgot-password form (auth round 2) — posts to `/api/auth/forgot`, which
 * calls Supabase's `resetPasswordForEmail` with a redirectTo of the reset
 * route. The response is always ok for a well-formed email (existence is
 * never revealed), so the accepted state is the honest "check your inbox" —
 * the same message whether or not the account exists.
 * Error contract (the route's, mapped here): email_invalid | redirect_not_allowed
 * | rate_limited | server. */
export default function ForgotForm({ expired }: { expired: boolean }) {
  const [pending, setPending] = useState(false);
  const [emailErr, setEmailErr] = useState(false);
  const [sent, setSent] = useState(false);
  const [topErr, setTopErr] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    const form = e.currentTarget as HTMLFormElement;
    const email = (form.elements.namedItem("email") as HTMLInputElement).value.trim();

    setEmailErr(!EMAIL_RE.test(email));
    setTopErr(null);
    if (!EMAIL_RE.test(email)) return;

    setPending(true);
    try {
      const res = await fetch("/api/auth/forgot", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      if (res.ok) {
        setSent(true);
        return;
      }
      const data = await res.json().catch(() => null);
      if (data?.error === "email_invalid") setEmailErr(true);
      else if (data?.error === "rate_limited") setTopErr("rate_limited");
      else if (data?.error === "redirect_not_allowed") setTopErr("redirect_not_allowed");
      else setTopErr("server");
    } catch {
      setTopErr("server");
    } finally {
      setPending(false);
    }
  }

  if (sent) {
    return (
      <form id="forgot-form" noValidate onSubmit={(e) => e.preventDefault()}>
        <div className="field" style={{ marginTop: 0 }}>
          <p className="forgot-lead">
            If an account exists for that email, a reset link is on its way. It opens the
            reset page where you set a new password — the link works once.
          </p>
        </div>
        <p className="auth-note" style={{ display: "block" }}>
          No email? Check spam, or request another link in a minute.
        </p>
      </form>
    );
  }

  return (
    <form id="forgot-form" noValidate onSubmit={onSubmit}>
      {expired && (
        <div className="field-err" id="err-expired" role="alert" style={{ display: "block", marginTop: 0, marginBottom: 6 }}>
          That reset link has expired or was already used. Request a fresh one below.
        </div>
      )}
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
          That doesn&apos;t look like an email address. Check for a typo.
        </p>
      </div>

      <button type="submit" className="btn btn-primary btn-block" disabled={pending}>
        {pending ? "Sending the link…" : "Send the reset link"}
      </button>

      {topErr && (
        <div className="field-err" id="err-top" role="alert" style={{ display: "block", marginTop: 14 }}>
          {topErr === "rate_limited" ? (
            <>Too many reset emails in a row — wait a minute and try again.</>
          ) : topErr === "redirect_not_allowed" ? (
            <>The reset link couldn&apos;t be issued (link address not allow-listed). Ask the admin to fix the URL configuration.</>
          ) : (
            <>That didn&apos;t go through. Try once more in a minute.</>
          )}
        </div>
      )}
    </form>
  );
}
