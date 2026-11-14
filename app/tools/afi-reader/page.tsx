import type { Metadata } from "next";
import ConditionToolPage, { conditionToolMetadata } from "@/components/tools/condition/ConditionToolPage";

// Re-reads the article list every minute, so a newly published read appears under "Read next".
export const revalidate = 60;

const SLUG = "afi-reader";

export const metadata: Metadata = conditionToolMetadata(SLUG, "AFI Reader: Is My Amniotic Fluid Level Normal?", "Enter the AFI or single deepest pocket from your scan report to see whether it is low, usual or high, and what doctors usually do next.");

const FAQS = [
  {
    "q": "What is AFI?",
    "a": "The amniotic fluid index adds up the deepest pocket of fluid in four parts of the womb, in centimetres."
  },
  {
    "q": "Can drinking water help?",
    "a": "Drinking more water has some evidence of raising fluid a little for a short time. Home remedies such as coconut water have no evidence."
  },
  {
    "q": "Is anything I enter saved?",
    "a": "No. Your numbers stay in this browser and are gone when you close the page."
  }
];

export default function Page() {
  return (
    <ConditionToolPage
      slug={SLUG}
      intro={"Enter the AFI or single deepest pocket from your scan report, in centimetres, to see where it sits."}
      note={"Labs draw the lines a little differently, and one scan is a snapshot. Your doctor reads it with the baby's growth and blood flow. Your numbers stay on this phone."}
      faqs={FAQS}
    />
  );
}
