// Global site data — imported anywhere with `import { ... } from '../consts'`.

export const SITE_TITLE = "tabnas";
export const SITE_TAGLINE = "An extensible parsing engine, and a compile target for agents";
export const SITE_DESCRIPTION =
  "tabnas is a parsing engine that can handle any language. Grammars are data, " +
  "so you extend one that already works instead of starting over — and an agent " +
  "can write one directly.";

// Irish: "Tábla na nAistrithe" — a table of translations (i.e. a grammar).
export const SITE_MOTTO = "Tábla na nAistrithe";

export const GITHUB_ORG = "https://github.com/tabnas";
export const NPM_ORG = "https://www.npmjs.com/org/tabnas";
export const STATUS_URL = "https://tabnas.github.io/status/";

// Who writes it. Open source projects say so; products don't.
export const AUTHOR = {
  name: "Richard Rodger",
  url: "https://richardrodger.com",
  github: "https://github.com/rjrodger",
};

// Primary navigation.
export const NAV: { href: string; label: string }[] = [
  { href: "/why", label: "Why" },
  { href: "/docs", label: "Docs" },
  { href: "/how-to", label: "How to" },
  { href: "/agents", label: "Agents" },
  { href: "/playground", label: "Playground" },
  { href: "/examples", label: "Examples" },
  { href: "/status", label: "Status" },
  { href: "/faq", label: "FAQ" },
  { href: "/community", label: "Community" },
];

// How-to guide groups, in the order they appear in the sidebar and on the
// /how-to index. The strings must match the `group` enum in
// content.config.ts; the blurb is the one-line framing on the index page.
export const HOWTO_GROUPS: { name: string; blurb: string }[] = [
  {
    name: "Composing grammars",
    blurb:
      "Assemble a language out of pieces that already work — other sources, " +
      "expression syntax, and plugins that take options.",
  },
  {
    name: "Shaping the parse",
    blurb:
      "The rule table itself: how repetition and nesting are expressed, how " +
      "the engine picks an alternate, and what changes when newlines matter.",
  },
  {
    name: "Feeding the lexer",
    blurb:
      "Everything that happens before the rules run — the tokens your " +
      "language needs, and the ones it should throw away.",
  },
  {
    name: "Working on a grammar",
    blurb: "Seeing what a grammar does, telling the reader what went wrong, and keeping it honest.",
  },
];

// Secondary pages — surfaced in the footer rather than the header.
export const PROJECT_NAV: { href: string; label: string }[] = [
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
  { href: "/releases", label: "Releases" },
  { href: "/comparisons", label: "Other parsers" },
  { href: "/sponsors", label: "Sponsors" },
  { href: "/privacy", label: "Privacy" },
];

// The agent-facing surfaces. Their own list because llms.txt is generated
// from it: these are the pages an agent should be able to find without
// already knowing they exist, so adding one must not mean remembering to
// list it in a second place. `blurb` is the one-line framing llms.txt uses.
export const AGENT_NAV: { href: string; label: string; blurb: string }[] = [
  {
    href: "/agents",
    label: "Agents",
    blurb:
      "how to build with tabnas — the format to emit, the constraints, how to verify your work",
  },
  {
    href: "/skills",
    label: "Skills",
    blurb:
      "portable Agent Skills for authoring, debugging, testing and shipping grammars — one Agent Plugins package, installable in Claude Code, with a page per skill at /skills/<name>",
  },
  {
    href: "/mcp",
    label: "MCP",
    blurb:
      "connect an agent over MCP — local stdio or hosted, dev.tabnas/mcp in the official registry, and the same tools as the `tabnas` command-line tool",
  },
  {
    href: "/errors",
    label: "Error reference",
    blurb:
      "every error code the engine and its plugins raise; the code, not the message, is the cross-runtime contract",
  },
  {
    href: "/api",
    label: "API",
    blurb:
      "every machine-readable endpoint this site serves, described by an OpenAPI 3.1 document at /openapi.json — plus markdown content negotiation, and the shape of an error response",
  },
  {
    href: "/versions.json",
    label: "versions.json",
    blurb: "machine-readable: which package versions this documentation describes",
  },
];

// Social / external presence. Add handles as they're confirmed; the header
// and footer render whatever is listed here.
export const SOCIALS: { href: string; label: string; icon: string }[] = [
  { href: GITHUB_ORG, label: "GitHub", icon: "github" },
];

// Sponsorship — Voxgig backs tabnas as open source.
export const SPONSOR = {
  name: "Voxgig",
  url: "https://voxgig.com",
  blurb: "Development of tabnas is sponsored by Voxgig.",
};

// Who to write to. This is the address CODE_OF_CONDUCT.md already publishes,
// stated once here so /contact, the JSON-LD and the error responses cannot
// disagree about it.
export const CONTACT_EMAIL = "richard@ricebridge.com";

export const DISCUSSIONS = `${GITHUB_ORG}/parser/discussions`;
export const ISSUES = `${GITHUB_ORG}/parser/issues`;

/**
 * The project's identity, as schema.org Organization fields.
 *
 * Every value is a fact already published somewhere the reader can check —
 * the GitHub org, the npm scope, the licence, the Code of Conduct.
 *
 * `address` is the country and nothing else, by decision rather than
 * oversight: the project is based in Ireland, and that is the whole of what
 * it publishes about where it is. A PostalAddress with only
 * `addressCountry` is valid schema.org, and it is enough to answer "where is
 * this from" without publishing a street for a one-maintainer project. Add
 * the rest of the fields here if that changes; the JSON-LD emits whatever
 * this object holds.
 */
export const ORG: {
  name: string;
  description: string;
  email: string;
  address: {
    streetAddress?: string;
    addressLocality?: string;
    addressRegion?: string;
    postalCode?: string;
    addressCountry?: string;
  } | null;
  sameAs: string[];
} = {
  name: "tabnas",
  description:
    "The tabnas project: an extensible, rule-table parsing engine with TypeScript and Go " +
    "runtimes, published as the @tabnas npm scope and as Go modules under github.com/tabnas.",
  email: CONTACT_EMAIL,
  // ISO 3166-1 alpha-2, which is the form schema.org recommends. Ireland.
  address: { addressCountry: "IE" },
  sameAs: [GITHUB_ORG, NPM_ORG, AUTHOR.url],
};

// Every package in the org. `version` is recorded here by hand and can lag a
// release; keep it in step when bumping the pinned deps (see AGENTS.md).
// /releases renders these server-side and then replaces each one client-side
// with the live value from the npm registry, falling back to this when the
// fetch fails. Each is an npm package under @tabnas/* and a Go module under
// github.com/tabnas/<name>/go.
export type Tier = "engine" | "tooling" | "agent" | "grammar" | "plugin" | "cli";

export const PACKAGES: {
  name: string;
  tier: Tier;
  blurb: string;
  version: string;
  npm: boolean;
  go: boolean;
}[] = [
  // The engine.
  { name: "parser", tier: "engine", version: "0.8.11", npm: true, go: true,
    blurb: "The engine — a pluggable, rule-based parsing machine and a uniform syntax tree." },

  // Grammar authoring and inspection.
  { name: "abnf", tier: "tooling", version: "0.4.6", npm: true, go: true,
    blurb: "Compile RFC 5234 ABNF straight into a working grammar." },
  { name: "bnf", tier: "tooling", version: "0.1.9", npm: true, go: true,
    blurb: "The shared BNF-family compiler behind abnf, ebnf and gbnf." },
  { name: "debug", tier: "tooling", version: "0.3.5", npm: true, go: true,
    blurb: "Inspect a live grammar — describe it, render it back as ABNF." },
  { name: "railroad", tier: "tooling", version: "0.3.5", npm: true, go: true,
    blurb: "Render railroad (syntax) diagrams from a grammar." },
  { name: "support", tier: "tooling", version: "0.3.3", npm: true, go: true,
    blurb: "Shared .tsv fixture loaders and the error-code census helpers — the machinery behind every repo's two-runtime specs." },

  // Agent tooling. TypeScript-only — tooling over the engine, not a parity
  // package, so there is no Go module (the only entry with go: false).
  { name: "mcp", tier: "agent", version: "0.1.13", npm: true, go: false,
    blurb: "The MCP server and the unified tabnas CLI — the same seven operations from one core, listed in the MCP registry as dev.tabnas/mcp." },

  // Languages and data formats.
  { name: "json", tier: "grammar", version: "0.5.6", npm: true, go: true,
    blurb: "Standard JSON." },
  { name: "jsonc", tier: "grammar", version: "0.5.5", npm: true, go: true,
    blurb: "JSON with comments." },
  { name: "json5", tier: "grammar", version: "0.5.6", npm: true, go: true,
    blurb: "The JSON5 dialect." },
  { name: "jsonic", tier: "grammar", version: "0.6.5", npm: true, go: true,
    blurb: "A dynamic JSON parser that isn't strict and can be customised." },
  { name: "yaml", tier: "grammar", version: "0.5.6", npm: true, go: true,
    blurb: "YAML." },
  { name: "toml", tier: "grammar", version: "0.5.6", npm: true, go: true,
    blurb: "TOML." },
  { name: "ini", tier: "grammar", version: "0.5.6", npm: true, go: true,
    blurb: "INI files." },
  { name: "csv", tier: "grammar", version: "0.5.6", npm: true, go: true,
    blurb: "Delimited records — CSV, TSV, RFC 4180 quoting — into objects or arrays." },
  { name: "xml", tier: "grammar", version: "0.7.6", npm: true, go: true,
    blurb: "XML." },
  // Was a stub until 0.5.0 (2026-08-06), which replaced the parser outright
  // and took it from roughly 40% of CommonMark to the full 652/652 spec
  // suite. The blurb said "not yet implemented" for as long as that was true.
  { name: "markdown", tier: "grammar", version: "0.7.3", npm: true, go: true,
    blurb: "Markdown — the full CommonMark spec, 652/652 on the reference suite." },
  { name: "css", tier: "grammar", version: "0.5.5", npm: true, go: true,
    blurb: "CSS, into an AST that preserves declaration order and duplicate properties." },
  { name: "c", tier: "grammar", version: "0.5.5", npm: true, go: true,
    blurb: "C source, into a concrete syntax tree — every token, comment, and macro kept as-is." },
  { name: "proto", tier: "grammar", version: "0.4.5", npm: true, go: true,
    blurb: "Protocol Buffers .proto IDL (proto2, proto3, editions 2023/2024)." },
  { name: "zon", tier: "grammar", version: "0.5.5", npm: true, go: true,
    blurb: "Zig Object Notation, as used by build.zig.zon manifests." },
  { name: "feed", tier: "grammar", version: "0.6.6", npm: true, go: true,
    blurb: "RSS (0.90–2.0) and Atom (0.3, 1.0), normalised to one Atom-shaped result." },
  { name: "chess", tier: "grammar", version: "0.1.6", npm: true, go: true,
    blurb: "PGN and SAN — chess games and moves, tag pairs, variations and annotations." },
  { name: "gbnf", tier: "grammar", version: "0.1.7", npm: true, go: true,
    blurb: "llama.cpp GBNF — check text against a constrained-decoding grammar, with no model." },

  // Syntax plugins that layer onto a host grammar.
  { name: "expr", tier: "plugin", version: "0.5.7", npm: true, go: true,
    blurb: "Pratt-parser expressions — infix, prefix, suffix, ternary, with configurable precedence." },
  { name: "directive", tier: "plugin", version: "0.5.5", npm: true, go: true,
    blurb: "Directive syntax — token sequences like @name or add<1,2> that trigger custom parsing." },
  { name: "hoover", tier: "plugin", version: "0.3.5", npm: true, go: true,
    blurb: "String hoovering — block-delimited strings with unquoted internal spaces." },
  { name: "path", tier: "plugin", version: "0.3.5", npm: true, go: true,
    blurb: "Track the property path to each value as it is parsed." },
  { name: "multisource", tier: "plugin", version: "0.5.5", npm: true, go: true,
    blurb: "Merge multiple sources into one parse — a marked path is resolved and spliced in place." },

  // Command line.
  { name: "jsonic-cli", tier: "cli", version: "0.5.5", npm: true, go: true,
    blurb: "Command-line interface for @tabnas/jsonic." },
];

export const TIER_LABEL: Record<Tier, string> = {
  engine: "Engine",
  tooling: "Grammar tooling",
  agent: "Agent tooling",
  grammar: "Languages and formats",
  plugin: "Syntax plugins",
  cli: "Command line",
};

export const REPO = (name: string) => `${GITHUB_ORG}/${name}`;
export const NPM = (name: string) => `https://www.npmjs.com/package/@tabnas/${name}`;
export const GODOC = (name: string) => `https://pkg.go.dev/github.com/tabnas/${name}/go`;
