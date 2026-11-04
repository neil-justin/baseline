"use client";

/**
 * Pager — the realm's pagination, ported from the approved mockup
 * (console-tabs.tsx, "every table gets one") onto `atabs-` hook classes
 * (e2e-hook rule: no `mk-` hooks leak into live chrome). Purely
 * presentational: the caller owns the page state and the row slice
 * (pager-math.ts). Hidden while a table fits one page — the mockup's
 * contract; today's cohort renders pager-free until growth.
 */
import { ChevronLeft, ChevronRight } from "lucide-react";

export default function Pager({
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
    <nav className="atabs-pager" aria-label="Table pagination">
      <button
        type="button"
        className="atabs-pager-btn"
        aria-label="Previous page"
        disabled={page <= 1}
        onClick={() => setPage(page - 1)}
      >
        <ChevronLeft size={14} aria-hidden="true" />
      </button>
      {Array.from({ length: pages }, (_, i) => i + 1).map((n) => (
        <button
          key={n}
          type="button"
          className={`atabs-pager-btn${page === n ? " on" : ""}`}
          aria-current={page === n ? "page" : undefined}
          onClick={() => setPage(n)}
        >
          {n}
        </button>
      ))}
      <button
        type="button"
        className="atabs-pager-btn"
        aria-label="Next page"
        disabled={page >= pages}
        onClick={() => setPage(page + 1)}
      >
        <ChevronRight size={14} aria-hidden="true" />
      </button>
      <span className="atabs-pager-label">
        PAGE {page} OF {pages}
      </span>
    </nav>
  );
}
