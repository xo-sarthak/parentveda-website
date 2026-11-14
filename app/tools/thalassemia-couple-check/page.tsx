import type { Metadata } from "next";
import ConditionToolPage, { conditionToolMetadata } from "@/components/tools/condition/ConditionToolPage";

// Re-reads the article list every minute, so a newly published read appears under "Read next".
export const revalidate = 60;

const SLUG = "thalassemia-couple-check";

export const metadata: Metadata = conditionToolMetadata(SLUG, "Thalassemia Carrier Check for Couples", "Choose each partner's thalassemia test result and see what it means for your children, with a simple picture of the chances and the next step.");

const FAQS = [
  {
    "q": "What is a thalassemia carrier?",
    "a": "Someone with one changed gene for haemoglobin. Carriers are usually well, but can pass the gene on."
  },
  {
    "q": "Which test shows if I am a carrier?",
    "a": "A blood test, often called HbA2 or haemoglobin electrophoresis, usually along with a complete blood count."
  },
  {
    "q": "Is anything I enter saved?",
    "a": "No. Your answers stay in this browser and are gone when you close the page."
  }
];

export default function Page() {
  return (
    <ConditionToolPage
      slug={SLUG}
      intro={"Choose each partner's result from their thalassemia test. You will see what the two results mean together, and what to do next."}
      note={"This explains how thalassemia is passed on. Some variants need a haematologist or genetic counsellor to read. Your answers stay on this phone."}
      faqs={FAQS}
    />
  );
}
