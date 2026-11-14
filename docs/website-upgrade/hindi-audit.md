# Hindi and Hinglish audit

Checked 15 Nov 2026 against the 78 published Reads (read-only query) and every file in this repo.

## What exists

| Page | URL | Script | Notes |
|---|---|---|---|
| Delivery Ke Baad Pet Kaise Kam Kare | `/reads/articles/delivery-ke-baad-pet-kaise-kam-kare/` | Roman (Hinglish) | The only Hindi-language read. No English pair recorded. |

**No published article and no file in this repo contains Devanagari.** The Devanagari pregnancy content the plan mentions lives in the app, not on the website. The home page FAQ ("Is it in Hindi?") describes the app, not the site.

No pages were changed for this audit.

## What was added (Phase 4)

- **Hinglish layout.** An article whose `role` is `hinglish` in `content/article-meta.json` gets `lang="hi-Latn"` on its `<article>` wrapper. The root `<html lang="en-IN">` is set once in `app/layout.tsx` for the whole site, so the wrapper carries the language instead. It also gets a shorter reading line (34em) and `inLanguage: "hi-Latn"` in its JSON-LD. Same components as English otherwise.
- **Language toggle.** When an article's `hinglish_pair` (or, on a Hinglish read, `english_pair`) names a published slug, a "Read in Hinglish" or "Read in English" link shows above the title. It sends the `hinglish_toggle` event with the slug only.
- **Read-aloud.** The website has no read-aloud feature, so there was nothing to adapt or hide.

To pair a read: set `hinglish_pair` on the English entry and `english_pair` on the Hinglish entry in `content/article-meta.json`, then run `npm run check:content`.

## hreflang: not added

Google documents hreflang values as a language code with an optional region (for example `hi` or `hi-IN`). It does not document script subtags such as `hi-Latn`, and in practice treats an unknown value as invalid. Marking Roman-script pages as plain `hi` would tell Google they are Hindi in the usual script, which is not true, and could show them to Devanagari searchers.

Recommendation: no hreflang between English and Hinglish pairs. The visible toggle links the two pages, and each page has its own canonical. Revisit if Google documents script subtags.
