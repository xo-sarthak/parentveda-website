/* ============================================================
   Supabase — privileged, server-only client.

   This uses the service-role key, which BYPASSES ROW LEVEL SECURITY
   ENTIRELY. It can read and write every table in the project regardless of
   any policy. Treat it the way you would treat a database root password:

     - never import this module from a client component
     - never expose the key with a NEXT_PUBLIC_ prefix
     - never return raw rows fetched with it straight to the browser

   It exists for one job today: writing waitlist and newsletter signups into
   a table that is deliberately sealed to the public key. Everything the site
   *reads* still goes through the RLS-gated anon client in lib/supabase.ts.

   Caching note: lib/supabase.ts injects `cache: "force-cache"` because guide
   content is read constantly and changes rarely. That would be actively
   wrong here — a cached mutation is a signup silently dropped on the floor —
   so this client opts out explicitly.
   ============================================================ */

import { createClient, type SupabaseClient } from "@supabase/supabase-js";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

/**
 * The privileged client, or `null` when SUPABASE_SERVICE_ROLE_KEY is unset.
 *
 * Null rather than a thrown error on purpose: the key is absent in local
 * checkouts and during `next build`, and a module-level throw would break the
 * build for anyone who has not set it up. Callers handle null and surface a
 * real message instead.
 */
export function getSupabaseAdmin(): SupabaseClient | null {
  if (typeof window !== "undefined") {
    // Should be unreachable — but if a refactor ever pulls this into a client
    // bundle, fail loudly here rather than shipping the key to a browser.
    throw new Error("supabase-admin must never be imported into client code.");
  }

  if (!url || !serviceKey) return null;

  return createClient(url, serviceKey, {
    auth: { persistSession: false, autoRefreshToken: false },
    global: {
      fetch: (input, init) => fetch(input, { ...init, cache: "no-store" } as RequestInit),
    },
  });
}
