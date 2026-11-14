import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import JsonLd from "@/components/JsonLd";
import { conditionPath, isHubLive } from "@/lib/conditions";
import { HUB_STAGES, visibleHubs } from "@/lib/hubs";
import { breadcrumbSchema } from "@/lib/jsonld";
import { getAllPosts } from "@/lib/guides";
import { SITE_URL } from "@/lib/site";

/* /conditions/: every live hub, grouped by stage. With no live hub the page
   does not exist (an empty index helps nobody). Preview and dev list drafts too. */

export const revalidate = 60;

const TITLE = "Conditions";
const DESCRIPTION =
  "Guides for the diagnoses and test results that bring families to us, each with clear reads, a free tool where one helps, and a way to talk to a specialist.";

export async function generateMetadata(): Promise<Metadata> {
  const posts = await getAllPosts();
  const anyLive = visibleHubs(posts).some((c) => isHubLive(c, posts));
  return {
    title: TITLE,
    description: DESCRIPTION,
    alternates: { canonical: "/conditions/" },
    ...(anyLive ? {} : { robots: { index: false, follow: false } }),
    openGraph: { type: "website", url: `${SITE_URL}/conditions/`, title: TITLE, description: DESCRIPTION },
  };
}

export default async function ConditionsIndex() {
  const posts = await getAllPosts();
  const hubs = visibleHubs(posts);
  if (!hubs.length) notFound();

  return (
    <>
      <section className="phero ahero" style={{ ["--tone" as string]: "#E8D9C0" }} aria-labelledby="cond-title">
        <div className="wrap">
          <div className="phero__copy" style={{ maxWidth: 860 }}>
            <h1 id="cond-title" className="display-xl">
              <span className="hl">
                <span>{TITLE}</span>
              </span>
            </h1>
            <p className="lede">{DESCRIPTION}</p>
          </div>
        </div>
      </section>
      <section className="section" style={{ paddingTop: 24 }}>
        <div className="wrap hub__index">
          {HUB_STAGES.map((s) => {
            const list = hubs.filter((c) => c.stage === s.key);
            if (!list.length) return null;
            return (
              <section key={s.key} id={s.anchor} aria-labelledby={`${s.anchor}-h`}>
                <h2 id={`${s.anchor}-h`} className="display-m">
                  {s.label}
                </h2>
                <ul className="hub__list">
                  {list.map((c) => (
                    <li key={c.slug}>
                      <Link href={conditionPath(c.slug)}>
                        <b>{c.name}</b>
                        {c.one_line ? <span>{c.one_line}</span> : null}
                        {isHubLive(c, posts) ? null : <em>Draft</em>}
                      </Link>
                    </li>
                  ))}
                </ul>
              </section>
            );
          })}
        </div>
      </section>
      <JsonLd data={breadcrumbSchema([{ name: TITLE, path: "/conditions/" }])} />
    </>
  );
}
