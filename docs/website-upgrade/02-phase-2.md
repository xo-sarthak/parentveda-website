# Phase 2 report

Branch `feat/condition-hubs-and-conversion`. Local only: not pushed, not deployed.

## What changed

| Task | Where | Notes |
|---|---|---|
| 2.1 Condition hubs | `app/conditions/[slug]/`, `app/conditions/`, `content/conditions/*.json`, `lib/conditions.ts`, `lib/hubs.ts` | 43 data files (17 P1, 26 P2), all `published: false`. Hub sections: header, sticky in-page nav, red flags, Understand it, Where do I stand?, What helps, Keep track, Talk to a specialist, Common questions. A section with nothing in it is left out. `MedicalWebPage` with `about` → `MedicalCondition`. |
| | `components/Header.tsx`, `lib/pillars.ts` | Each stage dropdown gains a "Conditions" group plus "All conditions", showing live hubs only. With no live hub, the menu is unchanged. |
| | `scripts/hub-keyword-check.mjs` | `npm run check:hub-keywords` writes `hub-keyword-check.csv`: 7 overlaps across 6 hubs. |
| 2.2 Talk to a specialist | `components/leads/ConsultBlock.tsx`, `app/api/consult/`, `content/consults.json` | Callback form: name, Indian mobile, time slot, optional note (300 characters, with a hint not to share reports), and a required consent box. It also has a honeypot, a timing check and a rate limit of 5 per 10 minutes per address. The request is forwarded to `CONSULT_WEBHOOK_URL` and the ops inbox gets an email. `mode: "book"` has a component prop (`onBook`) and a stub route `app/api/consult/book/` that answers 501. Shown on hubs, on articles whose cards include a consult, and on expert profiles with `takesConsults`. |
| 2.3 Downloads | `components/leads/DownloadCard.tsx`, `app/api/leads/`, `content/downloads.json` | 9 entries, all `file: null`. After the form, the download link shows, plus "Send it to my WhatsApp", which only records the request and emails ops. |
| 2.4 Expert profiles | `lib/authors.ts`, `app/reads/authors/[slug]/` | New optional fields: `registrationNumber` (shown as "Reg. no."), `yearsExperience`, `takesConsults`, `consultSpecialty`, `conditions[]`. The profile lists conditions covered, and shows the consult block when the expert takes consults. Person schema carries the number as `identifier`. |
| 2.5 Trust pages | `app/legal/medical-review-policy/`, `app/legal/how-we-make-money/`, `app/legal/corrections/` | Drafts: marked in `lib/legal.ts`. They 404 in production, are noindex, and are left out of the policies index, the footer and the sitemap. They render on preview and dev with a "DRAFT, needs legal and founder review" banner. The corrections form sends through `/api/contact/` (new topic `correction`, not shown as a chip on /contact/). |

## Nothing shows on the live site yet

| Feature | What turns it on |
|---|---|
| Consult blocks | Set `CONSULT_WEBHOOK_URL` in Vercel. Until then no consult card, block or form renders anywhere. |
| Download cards | Set `LEADS_WEBHOOK_URL` and put a PDF path in that entry's `file`. |
| A hub | Set `"published": true` in its JSON **and** have 3 or more published articles in it. |
| Trust pages | Remove `draft: true` in `lib/legal.ts` after legal and founder review. Then add them to the footer. |

### Hubs that could go live now

Only **high-risk-pregnancy** has 3 or more published articles today (4: high-risk-pregnancy, nipt-test-pregnancy, down-syndrome-screening-india, nt-scan). Every other P1 hub has 0 to 1. Counts for the rest:

- low-milk-supply: 2
- placenta-previa: 2
- abnormal-semen-report, azoospermia, developmental-delay, speech-delay, thalassemia-minor, ectopic-pregnancy, fibroids: 1 each

Before any hub is published, its JSON needs `one_line`, `who_this_is_for`, `faq` and `doctor_questions` written. All four are empty today on purpose: that is content-team copy, and the FAQ answers need medical review.

### Decisions I made that differ from the plan

1. **"Reviewed by" on hubs.** The plan says to show the expert whose `conditions[]` includes the hub, or else the specialty. Listing an expert under a condition does not mean they reviewed that hub. Showing either would claim a review that has not happened. So a hub shows a reviewer only when its JSON has `reviewed_by` (an expert slug) and `reviewed_at` (a real date). Otherwise it shows nothing about review.
2. **Prices live once.** The plan puts `price_inr` in each condition file and in `consults.config`. Prices are only in `content/consults.json`; a condition points to a consult by key.
3. **Trust page URLs** are under `/legal/`, as agreed. The existing `/legal/editorial-policy/` already covers evidence first, no fear-based writing, AI drafting checked by people, and independence, so I did not touch that live page. One line there is not true today: "Health content is reviewed by a qualified medical professional before it is published", while 10 published posts have no reviewer. Either review those 10 or soften that line.
4. **The Medical Review Policy draft describes specialty matching.** The reviewer report shows 76 of 78 articles do not match yet. That page must not go live until practice matches it.
5. **UTM tags** go only on the Play Store link (`appLink()` in `lib/site.ts`). Before launch, "Get the app" goes to the site's own `/download/` page, and tagging an internal link would start a new GA4 session and lose where the visitor came from.

## Where requests go: Supabase, worked in Directus (decided 15 Nov 2026)

Requests are stored in the Supabase table `website_leads` (`supabase/website_leads.sql`) and the team works them in Directus: read everything, change only `status`, `assigned_to` and `team_notes`. Turn on with `LEADS_ENABLED=1`. The Google Sheet below is no longer needed; it stays documented as an optional extra copy through `CONSULT_WEBHOOK_URL` / `LEADS_WEBHOOK_URL`.

## Setting up the two Google Sheets (optional)

1. Create a Sheet (one for consults, one for downloads, or two tabs in one).
2. Extensions → Apps Script, paste the script below, and save.
3. Deploy → New deployment → Web app. Set "Execute as" to Me and "Who has access" to Anyone. Copy the URL.
4. In Vercel, set `CONSULT_WEBHOOK_URL` and `LEADS_WEBHOOK_URL` to the two URLs. Set `OPS_EMAIL` if it should not be hello@parentveda.in. Redeploy.

```js
// Appends each request as a row. The first request writes the header row.
function doPost(e) {
  const data = JSON.parse(e.postData.contents);
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(data.type.startsWith("consult") ? "Consults" : "Downloads")
    || SpreadsheetApp.getActiveSpreadsheet().getSheets()[0];
  const keys = Object.keys(data);
  if (sheet.getLastRow() === 0) sheet.appendRow(keys);
  const header = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
  sheet.appendRow(header.map((k) => data[k] ?? ""));
  return ContentService.createTextOutput(JSON.stringify({ ok: true })).setMimeType(ContentService.MimeType.JSON);
}
```

Fields sent:
- **Consult:** type, ref, received_at, specialty, specialty_label, price_inr, mode, condition, page, name, phone (+91…), slot, note, consent, consent_text.
- **Download:** type (`download_lead` or `download_whatsapp_request`), ref, received_at, download, condition, page, name, phone, email, gate, consent, consent_text.

The Sheet will hold names, phone numbers and the condition a person was reading about. That is sensitive personal data under the DPDP Act. Share it only with the people who call back, and decide how long rows are kept.

## Privacy policy: change needed before the forms go live

The live policy says: "we do not ask for your name, your phone number or your due date to sign up". That stays true for signing up, but the new forms ask for a name and phone number and record which condition page the request came from. Suggested addition for legal review. I have not changed the live page.

> **When you ask us to call you, or ask for a download.** If you use a "Talk to a specialist" or "free download" form, we collect your name, your mobile or WhatsApp number (or email), the time you would like a call, any short note you add, and the page you were on, which can show the health topic you were reading about. We use this only to contact you about that request and to arrange the session or send the download. It is kept in our own secure database, which only our care team can open, is never used for advertising, and is deleted [after N months]. You can ask us to delete it sooner at privacy@parentveda.in.

## Inputs still needed

- The two webhook URLs (above).
- The nine PDFs.
- Consult prices beyond the three from the app. The app also prices genetic counselling at ₹999. Confirm it before I add it.
- Each expert's `registrationNumber`, `takesConsults`, `consultSpecialty` and `conditions`.
- Hub copy: `one_line`, `who_this_is_for`, `doctor_questions`, `faq`, `track`.
- Legal and founder review of the three trust pages and the privacy addition.
