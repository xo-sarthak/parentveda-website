/* ============================================================
   Sponsor portal — shared types and formatting.

   Lives apart from app/actions/portal-auth.ts because every export in a
   "use server" module becomes a callable server endpoint; a type or a constant
   in there is a runtime error at module evaluation. Same reason lib/signup.ts
   exists next to actions/subscribe.ts.
   ============================================================ */

export type PortalAuthState = { error?: string };

export const PORTAL_AUTH_INITIAL: PortalAuthState = {};

/** "12 Jul 2026", or an em dash. Matches how dates read in the app. */
export function shortDate(iso: string | null | undefined): string {
  if (!iso) return "—";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "—";
  return d.toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

/** "Jul 2026" — for the month-by-month table. */
export function monthLabel(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleDateString("en-IN", { month: "short", year: "numeric" });
}

/** What a roster row's status should read as, in HR's words rather than the
    database's. `not_activated` is the one that matters — it is the follow-up
    list, and "not yet" is an invitation where "inactive" is a verdict. */
export const PERSON_STATUS: Record<string, { label: string; tone: string }> = {
  active: { label: "Using it", tone: "pstatus--active" },
  not_activated: { label: "Not yet", tone: "pstatus--not" },
  removed: { label: "Removed", tone: "pstatus--removed" },
};

/** Shown instead of a crash when the site is deployed without the Supabase env
    vars — portalClient() returns null in that case (see lib/supabase-portal.ts).
    Calm and factual: the reader is HR, and nothing they did caused it. */
export const PORTAL_NOT_CONNECTED = {
  title: "The programme dashboard isn't connected yet.",
  body: "This part of ParentVeda is still being switched on. Try again a little later, or write to us and we will send your figures directly.",
};
