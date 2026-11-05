import type { Metadata } from "next";
import Link from "next/link";
import JsonLd from "@/components/JsonLd";
import { breadcrumbSchema } from "@/lib/jsonld";
import { SITE_URL } from "@/lib/site";
import { TOOLS, TOOLS_BASE, toolPath } from "@/lib/tools";

const TITLE = "Free pregnancy and parenting tools";
const DESCRIPTION =
  "Free, simple tools for Indian families: ovulation calculator, due date calculator, pregnancy week calculator and the IAP baby vaccination schedule.";

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
      <section className="phero ahero" style={{ ["--tone" as string]: "#D8CCE8" }} aria-labelledby="tools-title">
        <div className="wrap">
          <div className="phero__copy" style={{ maxWidth: 820 }}>
            <span className="phero__range">Free tools</span>
            <h1 id="tools-title" className="display-xl">
              Quick answers, <em>worked out for you.</em>
            </h1>
            <p className="lede">
              The dates you keep counting on your fingers: your fertile days, your due date, which week you are in, and when the next vaccine is due. Free,
              no sign-up, and nothing you enter leaves your phone.
            </p>
          </div>
        </div>
      </section>

      <section className="section tool-section">
        <div className="wrap tool-wrap">
          <ul className="tool-grid">
            {TOOLS.map((t) => (
              <li key={t.slug} style={{ ["--tone" as string]: t.tone }}>
                <Link href={toolPath(t.slug)}>
                  <span className="tool-grid__stage">{t.stage}</span>
                  <strong>{t.name}</strong>
                  <span>{t.short}</span>
                </Link>
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
