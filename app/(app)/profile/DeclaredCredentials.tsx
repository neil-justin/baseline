"use client";

import { useMemo, useState } from "react";

/**
 * Profile → Credentials — the Round-7 declared-entry flow for the three
 * counselor-audited kinds (certification · internship/job · personal
 * projects & org roles; the FOURTH kind — professional presence — declares
 * through PresenceCard's machine-verified stamp and never rides this form).
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
  { id: "certification", label: "Certification", org: "Crediting body / issuer" },
  { id: "internship", label: "Internship or job", org: "Employer (required)" },
  { id: "project", label: "Personal project or org role", org: "Organization" },
] as const;

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

export default function DeclaredCredentials({ rows, skillVocabulary, persistence }: Props) {
  const [edit, setEdit] = useState<DeclaredRow | null>(null);
  const [open, setOpen] = useState(false); // the entry form's open state
  const [kind, setKind] = useState<(typeof KIND_OPTIONS)[number]["id"]>("certification");
  const [title, setTitle] = useState("");
  const [organization, setOrganization] = useState("");
  const [startedOn, setStartedOn] = useState("");
  const [endedOn, setEndedOn] = useState("");
  const [evidenceUrl, setEvidenceUrl] = useState("");
  const [evidenceNote, setEvidenceNote] = useState("");
  const [skills, setSkills] = useState<string[]>([]);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const [note, setNote] = useState<string | null>(null);
  const [armedDelete, setArmedDelete] = useState<string | null>(null); // two-step delete
  const [revoking, setRevoking] = useState<string | null>(null); // which row opened the form

  const kindMeta = KIND_OPTIONS.find((k) => k.id === kind)!;

  function startEdit(row: DeclaredRow) {
    setEdit(row);
    setOpen(true);
    setNote(null);
    setErr(null);
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

  function closeForm() {
    setOpen(false);
    setEdit(null);
    setErr(null);
  }

  function toggleSkill(s: string) {
    setSkills((prev) => (prev.includes(s) ? prev.filter((x) => x !== s) : prev.length < 12 ? [...prev, s] : prev));
  }

  async function submit() {
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
        window.location.reload(); // server truth re-renders the row (the store's read is server-side)
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
        window.location.reload();
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

  return (
    <div className="dec-block">
      <div className="prow-list">
        {sorted.map((row) => {
          const kindLabel = KIND_OPTIONS.find((k) => k.id === row.kind)?.label ?? row.kind;
          const dateRange =
            row.startedOn || row.endedOn
              ? `${row.startedOn ? fmtDate(row.startedOn) : "…"}${row.endedOn ? ` – ${fmtDate(row.endedOn)}` : ""}`
              : "";
          const skillLine = row.declaredSkills.length
            ? `declared skills: ${row.declaredSkills.join(" · ")}`
            : "no skills declared with this entry";
          return (
            <div className={`prow dec-row dec-${row.status}`} key={row.id} data-cred-row>
              <span className="p-name">{row.title}</span>
              {row.status === "declared" && <span className="p-badge chip c-amber">NEEDS CHECK</span>}
              {row.status === "verified" && (
                <span className="p-badge chip c-green">
                  VERIFIED{row.verifiedAt ? ` · ${fmtStamp(row.verifiedAt).toUpperCase()}` : ""}
                </span>
              )}
              {row.status === "rejected" && <span className="p-badge chip c-grey">NOT ACCEPTED</span>}
              <span className="p-sub">
                {kindLabel}
                {row.organization ? ` — ${row.organization}` : ""}
                {dateRange ? ` · ${dateRange}` : ""}
              </span>
              <span className="p-sub">
                evidence: {row.evidenceUrl ? <a href={row.evidenceUrl} className="ev-link">{row.evidenceUrl}</a> : row.evidenceNote || "none attached"} ·{" "}
                {skillLine}
              </span>
              {row.status === "rejected" && row.auditNote && (
                <span className="p-sub rej-note num">the audit&apos;s note: “{row.auditNote}”</span>
              )}
              {row.status === "declared" && (
                <span className="p-sub dec-acts">
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
                <span className="p-sub dec-acts">
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
              {row.status === "verified" && (
                <span className="p-sub">
                  verified{row.verifiedBy ? ` by ${row.verifiedBy}` : ""}
                  {row.verifiedAt ? ` · ${fmtStamp(row.verifiedAt)}` : ""} — the audit decision is a shared record; the entry reads
                  only.
                </span>
              )}
            </div>
          );
        })}
      </div>

      {!open && (
        <p className="dec-entryline">
          <button className="btn btn-ghost btn-sm" type="button" onClick={startDeclare}>
            Declare a credential
          </button>
          <span className="presence-earn num">declared → the counselor audit rules Verified · Needs check stays honest until then</span>
        </p>
      )}

      {open && (
        <div className="dec-form" data-cred-form>
          <p className="cl-label num">{edit ? (revoking ? "Revise the not-accepted entry" : "Edit the declared entry") : "Declare a credential"}</p>
          <div className="dec-kind" role="group" aria-label="Credential kind">
            {KIND_OPTIONS.map((k) => (
              <button
                key={k.id}
                type="button"
                className={`dec-kindbtn${kind === k.id ? " on" : ""}`}
                aria-pressed={kind === k.id}
                onClick={() => setKind(k.id)}
                disabled={busy}
              >
                {k.label}
              </button>
            ))}
          </div>
          <div className="dec-grid">
            <div className="dec-field">
              <label className="cl-label num" htmlFor="c-title">
                {kind === "internship" ? "Role / position" : "Title"}
              </label>
              <input
                id="c-title"
                type="text"
                className="profile-input"
                placeholder={kind === "internship" ? "e.g., Intern, Data team" : kind === "certification" ? "e.g., Google Data Analytics" : "e.g., Student council secretary"}
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                maxLength={120}
              />
            </div>
            <div className="dec-field">
              <label className="cl-label num" htmlFor="c-org">
                {kindMeta.org}
              </label>
              <input
                id="c-org"
                type="text"
                className="profile-input"
                placeholder={kind === "internship" ? "the employer" : "who issued it or where it happened"}
                value={organization}
                onChange={(e) => setOrganization(e.target.value)}
                maxLength={120}
              />
            </div>
          </div>
          <div className="dec-grid dec-grid-3">
            <div className="dec-field">
              <label className="cl-label num" htmlFor="c-start">
                Start (optional)
              </label>
              <input id="c-start" type="date" className="profile-input" value={startedOn} onChange={(e) => setStartedOn(e.target.value)} />
            </div>
            <div className="dec-field">
              <label className="cl-label num" htmlFor="c-end">
                End (optional)
              </label>
              <input id="c-end" type="date" className="profile-input" value={endedOn} onChange={(e) => setEndedOn(e.target.value)} />
            </div>
          </div>
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
              onChange={(e) => setEvidenceUrl(e.target.value)}
            />
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
            <p className="dec-skillnote num">
              Verified credentials close gaps like platform completions; what you declare here stays honest — the audit rules the skills when it rules the
              evidence.
            </p>
          </div>
          <p className={`${err ? "presence-err" : "presence-ok"}`} role="status" aria-live="polite">
            {err ?? (note ?? (revoking ? "The audit's note stays on the record — submit the revision and it re-enters the queue." : "Declaring adds the row as “declared” — the counselor audit rules it next."))}
          </p>
          <div className="dec-ctas">
            <button className="btn btn-ghost btn-sm" onClick={submit} disabled={busy || title.trim() === ""}>
              {busy ? "Saving…" : revoking ? "Resubmit for the audit" : edit ? "Save the declaration" : "Declare it"}
            </button>
            <button className="btn btn-ghost btn-sm" onClick={closeForm} disabled={busy} type="button">
              Close without saving
            </button>
          </div>
        </div>
      )}
      {persistence && <p className="p-sub src-line num">{persistence}</p>}
    </div>
  );
}
