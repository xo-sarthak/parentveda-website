/* ============================================================
   Supabase — the shared ParentVeda content backend.

   Carried over from the old site (parentveda-web). Read-only, server-side
   only. Content is authored in Directus and read here with the anon key;
   RLS only exposes rows with status='published', so nothing here is secret.

   Caching: supabase-js issues plain `fetch` calls, and an uncached fetch
   opts a route into per-request rendering. So every read opts into Next's
   data cache with a revalidate window and a shared tag, which keeps Reads
   static/ISR — and lets /api/revalidate publish instantly from Directus.

   ONE CHANGE from the old file: a missing env var no longer throws. The old
   site always had the keys; this one is deployed before they are set, and a
   module-level throw would fail the whole build. With no keys, `supabase`
   is null, Reads render their empty state and /care falls back to the
   generic page — the same as Supabase being unreachable, which every caller
   already handles.
   ============================================================ */

import { createClient, type SupabaseClient } from "@supabase/supabase-js";

/** Cache tag for every content read — revalidateTag(CONTENT_TAG) flushes all of it. */
export const CONTENT_TAG = "parentveda-content";

/** Seconds before a cached content read is considered stale. */
export const CONTENT_REVALIDATE = 60;

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

export const supabase: SupabaseClient | null =
  url && anonKey
    ? createClient(url, anonKey, {
        auth: { persistSession: false, autoRefreshToken: false },
        global: {
          fetch: (input, init) =>
            fetch(input, {
              ...init,
              cache: "force-cache",
              next: { revalidate: CONTENT_REVALIDATE, tags: [CONTENT_TAG] },
            } as RequestInit),
        },
      })
    : null;
