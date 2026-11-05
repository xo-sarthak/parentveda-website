"use client";

import { useState } from "react";
import { addDays, fmt, isoDay, parseDate, today } from "./date";

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

  return (
    <div className="tool-card">
      <form className="tool-form" onSubmit={(e) => e.preventDefault()}>
        <label>
          <span>First day of your last period</span>
          <input type="date" value={lmp} max={isoDay(today())} onChange={(e) => setLmp(e.target.value)} required />
        </label>
        <label>
          <span>Usual cycle length (days)</span>
          <input type="number" min={21} max={45} value={cycle} onChange={(e) => setCycle(Number(e.target.value))} />
          <small>Count from the first day of one period to the day before the next. 28 is common, but anything from 21 to 35 is normal.</small>
        </label>
      </form>

      {!valid && lmp && <p className="tool-warn">Please choose a past date and a cycle length between 21 and 45 days.</p>}

      {valid && (
        <div className="tool-result" aria-live="polite">
          <p className="tool-result__lead">
            Your most fertile days this cycle are likely <strong>{fmt(cycles[0].windowStart, { day: "numeric", month: "short" })}</strong> to{" "}
            <strong>{fmt(cycles[0].windowEnd, { day: "numeric", month: "short" })}</strong>, with ovulation around{" "}
            <strong>{fmt(cycles[0].ovulation)}</strong>.
          </p>
          <table className="tool-table">
            <thead>
              <tr>
                <th>Cycle</th>
                <th>Fertile days</th>
                <th>Likely ovulation</th>
                <th>Next period due</th>
              </tr>
            </thead>
            <tbody>
              {cycles.map((c, i) => (
                <tr key={i}>
                  <td>{i === 0 ? "This cycle" : `Cycle ${i + 1}`}</td>
                  <td>
                    {fmt(c.windowStart, { day: "numeric", month: "short" })} to {fmt(c.windowEnd, { day: "numeric", month: "short" })}
                  </td>
                  <td>{fmt(c.ovulation, { weekday: "short", day: "numeric", month: "short" })}</td>
                  <td>{fmt(c.nextPeriod, { day: "numeric", month: "short" })}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <p className="tool-small">
            If your period is late, a home test is most reliable from{" "}
            <strong>{fmt(cycles[0].nextPeriod, { day: "numeric", month: "short" })}</strong>, the day it was due.
          </p>
        </div>
      )}
    </div>
  );
}
