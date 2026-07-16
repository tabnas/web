// Global site data — imported anywhere with `import { ... } from '../consts'`.

export const SITE_TITLE = "tabnas";
export const SITE_TAGLINE = "Define grammars, not parsers";
export const SITE_DESCRIPTION =
  "tabnas is a polyglot parser engine: define a grammar once and get a real " +
  "parser — the same grammar, the same syntax tree, in TypeScript and Go.";

// Irish: "Tábla na nAistrithe" — a table of translations (i.e. a grammar).
export const SITE_MOTTO = "Tábla na nAistrithe";

export const GITHUB_ORG = "https://github.com/tabnas";
export const NPM_ORG = "https://www.npmjs.com/org/tabnas";
export const STATUS_URL = "https://tabnas.github.io/status/";

// Primary navigation.
export const NAV: { href: string; label: string }[] = [
  { href: "/why", label: "Why" },
  { href: "/docs", label: "Docs" },
  { href: "/playground", label: "Playground" },
  { href: "/agents", label: "AI agents" },
  { href: "/blog", label: "Blog" },
  { href: "/community", label: "Community" },
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
  blurb: "tabnas is open source, sponsored by Voxgig.",
};

// Featured packages (core tier first). npm under @tabnas/*, Go under
// github.com/tabnas/<name>/go. Descriptions are one line each.
export const PACKAGES: {
  name: string;
  tier: "core" | "plugin";
  blurb: string;
  npm: boolean;
  go: boolean;
}[] = [
  { name: "parser", tier: "core", blurb: "The engine — define a grammar, get a parser and a uniform AST.", npm: true, go: true },
  { name: "abnf", tier: "core", blurb: "Compile RFC 5234 ABNF straight into a working grammar.", npm: true, go: true },
  { name: "debug", tier: "core", blurb: "Inspect a live grammar — describe it, render it back as ABNF.", npm: true, go: true },
  { name: "json", tier: "core", blurb: "A complete JSON grammar built on the engine.", npm: true, go: true },
  { name: "railroad", tier: "core", blurb: "Draw railroad (syntax) diagrams from a grammar.", npm: true, go: true },
  { name: "jsonic", tier: "plugin", blurb: "A forgiving, human-friendly JSON superset.", npm: true, go: true },
  { name: "yaml", tier: "plugin", blurb: "Parse YAML with the engine.", npm: true, go: true },
  { name: "csv", tier: "plugin", blurb: "Parse CSV/TSV into rows and records.", npm: true, go: true },
];

// Curated testimonials — add real quotes as they come in; the section only
// renders when this is non-empty (Evil Martians: even one early quote helps).
export const TESTIMONIALS: { quote: string; name: string; role?: string; url?: string }[] = [];

export const REPO = (name: string) => `${GITHUB_ORG}/${name}`;
export const NPM = (name: string) => `https://www.npmjs.com/package/@tabnas/${name}`;
export const GODOC = (name: string) => `https://pkg.go.dev/github.com/tabnas/${name}/go`;
