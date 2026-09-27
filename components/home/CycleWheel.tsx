"use client";

import { useEffect, useRef, useState } from "react";

// The Trying card's picture: a cycle as 28 beads, read back in plain words.
// A marker walks the days while the card is on screen; tap a bead or a phase
// to stop it there. An example cycle, never a prediction of anyone's own,
// and never a chance or a score (the app's rule, held here too). The fertile
// days are the five before ovulation on day 14 and that day itself.

const DAYS = 28;
const STEP = 360 / DAYS;

type Phase = { key: string; name: string; from: number; to: number; colour: string; line: string };

const PHASES: Phase[] = [
  {
    key: "period",
    name: "Period",
    from: 1,
    to: 5,
    colour: "#D24E6C",
    line: "Your period. Rest counts as looking after yourself. Very heavy bleeding, or pain that stops your day, is worth telling a doctor about.",
  },
  {
    key: "ready",
    name: "Getting ready",
    from: 6,
    to: 9,
    colour: "#FFFFFF",
    line: "Your body is preparing an egg. Many women notice more energy in these days.",
  },
  {
    key: "fertile",
    name: "Fertile days",
    from: 10,
    to: 15,
    colour: "#6A30B6",
    line: "Your fertile days are likely around now. Likely, never certain, and there’s no need to plan every night around them.",
  },
  {
    key: "wait",
    name: "The wait",
    from: 16,
    to: 28,
    colour: "#7E9C83",
    line: "The wait. If your period is late, a test after it’s due tells you more than one taken early.",
  },
];

const phaseOf = (d: number) => PHASES.find((p) => d >= p.from && d <= p.to) ?? PHASES[0];

// bead positions on the ring, day 1 at the top, running clockwise
const C = 120;
const R = 92;
const bead = (d: number) => {
  const a = ((d - 1) * STEP - 90) * (Math.PI / 180);
  return { x: C + R * Math.cos(a), y: C + R * Math.sin(a) };
};

const dayOf = (angle: number) => ((((Math.round(angle / STEP) % DAYS) + DAYS) % DAYS) + 1);

export default function CycleWheel() {
  const root = useRef<HTMLDivElement>(null);
  // The marker's angle is the only state and the day is read from it. It only
  // ever moves the short way round, so day 28 turns forward to day 1 instead
  // of spinning back through the whole cycle.
  const [angle, setAngle] = useState((14 - 1) * STEP);
  const [auto, setAuto] = useState(true);
  const day = dayOf(angle);

  const pick = (to: number) => {
    setAuto(false);
    setAngle((a) => {
      let delta = (to - dayOf(a) + DAYS) % DAYS;
      if (delta > DAYS / 2) delta -= DAYS;
      return a + delta * STEP;
    });
  };

  useEffect(() => {
    if (!auto) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let timer = 0;
    const start = () => {
      if (!timer) timer = window.setInterval(() => setAngle((a) => a + STEP), 1400);
    };
    const stop = () => {
      window.clearInterval(timer);
      timer = 0;
    };
    const io = new IntersectionObserver(([e]) => (e.isIntersecting ? start() : stop()), { threshold: 0.4 });
    if (root.current) io.observe(root.current);
    return () => {
      stop();
      io.disconnect();
    };
  }, [auto]);

  const ph = phaseOf(day);

  return (
    <div className="cyc" ref={root}>
      <div className="cyc__wheel">
        <svg viewBox="0 0 240 240" role="img" aria-label={`An example 28-day cycle, day ${day}: ${ph.name}`}>
          <circle cx={C} cy={C} r={R} className="cyc__track" />
          {Array.from({ length: DAYS }, (_, i) => {
            const d = i + 1;
            const p = phaseOf(d);
            const { x, y } = bead(d);
            const peak = d === 14;
            return (
              <circle
                key={d}
                cx={x}
                cy={y}
                r={peak ? 8 : p.key === "fertile" ? 6.4 : 5.4}
                fill={p.colour}
                className={`cyc__bead${d === day ? " is-on" : ""}${peak ? " cyc__bead--peak" : ""}`}
                onClick={() => pick(d)}
              >
                <title>{`Day ${d} · ${p.name}`}</title>
              </circle>
            );
          })}
          <g className="cyc__marker" style={{ transform: `rotate(${angle}deg)` }}>
            <circle cx={C} cy={C - R} r="13" className="cyc__halo" />
          </g>
          <text x={C} y={C - 6} textAnchor="middle" className="cyc__day">
            {day}
          </text>
          <text x={C} y={C + 16} textAnchor="middle" className="cyc__of">
            DAY OF 28
          </text>
        </svg>
      </div>

      <div className="cyc__read">
        <span className="cyc__eyebrow">Your cycle, read back to you</span>
        <p className="cyc__line" aria-live="polite">
          <b style={{ ["--ph" as string]: ph.colour }}>{ph.name}</b>
          {ph.line}
        </p>
        <div className="cyc__phases" role="group" aria-label="Jump to a phase">
          {PHASES.map((p) => (
            <button
              key={p.key}
              type="button"
              aria-pressed={ph.key === p.key}
              style={{ ["--ph" as string]: p.colour }}
              onClick={() => pick(p.key === "fertile" ? 14 : p.from)}
            >
              {p.name}
            </button>
          ))}
        </div>
        <p className="cyc__note">An example 28-day cycle. Yours is your own, and the app reads it from your dates.</p>
      </div>
    </div>
  );
}
