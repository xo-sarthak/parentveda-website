# Website upgrade: repo audit

Written 15 Nov 2026 on branch `feat/condition-hubs-and-conversion`. Nothing has been built yet. Nothing is pushed, merged or changed in Supabase, Directus or Vercel.

Inventory numbers come from a read-only query of published rows with the public anon key.

## 1. What the repo is

| Area | What I found |
|---|---|
| Framework | Next.js 16.3 App Router, React 19.3, TypeScript. `trailingSlash: true`. `proxy.ts` (the renamed middleware) runs only on `/portal`. |
| Hosting | Vercel. Merging to `main` deploys parentveda.in. One cron: `/api/release/` at 9am IST publishes queued Reads. |
| Styling | Plain global CSS files in `app/` (`site.css`, `articles.css`, `tools.css` and others). No Tailwind, no component library. |
| Tests and lint | **No test setup and no lint script.** The only checks are `npm run typecheck` and `npm run build`. |
| Dependencies | Small: Supabase clients, `marked`, `react-markdown`, `remark-gfm`, `lenis`. No form, chart or analytics libraries. |

## 2. How articles are stored (this changes Phase 1.2)

**There is no frontmatter.** Articles are rows in the Supabase table `content_posts`, edited in Directus. The app reads the same table. `lib/guides.ts` maps a row to `GuidePost`. `content/articles/*.md` holds 8 old files that are parked and never served.

- 78 published: 70 `articles`, 2 each of `recipes`, `research-summaries`, `book-summaries`, `parenting-faq`.
- Columns: id, status, category, slug, title, description, excerpt, author, author_slug, reviewed_by, reviewed_at, reading_time, tags, stage, trimester, week_tag, verdict, recipe, source, book_meta, meta_title, og_image, og_image_alt, og_image_file, hero_file, hero_image, canonical_path, published_at, updated_at, created_at, body.
- `stage` has three values: `ttc` 17, `pregnancy` 40, `parenting` 21. The plan's stages (TTC, Preconception, Pregnancy, Parenting 0-5, Child) do not exist as data. The site also has a fourth stage page, `/skilling`.
- URLs are `/reads/<category>/<slug>/`, so almost every article is `/reads/articles/<slug>/`.
- `updated_at` drives the sitemap `lastmod` and `dateModified`. Any bulk SQL must not move it.

**Decision needed (A): where the new article fields live.** `cluster`, `condition`, `role`, `sensitivity`, `red_flags`, `cta`, `hinglish_pair`, `english_pair`, `reviewer_specialty_required`.

- **Option 1 (my recommendation): a data file in this repo**, `content/article-meta.ts`, keyed by slug. No database change, nothing for the app to absorb, `updated_at` is never touched, and it can be built and tested on this branch without going near production. The cost: the content team edits a file in Git, not a field in Directus.
- Option 2: new columns on `content_posts`. Editable in Directus, but it changes a table the app also reads, the migration belongs in the app repo, and the SQL must guard `updated_at`. I would only write the SQL file; you would run it.

I can start with Option 1 and move the fields into Directus later without changing any page code.

## 3. Mapping each phase onto the code

### Phase 1

**1.1 JSON-LD.** Not missing. `lib/jsonld.ts` and `components/JsonLd.tsx` already emit:
- `Article` plus `MedicalWebPage` (only when a reviewer is credited), with `reviewedBy`, `lastReviewed`, author `Person`, publisher, image and dates.
- `FAQPage` from the same "Common questions" section the accordion renders (`splitFaqSection`). 68 of 78 published posts have one.
- `BreadcrumbList`, `Person` on author pages, `Organization` plus `WebSite` plus `SoftwareApplication` on the home page, `Recipe`.

What is left: `about` to `MedicalCondition` once `condition` exists; publisher `legalName` ParentWise Private Limited (it is on the home page `Organization` only); `MedicalWebPage` for hubs; `WebApplication` for tools (tools have no schema today); and the validation script. Note for the team: Google shows FAQ rich results only for a small set of authoritative government and health sites, so FAQ schema helps understanding and is not a promise of snippets.

**1.2 Article fields.** See decision A. Values I can infer safely from slug, tags and stage: `condition` for spokes that clearly belong to a seed hub, `cluster` for most, `role` for the pillars already listed in `lib/pillars.ts`. I will list everything I could not infer.

**1.3 Breadcrumbs and Read next.**
- **URL conflict (decision B).** `/reads/<stage>/<cluster-slug>/` cannot be used. `app/reads/[category]/[slug]/` already owns that shape, so `/reads/pregnancy/complications/` would be read as an article called "complications" in a category called "pregnancy" and return a 404. I suggest `/<stage>/<cluster-slug>/`, for example `/pregnancy/complications/`. Since commit 7c173be, `app/[stage]/[page]/page.tsx` already owns that shape for the pregnancy month pages (`/pregnancy/month-by-month/`, `/pregnancy/1st-month/` to `/pregnancy/9th-month/`), with `dynamicParams = false`. Cluster pages would be added to the same route's list, with a build check that no cluster slug clashes with a month slug. The other choice is `/reads/topics/<stage>/<cluster-slug>/`, which avoids sharing a route. Article URLs do not change either way.
- **Why ectopic shows NIPT and placenta today:** `getRelatedPosts` in `lib/guides.ts` ranks by shared tags. Ectopic is tagged `first trimester`, so every first-trimester scan article outranks it. The new ranking is condition, then cluster, then stage, with pillars preferred.
- The "Part of the guide" box goes in `app/reads/[category]/[slug]/page.tsx`, hidden until the hub is published.

**1.4 Contextual CTA.** Two things on every article today:
- Tool cards from `toolsForPost` in `lib/tools.ts`, which uses regex matching. The week calculator matches `trimester`, `scan` and `ultrasound`, so it lands on almost every pregnancy page, including ectopic.
- `CtaBand` at the bottom, which is the "Coming soon to Google Play" waitlist box (`components/Waitlist.tsx`, writes to Supabase `waitlist_signups`).

Both get replaced by one resolver: article `cta`, then condition, then cluster, then stage, then waitlist.

**1.5 Red-flag card.** Of the 16 slugs, **only `ectopic-pregnancy` is published.** The other 15 get entries ready for when they publish. The card goes between the summary and the body. The article page has no separate summary block; the description sits in the header, and the table of contents is a side rail, not part of the body.

**Decision C:** the bullets are medical claims. I suggest the card shows only after a doctor signs off the bullets (a `reviewed` flag, like the tools). Until then it shows nothing, rather than unreviewed bullets. The alternative is to show only the fixed line "Call 108 or go to the nearest hospital" until review.

**1.6 Sensitive mode.** Affiliate links are inside article bodies (`lib/affiliate.ts`) with a disclosure line. "Hide affiliate blocks" on a sensitive page will mean rendering those links as plain text without the tag and dropping the disclosure. That does not change the article text. There are no popups apart from the cookie banner, which has to stay.

**1.7 Reviewer specialty.** People are in `lib/authors.ts` (`kind: "expert"`, `specialties[]`, `registration?`). The `content_authors` table only exists for the foreign key. **68 of 78 published posts name one reviewer, Dr. Mahender Singh, a paediatrician and neonatologist, including all 17 TTC and 30 pregnancy articles.** The other 10 pregnancy posts have no reviewer. The report will flag at least those 47 as mismatches. It is a report only. Other experts with fertility, obstetric and fetal medicine specialties are in `lib/authors.ts` but have not reviewed any article.

**1.8 Sitemaps.** One file today, `app/sitemap.ts` (which since 7c173be also lists about 290 is-it-safe, baby-name and month pages; those go in `sitemap-tools.xml` and `sitemap-pages.xml`), served at `/sitemap.xml`, which Search Console and `robots.ts` already point to. `/api/revalidate` and `/api/release` both call `revalidatePath("/sitemap.xml")`. Next 16's `generateSitemaps` serves `/sitemap/<id>.xml` and does not write an index. So the plan is route handlers: `/sitemap.xml` becomes the index, plus `/sitemap-articles.xml`, `/sitemap-hubs.xml`, `/sitemap-tools.xml`, `/sitemap-pages.xml`, and both revalidate calls are updated. `lastmod` already uses `updated_at`. It will use `reviewed_at` when that is later, but `reviewed_at` is empty on every row today.

### Phase 2

**2.1 Hubs.** New `content/conditions/<slug>.ts` files plus an index, and the route `app/conditions/[slug]/` plus `app/conditions/`. All 43 (17 P1, 26 P2) seeded with `published: false`.
- The menu has no mega-menu columns. `components/Header.tsx` shows one "Start here" list per stage from `lib/pillars.ts`. "Conditions" will be a second group in that dropdown and in the mobile sheet.
- Articles by condition today: a quick tag check finds published spokes for high-risk-pregnancy, azoospermia, thalassemia, speech-delay, placenta-previa, ectopic and down-syndrome screening. **Most P1 hubs have fewer than 3 published articles**, so the rule "fewer than 3 stays unpublished" will keep most of them off for now.
- The hub stage must map onto the three content stages (decision D below).

**2.2 Consult block.** No consult path exists on the web. Existing patterns to reuse: `app/api/contact/route.ts` (honeypot, timing check, in-memory rate limit, Resend email), and the Waitlist server action. `RESEND_API_KEY` and `CONTACT_FROM_EMAIL` already exist for the confirmation email. The in-memory rate limit is per serverless instance, so it only approximates. A shared store would be an upgrade later.

**2.3 Downloads.** New config and component. Cards stay hidden while `file` is null.

**2.4 Expert profiles.** `lib/authors.ts` already has `specialties[]`, `qualifications`, `registration` (council name as free text), `languages`, `experience`. It lacks `registration_number`, `takes_consults` and `conditions[]`. Profiles render at `/reads/authors/<slug>/`; the directory is `/experts/`.

**2.5 Trust pages (decision E).** `/legal/editorial-policy/` and `/legal/affiliate-disclosure/` already exist and are live. A second editorial policy at `/editorial-policy/` would compete with the first. I suggest:
- extending the existing editorial policy in a draft branch, not adding a new URL;
- adding the three new pages under `/legal/` (`/legal/medical-review-policy/` and so on) so they match. They will be `noindex`, left out of the sitemap and footer, and marked DRAFT until you clear them.

**Privacy policy.** It currently says "we do not ask for your name, your phone number or your due date to sign up". The consult and download forms collect name, phone and a condition. That is sensitive personal data under DPDP. **The privacy policy has to be updated before those forms go live.** I will draft the change for the legal review; I will not change the live policy.

### Phase 3: tools

There are 9 existing tools in `lib/tools.ts` (the weeks-to-months tool arrived in 7c173be) plus `components/tools/` (`ToolShell`, `SubShell`, `ui.tsx`), all client-side with no libraries. Reference data already sits in `lib/*.json` (`who-growth.json`, `weeks.json`, `pregnancy-months.json`). The JSON files copied from the app are written by `scripts/sync-from-app.py` and are never edited by hand; the new tool reference files are this site's own and are kept separate from them. The 8 new tools follow that pattern, with reference values in `lib/tools-reference/<slug>.json` and `reviewed: false`. The `reviewed` gate uses `VERCEL_ENV === "production"`, so preview deployments work normally.

### Phase 4: Hindi and Hinglish

- **No published article contains Devanagari.** The Hindi audit will be short.
- One Hinglish article: `delivery-ke-baad-pet-kaise-kam-kare` (Roman script), with no English pair recorded.
- `<html lang="en-IN">` is set in `app/layout.tsx` for every page. A per-page `lang` on the root needs a layout change, so `lang="hi-Latn"` will go on the article wrapper.
- There is no read-aloud feature, so nothing to adapt.
- hreflang: Google documents language plus region codes and does not document script subtags like `hi-Latn`. I will not add hreflang.

### Phase 5: analytics

GA4 loads only after consent (`components/Analytics.tsx`) and is off until `NEXT_PUBLIC_GA_MEASUREMENT_ID` is set. It is not set in `.env.local`. Only `affiliate_click` is sent today. New events go through one helper that only accepts slugs and categories, so a health value cannot be passed by mistake. DebugView checks need the ID set and a preview deploy, which I will not do without asking. The content-health page goes behind an env flag, `noindex`, and `/internal/` is added to `robots.ts`.

## 4. Decisions I need before Phase 1

| | Question | My suggestion |
|---|---|---|
| A | Where new article fields live | Repo data file now, Directus later |
| B | Cluster list URLs | `/<stage>/<cluster-slug>/` |
| C | Red-flag bullets before doctor review | Hidden until reviewed |
| D | Stage mapping | Preconception goes under TTC; Parenting 0-5 and Child go under Parenting |
| E | Trust page URLs | Extend `/legal/editorial-policy/`; new pages under `/legal/` |

## 5. Inputs from the team (blocked until supplied)

| Input | Where it plugs in | Without it |
|---|---|---|
| Two webhook URLs: consult requests and download leads (a Google Sheet Apps Script works) | `CONSULT_WEBHOOK_URL`, `LEADS_WEBHOOK_URL` in Vercel | Forms build and test locally but show "not connected yet" and store nothing |
| AMH reference values by age, from a fertility specialist | `lib/tools-reference/amh-reader.json` | AMH tool shows "being reviewed" in production |
| The nine PDFs | `downloads` config `file` paths | Download cards stay hidden |
| Each reviewer's specialty and registration number | `lib/authors.ts` | Mismatch report uses `specialties[]` text; no "Reg. no." shown |
| Consult prices beyond the three from the app | `consults` config | Shows "Price on request" |
| Legal check of trust pages and the privacy update | `/legal/` drafts | Pages stay noindex and unlinked; consult and download forms stay off |

Also needed before any of this ships: a doctor's sign-off on every `// MEDICAL-REVIEW` item.

## 6. How this work stays off the live site

- All work stays on this local branch. No push, no merge, no preview deploy unless you ask.
- No SQL is run and no Directus or Vercel setting is changed.
- New pages ship with `published: false` or `noindex`, and forms stay off until their env variables are set.
