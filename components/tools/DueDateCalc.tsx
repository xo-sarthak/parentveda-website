"use client";

import { useState } from "react";
import { addDays, daysBetween, fmt, isoDay, parseDate, today, trimesterOf } from "./date";
import { Answer, Choice, Facts, Field, NumberField, PregnancyBar } from "./ui";

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
    <div className="tool-bench">
      <form className="tool-panel" onSubmit={(e) => e.preventDefault()}>
        <Choice legend="Calculate from" name="m" tiles value={method} onChange={setMethod} options={(Object.keys(LABEL) as Method[]).map((m) => ({ value: m, label: LABEL[m][0] }))} />
        <Field label={LABEL[method][1]}>
          <input type="date" value={date} max={isoDay(now)} onChange={(e) => setDate(e.target.value)} />
        </Field>
        {method === "lmp" && <NumberField label="Usual cycle length" unit="days" min={21} max={45} value={cycle} onChange={(v) => setCycle(Number(v))} />}
        {method === "ivf" && (
          <Choice legend="Embryo transferred on" name="e" value={embryo} onChange={setEmbryo} options={[3, 5].map((n) => ({ value: n, label: `Day ${n}` }))} />
        )}
        {method === "scan" && (
          <div className="tool-row">
            <NumberField label="Scan said" unit="weeks" min={4} max={40} value={gaW} onChange={(v) => setGaW(Number(v))} />
            <NumberField label="and" unit="days" min={0} max={6} placeholder="0" value={gaD} onChange={(v) => setGaD(Number(v))} />
          </div>
        )}
        {date && !valid && <p className="tool-warn">Please choose a date within the last 42 weeks.</p>}
      </form>

      <Answer
        eyebrow="Your estimated due date"
        empty="Add your date and it will appear here, with how far along you are today."
        value={valid && due ? fmt(due, { day: "numeric", month: "long", year: "numeric" }) : undefined}
        sub={due ? fmt(due, { weekday: "long" }) : undefined}
      >
        {lmp && due && (
          <>
            <PregnancyBar days={gestDays} />
            <Facts
              items={[
                ["Today you are", `${weeks} weeks ${days} ${days === 1 ? "day" : "days"}`],
                ["Stage", trimesterOf(weeks)],
                ["Full term window", `${fmt(addDays(lmp, 259), { day: "numeric", month: "short" })} to ${fmt(addDays(lmp, 293), { day: "numeric", month: "short" })}`],
                ["Days to go", Math.max(0, daysBetween(now, due))],
              ]}
            />
            <p className="tool-small">
              Only about 1 in 20 babies arrive on the exact date. Read it as the middle of a window. Your early scan may move it, and if it does, go by the scan.
            </p>
          </>
        )}
      </Answer>
    </div>
  );
}
