import Link from "next/link";
import Image from "next/image";
import Wordmark from "@/components/Wordmark";
import { signOut } from "@/app/actions/portal-auth";

/**
 * The frame every portal page sits in.
 *
 * Deliberately plain compared with the marketing site — no decor, no blobs, no
 * reveal animations. This is a work surface someone opens on a Tuesday
 * afternoon to answer a question from their CFO, and the site's warmth would
 * read as noise here. It is still unmistakably ParentVeda: same palette, same
 * fonts, same corner radii.
 *
 * The root carries `portal`, which is what app/portal.css keys on to hide the
 * site's own header and footer (`body:has(.portal) .hdr`) — the root layout
 * renders them on every page and is not edited for the portal's sake.
 *
 * The content area is a <div>, not the old site's <main>: the root layout
 * already wraps every page in <main id="main">, and a second <main> inside it
 * is invalid HTML.
 */
export default function PortalShell({
  children,
  sponsorName,
}: {
  children: React.ReactNode;
  sponsorName?: string;
}) {
  return (
    <div className="portal">
      <header className="portal__hdr">
        <div className="portal__bar">
          <Link href="/portal/" className="portal__brand" aria-label="ParentVeda programme">
            <Image src="/brand/pv-mark.png" alt="" width={34} height={34} priority />
            <Wordmark />
          </Link>
          <span className="portal__tag">Programme</span>
          <div className="portal__right">
            {sponsorName && <span className="portal__sponsor">{sponsorName}</span>}
            <form action={signOut}>
              <button type="submit" className="portal__signout">
                Sign out
              </button>
            </form>
          </div>
        </div>
      </header>

      <div className="portal__main">{children}</div>

      <footer className="portal__foot">
        <p>
          Figures update live. Behavioural totals are withheld while a group is
          small enough that they would identify someone.{" "}
          <a href="/legal/privacy/">Privacy policy</a>
        </p>
      </footer>
    </div>
  );
}
