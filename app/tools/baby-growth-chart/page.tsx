import type { Metadata } from "next";
import ToolShell from "@/components/tools/ToolShell";
import GrowthChart from "@/components/tools/GrowthChart";
import { getTool, toolPath } from "@/lib/tools";
import { SITE_URL } from "@/lib/site";

// Re-reads the article list every minute, so a newly published read appears under "Read next".
export const revalidate = 60;

const tool = getTool("baby-growth-chart");
const TITLE = "Baby Growth Chart India: Weight, Height and Head Percentile (0 to 5 Years)";
const DESCRIPTION = "Free baby growth chart using the WHO standards the IAP recommends. Enter your child's weight, length or head size to see their percentile and plot it on the chart.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: toolPath(tool.slug) },
  openGraph: { type: "website", url: `${SITE_URL}${toolPath(tool.slug)}`, title: TITLE, description: DESCRIPTION },
  twitter: { card: "summary", title: TITLE, description: DESCRIPTION },
};

const FAQS = [
  {
    "q": "What does percentile mean on a growth chart?",
    "a": "If a child is on the 30th percentile for weight, 30 out of 100 healthy children of the same age and sex weigh less, and 70 weigh more. The 50th is the middle, not a target."
  },
  {
    "q": "Which growth chart do Indian paediatricians use?",
    "a": "For children under five, the IAP recommends the WHO Child Growth Standards. From 5 to 18 years, it recommends the IAP's own charts for Indian children."
  },
  {
    "q": "My baby is on the 10th percentile. Is that a problem?",
    "a": "Not on its own. Many healthy babies sit on lower lines. What matters is that your baby keeps following roughly the same line over time. A drop across two lines is worth discussing with your doctor."
  },
  {
    "q": "Why did my baby lose weight after birth?",
    "a": "Most newborns lose up to about 7 to 10% of their birth weight in the first days and regain it by about two weeks."
  }
];

export default function Page() {
  return (
    <ToolShell tool={tool} intro={"Enter your child's age and any measurement from their last check-up. You'll see where it falls on the WHO growth chart that the Indian Academy of Pediatrics recommends for children under five."} note={"This uses the WHO Child Growth Standards (2006) for children from birth to 5 years, the charts the IAP recommends. One measurement on its own says very little: home scales and tape measures vary, and what matters is the pattern across visits. Your paediatrician reads growth together with feeding, health and development."} faqs={FAQS}>
      <GrowthChart />
    </ToolShell>
  );
}
