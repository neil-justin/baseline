"use client";

/**
 * The family table pager (Round P3, 2026-11-02) — one quiet bar under a
 * paged data table: the tracked-label SHOWING range left, the page
 * indicator + drawn-chevron prev/next right, 10 rows a page (a real data
 * need — the careers catalog is 36 rows; the My Plan tables run to
 * 25-/28-row lists). Styles live in the shell (app/(app)/v7.css `.vpager`)
 * so any .v7 surface root can host it. Honest by construction: every
 * number arrives computed from the table's own rows (kicker honesty law);
 * the callers render the pager only when a table actually overflows one
 * page, and paging is a state change only — no viewport plumbing, the
 * scroll position never jumps.
 */

export interface TablePagerProps {
  /** the page-true range over the table's real rows — computed, never painted */
  showingFrom: number;
  showingTo: number;
  total: number;
  page: number;
  pageCount: number;
  onPage: (page: number) => void;
  /** false → the bar ships nav only, because the caller's own tracked
   *  counter already carries the ONE SHOWING line for the block (the
   *  Careers cardtop kicker does) — the Sparing Label Rule holds */
  showRange?: boolean;
}

export default function TablePager({
  showingFrom,
  showingTo,
  total,
  page,
  pageCount,
  onPage,
  showRange = true,
}: TablePagerProps) {
  return (
    <div className="vpager">
      {showRange ? (
        <span className="vpager-range num" aria-label={`Showing rows ${showingFrom} to ${showingTo} of ${total}`}>
          SHOWING {showingFrom}–{showingTo} OF {total}
        </span>
      ) : null}
      <div className="vpager-nav">
        <button
          className="pbtn prev"
          type="button"
          disabled={page <= 1}
          aria-label="Previous page"
          onClick={() => onPage(page - 1)}
        >
          <span className="chev" aria-hidden="true" />
        </button>
        <span className="vpager-page num">
          PAGE {page} OF {pageCount}
        </span>
        <button
          className="pbtn next"
          type="button"
          disabled={page >= pageCount}
          aria-label="Next page"
          onClick={() => onPage(page + 1)}
        >
          <span className="chev" aria-hidden="true" />
        </button>
      </div>
    </div>
  );
}
