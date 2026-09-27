import type { Metadata } from "next";
import { redirect } from "next/navigation";
import Link from "next/link";
import { portalClient, type SponsorPerson } from "@/lib/supabase-portal";
import { shortDate, PERSON_STATUS, PORTAL_NOT_CONNECTED } from "@/lib/portal";
import PortalShell from "../PortalShell";

/**
 * /portal/people — the follow-up list.
 *
 * THIS IS THE SCREEN WHERE THE PROMISE IS KEPT OR BROKEN, so it is worth being
 * exact about what is on it and why each part is allowed.
 *
 *   work_email, full_name  — HR SENT US THESE. The roster is their own
 *                            spreadsheet (sponsor_eligible_people, 0061);
 *                            showing it back is returning their data.
 *   status, activated_at   — one bit and a date: did this person start.
 *
 * And what is NOT on it, because sponsor_roster() does not return the columns:
 * no user id, no pregnancy, no child, no bookings, no reading, no last-seen,
 * no searches. A caller cannot select a column a function does not return, so
 * the line is held by a signature rather than by everyone remembering.
 *
 * The aggregate on /portal can be as rich as it is precisely because this page
 * stays thin.
 */
export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Your people",
  robots: { index: false, follow: false },
};

export default async function PortalPeople() {
  const supabase = await portalClient();

  /* No Supabase env vars on this deploy — say so calmly rather than crash. */
  if (!supabase) {
    return (
      <PortalShell>
        <div className="p-card p-empty">
          <h1 className="p-empty__title">{PORTAL_NOT_CONNECTED.title}</h1>
          <p className="p-text">{PORTAL_NOT_CONNECTED.body}</p>
        </div>
      </PortalShell>
    );
  }

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/portal/login/");

  const { data, error } = await supabase.rpc("sponsor_roster");
  const rows = ((data ?? []) as SponsorPerson[]) ?? [];

  const using = rows.filter((r) => r.status === "active");
  const notYet = rows.filter((r) => r.status === "not_activated");
  const removed = rows.filter((r) => r.status === "removed");

  return (
    <PortalShell>
      <header className="p-head p-head--tight">
        <Link href="/portal/" className="p-back">
          ← Programme
        </Link>
        <h1 className="p-title">Your people</h1>
        <p className="p-sub p-sub--lede">
          Who has started, and who has not. This is the only thing we record
          about a person here, never what they read, ask or book.
        </p>
      </header>

      {error && (
        <p className="p-alert p-alert--block">
          We could not load your list just now. Try again in a moment.
        </p>
      )}

      {!error && rows.length === 0 && (
        /* Never a blank space. The empty state is the next action: nobody has
           activated, and the thing that fixes that is one email. */
        <div className="p-card p-empty p-empty--spaced">
          <h2 className="p-empty__title p-empty__title--sm">
            Nobody has activated yet.
          </h2>
          <p className="p-text">
            Your team activates inside the ParentVeda app with the email address
            you gave us. Sharing that one line is usually all it takes, and if
            we do not have your staff list yet, send it over and we will load
            it.
          </p>
        </div>
      )}

      {/* NOT YET COMES FIRST, and that is the whole design of this page.
          "Who is using it" is a number they already saw on the dashboard.
          "Who has not started" is the list they can act on this afternoon. */}
      {notYet.length > 0 && (
        <PeopleGroup
          title="Not started yet"
          count={notYet.length}
          note="These people are on your list but have not activated. A reminder usually works."
          rows={notYet}
        />
      )}

      {using.length > 0 && (
        <PeopleGroup title="Using ParentVeda" count={using.length} rows={using} />
      )}

      {removed.length > 0 && (
        <PeopleGroup
          title="Removed"
          count={removed.length}
          note="No longer covered by your programme."
          rows={removed}
        />
      )}
    </PortalShell>
  );
}

function PeopleGroup({
  title,
  count,
  note,
  rows,
}: {
  title: string;
  count: number;
  note?: string;
  rows: SponsorPerson[];
}) {
  return (
    <section className="p-group">
      <h2 className="p-label">
        {title} · {count}
      </h2>
      {note && <p className="p-group__note">{note}</p>}

      <ul className="p-list">
        {rows.map((r) => {
          const s = PERSON_STATUS[r.status] ?? PERSON_STATUS.not_activated;
          return (
            <li key={`${r.work_email}-${r.status}`} className="p-row">
              <div className="p-row__who">
                {r.full_name && <p className="p-row__name">{r.full_name}</p>}
                <p className={r.full_name ? "p-row__email" : "p-row__name"}>
                  {r.work_email}
                </p>
              </div>

              <span className="p-row__date">
                {r.status === "active"
                  ? shortDate(r.activated_at)
                  : r.status === "removed"
                    ? shortDate(r.removed_at)
                    : ""}
              </span>

              <span className={`pstatus ${s.tone}`}>{s.label}</span>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
