"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { createPortal } from "react-dom";
import { X } from "lucide-react";

/**
 * Profile → Credentials — the declared-entry flow for the three counselor-
 * audited kinds: certification · internship/job · personal projects & org
 * roles. (The FOURTH kind — professional presence — declares through
 * PresenceCard's machine-verified stamp and never rides this form.)
 *
 * The rows ride the unified ledger's Dashboard-register `.lrow` unit (icon
 * slot · plain name · chip pushed right · 11px provenance lines); the
 * status chips carry NO date — the date rides the provenance line (the
 * VERIFIED row's "verified by X · date" lsub carries it). The NEEDS CHECK
 * chip rides the honest grey hatch (family law — never red).
 *
 * The entry form is a CENTERED MODAL (2026-11-03 validated revamp — the
 * inline anchored form is superseded): the "Declare a credential" button
 * stays mounted with honest aria-expanded, the modal copies /career's
 * switch-modal recipe (fixed wrapper, scrim + dialog siblings, scrim fades
 * while the dialog rises in, Esc/scrim close, reduced-motion skips the
 * animation), `data-cred-form` rides the dialog, the title input focuses
 * on open. Fields validate client-side (title required · organization
 * required for internships · evidence URL must read as a URL · end date
 * can't precede the start · skills capped at 12); errors render inline
 * under each field and clear on edit; the server's `detail` errors still
 * surface in the status line.
 *
 * Lifecycle (locked, profile-college-scope.md), enforced honest on the rows:
 *   declared (pending the counselor audit — "Needs check") → the student
 *   edits/deletes freely while declared · verified → READ-ONLY (the audit
 *   decision is a shared record) · rejected → the REJECT-with-reason note
 *   renders verbatim and the row revises + resubmits (status returns to
 *   declared, the note rides along).
 *
 * Declared skills come from the framework vocabulary — the picker checkboxes
 * list the target career's skill map (server validates against every
 * catalog role's names, so cross-track picks stay honest). Nothing scores
 * here: verified closes gaps; declared waits, never painted.
 */

export interface DeclaredRow {
  id: string;
  kind: "certification" | "internship" | "project";
  title: string;
  organization: string | null;
  startedOn: string | null;
  endedOn: string | null;
  evidenceUrl: string | null;
  evidenceNote: string | null;
  declaredSkills: string[];
  status: "declared" | "verified" | "rejected";
  verifiedBy: string | null;
  verifiedAt: string | null;
  auditNote: string | null;
  createdAt: string;
  degraded?: boolean;
}

const KIND_OPTIONS = [
  { id: "certification", label: "Certification", org: "Crediting body / issuer", orgRequired: false },
  { id: "internship", label: "Internship or job", org: "Employer (required)", orgRequired: true },
  { id: "project", label: "Personal project or org role", org: "Organization", orgRequired: false },
] as const;

/** the ONE audit-rules helper line */
const SKILL_NOTE =
  "The audit rules your declared skills — verified entries close gaps like platform completions.";

/* the required-field marker — red asterisk on required labels, absent on
   optional ones */
function Req() {
  return (
    <span className="req" aria-hidden="true">
      *
    </span>
  );
}

const fmtDate = (iso: string | null) => {
  if (!iso) return "";
  const m = iso.match(/^\d{4}-\d{2}-\d{2}/);
  if (!m) return iso;
  const [, y, mo, d] = m;
  const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  return `${Number(d)} ${MONTHS[Number(mo) - 1]} ${Number(y)}`;
};

const fmtStamp = (iso: string | null) => {
  if (!iso) return "";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return `${fmtDate(iso.slice(0, 4) + "-" + String(d.getMonth() + 1).padStart(2, "0") + "-" + String(d.getDate()).padStart(2, "0"))}`;
};

interface Props {
  rows: DeclaredRow[];
  /** the target career's framework skill vocabulary (the picker's list) */
  skillVocabulary: string[];
  persistence?: string | null;
}

type Errors = Partial<Record<"title" | "organization" | "evidenceUrl" | "dates", string>>;

export default function DeclaredCredentials({ rows, skillVocabulary, persistence }: Props) {
  const router = useRouter();
  const [edit, setEdit] = useState<DeclaredRow | null>(null);
  const [open, setOpen] = useState(false); // the entry modal's open state
  const [kind, setKind] = useState<(typeof KIND_OPTIONS)[number]["id"]>("certification");
  const [title, setTitle] = useState("");
  const [organization, setOrganization] = useState("");
  const [startedOn, setStartedOn] = useState("");
  const [endedOn, setEndedOn] = useState("");
  const [evidenceUrl, setEvidenceUrl] = useState("");
  const [evidenceNote, setEvidenceNote] = useState("");
  const [skills, setSkills] = useState<string[]>([]);
  const [errors, setErrors] = useState<Errors>({});
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const [note, setNote] = useState<string | null>(null);
  const [armedDelete, setArmedDelete] = useState<string | null>(null); // two-step delete
  const [revoking, setRevoking] = useState<string | null>(null); // which row opened the form

  const kindMeta = KIND_OPTIONS.find((k) => k.id === kind)!;
  const titleRef = useRef<HTMLInputElement>(null);

  /* PORTAL HOST — the blink fix (2026-11-04, root-caused against the
     reproduced probe): the authed profile render sits the modal inside a
     `.card`, and the card's v9 lift rule carries a transform transition —
     a transformed ancestor steals `position: fixed`'s containing block,
     and Chromium ping-pongs the dialog between card-relative and viewport
     geometry at frame rate (the reported "blinking"). Portaling the modal
     to the page root (`.v7profile` — OUTSIDE the card subtree, INSIDE the
     `--v-*` token chain) resolves it against the viewport for good. CSS
     scopes stay intact: the portal keeps the same ancestor class.
     Focus rides modalHost resolution — a single [open] effect raced the
     portal paint and focus fell through to the footer buttons. */
  const [modalHost, setModalHost] = useState<HTMLElement | null>(null);
  useEffect(() => {
    if (!open) return;
    setModalHost(document.querySelector<HTMLElement>(".v7profile") ?? document.body);
    return () => setModalHost(null);
  }, [open]);
  useEffect(() => {
    if (!open || !modalHost) return;
    titleRef.current?.focus();
  }, [open, modalHost]);

  function startEdit(row: DeclaredRow) {
    setEdit(row);
    setOpen(true);
    setNote(null);
    setErr(null);
    setErrors({});
    setKind(row.kind);
    setTitle(row.title);
    setOrganization(row.organization ?? "");
    setStartedOn(row.startedOn ?? "");
    setEndedOn(row.endedOn ?? "");
    setEvidenceUrl(row.evidenceUrl ?? "");
    setEvidenceNote(row.evidenceNote ?? "");
    setSkills(row.declaredSkills ?? []);
    setRevoking(row.status === "rejected" ? row.id : null);
  }

  function startDeclare() {
    setEdit(null);
    setOpen(true);
    setErr(null);
    setNote(null);
    setErrors({});
    setKind("certification");
    setTitle("");
    setOrganization("");
    setStartedOn("");
    setEndedOn("");
    setEvidenceUrl("");
    setEvidenceNote("");
    setSkills([]);
    setRevoking(null);
  }

  function closeModal() {
    setOpen(false);
    setEdit(null);
    setErr(null);
    setErrors({});
  }

  function toggleSkill(s: string) {
    setSkills((prev) => (prev.includes(s) ? prev.filter((x) => x !== s) : prev.length < 12 ? [...prev, s] : prev));
  }

  function validate(): Errors {
    const e: Errors = {};
    if (title.trim() === "") e.title = "The title is required — what was earned or done.";
    if (kindMeta.orgRequired && organization.trim() === "")
      e.organization = "The employer is required for an internship or job.";
    if (evidenceUrl.trim() !== "" && !/^https?:\/\/\S+\.\S+/i.test(evidenceUrl.trim()))
      e.evidenceUrl = "That doesn't read as a URL — it should start with http(s):// and name a host.";
    if (startedOn && endedOn && endedOn < startedOn) e.dates = "The end date precedes the start date.";
    return e;
  }

  async function submit() {
    const e = validate();
    setErrors(e);
    if (Object.keys(e).length > 0) return;
    setErr(null);
    setBusy(true);
    try {
      const editing = Boolean(edit);
      const res = await fetch(editing ? `/api/credentials/${edit!.id}` : "/api/credentials", {
        method: editing ? "PATCH" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          kind,
          title: title.trim(),
          organization: organization.trim() || null,
          startedOn: startedOn || null,
          endedOn: endedOn || null,
          evidenceUrl: evidenceUrl.trim() || null,
          evidenceNote: evidenceNote.trim() || null,
          declaredSkills: skills,
        }),
      });
      const json = (await res.json().catch(() => null)) as { note?: string; detail?: string } | null;
      if (res.ok) {
        router.refresh(); // server truth re-renders the row (the store's read is server-side)
      } else {
        setErr(json?.detail ?? "The declaration was rejected — fix the named line and try again. Nothing was saved.");
      }
      void editing;
    } catch {
      setErr("The declaration failed — check the connection and try again. Nothing was saved.");
    } finally {
      setBusy(false);
    }
  }

  async function remove(row: DeclaredRow) {
    if (armedDelete !== row.id) {
      setArmedDelete(row.id); // two-step: the first click arms the honest confirm
      return;
    }
    setBusy(true);
    try {
      const res = await fetch(`/api/credentials/${row.id}`, { method: "DELETE" });
      if (res.ok) {
        router.refresh();
      } else {
        const json = (await res.json().catch(() => null)) as { detail?: string } | null;
        setErr(json?.detail ?? "The delete didn't complete — the row is untouched; try again.");
        setBusy(false);
      }
    } catch {
      setErr("The delete didn't complete — the row is untouched; try again.");
      setBusy(false);
    }
  }

  const sorted = useMemo(
    () =>
      [...rows].sort((a, b) => {
        const rank = (s: DeclaredRow["status"]) => (s === "declared" ? 0 : s === "rejected" ? 1 : 2);
        return rank(a.status) - rank(b.status) || a.createdAt.localeCompare(b.createdAt);
      }),
    [rows]
  );

  const statusMsg = err ?? note ?? (revoking ? "Submit the revision and it re-enters the audit queue." : "");

  return (
    <div className="dec-block">
      <div className="lrows">
        {sorted.map((row) => {
          const kindLabel = KIND_OPTIONS.find((k) => k.id === row.kind)?.label ?? row.kind;
          const dateRange =
            row.startedOn || row.endedOn
              ? `${row.startedOn ? fmtDate(row.startedOn) : "…"}${row.endedOn ? ` – ${fmtDate(row.endedOn)}` : ""}`
              : "";
          const skillLine = row.declaredSkills.length
            ? `declared skills: ${row.declaredSkills.join(", ")}`
            : "no skills declared with this entry";
          return (
            <div className={`lrow dec-row dec-${row.status}`} key={row.id} data-cred-row>
              <span className={`ms${row.status === "verified" ? " done" : ""}`} aria-hidden="true">
                {row.status === "verified" ? "verified" : row.status === "declared" ? "schedule" : "block"}
              </span>
              <b>{row.title}</b>
              {row.status === "declared" && <span className="chip c-grey hatch-chip">NEEDS CHECK</span>}
              {row.status === "verified" && <span className="chip c-green">VERIFIED</span>}
              {row.status === "rejected" && <span className="chip c-grey">NOT ACCEPTED</span>}
              <span className="lsub num">
                {kindLabel}
                {row.organization ? ` — ${row.organization}` : ""}
                {dateRange ? ` — ${dateRange}` : ""}
              </span>
              <span className="lsub">
                evidence:{" "}
                {row.evidenceUrl ? (
                  <a href={row.evidenceUrl} className="ev-link" target="_blank" rel="noopener noreferrer">
                    {row.evidenceUrl}
                  </a>
                ) : (
                  row.evidenceNote || "none attached"
                )}
                {", "}
                {skillLine}
              </span>
              {row.status === "rejected" && row.auditNote && (
                <span className="lsub rej-note num">the audit&apos;s note: “{row.auditNote}”</span>
              )}
              {row.status === "verified" && (
                <span className="lsub num">
                  verified{row.verifiedBy ? ` by ${row.verifiedBy}` : ""}
                  {row.verifiedAt ? `, ${fmtStamp(row.verifiedAt)}` : ""} — the audit decision is a shared record; the
                  entry reads only.
                </span>
              )}
              {row.status === "declared" && (
                <span className="lsub lacts">
                  <button className="rowbtn" type="button" onClick={() => startEdit(row)} disabled={busy}>
                    Edit while declared
                  </button>
                  <button
                    className={`rowbtn${armedDelete === row.id ? " armed" : ""}`}
                    type="button"
                    onClick={() => remove(row)}
                    disabled={busy}
                  >
                    {armedDelete === row.id ? "Confirm delete" : "Delete"}
                  </button>
                </span>
              )}
              {row.status === "rejected" && (
                <span className="lsub lacts">
                  <button className="rowbtn" type="button" onClick={() => startEdit(row)} disabled={busy}>
                    Revise and resubmit
                  </button>
                  <button
                    className={`rowbtn${armedDelete === row.id ? " armed" : ""}`}
                    type="button"
                    onClick={() => remove(row)}
                    disabled={busy}
                  >
                    {armedDelete === row.id ? "Confirm delete" : "Delete"}
                  </button>
                </span>
              )}
            </div>
          );
        })}
      </div>

      {/* the declare button — stays mounted while the modal is open, honest
          aria-expanded; the modal it spawns is the entry form */}
      <p className="dec-entryline">
        <button
          className="btn btn-ghost btn-sm"
          type="button"
          aria-expanded={open}
          onClick={startDeclare}
          disabled={busy}
        >
          Declare a credential
        </button>
      </p>

      {open && modalHost && (
        /* the centered modal — the /career switch-modal recipe: fixed
           wrapper, scrim + dialog siblings, the scrim fades while the
           dialog rises in from 97%, Esc/scrim close, reduced-motion skips
           the animation. PORTALED (2026-11-04 blink fix, see the host
           hook above). */
        createPortal(
          <div className="dec-modal" role="dialog" aria-modal="true" aria-label="Declare a credential">
            <div className="dec-scrim" onClick={closeModal} />
            <div
              className="dec-dialog"
              data-cred-form
              tabIndex={-1}
              onKeyDown={(e) => e.key === "Escape" && closeModal()}
            >
              <div className="dec-formtop">
                <p className="cl-label num">
                  {edit ? (revoking ? "Revise the not-accepted entry" : "Edit the declared entry") : "Declare a credential"}
                </p>
                <button
                  className="dec-x"
                  type="button"
                  onClick={closeModal}
                  aria-label="Close"
                  title="Close"
                  disabled={busy}
                >
                  <X size={14} aria-hidden="true" />
                </button>
              </div>
              <div className="dec-kind" role="group" aria-label="Credential kind">
                {KIND_OPTIONS.map((k) => (
                  <button
                    key={k.id}
                    type="button"
                    className={`dec-kindbtn${kind === k.id ? " on" : ""}`}
                    aria-pressed={kind === k.id}
                    onClick={() => {
                      setKind(k.id);
                      setErrors((prev) => ({ ...prev, organization: undefined }));
                    }}
                    disabled={busy}
                  >
                    {k.label}
                  </button>
                ))}
              </div>
              <div className="dec-grid">
                <div className="dec-field">
                  <label className="cl-label num" htmlFor="c-title">
                    {kind === "internship" ? "Role / position" : "Title"} <Req />
                  </label>
                  <input
                    id="c-title"
                    ref={titleRef}
                    type="text"
                    className="profile-input"
                    placeholder={kind === "internship" ? "e.g., Intern, Data team" : kind === "certification" ? "e.g., Google Data Analytics" : "e.g., Student council secretary"}
                    value={title}
                    onChange={(e) => {
                      setTitle(e.target.value);
                      setErrors((prev) => ({ ...prev, title: undefined }));
                    }}
                    maxLength={120}
                  />
                  {errors.title && (
                    <p className="field-err" role="alert">
                      {errors.title}
                    </p>
                  )}
                </div>
                <div className="dec-field">
                  <label className="cl-label num" htmlFor="c-org">
                    {kindMeta.org} {kindMeta.orgRequired && <Req />}
                  </label>
                  <input
                    id="c-org"
                    type="text"
                    className="profile-input"
                    placeholder={kind === "internship" ? "the employer" : "who issued it or where it happened"}
                    value={organization}
                    onChange={(e) => {
                      setOrganization(e.target.value);
                      setErrors((prev) => ({ ...prev, organization: undefined }));
                    }}
                    maxLength={120}
                  />
                  {errors.organization && (
                    <p className="field-err" role="alert">
                      {errors.organization}
                    </p>
                  )}
                </div>
              </div>
              <div className="dec-grid dec-grid-3">
                <div className="dec-field">
                  <label className="cl-label num" htmlFor="c-start">
                    Start (optional)
                  </label>
                  <input
                    id="c-start"
                    type="date"
                    className="profile-input"
                    value={startedOn}
                    onChange={(e) => {
                      setStartedOn(e.target.value);
                      setErrors((prev) => ({ ...prev, dates: undefined }));
                    }}
                  />
                </div>
                <div className="dec-field">
                  <label className="cl-label num" htmlFor="c-end">
                    End (optional)
                  </label>
                  <input
                    id="c-end"
                    type="date"
                    className="profile-input"
                    value={endedOn}
                    onChange={(e) => {
                      setEndedOn(e.target.value);
                      setErrors((prev) => ({ ...prev, dates: undefined }));
                    }}
                  />
                </div>
              </div>
              {errors.dates && (
                <p className="field-err" role="alert">
                  {errors.dates}
                </p>
              )}
              <div className="dec-field">
                <label className="cl-label num" htmlFor="c-ev">
                  Evidence — link or file URL
                </label>
                <input
                  id="c-ev"
                  type="url"
                  className="profile-input"
                  placeholder="https://… — the audit opens this when it rules"
                  value={evidenceUrl}
                  onChange={(e) => {
                    setEvidenceUrl(e.target.value);
                    setErrors((prev) => ({ ...prev, evidenceUrl: undefined }));
                  }}
                />
                {errors.evidenceUrl && (
                  <p className="field-err" role="alert">
                    {errors.evidenceUrl}
                  </p>
                )}
              </div>
              <div className="dec-field">
                <label className="cl-label num" htmlFor="c-evnote">
                  Evidence note (optional) — what the link or file shows
                </label>
                <input
                  id="c-evnote"
                  type="text"
                  className="profile-input"
                  placeholder="e.g., certificate of completion, PDF upload link"
                  value={evidenceNote}
                  onChange={(e) => setEvidenceNote(e.target.value)}
                  maxLength={300}
                />
              </div>
              <div className="dec-field">
                <p className="cl-label num">Declared skills — from the framework vocabulary</p>
                <div className="dec-skills" role="group" aria-label="Declared skills picker">
                  {skillVocabulary.map((s) => (
                    <label key={s} className={`dec-skill${skills.includes(s) ? " on" : ""}`}>
                      <input type="checkbox" checked={skills.includes(s)} onChange={() => toggleSkill(s)} />
                      <span>{s}</span>
                    </label>
                  ))}
                </div>
                <p className="dec-skillnote num">{SKILL_NOTE}</p>
              </div>
              {statusMsg && (
                <p className={err ? "presence-err" : "presence-ok"} role="status" aria-live="polite">
                  {statusMsg}
                </p>
              )}
              {/* actions — user Option A (2026-11-04): quiet Cancel on the
                  left, the primary on the right (flex-end owns the row) */}
              <div className="dec-ctas">
                <button className="btn btn-ghost btn-sm" type="button" onClick={closeModal} disabled={busy}>
                  Cancel
                </button>
                <button className="btn btn-primary btn-sm" type="button" onClick={submit} disabled={busy}>
                  {busy ? "Saving…" : revoking ? "Resubmit for the audit" : edit ? "Save the declaration" : "Declare it"}
                </button>
              </div>
            </div>
          </div>,
          modalHost
        )
      )}
      {persistence && <p className="lcap num">{persistence}</p>}
    </div>
  );
}
