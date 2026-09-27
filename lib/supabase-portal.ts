/* ============================================================
   Supabase — the SPONSOR PORTAL client.

   ⚠️ DO NOT IMPORT `@/lib/supabase` IN THE PORTAL. ⚠️

   That client is correct for content and catastrophic here, and the
   reason is worth reading once rather than rediscovering under load.

   THE BUG YOU WOULD GET FOR FREE

   src/lib/supabase.ts injects `cache: "force-cache"` with a shared tag
   into every fetch. For guides that is free speed: /reads/week-20 is
   identical for every visitor, so storing the response once and serving
   it a million times is exactly right.

   The portal's requests are NOT identical for every visitor — but they
   LOOK identical to the cache. When HR at Acme opens their dashboard,
   the request is:

       POST /rest/v1/rpc/sponsor_dashboard      body: {}

   When HR at Northwind opens theirs, the request is:

       POST /rest/v1/rpc/sponsor_dashboard      body: {}

   Byte for byte the same. The only difference is the JWT in the
   Authorization header, which is what makes auth.uid() resolve to a
   different person and therefore a different company.

   Next's data cache keys on the URL and the body. Not the headers. So
   it would answer Northwind's request out of Acme's cached response and
   never contact Supabase at all.

   That is worse than an ordinary bug:
     * The database did nothing wrong. Postgres answered Acme correctly,
       once. RLS cannot help — there is no second query to filter.
     * It only appears with two companies inside the revalidate window,
       so a single tester never sees it.
     * You inherit it without writing any caching code, just by
       importing the obvious module.

   THE RULE, which travels beyond this file: a cache key must contain
   everything that changes the answer. Auth headers almost never are in
   it. So any response that differs per user must be uncacheable, and
   that is decided once, here, rather than remembered at every call site.

   Hence: no global fetch override, `cache: "no-store"` on every call,
   and a session read from cookies per request.
   ============================================================ */

import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

/* ONE CHANGE from the old site's file: a missing env var no longer throws at
   module level. This site is deployed before the keys are set on some
   environments, and a module-level throw would fail the whole build — the
   same reason lib/supabase.ts returns null. So portalClient() returns null
   when the keys are absent, and every caller shows a calm "the programme
   dashboard isn't connected yet" rather than crashing. proxy.ts already
   fails soft the same way (`if (!url || !anonKey) return response;`). */

/**
 * A Supabase client bound to the caller's session cookie.
 *
 * The anon key is still the key — it is publishable and grants nothing on
 * its own. What decides the answer is the signed JWT the cookie carries,
 * which is what auth.uid() reads inside every portal function.
 *
 * Returns null when the Supabase env vars are not set (see the note above).
 */
export async function portalClient() {
  if (!url || !anonKey) return null;

  const store = await cookies();

  return createServerClient(url, anonKey, {
    cookies: {
      getAll() {
        return store.getAll();
      },
      setAll(list) {
        try {
          for (const { name, value, options } of list) {
            store.set(name, value, options);
          }
        } catch {
          /* Called from a Server Component, where cookies are read-only.
             Harmless: middleware refreshes the session on every request,
             so the only thing lost is one opportunistic rotation. */
        }
      },
    },
    global: {
      // The whole point of this file. See the header.
      fetch: (input, init) =>
        fetch(input, { ...init, cache: "no-store" } as RequestInit),
    },
  });
}

/* ---- the shapes sponsor_dashboard() and sponsor_roster() return -------
   Mirrors migrations 0060 and 0061. Kept as plain types rather than
   generated, matching how the rest of src/lib does it.

   NOTE WHAT SponsorPerson DOES NOT CONTAIN: no user id, no pregnancy, no
   child, no bookings, no last-seen. That is not this file being careful
   — the database function does not return those columns, so a caller
   could not select them if it tried. The type just says so out loud. */

export type SponsorDashboard = {
  ok: true;
  sponsor_id: string;
  sponsor_name: string;
  kind: string;
  renewal_at: string | null;
  seats_purchased: number | null;
  /** How many people the company named on the sheet they sent. 0 = none sent. */
  eligible_listed: number;
  activated: number;
  removed: number;
  activated_last_30d: number;
  seats_left: number | null;
  activation_rate: number | null;
  /** True when the cohort is too small for behavioural numbers to be anonymous. */
  suppressed: boolean;
  min_cohort: number;
  /** null when suppressed — NOT zero. A zero is a claim; null is a policy. */
  consultations_booked: number | null;
  consultations_completed: number | null;
  consultations_upcoming: number | null;
};

export type NotAnAdmin = { ok: false; code: string };

/** One month from `sponsor_trend()` (0063). Oldest first, no gaps — a month in
    which nothing happened is a zero, because a gap reads as "no data" and only
    one of those is what we mean. */
export type SponsorTrendPoint = {
  month: string;
  activated_in_month: number;
  activated_cumulative: number;
  /** null when THAT month had fewer than min_cohort distinct people — a
      stricter test than the dashboard's whole-programme one. */
  consultations_booked: number | null;
};

export type SponsorPerson = {
  work_email: string;
  /** From the sheet HR sent us. Null for someone who activated by email domain
      without ever appearing on a list. */
  full_name: string | null;
  /** `not_activated` is a person on the roster who has not started — the
      follow-up list, and the reason this function returns the roster rather
      than only the members. */
  status: "active" | "not_activated" | "removed";
  activated_at: string | null;
  removed_at: string | null;
};

/** Whichever number take-up is a percentage OF, and what to call it. */
export function denominator(d: SponsorDashboard): {
  value: number | null;
  label: string;
} {
  // The roster is the better denominator when there is one: seats are what a
  // company BOUGHT, the roster is who they TOLD US ABOUT, and those differ.
  if (d.eligible_listed > 0) {
    return { value: d.eligible_listed, label: "on your list" };
  }
  const seats = d.seats_purchased;
  return { value: seats && seats > 0 ? seats : null, label: "seats" };
}
