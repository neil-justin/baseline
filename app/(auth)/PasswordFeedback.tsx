"use client";

import "./password-feedback.css";

import { Check } from "lucide-react";

/**
 * Shared password feedback (auth round 2 — NIST SP 800-63B style, locked brief):
 * a live strength meter (weak/fair/strong) + a plain-language checklist that
 * ticks as the user types. Client-side UX ONLY — the authoritative policy is
 * server-side (Supabase Auth: min length 8 + leaked-password protection, a
 * dashboard toggle). The breach pre-check runs against a tiny built-in list of
 * the most common passwords so the honest tick can appear instantly; the
 * server's HaveIBeenPwned check is the real gate (signup/reset routes map it
 * to `password_breached`).
 *
 * No dependency — a minimal length-first heuristic (no forced composition
 * rules, per NIST): length drives the score, a small class-count bonus tops it.
 */

/** Tiny client pre-check list (top hits from public breach corpora). The
 * authoritative breached-password check is Supabase's HaveIBeenPwned toggle. */
const COMMON_PASSWORDS = new Set([
  "123456", "1234567", "12345678", "123456789", "1234567890", "112233", "121212",
  "abc123", "abc12345", "qwerty", "qwerty123", "qazwsx", "1q2w3e", "1q2w3e4r",
  "password", "password1", "password123", "passw0rd", "iloveyou", "letmein",
  "welcome", "welcome1", "admin", "admin123", "login", "monkey", "dragon",
  "sunshine", "princess", "football", "baseball", "superman", "batman",
  "starwars", "shadow", "master", "hello", "freedom", "whatever", "trustno1",
  "readiness", "career123", "aisat123",
]);

export type Strength = "blank" | "weak" | "fair" | "strong";

/** Length-first heuristic (client-only UX; see header comment). */
export function passwordStrength(pw: string): Strength {
  if (pw.length === 0) return "blank";
  const trimmed = pw.trim();
  const common = COMMON_PASSWORDS.has(pw.toLowerCase());
  if (pw.length < 8 || common || trimmed !== pw) return "weak";
  let classes = /[a-z]/.test(pw) ? 1 : 0;
  if (/[A-Z]/.test(pw)) classes += 1;
  if (/[0-9]/.test(pw)) classes += 1;
  if (/[^A-Za-z0-9]/.test(pw)) classes += 1;
  if (pw.length >= 12 && classes >= 2) return "strong";
  if (pw.length >= 10 && classes >= 3) return "strong";
  return "fair";
}

export const STRENGTH_LABEL: Record<Strength, string> = {
  blank: "",
  weak: "WEAK",
  fair: "FAIR",
  strong: "STRONG",
};

/** The checklist the form shows under the meter — plain language, no jargon. */
export type Checklist = { length: boolean; notCommon: boolean; noEdgeSpaces: boolean };

export function passwordChecklist(pw: string): Checklist {
  return {
    length: pw.length >= 8,
    notCommon: pw.length > 0 && !COMMON_PASSWORDS.has(pw.toLowerCase()),
    noEdgeSpaces: pw.length > 0 && pw === pw.trim(),
  };
}

const ITEMS: Array<{ key: keyof Checklist; label: string }> = [
  { key: "length", label: "At least 8 characters" },
  { key: "notCommon", label: "Not a common or breached password" },
  { key: "noEdgeSpaces", label: "No spaces at the start or end" },
];

/**
 * Meter + checklist under a password field. The slots are RESERVED: the
 * block renders OUTLINE-equal at first paint (unticked checklist, unfilled
 * meter) so the first keystroke never moves the layout downward (brief B.6
 * — the password CLS fix). The meter itself is aria-hidden; the checklist
 * keeps `id="pw-checklist"` mounted for aria-describedby consumers.
 */
export function PasswordFeedback({ password }: { password: string }) {
  const strength = passwordStrength(password);
  const checks = passwordChecklist(password);
  const filled = strength === "blank" ? 0 : strength === "weak" ? 1 : strength === "fair" ? 2 : 3;
  return (
    <div className="pw-feedback" data-strength={strength} data-empty={strength === "blank" ? "true" : undefined}>
      <div className="pw-meter" aria-hidden="true">
        {[0, 1, 2].map((i) => (
          <span key={i} className="pw-seg" style={{ opacity: i < filled ? 1 : 0.18 }} />
        ))}
        <span className="pw-word">{STRENGTH_LABEL[strength]}</span>
      </div>
      <ul className="pw-checklist" id="pw-checklist">
        {ITEMS.map(({ key, label }) => (
          <li key={key} className={checks[key] ? "pw-ok" : undefined}>
            <span aria-hidden="true">{checks[key] ? <Check size={12} /> : "—"}</span> {label}
          </li>
        ))}
      </ul>
    </div>
  );
}
