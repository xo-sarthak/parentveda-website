import Link from "next/link";
import JsonLd from "@/components/JsonLd";
import { breadcrumbSchema, type Crumb } from "@/lib/jsonld";
import { postPath, type GuidePost } from "@/lib/guides";

/* Frame for the pages that hang off a tool: one is-it-safe answer, one set of
   baby names, one month of pregnancy. Same hero, width and rhythm as ToolShell,
   so they read as part of the tool they come from. The last crumb is the page
   itself and is not a link. */
export default function SubShell({
  crumbs,
  eyebrow,
  title,
  intro,
  tone,
  note,
  reads = [],
  schema = [],
  children,
}: {
  crumbs: Crumb[];
  eyebrow?: string;
  title: React.ReactNode;
  intro?: React.ReactNode;
  tone: string;
  note?: string;
  reads?: GuidePost[];
  schema?: unknown[];
  children: React.ReactNode;
}) {
  const trail = crumbs.slice(0, -1);
  return (
    <>
      <JsonLd data={breadcrumbSchema(crumbs)} />
      {schema.map((s, i) => (
        <JsonLd key={i} data={s} />
      ))}

      <section className="phero tool-hero" style={{ ["--tone" as string]: tone }} aria-labelledby="t-title">
        <div className="wrap">
          <nav className="tool-crumbs" aria-label="Breadcrumb">
            {trail.map((c, i) => (
              <span key={c.path}>
                {i > 0 && <span aria-hidden="true"> / </span>}
                <Link href={c.path}>{c.name}</Link>
              </span>
            ))}
          </nav>
          {eyebrow && <span className="phero__range">{eyebrow}</span>}
          <h1 id="t-title" className="tool-title">
            {title}
          </h1>
          {intro && <p className="tool-intro">{intro}</p>}
        </div>
      </section>

      <section className="tool-block tool-block--main" style={{ ["--tone" as string]: tone }}>
        <div className="wrap">
          {children}
          {note && <p className="tool-note">{note}</p>}
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
    </>
  );
}
