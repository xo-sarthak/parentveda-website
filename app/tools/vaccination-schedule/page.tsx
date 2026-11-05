import type { Metadata } from "next";
import ToolShell from "@/components/tools/ToolShell";
import VaccineSchedule from "@/components/tools/VaccineSchedule";
import { getTool, toolPath } from "@/lib/tools";
import { SITE_URL } from "@/lib/site";

export const revalidate = 3600;

const tool = getTool("vaccination-schedule");
const TITLE = 'Baby Vaccination Schedule India (IAP): Dates by Birth Date';
const DESCRIPTION = "Free baby vaccination schedule for India. Enter your baby's date of birth to get every IAP-recommended vaccine with its due date, and print it as a chart.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: toolPath(tool.slug) },
  openGraph: { type: "website", url: `${SITE_URL}${toolPath(tool.slug)}`, title: TITLE, description: DESCRIPTION },
  twitter: { card: "summary", title: TITLE, description: DESCRIPTION },
};

const FAQS = [
  {
    "q": "What is the difference between the IAP and government schedules?",
    "a": "The government's Universal Immunization Programme gives the core vaccines free at government centres. The IAP schedule adds more vaccines, such as Hepatitis A, varicella, typhoid, influenza and HPV, which are usually given at private clinics."
  },
  {
    "q": "What if we missed a dose?",
    "a": "Missed doses are usually given at the next visit. The series is rarely restarted. Ask your paediatrician how to catch up."
  },
  {
    "q": "Is fever after a vaccine normal?",
    "a": "A mild fever and soreness for a day or two are common. Call your doctor for a high fever, a fever lasting more than two days, unusual crying for hours, or any breathing trouble."
  },
  {
    "q": "Is the flu vaccine needed every year?",
    "a": "Yes. After the first two doses at 6 and 7 months, the IAP recommends one dose every year, ideally before the flu season."
  }
];

export default function Page() {
  return (
    <ToolShell tool={tool} intro={"Enter your baby's date of birth. You'll get each vaccine the Indian Academy of Pediatrics recommends, with the date it falls due, which you can print and take to every visit."} note={"This follows the IAP (ACVIP) schedule for healthy children, simplified to the usual visits. Government centres follow the Universal Immunization Programme, which covers fewer vaccines at different times. Your paediatrician may choose different brands or combinations, so always follow the dates they give you."} faqs={FAQS}>
      <VaccineSchedule />
    </ToolShell>
  );
}
