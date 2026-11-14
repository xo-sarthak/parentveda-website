/* ============================================================
   GA4 events, the only way new code sends one.

   Every parameter is a slug or a category we chose: never a value someone
   typed, never a health answer. The types below are the whole allow list; a
   string that is not a slug is dropped before it leaves the browser. Nothing
   is sent unless the visitor accepted analytics (components/Analytics.tsx
   defines window.gtag only then).
   ============================================================ */

type Events = {
  hub_view: { condition: string };
  tool_start: { tool: string };
  tool_complete: { tool: string };
  download_submit: { download: string; condition?: string };
  consult_click: { specialty: string; condition?: string; mode: string };
  consult_submit: { specialty: string; condition?: string; mode: string };
  red_flag_view: { slug: string };
  call_108_click: { slug: string };
  hinglish_toggle: { slug: string };
  app_waitlist_submit: { source: string };
};

const SLUG = /^[a-z0-9][a-z0-9-]{0,79}$/;

export function track<E extends keyof Events>(event: E, params: Events[E]): void {
  if (typeof window === "undefined" || typeof window.gtag !== "function") return;
  const clean: Record<string, string> = {};
  for (const [k, v] of Object.entries(params)) {
    if (typeof v === "string" && SLUG.test(v)) clean[k] = v;
  }
  window.gtag("event", event, clean);
}
