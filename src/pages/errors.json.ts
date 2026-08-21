// /errors.json — every error code the engine and its plugins raise.
//
// The machine-readable twin of /errors. A diagnostic's `code` is the contract
// across the TypeScript and Go runtimes, so a program that has just been
// handed one should be able to resolve it without parsing a page.

import type { APIRoute } from "astro";
import { errorRegistry } from "../errors";
import { SITE_URL } from "../openapi";

export const GET: APIRoute = () => {
  const { engine, codes } = errorRegistry();
  const body = {
    $comment:
      "Every error code declared by the tabnas engine, by a grammar plugin, or by a plugin's " +
      "C ABI. Match on `code`, never on message text: the code is the cross-runtime contract. " +
      "A plugin code carries no message here — that text lives in the plugin's own catalogue.",
    site: SITE_URL,
    engine,
    count: codes.length,
    codes,
  };

  return new Response(JSON.stringify(body, null, 2) + "\n", {
    headers: {
      "content-type": "application/json; charset=utf-8",
      "cache-control": "public, max-age=3600",
      "access-control-allow-origin": "*",
    },
  });
};
