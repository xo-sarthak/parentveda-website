"use client";

import { useState } from "react";
import Icon from "../Icon";
import type { NowStep } from "@/lib/stages";

// "Where are you in it?" — pick a point in the phase and see the few things
// that matter there, with your baby at that week in the app's own words.
// It exists because it answers something the guides below cannot: what to
// look at first, for *you*, now.

// must match the guide ids StageStory writes
const anchor = (guide: string) =>
  "#guide-" +
  guide
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");

export default function StageNow({ title, lede, steps }: { title: string; lede: string; steps: NowStep[] }) {
  const [i, setI] = useState(0);
  const step = steps[i];

  return (
    <div className="snow">
      <div className="snow__head">
        <h2 className="snow__title">{title}</h2>
        <p className="snow__lede">{lede}</p>
        <div className="snow__tabs" role="tablist" aria-label={title}>
          {steps.map((s, k) => (
            <button
              key={s.label}
              role="tab"
              id={`snow-tab-${k}`}
              aria-selected={k === i}
              aria-controls="snow-panel"
              className={k === i ? "is-on" : undefined}
              onClick={() => setI(k)}
            >
              <b>{s.label}</b>
              <span>{s.range}</span>
            </button>
          ))}
        </div>
      </div>

      <div className={`snow__panel${!step.week && !step.badge ? " snow__panel--solo" : ""}`} id="snow-panel" role="tabpanel" aria-labelledby={`snow-tab-${i}`} key={i}>
        {!step.week && step.badge && (
          <figure className="snow__baby snow__baby--badge">
            <span className="snow__disc" aria-hidden="true" />
            <span className="snow__badge" aria-hidden="true">
              <b>{step.badge.big}</b>
              <span>{step.badge.small}</span>
            </span>
            {step.quote && (
              <figcaption>
                <q>{step.quote}</q>
              </figcaption>
            )}
          </figure>
        )}
        {step.week && (
          <figure className="snow__baby">
            <span className="snow__disc" aria-hidden="true" />
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={`/weeks/week_${String(step.week).padStart(2, "0")}.webp`} alt={`Your baby at week ${step.week}`} width={560} height={560} />
            <figcaption>
              <span className="snow__week">Week {step.week}</span>
              {step.quote && <q>{step.quote}</q>}
            </figcaption>
          </figure>
        )}
        <ol className="snow__items">
          {step.items.map((it, k) => (
            <li key={it.title} style={{ ["--k" as string]: k }}>
              <a href={anchor(it.guide)}>
                <b>{it.title}</b>
                <span>{it.body}</span>
                <em>
                  {it.guide} <Icon name="arrow" size={15} />
                </em>
              </a>
            </li>
          ))}
        </ol>
      </div>
    </div>
  );
}
