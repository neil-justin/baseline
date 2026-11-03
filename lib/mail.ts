import nodemailer from "nodemailer";

/**
 * Approval notification sender (Google round, ADR 0006 + user email
 * decision 2026-11-03). ONE event emails: counselor ACCESS APPROVED.
 * The application-received moment is deliberately the /welcome pending
 * text, and rejection is deliberately silent.
 *
 * Best-effort by contract: SMTP health can NEVER gate the approval — the
 * row is already stamped approved/decided_by before this runs — so this
 * module answers a tri-value status instead of throwing, and the admin
 * surface tells the approving human when the notification didn't ride
 * (they tell the applicant by other means; the trail's truth is the row).
 * Credentials live in .env.local ONLY (never committed; repo rule: real
 * addresses/credentials never enter the repo).
 */
export interface MailEnv {
  host: string;
  port: number;
  user: string;
  pass: string;
  from: string;
}

export function senderEnv(): MailEnv | null {
  const host = process.env.MAIL_SMTP_HOST;
  const port = process.env.MAIL_SMTP_PORT;
  const user = process.env.MAIL_SMTP_USER;
  const pass = process.env.MAIL_SMTP_PASS;
  const from = process.env.MAIL_FROM;
  if (!host || !user || !pass || !from) return null;
  return { host, port: Number(port || 465), user, pass, from };
}

export type MailStatus = "sent" | "skipped_no_config" | "failed";

export function mailStatus(reason: "no_config" | "error"): MailStatus {
  return reason === "no_config" ? "skipped_no_config" : "failed";
}

export async function sendCounselorApproved(to: string, fullName: string): Promise<MailStatus> {
  const env = senderEnv();
  if (!env) return mailStatus("no_config");
  try {
    const transport = nodemailer.createTransport({
      host: env.host,
      port: env.port,
      secure: env.port === 465, // TLS-on-connect; other ports go STARTTLS per SMTP
      auth: { user: env.user, pass: env.pass },
    });
    await transport.sendMail({
      from: env.from,
      to,
      subject: "Baseline — your counselor access is approved",
      text:
        `${fullName},\n\nYour request for counselor access to Baseline was approved.\n` +
        `Sign in again with Google and the Admin console opens for you.\n\n` +
        `If this wasn't you, ignore this email — no reply is read at this address.`,
    });
    return "sent";
  } catch {
    return mailStatus("error");
  }
}
