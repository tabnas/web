// /packages.json — the package catalogue, machine-readable.
//
// The same PACKAGES list /releases renders, so a program does not have to
// scrape a table to find out what the project publishes. The recorded version
// can lag the registry (see consts.ts); /versions.json is the exact answer
// for "which versions is this documentation describing".

import type { APIRoute } from "astro";
import { PACKAGES, TIER_LABEL, REPO, SITE_TITLE } from "../consts";
import { SITE_URL } from "../openapi";

export const GET: APIRoute = () => {
  const body = {
    $comment:
      "The packages published by the tabnas project. `version` is the recorded release and " +
      "can lag the npm registry; the exact versions this documentation was built against are " +
      "at https://tabnas.dev/versions.json.",
    site: SITE_URL,
    project: SITE_TITLE,
    count: PACKAGES.length,
    tiers: TIER_LABEL,
    packages: PACKAGES.map((p) => ({
      name: p.name,
      tier: p.tier,
      description: p.blurb,
      version: p.version,
      npm: p.npm ? `@tabnas/${p.name}` : null,
      go: p.go ? `github.com/tabnas/${p.name}/go` : null,
      repository: REPO(p.name),
    })),
  };

  return new Response(JSON.stringify(body, null, 2) + "\n", {
    headers: {
      "content-type": "application/json; charset=utf-8",
      "cache-control": "public, max-age=3600",
      "access-control-allow-origin": "*",
    },
  });
};
