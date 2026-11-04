/**
 * mockups/pieces.tsx — painted fixtures + PURE renderers for the
 * /admin#mockups design realm (roles feature-planning round, 2026-11-03;
 * feedback round 2: structured tables only — no band, no filter buttons,
 * no explanatory copy; every table paginates).
 *
 * Mock-realm honesty: EVERY value here is painted for the mockup and the
 * colophon says so once. Nothing reads a store, nothing persists, and no
 * e2e hook classes (.s-row, .aq-*, .dt-score, …) are reused — the mock
 * world renders from `mk*` classes only. Interactive components live in
 * console-tabs.tsx; this module stays server-safe.
 */

export type Mark = { label: string; tone: "g" | "a" | "b" | "" };

export interface Channel {
  key: "sp" | "es" | "tp" | "ar" | "cc";
  label: string;
  earned: number;
  max: number;
}

export interface Persona {
  id: string;
  name: string;
  /** "4th Year · Computer & IT" — personaMeta convention. */
  sub: string;
  career: string;
  segs: [number, number, number, number, number];
  channels: Channel[];
  marks: Mark[];
  pending: number;
  active: string;
  demo?: boolean;
}

export function personaScore(p: Persona): number {
  return p.channels.reduce((a, c) => a + c.earned, 0);
}

export const ROSTER: Persona[] = [
  {
    id: "neil",
    name: "Neil Mallari",
    sub: "4th Year · Computer & IT",
    career: "Systems Administrator",
    segs: [0.72, 0.8, 0.7, 0.6, 0.9],
    channels: [
      { key: "sp", label: "SKILL", earned: 18, max: 25 },
      { key: "es", label: "EMPLOYABILITY", earned: 24, max: 30 },
      { key: "tp", label: "TRAINING", earned: 14, max: 20 },
      { key: "ar", label: "APPLICATION", earned: 9, max: 15 },
      { key: "cc", label: "CLARITY", earned: 9, max: 10 },
    ],
    marks: [{ label: "DEMO", tone: "b" }],
    pending: 1,
    active: "2h ago",
    demo: true,
  },
  {
    id: "karla",
    name: "Karla Reyes",
    sub: "4th Year · Business & Management",
    career: "Marketing Assistant",
    segs: [0.6, 0.77, 0.55, 0.6, 0.7],
    channels: [
      { key: "sp", label: "SKILL", earned: 15, max: 25 },
      { key: "es", label: "EMPLOYABILITY", earned: 23, max: 30 },
      { key: "tp", label: "TRAINING", earned: 11, max: 20 },
      { key: "ar", label: "APPLICATION", earned: 9, max: 15 },
      { key: "cc", label: "CLARITY", earned: 7, max: 10 },
    ],
    marks: [{ label: "PENDING AUDIT", tone: "a" }],
    pending: 1,
    active: "1d ago",
  },
  {
    id: "marco",
    name: "Marco Domingo",
    sub: "4th Year · Accounting & Finance",
    career: "Bookkeeper",
    segs: [0.8, 0.6, 0.65, 0.33, 0.6],
    channels: [
      { key: "sp", label: "SKILL", earned: 20, max: 25 },
      { key: "es", label: "EMPLOYABILITY", earned: 18, max: 30 },
      { key: "tp", label: "TRAINING", earned: 13, max: 20 },
      { key: "ar", label: "APPLICATION", earned: 5, max: 15 },
      { key: "cc", label: "CLARITY", earned: 6, max: 10 },
    ],
    marks: [],
    pending: 0,
    active: "3h ago",
  },
  {
    id: "liza",
    name: "Liza Cruz",
    sub: "4th Year · Computer & IT",
    career: "Data Analyst",
    segs: [0.64, 0.57, 0.5, 0.47, 0.8],
    channels: [
      { key: "sp", label: "SKILL", earned: 16, max: 25 },
      { key: "es", label: "EMPLOYABILITY", earned: 17, max: 30 },
      { key: "tp", label: "TRAINING", earned: 10, max: 20 },
      { key: "ar", label: "APPLICATION", earned: 7, max: 15 },
      { key: "cc", label: "CLARITY", earned: 8, max: 10 },
    ],
    marks: [],
    pending: 0,
    active: "5h ago",
  },
  {
    id: "bea",
    name: "Bea Santos",
    sub: "4th Year · Office & Administration",
    career: "Administrative Officer",
    segs: [0.48, 0.7, 0.5, 0.4, 0.6],
    channels: [
      { key: "sp", label: "SKILL", earned: 12, max: 25 },
      { key: "es", label: "EMPLOYABILITY", earned: 21, max: 30 },
      { key: "tp", label: "TRAINING", earned: 10, max: 20 },
      { key: "ar", label: "APPLICATION", earned: 6, max: 15 },
      { key: "cc", label: "CLARITY", earned: 6, max: 10 },
    ],
    marks: [{ label: "NO ACTIVITY", tone: "" }],
    pending: 0,
    active: "9d ago",
  },
  {
    id: "jomar",
    name: "Jomar Villa",
    sub: "4th Year · Computer & IT",
    career: "IT Support Staff",
    segs: [0.56, 0.5, 0.45, 0.2, 0.7],
    channels: [
      { key: "sp", label: "SKILL", earned: 14, max: 25 },
      { key: "es", label: "EMPLOYABILITY", earned: 15, max: 30 },
      { key: "tp", label: "TRAINING", earned: 9, max: 20 },
      { key: "ar", label: "APPLICATION", earned: 3, max: 15 },
      { key: "cc", label: "CLARITY", earned: 7, max: 10 },
    ],
    marks: [{ label: "BELOW AVG", tone: "a" }],
    pending: 0,
    active: "1d ago",
  },
  {
    id: "rafael",
    name: "Rafael Lim",
    sub: "4th Year · Business & Management",
    career: "Sales Coordinator",
    segs: [0.8, 0.67, 0.75, 0.67, 0.9],
    channels: [
      { key: "sp", label: "SKILL", earned: 20, max: 25 },
      { key: "es", label: "EMPLOYABILITY", earned: 20, max: 30 },
      { key: "tp", label: "TRAINING", earned: 15, max: 20 },
      { key: "ar", label: "APPLICATION", earned: 10, max: 15 },
      { key: "cc", label: "CLARITY", earned: 9, max: 10 },
    ],
    marks: [],
    pending: 0,
    active: "4h ago",
  },
];

export const personaById = (id: string) => ROSTER.find((p) => p.id === id) ?? ROSTER[0];
export const cohortAvg = (list: Persona[]) =>
  list.length ? Math.round(list.reduce((a, p) => a + personaScore(p), 0) / list.length) : 0;

/* ---------- audit queue data ---------- */

export interface AuditItem {
  id: string;
  studentId: string;
  title: string;
  kind: "CERT · TESDA" | "CERT · provider" | "LINK";
  status: "DECLARED" | "VERIFIED" | "REJECTED";
  declared: string;
  link: string;
  ruled?: { by: string; at: string; note: string };
}

export const AUDIT_QUEUE: AuditItem[] = [
  {
    id: "q-karla",
    studentId: "karla",
    title: "Google Data Analytics Certificate",
    kind: "CERT · provider",
    status: "DECLARED",
    declared: "2026-11-02 · 14:05",
    link: "coursera.org/verify/DAT-KR-88214",
  },
  {
    id: "q-neil",
    studentId: "neil",
    title: "TESDA Bookkeeping NC II",
    kind: "CERT · TESDA",
    status: "DECLARED",
    declared: "2026-11-01 · 09:41",
    link: "e-tesda.gov.ph/cert/BT-2026-1183",
  },
  {
    id: "q-liza",
    studentId: "liza",
    title: "LinkedIn Profile",
    kind: "LINK",
    status: "VERIFIED",
    declared: "2026-10-29 · 16:22",
    link: "linkedin.com/in/lizacruz",
    ruled: { by: "ana.villanueva@aisat.test", at: "2026-10-30 · 08:12", note: "Link-verified stamp, automatic." },
  },
  {
    id: "q-jomar",
    studentId: "jomar",
    title: "Coursera Project Management Basics",
    kind: "CERT · provider",
    status: "REJECTED",
    declared: "2026-10-30 · 11:03",
    link: "coursera.org/learn/pm-basics",
    ruled: {
      by: "ana.villanueva@aisat.test",
      at: "2026-10-31 · 10:47",
      note: "Course completion — not a credential; re-declare as training instead.",
    },
  },
];

export const auditById = (id: string) => AUDIT_QUEUE.find((a) => a.id === id) ?? AUDIT_QUEUE[0];

/* ---------- pure renderers ---------- */

/** Channel widths are the locked weights themselves (25·30·20·15·10). */
const SEG_MAX = [25, 30, 20, 15, 10];
export const SEG_LABELS = ["SKILL", "EMPLOYABILITY", "TRAINING", "APPLICATION", "CLARITY"];

export function RubricBar({ segs, aria }: { segs: Persona["segs"]; aria: string }) {
  return (
    <div className="mk-bar" role="img" aria-label={aria}>
      {segs.map((earn, i) => (
        <span key={i} className="mk-seg" style={{ width: `${SEG_MAX[i]}%` }}>
          <i style={{ width: `${Math.round(earn * 100)}%` }} />
        </span>
      ))}
    </div>
  );
}

export function barAria(name: string, p: Persona): string {
  return (
    `${name} channel bar — ` +
    p.channels.map((c) => `${c.label} ${c.earned} of ${c.max}`).join(", ")
  );
}

export function Marks({ marks }: { marks: Mark[] }) {
  if (!marks.length) return null;
  return (
    <span className="mk-marks">
      {marks.map((m) => (
        <span key={m.label} className={`mk-chip${m.tone ? ` t-${m.tone}` : ""}`}>
          {m.label}
        </span>
      ))}
    </span>
  );
}

export function Initials({ name }: { name: string }) {
  const letters = name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0])
    .join("");
  return <span className="mk-ava">{letters}</span>;
}
