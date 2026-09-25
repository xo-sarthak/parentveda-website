import type { Metadata } from "next";
import ArticleList from "@/components/ArticleList";
import { getArticles } from "@/lib/articles";
import { stages, getStage } from "@/lib/stages";

export const metadata: Metadata = {
  title: "Articles",
  description:
    "Plain-language reads for Indian families — scans, tests, food, feelings and the things nobody explains — from trying to conceive to the school years.",
};

export default function ArticlesPage() {
  const items = getArticles().map((a) => {
    const s = getStage(a.stage);
    return {
      slug: a.slug,
      title: a.title,
      description: a.description,
      category: a.category,
      stage: a.stage,
      stageName: s?.name ?? "",
      tone: s?.colour ?? "#E8C4CE",
      deep: s?.deep ?? "#7A3348",
      minutes: a.minutes,
    };
  });

  return (
    <>
      <section className="phero ahero" style={{ ["--tone" as string]: "#F7ECD4" }} aria-labelledby="a-title">
        <div className="wrap">
          <div className="phero__copy" style={{ maxWidth: 860 }}>
            <span className="phero__range" style={{ color: "#7A4600" }}>
              Articles
            </span>
            <h1 id="a-title" className="display-xl">
              <span className="hl"><span>The things nobody</span></span>
              <span className="hl"><span><em>stops to explain.</em></span></span>
            </h1>
            <p className="lede rv rv-d2">
              Plain-language reads written for Indian families: what a scan report means, what things cost here, what to say to the
              person who keeps giving advice. Every one ends by pointing you back to your own doctor.
            </p>
          </div>
        </div>
      </section>
      <section className="section" style={{ paddingTop: 16 }} aria-label="All articles">
        <div className="wrap">
          <ArticleList items={items} filters={stages.map((s) => ({ slug: s.slug, name: s.short }))} />
        </div>
      </section>
    </>
  );
}
