/**
 * Pager page math (cohort pagination round, 2026-11-04). The two pure
 * units the live pager and scripts/verify-pager.test.ts pin — no React
 * here, so the test imports run without DOM machinery. Sized at 10 per
 * page (user ruling over the mockup's 5); the audit queue reuses the
 * module when its own pager round lands.
 */
export const PER_PAGE = 10;

/** Ceiling onto whole pages; a 0-row table still counts as 1 page so
 *  callers can render `Pager` unconditionally. */
export function pagesOf(count: number, per: number = PER_PAGE): number {
  return Math.max(1, Math.ceil(count / per));
}

/** The caller's page slice — page is 1-based, matching the Pager's
 *  numbered buttons. Never throws on an empty list. */
export function slicePage<T>(
  list: readonly T[],
  page: number,
  per: number = PER_PAGE,
): T[] {
  return list.slice((page - 1) * per, page * per);
}
