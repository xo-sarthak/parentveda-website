"use client";

import { useState } from "react";
import { addDays, daysBetween, fmt, isoDay, parseDate, today, trimesterOf } from "./date";

/* Same four methods and maths as the app's due date calculator
   (due_date_calculator_screen.dart). Naegele's rule: 280 days from the first
   day of the last period, shifted by how far the cycle is from 28 days.
   Conception: 266 days. IVF transfer: 266 days less the embryo's age.
   Scan: 280 days less the pregnancy age the scan gave on that day. */
type Method = "lmp" | "conception" | "ivf" | "scan";
const LABEL: Record<Method, [string, string]> = {
  lmp: ["First day of last period", "First day of your last period"],
  conception: ["Date of conception", "Date of conception"],
  ivf: ["IVF embryo transfer", "Date of embryo transfer"],
  scan: ["An ultrasound scan", "Date of the scan"],
};
export default function DueDateCalc() {
  const [method, setMethod] = useState<Method>("lmp");
  const [embryo, setEmbryo] = useState(5);
  const [gaW, setGaW] = useState(8);
  const [gaD, setGaD] = useState(0);
  const [date, setDate] = useState("");
  const [cycle, setCycle] = useState(28);
  const d = parseDate(date);
  const now = today();
  const valid = d && d <= now && daysBetween(d, now) < 300 && cycle >= 21 && cycle <= 45 && gaW >= 4 && gaW <= 40 && gaD >= 0 && gaD <= 6;

  const lmp = !valid
    ? null
    : method === "lmp"
      ? addDays(d!, cycle - 28)
      : method === "conception"
        ? addDays(d!, -14)
        : method === "ivf"
          ? addDays(d!, -14 - embryo)
          : addDays(d!, -(gaW * 7 + gaD));
  const due = lmp ? addDays(lmp, 280) : null;
  const gestDays = lmp ? daysBetween(lmp, now) : 0;
  const weeks = Math.floor(gestDays / 7);
  const days = gestDays % 7;

  return (
    <div className="tool-card">
      <form className="tool-form" onSubmit={(e) => e.preventDefault()}>
        <fieldset className="tool-toggle">
          <legend>Calculate from</legend>
          {(Object.keys(LABEL) as Method[]).map((m) => (
            <label key={m}>
              <input type="radio" name="m" checked={method === m} onChange={() => setMethod(m)} /> {LABEL[m][0]}
            </label>
          ))}
        </fieldset>
        <label>
          <span>{LABEL[method][1]}</span>
          <input type="date" value={date} max={isoDay(now)} onChange={(e) => setDate(e.target.value)} />
        </label>
        {method === "lmp" && (
          <label>
            <span>Usual cycle length (days)</span>
            <input type="number" min={21} max={45} value={cycle} onChange={(e) => setCycle(Number(e.target.value))} />
          </label>
        )}
        {method === "ivf" && (
          <fieldset className="tool-toggle">
            <legend>Embryo transferred on</legend>
            {[3, 5].map((n) => (
              <label key={n}>
                <input type="radio" name="e" checked={embryo === n} onChange={() => setEmbryo(n)} /> Day {n}
              </label>
            ))}
          </fieldset>
        )}
        {method === "scan" && (
          <div className="tool-row">
            <label>
              <span>Scan said (weeks)</span>
              <input type="number" min={4} max={40} value={gaW} onChange={(e) => setGaW(Number(e.target.value))} />
            </label>
            <label>
              <span>and days</span>
              <input type="number" min={0} max={6} value={gaD} onChange={(e) => setGaD(Number(e.target.value))} />
            </label>
          </div>
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
