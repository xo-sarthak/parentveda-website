import type { Metadata } from "next";
import Art from "@/components/Art";
import Icon from "@/components/Icon";
import CtaBand from "@/components/CtaBand";

export const metadata: Metadata = {
  title: "Why we built ParentVeda",
  description: "One calm companion for an Indian family, from the first try to the school years — and the rules it keeps.",
};

const order = [
  "Your treating doctor",
  "A lab result",
  "A scan",
  "A medicine schedule your doctor set",
  "What you notice yourself",
  "A device reading",
  "ParentVeda’s own calculation",
  "A population average",
];

export default function AboutPage() {
  return (
    <>
      <section className="phero" style={{ ["--tone" as string]: "#E8D9C0", ["--deep-tone" as string]: "#6B4A1F" }} aria-labelledby="ab-title">
        <div className="wrap phero__grid">
          <div className="phero__copy">
            <span className="phero__range">Why ParentVeda</span>
            <h1 id="ab-title" className="display-xl">
              <span className="hl"><span>Families don’t live</span></span>
              <span className="hl"><span><em>in three apps.</em></span></span>
            </h1>
            <p className="lede rv rv-d2">
              A couple trying for a baby downloads one app. The positive test sends them to another. The birth, to a third. Each one starts
              from zero, and most of them were written for somewhere else. ParentVeda is one companion that stays for the whole journey,
              written for the way Indian families actually live.
            </p>
          </div>
          <div className="phero__art rv-img">
            <Art slot="about-home" fallback="home" alt="A warmly lit family home at dusk" sizes="(max-width: 900px) 92vw, 480px" priority />
          </div>
        </div>
      </section>

      <section className="section" aria-labelledby="calm-title" style={{ paddingTop: 24 }}>
        <div className="wrap split">
          <header>
            <span className="eyebrow rv">What we believe</span>
            <h2 id="calm-title" className="display-l rv rv-d1">
              Calm is a feature, <em>not a style.</em>
            </h2>
          </header>
          <div className="prose rv rv-d2">
            <p>
              The person opening ParentVeda is often anxious, tired and new to all of this, and is usually reading one-handed at 2 a.m. So
              there are no countdowns, no streaks, no alarm-red screens and nothing that makes you feel behind.
            </p>
            <p>
              We explain a word before we use it. We say plainly when something is sponsored. And we treat it as a couple’s journey, not a
              mother’s chore list: the father gets his own side of the app.
            </p>
          </div>
        </div>
      </section>

      <section className="section" aria-labelledby="order-title" style={{ paddingTop: 0 }}>
        <div className="wrap split">
          <header>
            <span className="eyebrow rv">Whose answer wins</span>
            <h2 id="order-title" className="display-l rv rv-d1">
              We are <em>never</em> the authority.
            </h2>
            <p className="lede rv rv-d2">
              When two sources disagree, ParentVeda follows this order, strongest first. Our own calculation sits second from the bottom,
              on purpose.
            </p>
          </header>
          <ol className="anatomy">
            {order.map((o, i) => (
              <li key={o} className={`rv${i === 6 ? " is-quiet" : ""}`}>
                <span>
                  <b>{o}</b>
                  {i === 6 ? "That’s us. We explain what your doctor decides. We don’t compete with it." : null}
                </span>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="section" aria-labelledby="own-title" style={{ paddingTop: 0 }}>
        <div className="wrap">
          <header className="section-head">
            <span className="eyebrow rv">When a clinician is in charge</span>
            <h2 id="own-title" className="display-l rv rv-d1">
              Explain, remind, prepare. <em>Never overrule.</em>
            </h2>
          </header>
          <div className="cards3">
            <div className="rv rv-d1">
              <span className="ic"><Icon name="book" /></span>
              <h3>We explain</h3>
              <p>What a trigger shot does, why a scan is booked, what a word on your report means.</p>
            </div>
            <div className="rv rv-d2">
              <span className="ic"><Icon name="calendar" /></span>
              <h3>We remind</h3>
              <p>The medicine, the appointment, the test your doctor asked for.</p>
            </div>
            <div className="rv rv-d3">
              <span className="ic"><Icon name="x" /></span>
              <h3>We don’t recalculate</h3>
              <p>If a scan set your due date, it’s the scan’s date. If a clinic runs your cycle, we stop predicting it.</p>
            </div>
          </div>
        </div>
      </section>

      <CtaBand />
    </>
  );
}
