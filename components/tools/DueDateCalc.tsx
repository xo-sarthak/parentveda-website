"use client";

import { useState } from "react";
import { addDays, daysBetween, fmt, isoDay, parseDate, today, trimesterOf } from "./date";

/* Naegele's rule: 280 days from the first day of the last period, shifted by
   how far the cycle is from 28 days. From a known conception date: 266 days. */
export default function DueDateCalc() {
  const [method, setMethod] = useState<"lmp" | "conception">("lmp");
  const [date, setDate] = useState("");
  const [cycle, setCycle] = useState(28);
  const d = parseDate(date);
  const now = today();
  const valid = d && d <= now && daysBetween(d, now) < 300 && cycle >= 21 && cycle <= 45;

  const lmp = valid ? (method === "lmp" ? addDays(d!, cycle - 28) : addDays(d!, -14)) : null;
  const due = lmp ? addDays(lmp, 280) : null;
  const gestDays = lmp ? daysBetween(lmp, now) : 0;
  const weeks = Math.floor(gestDays / 7);
  const days = gestDays % 7;

  return (
    <div className="tool-card">
      <form className="tool-form" onSubmit={(e) => e.preventDefault()}>
        <fieldset className="tool-toggle">
          <legend>Calculate from</legend>
          <label>
            <input type="radio" name="m" checked={method === "lmp"} onChange={() => setMethod("lmp")} /> First day of last period
          </label>
          <label>
            <input type="radio" name="m" checked={method === "conception"} onChange={() => setMethod("conception")} /> Date of conception (for example, IVF transfer or known date)
          </label>
        </fieldset>
        <label>
          <span>{method === "lmp" ? "First day of your last period" : "Date of conception"}</span>
          <input type="date" value={date} max={isoDay(now)} onChange={(e) => setDate(e.target.value)} />
        </label>
        {method === "lmp" && (
          <label>
            <span>Usual cycle length (days)</span>
            <input type="number" min={21} max={45} value={cycle} onChange={(e) => setCycle(Number(e.target.value))} />
          </label>
        )}
      </form>

      {date && !valid && <p className="tool-warn">Please choose a date within the last 42 weeks.</p>}

      {valid && due && lmp && (
        <div className="tool-result" aria-live="polite">
          <p className="tool-result__lead">
            Your estimated due date is <strong>{fmt(due, { weekday: "long", day: "numeric", month: "long", year: "numeric" })}</strong>.
          </p>
          <ul className="tool-facts">
            <li>
              <span>Today you are</span>
              <strong>
                {weeks} weeks {days} {days === 1 ? "day" : "days"}
              </strong>
            </li>
            <li>
              <span>Stage</span>
              <strong>{trimesterOf(weeks)}</strong>
            </li>
            <li>
              <span>Full term window</span>
              <strong>
                {fmt(addDays(lmp, 259), { day: "numeric", month: "short" })} to {fmt(addDays(lmp, 293), { day: "numeric", month: "short" })}
              </strong>
            </li>
            <li>
              <span>Days to go</span>
              <strong>{Math.max(0, daysBetween(now, due))}</strong>
            </li>
          </ul>
          <p className="tool-small">
            Only about 1 in 20 babies arrive on the exact date. Read it as the middle of a window. Your early scan may move it, and if it does, go by the
            scan.
          </p>
        </div>
      )}
    </div>
  );
}
