/* ============================================================
   The medical review gate.

   Red-flag lists, tool reference values and other medical numbers we add are
   drafted by us and wait for a doctor's sign-off. Until a file says
   `reviewed: true` (or `red_flags_reviewed: true`), the live site must not show
   them. Preview deploys and local dev show them, so the team can check them.

   Safe by default: a production build anywhere hides unreviewed content. Only
   Vercel preview/development, `next dev`, or SHOW_UNREVIEWED=1 shows it.
   Evaluated on the server; pass the result to client components as a prop.
   ============================================================ */

export function showUnreviewed(): boolean {
  if (process.env.SHOW_UNREVIEWED === "1") return true;
  const vercel = process.env.VERCEL_ENV;
  if (vercel) return vercel !== "production";
  return process.env.NODE_ENV === "development";
}

/** True when content with this review state may be shown on this deploy. */
export function canShow(reviewed: boolean): boolean {
  return reviewed || showUnreviewed();
}
