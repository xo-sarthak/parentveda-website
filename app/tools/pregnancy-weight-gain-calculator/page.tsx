import type { Metadata } from "next";
import ToolShell from "@/components/tools/ToolShell";
import WeightGainCalc from "@/components/tools/WeightGainCalc";
import { getTool, toolPath } from "@/lib/tools";
import { SITE_URL } from "@/lib/site";

// Re-reads the article list every minute, so a newly published read appears under "Read next".
export const revalidate = 60;

const tool = getTool("pregnancy-weight-gain-calculator");
const TITLE = "Pregnancy Weight Gain Calculator (Indian BMI Ranges)";
const DESCRIPTION = "How much weight should you gain in pregnancy? Enter your height and pre-pregnancy weight to see the healthy total range, using the BMI cut-offs recommended for Indians.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: toolPath(tool.slug) },
  openGraph: { type: "website", url: `${SITE_URL}${toolPath(tool.slug)}`, title: TITLE, description: DESCRIPTION },
  twitter: { card: "summary", title: TITLE, description: DESCRIPTION },
};

const FAQS = [
  {
    "q": "How much weight should I gain in pregnancy?",
    "a": "For one baby, most women in the healthy weight range gain about 11.5 to 16 kg in total. Women starting below the healthy range usually need a little more, and those above it a little less."
  },
  {
    "q": "Why are the BMI groups different for Indians?",
    "a": "Indian guidelines use lower cut-offs (23 and 25 instead of 25 and 30) because health risks rise at lower BMI in South Asian adults."
  },
  {
    "q": "Do I need to eat for two?",
    "a": "No. In the first trimester most women need no extra food at all. Later the need rises a little, not double. The quality of food matters more than the amount."
  },
  {
    "q": "Is it a problem if I lose weight in the first trimester?",
    "a": "A small loss with nausea is common and usually not a worry. If you can't keep food or fluids down, see your doctor."
  }
];

export default function Page() {
  return (
    <ToolShell tool={tool} intro={"Enter your height and your weight before pregnancy. You'll see the range of total weight gain that is usually healthy for you, for one baby or twins."} note={"Ranges follow the Institute of Medicine (2009) guidance, with the lower BMI cut-offs recommended for South Asian adults. They are a guide, not a target to hit each week. Your doctor will track your gain at check-ups and may set a different range for you. If weighing yourself makes you anxious, you don't need to do it at home."} faqs={FAQS}>
      <WeightGainCalc />
    </ToolShell>
  );
}
