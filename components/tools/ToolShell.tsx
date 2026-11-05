import Link from "next/link";
import JsonLd from "@/components/JsonLd";
import { breadcrumbSchema } from "@/lib/jsonld";
import { getAllPosts, postPath } from "@/lib/guides";
import { SITE_URL } from "@/lib/site";
import { TOOLS, TOOLS_BASE, toolPath, type ToolInfo } from "@/lib/tools";

/* Shared frame for every tool page: hero, the tool itself, an honest note,
   reads that explain the result, the other tools, and the structured data. */
export default async function ToolShell({
  tool,
  intro,
  note,
  faqs,
  children,
}: {
  tool: ToolInfo;
  intro: string;
  note: string;
  faqs: { q: string; a: string }[];
  children: React.ReactNode;
}) {
  const posts = await getAllPosts();
  const reads = tool.reads
    .map((slug) => posts.find((p) => p.slug === slug))
    .filter((p): p is NonNullable<typeof p> => Boolean(p))
    .slice(0, 4);
  const others = TOOLS.filter((t) => t.slug !== tool.slug);
  const url = `${SITE_URL}${toolPath(tool.slug)}`;

  return (
    <>
      <JsonLd
        data={breadcrumbSchema([
          { name: "Free tools", path: `${TOOLS_BASE}/` },
          { name: tool.name, path: toolPath(tool.slug) },
        ])}
      />
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "WebApplication",
          name: tool.name,
          url,
          description: tool.short,
          applicationCategory: "HealthApplication",
          operatingSystem: "Any",
          inLanguage: "en-IN",
          isAccessibleForFree: true,
          offers: { "@type": "Offer", price: "0", priceCurrency: "INR" },
          publisher: { "@type": "Organization", name: "ParentVeda", url: SITE_URL },
        }}
      />
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: faqs.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })),
        }}
      />

      <section className="phero ahero" style={{ ["--tone" as string]: tool.tone }} aria-labelledby="t-title">
        <div className="wrap">
          <div className="phero__copy" style={{ maxWidth: 820 }}>
            <nav className="tool-crumbs" aria-label="Breadcrumb">
              <Link href={`${TOOLS_BASE}/`}>Free tools</Link> <span aria-hidden="true">/</span> <span>{tool.stage}</span>
            </nav>
            <h1 id="t-title" className="display-xl">
              {tool.name}
            </h1>
            <p className="lede">{intro}</p>
          </div>
        </div>
      </section>

      <section className="section tool-section">
        <div className="wrap tool-wrap">
          {children}
          <p className="tool-note">{note}</p>
        </div>
      </section>

      {reads.length > 0 && (
        <section className="section tool-section" aria-labelledby="t-reads">
          <div className="wrap tool-wrap">
            <h2 id="t-reads" className="display-l">
              Read next
            </h2>
            <ul className="tool-links">
              {reads.map((p) => (
                <li key={p.slug}>
                  <Link href={`${p.canonicalPath ?? postPath(p.category, p.slug)}/`}>{p.title}</Link>
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}

      <section className="section tool-section" aria-labelledby="t-faq">
        <div className="wrap tool-wrap">
          <h2 id="t-faq" className="display-l">
            Common questions
          </h2>
          <div className="tool-faq">
            {faqs.map((f) => (
              <details key={f.q}>
                <summary>{f.q}</summary>
                <p>{f.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      <section className="section tool-section" aria-labelledby="t-more">
        <div className="wrap tool-wrap">
          <h2 id="t-more" className="display-l">
            More free tools
          </h2>
          <ul className="tool-grid">
            {others.map((t) => (
              <li key={t.slug} style={{ ["--tone" as string]: t.tone }}>
                <Link href={toolPath(t.slug)}>
                  <span className="tool-grid__stage">{t.stage}</span>
                  <strong>{t.name}</strong>
                  <span>{t.short}</span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </>
  );
}
