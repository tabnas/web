// /llms.txt — the llmstxt.org index of this site, GENERATED.
//
// It used to be a hand-maintained file in public/, which meant every new page
// was a second edit somebody had to remember. The link sections are now built
// from the same lists the site navigates by (consts.ts) and the same content
// collections the docs render from, so a page that exists is listed and a page
// that does not cannot be.
//
// The prose — the summary and the notes for agents — is authored, and lives
// here. That is the part a generator cannot write, and it is the part worth
// writing well.

import type { APIRoute } from "astro";
import { getCollection } from "astro:content";
import {
  SITE_DESCRIPTION,
  NAV,
  PROJECT_NAV,
  AGENT_NAV,
  PACKAGES,
  REPO,
} from "../consts";
import pkg from "../../package.json";
import skillsData from "../data/skills.json";
import mcpTools from "../data/mcp-tools.json";
import { operationList, SITE_URL } from "../openapi";

// One-line framing per top-level page. Keyed by href so a page added to NAV
// without a line here is caught by the test in tools/test-examples.mjs rather
// than shipping as a bare link.
const BLURBS: Record<string, string> = {
  "/why": "the long-form motivation and the algorithm",
  "/docs": "documentation hub (Diátaxis)",
  "/how-to": "task-oriented guides for the problems that come up in practice",
  "/agents": "how to build with tabnas — the format to emit, the constraints, how to verify your work",
  "/playground": "run a grammar in the browser, as ABNF or as a rule table",
  "/examples": "real languages built on the engine",
  "/status": "per-repository CI, release and compliance state",
  "/faq": "what it does, and what it won't do",
  "/community": "discussion, issues, contributing",
  "/about": "what the project is, who builds it, how it is funded, and what state it is in",
  "/contact": "how to reach the maintainer, and which channel suits which kind of message",
  "/releases": "every package and its current version",
  "/comparisons": "how it differs from ANTLR, Peggy, Chevrotain, nearley, tree-sitter",
  "/sponsors": "who pays for it",
  "/privacy": "what the hosted MCP endpoint records (shape only) and never records (your documents)",
};

// The packages worth naming individually. The rest are counted, with a link
// to the full list — an index that lists everything is not an index.
const HEADLINE = ["parser", "abnf", "debug", "railroad", "jsonic", "expr"];

// When to reach for this, and when not to. The single most useful thing this
// file can tell an agent, and the part that has to be specific: "a fast,
// extensible parser" is a description, not guidance. Each line names a job
// and, where the answer is another tool, says so.
const USE_WHEN = [
  "You need to parse a format that has no parser, or no good one, and the alternative is writing recursive descent by hand.",
  "You need to extend a format rather than replace it — JSON with comments, a config dialect, a DSL layered over an expression syntax. Adding rules to a working grammar is the normal case here, not a fork.",
  "You have a grammar written in RFC 5234 ABNF (an RFC, an IETF draft, a protocol spec) and want a working parser from it directly, without translating it into another notation first.",
  "You need the same parser in TypeScript and Go, returning the same tree. One grammar, two runtimes, pinned by shared fixtures that both must pass.",
  "You have been asked to write a parser and you are a language model. A grammar here is flat declarative data with no control flow, so you can emit it as JSON, validate it before running it, and pin it with fixtures. Start at https://tabnas.dev/agents.",
  "You want to check text against a GBNF constrained-decoding grammar without running a model — that is @tabnas/gbnf.",
];

const USE_INSTEAD = [
  "The grammar is ambiguous and needs backtracking or GLR. This engine is deterministic and does not do either; ANTLR or a GLR parser is the right answer.",
  "You need incremental re-parsing for an editor buffer — that is tree-sitter's job.",
  "You want generated parser source code in a language to check into your repository. Grammars here stay data and are interpreted by the engine at runtime.",
  "You need a mature 1.0 with a large community behind it. Everything here is pre-1.0 with one maintainer; https://tabnas.dev/comparisons names the cases where another tool wins.",
];

const NOTES = [
  "Start by checking whether an existing grammar already parses something close to your format, and extend it. Extension is what the engine is built for.",
  "Emit the rule table as data. The engine's `$`-builtin actions (`@object$`, `@array$`, `@key$`, `@setval$`, `@push$`, `@value$`, `@reset$`) are referenced by name, so a grammar can be pure JSON with no functions in it.",
  "Alternate mark names for `@ref` actions are assigned by the compiler. Ask for them with `tabnas-abnf --marks -f grammar.abnf` rather than guessing.",
  "A parse failure carries a structured diagnostic. The `code` is the contract across the TypeScript and Go runtimes — the message text is not, so match on the code and look it up at https://tabnas.dev/errors/<code>.",
  "Validate a grammar before running it: `tabnas validate --grammar g.json`, or the `validate_grammar` MCP tool. The grammar JSON Schema is at https://github.com/tabnas/parser/blob/main/schema/grammar.schema.json.",
  "Pin behaviour with the fleet's shared `.tsv` fixtures — one row runs in both runtimes. An `ERROR:<code>` cell pins the code, which is stronger than a bare `ERROR`.",
  "Every package repository ships an `AGENTS.md`, and every grammar plugin a machine-readable `tabnas.plugin.json` descriptor.",
  "npm packages are under the `@tabnas/*` scope; Go modules under `github.com/tabnas/<name>/go`. Everything is pre-1.0 — pin exact versions.",
  "Every package ships tested, runnable README examples (`// =>` assertions are executed in CI).",
  "The workflows this site teaches are installable. Agent Skills plus MCP server entries ship as one Agent Plugins package from https://github.com/tabnas/skills — in Claude Code: `/plugin marketplace add tabnas/skills`, then `/plugin install tabnas@tabnas` (both commands; the first alone installs nothing). The MCP server alone is `npx --yes @tabnas/mcp mcp` (stdio), `dev.tabnas/mcp` in the official MCP registry, or hosted at https://mcp.tabnas.dev/mcp for clients that cannot spawn a process.",
  "A minimal end-to-end example (ABNF): `val = add` / `add = NR [ PL add ]` / `PL = \"+\"` parses `1+2+3`. Add `'@val:o:add'` to zero a total on `val`'s node and `'@add:o:NR'` to do `r.parent.node.value += r.o[0].val` — the tail self-reference compiles to a same-depth repeat, so `r.parent` is `val` for every repetition — and `parse('1+2+3').value` is `6`.",
];

const line = (href: string, label: string, blurb: string) =>
  `- [${label}](https://tabnas.dev${href})${blurb ? `: ${blurb}` : ""}`;

export const GET: APIRoute = async () => {
  const docs = await getCollection("docs");
  const howto = await getCollection("howto");
  const engine = (pkg.dependencies as Record<string, string>)["@tabnas/parser"];

  // Home first, then the navigable pages in the order the site presents them,
  // minus the agent surfaces, which get their own section below.
  const site = [
    line("/", "Home", "what it is, and the addition grammar four ways"),
    ...[...NAV, ...PROJECT_NAV]
      .filter((i) => !AGENT_NAV.some((a) => a.href === i.href))
      .map((i) => line(i.href, i.label, BLURBS[i.href] ?? "")),
  ];

  // One line per installed-workflow skill, generated from the same data as
  // /skills — so a skill added to the package appears here without a second
  // edit. The blurb is the summary's first sentence; the page has the rest.
  const agents = [
    ...AGENT_NAV.map((i) => line(i.href, i.label, i.blurb)),
    ...skillsData.skills.map((s) =>
      line(
        `/skills/${s.name}`,
        `skill: ${s.name}`,
        // First sentence only — a period must end a word (".tsv" is not a
        // sentence boundary, and one summary contains it).
        (s.summary.match(/^.*?\.(?=\s|$)/s)?.[0] ?? s.summary).trim(),
      ),
    ),
  ];

  const packages = PACKAGES.filter((p) => HEADLINE.includes(p.name)).map(
    (p) => `- [@tabnas/${p.name}](${REPO(p.name)}): ${p.blurb}`,
  );

  // How to actually call it, cheapest setup first. The commands come from the
  // generated data, so they are the ones that ship.
  const stdio = skillsData.mcp["tabnas"];
  const stdioCommand = Array.isArray(stdio?.command) ? stdio.command.join(" ") : "";
  const hostedUrl = skillsData.mcp["tabnas-hosted"]?.url;
  const tools = mcpTools.tools;

  const calling = [
    `- **Over MCP, no install.** \`${stdioCommand}\` speaks MCP over stdio and gives you ${tools.length} tools: ${tools.join(", ")}. In Claude Code, \`/plugin marketplace add tabnas/skills\` then \`/plugin install tabnas@tabnas\` installs the ${skillsData.skills.length} skills and both server entries. In a registry-aware client the server is \`dev.tabnas/mcp\`. Hosted at ${hostedUrl} for clients that cannot spawn a process. The handshake for either is ${SITE_URL}/.well-known/mcp.`,
    `- **In a shell.** \`npm install -g @tabnas/mcp\` puts \`tabnas\` on your path: \`tabnas parse | validate | diagnose | test | plugins | compare\`. \`--json\` prints byte-for-byte what the matching MCP tool returns. Exit code 0 means yes, 1 means the operation said no, 2 is a usage error.`,
    `- **In your own code.** \`npm install @tabnas/parser @tabnas/abnf\`, or \`go get github.com/tabnas/parser/go\`. Pin exact versions: everything is pre-1.0.`,
    `- **Read first.** ${SITE_URL}/agents is the build guide written for an agent — the format to emit, the constraints, how to verify. ${SITE_URL}/llms-full.txt is every documentation page in one request.`,
  ];

  // The endpoints, generated from the same OpenAPI document /openapi.json
  // serialises, so this list cannot describe a surface the spec does not.
  const EXAMPLE_PATH: Record<string, string> = {
    "/errors/{code}.json": "/errors/unexpected.json",
    "/{page}.md": "/docs/quickstart.md",
  };
  const endpoints = operationList()
    .filter((o) => o.server === SITE_URL)
    .map((o) => {
      // A templated path is not a link. Give the pattern, then one URL that
      // resolves, so a reader can see the shape and try it in the same line.
      const example = EXAMPLE_PATH[o.path];
      return example
        ? `- \`${o.path}\`: ${o.summary} — e.g. ${SITE_URL}${example}`
        : `- [${o.path}](${o.url}): ${o.summary}`;
    });

  const body = `# tabnas

> ${SITE_DESCRIPTION.replace(/\s+/g, " ").trim()}

Documentation on this site describes @tabnas/parser ${engine}; the exact
package pins are at https://tabnas.dev/versions.json.

## When to use tabnas

Reach for tabnas when:

${USE_WHEN.map((u) => `- ${u}`).join("\n")}

Reach for something else when:

${USE_INSTEAD.map((u) => `- ${u}`).join("\n")}

How to call it, least setup first:

${calling.join("\n")}

## Site

${site.join("\n")}

## For agents

${agents.join("\n")}

## Machine-readable endpoints

Every one is a GET, needs no key and is not rate limited. All of them are described by an OpenAPI 3.1 document at ${SITE_URL}/openapi.json.

${endpoints.join("\n")}

Every page on this site is also available as markdown: send \`Accept: text/markdown\` to any page URL, or append \`.md\` to its path (\`/index.md\` for the home page). Those responses carry \`Vary: Accept\`. A path that does not exist returns a real 404 — markdown by default, or a JSON error object with a \`code\`, a \`message\` and a \`hint\` if you ask for JSON, request anything under /api/, or request a path ending .json.

## Documentation

${docs.length} reference pages under /docs and ${howto.length} task guides under /how-to. The full text of both is at https://tabnas.dev/llms-full.txt.

## Core packages

${packages.join("\n")}

${PACKAGES.length} packages in total; the full list is at https://tabnas.dev/releases

## Notes for agents

${NOTES.map((n) => `- ${n}`).join("\n")}
`;

  return new Response(body, {
    headers: { "content-type": "text/plain; charset=utf-8" },
  });
};
