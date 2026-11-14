"use client";

import { useState } from "react";
import REF from "@/lib/tools-reference/fertility-specialist-check.json";
import { Answer, Choice, NumberField } from "../ui";
import { Card, Outro, num, useToolTracking, type ToolProps } from "./kit";

/* "Is it time to see a fertility specialist?" Never says "keep waiting": the
   softest answer is a conversation with a specialist, plus what to do meanwhile.
   Rules and values: lib/tools-reference/fertility-specialist-check.json. */

type Cycles = "regular" | "irregular" | "unsure";
type Semen = "normal" | "abnormal" | "not-done";

const BRING = [
  "A record of your periods for the last 3 to 6 months",
  "Both partners' test reports, including any semen analysis",
  "Past scan reports",
  "A list of medicines and supplements you both take",
];

export default function FertilityCheck({ consult, condition }: ToolProps) {
  const [age, setAge] = useState("");
  const [months, setMonths] = useState("");
  const [cycles, setCycles] = useState<Cycles>("regular");
  const [conds, setConds] = useState<string[]>([]);
  const [semen, setSemen] = useState<Semen>("not-done");
  const a = num(age);
  const m = num(months);
  const valid = a !== null && a >= 18 && a <= 55 && m !== null && m >= 0 && m <= 240;

  const reasonsNow: string[] = [];
  if (valid) {
    const flagged = REF.conditions.filter((c) => c.see_now && conds.includes(c.id));
    if (a! >= 40) reasonsNow.push("You are 40 or older, when time matters more.");
    if (cycles === "irregular" && REF.irregular_cycles_see_now) reasonsNow.push("Your cycles are irregular.");
    for (const c of flagged) reasonsNow.push(`${c.label}.`);
    if (semen === "abnormal" && REF.abnormal_semen_see_now) reasonsNow.push("Your partner's semen test was not in the usual range.");
  }
  const rule = valid ? REF.age_rules.find((r) => a! >= r.min_age && a! <= r.max_age) : undefined;
  const level = !valid ? null : reasonsNow.length ? "now" : rule && m! >= rule.months ? "due" : "talk";
  const track = useToolTracking("fertility-specialist-check", level !== null);

  const toggle = (id: string) => {
    track();
    setConds((c) => (c.includes(id) ? c.filter((x) => x !== id) : [...c, id]));
  };

  return (
    <div className="ctool">
      <div className="tool-bench">
        <form className="tool-panel" onSubmit={(e) => e.preventDefault()} onChange={track}>
          <div className="tool-row">
            <NumberField label="Her age" unit="years" min={18} max={55} value={age} onChange={setAge} placeholder="e.g. 31" />
            <NumberField label="Months trying" unit="months" min={0} max={240} value={months} onChange={setMonths} placeholder="e.g. 8" />
          </div>
          <Choice
            legend="Her periods"
            name="cycles"
            value={cycles}
            onChange={setCycles}
            options={[
              { value: "regular", label: "Regular" },
              { value: "irregular", label: "Irregular" },
              { value: "unsure", label: "Not sure" },
            ]}
          />
          <fieldset className="tool-field">
            <legend className="tool-label">Anything known already?</legend>
            <div className="ctool__checks">
              {REF.conditions.map((c) => (
                <label key={c.id}>
                  <input type="checkbox" checked={conds.includes(c.id)} onChange={() => toggle(c.id)} /> {c.label}
                </label>
              ))}
            </div>
          </fieldset>
          <Choice
            legend="Partner's semen test"
            name="semen"
            value={semen}
            onChange={setSemen}
            options={[
              { value: "normal", label: "Normal" },
              { value: "abnormal", label: "Not normal" },
              { value: "not-done", label: "Not done" },
            ]}
          />
          {(age || months) && !valid ? <p className="tool-warn">Enter her age in years and how many months you have been trying.</p> : null}
        </form>

        <Answer
          eyebrow="What we suggest"
          empty="Add her age and how long you have been trying, and the answer will appear here."
          value={level === "now" ? "See a fertility specialist now" : level === "due" ? "It is time to see a fertility specialist" : level === "talk" ? "Worth a conversation with a specialist" : undefined}
          sub={
            level === "now"
              ? "Whatever your age or how long you have been trying, this is worth checking without waiting."
              : level === "due"
                ? `For someone ${rule!.label}, doctors suggest a check after ${rule!.months} months of trying.`
                : level === "talk"
                  ? "Here is what to do meanwhile, so the first visit is useful whenever you go."
                  : undefined
          }
        >
          {level === "now" && reasonsNow.length ? (
            <ul className="ctool__list">
              {reasonsNow.map((r) => (
                <li key={r}>{r}</li>
              ))}
            </ul>
          ) : null}
        </Answer>
      </div>

      {level ? (
        <Outro
          consult={consult}
          condition={condition}
          read={
            <>
              {level === "talk" ? (
                <Card title="Meanwhile">
                  <ul className="ctool__list">
                    {semen === "not-done" ? <li>Ask for a semen analysis for your partner. It is simple, and half of the answer is often there.</li> : null}
                    <li>Note the first day of each period, so you know your cycle length.</li>
                    <li>Ask your doctor about a folic acid supplement if you are not taking one.</li>
                  </ul>
                </Card>
              ) : null}
              <Card title="What to bring to the first visit">
                <ul className="ctool__list">
                  {BRING.map((b) => (
                    <li key={b}>{b}</li>
                  ))}
                </ul>
              </Card>
            </>
          }
          questions={["Which tests should we both have first?", "Does anything in our history change the timeline?", "If we keep trying naturally, when should we come back?"]}
        />
      ) : null}
    </div>
  );
}
