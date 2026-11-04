"use client";

/**
 * mockups/console-tabs.tsx — the interactive mockup tabs both staff
 * consoles compose (2026-11-03 feedback round 2: structured tables only —
 * every table carries a defined column-head row, filled values, and
 * pagination; no filters, no explanatory copy; the audit rows open a
 * detail dialog without the machine-checks field).
 */
import { useState } from "react";
import { ArrowRight, ChevronLeft, ChevronRight, X } from "lucide-react";
import {
  AUDIT_QUEUE,
  Marks,
  auditById,
  personaById,
  personaScore,
  ROSTER,
  type AuditItem,
} from "./pieces";

/* ---------- the realm's pagination (every table gets one) ---------- */

export function Pager({
  page,
  pages,
  setPage,
}: {
  page: number;
  pages: number;
  setPage: (n: number) => void;
}) {
  if (pages <= 1) return null;
  return (
    <nav className="mk-pager" aria-label="Table pagination">
      <button type="button" disabled={page <= 1} onClick={() => setPage(page - 1)}>
        <ChevronLeft size={14} aria-hidden="true" />
      </button>
      {Array.from({ length: pages }, (_, i) => i + 1).map((n) => (
        <button
          key={n}
          type="button"
          className={page === n ? "on" : ""}
          onClick={() => setPage(n)}
          aria-current={page === n ? "page" : undefined}
        >
          {n}
        </button>
      ))}
      <button type="button" disabled={page >= pages} onClick={() => setPage(page + 1)}>
        <ChevronRight size={14} aria-hidden="true" />
      </button>
      <span className="mk-label">
        PAGE {page} OF {pages}
      </span>
    </nav>
  );
}

/* ---------- the detail dialog (mockup-only actions) ---------- */

function MockModal({
  open,
  onClose,
  title,
  children,
}: {
  open: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}) {
  if (!open) return null;
  return (
    <div className="mk-modal-back" onClick={onClose}>
      <div
        className="mk-modal"
        role="dialog"
        aria-modal="true"
        aria-label={title}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mk-modalhead">
          <h3>{title}</h3>
          <button type="button" className="mk-modalx" onClick={onClose} aria-label="Close dialog">
            <X size={14} aria-hidden="true" />
          </button>
        </div>
        <div className="mk-modalbody">{children}</div>
      </div>
    </div>
  );
}

/* ---------- shared row-slice helper ---------- */

function slice<T>(list: T[], page: number, per: number): T[] {
  return list.slice((page - 1) * per, page * per);
}
function pagesOf(list: unknown[], per: number): number {
  return Math.max(1, Math.ceil(list.length / per));
}

/* ---------- COHORT — defined columns, no filters, paginated ---------- */

const COHORT_PER = 5;

export function CohortTab() {
  const [page, setPage] = useState(1);
  const rows = slice(ROSTER, page, COHORT_PER);
  return (
    <section className="mk-panel" aria-label="Cohort roster mockup">
      <div className="mk-rowheads mk-r-roster mk-label">
        <span>NAME</span>
        <span>TARGET ROLE</span>
        <span>SCORE</span>
        <span>AUDITS</span>
        <span>LAST ACTIVE</span>
        <span></span>
      </div>
      {rows.map((p) => (
        <div key={p.id} className={`mk-row mk-r-roster${p.demo ? " mk-row-demo" : ""}`}>
          <div className="mk-cellname">
            <span className="mk-name">
              {p.name}
              <Marks marks={p.marks} />
            </span>
            <span className="mk-sub">{p.sub}</span>
          </div>
          <span className="mk-career">{p.career}</span>
          <span className="mk-score mk-num">
            {personaScore(p)}
            <small>/100</small>
          </span>
          <span className="mk-aud">
            {p.pending > 0 ? (
              <span className="mk-chip t-a">{p.pending} PENDING</span>
            ) : (
              <span className="mk-chip t-g">CLEAR</span>
            )}
          </span>
          <span className="mk-active">{p.active}</span>
          <span className="mk-view">
            VIEW <ArrowRight size={12} aria-hidden="true" />
          </span>
        </div>
      ))}
      <Pager page={page} pages={pagesOf(ROSTER, COHORT_PER)} setPage={setPage} />
    </section>
  );
}

/* ---------- AUDIT — defined columns, clickable rows, detail dialog ---------- */const AUDIT_PER = 3;

export function AuditTab() {
  const [page, setPage] = useState(1);
  const [openId, setOpenId] = useState<string | null>(null);
  const item = openId ? auditById(openId) : null;
  const rows = slice(AUDIT_QUEUE, page, AUDIT_PER);

  return (
    <section className="mk-panel" aria-label="Credential audit queue mockup">
      <div className="mk-rowheads mk-r-audit mk-label">
        <span>STATUS</span>
        <span>STUDENT</span>
        <span>CREDENTIAL</span>
        <span>DECLARED</span>
        <span>EVIDENCE</span>
        <span></span>
      </div>
      {rows.map((a) => (
        <QueueRow key={a.id} item={a} onOpen={() => setOpenId(a.id)} />
      ))}
      <Pager page={page} pages={pagesOf(AUDIT_QUEUE, AUDIT_PER)} setPage={setPage} />
      <MockModal open={Boolean(item)} onClose={() => setOpenId(null)} title={item?.title ?? ""}>
        {item ? <AuditDetail item={item} /> : null}
      </MockModal>
    </section>
  );
}

function QueueRow({ item, onOpen }: { item: AuditItem; onOpen: () => void }) {
  const student = personaById(item.studentId);
  return (
    <div
      className={`mk-aqrow mk-click${item.status === "DECLARED" ? " mk-aq-declared" : ""}`}
      onClick={onOpen}
      role="button"
      tabIndex={0}
      aria-label={`Audit detail: ${item.title}, ${student.name}`}
      onKeyDown={(e) => e.key === "Enter" && onOpen()}
    >
      <div className="mk-aqstatus">
        <span
          className={`mk-chip${
            item.status === "DECLARED" ? " t-a" : item.status === "VERIFIED" ? " t-g" : ""
          }`}
        >
          {item.status}
        </span>
        <span className="mk-meta block">{item.kind}</span>
      </div>
      <div className="mk-cellname">
        <span className="mk-name">{student.name}</span>
        <span className="mk-sub">{student.sub}</span>
      </div>
      <div className="mk-cellname">
        <span className="mk-name">{item.title}</span>
      </div>
      <span className="mk-meta">{item.declared}</span>
      <span className="mk-career">{item.link}</span>
      <span className="mk-view">
            DETAIL <ArrowRight size={12} aria-hidden="true" />
          </span>
    </div>
  );
}

function AuditDetail({ item }: { item: AuditItem }) {
  const student = personaById(item.studentId);
  return (
    <>
      <p className="mk-modalmeta">
        <span
          className={`mk-chip${
            item.status === "DECLARED" ? " t-a" : item.status === "VERIFIED" ? " t-g" : ""
          }`}
        >
          {item.status}
        </span>
        <span className="mk-chip">{item.kind}</span>
      </p>
      <div className="mk-field">
        <span className="mk-label">STUDENT</span>
        <span className="mk-line">
          {student.name}, {student.sub}
        </span>
      </div>
      <div className="mk-field">
        <span className="mk-label">EVIDENCE</span>
        <span className="mk-link">{item.link}</span>
        <span className="mk-sub">declared {item.declared}</span>
      </div>
      {item.ruled ? (
        <div className="mk-field">
          <span className="mk-label">RULING</span>
          <span className="mk-line">
            {item.ruled.by}, {item.ruled.at}
          </span>
          <span className="mk-meta">{item.ruled.note}</span>
        </div>
      ) : (
        <div className="mk-field">
          <span className="mk-label">COUNSELOR RULING</span>
          <span className="mk-fakeinput">Audit note — required only on reject</span>
          <span className="mk-acts">
            <button type="button" disabled>
              APPROVE
            </button>
            <button type="button" disabled>
              REJECT
            </button>
          </span>
        </div>
      )}
    </>
  );
}
