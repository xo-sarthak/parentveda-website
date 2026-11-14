"use client";

import { useState } from "react";
import REF from "@/lib/tools-reference/bp-log.json";
import { Choice, Field, NumberField } from "../ui";
import { Card, ClearButton, EmergencyOverlay, Outro, downloadCsv, newId, num, useLocalLog, useToolTracking, type ToolProps } from "./kit";

/* Pregnancy BP log. Readings stay in this browser's localStorage and nowhere
   else: export them as a CSV or print them for the doctor. Thresholds:
   lib/tools-reference/bp-log.json. */

type Reading = { id: string; date: string; time: string; sys: number; dia: number; arm: "left" | "right"; notes: string };
const KEY = "pv-bp-log";

function level(r: { sys: number; dia: number }) {
  if (r.sys >= REF.emergency.systolic || r.dia >= REF.emergency.diastolic) return "emergency";
  if (r.sys >= REF.call_doctor.systolic || r.dia >= REF.call_doctor.diastolic) return "call";
  return "ok";
}

const today = () => new Date().toISOString().slice(0, 10);
const now = () => new Date().toTimeString().slice(0, 5);

export default function BpLog({ consult, condition }: ToolProps) {
  const log = useLocalLog<Reading>(KEY);
  const [f, setF] = useState({ date: today(), time: now(), sys: "", dia: "", arm: "left" as "left" | "right", notes: "" });
  const [symptoms, setSymptoms] = useState<string[]>([]);
  const [sos, setSos] = useState(false);
  const [error, setError] = useState("");
  const track = useToolTracking("bp-log", log.rows.length > 0);

  const add = (e: React.FormEvent) => {
    e.preventDefault();
    const sys = num(f.sys);
    const dia = num(f.dia);
    if (sys === null || dia === null || sys < 60 || sys > 260 || dia < 30 || dia > 180 || dia >= sys) {
      setError("Enter the top number (systolic) and the bottom number (diastolic), for example 118 and 76.");
      return;
    }
    setError("");
    const r: Reading = { id: newId(), date: f.date, time: f.time, sys, dia, arm: f.arm, notes: f.notes.slice(0, 200) };
    log.add(r);
    setF({ ...f, sys: "", dia: "", notes: "", time: now() });
    if (level(r) === "emergency") setSos(true);
  };

  const latest = log.rows[0];
  const latestLevel = latest ? level(latest) : null;

  return (
    <div className="ctool">
      {sos || symptoms.length ? (
        <EmergencyOverlay
          slug="bp-log"
          title="This needs a hospital now"
          items={[...(sos && latest ? [`A reading of ${latest.sys}/${latest.dia}`] : []), ...symptoms]}
          onClose={() => {
            setSos(false);
            setSymptoms([]);
          }}
        />
      ) : null}

      <form className="tool-panel tool-noprint" onSubmit={add} onChange={track}>
        <div className="tool-row">
          <Field label="Date">
            <input type="date" value={f.date} max={today()} onChange={(e) => setF({ ...f, date: e.target.value })} />
          </Field>
          <Field label="Time">
            <input type="time" value={f.time} onChange={(e) => setF({ ...f, time: e.target.value })} />
          </Field>
        </div>
        <div className="tool-row">
          <NumberField label="Top number (systolic)" unit="mmHg" min={60} max={260} value={f.sys} onChange={(v) => setF({ ...f, sys: v })} placeholder="e.g. 118" />
          <NumberField label="Bottom number (diastolic)" unit="mmHg" min={30} max={180} value={f.dia} onChange={(v) => setF({ ...f, dia: v })} placeholder="e.g. 76" />
        </div>
        <Choice
          legend="Arm"
          name="arm"
          value={f.arm}
          onChange={(v) => setF({ ...f, arm: v })}
          options={[
            { value: "left", label: "Left" },
            { value: "right", label: "Right" },
          ]}
        />
        <Field label="Notes" hint="Optional. Stays on this phone.">
          <input value={f.notes} maxLength={200} onChange={(e) => setF({ ...f, notes: e.target.value })} />
        </Field>
        {error ? <p className="tool-warn">{error}</p> : null}
        <button type="submit" className="btn btn--ink">
          Save reading
        </button>
        {!log.persist ? <p className="tool-warn">This browser is not letting us save, so the log will be gone when you close the page. Export it first.</p> : null}
      </form>

      <fieldset className="tool-panel tool-noprint ctool__symptoms">
        <legend className="tool-label">Do you have any of these right now?</legend>
        <div className="ctool__checks">
          {REF.emergency_symptoms.map((s) => (
            <label key={s}>
              <input type="checkbox" checked={symptoms.includes(s)} onChange={(e) => setSymptoms((x) => (e.target.checked ? [...x, s] : x.filter((y) => y !== s)))} /> {s}
            </label>
          ))}
        </div>
      </fieldset>

      {latest ? (
        latestLevel === "emergency" ? (
          <Card tone="act" title={`${latest.sys}/${latest.dia}: go to hospital now`}>
            <p>A reading of {REF.emergency.systolic}/{REF.emergency.diastolic} or higher needs care now. Call 108 or go to the nearest hospital.</p>
            <a href="tel:108" className="redflag__call">
              Call 108
            </a>
          </Card>
        ) : latestLevel === "call" ? (
          <Card tone="watch" title={`${latest.sys}/${latest.dia}: call your doctor today`}>
            <p>A reading of {REF.call_doctor.systolic}/{REF.call_doctor.diastolic} or higher in pregnancy should be checked by your doctor today.</p>
          </Card>
        ) : (
          <Card tone="ok" title={`${latest.sys}/${latest.dia}: below ${REF.call_doctor.systolic}/${REF.call_doctor.diastolic}`}>
            <p>Keep taking readings as your doctor advised.</p>
          </Card>
        )
      ) : null}

      {log.rows.length ? (
        <div className="ctool__log">
          <div className="ctool__log-head tool-noprint">
            <h3>Your readings</h3>
            <span>
              <button
                type="button"
                className="btn btn--ghost btn--sm"
                onClick={() => downloadCsv("bp-log.csv", ["date", "time", "systolic", "diastolic", "arm", "notes"], log.rows.map((r) => [r.date, r.time, r.sys, r.dia, r.arm, r.notes]))}
              >
                Export CSV
              </button>{" "}
              <button type="button" className="btn btn--ghost btn--sm" onClick={() => window.print()}>
                Print or save as PDF
              </button>{" "}
              <ClearButton onClear={log.clear} />
            </span>
          </div>
          <table className="ctool__table">
            <caption className="visually-hidden">Blood pressure readings, newest first</caption>
            <thead>
              <tr>
                <th scope="col">Date</th>
                <th scope="col">Time</th>
                <th scope="col">Reading</th>
                <th scope="col">Arm</th>
                <th scope="col">Notes</th>
                <th scope="col" className="tool-noprint">
                  <span className="visually-hidden">Delete</span>
                </th>
              </tr>
            </thead>
            <tbody>
              {log.rows.map((r) => (
                <tr key={r.id} className={`is-${level(r)}`}>
                  <td>{r.date}</td>
                  <td>{r.time}</td>
                  <td>
                    <b>
                      {r.sys}/{r.dia}
                    </b>
                  </td>
                  <td>{r.arm}</td>
                  <td>{r.notes}</td>
                  <td className="tool-noprint">
                    <button type="button" className="ctool__del" onClick={() => log.remove(r.id)} aria-label={`Delete ${r.sys}/${r.dia} on ${r.date}`}>
                      ×
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : null}

      <details className="ctool__how tool-noprint">
        <summary>How to measure correctly</summary>
        <ul className="ctool__list">
          {REF.how_to_measure.map((t) => (
            <li key={t}>{t}</li>
          ))}
        </ul>
      </details>

      <div className="tool-noprint">
        <Outro
          consult={consult}
          condition={condition}
          questions={["How often should I check my blood pressure, and at what time of day?", "At what reading should I call you?", "Do I need any blood or urine tests?"]}
        />
      </div>
    </div>
  );
}
