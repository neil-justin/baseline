import { createServerClient } from "@supabase/ssr";
import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import { cookies } from "next/headers";

/**
 * Supabase clients (ADR 0003).
 *  - supabaseServer(): request-scoped SSR client — identity only (sign in/out,
 *    user lookup). Uses the anon/publishable key; sessions ride signed cookies.
 *  - supabaseAdmin(): service-role client — ALL state/profile reads+writes.
 *    Server-only (runtime = nodejs); bypasses RLS, so never import from
 *    client components.
 *
 * Auth errors (invalid/expired) surface through auth.getUser() → null, and
 * the admin client throws on missing env — configured in .env.local (never
 * committed).
 */

export function supabaseEnv() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  const service = process.env.SUPABASE_SERVICE_ROLE_KEY;
  return { url, anon, service, configured: Boolean(url && anon && service) };
}

export async function supabaseServer() {
  const { url, anon } = supabaseEnv();
  if (!url || !anon) throw new Error("Supabase env missing — run the setup wizard (.env.local)");
  const cookieStore = await cookies();
  return createServerClient(url, anon, {
    cookies: {
      getAll: () => cookieStore.getAll(),
      // setAll throws in server components (read-only cookies) — safe to
      // ignore there; route handlers (where refresh happens) can always set.
      setAll: (list) => {
        try {
          for (const { name, value, options } of list) cookieStore.set(name, value, options);
        } catch {
          /* server component — refresh handled by proxy/route handlers */
        }
      },
    },
  });
}

export function supabaseAdmin(): SupabaseClient {
  const { url, service } = supabaseEnv();
  if (!url || !service) throw new Error("Supabase env missing — run the setup wizard (.env.local)");
  return createClient(url, service, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
}
