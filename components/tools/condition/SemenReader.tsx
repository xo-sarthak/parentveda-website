"use client";

import { useState } from "react";
import REF from "@/lib/tools-reference/semen-report-reader.json";
import { NumberField } from "../ui";
import { Card, Outro, num, useToolTracking, type ToolProps } from "./kit";

/* Semen report reader. Compares each number with the WHO 2021 lower reference
   limit (lib/tools-reference/semen-report-reader.json). Never says
   "infertile"; a nil count shows no reading, only a calm next step. */

type Key = keyof typeof REF.limits;
const KEYS = Object.keys(REF.limits) as Key[];

export default function SemenReader({ consult, condition }: ToolProps) {
  const [vals, setVals] = useState<Record<Key, string>>(Object.fromEntries(KEYS.map((k) => [k, ""])) as Record<Key, string>);
  const [days, setDays] = useState("");
  const [nil, setNil] = useState(false);
  const entered = KEYS.filter((k) => num(vals[k]) !== null);
  const isNil = nil || num(vals.concentration) === 0 || num(vals.total) === 0;
  const d = num(days);
  const shown = isNil || entered.length > 0;
  const track = useToolTracking("semen-report-reader", shown);

  return (
    <div className="ctool">
      <form className="tool-panel" onSubmit={(e) => e.preventDefault()} onChange={track}>
        <p className="tool-hint">Fill in any lines your report has. Leave the rest empty.</p>
        <div className="ctool__grid">
          {KEYS.map((k) => (
            <NumberField
              key={k}
              label={REF.limits[k].label}
              unit={REF.limits[k].unit === "million per mL" ? "M/mL" : REF.limits[k].unit === "million" ? "M" : REF.limits[k].unit}
              min={0}
              step="any"
              value={vals[k]}
              onChange={(v) => setVals((x) => ({ ...x, [k]: v }))}
            />
          ))}
          <NumberField label="Days since last ejaculation" unit="days" min={0} max={30} value={days} onChange={setDays} />
        </div>
        <label className="ctool__checks">
          <span>
            <input type="checkbox" checked={nil} onChange={(e) => setNil(e.target.checked)} /> The report says nil, no sperm seen, or azoospermia
          </span>
        </label>
      </form>

      {isNil ? (
        <Outro
          consult={consult}
          condition={condition}
          read={
            <Card tone="watch" title="Please see an andrologist">
              <p>
                When no sperm are seen, the next step is a visit to an andrologist or a urologist. There are treatment options, and
                many men in this situation go on to become fathers, sometimes with help. The test is usually repeated first, and a
                specialist will look for the reason.
              </p>
            </Card>
          }
          questions={["Should we repeat the test, and when?", "What tests would show why no sperm were seen?", "What treatment options would suit us?"]}
        />
      ) : entered.length ? (
        <Outro
          consult={consult}
          condition={condition}
          read={
            <>
              <ul className="ctool__lines">
                {entered.map((k) => {
                  const v = num(vals[k])!;
                  const low = v < REF.limits[k].lower;
                  return (
                    <li key={k} className={low ? "is-low" : "is-ok"}>
                      <b>{REF.limits[k].label}</b>
                      <span>
                        {v} {REF.limits[k].unit}: {low ? "below the usual range" : "within the usual range"}
                      </span>
                      <small>
                        {REF.limits[k].line} The usual lower limit is {REF.limits[k].lower} {REF.limits[k].unit}.
                      </small>
                    </li>
                  );
                })}
              </ul>
              <Card title={REF.repeat_line}>
                {d !== null && (d < REF.abstinence_days.min || d > REF.abstinence_days.max) ? (
                  <p>
                    The sample was given after {d} days. Labs ask for {REF.abstinence_days.min} to {REF.abstinence_days.max} days, so some numbers
                    may read differently on a repeat test.
                  </p>
                ) : null}
              </Card>
              <p className="tool-small">Ranges: {REF.source}.</p>
            </>
          }
          questions={["Which of these numbers matters most for us?", "Should we repeat the test, and when?", "Is there anything in daily life worth changing for the next test?"]}
        />
      ) : null}
    </div>
  );
}
