# ParentVeda — website

The public website for ParentVeda, a calm, India-first family companion for
trying to conceive, pregnancy, parenting (0–5) and skilling (6–14).

Next.js 16 (App Router) · TypeScript · plain CSS · every page is static.
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

## Where things live

| Path | What it is |
|---|---|
| `app/page.tsx` | Home |
| `app/[stage]/page.tsx` | The four stage pages, all from `lib/stages.ts` |
| `app/articles/` | Article index and the reader |
| `content/articles/*.md` | **The articles themselves**, one Markdown file each |
| `app/ask-veda`, `fathers`, `about`, `partners`, `privacy`, `download` | Inner pages |
| `lib/site.ts` | Launch switch (`appLive`), Play Store link, contact email, nav |
| `lib/stages.ts` | Every door, feature and tool listed per stage |
| `lib/weeks.json` | Week 4–40 baby size and milestone, exported from the app |
| `public/paintings/` | The app's own onboarding paintings (fallback art) |
| `public/weeks/` | The app's week 4–40 baby illustrations |
| `public/images/` | **Drop the ChatGPT images here** (see below) |

## Adding an article

Create `content/articles/<slug>.md`:

```md
---
title: "What the anomaly scan looks for"
description: "One or two sentences for the card and for Google."
standfirst: "Optional opening line, shown large above the body."
stage: pregnancy            # trying-to-conceive | pregnancy | parenting | skilling
category: "Scans & tests"
author: "ParentVeda editorial"
date: 2026-10-01
related: [what-scans-cost-in-india]   # optional
---

Body in Markdown. Every `## Heading` becomes an entry in the table of contents.

> [!note] A calm aside
> Callout body. Tones: note · tip · urgent · myth
```

Rebuild, and the article appears in the index, under its stage filter, in "Read next" and in the sitemap.
The eight seed articles were converted from reads that already ship in the app.

**Bylines:** in the app those reads carry named doctors. The site shows "ParentVeda
editorial" until those reviewers are confirmed as real and have agreed to be
named. Don't put a doctor's name on a public page until then.

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

## Before launch

- Flip `appLive` in `lib/site.ts` once the Play listing is live. Every "Get the app" button then goes straight to Play.
- Confirm `partners@parentveda.com` is the right public address.
- **parentveda.in already serves `/care/<token>` and `/invite/<code>`** from the older site
  (spec in the app repo, `docs/CARE-PAGE-SPEC.md`). If this site replaces that one, those two routes
  have to move here first, or shared invite links break.
- The privacy page is a plain-language summary. The full policy still needs writing.
- Pricing isn't decided, so the site states no prices.

## Rules the copy keeps

These come from the product, not from style:

- Never a diagnosis. Every clinical page ends by routing to a doctor.
- No personalised odds, no invented user counts, ratings, testimonials or press logos.
- New copy in English. Hindi, if ever added, is Devanagari, never Latin-script Hinglish.
- No decorative emoji; line icons only.
