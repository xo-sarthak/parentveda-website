/* ============================================================
   Where consult and download requests go: the Supabase table
   public.website_leads (supabase/website_leads.sql), which the team works
   in Directus. Server-only: it uses the service-role client.

   Off until LEADS_ENABLED=1 is set on the deploy AND the service-role key is
   present. Until then the consult and download forms do not render at all.
   Run supabase/website_leads.sql before turning it on.

   A webhook (CONSULT_WEBHOOK_URL / LEADS_WEBHOOK_URL) is optional on top:
   when set, each request is also posted there, and a failed post never loses
   the request, because the table is written first.
   ============================================================ */

import { getSupabaseAdmin } from "@/lib/supabase-admin";

export type LeadRow = {
  ref: string;
  kind: "consult_request" | "download_lead" | "download_whatsapp_request";
  name: string;
  phone: string | null;
  email: string | null;
  specialty?: string | null;
  price_inr?: number | null;
  best_time?: string | null;
  note?: string | null;
  download?: string | null;
  condition?: string | null;
  page?: string | null;
  consent: true;
  consent_text: string;
};

export function leadsEnabled(): boolean {
  return process.env.LEADS_ENABLED === "1" && Boolean(process.env.SUPABASE_SERVICE_ROLE_KEY);
}

export async function storeLead(row: LeadRow): Promise<"ok" | "not_configured" | "failed"> {
  if (!leadsEnabled()) return "not_configured";
  const db = getSupabaseAdmin();
  if (!db) return "not_configured";
  const { error } = await db.from("website_leads").insert(row);
  if (error) {
    // The message names the table or column, never the row's contents.
    console.error(`[leads] could not store ${row.kind}: ${error.code ?? ""} ${error.message}`);
    return "failed";
  }
  return "ok";
}
