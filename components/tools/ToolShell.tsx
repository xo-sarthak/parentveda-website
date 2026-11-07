import Link from "next/link";
import Icon from "@/components/Icon";
import JsonLd from "@/components/JsonLd";
import ToolCard from "./ToolCard";
import { breadcrumbSchema } from "@/lib/jsonld";
import { getAllPosts, postPath } from "@/lib/guides";
import { SITE_URL } from "@/lib/site";
import { TOOLS, TOOLS_BASE, readsForTool, toolPath, type ToolInfo } from "@/lib/tools";

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
  const reads = readsForTool(tool, await getAllPosts());
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

      <section className="phero tool-hero" style={{ ["--tone" as string]: tool.tone }} aria-labelledby="t-title">
        <div className="wrap">
          <nav className="tool-crumbs" aria-label="Breadcrumb">
            <Link href={`${TOOLS_BASE}/`}>Free tools</Link> <span aria-hidden="true">/</span> <span>{tool.stage}</span>
          </nav>
          <h1 id="t-title" className="tool-title">
            {tool.name}
          </h1>
          <p className="tool-intro">{intro}</p>
        </div>
      </section>

      <section className="tool-block tool-block--main" style={{ ["--tone" as string]: tool.tone }}>
        <div className="wrap">
          {children}
          <p className="tool-note">{note}</p>
        </div>
      </section>

      {reads.length > 0 && (
        <section className="tool-block tool-noprint" aria-labelledby="t-reads">
          <div className="wrap">
            <h2 id="t-reads" className="tool-h2">
              Read next
            </h2>
            <ul className="tool-reads">
              {reads.map((p) => (
                <li key={p.slug}>
                  <Link href={`${p.canonicalPath ?? postPath(p.category, p.slug)}/`}>
                    {p.ogImage && (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={p.ogImage} alt="" loading="lazy" />
                    )}
                    <span>{p.title}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}

      <section className="tool-block tool-noprint" aria-labelledby="t-faq">
        <div className="wrap tool-faq">
          <h2 id="t-faq" className="tool-h2">
            Common questions
          </h2>
          <div>
            {faqs.map((f) => (
              <details key={f.q} className="faq__item">
                <summary>
                  <span>{f.q}</span>
                  <Icon name="plus" size={18} />
                </summary>
                <p>{f.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      <section className="tool-block tool-noprint" aria-labelledby="t-more">
        <div className="wrap">
          <h2 id="t-more" className="tool-h2">
            More free tools
          </h2>
          <ul className="tool-grid tool-grid--compact">
            {others.map((t) => (
              <li key={t.slug} style={{ ["--tone" as string]: t.tone }}>
                <ToolCard tool={t} />
              </li>
            ))}
          </ul>
        </div>
      </section>
    </>
  );
}
