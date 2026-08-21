// /.well-known/mcp — the MCP handshake for this domain.
//
// mcp.tabnas.dev already serves one of these for the running service; this is
// the apex domain's answer to "does tabnas speak MCP, and how do I connect",
// which is the question an agent asks about the brand rather than about a
// hostname it has not been told exists yet. It names both transports, so a
// client that cannot spawn a process finds the hosted endpoint and one that
// can finds the stdio command.
//
// Generated: the server entries come from src/data/skills.json (the skills
// repo's mcp.json) and the tool list from src/data/mcp-tools.json (the mcp
// repo's tools.ts), so neither can drift from what ships. The running
// version, the live resource list and the current limits are the service's
// own to report — `handshake` points at it rather than restating them here,
// where they would go stale the next time the server deploys.

import type { APIRoute } from "astro";
import skillsData from "../../data/skills.json";
import mcpTools from "../../data/mcp-tools.json";
import { SITE_URL, MCP_URL } from "../../openapi";

const stdio = skillsData.mcp["tabnas"];
const hosted = skillsData.mcp["tabnas-hosted"];

// `npx --yes @tabnas/mcp@0.1.14 mcp` -> `0.1.14`. The pin in the command is
// the version the skills package installs, so it is the version to report.
const pinned = (Array.isArray(stdio?.command) ? stdio.command : [])
  .join(" ")
  .match(/@tabnas\/mcp@([^\s]+)/)?.[1];

export const GET: APIRoute = () => {
  const body = {
    $comment:
      "How to connect an agent to tabnas over the Model Context Protocol. Local stdio is the " +
      "recommended transport: it is free, private, unlimited and runs the same code.",
    name: "tabnas",
    version: pinned ?? null,
    description:
      "Parse with a grammar, validate one before running it, explain a parse failure, run " +
      "fixtures, read the plugin catalogue, and compare a grammar change against the version " +
      "it replaces.",
    registry: {
      name: "dev.tabnas/mcp",
      url: "https://registry.modelcontextprotocol.io/v0/servers?search=tabnas",
    },
    servers: skillsData.mcp,
    transport: hosted?.type ?? "stdio",
    endpoint: hosted?.url ?? null,
    local: Array.isArray(stdio?.command) ? stdio.command.join(" ") : null,
    tools: mcpTools.tools,
    // The same package installs a command-line tool running the same core.
    // It is easy to miss precisely because it ships inside @tabnas/mcp, so
    // the manifest names it rather than leaving it to the prose.
    cli: {
      command: "tabnas",
      package: "@tabnas/mcp",
      install: "npm install -g @tabnas/mcp",
      subcommands: ["parse", "validate", "diagnose", "test", "plugins", "compare", "mcp"],
      documentation: `${SITE_URL}/mcp#cli`,
    },
    skills: skillsData.skills.map((s) => s.name),
    package: "https://www.npmjs.com/package/@tabnas/mcp",
    documentation: `${SITE_URL}/mcp`,
    // The service reports its own running version, resource URIs and limits.
    handshake: `${MCP_URL}/.well-known/mcp`,
    privacy: `Document content is never logged, stored, or used for training. ${SITE_URL}/privacy`,
  };

  return new Response(JSON.stringify(body, null, 2) + "\n", {
    headers: {
      "content-type": "application/json; charset=utf-8",
      "cache-control": "public, max-age=3600",
      "access-control-allow-origin": "*",
    },
  });
};
