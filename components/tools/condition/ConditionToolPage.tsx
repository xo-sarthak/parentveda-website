import type { Metadata } from "next";
import ToolShell from "@/components/tools/ToolShell";
import { EMBEDS } from "@/components/tools/embeds";
import { getTool, toolPath } from "@/lib/tools";
import { consultView, getConsult } from "@/lib/consults";
import { SITE_URL } from "@/lib/site";

/* The page for one condition tool. While its reference values wait for review
   (lib/tools-reference/<slug>.json, "reviewed": false), production shows a
   "coming soon" note in place of the tool and keeps the page out of search.
   Preview and dev show the working tool. */

/** The specialist each tool hands over to, a key in content/consults.json. */
export const TOOL_CONSULT: Record<string, string> = {
  "fertility-specialist-check": "fertility-specialist",
  "semen-report-reader": "male-fertility",
  "amh-reader": "fertility-specialist",
  "thalassemia-couple-check": "genetic-counselling",
  "screening-result-explainer": "fetal-medicine",
  "afi-reader": "fetal-medicine",
  "bp-log": "gynaecologist",
  "pregnancy-sugar-targets": "gynaecologist",
};

export function toolConsult(slug: string) {
  const c = getConsult(TOOL_CONSULT[slug]);
  return c ? consultView(c) : undefined;
}

export function conditionToolMetadata(slug: string, title: string, description: string): Metadata {
  const tool = getTool(slug);
  return {
    title,
    description,
    alternates: { canonical: toolPath(slug) },
    ...(tool.available === false ? { robots: { index: false, follow: false } } : {}),
    openGraph: { type: "website", url: `${SITE_URL}${toolPath(slug)}`, title, description },
    twitter: { card: "summary", title, description },
  };
}

export default function ConditionToolPage({ slug, intro, note, faqs }: { slug: string; intro: string; note: string; faqs: { q: string; a: string }[] }) {
  const tool = getTool(slug);
  const Tool = EMBEDS[slug];
  return (
    <ToolShell tool={tool} intro={intro} note={note} faqs={faqs}>
      {tool.available === false ? (
        <div className="tool-panel ctool__soon" role="status">
          <p>
            <b>Coming soon, being reviewed by our doctors.</b>
          </p>
          <p>This tool works with medical numbers, so a specialist checks every one before it goes live.</p>
        </div>
      ) : (
        <Tool consult={toolConsult(slug)} />
      )}
    </ToolShell>
  );
}
