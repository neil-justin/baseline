/**
 * Admin app bar — the v7 56px top bar (brand mark + wordmark), no student
 * tabs (this surface is the counselor's console, not a student surface) and
 * no search/bells (element-budget rule). The one right-side affordance is
 * the signed-in counselor's POST sign-out.
 */
export default function AdminBar() {
  return (
    <header className="adminbar">
      <div className="bar-in">
        <div className="brand">
          <span className="brandmark" aria-hidden="true">
            <i />
          </span>
          <span className="brandname">Career Readiness</span>
        </div>
        <div className="bar-user">
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
