"use client";

import { useState } from "react";
import { Answer, Choice, Facts, NumberField } from "./ui";

/* Total gain ranges for a single baby follow the US Institute of Medicine 2009
   guidance, which Indian obstetric practice commonly uses. BMI groups use the
   Asian cut-offs (23 and 25) that Indian guidelines recommend for South Asians. */
const BANDS = [
  { max: 18.5, label: "below the healthy range", single: [12.5, 18], twins: null },
  { max: 23, label: "in the healthy range", single: [11.5, 16], twins: [17, 25] },
  { max: 25, label: "slightly above the healthy range for Indian adults", single: [11.5, 16], twins: [17, 25] },
  { max: 30, label: "above the healthy range", single: [7, 11.5], twins: [14, 23] },
  { max: Infinity, label: "well above the healthy range", single: [5, 9], twins: [11, 19] },
] as const;

export default function WeightGainCalc() {
  const [h, setH] = useState("");
  const [w, setW] = useState("");
  const [twins, setTwins] = useState(false);
  const hm = Number(h) / 100;
  const kg = Number(w);
  const valid = hm > 1.2 && hm < 2.2 && kg > 30 && kg < 200;
  const bmi = valid ? kg / (hm * hm) : 0;
  const band = valid ? BANDS.find((b) => bmi < b.max)! : null;
  const range = band ? (twins ? band.twins : band.single) : null;

  return (
    <div className="tool-bench">
      <form className="tool-panel" onSubmit={(e) => e.preventDefault()}>
        <div className="tool-row">
          <NumberField label="Your height" unit="cm" min={120} max={220} value={h} onChange={setH} placeholder="e.g. 160" />
          <NumberField label="Weight before pregnancy" unit="kg" min={30} max={200} value={w} onChange={setW} placeholder="e.g. 55" />
        </div>
        <Choice
          legend="Expecting"
          name="t"
          value={twins ? "twins" : "one"}
          onChange={(v) => setTwins(v === "twins")}
          options={[
            { value: "one", label: "One baby" },
            { value: "twins", label: "Twins" },
          ]}
        />
        {(h || w) && !valid && <p className="tool-warn">Please enter your height in centimetres and weight in kilograms.</p>}
      </form>

      <Answer
        eyebrow="A healthy total gain for you"
        empty="Add your height and weight and your range will appear here."
        value={valid && band ? (range ? `${range[0]} to ${range[1]} kg` : "Your doctor will set a range for you") : undefined}
        sub={valid && band ? (range ? "Usually about this much, over the whole pregnancy." : "For twins with a starting weight below the healthy range, there is no fixed guideline.") : undefined}
      >
        {valid && band && (
          <>
            <Facts
              items={[
                ["Your BMI before pregnancy", bmi.toFixed(1)],
                ["That is", band.label],
              ]}
            />
            <p className="tool-small">
              Most of the gain comes after the first trimester. In the first three months many women gain only 0.5 to 2 kg, and some lose a little with nausea. Steady, gradual gain matters more than any
              single number. Quality of food matters more than quantity.
            </p>
          </>
        )}
      </Answer>
    </div>
  );
}
