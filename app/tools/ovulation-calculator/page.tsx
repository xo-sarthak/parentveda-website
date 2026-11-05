import type { Metadata } from "next";
import ToolShell from "@/components/tools/ToolShell";
import OvulationCalc from "@/components/tools/OvulationCalc";
import { getTool, toolPath } from "@/lib/tools";
import { SITE_URL } from "@/lib/site";

// Re-reads the article list every minute, so a newly published read appears under "Read next".
export const revalidate = 60;

const tool = getTool("ovulation-calculator");
const TITLE = 'Ovulation Calculator: Find Your Fertile Days (Free)';
const DESCRIPTION = 'Free ovulation calculator for Indian couples. Enter your last period and cycle length to see your fertile window and likely ovulation day for the next three cycles.';

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: toolPath(tool.slug) },
  openGraph: { type: "website", url: `${SITE_URL}${toolPath(tool.slug)}`, title: TITLE, description: DESCRIPTION },
  twitter: { card: "summary", title: TITLE, description: DESCRIPTION },
};

const FAQS = [
  {
    "q": "How is the fertile window worked out?",
    "a": "Ovulation usually happens about 14 days before your next period. Sperm can live up to five days, so the five days before ovulation and the day itself are when you are most likely to conceive."
  },
  {
    "q": "My cycles are irregular. Will this work?",
    "a": "Less well. With irregular cycles, use your shortest recent cycle for the earliest fertile day, and watch your body's signs too. If periods are often more than 35 days apart, it is worth seeing a doctor, as PCOS is a common cause."
  },
  {
    "q": "When should I take a pregnancy test?",
    "a": "From the day your period is due. Testing earlier often gives a false negative because the hormone the test detects is still building up."
  },
  {
    "q": "Can I use this to avoid pregnancy?",
    "a": "No. Calendar estimates are not reliable enough to use as contraception."
  }
];

export default function Page() {
  return (
    <ToolShell tool={tool} intro={"Enter the first day of your last period and your usual cycle length. You'll see the days you are most likely to conceive, for this cycle and the next two."} note={"This is an estimate based on an average pattern. Ovulation can shift with stress, illness, travel and conditions like PCOS, so use it as a guide alongside your body's own signs, such as clear, stretchy cervical mucus. It does not work as birth control. If you have been trying for a year (or six months if you are 35 or older), talk to a doctor, and both partners should be checked."} faqs={FAQS}>
      <OvulationCalc />
    </ToolShell>
  );
}
