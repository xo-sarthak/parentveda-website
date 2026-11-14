import { NextResponse } from "next/server";

/* POST /api/consult/book/: the integration point for paid booking (mode "book").

   Not connected. When a booking or payment provider is chosen, this route
   should: validate the same fields as /api/consult/ (lib/leads.ts), look up
   the price on the server from content/consults.json (never trust a price
   from the browser), create the provider's order or booking, and return the
   provider's checkout URL or token for ConsultBlock's `onBook` step.

   Until then it answers 501, and ConsultBlock falls back to the callback form
   for any consult whose mode is "book". */

export const runtime = "nodejs";

export async function POST() {
  return NextResponse.json({ ok: false, error: "booking_not_available" }, { status: 501 });
}
