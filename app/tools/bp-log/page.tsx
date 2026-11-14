import type { Metadata } from "next";
import ConditionToolPage, { conditionToolMetadata } from "@/components/tools/condition/ConditionToolPage";

// Re-reads the article list every minute, so a newly published read appears under "Read next".
export const revalidate = 60;

const SLUG = "bp-log";

export const metadata: Metadata = conditionToolMetadata(SLUG, "Pregnancy Blood Pressure Log: Track and Print Your BP Readings", "Keep your pregnancy blood pressure readings on your phone, see when a reading needs a call to your doctor, and export or print the log for your visit.");

const FAQS = [
  {
    "q": "Where are my readings saved?",
    "a": "Only in this browser on this phone. Nothing is uploaded. Use Export to keep a copy."
  },
  {
    "q": "Which arm should I use?",
    "a": "Use the same arm each time, the one your doctor suggests, and note it."
  },
  {
    "q": "What if I feel unwell?",
    "a": "Tick any symptom in the list. If you have a bad headache, vision changes, upper tummy pain, breathlessness or sudden swelling, go to hospital or call 108."
  }
];

export default function Page() {
  return (
    <ConditionToolPage
      slug={SLUG}
      intro={"Save each reading as you take it. You will see when a reading needs a call to your doctor, and you can print the log or export it for your visit."}
      note={"Readings are saved only in this browser on this phone. They are not sent anywhere. Clearing your browser data removes them, so export the log before you change phones."}
      faqs={FAQS}
    />
  );
}
