import { defineMiddleware } from "astro:middleware";

/*
  Site-wide HTTP Basic Auth — a temporary gate while tabnas.dev is under
  construction. It runs in the Cloudflare Worker (wrangler `assets`
  `run_worker_first` makes the Worker handle every request, so static pages
  and assets are gated too).

  The gate is ACTIVE only when a `SITE_PASSWORD` secret is configured on the
  Worker; with no secret set the site is open (so a misconfigured deploy can
  never lock everyone out permanently, and local `astro dev` stays open).

  Set the secret in Cloudflare → your Worker → Settings → Variables and
  Secrets → add `SITE_PASSWORD` (Secret). Optionally `SITE_USER` (default
  "tabnas"). Remove this file (and `run_worker_first`) to unpublish the gate
  at launch.
*/

// Constant-time string comparison (avoids leaking length/prefix via timing).
function safeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return diff === 0;
}

export const onRequest = defineMiddleware(async (context, next) => {
  const env = (context.locals as any)?.runtime?.env as
    | { SITE_PASSWORD?: string; SITE_USER?: string }
    | undefined;

  const password = env?.SITE_PASSWORD;
  if (!password) return next(); // gate disabled until a password is set

  const user = env?.SITE_USER || "tabnas";
  const expected = "Basic " + btoa(`${user}:${password}`);
  const provided = context.request.headers.get("authorization") || "";

  if (provided && safeEqual(provided, expected)) return next();

  return new Response("tabnas.dev is under construction. Authentication required.", {
    status: 401,
    headers: {
      "WWW-Authenticate": 'Basic realm="tabnas (under construction)", charset="UTF-8"',
      "content-type": "text/plain; charset=utf-8",
      "cache-control": "no-store",
    },
  });
});
