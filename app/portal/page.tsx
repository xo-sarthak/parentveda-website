import type { Metadata } from "next";
import { redirect } from "next/navigation";
import Link from "next/link";
import {
  portalClient,
  denominator,
  type SponsorDashboard,
  type NotAnAdmin,
} from "@/lib/supabase-portal";
import { shortDate, PORTAL_NOT_CONNECTED } from "@/lib/portal";
import PortalShell from "./PortalShell";

/**
 * /portal — what an organisation sees about the benefit it pays for.
 *
 * A THIN RENDERER, ON PURPOSE. Every number here arrives already aggregated
 * from sponsor_dashboard() (migrations 0060/0061). Nothing is computed in this
 * file, and the rows behind the numbers never leave the database.
 *
 * That is not tidiness, it is the privacy promise being structural rather than
 * remembered: to compute "how many consultations" in JavaScript, this page
 * would first have to RECEIVE the consultations. It never does. The same
 * design is why this page exists at all after the app screen was built — both
 * call the same two functions, so a second surface was a front-end job rather
 * than a rebuild.
 *
 * The company is resolved from the session inside the database. There is no
 * sponsor id in this file, in the URL, or in any request — so a guessed URL
 * returns nothing, and there is nothing for a modified client to change.
 */
export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Programme",
  robots: { index: false, follow: false },
};

export default async function PortalHome() {
  const supabase = await portalClient();

  /* No Supabase env vars on this deploy. proxy.ts lets the request through in
     that case, so this is where it lands — calmly, not as a crash. */
  if (!supabase) {
    return (
      <PortalShell>
        <Empty title={PORTAL_NOT_CONNECTED.title} body={PORTAL_NOT_CONNECTED.body} />
      </PortalShell>
    );
  }

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/portal/login/");

  const { data, error } = await supabase.rpc("sponsor_dashboard");
  const d = (data ?? null) as SponsorDashboard | NotAnAdmin | null;

  if (error || !d) {
    return (
      <PortalShell>
        <Empty
          title="We could not load your programme."
          body="Something went wrong on our side. Try again in a moment, and tell us if it keeps happening."
        />
      </PortalShell>
    );
  }

  if (d.ok !== true) {
    /* Signing in worked; this account simply does not administer a programme.
       Almost every ParentVeda user is in this position, so it is not an error
       and must not read like one. */
    return (
      <PortalShell>
        <Empty
          title="This account does not administer a programme."
          body="If you handle the ParentVeda benefit for your organisation, ask us to give your account access. You will need to have activated the benefit with your own work email first."
        />
      </PortalShell>
    );
  }

  const den = denominator(d);
  const pct = d.activation_rate;
  const notYet = den.value === null ? null : Math.max(den.value - d.activated, 0);

  return (
    <PortalShell sponsorName={d.sponsor_name}>
      <header className="p-head">
        <h1 className="p-title">{d.sponsor_name}</h1>
        <p className="p-sub">
          {d.renewal_at
            ? `Renews ${shortDate(d.renewal_at)}`
            : "No renewal date on file"}
        </p>
      </header>

      {/* THE HEADLINE — one sentence HR can repeat to their board.
          Everything else on the page is the detail underneath it. A grid of
          equally-weighted numbers makes the reader do the summarising, and
          they will summarise it wrong. */}
      <section className="p-card">
        <p className="p-headline">
          {den.value === null ? (
            <>
              <span className="p-accent">{d.activated}</span> people are
              using ParentVeda
            </>
          ) : (
            <>
              <span className="p-accent">{d.activated}</span> of{" "}
              {den.value} people are using ParentVeda
            </>
          )}
        </p>

        {pct !== null && (
          <div className="p-take">
            <div className="p-meter">
              <div
                className="p-meter__fill"
                style={{ width: `${Math.min(Math.max(pct, 0), 100)}%` }}
              />
            </div>
            <div className="p-meta">
              <span>
                <strong>{pct}%</strong> take-up
                {d.eligible_listed > 0
                  ? " of the people you listed"
                  : " of the seats you bought"}
              </span>
              {notYet !== null && notYet > 0 && (
                <span>{notYet} have not activated yet</span>
              )}
              {d.activated_last_30d > 0 && (
                <span>+{d.activated_last_30d} in the last 30 days</span>
              )}
            </div>
          </div>
        )}
      </section>

      {/* Consultations, or an honest account of why they are missing. */}
      <section className="p-card">
        <h2 className="p-label">Consultations</h2>

        {d.suppressed ? (
          /* SUPPRESSION, SHOWN RATHER THAN HIDDEN. The server returns null, not
             zero, and rendering null as "0" would turn a policy into a false
             claim — a sponsor reading "0 consultations" concludes the benefit
             is failing, which is the opposite of what the data says. */
          <div className="p-note">
            <p className="p-note__title">
              Held back until {d.min_cohort} people have activated
            </p>
            <p className="p-text">
              In a small group, &ldquo;two consultations this month&rdquo; is
              close enough to a name. We would rather show you nothing than show
              you someone.
            </p>
          </div>
        ) : (
          <dl className="p-stats">
            <Stat label="Booked" value={d.consultations_booked ?? 0} />
            <Stat label="Attended" value={d.consultations_completed ?? 0} />
            <Stat label="Upcoming" value={d.consultations_upcoming ?? 0} />
          </dl>
        )}
      </section>

      {/* What this page cannot show, said out loud. It is the reason employees
          are willing to activate at all, so it belongs on the page the
          employer looks at rather than only in a contract. */}
      <section className="p-card p-card--quiet">
        <h2 className="p-card__title">What this dashboard cannot show</h2>
        <p className="p-text">
          Nothing about an individual. Not who booked, not what they read, not
          what they asked, and not how long they spent in the app. We do not
          measure that last one at all, for anyone. Take-up and totals are the
          whole picture, and that is exactly what makes people willing to
          activate.
        </p>
      </section>

      <div className="p-actions">
        <Link href="/portal/people/" className="btn btn--ink">
          See your people
          <span aria-hidden>→</span>
        </Link>
        {/* HR forwards numbers upward far more often than they browse them, so
            the report is a first-class output rather than a link in a footer. */}
        <Link href="/portal/report/" className="btn btn--ghost">
          Report for your leadership
        </Link>
      </div>
    </PortalShell>
  );
}

function Stat({ label, value }: { label: string; value: number }) {
  return (
    <div className="p-stat">
      <dd className="p-stat__value">{value}</dd>
      <dt className="p-stat__label">{label}</dt>
    </div>
  );
}

function Empty({ title, body }: { title: string; body: string }) {
  return (
    <div className="p-card p-empty">
      <h1 className="p-empty__title">{title}</h1>
      <p className="p-text">{body}</p>
    </div>
  );
}
