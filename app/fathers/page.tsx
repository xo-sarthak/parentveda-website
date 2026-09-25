import type { Metadata } from "next";
import Link from "next/link";
import Art from "@/components/Art";
import Icon from "@/components/Icon";
import { getAppHref } from "@/lib/site";

export const metadata: Metadata = {
  title: "For fathers",
  description:
    "ParentVeda's father's side: his own daily moment, a page for every week, things to read aloud, and a clear list of what to do next.",
};

const gets = [
  { icon: "sun", t: "A daily moment", d: "One thing worth knowing today, in a minute. Not a feed." },
  { icon: "calendar", t: "A page for every week", d: "Thirty-seven weeks, each with what’s changing for her, for the baby, and what he can do about it." },
  { icon: "book", t: "Read-aloud", d: "Short pieces to read to the bump. Babies start hearing voices mid-pregnancy, and his counts." },
  { icon: "check", t: "What to do next", d: "Hospital bag, paperwork, the birth plan: practical jobs, in order, so she doesn’t have to hand them out." },
  { icon: "bookmark", t: "His own journal", d: "Somewhere to write it down, for the child who’ll read it one day." },
  { icon: "sprout", t: "While you’re trying", d: "His side of it: sperm health, when a test is worth doing, and how to be useful in the long months." },
];

export default function FathersPage() {
  return (
    <div className="slate">
      <section className="phero" style={{ background: "var(--slate)" }} aria-labelledby="f-title">
        <div className="wrap phero__grid">
          <div className="phero__copy">
            <span className="phero__range" style={{ background: "rgba(224,146,28,.16)", color: "#f3c27a" }}>
              For fathers
            </span>
            <h1 id="f-title" className="display-xl">
              <span className="hl"><span>His own app.</span></span>
              <span className="hl"><span><em style={{ color: "#f3c27a" }}>Not a copy of hers.</em></span></span>
            </h1>
            <p className="lede rv rv-d2">
              Direct, practical and short. The father’s side of ParentVeda has its own look, its own daily moment and its own list of
              jobs. It’s built for the partner who wants to help and isn’t sure where to start.
            </p>
            <div className="hero__actions rv rv-d3">
              <Link href={getAppHref()} className="btn btn--light">
                Get ParentVeda <Icon name="arrow" />
              </Link>
            </div>
          </div>
          <div className="phero__art rv-img" style={{ background: "var(--sage)" }}>
            <Art slot="father" fallback="partner" alt="A young father smiling, looking to one side" sizes="(max-width: 900px) 92vw, 480px" priority />
          </div>
        </div>
      </section>

      <section className="section" aria-labelledby="gets-title" style={{ paddingTop: 24 }}>
        <div className="wrap">
          <header className="section-head">
            <span className="eyebrow rv">What he gets</span>
            <h2 id="gets-title" className="display-l rv rv-d1">
              Less reading. <em style={{ color: "#f3c27a" }}>More doing.</em>
            </h2>
          </header>
          <div className="cards3">
            {gets.map((g, i) => (
              <div key={g.t} className={`rv rv-d${(i % 3) + 1}`}>
                <span className="ic"><Icon name={g.icon} /></span>
                <h3>{g.t}</h3>
                <p>{g.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section" aria-labelledby="join-title" style={{ paddingTop: 0 }}>
        <div className="wrap split">
          <header>
            <span className="eyebrow rv">How he joins</span>
            <h2 id="join-title" className="display-l rv rv-d1">
              With her code.
            </h2>
          </header>
          <div className="prose rv rv-d2">
            <p>
              She shares a pairing code from her app. He enters it in his, and the two are linked. His home follows her stage and her
              week, so they’re always on the same page.
            </p>
            <div className="care">
              <Icon name="lock" size={26} />
              <p>He can read what she chooses to share. He can never change it. While you’re trying, he sees the chapter you’re in, never your raw cycle.</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
