import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import JsonLd from "@/components/JsonLd";
import Faq from "@/components/Faq";
import PostCard from "@/components/reads/PostCard";
import RedFlagCard from "@/components/reads/RedFlagCard";
import SupportCard from "@/components/reads/SupportCard";
import CtaBand from "@/components/CtaBand";
import ConsultBlock from "@/components/leads/ConsultBlock";
import DownloadCard from "@/components/leads/DownloadCard";
import HubView from "@/components/hubs/HubView";
import ToolEmbed from "@/components/hubs/ToolEmbed";
import { CONDITIONS, conditionPath, conditionSiteStage, getCondition, isHubLive } from "@/lib/conditions";
import { HUB_STAGES, formatOf, hubVisible, splitHubPosts } from "@/lib/hubs";
import { STAGE_NAMES, stagePath } from "@/lib/clusters";
import { getAllPosts } from "@/lib/guides";
import { getConsult, consultView } from "@/lib/consults";
import { getDownload, downloadView } from "@/lib/downloads";
import { TOOLS } from "@/lib/tools";
import { canShow } from "@/lib/review-gate";
import { authorPath, getAuthorBySlug } from "@/lib/authors";
import { breadcrumbSchema, medicalCondition } from "@/lib/jsonld";
import { formatDate } from "@/lib/reads-article";
import { SITE_URL, appLink } from "@/lib/site";
import { ORG } from "@/lib/legal";

/* A condition hub: /conditions/<slug>/. Data in content/conditions/<slug>.json.
   The app's five tabs become anchored sections with a sticky in-page nav (not
   JS tabs), so every word is in the HTML for search.

   Live only when the file says published AND 3+ published articles belong to
   it (lib/conditions.ts). Preview and dev deploys show every hub as a draft,
   marked noindex, so the team can review them. */

export const revalidate = 60;
export const dynamicParams = true;

export function generateStaticParams() {
  return CONDITIONS.map((c) => ({ slug: c.slug }));
}

type Params = Promise<{ slug: string }>;

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const c = getCondition((await params).slug);
  if (!c) return {};
  const posts = await getAllPosts();
  if (!hubVisible(c, posts)) return {};
  const title = `${c.name}: guide and support`;
  const description = c.one_line || `${c.name}: what it means, what helps, what to ask your doctor, and how to talk to a specialist.`;
  return {
    title,
    description,
    alternates: { canonical: conditionPath(c.slug) },
    ...(isHubLive(c, posts) ? {} : { robots: { index: false, follow: false } }),
    openGraph: { type: "website", url: `${SITE_URL}${conditionPath(c.slug)}`, title, description },
  };
}

export default async function HubPage({ params }: { params: Params }) {
  const c = getCondition((await params).slug);
  if (!c) notFound();
  const posts = await getAllPosts();
  if (!hubVisible(c, posts)) notFound();

  const live = isHubLive(c, posts);
  const stage = conditionSiteStage(c);
  const stageInfo = HUB_STAGES.find((s) => s.key === c.stage)!;
  const { understand, helps } = splitHubPosts(c, posts);
  const sensitive = c.sensitivity === "high";
  const redFlags = c.red_flags.length && canShow(c.red_flags_reviewed) ? c.red_flags : [];
  const tool = c.tool ? TOOLS.find((t) => t.slug === c.tool && t.available !== false) : undefined;
  const trackTool = c.track?.tool ? TOOLS.find((t) => t.slug === c.track!.tool && t.available !== false) : undefined;
  const consult = getConsult(c.consult.specialty);
  const download = getDownload(c.download);
  const reviewer = c.reviewed_by && c.reviewed_at ? getAuthorBySlug(c.reviewed_by) : undefined;

  const sections = [
    { id: "understand", label: "Understand it", show: understand.length > 0 },
    { id: "where-do-i-stand", label: "Where do I stand?", show: Boolean(tool) || c.doctor_questions.length > 0 },
    { id: "what-helps", label: "What helps", show: helps.length > 0 || Boolean(download) },
    { id: "keep-track", label: "Keep track", show: Boolean(c.track) },
    { id: "talk-to-a-specialist", label: "Talk to a specialist", show: Boolean(consult) },
    { id: "common-questions", label: "Common questions", show: c.faq.length > 0 },
  ].filter((s) => s.show);

  const crumbs = [
    { name: STAGE_NAMES[stage], path: stagePath(stage) },
    { name: "Conditions", path: `/conditions/#${stageInfo.anchor}` },
    { name: c.name, path: conditionPath(c.slug) },
  ];
  const url = `${SITE_URL}${conditionPath(c.slug)}`;
  const jsonLd = [
    {
      "@context": "https://schema.org",
      "@type": "MedicalWebPage",
      name: `${c.name}: guide and support`,
      url,
      ...(c.one_line ? { description: c.one_line } : {}),
      about: medicalCondition({ name: c.name, alternateName: c.alternate_names, specialty: c.specialty }),
      inLanguage: "en-IN",
      publisher: { "@type": "Organization", "@id": `${SITE_URL}/#organization`, name: ORG.brand, legalName: ORG.legalEntity, url: `${SITE_URL}/` },
      ...(reviewer
        ? {
            lastReviewed: c.reviewed_at,
            reviewedBy: { "@type": "Person", name: reviewer.name, url: `${SITE_URL}${authorPath(reviewer.slug)}/` },
          }
        : {}),
      hasPart: understand.concat(helps).map((p) => ({ "@type": "Article", headline: p.title, url: `${SITE_URL}/reads/${p.category}/${p.slug}/` })),
    },
    breadcrumbSchema(crumbs),
  ];

  return (
    <div className="hub">
      <HubView condition={c.slug} />
      {!live ? (
        <p className="hub__draft" role="note">
          Draft: only preview and local builds show this hub. It goes live when its file says published and 3 or more articles belong
          to it ({understand.length + helps.length} today).
        </p>
      ) : null}

      <header className="phero ahero hub__head" style={{ ["--tone" as string]: "#E8D9C0" }}>
        <div className="wrap">
          <div className="phero__copy" style={{ maxWidth: 860 }}>
            <nav className="rhead__crumbs" aria-label="Breadcrumb">
              <span className="rhead__crumb">
                Part of <Link href={crumbs[0].path}>{crumbs[0].name}</Link>
              </span>
              <span className="rhead__crumb">
                <span aria-hidden="true">/</span>
                <Link href={crumbs[1].path}>Conditions</Link>
              </span>
            </nav>
            <h1 className="display-xl">
              <span className="hl">
                <span>{c.name}</span>
              </span>
            </h1>
            {c.one_line ? <p className="lede">{c.one_line}</p> : null}
            {reviewer ? (
              <p className="rhead__meta">
                Reviewed by{" "}
                <Link href={`${authorPath(reviewer.slug)}/`}>
                  <b>{reviewer.name}</b>
                </Link>
                , {reviewer.role}
                <span aria-hidden="true"> · </span>
                Last reviewed <time dateTime={c.reviewed_at!}>{formatDate(c.reviewed_at!)}</time>
              </p>
            ) : null}
          </div>
        </div>
      </header>

      {sections.length > 1 ? (
        <nav className="hub__nav" aria-label="On this page">
          <div className="wrap">
            {sections.map((s) => (
              <a key={s.id} href={`#${s.id}`}>
                {s.label}
              </a>
            ))}
          </div>
        </nav>
      ) : null}

      <div className="wrap hub__body">
        {redFlags.length ? <RedFlagCard items={redFlags} slug={c.slug} /> : null}
        {c.who_this_is_for ? <p className="hub__who">{c.who_this_is_for}</p> : null}

        {understand.length ? (
          <section id="understand" className="hub__sec" aria-labelledby="understand-h">
            <h2 id="understand-h" className="display-m">
              Understand it
            </h2>
            <ul className="agrid agrid--three">
              {understand.map((p) => (
                <li key={p.slug} className="hub__card">
                  <span className="hub__badge">{formatOf(p)}</span>
                  <PostCard post={p} />
                </li>
              ))}
            </ul>
          </section>
        ) : null}

        {tool || c.doctor_questions.length ? (
          <section id="where-do-i-stand" className="hub__sec" aria-labelledby="stand-h">
            <h2 id="stand-h" className="display-m">
              Where do I stand?
            </h2>
            {tool ? (
              <ToolEmbed tool={tool} condition={c.slug} />
            ) : (
              <>
                <p>Questions to take to your doctor:</p>
                <ul className="hub__checklist">
                  {c.doctor_questions.map((q) => (
                    <li key={q}>{q}</li>
                  ))}
                </ul>
              </>
            )}
          </section>
        ) : null}

        {helps.length || download ? (
          <section id="what-helps" className="hub__sec" aria-labelledby="helps-h">
            <h2 id="helps-h" className="display-m">
              What helps
            </h2>
            {helps.length ? (
              <ul className="agrid agrid--three">
                {helps.map((p) => (
                  <li key={p.slug} className="hub__card">
                    <span className="hub__badge">{formatOf(p)}</span>
                    <PostCard post={p} />
                  </li>
                ))}
              </ul>
            ) : null}
            {download ? <DownloadCard download={downloadView(download)} condition={c.slug} /> : null}
          </section>
        ) : null}

        {c.track ? (
          <section id="keep-track" className="hub__sec" aria-labelledby="track-h">
            <h2 id="track-h" className="display-m">
              Keep track
            </h2>
            <p>{c.track.label}</p>
            {trackTool ? (
              <ToolEmbed tool={trackTool} condition={c.slug} />
            ) : (
              <p>
                <Link className="btn btn--ink" href={appLink("hub-track", c.slug)}>
                  Track it in the ParentVeda app
                </Link>
              </p>
            )}
          </section>
        ) : null}

        {consult ? (
          <div className="hub__sec">
            <ConsultBlock consult={consultView(consult)} condition={c.slug} />
          </div>
        ) : null}

        {sensitive ? <SupportCard /> : null}

        {c.faq.length ? (
          <div id="common-questions" className="hub__sec">
            {/* Faq prints its own heading and FAQPage structured data. */}
            <Faq items={c.faq} title="Common questions" />
          </div>
        ) : null}

        <div className="care hub__care">
          <p>This guide explains; it does not diagnose. If your doctor has told you something different, your doctor is right.</p>
        </div>
      </div>

      {/* Never on a sensitive hub: the waitlist form also offers the newsletter. */}
      {!sensitive && !consult ? <CtaBand source={`hub-${c.slug}`} /> : null}
      <JsonLd data={jsonLd} />
    </div>
  );
}
