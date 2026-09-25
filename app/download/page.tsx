import type { Metadata } from "next";
import Link from "next/link";
import Art from "@/components/Art";
import Icon from "@/components/Icon";
import { Phone, WeekScreen, AskScreen, CycleScreen } from "@/components/Phone";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Get the app",
  description: "ParentVeda is coming to Google Play first. No account needed to start.",
};

export default function DownloadPage() {
  return (
    <>
      <section className="phero" style={{ ["--tone" as string]: "#E8C4CE", ["--deep-tone" as string]: "#7A3348" }} aria-labelledby="dl-title">
        <div className="wrap phero__grid">
          <div className="phero__copy">
            <span className="phero__range">{site.appLive ? "On Google Play" : "Coming soon"}</span>
            <h1 id="dl-title" className="display-xl">
              <span className="hl"><span>Start where</span></span>
              <span className="hl"><span><em>you are.</em></span></span>
            </h1>
            {site.appLive ? (
              <>
                <p className="lede rv rv-d2">Free to download. No account needed to start.</p>
                <a href={site.playUrl} className="btn btn--ink rv rv-d3">
                  <Icon name="play" /> Get it on Google Play
                </a>
              </>
            ) : (
              <>
                <p className="lede rv rv-d2">
                  ParentVeda is launching on Google Play first, with iPhone to follow. The link will be right here the day it goes
                  live.
                </p>
                <p className="notice rv rv-d3">
                  <Icon name="calendar" size={18} /> Android first · iPhone after
                </p>
                <div className="hero__actions rv rv-d4">
                  <Link href="/contact?topic=launch" className="btn btn--ink">
                    Tell me when it’s live <Icon name="arrow" />
                  </Link>
                  <Link href="/#stages" className="btn btn--ghost">
                    See what’s inside
                  </Link>
                </div>
              </>
            )}
          </div>
          <div className="phero__art rv-img" style={{ aspectRatio: "1" }}>
            <Art slot="download-hello" fallback="hello" alt="A young mother waving hello" sizes="(max-width: 900px) 92vw, 480px" priority />
          </div>
        </div>
      </section>
      <section className="section" style={{ paddingTop: 16 }} aria-label="A look inside the app">
        <div className="wrap">
          <div className="phones">
            <div className="rv rv-d1"><Phone><CycleScreen /></Phone><p>Trying — your cycle, in plain words</p></div>
            <div className="rv rv-d2"><Phone><WeekScreen /></Phone><p>Pregnancy — every week has its own page</p></div>
            <div className="rv rv-d3"><Phone><AskScreen /></Phone><p>Ask Veda — calm answers, never a diagnosis</p></div>
          </div>
        </div>
      </section>
    </>
  );
}
