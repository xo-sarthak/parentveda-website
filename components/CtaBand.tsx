import Link from "next/link";
import Art from "./Art";
import Icon from "./Icon";
import { getAppHref, site } from "@/lib/site";

export default function CtaBand({
  title = "Start where you are.",
  body = "No account needed to start. Tell ParentVeda which stage you’re in, and your home is ready in a minute.",
}: {
  title?: string;
  body?: string;
}) {
  return (
    <section className="cta" aria-labelledby="cta-title">
      <div className="wrap">
        <div className="cta__card">
          <div className="cta__copy">
            <span className="eyebrow eyebrow--plain rv">{site.appLive ? "On Google Play" : "Coming soon to Google Play"}</span>
            <h2 id="cta-title" className="display-l rv rv-d1">
              {title}
            </h2>
            <p className="lede rv rv-d2">{body}</p>
            <div className="cta__actions rv rv-d3">
              <Link href={getAppHref()} className="btn btn--ink">
                <Icon name="phone" /> Get ParentVeda
              </Link>
              <Link href="/ask-veda" className="btn btn--ghost">
                How Ask Veda works
              </Link>
            </div>
          </div>
          <div className="cta__art rv-img" aria-hidden="true">
            <Art slot="download-hello" fallback="hello" alt="" sizes="(max-width: 800px) 90vw, 420px" />
          </div>
        </div>
      </div>
    </section>
  );
}
