# Publishing log

Errors found while publishing Reads, and how each one was solved. Add new entries at the top. Do not put secrets or keys in this file.

Status: **Solved**, **Open** (still needs action) or **Accepted** (known and left as it is, with the reason).

---

## 14 Nov 2026: rows 46, 47 and 48 (first batch through the daily release)

**Published**

| Sheet row | Article | Live address | Reviewer shown |
|---|---|---|---|
| 46 | The Anomaly Scan (TIFFA) | `/reads/articles/anomaly-scan-tiffa/` | Dr. Mahender Singh |
| 47 | Foods to Increase Breast Milk | `/reads/articles/foods-increase-breast-milk/` | Dr. Mahender Singh |
| 48 | Low-Lying Placenta | `/reads/articles/low-lying-placenta/` | Dr. Mahender Singh |

Created in Directus as `scheduled` with `published_at` set to the planned day, then published by `/api/release` (Vercel cron, run by hand from Vercel for this first test). The owner confirmed Dr. Singh's review covers all future rows from the sheet. Images were converted to JPEG and uploaded through Directus to R2. Queue order from here: rows 49 to 76, then 103 onwards, three a day.

### Open

| # | Problem | Effect | What to do |
|---|---|---|---|
| 1 | Row 48's article text is an older draft. Its Part B notes describe a final round against RCOG 2026 (birth planning by distance band, previa as "reaches or covers", the 2019 RCOG reference dropped) that is not in the article text. | What is published is not wrong, but it is not the writer's final version. | Ask the writer for the final file and update the article. |
| 2 | Row 46 has no reference list; the doc names NHS, NICE and FOGSI only in general terms. | The page cites no sources. | Ask the writer for the references. |
| 3 | Row 48's diagram draws the 20-week placenta mid-wall, not near the cervix, though its labels are right. | Minor. | Regenerate if wanted. |
| 4 | The sheet asks for an OB-GYN reviewer on rows 46 and 48 and a nutritionist on row 47; Dr. Singh is a paediatrician. Row 48 keeps "review by an obstetrician-gynaecologist is in progress". | Weaker trust signal on pregnancy topics. | Add the right specialists when onboarded. |
| 5 | FOGSI's PDF (row 48, reference 1) sits behind a bot check and was not opened. | A broken one would be a dead reference. | Open it in a browser. |

### Solved

| # | Problem | How it was solved |
|---|---|---|
| 6 | Rows 46 and 61 link to the same doc. | Published once as row 46. Skip row 61. |
| 7 | Row 47 twice pointed to "our guide on low milk supply", which does not exist. | Removed both mentions; linked its cluster feeding mention to `cluster-feeding`. |
| 8 | Row 47 had no reference list, though it cites the Academy of Breastfeeding Medicine. | Added ABM Protocol #9 (2018), confirmed through Crossref. |
| 9 | Row 48's MoHFW 2010 guideline link on nhmodisha.gov.in returns 404. | Pointed it to the same April 2010 document on nhm.gov.in, checked page by page. |
| 10 | The docs suggested slugs (`anomaly-scan`) that differ from the ones other sheet rows link to. | Used the sheet's: `anomaly-scan-tiffa`, `foods-increase-breast-milk`, `low-lying-placenta`. |
| 11 | Docs carried bylines, SEO packs, validation tables, change logs and tracker rows. | Left all of it out. |

### Solved: tools and checks

| # | Problem | How it was solved |
|---|---|---|
| 12 | The Google Drive connector timed out for hours. | Waited; reading as text (`read_file_content`) worked first, downloads after. |
| 13 | Chrome actions went to a second connected browser (a Mac) that was not signed in to Directus. | Selected the Windows browser with `select_browser`. |
| 14 | Directus on Render's free plan sleeps and signs everyone out on wake. | Release runs from Vercel, not a Directus Flow. Setting a fixed `SECRET` on Render should keep logins (not yet done). |
| 15 | Directus's database user cannot change column defaults. | The owner ran the default-to-draft SQL in Supabase. |
| 16 | A page fetched while still unpublished served a cached 404 once after release. | Cleared on the next request. Avoid fetching scheduled pages before release. |

---

## 11 Nov 2026: rows 100, 101 and 102 (first batch through Directus)

**Published**

| Sheet row | Article | Live address | Reviewer shown |
|---|---|---|---|
| 100 | Cluster Feeding and the Witching Hour | `/reads/articles/cluster-feeding/` | Dr. Mahender Singh |
| 101 | Breast Engorgement, Cracked Nipples and Mastitis | `/reads/articles/breast-engorgement/` | Dr. Mahender Singh |
| 102 | Sore and Cracked Nipples While Breastfeeding | `/reads/articles/cracked-nipples/` | Dr. Mahender Singh |

Created, published and given images entirely in Directus, with no images commit. Uploads go to the `parentveda-media` R2 bucket, and the site serves them at `/cms-media/<file id>/` with a read-only R2 token (`lib/cms-media.ts`, `lib/r2.ts`, variables in `.env.example`). The owner confirmed Dr. Singh reviewed these three and the six 9 Nov articles; `reviewed_by` was set on all nine through Directus. How to Breastfeed now links to all three, as the sheet asks.

### Open

| # | Problem | Effect | What to do |
|---|---|---|---|
| 1 | The app's `cms_sync_media` trigger (app repo, migration `0155_panel_can_publish.sql`) copies each Directus upload into a link column as a public `pub-4fb3649b….r2.dev` address, so `parentveda-media` has public r2.dev access on. | The website no longer uses those links (commit `7edba1c` serves them through `/cms-media/`). The app does, and r2.dev is rate-limited. | Keep r2.dev access on: turning it off blanks app images. Before the app launches, move it to a custom domain or to the website's `/cms-media/` route (app repo `docs/BEFORE-LAUNCH.md`). |
| 2 | Row 101's cover shows the baby asleep on an adult bed. | Same safe-sleep question as row 95's cover. | Owner to decide. |
| 3 | Row 102's flowchart says "lipstick-shaped", a phrase the writer removed from the text for plagiarism. | Minor. | Regenerate if wanted. |
| 4 | All three disclaimers say lactation consultant review is in progress. | Goes out of date once done. | Remove then. |
| 5 | Directus cannot edit `tags` (Postgres `text[]`, shown as unknown), and `reviewed_by` is free text. | Tags must be sent as `{"a","b"}`; a typo in a reviewer slug shows no reviewer. | Make both proper fields. |

### Solved

| # | Problem | How it was solved |
|---|---|---|
| 6 | Row 100 linked to Combination Feeding, which is not live (IMS Act check). | Removed that one link sentence. |
| 7 | Row 101 linked to `/reads/articles/breast-milk/`, which does not exist. | Removed that link sentence. |
| 8 | Rows 101 and 102 asked to link to each other once both were live. | Added one link each way. |
| 9 | Row 101's first table had its headings shifted one column, and used "diapers". | Fixed the headings; changed to "nappies", as the writer flagged. |
| 10 | The docs suggested slugs that differ from the ones other sheet rows link to. | Used the sheet's: `cluster-feeding`, `breast-engorgement`, `cracked-nipples`. Writers' titles as H1, sheet titles as Title for Google. |
| 11 | Four references (MDPI, two Liebert DOIs, Cochrane) returned 403 to `curl`. | Confirmed all three DOIs through Crossref; the MDPI paper resolves there too. |
| 12 | Chrome could not read a localhost server from the Directus page. | Handed the files to a temporary file input in the page instead. |

---

## 9 Nov 2026: rows 51, 65, 97, 98, 99 and 106

**Published**

| Sheet row | Article | Live address | Reviewer shown |
|---|---|---|---|
| 51 | Pregnancy Diet Chart (Indian) | `/reads/articles/pregnancy-diet-chart/` | None |
| 65 | PCOS Treatment | `/reads/articles/pcos-treatment/` | None |
| 106 | Piles During Pregnancy | `/reads/articles/piles-during-pregnancy/` | None |
| 97 | Gas and Bloating During Pregnancy | `/reads/articles/gas-bloating-during-pregnancy/` | None |
| 98 | Papaya in Pregnancy | `/reads/articles/papaya-during-pregnancy/` | None |
| 99 | PCOS Diet and Insulin | `/reads/articles/pcos-diet-insulin/` | None |

Rows 97 to 99 were next in the sheet. They link to rows 51, 65 and 106, which were written but not live, and rows 97 and 106 link to each other, so all six went out together. Images commit: `1cb02b7`, pushed from a clean worktree of `origin/main` so that the unpushed local commit `f857129` (tools redesign) and the uncommitted tools work were not deployed. Article rows added to `content_posts` directly. All six checked live: H1, title, canonical, tables, both images, and no leftover notes.

### Open

| # | Problem | Effect | What to do |
|---|---|---|---|
| 1 | No reviewer is shown on any of the six. The docs give Dr. Singh only as interim or pending (rows 51, 97, 99, 106), name nobody (row 98), or say he does not fit (row 65, which needs an OB-GYN). The owner did not confirm a review. | The pages make no review claim. | Set `reviewed_by` only once a reviewer has actually reviewed the article. |
| 2 | The six were not in the sitemap right after publishing, and IndexNow was not pinged, because direct inserts do not call `/api/revalidate`. | Search engines have not been told about them yet. | Save each article once in Directus, then recheck the sitemap. |
| 3 | Row 99's FOGSI figures are unchecked: 2 to 5% weight loss, 150 minutes a week with strength work on two days, and a larger breakfast for lean PCOS. Row 97's FOGSI iron line is unchecked too. FOGSI blocks `curl` and WebFetch, and Firecrawl had no credits. | Each may be right. | Open the FOGSI PDFs in a browser. |
| 4 | Not opened from this connection: Mayo Clinic, Cereal Chemistry, ScienceDirect, the Monash link and two PubMed pages. | A broken one would be a dead reference. | Open them in a browser. |
| 5 | Row 94 had its `pregnancy-diet-chart` line removed on 6 Nov because the page was not live. It is live now. | A useful link is missing. | Re-add it if the owner wants. |
| 6 | The papaya FAQ `/reads/parenting-faq/can-i-eat-papaya-during-pregnancy/` targets the same keyword as row 98. | Two pages may compete in search. | Add a link from the FAQ to the new article. Keep the FAQ's address. |
| 7 | Rows 99 and 106 keep "specialist review in progress" in the disclaimer, as row 94 does. | It goes out of date once the reviews are done. | Remove it at that point. |
| 8 | Row 106's cover includes an anatomical close-up of piles. It also appears in listings and social shares. | Some readers may find it too graphic. | Owner to decide whether to replace it. |

### Solved: content

| # | Problem | How it was solved |
|---|---|---|
| 9 | Rows 97, 98 and 99 linked to pages that were not live yet (piles, diet chart, PCOS treatment). | Published those three pages in the same batch, with the owner's agreement, so no sentences were cut. |
| 10 | Row 99 said the food-order evidence was "one small study". The writer's own flag says this is inaccurate. | Used the writer's wording, "small studies in adults with type 2 diabetes or prediabetes", and "In those studies", with the owner's approval. |
| 11 | Row 99 said "Most doctors worldwide follow the 2023 International PCOS Guideline", which has no source. | Changed it to "The 2023 International PCOS Guideline is a widely used reference", with the owner's approval. |
| 12 | Row 97 linked to `/reads/articles/pregnancy-symptoms/`, which returns 404. | Pointed it to `pregnancy-symptoms-month-by-month`, which has the same title. |
| 13 | Row 97's ICMR link (DGI24thJune2024fin.pdf) and the NHS pre-eclampsia `/symptoms/` page return 404. | Used `DGI_2024.pdf`, as other Reads do, and `nhs.uk/conditions/pre-eclampsia/`. |
| 14 | Row 97's spice table and row 98's ripeness table had an empty first heading. | Labelled them "Spice" and "What changes". |
| 15 | Row 65's byline had `[Name, Degree]`, `[Registration No.]` and `[Date]` placeholders, and a stray full stop in "The treatment. approach". | Left out the byline, as for all Reads, and removed the stray full stop. |
| 16 | Row 51's text mentions iron from plant foods, and the writer listed the iron article as "add when live". | Linked it to `iron-rich-foods-during-pregnancy`, which is live. |
| 17 | The addresses suggested in the docs (`gas-during-pregnancy`, `papaya-in-pregnancy`, `pcos-diet`) differ from the ones other sheet rows link to. | Used the addresses the sheet links to: `gas-bloating-during-pregnancy`, `papaya-during-pregnancy`, `pcos-diet-insulin`, `pregnancy-diet-chart`, `pcos-treatment` and `piles-during-pregnancy`. |
| 18 | The docs contained Part B and C notes, link sheets, validation tables and reviewer bios. | Left all of it out of the published articles. |

### Solved: tools and checks

| # | Problem | How it was solved |
|---|---|---|
| 19 | `origin/main` had moved on (PR #4, social profiles) since local `main` was last updated. | Built the images commit on top of it, so the push was a fast-forward. |

---

## 6 Nov 2026: rows 94, 95 and 96

**Published**

| Sheet row | Article | Live address | Reviewer shown |
|---|---|---|---|
| 94 | Iron-Rich Foods During Pregnancy | `/reads/articles/iron-rich-foods-during-pregnancy/` | Dr. Mahender Singh |
| 95 | Delivery Ke Baad Pet Kaise Kam Kare | `/reads/articles/delivery-ke-baad-pet-kaise-kam-kare/` | Dr. Mahender Singh |
| 96 | Foods to Avoid During Pregnancy | `/reads/articles/foods-to-avoid-during-pregnancy/` | Dr. Mahender Singh |

Images commit: `423b446`. Article rows added to `content_posts` directly. The owner confirmed that Dr. Singh reviewed all three. `reviewed_at` is empty because no review date was supplied.

### Open

| # | Problem | Effect | What to do |
|---|---|---|---|
| 1 | Vercel's Security Checkpoint began returning 403 to this connection, on every address including the sitemap and images. Repeated polling is the likely trigger, but that is not confirmed, and neither is whether other visitors or search engines are affected. | Live checks from this connection stopped. If it is site-wide, real visitors would see it too. | Open the site on another network, such as mobile data, and check Vercel's Firewall page. Do not try to get around the challenge. Poll less often in future. |
| 2 | The three articles were not seen in the sitemap during 20 minutes of checks. The challenge may have blocked some of those checks, so this is inconclusive. | They may not be submitted to search engines yet. | Recheck the sitemap once the challenge has cleared. |
| 3 | IndexNow was not pinged, because direct database inserts do not call `/api/revalidate`. | Bing and others were not told about the three pages. | Save each article once in Directus. |
| 4 | Two reference links could not be confirmed: the Lok Sabha answer on eparlib.sansad.in (row 94, connection refused) and the BMJ study page (row 95, 403). | Each may be fine. A broken one would be a dead reference. | Open both in a browser. |
| 5 | Row 94's "Specialist review in progress" line stays in the disclaimer, at the owner's request. | It is true today and goes out of date once the review is done. | Remove it when the dietitian and OB-GYN reviews are complete. |
| 6 | The sheet's image links for row 96 return "not found". The images used came from the same Drive folder with matching titles. | The sheet points to files that cannot be opened. | Update the links, and confirm these are the intended images. |
| 7 | Row 95's sheet title and keyword do not match: the title is about reducing the belly, but the keyword is "delivery ke baad kya khaye" (what to eat). The article follows the title. | The page may not rank for the sheet's keyword. Row 92 already covers postpartum food. | Correct the keyword in the sheet. |

### Accepted

| # | Item | Reason |
|---|---|---|
| 8 | Row 95's cover appears to show a baby sleeping on a pillow on an adult bed. | Flagged for the owner, because the picture may conflict with safe-sleep advice. Replacing it means making a new image. |
| 9 | Row 94 labels bajra and ragi as flour, while IFCT lists them as "Bajra" and "Ragi". | Left as written. The iron values match. Flagged for the dietitian review. |
| 10 | Row 94's Insight says the body builds blood "faster than any plate can supply". The 2024 guidelines do not say this directly. | Not part of the approved wording changes. Flagged for the dietitian review. |
| 11 | Row 94's cover shows a glass of beetroot juice, while the article says beetroot holds much less iron than other foods. | Minor. The article does not call it harmful. |

### Solved: content

| # | Problem | How it was solved |
|---|---|---|
| 12 | Row 94's doc said the 16 chart values were unverified because the writer could not open IFCT 2017. | Downloaded the PDF and compared every value against Table 5. All 16 match. |
| 13 | Row 94's chana value of 6.08 mg is IFCT's figure for Bengal gram dal, not whole chana (6.78 mg). | Relabelled the row "chana dal", with the owner's approval. |
| 14 | Row 94 said even a balanced diet cannot provide all the iron needed. The 2024 guidelines say a balanced diet can meet most nutrient needs, and advise daily IFA tablets. | Reworded the sentence and the matching takeaway, with the owner's approval. |
| 15 | Row 94 linked to two pages that are not live: `anemia-in-pregnancy` and `pregnancy-diet-chart`. | Removed both lines, with the owner's approval. |
| 16 | Row 95's C-section table had its headings shifted one column. | Fixed the headings and checked the live table. |
| 17 | Row 95 mentioned a C-section guide without linking to it, and its notes said some linked pages were not live. | Linked `c-section-recovery`, which is published in the database. The diastasis and postpartum links return 200. The C-section page itself was not opened before the challenge began. |
| 18 | Row 96's doc suggested `foods-to-avoid-during-pregnancy-indian`, but the sheet's row 98 links to the address without `-indian`. | Used `foods-to-avoid-during-pregnancy`, with the owner's approval. |
| 19 | The docs contained internal notes, schema drafts, placeholders for review dates and registration numbers, and reviewer bios. | Left all of it out of the published articles. The site shows the reviewer from its own data. |

### Solved: tools and checks

| # | Problem | How it was solved |
|---|---|---|
| 20 | A link check using `curl -k` was blocked because it turned off certificate checks. | Reran it with normal verification. `-k` should not be used. |
| 21 | The three FDA and one CDC reference returned 404 or 403 to `curl`. | Opened them with WebFetch, and all four loaded. The CDC page confirms the 330 to 400 kcal figure. |
| 22 | The first searches for IFCT values found nothing, because minerals are in Table 5, and some rows split across lines or pages. | Read each row from Table 5 by food code. |

---

## 6 Nov 2026: rows 84 and 88

**Update:** the images deploy for rows 94 to 96 refreshed the sitemap, and rows 84 and 88 then appeared in it (`X-Vercel-Cache: MISS`). Item 1 below is solved for these two rows, but the deploy did not explain why the 60-second refresh failed. Item 2, IndexNow, is still open.

**Published**

| Sheet row | Article | Live address | Reviewer shown |
|---|---|---|---|
| 84 | Pumping Breast Milk at Work | `/reads/articles/pumping-breast-milk-at-work/` | Dr. Mahender Singh |
| 88 | The IVF Process Step by Step | `/reads/articles/ivf-process/` | Dr. Mahender Singh |

Images commit: `6f77058`. Article rows added to `content_posts` directly.
`reviewed_at` is empty because no review date was supplied, so "Last reviewed" falls back to the publish date.

### Open

| # | Problem | Effect | What to do |
|---|---|---|---|
| 1 | The live sitemap did not pick up the new articles. Vercel was still serving a cached copy over 20 minutes later (`X-Vercel-Cache: HIT`, `Age: 1332`), even though `app/sitemap.ts` sets `revalidate = 60`. | Both pages are live and in the Reads listing, but the sitemap does not submit them to search engines yet. | Save either new article in Directus. That runs the publish flow, which clears the content cache. Then check the sitemap. If it is still stale, the 60-second refresh is not working and needs a code fix or a redeploy. |
| 2 | IndexNow was not pinged. The ping lives in `/api/revalidate`, and a direct database insert does not call it. `REVALIDATE_SECRET` is not in `.env.local`. | Bing and others were not told about the two pages. | The same Directus save sends the ping. |
| 3 | Two reference links could not be confirmed: the Mayo Clinic IVF page (403) and the CDC fact sheet on stacks.cdc.gov (403). Both block automated checks, and Firecrawl credits ran out before they could be opened another way. | Each may be fine. A broken one would be a dead reference. | Open both in a browser. |
| 4 | The sheet's "Published on website" column is out of date. It has 13 articles marked, 40 other live articles unmarked, and ChatGPT links on 8 rows that are not live. Rows 84 and 88 are not marked either. | The sheet cannot be trusted as a record of what is live. | Update the column. The file is an Excel upload owned by another account, so it was not edited. |

### Accepted

| # | Item | Reason |
|---|---|---|
| 5 | Row 84's legal wording was checked against the Code and gazette by Claude, not by a lawyer. | The owner approved publishing with the five wording changes. The line saying the law does not mention pumping is the one a lawyer would most want to see. |
| 6 | The writers' docs still show doctor sign-off as pending on rows 84 and 88. | The owner confirmed that Dr. Singh reviewed these articles. |
| 7 | The IVF flowchart says "a few painless minutes, no sedation", while the article says "usually". | Minor. Flagged for Dr. Singh, because changing it means regenerating the image. |

### Solved: content

| # | Problem | How it was solved |
|---|---|---|
| 8 | Row 88 listed the same file for both cover and in-article image, and no IVF cover existed in Drive. | The file was the in-article flowchart. A new cover was made in ChatGPT from a prompt based on the live covers, checked, and resized to 1400×933. |
| 9 | Row 88's sheet title promised "Success Rates in India", which the article deliberately does not cover. | Used the writer's title, with the owner's approval. |
| 10 | Row 88 pointed to a two-week-wait guide that is not live. | Cut the end of that sentence, with the owner's approval. |
| 11 | Row 84 said "earlier rules continue", but the final Central Rules came into force on 8 May 2026. | Reworded to give the date and say that state rules can still apply. |
| 12 | Row 84 said state rules may differ on break length. Section 66 leaves it to the Central Government, and rule 36 also allows up to 15 minutes of travel time. | Reworded the break length row. |
| 13 | Row 84 read as if every workplace is covered. | Added the coverage from the Code's First Schedule: factories, mines, plantations, and shops or establishments with 10 or more employees. |
| 14 | Row 84 presented nursing breaks as a pumping right. Section 66 says "for nursing the child". | Changed the heading to "working mother" and added a line telling her to ask HR how the breaks can be used. |
| 15 | Row 84's creche row left out that visits include rest intervals, and that an allowance can replace the creche. | Added both. |
| 16 | Row 84 had a broken "breast pump guide" link and a line about foods for milk supply that led nowhere. | Removed both. |
| 17 | Both docs ended with internal notes, and row 84's also had chat text. | Left all of it out of the published article. |
| 18 | Row 84's doc had a typo: "as a routine form". | Corrected to "as a routine forms". |
| 19 | The docs did not follow the site's article layout, and row 84 had no captions for its image. | Moved the text into the usual order (quick answer, Insight, doctor section, looking ahead, references, questions). Formatted the lists and tables, and renamed the doctor section to match other articles. Captions came from the image or the writer's notes. |

### Solved: tools and checks

| # | Problem | How it was solved |
|---|---|---|
| 20 | The Google Sheets tool said "Spreadsheet not found or unavailable". | The file is an Excel upload, not a Google Sheet. Read it through Google Drive instead. |
| 21 | Drive's text version of the sheet had no row breaks, so rows could not be counted. | Downloaded the real `.xlsx` and read it column by column with `openpyxl`. |
| 22 | Sheet and image downloads were too large to return in full. | Used the saved copies the tool wrote to disk and decoded them with a script. |
| 23 | Matching live articles to sheet rows paired `postpartum-recovery-foods` with row 39. | Checked every weak match by hand. The correct row is 92 (ID 698). |
| 24 | Python scripts crashed with `UnicodeEncodeError` on characters like → and ₹. | `PYTHONIOENCODING` is ignored under `python -I`, so the scripts set UTF-8 output themselves with `sys.stdout.reconfigure`. |
| 25 | A Firecrawl query on the Code's PDF returned only fragments and used about 120 credits. | Downloaded the Code and the gazette with `curl` and read them with `pypdf`, which is free and gives the exact text. |
| 26 | Link checks returned 403, 203 or a timeout for some references. | CDC's main page and Taxmann opened normally through Firecrawl. PubMed's 203 is a working response. See item 3 for the two left unconfirmed. |
| 27 | The check for leftover notes flagged "Scout". | False alarm: the article says "Scout the office". |
| 28 | The background check reported failure after 20 minutes. | It required the sitemap and the listing together. The listing had updated; only the sitemap had not. See item 1. |

---

## Carried over from earlier batches

From the 31 Oct to 5 Nov publishing notes.

| Status | Row | Problem | Solved how, or what is needed |
|---|---|---|---|
| Open | 91 | The PCOS cover shows fertilisation inside the womb. It happens in the fallopian tube. | Replace the cover. |
| Open | 80 | The NIPT dot chart was left out because it has 110 dots and its counts do not match its labels. | Regenerate the chart. |
| Open | 80 | NIPT cost and anomaly scan timing differ from other Reads. | A doctor should pick one figure for each. |
| Open | 81 | Two India-specific Group B Strep figures have no confirmed source. | Check the source. |
| Open | 91, 92 | Dr. Singh is shown as a child specialist on fertility and postpartum articles. Row 91's notes ask for an OB-GYN. | Add the right specialists when they are onboarded. |
| Open | All batches | The links the sheet wants from older articles to new ones have not been added. | Add them in a later pass. |
| Solved | 80 | The article said detection was "somewhat lower" for Patau syndrome, but its source says about 99%. | Corrected the sentence. |
| Solved | 81 | A link pointed to an article that does not exist. | Replaced it with a plain instruction. |
| Solved | 92 | The ICMR link was broken. | Fixed it and confirmed the figures in the PDF. |

## Not published yet

| Row | Article | Blocked by |
|---|---|---|
| 87 | Combination Feeding | IMS Act legal check by a lawyer. |
| 89 | IUI Procedure | No images, no plagiarism mark, placeholder links in the text, and NICE figures to verify. |
