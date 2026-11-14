import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import SubShell from "@/components/tools/SubShell";
import { getCanIData } from "@/lib/shared-content";
import { getAllPosts } from "@/lib/guides";
import { getTool, readsForTool, toolPath } from "@/lib/tools";
import { SITE_URL } from "@/lib/site";
import { CATEGORY_LABEL, VERDICT_LABEL, safeIdFromSlug, safePath, safeQuestion, safeSlug, type CanI } from "@/lib/safe-in-pregnancy";

/* One answer from the is-it-safe tool on its own page, so "papaya in pregnancy"
   can be found by search. The words are the tool's own (the can_i_entries table
   the app reads too, edited in Directus): this page arranges them and adds
   nothing medical of its own. */

export const revalidate = 60;
export const dynamicParams = true;

const tool = getTool("is-it-safe-in-pregnancy");

export async function generateStaticParams() {
  const { entries } = await getCanIData();
  return entries.map((e) => ({ item: safeSlug(e.id) }));
}

type Params = Promise<{ item: string }>;

async function find(slug: string) {
  const data = await getCanIData();
  const id = safeIdFromSlug(slug);
  const entry = data.entries.find((e) => e.id === id);
  if (!entry || safeSlug(entry.id) !== slug) return null;
  const group = data.groups.find(([, ids]) => ids.includes(id));
  return {
    entry,
    byId: new Map(data.entries.map((e) => [e.id, e])),
    groupOf: group?.[0],
    shelf: group?.[1],
  };
}

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const found = await find((await params).item);
  if (!found) return {};
  const { entry } = found;
  const title = `${safeQuestion(entry)} ${VERDICT_LABEL[entry.verdict]}`;
  const canonical = safePath(entry.id);
  return {
    title,
    description: entry.short,
    alternates: { canonical },
    openGraph: { type: "article", url: `${SITE_URL}${canonical}`, title, description: entry.short },
    twitter: { card: "summary", title, description: entry.short },
  };
}

export default async function SafeAnswerPage({ params }: { params: Params }) {
  const found = await find((await params).item);
  if (!found) notFound();
  const { entry: e, byId, groupOf } = found;

  const tri = [e.t1 && ["First trimester", "Weeks 1 to 13", e.t1], e.t2 && ["Second trimester", "Weeks 14 to 27", e.t2], e.t3 && ["Third trimester", "Week 28 to birth", e.t3]].filter(Boolean) as [string, string, string][];
  const related = (e.related ?? []).map((id) => byId.get(id)).filter((r): r is CanI => Boolean(r));
  /* Neighbours from the same shelf, so every page links on even when it has few related answers. */
  const sameShelf = (found.shelf ?? [])
    .filter((id) => id !== e.id && !related.some((r) => r.id === id))
    .map((id) => byId.get(id))
    .filter((r): r is CanI => Boolean(r));

  const nameWords = e.name.toLowerCase().replace(/\(.*?\)/g, "").trim();
  const allPosts = await getAllPosts();
  const onTopic = allPosts.filter((p) => `${p.slug.replace(/-/g, " ")} ${p.title}`.toLowerCase().includes(nameWords));
  const reads = [...onTopic, ...readsForTool(tool, allPosts).filter((p) => !onTopic.includes(p))].slice(0, 4);

  const question = safeQuestion(e);
  const url = `${SITE_URL}${safePath(e.id)}`;

  return (
    <SubShell
      tone={tool.tone}
      crumbs={[
        { name: "Free tools", path: "/tools/" },
        { name: tool.name, path: toolPath(tool.slug) },
        { name: e.name, path: safePath(e.id) },
      ]}
      eyebrow={groupOf ? `${CATEGORY_LABEL[e.cat]} · ${groupOf}` : CATEGORY_LABEL[e.cat]}
      title={question}
      note="This is general guidance for a healthy pregnancy. Your own situation may be different, for example with gestational diabetes, a low-lying placenta or a past complication, so if your doctor has told you something else, follow your doctor. For any medicine, the answer here is general: always check the dose and the brand with your doctor or pharmacist."
      reads={reads}
      schema={[
        {
          "@context": "https://schema.org",
          "@type": "FAQPage",
          url,
          mainEntity: [{ "@type": "Question", name: question, acceptedAnswer: { "@type": "Answer", text: `${e.short} ${e.why}` } }],
        },
      ]}
    >
      <div className="safe-page">
        <div className={`safe-answer safe-answer--${e.verdict}`}>
          <span className={`safe-badge safe-badge--${e.verdict} safe-badge--lg`}>{VERDICT_LABEL[e.verdict]}</span>
          <p className="safe-answer__short">{e.short}</p>
        </div>

        <div className="safe-page__body">
          <section aria-labelledby="s-why">
            <h2 id="s-why" className="safe-page__h">
              Why
            </h2>
            <p>{e.why}</p>
          </section>

          {tri.length > 0 && (
            <section aria-labelledby="s-tri">
              <h2 id="s-tri" className="safe-page__h">
                Trimester by trimester
              </h2>
              <ol className="safe-tri-cards">
                {tri.map(([label, weeks, text]) => (
                  <li key={label}>
                    <strong>{label}</strong>
                    <small>{weeks}</small>
                    <p>{text}</p>
                  </li>
                ))}
              </ol>
            </section>
          )}

          {e.indian && (
            <section aria-labelledby="s-in">
              <h2 id="s-in" className="safe-page__h">
                In Indian homes
              </h2>
              <p>{e.indian}</p>
            </section>
          )}
        </div>

        {(related.length > 0 || sameShelf.length > 0) && (
          <section className="safe-page__more" aria-labelledby="s-more">
            <h2 id="s-more" className="tool-h2">
              {related.length > 0 ? "People also ask about" : `More from ${groupOf}`}
            </h2>
            <ul className="safe-links">
              {[...related, ...sameShelf].slice(0, 10).map((r) => (
                <li key={r.id}>
                  <Link href={safePath(r.id)}>
                    <span>{r.name}</span>
                    <span className={`safe-badge safe-badge--${r.verdict}`}>{VERDICT_LABEL[r.verdict]}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        )}

        <p className="safe-page__back">
          <Link className="btn btn--ink" href={toolPath(tool.slug)}>
            Look up any of 200 foods, medicines and activities
          </Link>
        </p>
      </div>
    </SubShell>
  );
}
