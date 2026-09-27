import type { Metadata } from "next";
import Link from "next/link";
import LandingCard from "@/components/LandingCard";
import Icon from "@/components/Icon";
import { ORG, LEGAL_BASE } from "@/lib/legal";

/* ============================================================
   /confirmed — where Supabase sends someone after they tap "confirm your
   email" during sign-up. Carried over from the old site.

   Supabase verifies the token itself, then redirects to the project's Site
   URL. Without this page a new user's first moment after trusting us with
   their email would be a browser error. Nothing happens here: confirmation
   already succeeded. The page must never fail or depend on anything.

   Supabase → Authentication → URL Configuration → Site URL:
       https://parentveda.in/confirmed
   ============================================================ */

const TITLE = "Email confirmed";
const SUMMARY = "Your email address is confirmed. Open the ParentVeda app and log in to finish setting up.";

export const metadata: Metadata = {
  title: TITLE,
  description: SUMMARY,
  alternates: { canonical: "/confirmed/" },
  // A transactional destination, not a page anyone should reach from Google.
  robots: { index: false, follow: false },
};

export default function ConfirmedPage() {
  return (
    <LandingCard tone="#C5D6C4">
      <div className="landing__intro">
        <span className="landing__tick" aria-hidden="true">
          <Icon name="check" size={30} />
        </span>
        <h1 className="landing__title">{TITLE}.</h1>
      </div>
      <p className="landing__lede">Thank you, your email address is verified.</p>
      {/* Deliberately not a deep link: she may be reading this on a laptop, and a
          button that silently does nothing is worse than a clear sentence. */}
      <p className="landing__lede landing__lede--strong">
        Open the <b>{ORG.brand}</b> app on your phone and log in. Everything you entered while signing up has been saved, so you
        can carry on where you left off.
      </p>
      <p className="landing__foot">
        You can close this tab. Something not right? Write to{" "}
        <a className="link" href={`mailto:${ORG.contactEmail}`}>
          {ORG.contactEmail}
        </a>
        , or read our{" "}
        <Link className="link" href={`${LEGAL_BASE}/`}>
          policies
        </Link>
        .
      </p>
    </LandingCard>
  );
}
