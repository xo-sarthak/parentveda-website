"use client";

import { useState } from "react";
import { addDays, daysBetween, fmt, isoDay, parseDate, today } from "./date";
import { Answer, Field } from "./ui";

/* IAP (ACVIP) recommended schedule for healthy children, simplified to the
   standard age points. Days are from birth; months use 30.44 days. The
   paediatrician may adjust brands, combinations and timing. */
const M = (m: number) => Math.round(m * 30.44);
const W = (w: number) => w * 7;

const SCHEDULE: { age: string; at: number; vaccines: string[] }[] = [
  { age: "At birth", at: 0, vaccines: ["BCG", "OPV 0", "Hepatitis B 1"] },
  { age: "6 weeks", at: W(6), vaccines: ["DTwP/DTaP 1", "IPV 1", "Hib 1", "Hepatitis B 2", "Rotavirus 1", "PCV 1"] },
  { age: "10 weeks", at: W(10), vaccines: ["DTwP/DTaP 2", "IPV 2", "Hib 2", "Hepatitis B 3", "Rotavirus 2", "PCV 2"] },
  { age: "14 weeks", at: W(14), vaccines: ["DTwP/DTaP 3", "IPV 3", "Hib 3", "Hepatitis B 4", "Rotavirus 3 (if your doctor uses a 3-dose brand)", "PCV 3"] },
  { age: "6 months", at: M(6), vaccines: ["Influenza 1 (then once a year)", "Typhoid conjugate vaccine (6 to 9 months)"] },
  { age: "7 months", at: M(7), vaccines: ["Influenza 2 (four weeks after the first)"] },
  { age: "9 months", at: M(9), vaccines: ["MMR 1"] },
  { age: "12 months", at: M(12), vaccines: ["Hepatitis A 1"] },
  { age: "12 to 15 months", at: M(12), vaccines: ["PCV booster"] },
  { age: "15 months", at: M(15), vaccines: ["MMR 2", "Varicella 1"] },
  { age: "16 to 18 months", at: M(16), vaccines: ["DTwP/DTaP booster 1", "IPV booster 1", "Hib booster 1"] },
  { age: "18 to 19 months", at: M(18), vaccines: ["Hepatitis A 2 (if an inactivated vaccine was used)", "Varicella 2"] },
  { age: "4 to 6 years", at: M(48), vaccines: ["DTwP/DTaP booster 2", "IPV booster 2", "MMR 3"] },
  { age: "10 to 12 years", at: M(120), vaccines: ["Tdap", "HPV (2 doses, for girls and boys as advised)"] },
];

export default function VaccineSchedule() {
  const [dob, setDob] = useState("");
  const birth = parseDate(dob);
  const now = today();
  const valid = birth && birth <= now && daysBetween(birth, now) < M(13 * 12);
  const dated = valid ? birth : null;
  const next = dated ? SCHEDULE.find((s) => addDays(dated, s.at) >= now) : undefined;

  return (
    <>
      <div className="tool-bench">
        <form className="tool-panel" onSubmit={(e) => e.preventDefault()}>
          <Field label="Your baby's date of birth">
            <input type="date" value={dob} max={isoDay(now)} onChange={(e) => setDob(e.target.value)} />
          </Field>
          {dob && !valid && <p className="tool-warn">Please enter a birth date in the past (up to 12 years ago).</p>}
          {dated && (
            <button type="button" className="btn btn--ghost btn--sm tool-print" onClick={() => window.print()}>
              Print or save as PDF
            </button>
          )}
        </form>

        <Answer
          eyebrow="Next due"
          empty="Add your baby's date of birth and every date below will fill in."
          value={dated ? (next ? next.age : "No more dates on this list") : undefined}
          sub={dated ? (next ? `Around ${fmt(addDays(dated, next.at))}` : "Ask your paediatrician what comes next.") : undefined}
        >
          {next && <p className="tool-small">{next.vaccines.join(", ")}</p>}
        </Answer>
      </div>

      <ol className="vax-line">
        {SCHEDULE.map((s) => {
          const when = dated ? addDays(dated, s.at) : null;
          const state = !when ? "" : s === next ? " is-next" : when < now ? " is-past" : "";
          return (
            <li key={s.age} className={`vax-line__item${state}`}>
              <span className="vax-line__age">
                <strong>{s.age}</strong>
                {when && <span>{fmt(when, { day: "numeric", month: "short", year: "numeric" })}</span>}
              </span>
              <span className="vax-line__list">{s.vaccines.join(", ")}</span>
            </li>
          );
        })}
      </ol>
      {dated && <p className="tool-small">Dates already passed are greyed out. If a dose was missed, it is usually given at the next visit, not restarted. Ask your paediatrician.</p>}
    </>
  );
}
