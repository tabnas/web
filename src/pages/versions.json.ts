// /versions.json — which package versions this documentation describes.
//
// The site's examples run against the versions pinned in package.json, so
// those pins ARE the answer, and they are read here rather than restated:
// a hand-written version list would be wrong the first time someone bumped a
// dependency without remembering it existed. (consts.ts's PACKAGES carries a
// version per package too, but that one is a hand-recorded release catalogue
// for /releases and can legitimately lag the registry; these are the exact
// versions the docs were built against.)
//
// Emitted as a static file at build time, so an agent can fetch one URL and
// know which engine a page is describing — the site's answer to "which
// version am I reading about?".

import type { APIRoute } from "astro";
import pkg from "../../package.json";

export const GET: APIRoute = () => {
  const deps = pkg.dependencies as Record<string, string>;

  const packages = Object.keys(deps)
    .filter((name) => name.startsWith("@tabnas/"))
    .sort()
    .reduce<Record<string, string>>((acc, name) => {
      acc[name] = deps[name];
      return acc;
    }, {});

  const body = {
    $comment:
      "The @tabnas package versions this documentation was built against, read from the site's own dependency pins. Generated at build time.",
    site: "https://tabnas.dev",
    engine: packages["@tabnas/parser"] ?? null,
    packages,
  };

  return new Response(JSON.stringify(body, null, 2) + "\n", {
    headers: {
      "content-type": "application/json; charset=utf-8",
      // A build-time constant that changes only when the site redeploys.
      "cache-control": "public, max-age=3600",
    },
  });
};
