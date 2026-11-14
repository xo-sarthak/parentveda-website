"use client";

import { useState } from "react";
import REF from "@/lib/tools-reference/afi-reader.json";
import { Answer, Choice, NumberField } from "../ui";
import { Card, Outro, num, useToolTracking, type ToolProps } from "./kit";

/* Amniotic fluid reader. Values: lib/tools-reference/afi-reader.json. */

export default function AfiReader({ consult, condition }: ToolProps) {
  const [mode, setMode] = useState<"afi" | "sdp">("afi");
  const [cm, setCm] = useState("");
  const [weeks, setWeeks] = useState("");
  const v = num(cm);
  const w = num(weeks);
  const valid = v !== null && v >= 0 && v <= 60 && (w === null || (w >= 14 && w <= 42));
  const track = useToolTracking("afi-reader", valid);

  let reading: { label: string; tone: "ok" | "watch" | "act"; sub: string } | null = null;
  if (valid) {
    if (mode === "afi") {
      const r = REF.afi_cm;
      reading =
        v! < r.low_below
          ? { label: "Lower than usual", tone: "act", sub: `An AFI under ${r.low_below} cm is called low (oligohydramnios).` }
          : v! < r.lower_normal_below
            ? { label: "On the lower side of normal", tone: "watch", sub: `${r.low_below} to ${r.lower_normal_below} cm is on the lower side of normal. Labs draw this line a little differently.` }
            : v! <= r.high_above
              ? { label: "In the usual range", tone: "ok", sub: `${r.lower_normal_below} to ${r.high_above} cm is the usual range.` }
              : { label: "Higher than usual", tone: "watch", sub: `An AFI above ${r.high_above} cm is called high (polyhydramnios).` };
    } else {
      const r = REF.sdp_cm;
      reading =
        v! < r.low_below
          ? { label: "Lower than usual", tone: "act", sub: `A deepest pocket under ${r.low_below} cm is called low.` }
          : v! > r.high_above
            ? { label: "Higher than usual", tone: "watch", sub: `A deepest pocket above ${r.high_above} cm is called high.` }
            : { label: "In the usual range", tone: "ok", sub: `${r.low_below} to ${r.high_above} cm is the usual range.` };
    }
  }

  return (
    <div className="ctool">
      <div className="tool-bench">
        <form className="tool-panel" onSubmit={(e) => e.preventDefault()} onChange={track}>
          <Choice
            legend="Which number is on your report?"
            name="mode"
            value={mode}
            onChange={setMode}
            tiles
            options={[
              { value: "afi", label: "AFI (amniotic fluid index)" },
              { value: "sdp", label: "Single deepest pocket (SDP)" },
            ]}
          />
          <div className="tool-row">
            <NumberField label={mode === "afi" ? "AFI" : "Deepest pocket"} unit="cm" min={0} max={60} step="any" value={cm} onChange={setCm} placeholder="e.g. 9.5" />
            <NumberField label="Weeks pregnant" hint="Optional" min={14} max={42} value={weeks} onChange={setWeeks} />
          </div>
        </form>
        <Answer eyebrow="Where your number sits" empty="Enter the number from your scan report." value={reading?.label} sub={reading?.sub} />
      </div>
      {reading ? (
        <Outro
          consult={consult}
          condition={condition}
          read={
            <>
              <Card tone={reading.tone} title="What doctors usually do next">
                <p>
                  {reading.tone === "ok"
                    ? "Nothing extra for this number. Your regular scans continue."
                    : "Usually a repeat scan, a Doppler scan to check blood flow to the baby, and a check of the baby's growth. Your doctor decides how often."}
                </p>
              </Card>
              {reading.tone !== "ok" && mode === "afi" && v! < REF.afi_cm.lower_normal_below ? (
                <Card title="About drinking more water">
                  <p>Drinking more water has some evidence of raising fluid a little for a short time. Coconut water and other home remedies have no evidence of helping.</p>
                </Card>
              ) : null}
              <Card tone="act" title="Go to hospital if">
                <ul className="ctool__list">
                  <li>Fluid is leaking from your vagina</li>
                  <li>Your baby is moving less than usual</li>
                </ul>
              </Card>
            </>
          }
          questions={["Do I need a repeat scan or a Doppler, and when?", "Is my baby growing as expected?", "Does this change our plan for delivery?"]}
        />
      ) : null}
    </div>
  );
}
