"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import weeks from "@/lib/weeks.json";
import { stages } from "@/lib/stages";
import Icon from "../Icon";

// The signature: one thread, drawn by your scroll, that never breaks
// between stages — the product thesis (one companion, not four apps)
// rendered as a line. Pregnancy pins, and scrolling walks the weeks 4 → 40.

type Week = { week: number; size: string; length: string; milestone: string; note: string };
const W = weeks as Week[];

const THREAD =
  "M20 0 C34 60 6 120 20 180 S34 300 20 360 S6 480 20 540 S34 660 20 720 S6 840 20 900 S30 960 20 1000";

function trimester(w: number) {
  return w <= 13 ? "First trimester" : w <= 27 ? "Second trimester" : "Third trimester";
}

const parentMoments = [
  { when: "Day one", what: "The first 40 days begin — for the baby, and for the mother’s own recovery." },
  { when: "6 weeks", what: "The first round of vaccines on the IAP schedule, and very often the first real smile." },
  { when: "6 months", what: "Annaprashan, first foods, and a kitchen that suddenly needs a second plan." },
  { when: "1 year", what: "First steps for some, first words for others — and neither is a race." },
  { when: "2 years", what: "Big feelings, big words, and the potty days." },
  { when: "3 to 5", what: "Early learning at home, habits, and getting ready for school." },
];

export default function Journey() {
  const root = useRef<HTMLElement>(null);
  const draw = useRef<SVGPathElement>(null);
  const scrub = useRef<HTMLDivElement>(null);
  const [week, setWeek] = useState(4);
  const [reduce, setReduce] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduce(mq.matches);
    const onMq = () => setReduce(mq.matches);
    mq.addEventListener("change", onMq);
    return () => mq.removeEventListener("change", onMq);
  }, []);

  useEffect(() => {
    if (reduce) {
      if (draw.current) draw.current.style.strokeDashoffset = "0";
      return;
    }
    let raf = 0;
    const tick = () => {
      raf = 0;
      const vh = window.innerHeight;
      const r = root.current?.getBoundingClientRect();
      if (r && draw.current) {
        const p = Math.min(1, Math.max(0, (vh * 0.62 - r.top) / r.height));
        draw.current.style.strokeDashoffset = String(1 - p);
      }
      const s = scrub.current?.getBoundingClientRect();
      if (s) {
        const span = s.height - vh;
        const p = Math.min(1, Math.max(0, -s.top / span));
        const w = 4 + Math.round(p * 36);
        setWeek((prev) => (prev === w ? prev : w));
      }
    };
    const on = () => {
      if (!raf) raf = requestAnimationFrame(tick);
    };
    tick();
    window.addEventListener("scroll", on, { passive: true });
    window.addEventListener("resize", on);
    return () => {
      window.removeEventListener("scroll", on);
      window.removeEventListener("resize", on);
      if (raf) cancelAnimationFrame(raf);
    };
  }, [reduce]);

  // The slider is the keyboard / reduced-motion way through the weeks.
  const onSlide = (w: number) => {
    setWeek(w);
    const s = scrub.current;
    if (!reduce && s) {
      const top = s.getBoundingClientRect().top + window.scrollY;
      const span = s.offsetHeight - window.innerHeight;
      window.scrollTo({ top: top + ((w - 4) / 36) * span, behavior: "auto" });
    }
  };

  const cur = W.find((x) => x.week === week) ?? W[0];
  const [ttc, preg, pp, sk] = stages;

  return (
    <section className={`jny${reduce ? " jny--still" : ""}`} ref={root} aria-labelledby="jny-title" id="journey">
      <svg className="jny__thread" viewBox="0 0 40 1000" preserveAspectRatio="none" aria-hidden="true">
        <path d={THREAD} className="jny__thread-bg" vectorEffect="non-scaling-stroke" />
        <path d={THREAD} ref={draw} className="jny__thread-fg" pathLength={1} vectorEffect="non-scaling-stroke" />
      </svg>

      <div className="wrap jny__inner">
        <header className="section-head jny__head">
          <span className="eyebrow rv">One companion, not four apps</span>
          <h2 id="jny-title" className="display-l rv rv-d1">
            It starts before the first test <em>and doesn’t end at the delivery room.</em>
          </h2>
          <p className="lede rv rv-d2">
            Everything you tell ParentVeda carries forward: the day it’s positive, the day you come home, the day they start
            school. Nothing to re-enter, and no new app to learn. Follow the thread.
          </p>
        </header>

        {/* Act 1 — Trying */}
        <article className="act" style={{ ["--act" as string]: ttc.colour, ["--act-deep" as string]: ttc.deep }}>
          <span className="act__node" aria-hidden="true" />
          <div className="act__copy">
            <span className="act__tag rv">Trying to conceive</span>
            <h3 className="display-m rv rv-d1">Understand your cycle. Know when to ask for help.</h3>
            <p className="rv rv-d2">
              Seven doors — fertile window, PCOS, IVF &amp; IUI, getting ready, his side, after a loss, mind &amp; body. No
              countdowns, no scores, and never your ‘chance this month’.
            </p>
            <Link href={`/${ttc.slug}`} className="link rv rv-d3">
              Inside trying to conceive
            </Link>
          </div>
          <div className="act__card rv rv-d2">
            <svg viewBox="0 0 200 200" className="act__ring" aria-hidden="true">
              <circle cx="100" cy="100" r="78" fill="none" stroke="rgba(255,255,255,.7)" strokeWidth="14" />
              <circle cx="100" cy="100" r="78" fill="none" stroke="#fff" strokeWidth="14" strokeDasharray="490" strokeDashoffset="250" strokeLinecap="round" transform="rotate(-90 100 100)" />
              <circle cx="100" cy="100" r="78" fill="none" stroke="#6A30B6" strokeWidth="14" strokeDasharray="60 490" strokeDashoffset="-236" strokeLinecap="round" transform="rotate(-90 100 100)" />
            </svg>
            <ul className="act__facts">
              <li><Icon name="check" size={18} /> Cycle, ovulation and symptom companions</li>
              <li><Icon name="check" size={18} /> A test library with Indian prices</li>
              <li><Icon name="check" size={18} /> Steps back when your clinic takes over</li>
            </ul>
          </div>
        </article>
      </div>

      {/* Act 2 — Pregnancy: the pinned week walk */}
      <div className="scrub" ref={scrub} style={{ ["--act" as string]: preg.colour, ["--act-deep" as string]: preg.deep }}>
        <div className="scrub__pin">
          <div className="wrap scrub__grid">
            <span className="act__node act__node--pin" aria-hidden="true" />
            <div className="scrub__copy">
              <span className="act__tag">Pregnancy · {trimester(week)}</span>
              <p className="scrub__week" aria-live="polite">
                <span className="scrub__label">Week</span>
                <span className="scrub__num">{week}</span>
              </p>
              <p className="scrub__size">
                About the size of <b>{cur.size}</b>
                <span> · {cur.length}</span>
              </p>
              <p className="scrub__milestone">{cur.milestone}</p>
              <p className="scrub__note">“{cur.note}”</p>
              <label className="scrub__slider">
                <span className="visually-hidden">Choose a pregnancy week</span>
                <input type="range" min={4} max={40} value={week} onChange={(e) => onSlide(Number(e.target.value))} />
                <span className="scrub__ticks" aria-hidden="true">
                  <span>4</span>
                  <span>13</span>
                  <span>27</span>
                  <span>40</span>
                </span>
              </label>
              {!reduce && <p className="scrub__hint small">Keep scrolling — every week has its own page.</p>}
            </div>
            <div className="scrub__art" aria-hidden="true">
              <div className="scrub__disc" />
              {W.map((x) => (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  key={x.week}
                  src={`/weeks/week_${String(x.week).padStart(2, "0")}.webp`}
                  alt=""
                  width={560}
                  height={560}
                  loading={x.week === 4 ? "eager" : "lazy"}
                  decoding="async"
                  className={x.week === week ? "is-on" : undefined}
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="wrap jny__inner">
        {/* Act 3 — Parenting */}
        <article className="act act--wide" style={{ ["--act" as string]: pp.colour, ["--act-deep" as string]: pp.deep }}>
          <span className="act__node" aria-hidden="true" />
          <div className="act__copy">
            <span className="act__tag rv">Parenting · birth to 5</span>
            <h3 className="display-m rv rv-d1">Only what changes, when it changes.</h3>
            <p className="rv rv-d2">
              ParentVeda knows your child’s age and shows you what matters now — not a feed of everything at once.
            </p>
            <Link href={`/${pp.slug}`} className="link rv rv-d3">
              Inside parenting
            </Link>
          </div>
          <ol className="moments">
            {parentMoments.map((m, i) => (
              <li key={m.when} className={`rv rv-d${Math.min(i + 1, 5)}`}>
                <span className="moments__when">{m.when}</span>
                <span className="moments__what">{m.what}</span>
              </li>
            ))}
          </ol>
        </article>

        {/* Act 4 — Skilling */}
        <article className="act act--wide act--last" style={{ ["--act" as string]: sk.colour, ["--act-deep" as string]: sk.deep }}>
          <span className="act__node" aria-hidden="true" />
          <div className="act__copy">
            <span className="act__tag rv">Skilling · ages 6 to 14</span>
            <h3 className="display-m rv rv-d1">Then, the skills school doesn’t grade.</h3>
            <p className="rv rv-d2">
              Twelve doors of small daily activities, planned for three age bands and done together at home. No points, no
              streaks, no leaderboards.
            </p>
            <Link href={`/${sk.slug}`} className="link rv rv-d3">
              Inside skilling
            </Link>
          </div>
          <ul className="skills">
            {sk.doors.map((d, i) => (
              <li key={d.name} className={`rv rv-d${(i % 5) + 1}`}>
                {d.name}
              </li>
            ))}
          </ul>
        </article>
      </div>
    </section>
  );
}
