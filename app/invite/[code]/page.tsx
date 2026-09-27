import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import LandingCard from "@/components/LandingCard";
import BounceToPlay from "@/components/BounceToPlay";
import Icon from "@/components/Icon";
import { APP_LIVE, isValidCode, normaliseCode, playStoreUrl } from "@/lib/invite";

/**
 * /invite/[code] — the landing page for an invite shared from the app.
 * Carried over from the old site; only the look is new.
 *
 * On Android it exists for a moment: BounceToPlay sends the phone to Play with
 * the code as an install referrer, and the app picks it up on first launch.
 * Everywhere else, and while APP_LIVE is false, it is a real page that shows
 * the code so it can be entered by hand.
 */

// Codes are unbounded and one per person: never prerender, never index.
export const dynamic = "force-dynamic";

const DESCRIPTION =
  "A friend has invited you to ParentVeda, a calm companion for trying to conceive, pregnancy and parenting, made for Indian families.";

export async function generateMetadata({ params }: { params: Promise<{ code: string }> }): Promise<Metadata> {
  const code = normaliseCode((await params).code);
  if (!isValidCode(code)) return { robots: { index: false, follow: false } };
  const title = "You’ve been invited to ParentVeda";
  return {
    title,
    description: DESCRIPTION,
    robots: { index: false, follow: false },
    // This is why the page renders HTML instead of redirecting: it becomes
    // the preview card in the WhatsApp chat.
    openGraph: {
      type: "website",
      locale: "en_IN",
      siteName: "ParentVeda",
      title,
      description: DESCRIPTION,
      images: [{ url: "/parentveda-logo.jpg", width: 1024, height: 1024, alt: "ParentVeda" }],
    },
    twitter: { card: "summary_large_image", title, description: DESCRIPTION, images: ["/parentveda-logo.jpg"] },
  };
}

export default async function InvitePage({ params }: { params: Promise<{ code: string }> }) {
  const code = normaliseCode((await params).code);
  // Junk in the path gets the normal 404, not an invite for a code that can't exist.
  if (!isValidCode(code)) notFound();
  const playUrl = playStoreUrl(code);

  return (
    <LandingCard tone="#E8C4CE">
      {APP_LIVE ? <BounceToPlay url={playUrl} storageKey={`pv:invite-bounced:${code}`} /> : null}

      <div className="landing__intro">
        <span className="landing__trust">An invitation</span>
        <h1 className="landing__title">
          A friend saved you <em>a place.</em>
        </h1>
      </div>
      <p className="landing__lede">
        ParentVeda walks with you from trying to conceive, through every week of pregnancy, into raising your child. Calm,
        plain words, written for Indian families.
      </p>

      {/* Install Referrer carries the code on its own in the happy path, but
          not through a sideload, some OEM stores, or an iPhone. */}
      <div className="landing__code">
        <span>Your invite code</span>
        <b>{code}</b>
        <em>Enter this in the app if it asks.</em>
      </div>

      <div className="landing__actions">
        {APP_LIVE ? (
          <>
            <a href={playUrl} className="btn btn--ink">
              <Icon name="play" /> Get ParentVeda on Google Play
            </a>
            <p className="small">Your code is applied on its own when you open the app.</p>
          </>
        ) : (
          <>
            <Link href="/#waitlist" className="btn btn--ink">
              Tell me when it’s live <Icon name="arrow" />
            </Link>
            <p className="small">ParentVeda is launching soon on Android. Keep this code; it’s yours when the app arrives.</p>
          </>
        )}
        <Link href="/" className="btn btn--ghost">
          Explore ParentVeda
        </Link>
      </div>

      <p className="landing__foot">
        Already have the app? Open ParentVeda and enter <b>{code}</b> when it asks for an invite code.
      </p>
    </LandingCard>
  );
}
