# Agents Guide — web

## What this project is

The source of **[tabnas.dev](https://tabnas.dev)** — the project site and
documentation for the tabnas parsing engine. An [Astro](https://astro.build)
site deployed to Cloudflare Workers.

Unlike every other repo in the org, this one ships no library: nothing here is
published to npm or importable as a Go module. It **consumes** `@tabnas/parser`
and `@tabnas/abnf` from npm, so the playground runs the real engine in the
reader's browser rather than a mock.

## Always use the latest tabnas modules

**This is the rule most likely to be broken, and it has bitten the site
already.** The playground, the docs, and every code example on the site must
run against the *current published* versions of the tabnas packages.

Before changing anything that touches the engine — and as a routine check —
compare what is installed against what is published:

```bash
npm view @tabnas/parser version
npm view @tabnas/abnf version
node -p "require('./node_modules/@tabnas/parser/package.json').version"
node -p "require('./node_modules/@tabnas/abnf/package.json').version"
```

If they differ, update and pin exactly:

```bash
npm install @tabnas/parser@latest @tabnas/abnf@latest
```

Pin **exact versions** in `package.json` (`"0.4.1"`, not `"^0.4.1"`). The
packages are pre-1.0, where `^0.3.2` means `>=0.3.2 <0.4.0` — a caret range
silently refuses the next minor and the site quietly falls behind. That is
exactly what happened: the site sat on `parser@0.3.2` / `abnf@0.2.3` while
`0.4.1` / `0.2.4` were published, and it documented a *fixed compiler bug* as
intended behaviour. `abnf@0.2.3` dissolved a production whose single
alternative was one rule reference, so `val = add` compiled to `val = NR [ PL
add ]` — `val` vanished from the tree. The site's own docs described that as
"`val = add` is an alias, the compiler flattens it". It was a bug, fixed in
0.2.4, and the stale pin is why nobody noticed.

After any bump, re-run the checks in **Verifying code examples** below. A minor
bump pre-1.0 can break things; the playground is the part most likely to go.

`src/consts.ts` also carries a hard-coded `version` per package for the
`/releases` table (the live values come from the npm registry at runtime, with
these as the fallback). Update them in the same commit.

## Repository map

| Path | What it is |
|---|---|
| `src/pages/` | Routes. `.astro` and `.mdx` files map to URLs. |
| `src/pages/index.astro` | Home page — the four-step grammar example lives here. |
| `src/pages/playground.astro` | Client-side playground. Imports the real engine. |
| `src/pages/docs/[...slug].astro` | Docs route. **Prerendered** — see Search below. |
| `src/content/docs/` | Docs content collection (Diátaxis: Start / Tutorials / How-to / Reference / Explanation). |
| `src/pages/how-to/` | Top-level how-to section: `index.astro` is the intro and index, `[slug].astro` the guides. |
| `src/content/howto/` | How-to content collection, grouped by `group` (see `HOWTO_GROUPS` in `consts.ts`). |
| `src/consts.ts` | Site metadata, nav, author, sponsor, contact, how-to groups, and the full package table. |
| `src/worker.ts` | The request Worker. `wrangler.json`'s `main`. See **The request Worker** below. |
| `src/openapi.ts` | The OpenAPI 3.1 document, built once and served three ways. |
| `src/errors.ts` | The error registry, assembled from the engine, plugin and C-ABI code sets. |
| `test/` | `node --test` suites over the Worker and the built output. |
| `src/components/Heading.astro` | Heading + `#` anchor for hand-written `.astro` pages. |
| `public/chess-game.js` | **Vendored build artifact**, not source. See below. |
| `src/layouts/` | `Base`, `DocsLayout`, `BlogPost`, `MdxPage`. |
| `src/styles/` | `tokens.css` (design tokens), `global.css`, per-page sheets. |
| `ROADMAP.md` | The site plan. **Read it before changing content or tone.** |

## The chess board on /examples

`/examples` shows a game played through `@tabnas/chess`, using the
`<chess-view>` custom element from that repo's `web/` directory. Two things
about it are worth knowing:

- **`@tabnas/chess-view` is an ordinary pinned dependency**, imported from a
  bundled `<script>` at the bottom of `examples.astro` — importing it is what
  registers the element. Update it the way every other dependency is updated.
  It was a vendored artifact in `public/` while the package was unpublished,
  and then for one version longer, because 0.1.2 still wrote ANSI escape
  codes into parse errors and a browser shows those as junk; 0.1.3 fixed it.
  The element was called `<chess-game>` before 0.1.2.
- **The theme is mirrored, not inherited.** The element's own `theme="auto"`
  follows `prefers-color-scheme`, but this site's theme is `data-theme` on
  `<html>`, which the reader can toggle against their OS. An inline script at
  the bottom of `examples.astro` copies one onto the other.

The game is Anderssen–Kieseritzky, London 1851. A game score records what was
played and carries no copyright of its own — the annotations written about a
game do, and there are none here — and an 1851 game settles it either way.
Every ply is checked against the legal move generator in `chess/web`; a typo
would show as a flagged move on the board rather than a wrong position.

## Tone: this is a project, not a product

`ROADMAP.md` is the authority; the short version:

- **No call-to-action buttons.** Plain links.
- **No conversion furniture** — no trust strips, no testimonials, no "N
  developers use X", no final CTA band.
- **Describe, don't pitch.** Plain headings, plain claims.
- **Say the unflattering parts.** Pre-1.0. One maintainer. `/comparisons` names
  cases where another tool is the right answer; `/faq` has a "Scope" section
  saying what the project won't do.
- **The motivation lives in `/why`** — it is the source document for the
  site's content. The thesis is *extensible* + *a compile target for agents*.
  The TypeScript and Go implementations are an implementation detail, not the
  headline.

An earlier pass built this site from a dev-tool *landing page* playbook and it
read like a SaaS product. If you find yourself adding a stat strip or a "Get
started" button, re-read `ROADMAP.md § The rule`.

## Verifying code examples

**Every code sample on this site must be executed before it ships.** This has
caught real bugs more than once — the quickstart shipped an action that
returned `1` where the page claimed `6`, and a docs page described an API
(`node.value`) that throws.

The packages are installed here, so a scratch ESM file is all it takes:

```bash
cat > /tmp/check.mjs <<'EOF'
import { Tabnas } from '@tabnas/parser'
import { abnf } from '@tabnas/abnf'
// paste the sample, assert the result the page claims
EOF
node /tmp/check.mjs
```

Useful when an `@ref` action doesn't fire: ask the compiler which marks a
grammar actually has, rather than guessing at names.

```bash
npx tabnas-abnf --marks -f grammar.abnf
```

### The how-to guides

`src/content/howto/` uses eight packages this repo does **not** depend on —
`csv`, `expr`, `directive`, `multisource`, `debug`, `railroad`, `json`,
`jsonic`. They are deliberately not in `package.json`: the site ships none of
them, and a static site should not carry eight packages it never imports.

To re-verify those samples after a version bump, install them into a scratch
directory outside the repo and run each sample there:

```bash
mkdir -p /tmp/verify && cd /tmp/verify
npm init -y >/dev/null && npm pkg set type=module
npm install @tabnas/{parser,abnf,json,jsonic,csv,expr,directive,multisource,debug,railroad}@latest
```

Every `// =>` on those pages is a value the engine actually returned. Some of
them are non-obvious and were arrived at by experiment — the flat tree from
the ABNF left-recursion rewrite, the `\n\n` run lexing as one `#LN`, the
`[['#OB','#OS']]` alternation nesting, and the fact that an *unset* counter
reads as `0` (so `lt` passes and `gt` does not, and `exist` is the only way to
tell "never counted" from "counted zero" — before 0.6 an unset counter
compared as `true` against every `lt`/`gt` limit). Do not "tidy" one without
running it.

Known package gaps found while writing these, both worked around rather than
documented as working: `@tabnas/hoover@0.2.2`'s `val` alternate does not
install against `@tabnas/parser@0.5.0` (so hoover has no code sample on the
site), and `@tabnas/csv`'s `csv_extra_field` error template uses `$fsrc` where
the engine's injector expects `{fsrc}`, so the placeholder is printed
literally.

The canonical addition grammar, which appears four ways on the home page and
again in the quickstart, is:

```abnf
val = add
add = NR [ PL add ]
PL  = "+"
```

If you change it in one place, change it everywhere: `src/pages/index.astro`,
`src/content/docs/quickstart.md`, `src/content/docs/abnf-grammars.md`, and the
`addition` preset in `src/pages/playground.astro`.

## Headings and anchors

Every content heading is linkable.

- **Markdown / MDX** — automatic, via `rehype-slug` +
  `rehype-autolink-headings` in `astro.config.mjs`.
- **Hand-written `.astro`** — use `components/Heading.astro`, which emits the
  same markup. It takes an explicit `id`; keep ids stable across edits, since
  they are public URLs.
- **Navigation labels are not headings.** Footer columns, docs sidebar groups
  and "On this page" are `<p>`, so the heading outline stays content-only.
  Don't promote them back to `<h2>`.
- One deliberate exception has an id but no visible `#`, because a nested
  `<a>` inside an `<a>` is invalid HTML: linked `<Card href>` headings.

Astro's scoped styles do **not** reach a child component's elements. A page
that styles bare `h2 { … }` will stop working the moment that heading becomes
`<Heading>`. Use `.container :global(h2)` instead.

## Docs search

`/docs` is served by **Pagefind**, which indexes static HTML on disk. This is
why the site is `output: "static"` — while it was `output: "server"` nothing
reached disk, the index came out empty, and the search box disabled itself with
"Search unavailable".

- `npm run build` runs `astro build` then `pagefind --site dist`.
- The docs article carries `data-pagefind-body` so the sidebar and footer are
  not indexed on every page.
- Search **does not work under `astro dev`** — Pagefind runs post-build. Use
  `npm run preview` to test it. "Search unavailable" in dev is expected.

## Build & test

Node **22.18 or newer** (the tests import `.ts` sources directly, and
unflagged type stripping landed in 22.18).

```bash
npm install
npm run dev        # localhost:4321, no Pagefind index, no markdown twins
npm run build      # astro build + pagefind + markdown twins
npm run preview    # build, then wrangler dev — the real runtime
npm run test       # node --test over test/ (needs a build first)
npm run check      # everything: check-ax, examples, build, tsc, test, deploy --dry-run
npm run deploy     # wrangler deploy
```

`npm test` runs against `dist/`, so build first — `npm run check` does both in
order. The suites are:

- `test/worker.test.mjs` — the Worker's behaviour, with `test/assets.mjs`
  standing in for the ASSETS binding and serving the real `dist/`. This is the
  only place the negotiation, the error contract and the 404 are tested, since
  none of it is visible in the static output.
- `test/artifacts.test.mjs` — what the build put on disk: a markdown twin per
  page (and every link its page carries), the OpenAPI document's shape, the
  JSON-LD graph, robots.txt, the MCP manifest, the catalogue endpoints, and
  the trust anchors. It also validates **the actual JSON responses against the
  schemas the document publishes**, with ajv. That one is not decoration: the
  first version of the spec declared an error-code field the response never
  had and required a `message` that is null for every plugin-only code, so a
  generated client would have rejected a valid answer.

Before pushing, at minimum:

```bash
npm run build && npx tsc --noEmit && npm test
```

Then load the pages you touched. A quick sweep for broken routes:

```bash
for p in / /why /docs /agents /playground /examples /faq /releases \
         /comparisons /community /sponsors; do
  printf '%-16s %s\n' "$p" "$(curl -s -o /dev/null -w '%{http_code}' localhost:4321$p)"
done
```

## Deployment

Cloudflare Workers via `wrangler.json`, `output: "static"` in
`astro.config.mjs` — every page is prerendered.

**Deployment is automatic.** Cloudflare builds and publishes the site itself
when changes land on `main`; merging a pull request is the deploy step. How
pull requests are opened is its own section — see **Pull requests** below.

Do not run `npm run deploy` (`wrangler deploy`) **by hand** as part of shipping
a change. It is not a disabled script: `npm run deploy` IS the Builds
pipeline's deploy command, so it is what runs on every merge — from
Cloudflare's builder, against a clean checkout that just ran `npm run build`.
Run it from your working tree and you publish whatever `dist/` is sitting
there, which may be weeks old; `dist/` is gitignored and nothing keeps it
fresh. The script stays for manual recovery, and an agent session usually has
no Cloudflare credentials (`wrangler whoami` reporting "not authenticated" is
expected, not a broken environment).

The Worker is **`tabnas-web`**, and `wrangler.json` carries its triggers —
`tabnas.dev` and `www.tabnas.dev` as custom domains. Keep them there. They
lived only in the dashboard until 2026-08-19, which meant nothing in this repo
recorded what actually served the site.

`main` is `src/worker.ts` (see **The request Worker**), so a deploy ships that
file plus `dist/` as assets. `wrangler types` regenerates
`worker-configuration.d.ts` — rerun it after changing `wrangler.json`.

So "publish this" means: build clean, merge to `main`, and check the live site
a few minutes later.

The site was previously behind HTTP Basic Auth while under construction
(`src/middleware.ts` plus `run_worker_first` in `wrangler.json`). **That gate
has been removed.** Every page is still prerendered (`output: "static"`);
`run_worker_first` is back, but for content negotiation rather than a gate, and
the Worker is `src/worker.ts` rather than Astro middleware — middleware could
not do the job, for the reason given above. If a `SITE_PASSWORD` secret is
still configured on the Worker it is inert and should be deleted from the
Cloudflare dashboard.

## The agent-facing surfaces

These routes exist for agents rather than readers, and **all of them are
generated** — none is a page to hand-edit:

| Route | Built from |
|---|---|
| `/skills`, `/skills/<name>` | `src/data/skills.json` ← the `tabnas/skills` repository (frontmatter, section outlines, marketplace name) |
| `/mcp` | the same file's `mcp` entry ← `tabnas/skills`' `mcp.json` |
| `/errors`, `/errors/<code>` | `src/data/error-codes.json` ← `parser/schema/error-codes.json`, plus `src/data/plugins.json` ← every `<repo>/tabnas.plugin.json` |
| `/versions.json` | this repo's own `package.json` dependency pins |
| `/packages.json` | `src/consts.ts`'s `PACKAGES` |
| `/errors.json`, `/errors/<code>.json` | `src/errors.ts`, which assembles the same three code sets `/errors/<code>` reasons about |
| `/openapi.json`, `/openapi.yaml`, `/api` | `src/openapi.ts` — one document, serialised twice and rendered once |
| `/.well-known/mcp` | `src/data/skills.json` + `src/data/mcp-tools.json` |
| `/robots.txt` | `src/pages/robots.txt.ts` |
| `/<page>.md` | the built HTML, converted by `tools/gen-markdown.mjs` |
| `/llms.txt`, `/llms-full.txt` | `src/consts.ts` navigation + the `docs` and `howto` content collections |

`src/data/*.json` is **committed and generated**, because neither source can be
imported: `@tabnas/parser`'s npm package ships only `LICENSE` and `dist` (so
`schema/` is not in it), and `tabnas/skills` is an Agent Plugins repository
rather than a package. Regenerate from sibling checkouts with:

```bash
npm run gen-ax-data     # rewrite src/data/*.json from ../parser, ../skills, ../<plugins>
npm run check-ax        # fail if they are stale, or if a nav page has no llms.txt line
```

`check-ax` runs as the first step of `npm run check`. It says nothing about
staleness when the siblings are not checked out, so it does not fail a CI job
that clones only this repo.

Two rules worth keeping:

- **Do not restate a version.** `/versions.json` and the docs banner read
  `package.json`; `/errors` reads the version recorded in the generated
  registry. Those are different facts — the catalogue tracks the parser
  repository, the pin is what this site's examples run against — so where both
  appear, the page states both rather than quietly picking one.
- **A plugin's error message text is not copied here**, only the code and the
  declaring package. The message lives in that plugin's own catalogue, and a
  copy would be a second source of truth for something already generated once.

If `@tabnas/mcp` is ever published it bundles the same schemas in its own
`data/`; at that point `error-codes.json` can become a dependency import and
half of `tools/gen-ax-data.mjs` goes away.

### The request Worker

`wrangler.json`'s `main` is **`src/worker.ts`**, not the Cloudflare adapter's
generated `dist/_worker.js`. The adapter still emits that file and
`.assetsignore` still keeps it out of the asset upload; nothing deploys it.

The Worker exists for four behaviours a static asset server cannot express,
all of them for machine callers:

1. **Markdown content negotiation** ([acceptmarkdown.com][am]). `Accept:
   text/markdown` on a page URL serves that page's markdown twin from the same
   URL, with `Vary: Accept` so a CDN cannot hand an agent the cached HTML. A
   caller that names nothing, or only a wildcard, still gets HTML.
2. **Structured JSON errors** on the machine surface — anything under `/api/`
   or `/.well-known/`, or ending `.json`/`.yaml`. `{error: {status, code,
   message, hint, …}}`, with `code` one of `not_found`,
   `method_not_allowed`, `not_acceptable`.
3. **A recoverable 404.** Markdown for a bare client, the designed
   `/404` page for a browser, the error object for a program. All three offer
   the same routes: `ENTRY_POINTS` is exported from `src/worker.ts` and
   rendered by `src/pages/404.astro`, and `check-ax` fails if that import
   goes away.
4. **Headers the files cannot carry themselves** — a content type for
   `/.well-known/mcp` (no extension, so nothing to infer from) and CORS on the
   public descriptions, errors included. An error body exists so a program can
   recover from it; one a browser client cannot read cross-origin is no use at
   the moment it is needed.

**A page is anything with a markdown twin; everything else on the machine
surface is data.** That one rule decides the response headers, and the two are
exclusive. It matters because `/api` is both by the letter of
`isMachinePath` — it is the API's own documentation page, and the prefix rule
is there so a probe at `/api/v1/whatever` gets a JSON error. Answering it as
data dropped its `Vary: Accept`, which is precisely the cache mix-up the
negotiation exists to prevent.

What the Worker deliberately does **not** do: refuse an existing page to a
caller whose `Accept` it cannot satisfy. RFC 9110 §12.5.1 permits disregarding
Accept rather than returning 406, and that is the right call for a
documentation site where plenty of tooling sends a careless header and wants
the page. The 406 is reserved for a caller that has ruled out every
representation that exists.

It also holds the site to one host: `www.tabnas.dev` is a second custom domain
on this same Worker, so without the 301 at the top of `fetch()` both hosts
serve every page and the apex is canonical only by `<link rel="canonical">`,
which search engines honour and nothing else does.

[am]: https://acceptmarkdown.com

Two things about this are easy to get wrong:

- **Astro middleware cannot do any of it.** The Cloudflare adapter
  short-circuits a prerendered route straight to `ASSETS` before the
  middleware chain runs (`handle()` in its server entrypoint), and with
  `output: "static"` every route is prerendered — so middleware never sees a
  page request. That is why this is a hand-written Worker and not
  `src/middleware.ts`.
- **A static route's response headers are discarded.** `new Response(body, {
  headers })` in `src/pages/*.json.ts` is honoured by `astro dev` and then
  thrown away by the build, which writes the body to a file. Production
  headers come from the asset server or from the Worker.

`assets.run_worker_first` lists what reaches the Worker: everything except
`/_astro/*`, `/pagefind/*`, `/fonts/*`, `/brand/*` and `/diagrams/*`. Adding a
static directory means adding it there **and** to `ASSET_PREFIXES` in
`src/worker.ts`.

`test/worker.test.mjs` covers all of it against the real `dist/`.

### Markdown twins

`tools/gen-markdown.mjs` runs after `pagefind` and converts every built page to
markdown: `dist/why/index.html` becomes `dist/why.md`, `dist/index.html`
becomes `dist/index.md`. It converts the **built HTML**, not the sources,
because half the pages have no markdown source (they are `.astro`) and a
hand-written second copy would drift — the same reason `llms-full.txt` is
generated.

It converts `[data-pagefind-body]` where a page declares one and `<main>`
otherwise, which reuses the site's own answer to "which part of this page is
the content".

**`data-pagefind-ignore` is not on the drop list, and must not go back on it.**
It means "keep this out of the search index", which is not the same as "this
is not content": the `/how-to` index marks its four guide groups with it so
their repeated card labels do not swamp a result, and eight guides mark the
line listing the packages they use. Dropping it cost `/how-to.md` all twelve
of its guide links — the whole point of that page. `test/artifacts.test.mjs`
now fails if any twin loses an internal link its page carries. Two conversions are custom: Shiki emits one `<span class="line">`
per line with no newline between them (the CSS breaks lines with
`display: block`), so code text is rebuilt by joining those spans; and a
`CodeTabs` block has all three panes in source order *after* all three tab
labels, so it is emitted pane by pane instead.

### Hosting the MCP server is out of scope for this repo

`astro.config.mjs` sets `output: "static"`, so nothing here renders at request
time and the Worker in front of the assets (above) cannot host an MCP
endpoint. The hosted server is a **separate Worker**
deployed from `tabnas/mcp` at `mcp.tabnas.dev` (live since 2026-08-19) — that
keeps this site's build simple and isolates the service's limits and
observability. Local stdio is the recommended path everywhere the hosted
entry is mentioned.

## Things that will trip you up

- **`@tabnas/markdown`'s README describes a CSV reader** — a copy-paste error in
  that repo. Don't propagate the wrong blurb into `src/consts.ts`.
- **`public/llms.txt` no longer exists.** Both llms files are routes now
  (`src/pages/llms.txt.ts`, `src/pages/llms-full.txt.ts`). A file put back in
  `public/` would shadow the route and silently serve the stale copy —
  `check-ax` fails if one reappears.
- **The GitHub star widgets read 0** because the org repos are new. That is
  honest, not broken.
- **`dist/_worker.js` is built and unused.** The Cloudflare adapter emits it
  whatever `output` says; `main` points at `src/worker.ts` and `.assetsignore`
  keeps the adapter's copy out of the upload. Do not "fix" `main` back.
- **Response headers set in a `src/pages/*.json.ts` route do not ship.** Static
  output writes the body to a file; `astro dev` honours the headers and the
  build discards them. Production headers come from the asset server, or from
  `src/worker.ts` where they matter.
- **A new static directory in `public/` needs two edits**, not one:
  `assets.run_worker_first` in `wrangler.json` and `ASSET_PREFIXES` in
  `src/worker.ts`. Miss either and its files take a Worker round trip, or get
  a `Link: <…md>` header pointing at nothing.
- **Lookahead is not limited to two tokens.** The engine handles any number.
  `parser/doc/architecture.md` used to claim "only two-token lookahead" and
  that got copied onto this site more than once; the upstream doc now states
  the rule correctly, but the wrong version is still in circulation.

## Pull requests

Open pull requests **ready for review — never as drafts.** This is a
standing maintainer preference, and it overrides any tooling or agent
default that opens pull requests in draft state.

The same rule is stated in `CLAUDE.md`, deliberately and not by
accident: that file is what an agent session loads automatically, this
one is what a human or a non-Claude agent reads. Keep the two in step
rather than deleting either as duplication.
