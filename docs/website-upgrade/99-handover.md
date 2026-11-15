# Website upgrade: handover

Branch `feat/condition-hubs-and-conversion`, 15 Nov 2026. **Local only.** Nothing is pushed, merged, deployed, or changed in Supabase, Directus or Vercel. Reports per phase: `00-repo-audit.md`, `01-phase-1.md`, `02-phase-2.md`, `hindi-audit.md`, `medical-review-items.md`.

## Definition of done

| Item | Status |
|---|---|
| Repo audit written and approved before Phase 1 | Done |
| JSON-LD valid on articles, hubs and tools; validation script passes | Done. `npm run validate:schema`: 161 pages, 196 blocks, no errors. Hubs are checked once one is live (all are drafts, so 404 in production). |
| Breadcrumbs follow cluster; Read next follows condition, then cluster, then stage | Done |
| Red-flag cards on the listed slugs; tel:108 works | Built and checked on dev. **Hidden in production until a doctor signs off each list.** Only ectopic-pregnancy is published today; the other 15 are ready for when they publish. |
| Sensitive pages hide commerce and popups | Done (shop links become plain text, no waitlist or newsletter, "Talk to someone" card) |
| Reviewer mismatch CSV generated | Done: 76 of 78 flagged |
| 43 condition files; P1 hubs render with real articles; thin hubs stay unpublished | 43 files done, all `published: false`. Only high-risk-pregnancy has 3 or more articles. Hub copy (`one_line`, FAQ, doctor questions) is still to be written. |
| Consult and download forms: env webhooks, consent, rate limit, honeypot; no health data in URLs or analytics | Done and tested against a local mock webhook. Off until the webhook URLs are set. |
| Expert profiles show specialty and registration where provided | Done; registration numbers are still to be supplied |
| Trust pages drafted, flagged and not linked | Done (404 in production while draft) |
| 8 tools, values in JSON with reviewed false gating production, all values listed | Done |
| Hindi audit; Hinglish layout and toggle | Done (no Devanagari on the site; one Hinglish read, no pair yet) |
| GA4 events firing, verified in DebugView; UTMs on app links | Events and UTMs done. **Not verified in DebugView:** `NEXT_PUBLIC_GA_MEASUREMENT_ID` is not set locally, and checking needs a deploy. |
| Lighthouse mobile 85+ performance, 95+ accessibility | **Not run.** Run on a preview deploy, on one article, one hub and one tool. |
| Lint, typecheck, tests and build pass | Typecheck, build, `check:content` and `validate:schema` pass. **The repo has no lint or test setup**, so there was nothing to run for those. |

## What the team needs to supply

Drafted since (15 Nov 2026), all still behind the review gate:
- **AMH ranges by age** from an Indian study (Gunasheela 2021, 5,525 women): `lib/tools-reference/amh-reader.json`.
- **The nine PDFs**: `content/downloads/` (sources in `src/`, re-render with `node content/downloads/src/render.mjs`). Served at `/downloads/<slug>/` only when `reviewed: true` in `content/downloads.json`, or on preview.
- **Hub copy for all 43 hubs** (one line, who it is for, doctor questions, FAQ, red flags, track). Every claim is listed in `hub-copy-review.md`.
- **Consult descriptions** for the 11 consults that had none, and a new `obstetrician` consult for pregnancy hubs (price on request).

Still needed from the team:

1. **Webhook URLs** for consult requests and download leads (Google Sheet script in `02-phase-2.md`). Then set `CONSULT_WEBHOOK_URL`, `LEADS_WEBHOOK_URL` and optionally `OPS_EMAIL` in Vercel.
2. **Each expert's registration number**, and whether they take consults, which consult, and which conditions they cover (`lib/authors.ts`).
3. **Consult prices** beyond fertility specialist ₹899, gynaecologist ₹599 and male fertility ₹599. The app has genetic counselling at ₹999; confirm before it is added.
4. **Legal and founder review** of the three trust pages and the privacy policy addition (`02-phase-2.md`).
5. **Doctor sign-off** on `medical-review-items.md` (red flags, tool values including AMH) and `hub-copy-review.md` (hub copy and the nine PDFs). A sign-off sets `reviewed: true` / `red_flags_reviewed: true`, and for hubs `reviewed_by` and `reviewed_at` with the real reviewer and date.
6. **Decisions** still open in `01-phase-1.md` ("What I could not infer"), items 1 to 7. Item 8 (a pregnancy consult) is done.

## Before this is merged

Merging to `main` deploys parentveda.in. Readers would see these changes at once, even with every flag off:

- New breadcrumbs (Reads / Stage / Cluster / Title) and new "Read next" choices.
- 21 new cluster list pages at `/<stage>/<cluster>/` (thin ones are noindex).
- The week calculator card is replaced by a card chosen for the topic. Where no card fits, the app waitlist band shows, as before.
- Sensitive pages lose shop links and the waitlist band, and gain the "Talk to someone" card with the Tele-MANAS number.
- The sitemap becomes an index at `/sitemap.xml` with four parts.
- "Get the app" links carry UTM tags once the app is live (no change before launch).

Everything else stays off: hubs, red-flag cards, the 8 tools, consult and download forms, trust pages and content health.

Suggested order: a Vercel preview deploy of this branch first. On preview, the drafts, tools and red-flag cards show, so the team and the doctors can review them in place.

## Search Console, after the merge

1. In Search Console → Sitemaps, `sitemap.xml` stays submitted. It is now an index, and Google reads the four parts from it.
2. Optionally also submit `sitemap-articles.xml`, `sitemap-hubs.xml`, `sitemap-tools.xml` and `sitemap-pages.xml`, to see indexing counts per part.
3. Check the old single sitemap is not reported as an error the next day. The URL is the same, so it should not be.
4. In Bing Webmaster Tools, do the same. IndexNow pings on publish are unchanged.

## Useful commands

| Command | What it does |
|---|---|
| `npm run check:content` | Checks the data files agree (no network) |
| `npm run validate:schema` | Builds and checks all JSON-LD (`-- --no-build` to skip the build) |
| `npm run audit:reviewers` | Rewrites `reviewer-mismatch.csv` |
| `npm run check:hub-keywords` | Rewrites `hub-keyword-check.csv` |
| `SHOW_UNREVIEWED=1 npm run build` | A local production build that shows the drafts, as preview does |
| `CONTENT_HEALTH=1` | Turns on `/internal/content-health/` |
