// The OpenAPI description of everything this site serves to a machine.
//
// One document, three consumers: /openapi.json, /openapi.yaml and the /api
// page, which renders the operation list from this object rather than
// restating it. That is the same rule the rest of the agent surfaces follow —
// a second copy is a second thing to keep true.
//
// Two servers are described, because there are two. tabnas.dev is this static
// site: read-only, GET and HEAD, no authentication, nothing to rate limit.
// mcp.tabnas.dev is the hosted MCP endpoint, deployed from the `tabnas/mcp`
// repository — it is the only tabnas service that accepts a request body, and
// its bounds are the ones its own /.well-known/mcp reports.
//
// Nothing here is aspirational: every operation below is a URL that answers
// today, and the response schemas are the shapes those URLs actually return.

import { PACKAGES, ORG, AUTHOR, GITHUB_ORG, SITE_DESCRIPTION } from "./consts";
import { errorRegistry } from "./errors";
import mcpTools from "./data/mcp-tools.json";
import skillsData from "./data/skills.json";
import pkg from "../package.json";

export const SITE_URL = "https://tabnas.dev";
export const MCP_URL = "https://mcp.tabnas.dev";

/** The document's own version: the engine release the site documents. */
const engineVersion = (pkg.dependencies as Record<string, string>)["@tabnas/parser"];

const ERROR_CODES = errorRegistry().codes.map((c) => c.code);

const errorResponse = (description: string) => ({
  description,
  content: {
    "application/json": {
      schema: { $ref: "#/components/schemas/Error" },
    },
  },
});

export function buildOpenApi(): Record<string, unknown> {
  return {
    openapi: "3.1.0",
    info: {
      title: "tabnas.dev",
      summary: "The machine-readable surface of the tabnas documentation site.",
      description: [
        SITE_DESCRIPTION.replace(/\s+/g, " ").trim(),
        "",
        "This document describes what tabnas.dev serves to programs: the site index an agent",
        "should read first, the package and error-code catalogues, the MCP handshake, and the",
        "hosted MCP endpoint that runs the engine's tools over HTTP.",
        "",
        "Two things are true of every tabnas.dev operation and are not repeated on each one.",
        "First, the site is read-only and unauthenticated: GET and HEAD are the only methods,",
        "there are no keys, quotas or rate limits, and any other method answers 405 with the",
        "error object below. Second, every documentation page is content-negotiated — send",
        "`Accept: text/markdown` and the same URL returns clean markdown instead of HTML, with",
        "`Vary: Accept` set (acceptmarkdown.com). Appending `.md` to a page path fetches the",
        "same markdown without a header, and that form is described by getPageMarkdown below.",
        "",
        `The engine these endpoints describe is @tabnas/parser ${engineVersion}.`,
      ].join("\n"),
      version: engineVersion,
      contact: {
        name: `${ORG.name} maintainers`,
        email: ORG.email,
        url: `${SITE_URL}/contact`,
      },
      license: {
        name: "MIT",
        identifier: "MIT",
      },
      "x-maintainer": { name: AUTHOR.name, url: AUTHOR.url },
    },
    externalDocs: {
      description: "Documentation hub",
      url: `${SITE_URL}/docs`,
    },
    servers: [
      { url: SITE_URL, description: "The documentation site. Read-only, unauthenticated." },
      {
        url: MCP_URL,
        description:
          "The hosted MCP endpoint. Streamable HTTP; bounded by a 256 KB body cap and a " +
          "per-IP rate limit, both reported by its /.well-known/mcp.",
      },
    ],
    tags: [
      { name: "index", description: "Where an agent starts: the site index and this document." },
      { name: "catalogue", description: "Generated catalogues: package versions, packages, error codes." },
      { name: "content", description: "Documentation pages as markdown." },
      { name: "mcp", description: "Model Context Protocol: the manifest here, and the hosted server." },
    ],
    paths: {
      "/llms.txt": {
        get: {
          operationId: "getLlmsIndex",
          summary: "The llms.txt site index",
          description:
            "The llmstxt.org index for this site: one line per page with a short description " +
            "of what is on it, the installable agent distributions, and the notes an agent " +
            "should read before writing a grammar. Read this first.",
          tags: ["index"],
          responses: {
            200: {
              description: "The index, as markdown-flavoured plain text.",
              content: { "text/plain": { schema: { type: "string" } } },
            },
          },
        },
      },
      "/llms-full.txt": {
        get: {
          operationId: "getLlmsFull",
          summary: "Every documentation page in one file",
          description:
            "The full text of the documentation and how-to collections, concatenated in site " +
            "order, so a model can read the documentation without following links.",
          tags: ["index"],
          responses: {
            200: {
              description: "The full documentation text.",
              content: { "text/plain": { schema: { type: "string" } } },
            },
          },
        },
      },
      "/openapi.json": {
        get: {
          operationId: "getOpenApiJson",
          summary: "This document, as JSON",
          description: "The OpenAPI 3.1 description of every endpoint listed here.",
          tags: ["index"],
          responses: {
            200: {
              description: "An OpenAPI 3.1 document.",
              content: { "application/json": { schema: { type: "object" } } },
            },
          },
        },
      },
      "/openapi.yaml": {
        get: {
          operationId: "getOpenApiYaml",
          summary: "This document, as YAML",
          description: "The same OpenAPI 3.1 document, serialised as YAML.",
          tags: ["index"],
          responses: {
            200: {
              description: "An OpenAPI 3.1 document.",
              content: { "application/yaml": { schema: { type: "string" } } },
            },
          },
        },
      },
      "/versions.json": {
        get: {
          operationId: "getVersions",
          summary: "The package versions this documentation describes",
          description:
            "The site's own dependency pins, which are the versions every example on the site " +
            "was executed against. Use this to check whether a page describes the release you " +
            "are running.",
          tags: ["catalogue"],
          responses: {
            200: {
              description: "The pinned versions.",
              content: {
                "application/json": { schema: { $ref: "#/components/schemas/Versions" } },
              },
            },
          },
        },
      },
      "/packages.json": {
        get: {
          operationId: "getPackages",
          summary: "The package catalogue",
          description:
            "Every package in the project: its tier, what it parses or does, the recorded " +
            "release, and whether it ships as an npm package, a Go module, or both. Recorded " +
            "releases can lag the registry — /versions.json is the exact answer for the " +
            "versions this documentation describes.",
          tags: ["catalogue"],
          responses: {
            200: {
              description: "The catalogue.",
              content: {
                "application/json": { schema: { $ref: "#/components/schemas/PackageCatalogue" } },
              },
            },
          },
        },
      },
      "/errors.json": {
        get: {
          operationId: "getErrorRegistry",
          summary: "Every error code the engine and its plugins raise",
          description:
            "The full error registry. A parse failure carries a `code`, and that code — not " +
            "the message text — is the contract across the TypeScript and Go runtimes. Match " +
            "on the code, then look it up here for the hint and the declaring package.",
          tags: ["catalogue"],
          responses: {
            200: {
              description: "The registry.",
              content: {
                "application/json": { schema: { $ref: "#/components/schemas/ErrorRegistry" } },
              },
            },
          },
        },
      },
      "/errors/{code}.json": {
        get: {
          operationId: "getErrorCode",
          summary: "One error code",
          description:
            "The registry entry for a single error code: its message template, the hint " +
            "explaining what causes it, which runtimes raise it, and the human page for it.",
          tags: ["catalogue"],
          parameters: [
            {
              name: "code",
              in: "path",
              required: true,
              description: "The error code, exactly as it appears in a diagnostic.",
              schema: { type: "string", enum: ERROR_CODES },
              example: ERROR_CODES.includes("unexpected") ? "unexpected" : ERROR_CODES[0],
            },
          ],
          responses: {
            200: {
              description: "The entry.",
              content: {
                "application/json": { schema: { $ref: "#/components/schemas/ErrorCode" } },
              },
            },
            404: errorResponse("No such error code. The full list is at /errors.json."),
          },
        },
      },
      "/.well-known/mcp": {
        get: {
          operationId: "getMcpManifest",
          summary: "How to connect an agent over MCP",
          description:
            "The MCP handshake for this domain: both transports (local stdio via npx, and the " +
            "hosted streamable-HTTP endpoint), the tools and resources the server exposes, and " +
            "the registry name the server is published under.",
          tags: ["mcp"],
          responses: {
            200: {
              description: "The manifest.",
              content: {
                "application/json": { schema: { $ref: "#/components/schemas/McpManifest" } },
              },
            },
          },
        },
      },
      "/{page}.md": {
        get: {
          operationId: "getPageMarkdown",
          summary: "Any documentation page, as markdown",
          description:
            "Every page on this site has a markdown twin at its own path plus `.md`, generated " +
            "from the page that shipped. `Accept: text/markdown` on the page URL returns the " +
            "same bytes; this form is for callers that would rather not set a header. The " +
            "home page is /index.md.",
          tags: ["content"],
          parameters: [
            {
              name: "page",
              in: "path",
              required: true,
              description:
                "The page path without its leading slash and without a trailing slash — " +
                "`why`, `docs/quickstart`, `how-to/parse-errors`, `errors/unexpected`. May " +
                "contain slashes. `index` is the home page.",
              schema: { type: "string", pattern: "^[a-z0-9]+(?:[-/][a-z0-9_]+)*$" },
              examples: {
                home: { value: "index" },
                agentGuide: { value: "agents" },
                quickstart: { value: "docs/quickstart" },
              },
            },
          ],
          responses: {
            200: {
              description:
                "The page as markdown, with a small YAML frontmatter block carrying its " +
                "title, description and canonical URL.",
              content: { "text/markdown": { schema: { type: "string" } } },
            },
            404: errorResponse("No such page. /sitemap-index.xml lists every page."),
          },
        },
      },
      "/health": {
        get: {
          operationId: "getMcpHealth",
          summary: "Hosted MCP endpoint liveness",
          description: "A liveness check for the hosted MCP server, reporting its running version.",
          tags: ["mcp"],
          servers: [{ url: MCP_URL, description: "The hosted MCP endpoint." }],
          responses: {
            200: {
              description: "The service is up.",
              content: {
                "application/json": { schema: { $ref: "#/components/schemas/Health" } },
              },
            },
          },
        },
      },
      "/mcp": {
        post: {
          operationId: "callMcpTool",
          summary: "Call the hosted MCP server",
          description: [
            "The Model Context Protocol over streamable HTTP, as JSON-RPC 2.0. Standard MCP",
            "methods apply: `initialize`, `tools/list`, `tools/call`, `resources/list`,",
            "`resources/read`.",
            "",
            `The server exposes ${mcpTools.tools.length} tools — ${mcpTools.tools.join(", ")} —`,
            "and the fleet's contract files as resources. Full tool schemas come from",
            "`tools/list`; the tools and their contracts are documented at " + `${SITE_URL}/mcp.`,
            "",
            "Local stdio is the recommended transport (`npx --yes @tabnas/mcp mcp`): free,",
            "private, unlimited, and the same code. This endpoint exists for clients that",
            "cannot spawn a process, and it is bounded — a 256 KB request body cap and a",
            "per-IP rate limit, both reported by /.well-known/mcp. Document content is never",
            "logged, stored or used for training.",
          ].join("\n"),
          tags: ["mcp"],
          servers: [{ url: MCP_URL, description: "The hosted MCP endpoint." }],
          requestBody: {
            required: true,
            description: "A JSON-RPC 2.0 request.",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/JsonRpcRequest" },
                examples: {
                  initialize: {
                    summary: "Open a session",
                    value: {
                      jsonrpc: "2.0",
                      id: 1,
                      method: "initialize",
                      params: {
                        protocolVersion: "2025-06-18",
                        capabilities: {},
                        clientInfo: { name: "example-client", version: "1.0.0" },
                      },
                    },
                  },
                  listTools: {
                    summary: "List the tools and their schemas",
                    value: { jsonrpc: "2.0", id: 2, method: "tools/list" },
                  },
                  validateGrammar: {
                    summary: "Check a serialized grammar before running it",
                    value: {
                      jsonrpc: "2.0",
                      id: 3,
                      method: "tools/call",
                      params: { name: "validate_grammar", arguments: { grammar: {} } },
                    },
                  },
                },
              },
            },
          },
          responses: {
            200: {
              description: "A JSON-RPC 2.0 response.",
              content: {
                "application/json": { schema: { $ref: "#/components/schemas/JsonRpcResponse" } },
              },
            },
            405: errorResponse("The endpoint is POST-only; a GET says so."),
            413: errorResponse("The request body exceeded the 256 KB cap."),
            429: errorResponse("The per-IP rate limit was exceeded."),
          },
        },
      },
    },
    components: {
      schemas: {
        Error: {
          type: "object",
          description:
            "The error shape every tabnas.dev endpoint returns for a request it cannot " +
            "answer. `code` is stable and safe to branch on; `message` and `hint` are for a " +
            "reader, human or otherwise.",
          required: ["error"],
          properties: {
            error: {
              type: "object",
              required: ["status", "code", "message", "hint"],
              properties: {
                status: {
                  type: "integer",
                  description: "The HTTP status, repeated in the body.",
                  examples: [404, 405, 406],
                },
                code: {
                  type: "string",
                  description: "A stable machine-readable reason.",
                  enum: ["not_found", "method_not_allowed", "not_acceptable"],
                },
                message: { type: "string", description: "The HTTP reason phrase." },
                hint: {
                  type: "string",
                  description: "What to do instead. Written to be actionable, not decorative.",
                },
                documentation: { type: "string", format: "uri" },
                openapi: { type: "string", format: "uri" },
                resources: {
                  type: "object",
                  description: "The site's entry points, so a lost caller can recover in one hop.",
                  additionalProperties: { type: "string", format: "uri" },
                },
              },
            },
          },
        },
        Versions: {
          type: "object",
          required: ["site", "engine", "packages"],
          properties: {
            $comment: { type: "string" },
            site: { type: "string", format: "uri" },
            engine: {
              type: ["string", "null"],
              description: "The @tabnas/parser version this documentation describes.",
              examples: [engineVersion],
            },
            packages: {
              type: "object",
              description: "Every @tabnas package the site depends on, at an exact version.",
              additionalProperties: { type: "string" },
            },
          },
        },
        PackageCatalogue: {
          type: "object",
          required: ["site", "count", "packages"],
          properties: {
            $comment: { type: "string" },
            site: { type: "string", format: "uri" },
            count: { type: "integer" },
            tiers: {
              type: "object",
              description: "The tier keys used below, and the label each one carries on the site.",
              additionalProperties: { type: "string" },
            },
            packages: {
              type: "array",
              items: { $ref: "#/components/schemas/Package" },
            },
          },
        },
        Package: {
          type: "object",
          required: ["name", "tier", "description", "version", "npm", "go"],
          properties: {
            name: { type: "string", description: "The bare package name, without the scope." },
            tier: {
              type: "string",
              description: "What kind of package it is.",
              enum: ["engine", "tooling", "agent", "grammar", "plugin", "cli"],
            },
            description: { type: "string" },
            version: {
              type: "string",
              description: "The recorded release. Can lag the registry; /versions.json is exact.",
            },
            npm: {
              type: ["string", "null"],
              description: "The npm package name, or null if it does not ship to npm.",
            },
            go: {
              type: ["string", "null"],
              description: "The Go module path, or null if it does not ship as a Go module.",
            },
            repository: { type: "string", format: "uri" },
          },
        },
        ErrorRegistry: {
          type: "object",
          required: ["site", "engine", "codes"],
          properties: {
            $comment: { type: "string" },
            site: { type: "string", format: "uri" },
            engine: {
              type: "string",
              description: "The parser release the engine codes were generated from.",
            },
            count: { type: "integer" },
            codes: { type: "array", items: { $ref: "#/components/schemas/ErrorCode" } },
          },
        },
        ErrorCode: {
          type: "object",
          required: ["code", "message", "hint"],
          properties: {
            code: {
              type: "string",
              description: "The cross-runtime contract. Branch on this, never on the message.",
              enum: ERROR_CODES,
            },
            message: {
              type: "string",
              description:
                "The message template. `{name}` placeholders are filled from the diagnostic.",
            },
            hint: { type: "string", description: "What causes it, and what to do about it." },
            runtime: {
              type: "string",
              description: "Which runtimes raise it.",
              enum: ["both", "ts", "go"],
            },
            package: {
              type: ["string", "null"],
              description: "The declaring plugin package, or null for an engine code.",
            },
            url: { type: "string", format: "uri", description: "The human page for this code." },
          },
        },
        McpManifest: {
          type: "object",
          required: ["name", "servers", "tools"],
          properties: {
            $comment: { type: "string" },
            name: { type: "string" },
            version: {
              type: ["string", "null"],
              description: "The @tabnas/mcp release the stdio command pins.",
            },
            description: { type: "string" },
            registry: {
              type: "object",
              description: "Where the server is published in the official MCP registry.",
              properties: {
                name: { type: "string", examples: ["dev.tabnas/mcp"] },
                url: { type: "string", format: "uri" },
              },
            },
            servers: {
              type: "object",
              description:
                "One entry per transport, in the shape an MCP client's configuration takes.",
              additionalProperties: {
                type: "object",
                properties: {
                  type: { type: "string", enum: ["stdio", "streamable-http"] },
                  command: { type: "array", items: { type: "string" } },
                  url: { type: "string", format: "uri" },
                },
              },
            },
            transport: { type: "string", enum: ["stdio", "streamable-http"] },
            endpoint: {
              type: ["string", "null"],
              format: "uri",
              description: "The hosted streamable-HTTP endpoint.",
            },
            local: {
              type: ["string", "null"],
              description: "The recommended local stdio command.",
              examples: ["npx --yes @tabnas/mcp mcp"],
            },
            tools: { type: "array", items: { type: "string" } },
            cli: {
              type: "object",
              description:
                "The command-line tool the same package installs. Every subcommand mirrors one " +
                "MCP tool, and --json prints the bytes that tool returns.",
              properties: {
                command: { type: "string", examples: ["tabnas"] },
                package: { type: "string" },
                install: { type: "string" },
                subcommands: { type: "array", items: { type: "string" } },
                documentation: { type: "string", format: "uri" },
              },
            },
            skills: {
              type: "array",
              description: "The Agent Skills that ship alongside the server.",
              items: { type: "string" },
            },
            package: { type: "string", format: "uri" },
            documentation: { type: "string", format: "uri" },
            handshake: {
              type: "string",
              format: "uri",
              description:
                "The running service's own manifest, which reports its live version, resource " +
                "URIs and current limits.",
            },
            privacy: { type: "string" },
          },
        },
        Health: {
          type: "object",
          required: ["ok", "service"],
          properties: {
            ok: { type: "boolean" },
            service: { type: "string", examples: ["tabnas-mcp"] },
            version: { type: "string" },
          },
        },
        JsonRpcRequest: {
          type: "object",
          required: ["jsonrpc", "method"],
          properties: {
            jsonrpc: { type: "string", const: "2.0" },
            id: { type: ["string", "integer"] },
            method: {
              type: "string",
              description: "An MCP method.",
              examples: ["initialize", "tools/list", "tools/call", "resources/read"],
            },
            params: { type: "object", additionalProperties: true },
          },
        },
        JsonRpcResponse: {
          type: "object",
          required: ["jsonrpc"],
          properties: {
            jsonrpc: { type: "string", const: "2.0" },
            id: { type: ["string", "integer", "null"] },
            result: { type: "object", additionalProperties: true },
            error: {
              type: "object",
              properties: {
                code: { type: "integer" },
                message: { type: "string" },
                data: {},
              },
            },
          },
        },
      },
    },
    "x-mcp": {
      manifest: `${SITE_URL}/.well-known/mcp`,
      registry: "dev.tabnas/mcp",
      stdio: skillsData.mcp["tabnas"],
      http: skillsData.mcp["tabnas-hosted"],
    },
    "x-llms-txt": `${SITE_URL}/llms.txt`,
    "x-repository": `${GITHUB_ORG}/web`,
    "x-package-count": PACKAGES.length,
  };
}

/** One row per operation, for /api to render and for tests to check. */
export interface OperationSummary {
  method: string;
  path: string;
  server: string;
  url: string;
  operationId: string;
  summary: string;
  description: string;
  tag: string;
}

/**
 * The operations in this document, flattened. /api renders these rather than
 * listing the endpoints a second time, so the page and the spec cannot
 * describe different sets.
 */
export function operationList(): OperationSummary[] {
  const doc = buildOpenApi() as {
    servers: { url: string }[];
    paths: Record<string, Record<string, Record<string, unknown>>>;
  };
  const defaultServer = doc.servers[0].url;
  const rows: OperationSummary[] = [];

  for (const [path, item] of Object.entries(doc.paths)) {
    for (const [method, op] of Object.entries(item)) {
      const servers = op.servers as { url: string }[] | undefined;
      const server = servers?.[0]?.url ?? defaultServer;
      rows.push({
        method: method.toUpperCase(),
        path,
        server,
        url: server + path,
        operationId: String(op.operationId),
        summary: String(op.summary),
        description: String(op.description),
        tag: String((op.tags as string[] | undefined)?.[0] ?? ""),
      });
    }
  }
  return rows;
}
