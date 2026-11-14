import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import SubShell from "@/components/tools/SubShell";
import Icon from "@/components/Icon";
import { getAllPosts } from "@/lib/guides";
import { getTool, readsForTool, toolPath } from "@/lib/tools";
import { SITE_URL } from "@/lib/site";
import {
  MONTHS_HUB,
  MONTH_RANGES,
  faqsFor,
  getWeek,
  monthFromSlug,
  monthOrdinal,
  monthOverview,
  monthPath,
  monthSlug,
  monthWord,
  rangeOf,
  scansIn,
  trimesterOfWeek,
  weekImage,
  weeksIn,
  type PregWeek,
} from "@/lib/pregnancy-months";

/* Pregnancy month by month, under the Pregnancy stage:
   /pregnancy/month-by-month/ and /pregnancy/1st-month/ to /pregnancy/9th-month/.
   Every sentence about the baby, the body, food and scans is the app's own (see
   lib/pregnancy-months.ts); this page only arranges it by month. */

export const dynamicParams = false;

const HUB = "month-by-month";
const tool = getTool("pregnancy-weeks-to-months");
const TONE = "#F3D9CB";

/* Only the Pregnancy stage has sub-pages, so both segments are spelled out here
   rather than taken from the parent's list of stages. */
export function generateStaticParams() {
  return [HUB, ...MONTH_RANGES.map((r) => monthSlug(r.month))].map((page) => ({ stage: "pregnancy", page }));
}

type Params = Promise<{ stage: string; page: string }>;

const NOTE =
  "Every pregnancy moves at its own pace. Sizes and changes are typical ones, not targets, and the scans listed are the usual pattern; your doctor may add, move or skip tests for you. If something feels wrong, call your doctor rather than waiting for the next visit.";

function titleFor(m: number) {
  const r = rangeOf(m);
  return `${monthOrdinal(m)} Month of Pregnancy: Weeks ${r.from} to ${r.to}, Baby, Body and Scans`;
}

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { stage, page } = await params;
  if (stage !== "pregnancy") return {};
  if (page === HUB) {
    const title = "Pregnancy Month by Month: All 9 Months, Week by Week";
    const description = "What happens in each month of pregnancy, from the 1st month to the 9th: your baby's growth, the changes in your body, food, scans and what to do, written for Indian families.";
    return { title, description, alternates: { canonical: MONTHS_HUB }, openGraph: { type: "website", url: `${SITE_URL}${MONTHS_HUB}`, title, description } };
  }
  const m = monthFromSlug(page);
  if (!m) return {};
  const title = titleFor(m);
  const description = monthOverview(m)?.a[0] ?? weeksIn(m)[0]?.headline ?? "";
  return {
    title,
    description,
    alternates: { canonical: monthPath(m) },
    openGraph: { type: "article", url: `${SITE_URL}${monthPath(m)}`, title, description, images: [weekImage(rangeOf(m).to)] },
  };
}

export default async function MonthPage({ params }: { params: Params }) {
  const { stage, page } = await params;
  if (stage !== "pregnancy") notFound();
  if (page === HUB) return <Hub />;
  const m = monthFromSlug(page);
  if (!m) notFound();
  return <Month m={m} />;
}

/* ---------- the hub ---------- */

async function Hub() {
  const reads = readsForTool(tool, await getAllPosts(), 4);
  return (
    <SubShell
      tone={TONE}
      crumbs={[
        { name: "Pregnancy", path: "/pregnancy/" },
        { name: "Month by month", path: MONTHS_HUB },
      ]}
      eyebrow="Pregnancy"
      title={
        <>
          Pregnancy, <em>month by month.</em>
        </>
      }
      intro="Nine months, one at a time: what your baby is doing, what your body is doing, and the best you can do for them in each month. Written for an Indian kitchen, an Indian family and an Indian hospital."
      note={NOTE}
      reads={reads}
    >
      <ol className="mm-hub">
        {MONTH_RANGES.map((r) => {
          const last = getWeek(Math.min(40, r.to));
          return (
            <li key={r.month}>
              <Link href={monthPath(r.month)}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={weekImage(r.to)} alt="" width={560} height={560} loading="lazy" />
                <span className="mm-hub__n">{monthOrdinal(r.month)} month</span>
                <span className="mm-hub__w">
                  Weeks {r.from} to {r.to} · {monthOrdinal(trimesterOfWeek(r.from))} trimester
                </span>
                {last && <span className="mm-hub__s">By the end, about the size of {last.size}</span>}
              </Link>
            </li>
          );
        })}
      </ol>
      <p className="safe-page__back">
        <Link className="btn btn--ink" href={toolPath(tool.slug)}>
          Turn your weeks into months
        </Link>
      </p>
    </SubShell>
  );
}

/* ---------- one month ---------- */

const uniq = <T,>(xs: T[]) => [...new Set(xs)];

async function Month({ m }: { m: number }) {
  const r = rangeOf(m);
  const weeks = weeksIn(m);
  const first = weeks[0];
  const last = weeks[weeks.length - 1];
  const overview = monthOverview(m);
  const faqs = faqsFor(m, 10);
  const scans = scansIn(m);
  const tri = trimesterOfWeek(r.from);
  const triEnd = trimesterOfWeek(r.to);
  const foods = uniq(weeks.flatMap((w) => w.foods)).slice(0, 12);
  const superfoods = weeks.filter((w) => w.superfood?.food).filter((w, i, a) => a.findIndex((x) => x.superfood!.food === w.superfood!.food) === i);
  const myths = weeks.filter((w) => w.myth?.myth).slice(0, 2);
  const partner = weeks.find((w) => w.partner)?.partner;
  const redFlags = last.redFlags;

  const posts = await getAllPosts();
  const reads = readsForTool(tool, posts, 4);
  const url = `${SITE_URL}${monthPath(m)}`;

  return (
    <SubShell
      tone={TONE}
      crumbs={[
        { name: "Pregnancy", path: "/pregnancy/" },
        { name: "Month by month", path: MONTHS_HUB },
        { name: `${monthOrdinal(m)} month`, path: monthPath(m) },
      ]}
      eyebrow={`Weeks ${r.from} to ${r.to} · ${tri === triEnd ? `${monthOrdinal(tri)} trimester` : `${monthOrdinal(tri)} and ${monthOrdinal(triEnd)} trimesters`}`}
      title={
        <>
          The {monthWord(m)} month <em>of pregnancy</em>
        </>
      }
      intro={overview?.a[0] ?? first.headline}
      note={NOTE}
      reads={reads}
      schema={
        faqs.length
          ? [
              {
                "@context": "https://schema.org",
                "@type": "FAQPage",
                url,
                mainEntity: faqs.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a.join(" ") } })),
              },
            ]
          : []
      }
    >
      <MonthStepper current={m} />

      <div className="mm-glance">
        <figure className="mm-glance__baby">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={weekImage(last.week)} alt={`Your baby at week ${last.week}`} width={560} height={560} />
        </figure>
        <dl className="mm-glance__facts">
          {first.week === last.week ? (
            <div>
              <dt>Your baby is about the size of</dt>
              <dd>{last.size}</dd>
            </div>
          ) : (
            <div>
              <dt>Your baby grows from</dt>
              <dd>
                {first.size} <span>to</span> {last.size}
              </dd>
            </div>
          )}
          <div>
            <dt>By week {last.week}</dt>
            <dd>
              {last.length}, {last.weight}
            </dd>
          </div>
          {scans.length > 0 && (
            <div>
              <dt>Usually this month</dt>
              <dd>{scans.map((s) => s.title).join(", ")}</dd>
            </div>
          )}
          <div>
            <dt>Milestones</dt>
            <dd>{uniq(weeks.map((w) => w.milestone)).join(" · ")}</dd>
          </div>
        </dl>
      </div>

      {m === 1 && (
        <p className="mm-callout">
          Weeks 1 to 3 are counted from the first day of your last period, before your baby is conceived, so this month's story really starts at week 4, around the time a test turns positive.
        </p>
      )}

      <section className="mm-sec" aria-labelledby="mm-weeks">
        <h2 id="mm-weeks" className="tool-h2">
          Week by week
        </h2>
        <ol className="mm-weeks">
          {weeks.map((w) => (
            <WeekCard key={w.week} w={w} />
          ))}
        </ol>
      </section>

      {scans.length > 0 && (
        <section className="mm-sec" aria-labelledby="mm-scans">
          <h2 id="mm-scans" className="tool-h2">
            Scans and checks this month
          </h2>
          <ul className="mm-scans">
            {scans.map((s) => (
              <li key={s.id}>
                <strong>{s.title}</strong>
                {s.range && <small>{s.range}</small>}
                <p>{s.why}</p>
              </li>
            ))}
          </ul>
        </section>
      )}

      <section className="mm-sec mm-two" aria-labelledby="mm-food">
        <div>
          <h2 id="mm-food" className="tool-h2">
            Eating well this month
          </h2>
          {uniq(weeks.map((w) => w.whyNow)).slice(0, 2).map((t) => (
            <p key={t}>{t}</p>
          ))}
          {foods.length > 0 && (
            <ul className="mm-chips" aria-label="Foods to lean on">
              {foods.map((f) => (
                <li key={f}>{f}</li>
              ))}
            </ul>
          )}
        </div>
        <div className="mm-cards">
          {superfoods.slice(0, 2).map((w) => (
            <div key={w.week} className="mm-card">
              <small>Indian superfood, week {w.week}</small>
              <strong>{w.superfood!.food}</strong>
              <p>{w.superfood!.benefit}</p>
              {w.superfood!.how && <p className="mm-card__how">{w.superfood!.how}</p>}
            </div>
          ))}
        </div>
      </section>

      <section className="mm-sec mm-two" aria-labelledby="mm-do">
        <div>
          <h2 id="mm-do" className="tool-h2">
            Worth doing
          </h2>
          <ul className="mm-list mm-list--do">
            {uniq(weeks.map((w) => w.doThis)).map((t) => (
              <li key={t}>{t}</li>
            ))}
          </ul>
        </div>
        <div>
          <h2 className="tool-h2">Worth skipping</h2>
          <ul className="mm-list mm-list--skip">
            {uniq(weeks.map((w) => w.skip)).map((t) => (
              <li key={t}>{t}</li>
            ))}
          </ul>
        </div>
      </section>

      <section className="mm-sec mm-flags" aria-labelledby="mm-flags">
        <h2 id="mm-flags" className="mm-flags__h">
          <Icon name="doctor" size={18} /> When to call your doctor
        </h2>
        <p>{redFlags}</p>
      </section>

      {myths.length > 0 && (
        <section className="mm-sec" aria-labelledby="mm-myths">
          <h2 id="mm-myths" className="tool-h2">
            Myth or truth
          </h2>
          <div className="mm-myths">
            {myths.map((w) => (
              <div key={w.week} className="mm-myth">
                <p className="mm-myth__m">
                  <span>Myth</span> {w.myth!.myth}
                </p>
                <p className="mm-myth__t">
                  <span>Truth</span> {w.myth!.truth}
                </p>
              </div>
            ))}
          </div>
        </section>
      )}

      {partner && (
        <section className="mm-sec mm-partner" aria-labelledby="mm-partner">
          <h2 id="mm-partner" className="tool-h2">
            For your partner
          </h2>
          <p>{partner}</p>
        </section>
      )}

      {faqs.length > 0 && (
        <section className="mm-sec tool-faq" aria-labelledby="mm-faq">
          <h2 id="mm-faq" className="tool-h2">
            Questions in the {monthWord(m)} month
          </h2>
          <div>
            {faqs.map((f) => (
              <details key={f.id} className="faq__item">
                <summary>
                  <span>{f.q}</span>
                  <Icon name="plus" size={18} />
                </summary>
                {f.a.map((p) => (
                  <p key={p}>{p}</p>
                ))}
              </details>
            ))}
          </div>
        </section>
      )}

      <nav className="mm-pager" aria-label="Other months">
        {m > 1 ? (
          <Link href={monthPath(m - 1)}>
            <small>Previous</small>
            {monthOrdinal(m - 1)} month
          </Link>
        ) : (
          <span />
        )}
        {m < 9 ? (
          <Link href={monthPath(m + 1)} className="mm-pager__next">
            <small>Next</small>
            {monthOrdinal(m + 1)} month
          </Link>
        ) : (
          <span />
        )}
      </nav>
      <p className="safe-page__back">
        <Link className="btn btn--ghost" href={toolPath(tool.slug)}>
          Turn your weeks into months
        </Link>
      </p>
    </SubShell>
  );
}

function MonthStepper({ current }: { current: number }) {
  return (
    <nav className="mm-steps" aria-label="Months of pregnancy">
      {MONTH_RANGES.map((r) =>
        r.month === current ? (
          <span key={r.month} className="mm-steps__on" aria-current="page">
            {monthOrdinal(r.month)}
          </span>
        ) : (
          <Link key={r.month} href={monthPath(r.month)}>
            {monthOrdinal(r.month)}
          </Link>
        )
      )}
    </nav>
  );
}

function WeekCard({ w }: { w: PregWeek }) {
  return (
    <li className="mm-week" id={`week-${w.week}`}>
      <div className="mm-week__head">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={weekImage(w.week)} alt="" width={560} height={560} loading="lazy" />
        <div>
          <small>Week {w.week}</small>
          <h3>{w.milestone}</h3>
          <p className="mm-week__size">
            About the size of {w.size} · {w.length}, {w.weight}
          </p>
        </div>
      </div>
      <p className="mm-week__lead">{w.headline}</p>
      <div className="mm-week__cols">
        <div>
          <h4>Your baby</h4>
          <p>{w.baby}</p>
        </div>
        <div>
          <h4>Your body</h4>
          <p>{w.body}</p>
          {w.symptoms.length > 0 && (
            <ul className="mm-chips mm-chips--sm" aria-label="Common this week">
              {w.symptoms.map((s) => (
                <li key={s}>{s}</li>
              ))}
            </ul>
          )}
        </div>
      </div>
      <p className="mm-week__care">
        <strong>For you:</strong> {w.selfCare}
      </p>
    </li>
  );
}
