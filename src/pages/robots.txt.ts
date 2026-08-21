// /robots.txt — on the launch checklist in ROADMAP.md, and the place a
// crawler looks for the sitemap.
//
// Until this shipped, Cloudflare served its own managed robots.txt: the
// Content Signals Policy preamble, explaining what the signals mean and
// declaring none of them. A file here replaces that, so it carries the
// signals the project actually intends.
//
// All three are granted. `search` and `ai-input` follow from what the site
// already does — it publishes llms.txt and llms-full.txt so models can read
// the documentation, and it wants to be findable by name. `ai-train` is a
// rights grant rather than a description, and it is the maintainer's
// decision: MIT-licensed documentation for a project whose whole thesis is
// that agents should be able to write grammars is not content to withhold
// from training. Changing it later is one line here, but a granted signal is
// not easily walked back — treat it as a policy change, not a tidy-up.

import type { APIRoute } from "astro";
import { SITE_URL } from "../openapi";

export const GET: APIRoute = () => {
  const body = `# ${SITE_URL} — documentation for the tabnas parsing engine.
#
# This site publishes machine-readable indexes on purpose:
#
#   ${SITE_URL}/llms.txt          the site index, written for agents
#   ${SITE_URL}/llms-full.txt     every documentation page in one file
#   ${SITE_URL}/openapi.json      every endpoint that answers with JSON
#   ${SITE_URL}/.well-known/mcp   how to connect an agent over MCP
#
# Every page is also available as markdown: send "Accept: text/markdown", or
# append ".md" to the path.

User-agent: *
Content-Signal: search=yes, ai-input=yes, ai-train=yes
Allow: /

Sitemap: ${SITE_URL}/sitemap-index.xml
`;

  return new Response(body, {
    headers: {
      "content-type": "text/plain; charset=utf-8",
      "cache-control": "public, max-age=3600",
    },
  });
};
