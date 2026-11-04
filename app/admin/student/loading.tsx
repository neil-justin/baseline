import Link from "next/link";
import { ArrowLeft } from "lucide-react";

import AdminVeil from "../AdminVeil";
import DetailSkeleton from "../detail-skeleton";

/**
 * /admin/student route skeleton — the veil is the REAL chrome (same
 * classes, same sign-out contract — never disappears between the roster
 * and the detail, user ruling 2026-11-04), the way-home is the REAL
 * `.dt-back` link (chrome, not data — it renders identically before the
 * panel commits, user ruling 2026-11-04), and the main renders the
 * shared DetailSkeleton clone (Skeleton-Contract: also the streamed
 * shell's Suspense fallback — one panel DOM, all entrances). The
 * drill-in is counselor-only (role law), so the viz renders the
 * counselor's tab set.
 */
export default function Loading() {
  return (
    <div className="v7admin" aria-busy="true" aria-label="Loading student detail">
      <AdminVeil role="counselor" mode="detail" active="cohort">
        <section className="detail">
          <Link className="dt-back" href="/admin">
            <ArrowLeft size={14} aria-hidden="true" /> Back to cohort
          </Link>
          <DetailSkeleton />
        </section>
      </AdminVeil>
    </div>
  );
}
