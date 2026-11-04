import AdminVeil from "../AdminVeil";
import DetailSkeleton from "../detail-skeleton";

/**
 * /admin/student route skeleton — the veil is the REAL chrome (same
 * classes, same sign-out contract — never disappears between the roster
 * and the detail, user ruling 2026-11-04), the main renders the shared
 * DetailSkeleton clone (Skeleton-Contract: also the streamed shell's
 * Suspense fallback — one DOM, all entrances). The drill-in is
 * counselor-only (role law), so the viz renders the counselor's tab set.
 */
export default function Loading() {
  return (
    <div className="v7admin" aria-busy="true" aria-label="Loading student detail">
      <AdminVeil role="counselor" mode="detail" active="cohort">
        <section className="detail">
          <DetailSkeleton />
        </section>
      </AdminVeil>
    </div>
  );
}
