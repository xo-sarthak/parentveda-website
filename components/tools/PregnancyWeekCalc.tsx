"use client";

import { useState } from "react";
import { addDays, daysBetween, fmt, isoDay, parseDate, today, trimesterOf } from "./date";

/* What is usually offered around each point. Wording stays general on purpose:
   the treating doctor decides the actual plan. */
const CHECKS: { from: number; to: number; text: string }[] = [
  { from: 4, to: 8, text: "Confirming the pregnancy, a first visit, folic acid, and first blood tests." },
  { from: 6, to: 10, text: "An early (dating) scan is often done around now." },
  { from: 11, to: 14, text: "The NT scan and first-trimester screening window (about 11 to 14 weeks)." },
  { from: 18, to: 22, text: "The anomaly scan, a detailed look at your baby's development (about 18 to 22 weeks)." },
  { from: 24, to: 28, text: "The glucose test for gestational diabetes is usually done between 24 and 28 weeks." },
  { from: 28, to: 36, text: "More frequent visits, growth scans as advised, and watching your baby's movements." },
  { from: 35, to: 37, text: "Group B Strep swab in some hospitals, and packing your hospital bag." },
  { from: 37, to: 42, text: "Full term. Know the signs of labour and when your doctor wants you to come in." },
];

export default function PregnancyWeekCalc() {
  const [method, setMethod] = useState<"lmp" | "due">("lmp");
  const [date, setDate] = useState("");
  const d = parseDate(date);
  const now = today();

  const lmp = d ? (method === "lmp" ? d : addDays(d, -280)) : null;
  const gest = lmp ? daysBetween(lmp, now) : -1;
  const valid = lmp && gest >= 0 && gest <= 300;
  const week = Math.floor(gest / 7);
  const day = gest % 7;
  const now_checks = valid ? CHECKS.filter((c) => week >= c.from - 1 && week <= c.to) : [];

  return (
    <div className="tool-card">
      <form className="tool-form" onSubmit={(e) => e.preventDefault()}>
        <fieldset className="tool-toggle">
          <legend>I know my</legend>
          <label>
            <input type="radio" name="w" checked={method === "lmp"} onChange={() => setMethod("lmp")} /> First day of last period
          </label>
          <label>
            <input type="radio" name="w" checked={method === "due"} onChange={() => setMethod("due")} /> Due date
          </label>
        </fieldset>
        <label>
          <span>{method === "lmp" ? "First day of your last period" : "Your due date"}</span>
          <input type="date" value={date} max={method === "lmp" ? isoDay(now) : undefined} onChange={(e) => setDate(e.target.value)} />
        </label>
      </form>

      {date && !valid && <p className="tool-warn">That date doesn't fit a current pregnancy. Please check it.</p>}

      {valid && lmp && (
        <div className="tool-result" aria-live="polite">
          <p className="tool-result__lead">
            You are <strong>{week} weeks and {day} {day === 1 ? "day" : "days"}</strong> pregnant, in your <strong>{trimesterOf(week).toLowerCase()}</strong>.
          </p>
          <ul className="tool-facts">
            <li>
              <span>You are in week</span>
              <strong>{week + 1}</strong>
            </li>
            <li>
              <span>Due date</span>
              <strong>{fmt(addDays(lmp, 280), { day: "numeric", month: "short", year: "numeric" })}</strong>
            </li>
            <li>
              <span>Second trimester starts</span>
              <strong>{fmt(addDays(lmp, 98), { day: "numeric", month: "short" })}</strong>
            </li>
            <li>
              <span>Third trimester starts</span>
              <strong>{fmt(addDays(lmp, 196), { day: "numeric", month: "short" })}</strong>
            </li>
          </ul>
          {now_checks.length > 0 && (
            <>
              <h3 className="tool-h3">What is usually checked around now</h3>
              <ul className="tool-list">
                {now_checks.map((c) => (
                  <li key={c.text}>{c.text}</li>
                ))}
              </ul>
            </>
          )}
        </div>
      )}
    </div>
  );
}
