// /openapi.json — the OpenAPI 3.1 description of this site's machine-readable
// surface. Built from src/openapi.ts, which is also what /openapi.yaml
// serialises and what the /api page renders its operation list from.

import type { APIRoute } from "astro";
import { buildOpenApi } from "../openapi";

export const GET: APIRoute = () =>
  new Response(JSON.stringify(buildOpenApi(), null, 2) + "\n", {
    headers: {
      "content-type": "application/json; charset=utf-8",
      "cache-control": "public, max-age=3600",
      // The spec is a public description of a public API; a tool fetching it
      // from a browser page should not be blocked by CORS.
      "access-control-allow-origin": "*",
    },
  });
