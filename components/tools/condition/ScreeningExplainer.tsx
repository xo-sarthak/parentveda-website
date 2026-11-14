"use client";

import { useState } from "react";
import REF from "@/lib/tools-reference/screening-result-explainer.json";
import { Answer, Choice, Field, NumberField } from "../ui";
import { Card, Outro, num, useToolTracking, type ToolProps } from "./kit";

/* Screening result explainer. Turns "1 in N" into plain words, explains
   screening against diagnosis, and gives next steps. A high-risk NIPT always
   goes to a diagnostic test and fetal medicine; it is never "confirmed".
   Values: lib/tools-reference/screening-result-explainer.json. */

export default function ScreeningExplainer({ consult, condition }: ToolProps) {
  const [test, setTest] = useState("double");
  const [cond, setCond] = useState("t21");
  const [n, setN] = useState("");
  const [cutoff, setCutoff] = useState(String(REF.default_cutoff));
  const [nipt, setNipt] = useState<"" | "low" | "high" | "none">("");
  const isNipt = test === "nipt";
  const N = num(n);
  const C = num(cutoff) ?? REF.default_cutoff;
  const valid = isNipt ? nipt !== "" : N !== null && N >= 2 && N <= 100000;
  const above = !isNipt && valid && N! <= C;
  const condLabel = REF.conditions.find((c) => c.id === cond)!.in_sentence;
  const track = useToolTracking("screening-result-explainer", valid);
  const pct = valid && !isNipt ? 100 / N! : 0;
  const pctText = pct >= 1 ? pct.toFixed(1) : pct >= 0.1 ? pct.toFixed(2) : pct.toFixed(3);

  return (
    <div className="ctool">
      <div className="tool-bench">
        <form className="tool-panel" onSubmit={(e) => e.preventDefault()} onChange={track}>
          <Field label="Which test?">
            <select value={test} onChange={(e) => setTest(e.target.value)}>
              {REF.tests.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.label}
                </option>
              ))}
            </select>
          </Field>
          <Field label="Result for">
            <select value={cond} onChange={(e) => setCond(e.target.value)}>
              {REF.conditions.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.label}
                </option>
              ))}
            </select>
          </Field>
          {isNipt ? (
            <Choice
              legend="What does the NIPT report say?"
              name="nipt"
              value={nipt}
              onChange={setNipt}
              options={[
                { value: "low", label: "Low risk" },
                { value: "high", label: "High risk" },
                { value: "none", label: "No result" },
              ]}
            />
          ) : (
            <div className="tool-row">
              <NumberField label="Your result: 1 in" min={2} value={n} onChange={setN} placeholder="e.g. 180" />
              <NumberField label="Lab's cut-off: 1 in" hint="Printed on the report. Often 250." min={2} value={cutoff} onChange={setCutoff} />
            </div>
          )}
        </form>
        <Answer
          eyebrow="What your result means"
          empty="Choose your test and enter the result from the report."
          value={
            !valid
              ? undefined
              : isNipt
                ? nipt === "high"
                  ? "A high-risk NIPT needs a confirming test"
                  : nipt === "low"
                    ? "A low-risk NIPT"
                    : "No result is common, and usually means a repeat"
                : `About ${pctText}% chance`
          }
          sub={
            valid && !isNipt
              ? `1 in ${N!.toLocaleString("en-IN")} means that of ${N!.toLocaleString("en-IN")} pregnancies with this result, about 1 would have ${condLabel} and the rest would not. This is ${above ? "above" : "below"} the lab's cut-off of 1 in ${C.toLocaleString("en-IN")}.`
              : undefined
          }
        />
      </div>
      {valid ? (
        <Outro
          consult={consult}
          condition={condition}
          read={
            <>
              <Card title="A screen, not a diagnosis">
                <p>
                  A screening test gives a chance, not an answer. Only a diagnostic test, CVS or amniocentesis, can say for certain whether the baby has the condition.
                </p>
              </Card>
              {isNipt && nipt === "high" ? (
                <Card tone="act" title="Next step: a diagnostic test and a fetal medicine specialist">
                  <p>NIPT is a very good screen, but a high-risk result is not a confirmed diagnosis. Doctors confirm it with CVS or amniocentesis before any decision is made.</p>
                </Card>
              ) : isNipt && nipt === "none" ? (
                <Card title="Next step">
                  <p>Ask your doctor whether to repeat the NIPT or go straight to another test.</p>
                </Card>
              ) : isNipt ? (
                <Card tone="ok" title="Next step">
                  <p>A low-risk NIPT is reassuring. Your regular scans, including the anomaly scan, still go ahead as planned.</p>
                </Card>
              ) : above ? (
                <Card tone="watch" title="Next step: talk about NIPT or a diagnostic test">
                  <p>{REF.stat_line} Your doctor may offer NIPT as the next screen, or CVS or amniocentesis for a definite answer.</p>
                </Card>
              ) : (
                <Card tone="ok" title="Next step">
                  <p>A result below the cut-off is called low risk. Your regular scans continue as planned. Ask your doctor if anything else on the report needs attention.</p>
                </Card>
              )}
            </>
          }
          questions={
            isNipt && nipt === "high"
              ? ["Should we have CVS or amniocentesis, and when?", "Can we see a fetal medicine specialist?", "What support is there while we wait for the result?"]
              : ["Is NIPT worth doing for us?", "Would you suggest CVS or amniocentesis, and what are the risks?", "Is anything else on the report worth a closer look?"]
          }
        />
      ) : null}
    </div>
  );
}
