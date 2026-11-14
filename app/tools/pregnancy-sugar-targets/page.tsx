import type { Metadata } from "next";
import ConditionToolPage, { conditionToolMetadata } from "@/components/tools/condition/ConditionToolPage";

// Re-reads the article list every minute, so a newly published read appears under "Read next".
export const revalidate = 60;

const SLUG = "pregnancy-sugar-targets";

export const metadata: Metadata = conditionToolMetadata(SLUG, "Pregnancy Blood Sugar Targets: Fasting and After-Meal Levels", "Check a fasting or after-meal blood sugar reading against the usual pregnancy targets, in mg/dL or mmol/L, and keep a simple log for your doctor.");

const FAQS = [
  {
    "q": "Fasting, 1 hour or 2 hours: which should I check?",
    "a": "Whichever your doctor asked for. Many women check fasting and after the main meals."
  },
  {
    "q": "How do I convert mmol/L to mg/dL?",
    "a": "Multiply by 18. The tool does this for you."
  },
  {
    "q": "Where is my log saved?",
    "a": "Only in this browser on this phone. Use Export to keep a copy."
  }
];

export default function Page() {
  return (
    <ConditionToolPage
      slug={SLUG}
      intro={"Choose when the reading was taken and enter it, in mg/dL or mmol/L, to compare it with the usual pregnancy target."}
      note={"Your doctor may set different targets for you. Readings you save stay only in this browser on this phone."}
      faqs={FAQS}
    />
  );
}
