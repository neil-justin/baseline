import type { Role } from "@/lib/session";

import BrandMark from "../../components/BrandMark";

/**
 * Admin app bar — the v7 56px top bar (brand mark + wordmark), no student
 * tabs (this surface is the counselor's console, not a student surface) and
 * no search/bells (element-budget rule). Right-side affordances: for the
 * sysadmin, the counselor-requests queue link (provisioning is not a
 * counselor power — one extra link, nothing else); then the signed-in
 * staff's POST sign-out.
 */
export default function AdminBar({ role }: { role?: Role }) {
  return (
    <header className="adminbar">
      <div className="bar-in">
        <div className="brand">
          <BrandMark size={24} />
          <span className="brandname">Baseline</span>
        </div>
        <div className="bar-user">
          {role === "sysadmin" && (
            <a href="/admin/counselor-requests" className="admin-signout" style={{ marginRight: 12 }}>
              Counselor requests
            </a>
          )}
          {/* POST, not a GET <Link> — a prefetched GET sign-out would wipe the
              session on visit (e2e-caught footgun; the v7.2 student top bar
              had the same sign-out before the v7.3 sidebar round retired
              it). */}
          <form action="/api/auth/signout" method="post">
            <button type="submit" className="admin-signout">
              Sign out
            </button>
          </form>
        </div>
      </div>
    </header>
  );
}
