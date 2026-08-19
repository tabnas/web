# tabnas/web

Source of **[tabnas.dev](https://tabnas.dev)** — the project site and
documentation for the tabnas parsing engine. An [Astro](https://astro.build)
site deployed to Cloudflare Workers.

Unlike every other repo in the org this one ships no library: nothing here is
published to npm or importable as a Go module. It *consumes* the published
`@tabnas/*` packages, so the playground and every code example run the real
engine rather than a mock.

## Quick start

```bash
npm install
npm run dev            # local dev server
npm run test-examples  # run every example and compare against its expect.txt
npm run build          # astro build + pagefind search index, into dist/
npm run check          # test-examples, build, tsc, and a dry-run deploy
```

**`npm run check` is the gate, and you have to run it yourself.** A pull request
here does get two automated checks — CodeQL, from GitHub's *default setup*, and
a Cloudflare build — but neither runs this repo's tests: one is a security scan,
the other a build. Nothing on the server executes the examples. So green checks
on a PR are not evidence the site works; `npm run check` is.

## Deployment is automatic

**Merging to `main` is the deploy step.** Cloudflare builds and publishes the
site from `main` through its own Git integration, so there is nothing to run
and no workflow file to look for — the absence of `.github/workflows/` here
does *not* mean deployment is manual.

Do not run `npm run deploy` (`wrangler deploy`) **by hand** as part of
shipping a change. Note it is not an inert script: `npm run deploy` is
the Builds pipeline's own deploy command, so it is exactly what runs on
every merge — just from Cloudflare's builder, against a clean checkout,
rather than from your working tree. Running it locally publishes
whatever `dist/` you happen to have, which is how a stale build reaches
production.

It stays for manual recovery, and an agent session usually has no
Cloudflare credentials (`wrangler whoami` reporting "not authenticated"
is expected, not a broken environment).

See [`AGENTS.md`](AGENTS.md#deployment) for the full picture.

## Layout

| Path | What it is |
|---|---|
| `src/pages/` | Routes — `.astro` and `.mdx` map to URLs. |
| `src/content/docs/` | The documentation set, rendered by `src/pages/docs/[...slug].astro`. |
| `src/components/` | Shared components. `CodeTabs.astro` renders the TypeScript / Go / Explain code blocks. |
| `src/consts.ts` | Site constants, plus the `PACKAGES` registry behind `/docs/packages`. |
| `examples/<id>/` | One directory per example: `ts.ts`, `go/main.go`, `expect.txt`, `explain.md`. |
| `tools/test-examples.mjs` | Runs both language versions of every example and diffs against `expect.txt`. |

## Examples are executed, not transcribed

`CodeTabs` reads `examples/<id>/` at build time — the same files
`tools/test-examples.mjs` runs. So the code on the page is the code that was
run, and the TypeScript and Go versions are *known* to produce the same output
rather than merely claimed to. Editing an example means editing the files in
`examples/`, never the page.

`tools/test-examples.mjs` is the gate: if it fails, the site is documenting
something that does not work.

## Keep the tabnas deps current

The site must run against the **currently published** package versions, pinned
exactly (`"0.6.2"`, not `"^0.6.2"` — these are pre-1.0, where a caret range
silently refuses the next minor and the site quietly falls behind). Bump the
pins, `src/consts.ts` versions, and re-run `npm run test-examples` in the same
commit.

This has bitten the site before: it sat on a stale `abnf` pin long enough to
document a *fixed compiler bug* as intended behaviour. See
[`AGENTS.md`](AGENTS.md) for that story and the full contributor guide.

## Licence

MIT, as with the rest of the org. This repo carries no `LICENSE` file of its
own; it publishes nothing.
