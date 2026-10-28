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
        </div>
        <div className="app-user">
          {/* POST, not a GET <Link> — a prefetched GET sign-out would wipe the
              session on visit (same footgun as the AppBar sign-out). */}
          <form action="/api/auth/signout" method="post">
            <button type="submit" className="admin-signout">Sign out</button>
          </form>
        </div>
      </div>
    </header>
  );
}
