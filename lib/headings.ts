/* Anchor ids for article headings.

   Shared by PostBody (which stamps the id onto the <h2>) and Toc (which
   builds the matching href). They must agree exactly or every contents link
   is a dead jump, so the rule lives here once rather than in both files. */

export function headingSlug(text: string): string {
  return text
    .toLowerCase()
    .replace(/[*_`]/g, "") // inline emphasis
    .replace(/[’']/g, "") // keep "no one's" -> "no-ones", not "no-one-s"
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}
