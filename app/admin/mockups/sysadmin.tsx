"use client";

/**
 * mockups/sysadmin.tsx — the System Admin's console as a multi-page realm
 * (2026-11-03 roles round; round 3 role-tab law, 2026-11-04: sysadmins do
 * not handle students, so the cohort and the audit queue leave this realm.
 * Sidebar pages:
 *   APPROVALS · ACCOUNTS      (sysadmin-only)
 * All painted — see pieces.tsx for the honesty law.
 */
import { useState } from "react";
import { X, Ellipsis } from "lucide-react";
import { Initials } from "./pieces";
import { Pager } from "./console-tabs";

export const SYSADMIN_TABS = [
  { id: "approvals", label: "Approvals", icon: "how_to_reg" },
  { id: "accounts", label: "Accounts", icon: "manage_accounts" },
] as const;

export function SysadminPane({ tab }: { tab: string }) {
  if (tab === "accounts") return <AccountsTab />;
  return <ApprovalsTab />;
}

/* ---------- APPROVALS — one table: applications + their decision trail ---------- */

interface Approval {
  name: string;
  gmail: string;
  declared: string;
  state: "PENDING" | "APPROVED" | "DENIED";
  trail: string;
}

const APPROVALS: Approval[] = [
  {
    name: "Carla Reyes",
    gmail: "carla.reyes.999@gmail.com",
    declared: "2026-11-02, 10:12",
    state: "PENDING",
    trail: "—",
  },
  {
    name: "Dan Ocampo",
    gmail: "dan.ocampo@gmail.com",
    declared: "2026-11-03, 08:30",
    state: "PENDING",
    trail: "—",
  },
  {
    name: "Ana Villanueva",
    gmail: "ana.villanueva@aisat.test",
    declared: "2026-10-29, 09:05",
    state: "APPROVED",
    trail: "by sys-admin, 2026-10-30",
  },
  {
    name: "Ruth Garcia",
    gmail: "ruth.garcia.ab@gmail.com",
    declared: "2026-10-28, 17:40",
    state: "DENIED",
    trail: "by sys-admin, 2026-10-29",
  },
];

const APPROVALS_PER = 3;

function ApprovalsTab() {
  const [rows, setRows] = useState<Approval[]>(APPROVALS);
  const [armed, setArmed] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const shown = rows.slice((page - 1) * APPROVALS_PER, page * APPROVALS_PER);
  const pages = Math.max(1, Math.ceil(rows.length / APPROVALS_PER));
  return (
    <section className="mk-panel" aria-label="Counselor approvals mockup">
      <div className="mk-rowheads mk-r-appr mk-label">
        <span>APPLICANT</span>
        <span>REQUEST</span>
        <span>DECLARED</span>
        <span>TRAIL</span>
        <span>STATUS</span>
        <span></span>
      </div>
      {shown.map((a) => (
        <div key={a.gmail} className="mk-row mk-r-appr">
          <div className="mk-cellname">
            <span className="mk-name">{a.name}</span>
            <span className="mk-line small">{a.gmail}</span>
          </div>
          <span>
            <span className="mk-chip t-b">COUNSELOR</span>
          </span>
          <span className="mk-meta">{a.declared}</span>
          <span className="mk-meta">{a.trail}</span>
          <span>
            <span className={`mk-chip${a.state === "APPROVED" ? " t-g" : a.state === "PENDING" ? " t-a" : ""}`}>
              {a.state}
            </span>
          </span>
          {a.state === "PENDING" ? (
            <span className="mk-acts">
              {armed === `${a.gmail}:deny` ? (
                <button
                  type="button"
                  title="Mockup — client-side only"
                  onClick={() => setArmed(null)}
                >
                  <X size={14} aria-hidden="true" /> CANCEL
                </button>
              ) : (
                <button
                  type="button"
                  title="Mockup — client-side only"
                  className={armed === `${a.gmail}:approve` ? "armed" : undefined}
                  onClick={
                    armed === `${a.gmail}:approve`
                      ? () => {
                          const g = a.gmail;
                          setRows((rs) =>
                            rs.map((r) =>
                              r.gmail === g ? { ...r, state: "APPROVED", trail: "by you, just now" } : r,
                            ),
                          );
                          setArmed(null);
                        }
                      : () => setArmed(`${a.gmail}:approve`)
                  }
                >
                  {armed === `${a.gmail}:approve` ? "CONFIRM — APPROVE" : "APPROVE"}
                </button>
              )}
              {armed === `${a.gmail}:approve` ? (
                <button
                  type="button"
                  title="Mockup — client-side only"
                  onClick={() => setArmed(null)}
                >
                  <X size={14} aria-hidden="true" /> CANCEL
                </button>
              ) : (
                <button
                  type="button"
                  title="Mockup — client-side only"
                  className={armed === `${a.gmail}:deny` ? "armed armed-reject" : undefined}
                  onClick={
                    armed === `${a.gmail}:deny`
                      ? () => {
                          const g = a.gmail;
                          setRows((rs) =>
                            rs.map((r) =>
                              r.gmail === g ? { ...r, state: "DENIED", trail: "by you, just now" } : r,
                            ),
                          );
                          setArmed(null);
                        }
                      : () => setArmed(`${a.gmail}:deny`)
                  }
                >
                  {armed === `${a.gmail}:deny` ? "CONFIRM — DENY" : "DENY"}
                </button>
              )}
            </span>
          ) : (
            <span />
          )}
        </div>
      ))}
      <Pager page={page} pages={pages} setPage={setPage} />
    </section>
  );
}

/* ---------- ACCOUNTS — defined columns, kebab actions ---------- */

interface Account {
  name: string;
  email: string;
  role: "STUDENT" | "COUNSELOR" | "SYSTEM ADMIN";
  status: "ACTIVE" | "DEACTIVATED";
  seen: string;
}

const ACCOUNTS: Account[] = [
  {
    name: "System Admin (you)",
    email: "aisat.mallari235832+sys-admin@gmail.com",
    role: "SYSTEM ADMIN",
    status: "ACTIVE",
    seen: "now",
  },
  {
    name: "Ana Villanueva",
    email: "ana.villanueva@aisat.test",
    role: "COUNSELOR",
    status: "ACTIVE",
    seen: "1h ago",
  },
  {
    name: "Neil Mallari",
    email: "aisat.mallari235832@gmail.com",
    role: "STUDENT",
    status: "ACTIVE",
    seen: "2h ago",
  },
  {
    name: "Karla Reyes",
    email: "karla.reyes@aisat.test",
    role: "STUDENT",
    status: "ACTIVE",
    seen: "1d ago",
  },
  {
    name: "Liza Cruz",
    email: "liza.cruz@aisat.test",
    role: "STUDENT",
    status: "ACTIVE",
    seen: "5h ago",
  },
  {
    name: "Marco Domingo",
    email: "marco.domingo@aisat.test",
    role: "STUDENT",
    status: "DEACTIVATED",
    seen: "2026-10-20",
    },
];

const ACCOUNTS_PER = 4;

function AccountsTab() {
  const [page, setPage] = useState(1);
  const rows = ACCOUNTS.slice((page - 1) * ACCOUNTS_PER, page * ACCOUNTS_PER);
  const pages = Math.max(1, Math.ceil(ACCOUNTS.length / ACCOUNTS_PER));
  return (
    <section className="mk-panel" aria-label="Accounts mockup">
      <div className="mk-rowheads mk-r-acc mk-label">
        <span>ACCOUNT</span>
        <span>ROLE</span>
        <span>STATUS</span>
        <span>LAST SIGN-IN</span>
        <span></span>
      </div>
      {rows.map((a) => (
        <div key={a.email} className={`mk-row mk-r-acc${a.status === "DEACTIVATED" ? " mk-off" : ""}`}>
          <div className="mk-cellname">
            <Initials name={a.name} />
            <span className="mk-recid">
              <span className="mk-name">{a.name}</span>
              <span className="mk-line small">{a.email}</span>
            </span>
          </div>
          <span>
            <span
              className={`mk-chip${
                a.role === "COUNSELOR" ? " t-b" : a.role === "SYSTEM ADMIN" ? " t-a" : ""
              }`}
            >
              {a.role}
            </span>
          </span>
          <span>
            <span className={`mk-chip${a.status === "ACTIVE" ? " t-g" : ""}`}>{a.status}</span>
          </span>
          <span className="mk-active">{a.seen}</span>
          {a.name === "System Admin (you)" ? (
            <span className="mk-meta">—</span>
          ) : (
            <button type="button" className="mk-kebab" aria-label={`Account actions: ${a.name}`} disabled>
              <Ellipsis size={14} aria-hidden="true" />
            </button>
          )}
        </div>
      ))}
      <Pager page={page} pages={pages} setPage={setPage} />
    </section>
  );
}
