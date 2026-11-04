import { getAllPosts, postPath, type GuidePost, type StageSlug } from "@/lib/guides";
import { legalPath } from "@/lib/legal";
import { SITE_URL, site } from "@/lib/site";
import { stages } from "@/lib/stages";

/* /llms.txt: a plain map of the site for AI search. Built from the same read as
   every listing, so a new article appears within the minute. */
export const revalidate = 60;

/* Post `stage` values, by the stage page that owns them. Skilling has no reads yet,
   so it lists its hub alone. */
const STAGE_OF_HUB: Record<string, StageSlug | undefined> = {
  "trying-to-conceive": "ttc",
  pregnancy: "pregnancy",
  parenting: "parenting",
};

const oneLine = (s: string) => s.replace(/\s+/g, " ").trim();

function articleLine(p: GuidePost): string {
  const url = `${SITE_URL}${p.canonicalPath ?? postPath(p.category, p.slug)}/`;
  const about = oneLine(p.description || p.excerpt);
  return `- [${oneLine(p.title)}](${url})${about ? `: ${about}` : ""}`;
}

export async function GET() {
  const posts = await getAllPosts();

  const sections = stages.map((s) => {
    const owned = posts.filter((p) => p.stage === STAGE_OF_HUB[s.slug]);
    return [`## ${s.name}`, "", `- [${s.name} hub](${SITE_URL}/${s.slug}/)`, ...owned.map(articleLine)].join("\n");
  });

  const homeless = posts.filter((p) => !p.stage);
  if (homeless.length) sections.push(["## More reads", "", ...homeless.map(articleLine)].join("\n"));

  const text = [
    `# ${site.name}`,
    "",
    `> ${site.name} is an India-first companion for families, offering evidence-informed guidance from trying to conceive through pregnancy, parenting and the school years. Articles are reviewed by named experts where marked. It explains and helps people prepare; it never diagnoses, and it always points back to the reader's own doctor.`,
    "",
    ...sections.flatMap((s) => [s, ""]),
    "## About our guidance",
    "",
    `- [Our experts](${SITE_URL}/experts/): who reviews and advises on our content`,
    `- [Editorial Policy](${SITE_URL}${legalPath("editorial-policy")}/): how articles are researched, written, reviewed and corrected`,
    `- [Medical Disclaimer](${SITE_URL}${legalPath("medical-disclaimer")}/): what this guidance is and is not`,
    "",
  ].join("\n");

  return new Response(text, { headers: { "Content-Type": "text/plain; charset=utf-8" } });
}
