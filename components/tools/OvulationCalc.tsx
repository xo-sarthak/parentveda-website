"use client";

import { useState } from "react";
import { addDays, fmt, isoDay, parseDate, today } from "./date";
import { Answer, Field, NumberField } from "./ui";

/* Ovulation usually happens about 14 days before the next period, whatever the
   cycle length. The fertile window is the five days before it plus the day itself. */
export default function OvulationCalc() {
  const [lmp, setLmp] = useState("");
  const [cycle, setCycle] = useState(28);
  const start = parseDate(lmp);
  const valid = start && cycle >= 21 && cycle <= 45 && start <= today();

  const cycles = valid
    ? [0, 1, 2].map((i) => {
        const periodStart = addDays(start!, cycle * i);
        const ovulation = addDays(periodStart, cycle - 14);
        return {
          periodStart,
          ovulation,
          windowStart: addDays(ovulation, -5),
          windowEnd: addDays(ovulation, 1),
          nextPeriod: addDays(periodStart, cycle),
        };
      })
    : [];

  const short = { day: "numeric", month: "short" } as const;
  const first = cycles[0];

  return (
    <div className="tool-bench">
      <form className="tool-panel" onSubmit={(e) => e.preventDefault()}>
        <Field label="First day of your last period">
          <input type="date" value={lmp} max={isoDay(today())} onChange={(e) => setLmp(e.target.value)} required />
        </Field>
        <NumberField
          label="Usual cycle length"
          unit="days"
          min={21}
          max={45}
          value={cycle}
          onChange={(v) => setCycle(Number(v))}
          hint="Count from the first day of one period to the day before the next. 28 is common, but anything from 21 to 35 is normal."
        />
        {!valid && lmp && <p className="tool-warn">Please choose a past date and a cycle length between 21 and 45 days.</p>}
      </form>

      <Answer
        eyebrow="Your most fertile days this cycle"
        empty="Add the first day of your last period and your fertile days will appear here."
        value={first ? `${fmt(first.windowStart, short)} to ${fmt(first.windowEnd, short)}` : undefined}
        sub={first ? `Ovulation is likely around ${fmt(first.ovulation)}.` : undefined}
      >
        {first && (
          <>
            <div className="tool-cyclebar" aria-hidden="true">
              <div className="tool-cyclebar__track">
                <span className="tool-cyclebar__window" style={{ left: `${((cycle - 19) / cycle) * 100}%`, width: `${(6 / cycle) * 100}%` }} />
                <i style={{ left: `${((cycle - 14) / cycle) * 100}%` }} />
              </div>
              <div className="tool-cyclebar__ends">
                <span>Period, {fmt(first.periodStart, short)}</span>
                <span>Next period, {fmt(first.nextPeriod, short)}</span>
              </div>
            </div>
            <ul className="tool-cycles">
              {cycles.map((c, i) => (
                <li key={i}>
                  <h3>{i === 0 ? "This cycle" : `Cycle ${i + 1}`}</h3>
                  <dl>
                    <div>
                      <dt>Fertile days</dt>
                      <dd>
                        {fmt(c.windowStart, short)} to {fmt(c.windowEnd, short)}
                      </dd>
                    </div>
                    <div>
                      <dt>Likely ovulation</dt>
                      <dd>{fmt(c.ovulation, { weekday: "short", day: "numeric", month: "short" })}</dd>
                    </div>
                    <div>
                      <dt>Next period due</dt>
                      <dd>{fmt(c.nextPeriod, short)}</dd>
                    </div>
                  </dl>
                </li>
              ))}
            </ul>
            <p className="tool-small">
              If your period is late, a home test is most reliable from <strong>{fmt(first.nextPeriod, short)}</strong>, the day it was due.
            </p>
          </>
        )}
      </Answer>
    </div>
  );
}
