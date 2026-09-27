import Link from "next/link";
import { postPath, type GuidePost } from "@/lib/guides";

// A Reads card: the article's own photograph when it has one, otherwise the
// drawn cover in its stage's colour.
const STAGE = {
  ttc: { name: "Trying", tone: "#E8D9C0", deep: "#6B4A1F" },
  pregnancy: { name: "Pregnancy", tone: "#E8C4CE", deep: "#7A3348" },
  parenting: { name: "Parenting", tone: "#D8CCE8", deep: "#4A3470" },
} as const;

export function stageLook(stage?: string) {
  return STAGE[(stage ?? "pregnancy") as keyof typeof STAGE] ?? STAGE.pregnancy;
}

export default function PostCard({ post, categoryName, lead }: { post: GuidePost; categoryName?: string; lead?: boolean }) {
  const s = stageLook(post.stage);
  return (
    <Link
      href={`${post.canonicalPath ?? postPath(post.category, post.slug)}/`}
      className={`acard${lead ? " acard--lead" : ""}`}
      style={{ ["--tone" as string]: s.tone, ["--deep" as string]: s.deep }}
    >
      <span className="acard__cover" aria-hidden="true">
        {post.ogImage ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={post.ogImage} alt="" loading="lazy" />
        ) : (
          <>
            <span className="acard__disc" />
            <span className="acard__cat">{categoryName ?? s.name}</span>
          </>
        )}
      </span>
      <span className="acard__body">
        <span className="acard__meta">
          {post.stage ? `${s.name} · ` : ""}
          {post.readingTime || categoryName}
        </span>
        <span className="acard__title">{post.title}</span>
        {post.excerpt || post.description ? <span className="acard__desc">{post.excerpt || post.description}</span> : null}
      </span>
    </Link>
  );
}
