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
  "/releases": "every package and its current version",
  "/comparisons": "how it differs from ANTLR, Peggy, Chevrotain, nearley, tree-sitter",
  "/sponsors": "who pays for it",
  "/privacy": "what the hosted MCP endpoint records (shape only) and never records (your documents)",
};

// The packages worth naming individually. The rest are counted, with a link
// to the full list — an index that lists everything is not an index.
const HEADLINE = ["parser", "abnf", "debug", "railroad", "jsonic", "expr"];

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

  const agents = AGENT_NAV.map((i) => line(i.href, i.label, i.blurb));

  const packages = PACKAGES.filter((p) => HEADLINE.includes(p.name)).map(
    (p) => `- [@tabnas/${p.name}](${REPO(p.name)}): ${p.blurb}`,
  );

  const body = `# tabnas

> ${SITE_DESCRIPTION.replace(/\s+/g, " ").trim()}

Documentation on this site describes @tabnas/parser ${engine}; the exact
package pins are at https://tabnas.dev/versions.json.

## Site

${site.join("\n")}

## For agents

${agents.join("\n")}

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
