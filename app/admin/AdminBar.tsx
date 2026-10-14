import Link from "next/link";

/**
 * Admin app bar — ported 1:1 from prototype/admin.html: brand + account,
 * NO student nav (read-only panel surface, not a student surface).
 */
export default function AdminBar() {
  return (
    <header className="bar">
      <div className="app-bar-in">
        <div className="brand">
          <span className="brand-mark" aria-hidden="true" />
          <span className="brand-name">Career Readiness</span>
          <span className="brand-meta">Admin · read-only</span>
        </div>
        <div className="app-user">
          <span className="user-chip">ADMIN · SEEDED</span>
          <Link className="link-quiet" href="/signin">
            Sign out
          </Link>
        </div>
      </div>
    </header>
  );
}
