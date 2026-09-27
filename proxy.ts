/* ============================================================
   Session refresh for the sponsor portal.

   proxy.ts, not middleware.ts: Next 16 renamed the convention (the
   `middleware` filename and named export are deprecated; see
   node_modules/next/dist/docs/01-app/02-guides/upgrading/version-16.md,
   "middleware to proxy"). Same behaviour, runs on the Node.js runtime.
   Carried over from the old site's src/middleware.ts with the logic unchanged.

   Supabase access tokens are short-lived and refresh via a cookie. A Server
   Component cannot write cookies, so without this every portal session would
   die at the first token expiry and dump someone back at the login screen
   mid-task. Middleware runs before the render and CAN write them, which is why
   this file exists at all.

   ⚠️ THE MATCHER IS THE IMPORTANT PART. It is scoped to /portal only.

   The rest of parentveda.in is anonymous, statically rendered and cached — the
   guides, the home page, the reads. Running auth middleware across those would
   make every request dynamic, quietly turning a prerendered, crawlable site
   into per-request SSR: slower for readers, worse for search, and more
   expensive on Vercel. The portal is the only part of this site that has a
   user, so it is the only part that pays for one.
   ============================================================ */

import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

export async function proxy(request: NextRequest) {
  let response = NextResponse.next({ request });

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !anonKey) return response;

  const supabase = createServerClient(url, anonKey, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(list) {
        for (const { name, value } of list) {
          request.cookies.set(name, value);
        }
        response = NextResponse.next({ request });
        for (const { name, value, options } of list) {
          response.cookies.set(name, value, options);
        }
      },
    },
  });

  /* getUser() rather than getSession(): getSession only decodes whatever is in
     the cookie, which a browser can edit. getUser asks the auth server whether
     the token is genuine. Trusting the cookie here would mean a hand-written
     one walks past the gate. */
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const path = request.nextUrl.pathname;
  const isLogin = path.startsWith("/portal/login");

  if (!user && !isLogin) {
    return NextResponse.redirect(new URL("/portal/login/", request.url));
  }
  if (user && isLogin) {
    return NextResponse.redirect(new URL("/portal/", request.url));
  }

  return response;
}

export const config = {
  matcher: ["/portal", "/portal/(.*)"],
};
