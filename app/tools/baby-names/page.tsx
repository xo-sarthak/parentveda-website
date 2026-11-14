import type { Metadata } from "next";
import ToolShell from "@/components/tools/ToolShell";
import BabyNames from "@/components/tools/BabyNames";
import Link from "next/link";
import { getBabyNames } from "@/lib/shared-content";
import { allNamePages, namePageSlug, namePageTitle, namesPath, type NamePage } from "@/lib/baby-names";
import { getTool, toolPath } from "@/lib/tools";
import { SITE_URL } from "@/lib/site";

// Re-reads the names and the article list every minute. A Directus publish flushes this sooner, through /api/revalidate.
export const revalidate = 60;

const tool = getTool("baby-names");
const TITLE = "Indian Baby Names with Meanings: Boy and Girl Name Finder";
const DESCRIPTION = "Browse over 2,000 Indian baby names with meanings, across Hindu, Muslim, Sikh, Christian, Jain, Buddhist and Parsi families. Filter by letter, gender and style.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: toolPath(tool.slug) },
  openGraph: { type: "website", url: `${SITE_URL}${toolPath(tool.slug)}`, title: TITLE, description: DESCRIPTION },
  twitter: { card: "summary", title: TITLE, description: DESCRIPTION },
};

const FAQS = [
  {
    "q": "How do I choose a starting letter for my baby's name?",
    "a": "Many families choose a letter from the baby's nakshatra (birth star), worked out from the time and place of birth. Use the letter filter to see names that start with it."
  },
  {
    "q": "When is the naming ceremony done?",
    "a": "The naamkaran is traditionally held on the 11th or 12th day after birth, though families choose different days based on custom and convenience."
  },
  {
    "q": "Can I search by meaning?",
    "a": "Yes. Type a meaning like light, brave or Lakshmi into the search box to see names that carry it."
  }
];

export default async function Page() {
  const names = await getBabyNames();
  return (
    <ToolShell tool={tool} intro={"Looking for a name with meaning? Browse over 2,000 Indian names for girls and boys, filter by the letter your family chose, your community or how popular the name is, or search by the meaning you want."} note={"Meanings are the common ones a family would be told. A name can carry more than one, and your pandit, maulvi, granthi or priest may give another. If your family has a name you love that isn't here yet, write to hello@parentveda.in and we'll add it."} faqs={FAQS}>
      <BabyNames names={names} />
      <BrowseLinks pages={allNamePages(names)} />
    </ToolShell>
  );
}

/* Plain links to every browse page, so readers and search engines can reach them. */
function BrowseLinks({ pages }: { pages: NamePage[] }) {
  const rows: [string, NamePage[]][] = [
    ["Girl names by letter", pages.filter((p) => p.kind === "letter" && p.gender === "girl")],
    ["Boy names by letter", pages.filter((p) => p.kind === "letter" && p.gender === "boy")],
    ["By community", pages.filter((p) => p.kind === "community")],
  ];
  return (
    <nav className="names-browse" aria-label="Browse names">
      {rows.map(([label, list]) => (
        <div key={label}>
          <h2 className="tool-h3">{label}</h2>
          <div className={label === "By community" ? "tool-chips" : "tool-letters names-nav__letters"}>
            {list.map((p) => (
              <Link key={namePageSlug(p)} className="tool-chip" href={namesPath(namePageSlug(p))} title={namePageTitle(p)}>
                {p.kind === "letter" ? p.letter : namePageTitle(p).replace(/ baby/, "")}
              </Link>
            ))}
          </div>
        </div>
      ))}
    </nav>
  );
}
