"use client";

import { useState } from "react";
import REF from "@/lib/tools-reference/pregnancy-sugar-targets.json";
import { Answer, Choice, NumberField } from "../ui";
import { Card, ClearButton, Outro, downloadCsv, newId, num, useLocalLog, useToolTracking, type ToolProps } from "./kit";

/* Pregnancy sugar targets, with an optional log kept only in this browser.
   Targets: lib/tools-reference/pregnancy-sugar-targets.json. */

type Kind = "fasting" | "one_hour" | "two_hour" | "random";
const KIND_LABEL: Record<Kind, string> = { fasting: "Fasting", one_hour: "1 hour after a meal", two_hour: "2 hours after a meal", random: "Random" };
type Row = { id: string; date: string; kind: Kind; mg: number };
const KEY = "pv-sugar-log";

export default function SugarTargets({ consult, condition }: ToolProps) {
  const [kind, setKind] = useState<Kind>("fasting");
  const [unit, setUnit] = useState<"mg" | "mmol">("mg");
  const [value, setValue] = useState("");
  const log = useLocalLog<Row>(KEY);
  const v = num(value);
  const mg = v === null ? null : unit === "mg" ? v : v * REF.mg_per_mmol;
  const valid = mg !== null && mg >= 20 && mg <= 600;
  const target = kind === "random" ? null : REF.targets_mg_dl[kind];
  const over = valid && target !== null && mg! >= target;
  const track = useToolTracking("pregnancy-sugar-targets", valid);
  const show = (n: number) => (unit === "mg" ? `${Math.round(n)} mg/dL` : `${(n / REF.mg_per_mmol).toFixed(1)} mmol/L`);

  return (
    <div className="ctool">
      <div className="tool-bench">
        <form className="tool-panel" onSubmit={(e) => e.preventDefault()} onChange={track}>
          <Choice
            legend="When was it taken?"
            name="kind"
            value={kind}
            onChange={setKind}
            tiles
            options={(Object.keys(KIND_LABEL) as Kind[]).map((k) => ({ value: k, label: KIND_LABEL[k] }))}
          />
          <div className="tool-row">
            <NumberField label="Reading" unit={unit === "mg" ? "mg/dL" : "mmol/L"} min={0} step="any" value={value} onChange={setValue} placeholder={unit === "mg" ? "e.g. 92" : "e.g. 5.1"} />
            <Choice
              legend="Unit"
              name="unit"
              value={unit}
              onChange={setUnit}
              options={[
                { value: "mg", label: "mg/dL" },
                { value: "mmol", label: "mmol/L" },
              ]}
            />
          </div>
          {valid ? (
            <button type="button" className="btn btn--ghost btn--sm" onClick={() => log.add({ id: newId(), date: new Date().toISOString().slice(0, 16).replace("T", " "), kind, mg: mg! })}>
              Save to my log on this phone
            </button>
          ) : null}
        </form>
        <Answer
          eyebrow="Against the pregnancy target"
          empty="Enter a reading to compare it with the usual pregnancy target."
          value={!valid ? undefined : target === null ? "No set target for a random reading" : over ? "Above the usual target" : "Within the usual target"}
          sub={!valid ? undefined : target === null ? "Share random readings with your doctor along with your other readings." : `The usual ${KIND_LABEL[kind].toLowerCase()} target in pregnancy is under ${show(target)}.`}
        />
      </div>

      {log.rows.length ? (
        <div className="ctool__log">
          <div className="ctool__log-head">
            <h3>Your log</h3>
            <span>
              <button type="button" className="btn btn--ghost btn--sm" onClick={() => downloadCsv("sugar-log.csv", ["date", "type", "mg/dL"], log.rows.map((r) => [r.date, KIND_LABEL[r.kind], Math.round(r.mg)]))}>
                Export CSV
              </button>{" "}
              <ClearButton onClear={log.clear} />
            </span>
          </div>
          <table className="ctool__table">
            <caption className="visually-hidden">Sugar readings, newest first</caption>
            <thead>
              <tr>
                <th scope="col">When</th>
                <th scope="col">Type</th>
                <th scope="col">Reading</th>
                <th scope="col">
                  <span className="visually-hidden">Delete</span>
                </th>
              </tr>
            </thead>
            <tbody>
              {log.rows.map((r) => {
                const t = r.kind === "random" ? null : REF.targets_mg_dl[r.kind];
                return (
                  <tr key={r.id} className={t !== null && r.mg >= t ? "is-call" : "is-ok"}>
                    <td>{r.date}</td>
                    <td>{KIND_LABEL[r.kind]}</td>
                    <td>
                      <b>{show(r.mg)}</b>
                    </td>
                    <td>
                      <button type="button" className="ctool__del" onClick={() => log.remove(r.id)} aria-label={`Delete reading from ${r.date}`}>
                        ×
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      ) : null}

      {valid ? (
        <Outro
          consult={consult}
          condition={condition}
          read={
            <>
              {over ? (
                <Card tone="watch" title="One reading above target">
                  <p>One high reading is worth noting, not panicking about. Write it down with what you ate, and share your log with your doctor at the next visit, or sooner if many readings are high.</p>
                </Card>
              ) : null}
              <Card title="About the DIPSI test used in India">
                <p>
                  In the DIPSI test you drink {REF.dipsi.glucose_g} g of glucose, fasting or not, and blood sugar is checked 2 hours later. A 2-hour value of{" "}
                  {REF.dipsi.two_hour_gdm_at_or_above} mg/dL or above is taken as gestational diabetes.
                </p>
              </Card>
            </>
          }
          questions={["What targets should I aim for, and how often should I check?", "Should I see a dietitian?", "At what reading should I call you?"]}
        />
      ) : null}
    </div>
  );
}
