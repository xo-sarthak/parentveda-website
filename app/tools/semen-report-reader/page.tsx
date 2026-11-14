import type { Metadata } from "next";
import ConditionToolPage, { conditionToolMetadata } from "@/components/tools/condition/ConditionToolPage";

// Re-reads the article list every minute, so a newly published read appears under "Read next".
export const revalidate = 60;

const SLUG = "semen-report-reader";

export const metadata: Metadata = conditionToolMetadata(SLUG, "Semen Analysis Report Reader: What Each Number Means", "Type in the numbers from a semen analysis report and see, line by line, how each compares with the WHO 2021 reference range, in plain words.");

const FAQS = [
  {
    "q": "Why repeat the test?",
    "a": "Sperm numbers change from sample to sample with illness, heat, stress and the gap since the last ejaculation, so doctors look at two tests before deciding anything."
  },
  {
    "q": "What if the report says nil?",
    "a": "It means no sperm were seen in that sample. The next step is an andrologist or urologist, who will usually repeat the test and look for the reason."
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
      intro={"Fill in any lines from the report: volume, count, motility, normal forms and vitality. Each one is compared with the usual range, in plain words."}
      note={"Ranges follow the WHO laboratory manual (2021). One test is not a conclusion: numbers move a lot from one sample to the next. Your numbers stay on this phone."}
      faqs={FAQS}
    />
  );
}
