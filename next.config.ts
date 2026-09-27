import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: { formats: ["image/avif", "image/webp"] },

  /* Every URL ends in a slash — the old site's shape, and the one Google has
     indexed (parentveda.in/reads/articles/<slug>/). Matching it byte for byte
     means the switch changes no indexed address. */
  trailingSlash: true,

  /* Carried over from the old site's next.config.ts, which explains each rule
     at length. In short: /guides became /reads on 29 July 2026 and the
     category slugs were pluralised on 30 July; links to the old paths are out
     in the world, so each 308s straight to its final address in one hop.
     Every destination ends in a slash, because trailingSlash does not
     normalise redirect destinations. Specific rules precede the wildcard. */
  async redirects() {
    const CATEGORY_RENAMES: Array<[string, string]> = [
      ["article", "articles"],
      ["research-summary", "research-summaries"],
      ["book-summary", "book-summaries"],
      ["recipe", "recipes"],
    ];

    const renameRules = CATEGORY_RENAMES.flatMap(([from, to]) =>
      ["/reads", "/guides"].flatMap((base) => [
        { source: `${base}/${from}`, destination: `/reads/${to}/`, permanent: true },
        { source: `${base}/${from}/:slug*`, destination: `/reads/${to}/:slug*/`, permanent: true },
      ])
    );

    return [
      ...renameRules,
      { source: "/guides", destination: "/reads/", permanent: true },
      { source: "/guides/:path*", destination: "/reads/:path*/", permanent: true },

      /* The new site briefly had its own /articles section (eight reads
         converted from the app). Reads is the one articles section now, so
         /articles points there and never competes with it for the same
         searches. The converted files are kept in content/articles and
         app/_articles-kept. */
      { source: "/articles", destination: "/reads/articles/", permanent: true },
      { source: "/articles/:slug*", destination: "/reads/articles/", permanent: true },

      /* The old site's draft homepages were noindex; send anyone holding one
         of those links to the home page rather than a 404. */
      { source: "/v4", destination: "/", permanent: false },
      { source: "/v4b", destination: "/", permanent: false },
      { source: "/v4c", destination: "/", permanent: false },
    ];
  },
};

export default nextConfig;
