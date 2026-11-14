import type { Metadata } from "next";
import ConditionToolPage, { conditionToolMetadata } from "@/components/tools/condition/ConditionToolPage";

// Re-reads the article list every minute, so a newly published read appears under "Read next".
export const revalidate = 60;

const SLUG = "amh-reader";

export const metadata: Metadata = conditionToolMetadata(SLUG, "AMH Test Result Reader: Low, Normal or High for Your Age", "Enter your AMH result and age to see how it compares with what is usual at your age, in ng/mL or pmol/L, and what AMH does and does not tell you.");

const FAQS = [
  {
    "q": "Does a low AMH mean I cannot get pregnant?",
    "a": "No. AMH says nothing about your chance of pregnancy in a given month. It helps your doctor plan timing and treatment."
  },
  {
    "q": "How do I convert pmol/L to ng/mL?",
    "a": "Divide pmol/L by 7.14. The tool does this for you."
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
      intro={"Enter your age and AMH result, in ng/mL or pmol/L, and see how it compares with what is usual at your age."}
      note={"AMH is one number among several your doctor looks at. It reflects how many eggs are left, not their quality. Your numbers stay on this phone."}
      faqs={FAQS}
    />
  );
}
