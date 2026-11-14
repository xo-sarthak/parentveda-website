import type { Metadata } from "next";
import ConditionToolPage, { conditionToolMetadata } from "@/components/tools/condition/ConditionToolPage";

// Re-reads the article list every minute, so a newly published read appears under "Read next".
export const revalidate = 60;

const SLUG = "fertility-specialist-check";

export const metadata: Metadata = conditionToolMetadata(SLUG, "Is It Time to See a Fertility Specialist? A 2-Minute Check", "Answer five questions about age, months of trying, cycles and known conditions, and see when a fertility specialist visit makes sense, with what to bring.");

const FAQS = [
  {
    "q": "Why does age change the advice?",
    "a": "Egg numbers fall with age, and faster after 35, so doctors suggest a check sooner as age goes up."
  },
  {
    "q": "Should my partner be tested too?",
    "a": "Yes. A semen analysis is a simple test, and it is part of the first check for every couple."
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
      intro={"Five questions about her age, how long you have been trying, her cycles, anything already known, and your partner's semen test. You will see when a specialist visit makes sense and what to take with you."}
      note={"This follows the timelines most fertility doctors use. It cannot see your full history, so if you are worried, a conversation with a specialist is never too early. Your answers stay on this phone."}
      faqs={FAQS}
    />
  );
}
