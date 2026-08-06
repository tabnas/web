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
| `src/layouts/` | `Base`, `DocsLayout`, `BlogPost`, `MdxPage`. |
| `src/styles/` | `tokens.css` (design tokens), `global.css`, per-page sheets. |
| `ROADMAP.md` | The site plan. **Read it before changing content or tone.** |

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
compares as `true` against every `lt`/`gt` limit. Do not "tidy" one without
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
when changes land on `main`; merging a pull request is the deploy step. Do not
run `npm run deploy` (`wrangler deploy`) as part of shipping a change — the
script stays for manual recovery, and an agent session has no Cloudflare
credentials anyway (`wrangler whoami` reports "not authenticated", and there is
no `CLOUDFLARE_API_TOKEN`). That is expected, not a broken environment.

So "publish this" means: build clean, merge to `main`, and check the live site
a few minutes later.

The site was previously behind HTTP Basic Auth while under construction
(`src/middleware.ts` plus `run_worker_first` in `wrangler.json`). **That gate
has been removed** and the site is now fully static (`output: "static"`). If a
`SITE_PASSWORD` secret is still configured on the Worker it is inert and should
be deleted from the Cloudflare dashboard.

## Things that will trip you up

- **`@tabnas/markdown`'s README describes a CSV reader** — a copy-paste error in
  that repo. Don't propagate the wrong blurb into `src/consts.ts`.
- **The GitHub star widgets read 0** because the org repos are new. That is
  honest, not broken.
- **Lookahead is not limited to two tokens.** The engine handles any number.
  `parser/doc/architecture.md` used to claim "only two-token lookahead" and
  that got copied onto this site more than once; the upstream doc now states
  the rule correctly, but the wrong version is still in circulation.
- **`llms.txt` / `llms-full.txt`** in `public/` are hand-maintained. Update
  them when page structure changes materially.
