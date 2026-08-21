// /openapi.yaml — the same document as /openapi.json, in YAML, because half
// the OpenAPI tooling in the world reaches for the .yaml first.

import type { APIRoute } from "astro";
import { stringify } from "yaml";
import { buildOpenApi } from "../openapi";

export const GET: APIRoute = () =>
  new Response(stringify(buildOpenApi(), { lineWidth: 0 }), {
    headers: {
      "content-type": "application/yaml; charset=utf-8",
      "cache-control": "public, max-age=3600",
      "access-control-allow-origin": "*",
    },
  });
