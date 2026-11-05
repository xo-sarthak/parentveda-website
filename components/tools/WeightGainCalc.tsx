"use client";

import { useState } from "react";

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
    <div className="tool-card">
      <form className="tool-form" onSubmit={(e) => e.preventDefault()}>
        <label>
          <span>Your height (cm)</span>
          <input type="number" inputMode="decimal" min={120} max={220} value={h} onChange={(e) => setH(e.target.value)} placeholder="e.g. 160" />
        </label>
        <label>
          <span>Your weight before pregnancy (kg)</span>
          <input type="number" inputMode="decimal" min={30} max={200} value={w} onChange={(e) => setW(e.target.value)} placeholder="e.g. 55" />
        </label>
        <fieldset className="tool-toggle">
          <legend>Expecting</legend>
          <label>
            <input type="radio" name="t" checked={!twins} onChange={() => setTwins(false)} /> One baby
          </label>
          <label>
            <input type="radio" name="t" checked={twins} onChange={() => setTwins(true)} /> Twins
          </label>
        </fieldset>
      </form>

      {(h || w) && !valid && <p className="tool-warn">Please enter your height in centimetres and weight in kilograms.</p>}

      {valid && band && (
        <div className="tool-result" aria-live="polite">
          {range ? (
            <p className="tool-result__lead">
              A healthy total gain for you is usually about <strong>{range[0]} to {range[1]} kg</strong> over the whole pregnancy.
            </p>
          ) : (
            <p className="tool-result__lead">
              For twins with a starting weight below the healthy range, there is no fixed guideline. <strong>Your doctor will set a range for you.</strong>
            </p>
          )}
          <ul className="tool-facts">
            <li>
              <span>Your BMI before pregnancy</span>
              <strong>{bmi.toFixed(1)}</strong>
            </li>
            <li>
              <span>That is</span>
              <strong>{band.label}</strong>
            </li>
          </ul>
          <p className="tool-small">
            Most of the gain comes after the first trimester. In the first three months many women gain only 0.5 to 2 kg, and some lose a little with nausea.
            Steady, gradual gain matters more than any single number. Quality of food matters more than quantity.
          </p>
        </div>
      )}
    </div>
  );
}
