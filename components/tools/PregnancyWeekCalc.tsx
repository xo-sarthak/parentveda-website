"use client";

import { useState } from "react";
import { addDays, daysBetween, fmt, isoDay, parseDate, today, trimesterOf } from "./date";
import { Answer, Choice, Facts, Field, PregnancyBar } from "./ui";

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
    <div className="tool-bench">
      <form className="tool-panel" onSubmit={(e) => e.preventDefault()}>
        <Choice
          legend="I know my"
          name="w"
          tiles
          value={method}
          onChange={setMethod}
          options={[
            { value: "lmp", label: "First day of last period" },
            { value: "due", label: "Due date" },
          ]}
        />
        <Field label={method === "lmp" ? "First day of your last period" : "Your due date"}>
          <input type="date" value={date} max={method === "lmp" ? isoDay(now) : undefined} onChange={(e) => setDate(e.target.value)} />
        </Field>
        {date && !valid && <p className="tool-warn">That date doesn't fit a current pregnancy. Please check it.</p>}
      </form>

      <Answer
        eyebrow="You are"
        empty="Add your date and your week will appear here, with what is usually checked around now."
        value={valid ? `${week} weeks and ${day} ${day === 1 ? "day" : "days"}` : undefined}
        sub={valid ? `pregnant, in your ${trimesterOf(week).toLowerCase()}.` : undefined}
      >
        {valid && lmp && (
          <>
            <PregnancyBar days={gest} />
            <Facts
              items={[
                ["You are in week", week + 1],
                ["Due date", fmt(addDays(lmp, 280), { day: "numeric", month: "short", year: "numeric" })],
                ["Second trimester starts", fmt(addDays(lmp, 98), { day: "numeric", month: "short" })],
                ["Third trimester starts", fmt(addDays(lmp, 196), { day: "numeric", month: "short" })],
              ]}
            />
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
          </>
        )}
      </Answer>
    </div>
  );
}
