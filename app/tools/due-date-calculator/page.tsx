import type { Metadata } from "next";
import ToolShell from "@/components/tools/ToolShell";
import DueDateCalc from "@/components/tools/DueDateCalc";
import { getTool, toolPath } from "@/lib/tools";
import { SITE_URL } from "@/lib/site";

export const revalidate = 3600;

const tool = getTool("due-date-calculator");
const TITLE = 'Due Date Calculator: When Is My Baby Due? (Free)';
const DESCRIPTION = 'Free pregnancy due date calculator. Use your last period or conception date to find your estimated due date, how many weeks pregnant you are, and your full term window.';

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: toolPath(tool.slug) },
  openGraph: { type: "website", url: `${SITE_URL}${toolPath(tool.slug)}`, title: TITLE, description: DESCRIPTION },
  twitter: { card: "summary", title: TITLE, description: DESCRIPTION },
};

const FAQS = [
  {
    "q": "How is the due date calculated?",
    "a": "Doctors count 280 days (40 weeks) from the first day of your last period, adjusted if your cycle is longer or shorter than 28 days. From a known conception date, it is 266 days."
  },
  {
    "q": "Why did my scan give a different date?",
    "a": "An early scan measures your baby directly, so it is usually more accurate than a period date. If the two differ by more than about a week, doctors generally go by the scan."
  },
  {
    "q": "Is 40 weeks really 9 months?",
    "a": "Pregnancy is counted from your last period, about two weeks before conception, so 40 weeks is roughly nine calendar months plus a week."
  },
  {
    "q": "What does full term mean?",
    "a": "Babies born between 37 and 42 weeks are considered term. Most arrive between 38 and 41 weeks."
  }
];

export default function Page() {
  return (
    <ToolShell tool={tool} intro={"Use the first day of your last period, or the day you conceived if you know it. You'll get your estimated due date, how far along you are today, and the window when babies usually arrive."} note={"This follows the standard method doctors use (Naegele's rule). Your dating scan is more accurate, especially if your cycles are irregular, so if the scan gives a different date, go by the scan. Only about 1 in 20 babies arrive on the exact due date."} faqs={FAQS}>
      <DueDateCalc />
    </ToolShell>
  );
}
