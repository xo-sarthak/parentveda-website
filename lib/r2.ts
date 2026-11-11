/* ============================================================
   Read-only access to the Cloudflare R2 bucket Directus uploads to.

   R2 speaks the S3 API, so each request is signed with AWS Signature V4
   (region "auto"). Only GET requests are made, with a token that can only
   read objects, so a leaked token exposes images and nothing more.

   Settings (Vercel, server-only, never NEXT_PUBLIC_):
     R2_ACCOUNT_ID         Cloudflare account id
     R2_BUCKET             the bucket Directus uses
     R2_ACCESS_KEY_ID      from an R2 API token with "Object Read only"
     R2_SECRET_ACCESS_KEY  same token
     R2_ROOT               optional, Directus's STORAGE_R2_ROOT if it set one
   ============================================================ */

import { createHash, createHmac } from "node:crypto";

type R2Config = { account: string; bucket: string; keyId: string; secret: string; root: string };

export function r2Config(): R2Config | null {
  const account = process.env.R2_ACCOUNT_ID;
  const bucket = process.env.R2_BUCKET;
  const keyId = process.env.R2_ACCESS_KEY_ID;
  const secret = process.env.R2_SECRET_ACCESS_KEY;
  if (!account || !bucket || !keyId || !secret) return null;
  /* Directus joins root and file name with a slash; normalise to "root/" or "". */
  const raw = (process.env.R2_ROOT ?? "").replace(/^\/+|\/+$/g, "");
  return { account, bucket, keyId, secret, root: raw ? `${raw}/` : "" };
}

const sha256 = (s: string) => createHash("sha256").update(s).digest("hex");
const hmac = (key: Buffer | string, s: string) => createHmac("sha256", key).update(s).digest();

/* S3 wants every byte outside A-Z a-z 0-9 - _ . ~ percent-encoded; "/" is kept in paths. */
const enc = (s: string) =>
  encodeURIComponent(s).replace(/[!'()*]/g, (c) => `%${c.charCodeAt(0).toString(16).toUpperCase()}`);
const encPath = (s: string) => s.split("/").map(enc).join("/");

/* key "" addresses the bucket itself, for listing. */
async function signedGet(cfg: R2Config, key: string, query: Record<string, string> = {}): Promise<Response> {
  const host = `${cfg.account}.r2.cloudflarestorage.com`;
  const path = key ? `/${enc(cfg.bucket)}/${encPath(key)}` : `/${enc(cfg.bucket)}`;
  const qs = Object.keys(query)
    .sort()
    .map((k) => `${enc(k)}=${enc(query[k])}`)
    .join("&");

  const now = new Date();
  const amzDate = now.toISOString().replace(/[-:]/g, "").replace(/\.\d{3}/, "");
  const day = amzDate.slice(0, 8);
  const payloadHash = sha256("");
  const signedHeaders = "host;x-amz-content-sha256;x-amz-date";
  const canonical = ["GET", path, qs, `host:${host}`, `x-amz-content-sha256:${payloadHash}`, `x-amz-date:${amzDate}`, "", signedHeaders, payloadHash].join("\n");
  const scope = `${day}/auto/s3/aws4_request`;
  const toSign = ["AWS4-HMAC-SHA256", amzDate, scope, sha256(canonical)].join("\n");
  const kSigning = hmac(hmac(hmac(hmac(`AWS4${cfg.secret}`, day), "auto"), "s3"), "aws4_request");
  const signature = createHmac("sha256", kSigning).update(toSign).digest("hex");

  return fetch(`https://${host}${path}${qs ? `?${qs}` : ""}`, {
    headers: {
      "x-amz-date": amzDate,
      "x-amz-content-sha256": payloadHash,
      authorization: `AWS4-HMAC-SHA256 Credential=${cfg.keyId}/${scope}, SignedHeaders=${signedHeaders}, Signature=${signature}`,
    },
    cache: "no-store",
  });
}

/* Directus names each file "<id>.<ext>", and the extension is not always the
   one its type suggests (a .webp stored as image/jpeg), so look it up by prefix. */
async function keyForId(cfg: R2Config, id: string): Promise<string | null> {
  const res = await signedGet(cfg, "", { "list-type": "2", prefix: `${cfg.root}${id}`, "max-keys": "5" });
  if (!res.ok) return null;
  const xml = await res.text();
  const keys = [...xml.matchAll(/<Key>([^<]+)<\/Key>/g)].map((m) => m[1].replace(/&amp;/g, "&"));
  /* The original upload is "<id>.<ext>"; skip any derived copies Directus may keep. */
  return keys.find((k) => new RegExp(`^${cfg.root.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}${id}\\.[a-z0-9]+$`, "i").test(k)) ?? null;
}

/** The stored file for a Directus file id, or null when it is missing or R2 is not configured. */
export async function getDirectusFile(id: string): Promise<Response | null> {
  const cfg = r2Config();
  if (!cfg) return null;
  const key = await keyForId(cfg, id);
  if (!key) return null;
  const res = await signedGet(cfg, key);
  return res.ok ? res : null;
}
