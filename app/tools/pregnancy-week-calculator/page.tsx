import type { Metadata } from "next";
import ToolShell from "@/components/tools/ToolShell";
import PregnancyWeekCalc from "@/components/tools/PregnancyWeekCalc";
import { getTool, toolPath } from "@/lib/tools";
import { SITE_URL } from "@/lib/site";

export const revalidate = 3600;

const tool = getTool("pregnancy-week-calculator");
const TITLE = 'How Many Weeks Pregnant Am I? Pregnancy Week Calculator';
const DESCRIPTION = 'Free pregnancy week calculator. Find out how many weeks pregnant you are today, your trimester, due date, and which scans and tests are usually done around now.';

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: toolPath(tool.slug) },
  openGraph: { type: "website", url: `${SITE_URL}${toolPath(tool.slug)}`, title: TITLE, description: DESCRIPTION },
  twitter: { card: "summary", title: TITLE, description: DESCRIPTION },
};

const FAQS = [
  {
    "q": "Why does week counting start before I was pregnant?",
    "a": "Doctors count from the first day of your last period because it is a date most people know. Conception usually happens about two weeks later, so at '4 weeks' the embryo is about two weeks old."
  },
  {
    "q": "What is the difference between '12 weeks' and 'week 12'?",
    "a": "'12 weeks' means 12 full weeks are done. You are then in week 13. Scan reports usually write it as 12w + days."
  },
  {
    "q": "When do the trimesters start?",
    "a": "The first trimester runs to the end of week 13, the second from week 14 to week 27, and the third from week 28 until birth."
  },
  {
    "q": "Which scans happen in an Indian pregnancy?",
    "a": "Usually an early dating scan, the NT scan at about 11 to 14 weeks, the anomaly scan at about 18 to 22 weeks, and growth scans later as your doctor advises."
  }
];

export default function Page() {
  return (
    <ToolShell tool={tool} intro={"Enter the first day of your last period or your due date. You'll see your week and trimester today, and what is usually checked around this point in an Indian pregnancy."} note={"Weeks are counted from the first day of your last period, the way your doctor and scan reports count them. The checks listed are the usual pattern; your doctor may add, move or skip tests for you."} faqs={FAQS}>
      <PregnancyWeekCalc />
    </ToolShell>
  );
}
