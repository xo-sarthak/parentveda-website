import Link from "next/link";
import Art from "./Art";
import Icon from "./Icon";
import Waitlist from "./Waitlist";
import { getAppHref, site } from "@/lib/site";

// The closing band on every page. Before launch it carries the waitlist
// (id="waitlist" is where /#waitlist links from the care and invite pages
// land); on launch day, flipping site.appLive turns it back into the
// Get ParentVeda button.
export default function CtaBand({
  title = "Start where you are.",
  // Kept for revert — "No account needed to start. Tell ParentVeda which stage you’re in, and your home is ready in a minute."
  body = "Trying, expecting or raising, your home is ready in a minute, set to the phase you’re in. No account needed to start, and we’re with you from there.",
  source = "cta",
}: {
  title?: string;
  body?: string;
  source?: string;
}) {
  return (
    <section className="cta" id="waitlist" aria-labelledby="cta-title">
      <div className="wrap">
        <div className="cta__card">
          <div className="cta__copy">
            <span className="eyebrow eyebrow--plain rv">{site.appLive ? "On Google Play" : "Coming soon to Google Play"}</span>
            <h2 id="cta-title" className="display-l rv rv-d1">
              {title}
            </h2>
            <p className="lede rv rv-d2">{body}</p>
            {site.appLive ? (
              <div className="cta__actions rv rv-d3">
                <Link href={getAppHref()} className="btn btn--ink">
                  <Icon name="phone" /> Get ParentVeda
                </Link>
                <Link href="/ask-veda/" className="btn btn--ghost">
                  How Ask Veda works
                </Link>
              </div>
            ) : (
              <div className="rv rv-d3" style={{ width: "100%" }}>
                <Waitlist source={source} />
              </div>
            )}
          </div>
          <div className="cta__art rv-img" aria-hidden="true">
            <Art slot="download-hello" fallback="hello" alt="" sizes="(max-width: 800px) 90vw, 420px" />
          </div>
        </div>
      </div>
    </section>
  );
}
