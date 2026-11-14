# Phase 1 report

Branch `feat/condition-hubs-and-conversion`. Local only: not pushed, not deployed, nothing changed in Supabase or Directus.

## What changed

| Task | Where | Notes |
|---|---|---|
| 1.1 JSON-LD | `lib/jsonld.ts`, `scripts/validate-schema.mjs` | Added `about` → `MedicalCondition` (name, alternateName, relevantSpecialty) and publisher `legalName` ParentWise Private Limited. Article, MedicalWebPage, FAQPage, BreadcrumbList, Person and WebApplication already existed. `npm run validate:schema` builds and checks 153 pages and 180 blocks. |
| 1.2 Article fields | `content/article-meta.json`, `lib/article-meta.ts` | One entry per slug: cluster, condition, role, sensitivity, red_flags, red_flags_reviewed, cta, hinglish_pair, english_pair, reviewer_specialty_required. 78 published plus 15 planned slugs. |
| 1.3 Breadcrumbs, Read next | `lib/article-context.ts`, `components/reads/ClusterListing.tsx`, `app/[stage]/[page]/page.tsx` | Trail is Reads / Stage / Cluster / Title. Cluster lists at `/<stage>/<cluster>/`: 21 exist today. A list with fewer than 3 reads is `noindex, follow` and left out of the sitemap. "Read next" ranks condition, then cluster, then stage. |
| 1.4 Contextual cards | `lib/cta.ts`, `components/reads/ArticleCards.tsx` | Article, then condition, then cluster, then stage (stage only when there is no cluster). One card in the side rail on wide screens, all cards after the article. The waitlist band shows only when no card fits. |
| 1.5 Red-flag card | `components/reads/RedFlagCard.tsx` | First thing in the article grid: above the contents list on phones, top of the body column on desktop. Hidden in production until `red_flags_reviewed` is true. |
| 1.6 Sensitive mode | article page, `PostBody` | When the article or its condition is `high`: Amazon links render as plain text with no tag and no disclosure, the waitlist and newsletter band is hidden, and a "Talk to someone" card shows. The disclaimer and references are unchanged. |
| 1.7 Reviewer report | `scripts/reviewer-audit.mjs`, `lib/authors.ts` | Each expert now has `specialty` from their own stated role. `npm run audit:reviewers` writes `reviewer-mismatch.csv`: 76 of 78 published articles are flagged. |
| 1.8 Sitemaps | `app/sitemap.xml` (index), `app/sitemap-{articles,hubs,tools,pages}.xml`, `lib/sitemaps.ts` | `/sitemap.xml` keeps its address and is now the index. `lastmod` is the later of modified and last reviewed. Both publish webhooks rebuild all five. |

Also added: `npm run check:content`, which checks the data files agree (cluster and month slug clashes, unknown clusters, conditions, tools and specialties, and no em or en dashes).

## Where the values came from

- **cluster, sensitivity, reviewer_specialty_required:** matched each live article to its row in the publishing plan sheet ("ParentVeda_SEO_Plan_for Kamini.xlsx") by title. 68 matched at 0.95 or higher. Of the 10 weaker matches, I checked 7 by hand and kept them (for example `toddler-speech-delay` and `developmental-red-flags`). I corrected 3 by hand: `what-to-expect-when-youre-expecting-summary`, `improve-sperm-count` and `heartburn-acidity-pregnancy`. Six sheet rows (the recipes, research and book summaries, and two FAQ posts) had no sensitivity or reviewer, so I set them to low and the obvious specialty.
- **Sensitivity mapping:** Standard = low, Medical-urgent = medium, Emotional = high.
- **role:** pillar if the slug is in the menu pillars (`lib/pillars.ts`) or is the main article for a condition (ectopic-pregnancy, high-risk-pregnancy, azoospermia, placenta-previa). `delivery-ke-baad-pet-kaise-kam-kare` is `hinglish`. Everything else is a spoke.

## What I could not infer (team to decide)

1. **condition** is set on only 14 articles, where the topic is plainly the condition. The rest are null. Ones worth a look:
   - `twin-pregnancy` (high-risk-pregnancy?)
   - `hyperemesis-gravidarum` (no hub exists)
   - `ivf-process`, `egg-retrieval-pain` (failed-ivf is the only IVF hub)
   - `pcos-*` (no PCOS hub)
   - `preconception-tests-india` (thalassemia-minor?)
2. **Ectopic is filed under "TTC > After a loss"**, as in the sheet. So its breadcrumb is Reads / Trying to conceive / After a loss, though its content stage is pregnancy. Change it in `content/article-meta.json` if you prefer "Pregnancy > Complications".
3. **Read next for ectopic** now shows other TTC reads (azoospermia, PCOS, the preconception checklist), no longer NIPT and placenta. The reads you want there (pregnancy after ectopic, blocked tubes, miscarriage) are not published yet. They will rank first automatically once their meta entry names the same condition or cluster.
4. **Cross-stage clusters** ("Partners & fathers", "Relationships & family") are filed under Parenting for their list URL. No live article uses them yet.
5. **Kids 5-12 clusters** sit under `/parenting/kids-*/`, because the site has no Child stage.
6. **Hinglish pair:** `delivery-ke-baad-pet-kaise-kam-kare` has no English pair recorded.
7. **Prices:** the app also has a genetic counselling consult at ₹999. The plan listed only three prices, so `genetic-counselling` shows "Price on request" until you confirm.
8. **The gynaecologist consult text** is the app's TTC wording (cycles, PCOS, pre-conception check). Pregnancy hubs also route to `gynaecologist`. Decide whether pregnancy needs its own consult entry.

## What readers will see differently once this ships

- New breadcrumbs, and new "Read next" choices on every article.
- The week calculator card no longer appears on unrelated pages. Articles in clusters without a tool (for example Breastfeeding and Potty training) now show the app waitlist band, as before.
- Sensitive pages (ectopic, azoospermia, developmental red flags, and any article whose condition is high sensitivity) lose shop links and the waitlist band, and gain the "Talk to someone" card.
- No red-flag card yet: they are waiting for review.
