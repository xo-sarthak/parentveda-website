/* ============================================================
   Image guard for Reads: catches a cover and an in-article image mixed up.

   WHY. On 18 Nov the vaccination chart article went live with its in-article
   infographic as the cover, and nothing could tell. Directus keeps only the
   uploaded file, not which Drive file or which sheet column it came from, so
   once a picture is uploaded the mistake looks like any other image.

   WHAT IT CHECKS. Two things that are never right, so they block a release:
   - the cover file is also an image inside the article (one picture used twice);
   - the cover's alt text opens by calling it an infographic, a chart or a
     diagram, i.e. a picture made to be read, which belongs in the body.
   Two things that are often deliberate (an unsafe cover left off, a Drive file
   not shared) come back as notes only: a missing cover, no in-article image.

   No imports and no path aliases on purpose: scripts/image-audit.mjs loads
   this file straight from Node, outside Next.
   ============================================================ */

const UUID = /[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}/i;

/** An alt text that opens by naming a picture meant to be read rather than looked at
    ("Infographic titled…", "A flow chart…"). Anchored to the start: an illustration
    whose scene merely contains a diagram ("…a glowing diagram links…", the
    pcos-stress-sleep cover) is a real cover and must pass. "Table" is left out:
    "A table laid with a salad bowl…" (improve-sperm-count) is furniture. */
const READABLE_PICTURE = /^\s*(?:an?\s+)?(?:infographic|flow ?chart|diagram|chart)\b/i;

export type GuardPost = {
  slug: string;
  body?: string | null;
  og_image?: string | null;
  og_image_file?: string | null;
  og_image_alt?: string | null;
};

export type ImageCheck = {
  /** Reasons the post must not go out as it is. */
  blocking: string[];
  /** Worth a look, but often deliberate. */
  notes: string[];
};

/** The Directus file id inside a link or bare id, if there is one. */
export function fileIdOf(src: string | null | undefined): string | undefined {
  const m = src ? UUID.exec(src) : null;
  return m ? m[0].toLowerCase() : undefined;
}

/** Every image source in the article's Markdown: ![alt](src "title"). */
export function bodyImageSources(body: string | null | undefined): string[] {
  return [...(body ?? "").matchAll(/!\[[^\]]*\]\(\s*<?([^)\s>]+)/g)].map((m) => m[1]);
}

export function checkImages(post: GuardPost): ImageCheck {
  const blocking: string[] = [];
  const notes: string[] = [];

  const coverSrc = post.og_image_file || post.og_image || "";
  const coverId = fileIdOf(post.og_image_file) ?? fileIdOf(post.og_image);
  const inline = bodyImageSources(post.body);
  const inlineIds = inline.map(fileIdOf).filter(Boolean);

  if (coverId && inlineIds.includes(coverId)) {
    blocking.push("the cover is also used as an image inside the article");
  } else if (coverSrc && inline.includes(coverSrc)) {
    blocking.push("the cover is also used as an image inside the article");
  }
  if (coverSrc && READABLE_PICTURE.test(post.og_image_alt ?? "")) {
    blocking.push("the cover's alt text describes an infographic or diagram, which belongs inside the article");
  }

  if (!coverSrc) notes.push("no cover");
  if (!inline.length) notes.push("no image inside the article");

  return { blocking, notes };
}
