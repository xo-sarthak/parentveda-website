import Link from "next/link";

export default function NotFound() {
  return (
    <section className="nf">
      <div>
        <span className="eyebrow eyebrow--plain">Page not found</span>
        <h1 className="display-l">
          This page isn’t here, <em>but the rest of us are.</em>
        </h1>
        <p className="lede">The link may be old, or the page may have moved. Start again from the home page.</p>
        <Link href="/" className="btn btn--ink">
          Go to the home page
        </Link>
      </div>
    </section>
  );
}
