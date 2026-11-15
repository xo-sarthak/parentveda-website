"use client";

import { useState } from "react";
import REF from "@/lib/tools-reference/amh-reader.json";
import { Answer, Choice, NumberField } from "../ui";
import { Card, Outro, num, useToolTracking, type ToolProps } from "./kit";

/* AMH result reader. The age table in lib/tools-reference/amh-reader.json holds
   10th and 90th centiles from an Indian study, waiting for a reproductive
   specialist's sign-off (reviewed: false keeps the tool off in production).
   With no bands, the tool says so and compares nothing. 1 ng/mL = 7.14 pmol/L. */

type Band = { min_age: number; max_age: number; low_below_ng_ml: number; high_above_ng_ml: number };
const BANDS = REF.bands as unknown as Band[];

const LINES = [
  "AMH reflects how many eggs are left, not how good they are.",
  "It does not predict your natural chance of pregnancy in any given month.",
  "A high AMH can go with PCOS.",
];

export default function AmhReader({ consult, condition }: ToolProps) {
  const [age, setAge] = useState("");
  const [value, setValue] = useState("");
  const [unit, setUnit] = useState<"ng" | "pmol">("ng");
  const [afc, setAfc] = useState("");
  const a = num(age);
  const v = num(value);
  const ng = v === null ? null : unit === "ng" ? v : v / REF.pmol_per_ng;
  const valid = a !== null && a >= 18 && a <= 55 && ng !== null && ng >= 0 && ng < 50;
  const band = valid ? BANDS.find((b) => a! >= b.min_age && a! <= b.max_age) : undefined;
  const reading = band && ng !== null ? (ng < band.low_below_ng_ml ? "lower" : ng > band.high_above_ng_ml ? "higher" : "typical") : null;
  const track = useToolTracking("amh-reader", valid);

  return (
    <div className="ctool">
      <div className="tool-bench">
        <form className="tool-panel" onSubmit={(e) => e.preventDefault()} onChange={track}>
          <div className="tool-row">
            <NumberField label="Your age" unit="years" min={18} max={55} value={age} onChange={setAge} placeholder="e.g. 32" />
            <NumberField label="AMH result" unit={unit === "ng" ? "ng/mL" : "pmol/L"} min={0} step="any" value={value} onChange={setValue} placeholder="e.g. 1.8" />
          </div>
          <Choice
            legend="Unit on your report"
            name="unit"
            value={unit}
            onChange={setUnit}
            options={[
              { value: "ng", label: "ng/mL" },
              { value: "pmol", label: "pmol/L" },
            ]}
          />
          <NumberField label="Antral follicle count (AFC)" hint="Optional, from a scan report" min={0} max={80} value={afc} onChange={setAfc} />
        </form>
        <Answer
          eyebrow="Your AMH for your age"
          empty="Add your age and AMH result to see how it compares."
          value={
            valid
              ? reading
                ? reading === "typical"
                  ? "In the usual range for your age"
                  : `${reading[0].toUpperCase()}${reading.slice(1)} than usual for your age`
                : BANDS.length
                  ? "No range for this age"
                  : "Reference ranges are being added"
              : undefined
          }
          sub={
            valid
              ? reading
                ? `${ng!.toFixed(2)} ng/mL (${(ng! * REF.pmol_per_ng).toFixed(1)} pmol/L)`
                : BANDS.length
                  ? `The ranges we use cover ages ${BANDS[0].min_age} to ${BANDS[BANDS.length - 1].max_age}. Please read your result with your doctor.`
                  : "Our fertility specialist is adding the ranges by age. Until then, please read your result with your doctor."
              : undefined
          }
        />
      </div>
      {valid ? (
        <Outro
          consult={consult}
          condition={condition}
          read={
            <Card title="What AMH tells you, and what it does not">
              <ul className="ctool__list">
                {LINES.map((l) => (
                  <li key={l}>{l}</li>
                ))}
                {num(afc) !== null ? <li>Your doctor reads AMH together with the antral follicle count from your scan.</li> : null}
              </ul>
              {reading && REF.source ? <p className="ctool__src">{REF.source}</p> : null}
            </Card>
          }
          questions={[
            "Given this result, how soon should we try for a baby, or start treatment?",
            "Would IVF or egg freezing make sense for me, and when?",
            "Should anything else be tested alongside AMH?",
          ]}
        />
      ) : null}
    </div>
  );
}
