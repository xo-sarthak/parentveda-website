import type { Metadata } from "next";
import ConditionToolPage, { conditionToolMetadata } from "@/components/tools/condition/ConditionToolPage";

// Re-reads the article list every minute, so a newly published read appears under "Read next".
export const revalidate = 60;

const SLUG = "screening-result-explainer";

export const metadata: Metadata = conditionToolMetadata(SLUG, "Double Marker, Triple and NIPT Result Explainer: What 1 in N Means", "Turn a 1 in N result from a double marker, NT, triple, quadruple or NIPT report into plain words, see if it is above the lab's cut-off, and the next steps.");

const FAQS = [
  {
    "q": "Is 1 in 100 higher or lower risk than 1 in 1,000?",
    "a": "Higher. The smaller the second number, the higher the chance."
  },
  {
    "q": "What does the cut-off mean?",
    "a": "It is the line the lab uses to call a result high risk. Results at or above that chance are flagged for a further test."
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
      intro={"Choose your test, enter the \"1 in\" number and the lab's cut-off from the report, and see what it means in plain words."}
      note={"Screening tests give a chance, not a diagnosis. Only CVS or amniocentesis can confirm. Your numbers stay on this phone."}
      faqs={FAQS}
    />
  );
}
