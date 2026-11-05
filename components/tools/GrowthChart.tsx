"use client";

import { useState } from "react";
import WHO from "@/lib/who-growth.json";
import { daysBetween, isoDay, parseDate, today } from "./date";

/* WHO Child Growth Standards (0 to 5 years), which the IAP recommends for
   Indian children under five. LMS method: z = ((x/M)^L - 1) / (L*S). */
type Ind = "wfa" | "lhfa" | "hcfa";
type Sex = "boys" | "girls";
const TABLE = WHO as Record<Ind, Record<Sex, [number, number, number][]>>;

function lms(ind: Ind, sex: Sex, months: number) {
  const t = TABLE[ind][sex];
  const i = Math.min(Math.floor(months), 59);
  const f = Math.min(Math.max(months - i, 0), 1);
  return t[i].map((v, k) => v + (t[i + 1][k] - v) * f) as [number, number, number];
}
const zOf = (x: number, [L, M, S]: number[]) => (L === 0 ? Math.log(x / M) / S : (Math.pow(x / M, L) - 1) / (L * S));
const xOf = (z: number, [L, M, S]: number[]) => (L === 0 ? M * Math.exp(S * z) : M * Math.pow(1 + L * S * z, 1 / L));
function pct(z: number) {
  // Normal CDF (Abramowitz and Stegun 7.1.26), accurate to about 1e-7.
  const t = 1 / (1 + 0.3275911 * Math.abs(z) / Math.SQRT2);
  const e = 1 - ((((1.061405429 * t - 1.453152027) * t + 1.421413741) * t - 0.284496736) * t + 0.254829592) * t * Math.exp(-(z * z) / 2);
  return 50 * (1 + Math.sign(z) * e);
}

const LINES = [
  { p: 3, z: -1.881 },
  { p: 15, z: -1.036 },
  { p: 50, z: 0 },
  { p: 85, z: 1.036 },
  { p: 97, z: 1.881 },
];

const LABEL: Record<Ind, { name: string; unit: string }> = {
  wfa: { name: "Weight", unit: "kg" },
  lhfa: { name: "Length / height", unit: "cm" },
  hcfa: { name: "Head size", unit: "cm" },
};

function words(p: number) {
  if (p < 3) return "below the usual range. Please show this to your paediatrician.";
  if (p > 97) return "above the usual range. Please show this to your paediatrician.";
  return "within the usual range.";
}

function Chart({ ind, sex, months, value }: { ind: Ind; sex: Sex; months: number; value: number }) {
  const W = 640, H = 300, pad = 36;
  const max = Math.min(60, Math.max(12, Math.ceil((months + 6) / 6) * 6));
  const ys = LINES.flatMap((l) => [0, max].map((m) => xOf(l.z, lms(ind, sex, m))));
  const lo = Math.floor(Math.min(...ys, value) * 0.95), hi = Math.ceil(Math.max(...ys, value) * 1.03);
  const X = (m: number) => pad + (m / max) * (W - pad - 48);
  const Y = (v: number) => H - pad - ((v - lo) / (hi - lo)) * (H - pad * 1.6);
  const steps = Array.from({ length: max * 2 + 1 }, (_, i) => i / 2);
  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="growth-svg" role="img" aria-label={`${LABEL[ind].name} chart with your child's measurement`}>
      {Array.from({ length: 7 }, (_, i) => (max / 6) * i).map((m) => (
        <g key={m}>
          <line x1={X(m)} x2={X(m)} y1={pad * 0.6} y2={H - pad} className="growth-grid" />
          <text x={X(m)} y={H - pad + 18} textAnchor="middle" className="growth-axis">
            {Math.round(m)}m
          </text>
        </g>
      ))}
      {LINES.map((l) => (
        <g key={l.p}>
          <polyline fill="none" className={l.p === 50 ? "growth-line growth-line--mid" : "growth-line"} points={steps.map((m) => `${X(m)},${Y(xOf(l.z, lms(ind, sex, m)))}`).join(" ")} />
          <text x={X(max) + 4} y={Y(xOf(l.z, lms(ind, sex, max))) + 4} className="growth-axis">
            {l.p}th
          </text>
        </g>
      ))}
      <circle cx={X(months)} cy={Y(value)} r={7} className="growth-dot" />
    </svg>
  );
}

export default function GrowthChart() {
  const [sex, setSex] = useState<Sex>("girls");
  const [dob, setDob] = useState("");
  const [on, setOn] = useState(isoDay(today()));
  const [vals, setVals] = useState<Record<Ind, string>>({ wfa: "", lhfa: "", hcfa: "" });
  const birth = parseDate(dob);
  const when = parseDate(on);
  const days = birth && when ? daysBetween(birth, when) : -1;
  const months = days / 30.4375;
  const ageOk = days >= 0 && months <= 60;

  const results = (Object.keys(LABEL) as Ind[])
    .map((ind) => ({ ind, v: Number(vals[ind]) }))
    .filter((r) => r.v > 0 && ageOk)
    .map((r) => {
      const z = zOf(r.v, lms(r.ind, sex, months));
      return { ...r, z, p: pct(z) };
    })
    .filter((r) => Math.abs(r.z) < 6);

  return (
    <div className="tool-card">
      <form className="tool-form" onSubmit={(e) => e.preventDefault()}>
        <fieldset className="tool-toggle">
          <legend>Your child is a</legend>
          <label>
            <input type="radio" name="s" checked={sex === "girls"} onChange={() => setSex("girls")} /> Girl
          </label>
          <label>
            <input type="radio" name="s" checked={sex === "boys"} onChange={() => setSex("boys")} /> Boy
          </label>
        </fieldset>
        <label>
          <span>Date of birth</span>
          <input type="date" value={dob} max={isoDay(today())} onChange={(e) => setDob(e.target.value)} />
        </label>
        <label>
          <span>Date measured</span>
          <input type="date" value={on} max={isoDay(today())} onChange={(e) => setOn(e.target.value)} />
        </label>
        <div className="tool-row">
          {(Object.keys(LABEL) as Ind[]).map((ind) => (
            <label key={ind}>
              <span>
                {LABEL[ind].name} ({LABEL[ind].unit})
              </span>
              <input type="number" inputMode="decimal" step="0.1" value={vals[ind]} onChange={(e) => setVals({ ...vals, [ind]: e.target.value })} />
            </label>
          ))}
        </div>
        <small>Fill in any one or more. Under 2 years, measure length lying down; from 2 years, height standing.</small>
      </form>

      {dob && !ageOk && <p className="tool-warn">This chart covers birth to 5 years. Please check the dates.</p>}

      {results.length > 0 && (
        <div className="tool-result" aria-live="polite">
          {results.map((r) => (
            <div key={r.ind} className="growth-block">
              <p className="tool-result__lead">
                {LABEL[r.ind].name}: <strong>{Math.round(r.p) < 1 ? "below the 1st" : Math.round(r.p) > 99 ? "above the 99th" : `${Math.round(r.p)}th`} percentile</strong>, {words(r.p)}
              </p>
              <Chart ind={r.ind} sex={sex} months={months} value={r.v} />
            </div>
          ))}
          <p className="tool-small">
            The 50th percentile is the middle, not a target. A child who stays near the same line over time is usually growing well, whichever line it
            is. What matters is the pattern across several visits, so take these numbers to your paediatrician rather than reading one alone.
          </p>
        </div>
      )}
    </div>
  );
}
