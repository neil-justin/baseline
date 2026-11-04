import { supabaseAdmin } from "@/lib/supabase/server";
import type { Role } from "@/lib/session";

/**
 * Wave 3 (2026-11-03 admin-replacement.md) — the ACCOUNTS tab store.
 *
 * The one new backend slice of the admin replacement: a service-role read of
 * every identity (Supabase Auth users joined to their `profiles` row) and a
 * SOFT deactivate/reactivate. The deactivate is a Supabase Auth ban
 * (`ban_duration`), not a schema flag and never a hard delete — the DPA
 * erasure route stays untouched and students-only.
 */

export interface AdminAccount {
  userId: string;
  email: string;
  fullName: string;
  role: Role;
  campus: string;
  /** false = banned (deactivated); derived from the auth user's ban state. */
  active: boolean;
  /** ISO string from Supabase Auth's `last_sign_in_at`; null for never. */
  lastSignInAt: string | null;
}

/** An account that hard-deleted identities, letting the roster stay honest. */
const isLiveUser = (u: { id?: string; email?: string; deleted_at?: string }) =>
  Boolean(u.id && !u.deleted_at);

export async function listAccounts(): Promise<AdminAccount[]> {
  const admin = supabaseAdmin();
  const { data, error } = await admin.auth.admin.listUsers({ perPage: 1000 });
  if (error) throw error;
  // listUsers shape: { users: User[], aud } — users paginated (one page of
  // 1000 covers this deployment's roster; the mock's vacancy stands otherwise).
  const users = (data?.users ?? []).filter(isLiveUser);
  if (users.length === 0) return [];

  const { data: profiles, error: profilesError } = await admin
    .from("profiles")
    .select("id, email, full_name, role, campus")
    .in(
      "id",
      users.map((u) => u.id),
    );
  if (profilesError) throw profilesError;
  const byId = new Map((profiles ?? []).map((p) => [p.id, p]));

  return users.map((u) => {
    const id = u.id as string;
    const profile = byId.get(id);
    // A signed-up identity without a provisioned profile row yet (first
    // Google round) still renders — the profiles columns fall to defaults.
    return {
      userId: id,
      email: profile?.email ?? u.email ?? "",
      fullName: profile?.full_name ?? "",
      role: (profile?.role as Role | undefined) ?? "student",
      campus: profile?.campus ?? "",
      active: !u.banned_until, // banned_until set ⇒ deactivated identity
      lastSignInAt: u.last_sign_in_at ?? null,
    };
  });
}

/**
 * Soft-deactivate (`active: false` → ban) / reactivate ('none' lifts the ban,
 * the library's own signal for no ban). NO schema change, NO hard delete, and
 * the DPA erasure route elsewhere is never touched. The sysadmin's own row is
 * allowed through here by design — the later-wave UI never offers it.
 */
export async function setAccountActive(
  userId: string,
  active: boolean,
): Promise<void> {
  const admin = supabaseAdmin();
  const { error } = await admin.auth.admin.updateUserById(userId, {
    // 876000h ≈ 100 years — far enough out to read as indefinite.
    ban_duration: active ? "none" : "876000h",
  });
  if (error) throw error;
}
