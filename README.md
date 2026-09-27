# ParentVeda — website

The public website for ParentVeda, a calm, India-first family companion for
trying to conceive, pregnancy, parenting (0–5) and skilling (6–14).

Next.js 16 (App Router) · TypeScript · plain CSS · Supabase for Reads, the waitlist, /care
and the employer portal. It replaces the older site (`C:\parentveda-web`), whose
functional pages were carried over — see **Carried over from the old site** below.
No UI framework and no animation library: the motion is one small observer
(`components/MotionRoot.tsx`) and one scroll loop (`components/home/Journey.tsx`),
which keeps the first load light on a mid-range Android phone on 4G.

## Run it

```bash
npm install
npm run dev        # http://localhost:3000
npm run build      # production build: every page prerendered
npm run start
```

**Writing copy? Read [VOICE.md](VOICE.md) first.** It holds the idea the whole site
sells (your child's story starts with you), the three beats every section follows,
and the words we use and never use.

## Where things live

| Path | What it is |
|---|---|
| `app/page.tsx` | Home |
| `app/[stage]/page.tsx` | The four stage pages, all from `lib/stages.ts` |
| `app/reads/` | **Reads** — the articles section, live from Directus via Supabase |
| `app/care/`, `app/invite/` | The doctor-QR and invite landing pages the app links to |
| `app/legal/`, `app/confirmed/` | Policies (Play needs privacy + delete-account) and the email-confirmed page |
| `app/portal/` | The employer (sponsor) portal |
| `content/articles/*.md`, `app/_articles-kept/` | The eight converted app reads, **parked** (not served) |
| `app/ask-veda`, `fathers`, `about`, `partners`, `privacy`, `download` | Inner pages |
| `lib/site.ts` | Launch switch (`appLive`), Play Store link, contact email, nav |
| `lib/stages.ts` | Every door, feature and tool listed per stage |
| `lib/weeks.json` | Week 4–40 baby size and milestone, exported from the app |
| `public/paintings/` | The app's own onboarding paintings (fallback art) |
| `public/weeks/` | The app's week 4–40 baby illustrations |
| `public/images/` | **Drop the ChatGPT images here** (see below) |

## Reads (articles)

Articles are written and published in **Directus**, which stores them in Supabase
(`content_posts`, `content_categories`). The site reads the published rows:

- `/reads/` — every read, filterable by stage; `/reads/<category>/` — one kind
  (articles, research summaries, book summaries, recipes, parenting FAQ);
  `/reads/<category>/<slug>/` — the article; `/reads/authors/<slug>/` — a reviewer.
- These are **the same addresses the old site had**, trailing slash included, so
  nothing Google indexed moves. `/guides/...` and `/articles/...` redirect here.
- Markdown conventions authors use: `> Note:` (the disclaimer), `> Important:`,
  `> Insight:`, a `## What matters most` summary box, `## Common questions` with
  `###` questions (becomes an accordion + FAQ structured data), and
  `![alt](figure:key "caption")` for the hand-drawn diagrams in
  `components/reads/figures.tsx`.
- A medical reviewer is credited when the post's `author` matches a name in
  `lib/authors.ts`; that adds the profile link and MedicalWebPage structured data.
- Images in posts point at `/media/...`, served from `public/media/`.
- Pages refresh at most a minute after a publish. For instant: set `REVALIDATE_SECRET`
  on Vercel and a Directus Flow (Event Hook on `content_posts`, `content_categories`,
  `content_authors` create/update) → Webhook `POST https://parentveda.in/api/revalidate`
  with header `x-revalidate-secret`.

The eight articles I converted from the app earlier are kept in `content/articles/`
and `app/_articles-kept/` but not served, so nothing competes with Reads.

## Images

Every picture slot works today. Until its file exists, it shows one of the app's
own paintings. Drop a generated image into `public/images/` with the exact
name below (`.png`, `.jpg` or `.webp` all work), rebuild, and it replaces the
fallback. A slot with no fallback (the three bento tiles) shows its icon until
its image arrives.

| File | Where it shows | Shape |
|---|---|---|
| `hero-family` | Home hero | square |
| `stage-trying` · `stage-pregnancy` · `stage-parenting` · `stage-skilling` | Stage page heroes | portrait |
| `ask-veda-night` | Ask Veda page | portrait |
| `garbh-sanskar` | Home, Garbh Sanskar band | portrait |
| `father` | Home fathers band, fathers page | portrait |
| `about-home` | About page | portrait |
| `download-hello` | Download band, download page | square |
| `indian-kitchen` · `traditions` · `keepsake` | Home bento tiles | landscape |

### Films

Two slots take a short, silent, looping film. Drop an `.mp4` into `public/videos/`
and rebuild. The film replaces the painting, plays only while on screen, and
never plays for someone who has asked their device for reduced motion.

| File | Where it shows |
|---|---|
| `public/videos/hero-loop.mp4` | Home hero panel |
| `public/videos/garbh-loop.mp4` | Home, Garbh Sanskar band |

## Contact form

`/contact` is one form for everyone. A "what's this about" choice sorts each message
(parent, launch alert, doctor, employer, brand, press, other). Links can pre-select a topic:
`/contact?topic=doctors`. The partners page and the download page already do this.

The form posts to `app/api/contact/route.ts`, which validates every field again on the
server, drops spam quietly (a hidden honeypot field plus a minimum time on the page),
rate-limits each address, and emails the message through Resend with `reply_to` set to
the sender. Replying from your inbox answers them directly.

**To connect it:**
1. Create a free account at resend.com and an API key.
2. Copy `.env.example` to `.env.local` and fill in `RESEND_API_KEY` and `CONTACT_TO_EMAIL`.
3. For delivery to any inbox, verify parentveda.in in Resend and set `CONTACT_FROM_EMAIL`
   to an address on it (for example `ParentVeda <hello@parentveda.in>`).
4. Set the same three variables on the host (Vercel → Settings → Environment Variables).

Until then the route answers `503 not_configured`, and the form tells the visitor plainly
to email instead. It never shows "sent" for a message that went nowhere.

## Motion and feel

- `components/Interactions.tsx`: smooth wheel scrolling (Lenis, desktop only), click ripples,
  magnetic primary buttons, tilt cards (`data-tilt`) and the header that tucks away on scroll.
- `components/MotionRoot.tsx`: reveal-once on scroll, plus `data-progress`, which gives any
  section a `--p` from 0 to 1 as it scrolls away (the hero uses it).
- `components/home/Journey.tsx`: the thread and the pinned week 4 → 40 walk.
- `components/home/ScrollWords.tsx`: a statement that lights up word by word.
- `app/template.tsx`: the page-arrival transition.
- Everything respects `prefers-reduced-motion`.

## Carried over from the old site

| What | Where | Needs |
|---|---|---|
| Doctor QR landing, `/care/<token>` | `app/care/`, `lib/care.ts` | Supabase keys to name the doctor (works generically without) |
| Invite landing, `/invite/<code>` | `app/invite/`, `lib/invite.ts` | nothing |
| App links file | `public/.well-known/assetlinks.json` | the **Play App Signing** SHA-256 in place of the placeholder |
| Email confirmed | `app/confirmed/` | Supabase → Auth → URL Configuration → Site URL `https://parentveda.in/confirmed` |
| Policies | `app/legal/`, `lib/legal.ts` | nothing (text carried over word for word) |
| Reads | `app/reads/`, `lib/guides.ts` | Supabase keys; `REVALIDATE_SECRET` for instant publish |
| Waitlist | `components/Waitlist.tsx`, `app/actions/subscribe.ts` | `SUPABASE_SERVICE_ROLE_KEY` |
| Employer portal | `app/portal/`, `middleware.ts` | Supabase keys |

## Before launch

- **Two switches, one each:** `APP_LIVE` in `lib/invite.ts` (turns /care and /invite into the
  Play Store bounce) and `appLive` in `lib/site.ts` (every "Get the app" button, and the
  closing band swaps the waitlist for the Play button). Flip both on listing day.
- Put the Play App Signing fingerprint into `assetlinks.json` (Play Console → Setup → App signing).
- Delete the demo Care Partner rows before launch (old site's OPEN-POINTS.md has the SQL).
- The waitlist stores signups but no email provider sends anything yet; the success
  message says so honestly.
- Pricing isn't decided, so the site states no prices.

## Rules the copy keeps

These come from the product, not from style:

- Never a diagnosis. Every clinical page ends by routing to a doctor.
- No personalised odds, no invented user counts, ratings, testimonials or press logos.
- New copy in English. Hindi, if ever added, is Devanagari, never Latin-script Hinglish.
- No decorative emoji; line icons only.
