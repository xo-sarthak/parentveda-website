"use client";

import { useEffect, useRef, useState } from "react";
import Icon from "../Icon";

// Three real kinds of question, one per stage — and one of them is the answer
// Ask Veda refuses to give. The refusal is the feature: red flags skip the AI
// entirely and route to a doctor.

type Section = { label: string; text: string };
type Demo = {
  stage: string;
  q: string;
  flag?: boolean;
  sections: Section[];
  source: string;
};

const demos: Demo[] = [
  {
    stage: "Pregnancy · week 14",
    q: "Is it okay to eat papaya now?",
    sections: [
      { label: "Veda’s answer", text: "Fully ripe papaya, in small amounts, is generally considered fine. It’s unripe or semi-ripe papaya that doctors usually ask you to avoid." },
      { label: "What this means", text: "Green papaya contains latex, which is thought to be able to trigger contractions. Ripe fruit has very little of it." },
      { label: "What you can do", text: "Choose soft, fully ripe fruit. If your doctor has asked you to avoid papaya altogether, follow your doctor." },
    ],
    source: "From ParentVeda’s library · Is it safe? door",
  },
  {
    stage: "Pregnancy · week 32",
    q: "Baby is moving much less than usual today. Is that normal?",
    flag: true,
    sections: [
      { label: "Please call your doctor now", text: "A change in your baby’s movements is something your doctor or hospital wants to hear about today — not tomorrow. Please call them now, or go in." },
      { label: "Why we’re not answering this one", text: "Some questions shouldn’t be answered by an app. When it’s one of those, Ask Veda doesn’t guess. It points you to someone who can check." },
    ],
    source: "Routed to care — no AI answer given",
  },
  {
    stage: "Trying · month 8",
    q: "We’ve been trying for eight months. When should we see a doctor?",
    sections: [
      { label: "Veda’s answer", text: "The usual guidance is to see a doctor after a year of trying if you’re under 35, and after six months if you’re 35 or older." },
      { label: "What this means", text: "Sooner is sensible if your periods are irregular, you have PCOS or thyroid issues, or either of you has a known health concern." },
      { label: "What you can do", text: "Book a visit together. The ‘Time to get help?’ check lists what to carry, and the tests a doctor may start with." },
    ],
    source: "From ParentVeda’s library · IVF & IUI door",
  },
];

export default function AskVedaDemo() {
  const [i, setI] = useState(0);
  const [typed, setTyped] = useState("");
  const [shown, setShown] = useState(0);
  const [playing, setPlaying] = useState(false);
  const box = useRef<HTMLDivElement>(null);
  const reduce = useRef(false);

  // start only when the demo is on screen; stop when it leaves
  useEffect(() => {
    reduce.current = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const el = box.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => setPlaying(e.isIntersecting), { threshold: 0.35 });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    const d = demos[i];
    if (reduce.current || !playing) {
      if (reduce.current) {
        setTyped(d.q);
        setShown(d.sections.length + 1);
      }
      return;
    }
    setTyped("");
    setShown(0);
    const timers: number[] = [];
    let c = 0;
    const type = window.setInterval(() => {
      c++;
      setTyped(d.q.slice(0, c));
      if (c >= d.q.length) {
        window.clearInterval(type);
        d.sections.forEach((_, k) => timers.push(window.setTimeout(() => setShown(k + 1), 900 + k * 700)));
        timers.push(window.setTimeout(() => setShown(d.sections.length + 1), 900 + d.sections.length * 700));
        timers.push(window.setTimeout(() => setI((n) => (n + 1) % demos.length), 900 + d.sections.length * 700 + 6500));
      }
    }, 34);
    return () => {
      window.clearInterval(type);
      timers.forEach(window.clearTimeout);
    };
  }, [i, playing]);

  const d = demos[i];
  const thinking = typed.length === d.q.length && shown === 0;

  return (
    <div className="ask" ref={box}>
      <div className="ask__tabs" role="tablist" aria-label="Example questions">
        {demos.map((x, k) => (
          <button
            key={x.q}
            role="tab"
            aria-controls="ask-panel"
            aria-selected={k === i}
            className={k === i ? "is-on" : undefined}
            onClick={() => setI(k)}
          >
            {x.flag ? "A red flag" : x.stage.split(" · ")[0]}
          </button>
        ))}
      </div>
      <div className="ask__panel" id="ask-panel" role="tabpanel" aria-live="polite">
        <span className="ask__stage">{d.stage}</span>
        <p className="ask__q">
          {typed}
          {typed.length < d.q.length && <span className="ask__caret" aria-hidden="true" />}
        </p>
        {thinking && (
          <p className="ask__thinking" aria-label="Veda is looking this up">
            <span /> <span /> <span />
          </p>
        )}
        <div className="ask__sections">
          {d.sections.map((s, k) => (
            <div key={s.label} className={`ask__sec${d.flag && k === 0 ? " ask__sec--flag" : ""}${k < shown ? " is-in" : ""}`}>
              {/* placeholder lines hold the answer's shape until it arrives, so the
                  card is never an empty box and nothing jumps when the text lands */}
              <span className="ask__skel" aria-hidden="true">
                <i />
                <i />
                <i />
              </span>
              <span className="ask__label">
                {d.flag && k === 0 && <Icon name="flag" size={15} />} {s.label}
              </span>
              <p>{s.text}</p>
              {d.flag && k === 0 && (
                <span className="ask__call">
                  <Icon name="phone" size={16} /> Call my doctor
                </span>
              )}
            </div>
          ))}
        </div>
        <p className={`ask__src${shown > d.sections.length ? " is-in" : ""}`}>
          <Icon name={d.flag ? "shield" : "book"} size={15} /> {d.source}
        </p>
      </div>
    </div>
  );
}
