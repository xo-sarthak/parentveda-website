import type { Metadata } from "next";
import Link from "next/link";
import ToolShell from "@/components/tools/ToolShell";
import WeeksToMonths from "@/components/tools/WeeksToMonths";
import { getTool, toolPath } from "@/lib/tools";
import { SITE_URL } from "@/lib/site";
import { MONTH_RANGES, MONTHS_HUB, getWeek, monthOrdinal, monthPath, trimesterOfWeek } from "@/lib/pregnancy-months";

// Re-reads the article list every minute, so a newly published read appears under "Read next".
export const revalidate = 60;

const tool = getTool("pregnancy-weeks-to-months");
const TITLE = "Pregnancy Weeks to Months Calculator and Chart";
const DESCRIPTION =
  "How many months pregnant is 22 weeks? Turn pregnancy weeks into months and trimesters, with a full weeks to months chart for all 40 weeks of an Indian pregnancy.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: toolPath(tool.slug) },
  openGraph: { type: "website", url: `${SITE_URL}${toolPath(tool.slug)}`, title: TITLE, description: DESCRIPTION },
  twitter: { card: "summary", title: TITLE, description: DESCRIPTION },
};

const FAQS = [
  {
    q: "Why don't 40 weeks make 10 months?",
    a: "A month is a little over four weeks, so 40 weeks is about nine months and one week. Pregnancy is counted in nine months, and the last month runs a little longer.",
  },
  {
    q: "How many months is 22 weeks pregnant?",
    a: "22 weeks is the end of the 5th month, in the second trimester. The 6th month starts at week 23.",
  },
  {
    q: "Which month is 32 weeks?",
    a: "32 weeks is the start of the 8th month, in the third trimester.",
  },
  {
    q: "Why does my doctor count in weeks?",
    a: "Weeks are more exact than months, and scans, tests and your baby's growth are all tracked by week. Months are an easier way to talk about it with family.",
  },
];

export default function Page() {
  const snaps = MONTH_RANGES.flatMap((r) => Array.from({ length: r.to - r.from + 1 }, (_, i) => r.from + i))
    .map((w) => getWeek(w))
    .filter((w): w is NonNullable<typeof w> => Boolean(w))
    .map((w) => ({ week: w.week, milestone: w.milestone, size: w.size }));

  return (
    <ToolShell
      tool={tool}
      intro="Your doctor says 22 weeks, your family asks which month. Enter your weeks, or the first day of your last period, to see your month and trimester."
      note="Months here follow the ParentVeda app, so both always agree. Weeks are counted from the first day of your last period, the way doctors and scan reports count them. Different books split the months a week or so differently; your week number is what your doctor goes by."
      faqs={FAQS}
    >
      <WeeksToMonths ranges={MONTH_RANGES} snaps={snaps} />

      <section className="wm-chart" aria-labelledby="wm-chart-h">
        <h2 id="wm-chart-h" className="tool-h2">
          Pregnancy weeks to months chart
        </h2>
        <div className="wm-table-wrap">
          <table className="wm-table">
            <thead>
              <tr>
                <th scope="col">Month</th>
                <th scope="col">Weeks</th>
                <th scope="col">Trimester</th>
                <th scope="col">Your baby by the end</th>
              </tr>
            </thead>
            <tbody>
              {MONTH_RANGES.map((r) => {
                const end = getWeek(Math.min(40, r.to));
                return (
                  <tr key={r.month}>
                    <th scope="row">
                      <Link href={monthPath(r.month)}>{monthOrdinal(r.month)} month</Link>
                    </th>
                    <td>
                      {r.from} to {r.to}
                    </td>
                    <td>{trimesterOfWeek(r.from) === trimesterOfWeek(r.to) ? monthOrdinal(trimesterOfWeek(r.from)) : `${monthOrdinal(trimesterOfWeek(r.from))} and ${monthOrdinal(trimesterOfWeek(r.to))}`}</td>
                    <td>{end ? `About the size of ${end.size}` : ""}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        <p className="tool-small">
          <Link href={MONTHS_HUB}>Pregnancy month by month</Link>: what happens to your baby and your body in each month.
        </p>
      </section>
    </ToolShell>
  );
}
