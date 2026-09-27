import type { Metadata } from "next";
import Link from "next/link";
import LandingCard from "@/components/LandingCard";
import BounceToPlay from "@/components/BounceToPlay";
import Icon from "@/components/Icon";
import { APP_LIVE } from "@/lib/invite";
import {
  carePlayStoreUrl,
  getCarePartner,
  isValidToken,
  normaliseToken,
  partnerInitials,
  sanitiseCampaign,
  sanitiseChannel,
  type CarePartner,
} from "@/lib/care";

/* ============================================================
   /care/<TOKEN> — the Care Partner landing page. Carried over from the old
   site with its rules intact; only the look is new.

   The bridge between a QR poster on a clinic wall and the app. A phone
   camera cannot open an app that is not installed, so every scan lands here.

   1. This page NEVER errors. Unknown, expired, revoked or malformed token:
      she still gets a normal ParentVeda page and still reaches the store. A
      broken poster costs the doctor their credit, never the parent the app.
      So: no notFound(), no error state, always 200.
   2. The redirect is client-side only (BounceToPlay), so link crawlers read
      the doctor's name instead of following a 3xx to the Play Store.
   ============================================================ */

export const dynamic = "force-dynamic";

const BLURB =
  "ParentVeda is a calm companion for trying to conceive, pregnancy and parenting, written for Indian families.";

export async function generateMetadata({ params }: { params: Promise<{ token: string }> }): Promise<Metadata> {
  const token = normaliseToken((await params).token);
  const partner = await getCarePartner(token);
  const title = partner ? `${partner.trustLabel} ${partner.name}` : "You’ve been invited to ParentVeda";

  return {
    title,
    description: BLURB,
    // One unique URL per token, near-duplicate content: never index it.
    robots: { index: false, follow: false },
    openGraph: {
      type: "website",
      locale: "en_IN",
      siteName: "ParentVeda",
      title,
      description: BLURB,
      images: [{ url: "/parentveda-logo.jpg", width: 1024, height: 1024, alt: "ParentVeda" }],
    },
    twitter: { card: "summary_large_image", title, description: BLURB },
  };
}

export default async function CarePage({
  params,
  searchParams,
}: {
  params: Promise<{ token: string }>;
  searchParams: Promise<{ [k: string]: string | string[] | undefined }>;
}) {
  const token = normaliseToken((await params).token);
  const sp = await searchParams;

  const valid = isValidToken(token);
  const channel = sanitiseChannel(typeof sp.ch === "string" ? sp.ch : undefined);
  const campaign = sanitiseCampaign(typeof sp.cm === "string" ? sp.cm : undefined);

  /* A malformed token gets the generic page and NO referrer: junk must not
     ride into the store, where it would be credited to nobody. */
  const playUrl = valid ? carePlayStoreUrl(token, { channel, campaign }) : null;
  const partner = valid ? await getCarePartner(token) : null;

  return (
    <LandingCard tone="#C5D6C4">
      {APP_LIVE && playUrl ? <BounceToPlay url={playUrl} storageKey={`pv:care-bounced:${token}`} /> : null}

      {partner ? <PartnerIntro partner={partner} /> : <GenericIntro />}

      <p className="landing__lede">{BLURB}</p>

      {/* The token, shown plainly. On iPhone this is the whole mechanism:
          Apple has no install referrer, so she types it in the app. */}
      {valid ? (
        <div className="landing__code">
          <span>Your code</span>
          <b>{token}</b>
          <em>Enter this in the app if it asks.</em>
        </div>
      ) : null}

      <div className="landing__actions">
        {APP_LIVE && playUrl ? (
          <>
            <a href={playUrl} className="btn btn--ink">
              <Icon name="play" /> Get the app
            </a>
            <p className="small">Your code is applied on its own when you open the app.</p>
          </>
        ) : (
          <>
            <Link href="/#waitlist" className="btn btn--ink">
              Tell me when it’s live <Icon name="arrow" />
            </Link>
            <p className="small">
              ParentVeda is launching soon on Android.{valid ? " Keep this code; it’s yours when the app arrives." : ""}
            </p>
          </>
        )}
        <Link href="/" className="btn btn--ghost">
          Explore ParentVeda
        </Link>
      </div>

      <p className="landing__foot">
        ParentVeda explains and helps you prepare. It never diagnoses, and your doctor always has the final word.{" "}
        <Link href="/legal/medical-disclaimer/" className="link">
          Read more
        </Link>
      </p>
    </LandingCard>
  );
}

function PartnerIntro({ partner }: { partner: CarePartner }) {
  const shape = partner.kind === "organisation" ? "landing__avatar--org" : "";
  return (
    <div className="landing__intro">
      {partner.imageUrl ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={partner.imageUrl} alt={partner.name} width={96} height={96} className={`landing__avatar ${shape}`} draggable={false} />
      ) : (
        <span aria-hidden="true" className={`landing__avatar landing__avatar--initials ${shape}`}>
          {partnerInitials(partner.name)}
        </span>
      )}
      {/* From an allowlist (safeTrustLabel): a doctor recommending something to
          a patient is not an advertisement, and no database value can make
          this page say otherwise. */}
      <span className="landing__trust">{partner.trustLabel}</span>
      <h1 className="landing__title">{partner.name}</h1>
      {partner.subtitle ? <p className="landing__sub">{partner.subtitle}</p> : null}
    </div>
  );
}

function GenericIntro() {
  return (
    <div className="landing__intro">
      <span className="landing__trust">An invitation</span>
      <h1 className="landing__title">
        You’ve been invited to <em>ParentVeda.</em>
      </h1>
    </div>
  );
}
