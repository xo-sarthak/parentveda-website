"use client";

import { useState } from "react";
import Link from "next/link";
import { daysBetween, parseDate, today, isoDay } from "./date";
import { Answer, Choice, Facts, Field, NumberField, PregnancyBar } from "./ui";

type Range = { month: number; from: number; to: number };
type Snap = { week: number; milestone: string; size: string };

const ORD = ["", "1st", "2nd", "3rd", "4th", "5th", "6th", "7th", "8th", "9th"];
const TRI = ["", "first", "second", "third"];

/* Weeks to months, using the app's own month ranges (passed in), so the answer
   matches what the ParentVeda app shows for the same week. The number people say
   ("I'm 22 weeks") is the week looked up. */
export default function WeeksToMonths({ ranges, snaps }: { ranges: Range[]; snaps: Snap[] }) {
  const [method, setMethod] = useState<"weeks" | "lmp">("weeks");
  const [weeks, setWeeks] = useState("");
  const [days, setDays] = useState("");
  const [date, setDate] = useState("");

  let w = -1;
  let d = 0;
  if (method === "weeks") {
    const n = Number(weeks);
    if (weeks !== "" && Number.isInteger(n)) {
      w = n;
      d = Math.min(6, Math.max(0, Math.floor(Number(days) || 0)));
    }
  } else {
    const lmp = parseDate(date);
    if (lmp) {
      const g = daysBetween(lmp, today());
      if (g >= 0) {
        w = Math.floor(g / 7);
        d = g % 7;
      }
    }
  }
  const valid = w >= 1 && w <= 42;
  const wk = Math.min(40, w);
  const month = valid ? ranges.find((r) => wk >= r.from && wk <= r.to)?.month ?? 9 : 0;
  const tri = wk <= 13 ? 1 : wk <= 27 ? 2 : 3;
  const left = Math.max(0, 280 - (w * 7 + d));
  const snap = snaps.find((s) => s.week === Math.max(4, wk));
  const r = ranges.find((x) => x.month === month);

  return (
    <div className="tool-bench">
      <form className="tool-panel" onSubmit={(e) => e.preventDefault()}>
        <Choice
          legend="I know"
          name="wm"
          tiles
          value={method}
          onChange={setMethod}
          options={[
            { value: "weeks", label: "How many weeks I am" },
            { value: "lmp", label: "The first day of my last period" },
          ]}
        />
        {method === "weeks" ? (
          <div className="tool-row">
            <NumberField label="Weeks" unit="weeks" min={1} max={42} value={weeks} onChange={setWeeks} placeholder="22" />
            <NumberField label="And days" unit="days" min={0} max={6} value={days} onChange={setDays} placeholder="0" />
          </div>
        ) : (
          <Field label="First day of your last period">
            <input type="date" value={date} max={isoDay(today())} onChange={(e) => setDate(e.target.value)} />
          </Field>
        )}
        {method === "weeks" && <small className="tool-hint">Days are optional. A scan report writes 22 weeks 3 days as 22w 3d.</small>}
        {((method === "weeks" && weeks !== "") || (method === "lmp" && date)) && !valid && (
          <p className="tool-warn">That doesn't fit a current pregnancy. Pregnancy runs from week 1 to about week 40.</p>
        )}
      </form>

      <Answer
        eyebrow={valid ? `${w} weeks${d ? ` ${d} ${d === 1 ? "day" : "days"}` : ""} is your` : "Your month"}
        empty="Enter your weeks and you'll see your month and trimester, with what that month usually holds."
        value={valid ? `${ORD[month]} month` : undefined}
        sub={valid ? `of pregnancy, in your ${TRI[tri]} trimester.` : undefined}
      >
        {valid && r && (
          <>
            <PregnancyBar days={w * 7 + d} />
            <Facts
              items={[
                [`The ${ORD[month]} month`, `Weeks ${r.from} to ${r.to}`],
                ["Trimester", `${ORD[tri]} (${tri === 1 ? "weeks 1 to 13" : tri === 2 ? "weeks 14 to 27" : "week 28 to birth"})`],
                ["Until 40 weeks", left === 0 ? "Due now" : `About ${Math.floor(left / 7)} weeks${left % 7 ? ` ${left % 7} days` : ""}`],
                ...(snap ? ([["Your baby is about the size of", snap.size]] as [string, string][]) : []),
              ]}
            />
            <p className="tool-answer__link">
              <Link className="btn btn--ink btn--sm" href={`/pregnancy/${ORD[month]}-month/`}>
                What happens in the {ORD[month]} month
              </Link>
            </p>
          </>
        )}
      </Answer>
    </div>
  );
}
