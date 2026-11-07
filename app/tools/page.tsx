import type { Metadata } from "next";
import JsonLd from "@/components/JsonLd";
import ToolCard from "@/components/tools/ToolCard";
import { breadcrumbSchema } from "@/lib/jsonld";
import { SITE_URL } from "@/lib/site";
import { TOOLS, TOOLS_BASE } from "@/lib/tools";

const TITLE = "Free pregnancy and parenting tools";
const DESCRIPTION =
  "Free, simple tools for Indian families: ovulation and due date calculators, a pregnancy week calculator, an is-it-safe checker, a weight gain calculator, the IAP vaccine schedule, a WHO growth chart and a baby name finder.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: `${TOOLS_BASE}/` },
  openGraph: { type: "website", url: `${SITE_URL}${TOOLS_BASE}/`, title: TITLE, description: DESCRIPTION },
  twitter: { card: "summary", title: TITLE, description: DESCRIPTION },
};

export default function ToolsPage() {
  return (
    <>
      <JsonLd data={breadcrumbSchema([{ name: "Free tools", path: `${TOOLS_BASE}/` }])} />
      <section className="phero tool-hero" style={{ ["--tone" as string]: "#D8CCE8" }} aria-labelledby="tools-title">
        <div className="wrap">
          <span className="phero__range">Free tools</span>
          <h1 id="tools-title" className="tool-title">
            Quick answers, <em>worked out for you.</em>
          </h1>
          <p className="tool-intro">
            The questions you keep looking up: your fertile days, your due date, whether papaya is safe, how your baby is growing, and when the next vaccine is due. Free,
            no sign-up, and nothing you enter leaves your phone.
          </p>
        </div>
      </section>

      <section className="tool-block tool-block--main">
        <div className="wrap">
          <ul className="tool-grid">
            {TOOLS.map((t) => (
              <li key={t.slug} style={{ ["--tone" as string]: t.tone }}>
                <ToolCard tool={t} />
              </li>
            ))}
          </ul>
          <p className="tool-note">
            Every tool gives an estimate to help you prepare. Your doctor and your scans decide. ParentVeda never diagnoses.
          </p>
        </div>
      </section>
    </>
  );
}
