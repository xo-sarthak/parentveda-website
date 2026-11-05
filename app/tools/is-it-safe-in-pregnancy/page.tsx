import type { Metadata } from "next";
import ToolShell from "@/components/tools/ToolShell";
import SafeChecker from "@/components/tools/SafeChecker";
import { getTool, toolPath } from "@/lib/tools";
import { SITE_URL } from "@/lib/site";

// Re-reads the article list every minute, so a newly published read appears under "Read next".
export const revalidate = 60;

const tool = getTool("is-it-safe-in-pregnancy");
const TITLE = "Is It Safe in Pregnancy? Foods, Drinks, Medicines and Activities";
const DESCRIPTION = "Can I eat papaya in pregnancy? Is chai safe? Look up 200 common Indian foods, drinks, medicines and activities, with the reason and what changes by trimester.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: toolPath(tool.slug) },
  openGraph: { type: "website", url: `${SITE_URL}${toolPath(tool.slug)}`, title: TITLE, description: DESCRIPTION },
  twitter: { card: "summary", title: TITLE, description: DESCRIPTION },
};

const FAQS = [
  {
    "q": "Is papaya safe in pregnancy?",
    "a": "Fully ripe papaya in normal food amounts is generally considered fine. Unripe or semi-ripe papaya is usually avoided because its latex may trigger contractions."
  },
  {
    "q": "How much chai can I have in pregnancy?",
    "a": "Keep total caffeine under about 200 mg a day, roughly two cups of chai or one cup of coffee, counting cola, green tea and chocolate too."
  },
  {
    "q": "Is pineapple safe in pregnancy?",
    "a": "Yes, in normal servings. The belief that it causes miscarriage is not supported by evidence."
  },
  {
    "q": "Does saffron make the baby fair?",
    "a": "No. A few strands in milk are fine, but saffron does not change your baby's skin colour, and large doses are not recommended."
  }
];

export default function Page() {
  return (
    <ToolShell tool={tool} intro={"Papaya, pineapple, chai, Crocin, flying, hair colour. Search what you're wondering about and get a clear answer, the reason behind it, and what changes trimester by trimester."} note={"This is general guidance for a healthy pregnancy. Your own situation may be different, for example with gestational diabetes, a low-lying placenta or a past complication, so if your doctor has told you something else, follow your doctor. For any medicine, the answer here is general: always check the dose and the brand with your doctor or pharmacist."} faqs={FAQS}>
      <SafeChecker />
    </ToolShell>
  );
}
