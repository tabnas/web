# Contributing to tabnas.dev

Thanks for helping improve the tabnas website! This repo is the source for
[tabnas.dev](https://tabnas.dev) — an Astro site deployed on Cloudflare Workers.

## Local development

```bash
npm install
npm run dev      # local dev server
npm run build    # production build (Astro + Pagefind + markdown twins)
npm run preview  # build, then wrangler dev — the real Worker runtime
npm run check    # everything CI runs
```

Node 22+ is required. `npm run dev` serves the pages but not the Pagefind
index or the markdown twins, both of which are post-build steps — use
`npm run preview` to exercise those, and anything that goes through
`src/worker.ts` (content negotiation, the JSON error responses, the 404).

## Ways to help

- **Content & docs** — fix typos, clarify copy, improve examples. Every `.astro`
  page and Markdown post is fair game.
- **Design & a11y** — the design tokens live in `src/styles/tokens.css`; keep
  changes token-driven and check both light and dark themes.
- **Playground & tooling** — the playground runs the real engine client-side
  (`src/pages/playground.astro`).

For the parser engine and grammar packages themselves, head to the relevant
repository under [github.com/tabnas](https://github.com/tabnas).

## Pull requests

- Branch from `main`, keep changes focused, and open a PR.
- Make sure `npm run check` passes — it builds, typechecks and runs the test
  suites in `test/`.
- Be kind and constructive — see our [Code of Conduct](./CODE_OF_CONDUCT.md).

## Questions

Open a [Discussion](https://github.com/tabnas/parser/discussions) or an issue.
We aim to give every first contribution a prompt, welcoming response.
