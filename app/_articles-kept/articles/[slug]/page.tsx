import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import Icon from "@/components/Icon";
import ReadProgress from "@/components/ReadProgress";
import CtaBand from "@/components/CtaBand";
import { getArticles, getArticle, relatedTo, formatDate } from "@/lib/articles";
import { getStage } from "@/lib/stages";
import { site } from "@/lib/site";

export const dynamicParams = false;

export function generateStaticParams() {
  return getArticles().map((a) => ({ slug: a.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const a = getArticle((await params).slug);
  if (!a) return {};
  return {
    title: a.title,
    description: a.description,
    openGraph: { type: "article", title: a.title, description: a.description, publishedTime: a.date },
  };
}

export default async function ArticlePage({ params }: { params: Promise<{ slug: string }> }) {
  const a = getArticle((await params).slug);
  if (!a) notFound();
  const s = getStage(a.stage);
  const more = relatedTo(a);
  const ld = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: a.title,
    description: a.description,
    datePublished: a.date,
    author: { "@type": "Organization", name: a.author },
    publisher: { "@type": "Organization", name: "ParentVeda", logo: { "@type": "ImageObject", url: `${site.domain}/brand/pv-mark.png` } },
    mainEntityOfPage: `${site.domain}/articles/${a.slug}`,
  };

  return (
    <div style={{ ["--tone" as string]: s?.colour ?? "#E8C4CE", ["--deep-tone" as string]: s?.deep ?? "#7A3348" }}>
      <ReadProgress target="article-body" />
      <article>
        <header className="rhead">
          <div className="wrap rhead__inner">
            <nav className="rhead__crumbs" aria-label="Breadcrumb">
              <Link href="/articles">Articles</Link>
              <span aria-hidden="true">/</span>
              {s && <Link href={`/${s.slug}`}>{s.name}</Link>}
            </nav>
            <span className="phero__range">{a.category}</span>
            <h1 className="display-l rhead__title">{a.title}</h1>
            <p className="rhead__desc">{a.description}</p>
            <p className="rhead__meta">
              <span>{a.author}</span>
              <span aria-hidden="true">·</span>
              <time dateTime={a.date}>{formatDate(a.date)}</time>
              <span aria-hidden="true">·</span>
              <span>{a.minutes} min read</span>
            </p>
          </div>
        </header>

        <div className="wrap rgrid">
          <aside className="rtoc" aria-label="In this article">
            {a.toc.length > 1 && (
              <>
                <p className="rtoc__h">In this article</p>
                <ol>
                  {a.toc.map((t) => (
                    <li key={t.id}>
                      <a href={`#${t.id}`}>{t.text}</a>
                    </li>
                  ))}
                </ol>
              </>
            )}
          </aside>

          <div className="rbody" id="article-body">
            {a.standfirst && <p className="rbody__stand">{a.standfirst}</p>}
            <div className="rbody__prose" dangerouslySetInnerHTML={{ __html: a.html }} />
            <div className="care rbody__care">
              <Icon name="doctor" size={26} />
              <p>
                This article explains; it doesn’t diagnose. If your doctor has told you something different, your doctor is right.
              </p>
            </div>
          </div>
        </div>
      </article>

      {more.length > 0 && (
        <section className="section" style={{ paddingTop: 0 }} aria-labelledby="more-title">
          <div className="wrap">
            <h2 id="more-title" className="display-m" style={{ marginBottom: 24 }}>
              Read next
            </h2>
            <ul className="rmore">
              {more.map((m) => (
                <li key={m.slug}>
                  <Link href={`/articles/${m.slug}`}>
                    <span className="rmore__cat">{m.category}</span>
                    <span className="rmore__t">{m.title}</span>
                    <span className="rmore__m">
                      {m.minutes} min read <Icon name="arrow" size={16} />
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}
      <CtaBand title="There’s a page like this for every week." body="Inside the app, reads like this one arrive when they’re relevant: the scan guide the week before your scan, not six months early." />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(ld) }} />
    </div>
  );
}
