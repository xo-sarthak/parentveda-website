/* npm run indexnow:all [-- --dry-run]
   Submits every URL in the live sitemap to IndexNow once, for the backfill. Run it
   after INDEXNOW_KEY is live on the site, because IndexNow checks the key file. */

const SITE = "https://parentveda.in";
const BATCH = 500;

const dryRun = process.argv.includes("--dry-run");
const key = process.env.INDEXNOW_KEY;
if (!key && !dryRun) {
  console.error("INDEXNOW_KEY is not set. Add it to .env.local.");
  process.exit(1);
}

const res = await fetch(`${SITE}/sitemap.xml`);
if (!res.ok) throw new Error(`Could not read the sitemap: ${res.status}`);
const urls = [...(await res.text()).matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1].trim());
console.log(`${urls.length} URLs in the sitemap`);

let failed = 0;
for (let i = 0; i < urls.length; i += BATCH) {
  const urlList = urls.slice(i, i + BATCH);
  const label = `batch ${i / BATCH + 1} (${urlList.length} URLs)`;
  if (dryRun) {
    console.log(`${label}: dry run, not sent`);
    continue;
  }
  try {
    const r = await fetch("https://api.indexnow.org/indexnow", {
      method: "POST",
      headers: { "Content-Type": "application/json; charset=utf-8" },
      body: JSON.stringify({ host: new URL(SITE).host, key, keyLocation: `${SITE}/${key}.txt`, urlList }),
    });
    console.log(`${label}: ${r.status} ${r.statusText}`);
    if (!r.ok) failed++;
  } catch (err) {
    console.error(`${label}: ${err.message}`);
    failed++;
  }
}
if (failed) process.exitCode = 1;
