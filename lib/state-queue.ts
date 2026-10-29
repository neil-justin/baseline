/**
 * Per-student state write serialization (engine re-lock round, 2026-10-29).
 *
 * Lost-update guard for read-modify-write routes: two overlapping POSTs on
 * the same student's state (the verification mini-quiz answers CAN land
 * within one Supabase round-trip of each other) each read the same state
 * and the later save clobbers the earlier write — a verified bar silently
 * reverted to a claim. The demo's canon depends on every verify write
 * landing ("2 of 5 confirmed"), so per-student writes queue strictly.
 *
 * In-process (one Next server per repo dir in this thesis's deployment —
 * the defense demo runs locally); multi-instance would need a real
 * transaction — noted, not built.
 */
const queues = new Map<string, Promise<unknown>>();

export function withStateLock<T>(studentId: string, fn: () => Promise<T>): Promise<T> {
  const prev = queues.get(studentId) ?? Promise.resolve();
  const next = prev.catch(() => {}).then(fn);
  queues.set(studentId, next);
  void next.finally(() => {
    if (queues.get(studentId) === next) queues.delete(studentId);
  });
  return next;
}
