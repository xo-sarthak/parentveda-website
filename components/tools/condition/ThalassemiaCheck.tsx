"use client";

import { useState } from "react";
import Link from "next/link";
import REF from "@/lib/tools-reference/thalassemia-couple-check.json";
import { Field } from "../ui";
import { Card, Outro, useToolTracking, type ToolProps } from "./kit";

/* Thalassemia couple check. What both partners' results mean together for
   each pregnancy. Values: lib/tools-reference/thalassemia-couple-check.json. */

type Status = "" | "not-tested" | "normal" | "carrier" | "variant" | "unsure";
const OPTIONS: { value: Status; label: string }[] = [
  { value: "not-tested", label: "Not tested" },
  { value: "normal", label: "Normal" },
  { value: "carrier", label: "Carrier (thalassemia minor or trait)" },
  { value: "variant", label: "Another haemoglobin variant (such as HbE or HbS)" },
  { value: "unsure", label: "Not sure" },
];

function Figures() {
  const kinds = [
    { cls: "affected", label: "Thalassemia major" },
    { cls: "carrier", label: "Carrier" },
    { cls: "carrier", label: "Carrier" },
    { cls: "clear", label: "Not affected" },
  ];
  return (
    <figure className="ctool__figs" aria-label="Out of 4 children, on average 1 has thalassemia major, 2 are carriers and 1 is not affected">
      <div>
        {kinds.map((k, i) => (
          <span key={i} className={`ctool__fig ctool__fig--${k.cls}`}>
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <circle cx="12" cy="7" r="4" />
              <path d="M4 22c0-4.4 3.6-8 8-8s8 3.6 8 8z" />
            </svg>
            <small>{k.label}</small>
          </span>
        ))}
      </div>
      <figcaption>For each pregnancy, on average</figcaption>
    </figure>
  );
}

export default function ThalassemiaCheck({ consult, condition }: ToolProps) {
  const [a, setA] = useState<Status>("");
  const [b, setB] = useState<Status>("");
  const both = a && b;
  const track = useToolTracking("thalassemia-couple-check", Boolean(both));
  const pick = (set: (s: Status) => void) => (e: React.ChangeEvent<HTMLSelectElement>) => {
    track();
    set(e.target.value as Status);
  };

  let read: React.ReactNode = null;
  let questions: string[] = [];
  if (both) {
    const pair = [a, b];
    if (pair.includes("variant")) {
      read = (
        <Card tone="watch" title="This needs a specialist to read">
          <p>Some haemoglobin variants behave differently when combined with a thalassemia trait. A haematologist or genetic counsellor can tell you what your two results mean together.</p>
        </Card>
      );
      questions = ["What does this variant mean when combined with my partner's result?", "Do we need any more tests?", "What are our options before or during pregnancy?"];
    } else if (pair.includes("not-tested") || pair.includes("unsure")) {
      read = (
        <Card title="Test the other partner first">
          <p>
            The answer depends on both results. A simple blood test (often an HbA2 or haemoglobin electrophoresis test) shows whether
            someone is a carrier.{" "}
            <Link className="link" href={`/reads/articles/${REF.test_article}/`}>
              Read about the tests worth doing before pregnancy
            </Link>
            .
          </p>
        </Card>
      );
      questions = ["Which test shows whether I am a carrier?", "Should both of us be tested before we try?"];
    } else if (a === "carrier" && b === "carrier") {
      read = (
        <>
          <Card tone="act" title="Both of you are carriers">
            <p>
              In each pregnancy there is a {REF.both_carriers.affected} chance the baby has thalassemia major, a {REF.both_carriers.carrier} chance the baby is a carrier like you, and a{" "}
              {REF.both_carriers.unaffected} chance the baby is not affected. The chances are the same in every pregnancy.
            </p>
            <Figures />
            <p>
              The next step is genetic counselling, before pregnancy or early in it. A test in pregnancy (CVS, at {REF.cvs_weeks} weeks) can show whether the baby is affected.
            </p>
          </Card>
        </>
      );
      questions = ["Can we see a genetic counsellor before we try?", "How and when is CVS done, and what are its risks?", "What are our other options?"];
    } else if (pair.includes("carrier")) {
      read = (
        <Card tone="ok" title="No thalassemia major from this combination">
          <p>With one carrier and one normal result, a baby cannot have thalassemia major from these two results. Each child may be a carrier, which does not make them unwell. Some variants still need a specialist to read, so share both reports with your doctor.</p>
        </Card>
      );
      questions = ["Should our children be tested as carriers when they are older?", "Is there anything in our reports that needs a closer look?"];
    } else {
      read = (
        <Card tone="ok" title="Neither of you is a carrier on these results">
          <p>With two normal results, thalassemia major is not expected from your two results. Keep both reports for your pregnancy records.</p>
        </Card>
      );
      questions = ["Is there anything else we should be tested for before pregnancy?"];
    }
  }

  return (
    <div className="ctool">
      <form className="tool-panel" onSubmit={(e) => e.preventDefault()}>
        <div className="tool-row">
          <Field label="Her result">
            <select value={a} onChange={pick(setA)}>
              <option value="">Choose</option>
              {OPTIONS.map((o) => (
                <option key={o.value} value={o.value}>
                  {o.label}
                </option>
              ))}
            </select>
          </Field>
          <Field label="His result">
            <select value={b} onChange={pick(setB)}>
              <option value="">Choose</option>
              {OPTIONS.map((o) => (
                <option key={o.value} value={o.value}>
                  {o.label}
                </option>
              ))}
            </select>
          </Field>
        </div>
      </form>
      {both ? <Outro consult={consult} condition={condition} read={read} questions={questions} /> : null}
    </div>
  );
}
