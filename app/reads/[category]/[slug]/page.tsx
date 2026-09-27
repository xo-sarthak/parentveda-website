import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import Icon from "@/components/Icon";
import ReadProgress from "@/components/ReadProgress";
import CtaBand from "@/components/CtaBand";
import PostBody from "@/components/reads/PostBody";
import PostCard, { stageLook } from "@/components/reads/PostCard";
import ReadRail from "@/components/reads/ReadRail";
import { tocItems } from "@/components/reads/toc";
import { headingSlug } from "@/lib/headings";
import { authorPath, authorInitials, resolveAuthor } from "@/lib/authors";
import {
  GUIDES_BASE,
  GUIDES_NAME,
  categoryPath,
  getAllPosts,
  getCategory,
  getPost,
  getRelatedPosts,
  isUnlisted,
  postPath,
} from "@/lib/guides";
import { buildFaqSchema, buildJsonLd, extractFaqs, formatDate, splitFaqSection } from "@/lib/reads-article";
import { SITE_URL } from "@/lib/site";

/* Live content: re-render at most once a minute so a Directus publish shows
   without a redeploy (and instantly, once /api/revalidate is wired). A post
   published after the last build still renders on demand; unknown slugs 404. */
export const revalidate = 60;
export const dynamicParams = true;

export async function generateStaticParams() {
  const posts = await getAllPosts();
  return posts.map((p) => ({ category: p.category, slug: p.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ category: string; slug: string }> }): Promise<Metadata> {
  const { category, slug } = await params;
  const post = await getPost(category, slug);
  if (!post) return {};
  const canonical = `${post.canonicalPath ?? postPath(post.category, post.slug)}/`;
  const ogImage = post.ogImage ?? "/parentveda-logo.jpg";
  return {
    title: post.metaTitle ?? post.title,
    description: post.description,
    keywords: post.tags,
    // An unlisted post is a review link, not content we want ranked.
    ...(isUnlisted(post) ? { robots: { index: false, follow: false } } : {}),
    alternates: { canonical },
    openGraph: {
      type: "article",
      url: `${SITE_URL}${canonical}`,
      title: post.metaTitle ?? post.title,
      description: post.description,
      publishedTime: post.date,
      modifiedTime: post.updated ?? post.date,
      authors: [post.author],
      tags: post.tags,
      images: [{ url: ogImage, ...(post.ogImageAlt ? { alt: post.ogImageAlt } : {}) }],
    },
    twitter: { card: "summary_large_image", title: post.metaTitle ?? post.title, description: post.description, images: [ogImage] },
  };
}

export default async function PostPage({ params }: { params: Promise<{ category: string; slug: string }> }) {
  const { category: categorySlug, slug } = await params;
  const post = await getPost(categorySlug, slug);
  if (!post) notFound();
  const category = await getCategory(post.category);
  if (!category) notFound();

  const canonical = `${post.canonicalPath ?? postPath(post.category, post.slug)}/`;
  const related = await getRelatedPosts(post, 3);
  const ogImage = post.ogImage ?? "/parentveda-logo.jpg";
  const ogImageAbs = ogImage.startsWith("http") ? ogImage : `${SITE_URL}${ogImage}`;
  const author = resolveAuthor(post);
  const baseJsonLd = buildJsonLd(post, `${SITE_URL}${canonical}`, ogImageAbs, author);
  // An article with its own FAQ section also gets FAQPage (parenting-faq posts already are one).
  const faqs = post.category === "parenting-faq" ? [] : extractFaqs(post.body);
  const jsonLd = faqs.length >= 2 ? [baseJsonLd, buildFaqSchema(faqs)] : baseJsonLd;

  // The sticky rail replaces an inline [TOC]; dropping the marker lists every H2.
  const full = post.body.replace(/^\[toc\]\s*$/gim, "");
  const items = tocItems(full);
  const { body, title: faqTitle, faqs: faqItems, trailing: afterFaq } = splitFaqSection(full);
  const look = stageLook(post.stage);

  return (
    <div style={{ ["--tone" as string]: look.tone, ["--deep-tone" as string]: look.deep }}>
      <ReadProgress target="article-body" />
      <article>
        <header className="rhead">
          <div className="wrap rhead__inner">
            <nav className="rhead__crumbs" aria-label="Breadcrumb">
              <Link href={`${GUIDES_BASE}/`}>{GUIDES_NAME}</Link>
              <span aria-hidden="true">/</span>
              <Link href={`${categoryPath(category.slug)}/`}>{category.name}</Link>
            </nav>
            <span className="phero__range">{category.singular}</span>
            <h1 className="display-l rhead__title">{post.title}</h1>
            {post.description ? <p className="rhead__desc">{post.description}</p> : null}
            <p className="rhead__meta">
              {author ? (
                <Link href={`${authorPath(author.slug)}/`} className="rhead__reviewer">
                  {author.photo ? (
                    <Image src={author.photo} alt="" width={28} height={28} />
                  ) : (
                    <span className="rhead__initials">{authorInitials(author.name)}</span>
                  )}
                  Medically reviewed by <b>{author.name}</b>
                </Link>
              ) : (
                <span>{post.author}</span>
              )}
              {post.date ? (
                <>
                  <span aria-hidden="true">·</span>
                  <time dateTime={post.date}>{formatDate(post.date)}</time>
                </>
              ) : null}
              {post.readingTime ? (
                <>
                  <span aria-hidden="true">·</span>
                  <span>{post.readingTime}</span>
                </>
              ) : null}
            </p>
          </div>
        </header>

        {post.ogImage ? (
          <div className="wrap rhero">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={post.ogImage} alt={post.ogImageAlt ?? ""} />
          </div>
        ) : null}

        <div className="wrap rgrid">
          <ReadRail items={items} shareUrl={`${SITE_URL}${canonical}`} shareTitle={post.title} target="article-body" />

          <div className="rbody" id="article-body">
            {post.bookMeta ? (
              <p className="rbook">
                <Icon name="book" size={20} /> Summary of <b>{post.bookMeta.title}</b> by {post.bookMeta.author}.
              </p>
            ) : null}

            {post.recipe ? (
              <div className="rrecipe">
                <div className="rrecipe__meta">
                  {post.recipe.totalTime ? <Meta label="Total" value={post.recipe.totalTime} /> : null}
                  {post.recipe.prepTime ? <Meta label="Prep" value={post.recipe.prepTime} /> : null}
                  {post.recipe.cookTime ? <Meta label="Cook" value={post.recipe.cookTime} /> : null}
                  {post.recipe.servings ? <Meta label="Serves" value={post.recipe.servings} /> : null}
                </div>
                <div className="rrecipe__cols">
                  <div>
                    <h2>Ingredients</h2>
                    <ul>
                      {post.recipe.ingredients.map((ing) => (
                        <li key={ing}>{ing}</li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h2>Method</h2>
                    <ol>
                      {post.recipe.steps.map((st, i) => (
                        <li key={i}>{st}</li>
                      ))}
                    </ol>
                  </div>
                </div>
              </div>
            ) : null}

            <PostBody body={body} />

            {faqTitle && faqItems.length ? (
              <section className="rfaq" id={headingSlug(faqTitle)} aria-label={faqTitle}>
                <h2>{faqTitle}</h2>
                {faqItems.map((f) => (
                  <details key={f.q} className="faq__item">
                    <summary>
                      <span>{f.q}</span>
                      <Icon name="plus" size={20} />
                    </summary>
                    <div className="rfaq__a">
                      <PostBody body={f.a} />
                    </div>
                  </details>
                ))}
              </section>
            ) : null}

            {/* Whatever followed the last question (the medical disclaimer),
                always in the open, never inside a collapsed panel. */}
            {afterFaq ? <PostBody body={afterFaq} /> : null}

            {post.source ? (
              <p className="rsource">
                <b>Source: </b>
                {post.source.href ? (
                  <a href={post.source.href} target="_blank" rel="noopener noreferrer">
                    {post.source.label}
                  </a>
                ) : (
                  post.source.label
                )}
              </p>
            ) : null}

            {author ? (
              <Link href={`${authorPath(author.slug)}/`} className="rauthor">
                {author.photo ? (
                  <Image src={author.photo} alt="" width={64} height={64} />
                ) : (
                  <span className="rhead__initials rhead__initials--lg">{authorInitials(author.name)}</span>
                )}
                <span>
                  <small>Medically reviewed by</small>
                  <b>
                    {author.name}
                    {author.credentials ? `, ${author.credentials}` : ""}
                  </b>
                  {author.shortBio}
                </span>
              </Link>
            ) : null}

            <div className="care rbody__care">
              <Icon name="doctor" size={26} />
              <p>This article explains; it doesn’t diagnose. If your doctor has told you something different, your doctor is right.</p>
            </div>
          </div>
        </div>
      </article>

      {related.length > 0 && (
        <section className="section" style={{ paddingTop: 0 }} aria-labelledby="more-title">
          <div className="wrap">
            <h2 id="more-title" className="display-m" style={{ marginBottom: 24 }}>
              Read next
            </h2>
            <ul className="agrid agrid--three">
              {related.map((p) => (
                <li key={p.slug}>
                  <PostCard post={p} />
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}

      <CtaBand
        title="Guidance like this, for every week."
        body="Inside the app, reads like this one arrive when they’re relevant: the scan guide the week before your scan, not six months early."
      />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
    </div>
  );
}

function Meta({ label, value }: { label: string; value: string }) {
  return (
    <span>
      <small>{label}</small>
      <b>{value}</b>
    </span>
  );
}
