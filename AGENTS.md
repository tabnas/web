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
| `src/consts.ts` | Site metadata, nav, author, sponsor, how-to groups, and the full package table. |
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

```bash
npm install
npm run dev        # localhost:4321, no Pagefind index
npm run build      # astro build + pagefind
npm run preview    # build, then wrangler dev — the real runtime
npm run check      # astro build && tsc && wrangler deploy --dry-run
npm run deploy     # wrangler deploy
```

There is no unit test suite. Before pushing, at minimum:

```bash
npm run build && npx tsc --noEmit
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
when changes land on `main`; merging a pull request is the deploy step.

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

So "publish this" means: build clean, merge to `main`, and check the live site
a few minutes later.

The site was previously behind HTTP Basic Auth while under construction
(`src/middleware.ts` plus `run_worker_first` in `wrangler.json`). **That gate
has been removed** and the site is now fully static (`output: "static"`). If a
`SITE_PASSWORD` secret is still configured on the Worker it is inert and should
be deleted from the Cloudflare dashboard.

## The agent-facing surfaces

These routes exist for agents rather than readers, and **all of them are
generated** — none is a page to hand-edit:

| Route | Built from |
|---|---|
| `/skills`, `/skills/<name>` | `src/data/skills.json` ← the `tabnas/skills` repository (frontmatter, section outlines, marketplace name) |
| `/mcp` | the same file's `mcp` entry ← `tabnas/skills`' `mcp.json` |
| `/errors`, `/errors/<code>` | `src/data/error-codes.json` ← `parser/schema/error-codes.json`, plus `src/data/plugins.json` ← every `<repo>/tabnas.plugin.json` |
| `/versions.json` | this repo's own `package.json` dependency pins |
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

### Hosting the MCP server is out of scope for this repo

`astro.config.mjs` sets `output: "static"`, so the Worker serves assets only
and cannot host an MCP endpoint. The hosted server is a **separate Worker**
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
- **Lookahead is not limited to two tokens.** The engine handles any number.
  `parser/doc/architecture.md` used to claim "only two-token lookahead" and
  that got copied onto this site more than once; the upstream doc now states
  the rule correctly, but the wrong version is still in circulation.
