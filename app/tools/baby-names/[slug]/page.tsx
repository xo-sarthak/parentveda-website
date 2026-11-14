import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import SubShell from "@/components/tools/SubShell";
import { getBabyNames } from "@/lib/shared-content";
import { getAllPosts } from "@/lib/guides";
import { getTool, readsForTool, toolPath } from "@/lib/tools";
import { SITE_URL } from "@/lib/site";
import {
  allNamePages,
  communitiesOf,
  namePageSlug,
  namePageTitle,
  namesFor,
  namesPath,
  parseNamePage,
  type NamePage,
  type NameRow,
} from "@/lib/baby-names";

/* Browse pages for the baby name finder: one starting letter, or one community,
   for girls, boys or both. Same names as the finder (the baby_names table the app
   reads too), laid out as a list a search engine can read. */

export const revalidate = 60;
export const dynamicParams = true;

const tool = getTool("baby-names");
const POP = { T: "Trending", C: "Classic", R: "Rare" } as const;

export async function generateStaticParams() {
  return allNamePages(await getBabyNames()).map((p) => ({ slug: namePageSlug(p) }));
}

type Params = Promise<{ slug: string }>;

async function load(slug: string) {
  const page = parseNamePage(slug);
  if (!page) return null;
  const all = await getBabyNames();
  const list = namesFor(page, all);
  if (list.length === 0) return null;
  return { page, list, all };
}

function describe(p: NamePage, list: NameRow[]): string {
  const n = list.length.toLocaleString("en-IN");
  const who = p.gender === "girl" ? "girl" : p.gender === "boy" ? "boy" : "girl and boy";
  if (p.kind === "community") return `${n} ${p.community} ${who} names with their meanings, from classic to rare. Unisex names are included.`;
  const comms = communitiesOf(list).slice(0, 4).join(", ");
  return `${n} Indian ${who} names starting with ${p.letter}, with meanings, across ${comms} families.${p.gender !== "all" ? " Unisex names are included." : ""}`;
}

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const found = await load((await params).slug);
  if (!found) return {};
  const title = `${namePageTitle(found.page)}, with meanings`;
  const description = describe(found.page, found.list);
  const canonical = namesPath(namePageSlug(found.page));
  return {
    title,
    description,
    alternates: { canonical },
    openGraph: { type: "website", url: `${SITE_URL}${canonical}`, title, description },
    twitter: { card: "summary", title, description },
  };
}

function NameCards({ list }: { list: NameRow[] }) {
  return (
    <ul className="name-list">
      {list.map(([name, dev, g, meaning, c, origin, p]) => (
        <li key={name}>
          <strong>
            {name} {dev && <span className="name-list__dev">{dev}</span>}
          </strong>
          <span>{meaning}</span>
          <span className="name-list__g">
            {g === "g" ? "Girl" : g === "b" ? "Boy" : "Unisex"} · {c}
            {origin ? ` · ${origin}` : ""} · {POP[p]}
          </span>
        </li>
      ))}
    </ul>
  );
}

export default async function NamesBrowsePage({ params }: { params: Params }) {
  const found = await load((await params).slug);
  if (!found) notFound();
  const { page, list, all } = found;
  const pages = allNamePages(all);
  const slugs = new Set(pages.map(namePageSlug));
  const title = namePageTitle(page);
  const canonical = namesPath(namePageSlug(page));

  const genders = (["all", "girl", "boy"] as const).filter((g) => g !== "all" || page.kind === "letter");
  const letterLinks = page.kind === "letter" ? pages.filter((p) => p.kind === "letter" && p.gender === page.gender) : [];
  const communityLinks = pages.filter((p) => p.kind === "community" && (page.kind === "letter" || p.gender === page.gender || p.community === page.community));

  /* Community pages are long: group them by first letter, with a jump list. */
  const byLetter = page.kind === "community" ? [...new Set(list.map((n) => n[0][0].toUpperCase()))].map((l) => [l, list.filter((n) => n[0][0].toUpperCase() === l)] as const) : [];

  const reads = readsForTool(tool, await getAllPosts(), 4);

  return (
    <SubShell
      tone={tool.tone}
      crumbs={[
        { name: "Free tools", path: "/tools/" },
        { name: tool.name, path: toolPath(tool.slug) },
        { name: title, path: canonical },
      ]}
      eyebrow="Baby names"
      title={
        <>
          {title}, <em>with meanings</em>
        </>
      }
      intro={describe(page, list)}
      note="Meanings are the common ones a family would be told. A name can carry more than one, and your pandit, maulvi, granthi or priest may give another. If your family has a name you love that isn't here yet, write to hello@parentveda.in and we'll add it."
      reads={reads}
      schema={[
        {
          "@context": "https://schema.org",
          "@type": "ItemList",
          name: title,
          url: `${SITE_URL}${canonical}`,
          numberOfItems: list.length,
          itemListElement: list.slice(0, 100).map((n, i) => ({ "@type": "ListItem", position: i + 1, name: n[0], description: n[3] })),
        },
      ]}
    >
      <nav className="names-nav" aria-label="Browse names">
        {page.kind === "letter" && (
          <div className="tool-chips" role="group" aria-label="Girls or boys">
            {genders.map((g) => {
              const p: NamePage = { kind: "letter", gender: g, letter: page.letter };
              const s = namePageSlug(p);
              if (!slugs.has(s)) return null;
              const label = g === "all" ? "All names" : g === "girl" ? "Girls" : "Boys";
              return g === page.gender ? (
                <span key={g} className="tool-chip is-on" aria-current="page">
                  {label}
                </span>
              ) : (
                <Link key={g} className="tool-chip" href={namesPath(s)}>
                  {label}
                </Link>
              );
            })}
          </div>
        )}

        {letterLinks.length > 0 && (
          <div className="tool-letters names-nav__letters" role="group" aria-label="Starting letter">
            {letterLinks.map((p) =>
              p.kind === "letter" && page.kind === "letter" && p.letter === page.letter ? (
                <span key={p.letter} className="tool-chip is-on" aria-current="page">
                  {p.letter}
                </span>
              ) : (
                <Link key={namePageSlug(p)} className="tool-chip" href={namesPath(namePageSlug(p))}>
                  {p.kind === "letter" ? p.letter : ""}
                </Link>
              )
            )}
          </div>
        )}

        {byLetter.length > 0 && (
          <div className="tool-letters names-nav__letters" role="group" aria-label="Jump to letter">
            {byLetter.map(([l]) => (
              <a key={l} className="tool-chip" href={`#letter-${l}`}>
                {l}
              </a>
            ))}
          </div>
        )}
      </nav>

      <p className="tool-count">{list.length.toLocaleString("en-IN")} names</p>

      {page.kind === "letter" ? (
        <NameCards list={list} />
      ) : (
        byLetter.map(([l, rows]) => (
          <section key={l} id={`letter-${l}`} className="names-group" aria-label={`Starting with ${l}`}>
            <h2 className="names-group__h">{l}</h2>
            <NameCards list={[...rows]} />
          </section>
        ))
      )}

      <div className="names-more">
        <h2 className="tool-h2">More names</h2>
        <ul className="safe-links">
          {communityLinks
            .filter((p) => namePageSlug(p) !== namePageSlug(page))
            .map((p) => (
              <li key={namePageSlug(p)}>
                <Link href={namesPath(namePageSlug(p))}>
                  <span>{namePageTitle(p)}</span>
                </Link>
              </li>
            ))}
        </ul>
        <p className="safe-page__back">
          <Link className="btn btn--ink" href={toolPath(tool.slug)}>
            Search all {all.length.toLocaleString("en-IN")} names by meaning
          </Link>
        </p>
      </div>
    </SubShell>
  );
}

