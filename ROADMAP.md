# tabnas.dev — site plan

The plan for this site. Superseded the previous version (2026-07-15), which
was built from a dev-tool *landing page* playbook and produced a site that read
like a commercial product. See "What changed, and why" below before adding
anything.

## The rule

**tabnas is an open source project, not a product.** Every content decision
follows from that. The reference points are project sites — [Fastify][fastify],
[Sniffnet][sniffnet], [Mockoon][mockoon] — not SaaS landing pages.

Concretely:

- **No call-to-action buttons.** Plain links. A reader who wants the quickstart
  can find it; they don't need to be converted.
- **No conversion furniture.** No trust strip, no final CTA band, no
  testimonials, no social proof, no "N developers use X", no logo wall.
- **Describe, don't pitch.** Section headings are plain — "What is it", "Why",
  "Core features", "The project". Copy states what the thing does and how it
  works, in the order a curious developer would ask.
- **Say the unflattering parts.** Pre-1.0. One maintainer. Deterministic, so no
  ambiguity handling. You write the lexer. `/comparisons` names cases where
  another tool is the right answer; `/faq` has a "Scope" section for what the
  project won't do.
  Honesty is the credibility mechanism here, in place of social proof.
- **Credit the author.** Projects have people. The site names Richard Rodger
  and links him; the copyright matches the LICENSE files.
- **Every content heading is linkable.** Markdown and MDX get ids and `#`
  anchors from `rehype-slug` + `rehype-autolink-headings` (astro.config.mjs);
  hand-written `.astro` pages use `components/Heading.astro`, which emits the
  same markup. Styles are in `global.css` — faint until the heading is hovered.
  Two deliberate exceptions, both because a nested `<a>` inside an `<a>` is
  invalid: linked `<Card href>` headings get an id but no `#`. Navigation labels — footer columns, docs sidebar groups, "On
  this page" — are `<p>`, not headings, so the outline stays content-only.
- **The motivation lives in `/why`.** It is the source document for the site's
  content and tone: extensibility as the point, the parser-VM framing, the
  accidental origin. Homepage copy is a condensation of it, not a separate
  pitch.

## The thesis, and what it is not

Two things, and everything on the site should ladder up to them:

1. **The engine is extensible.** A grammar is data, so a new language is rules
   added to one that already parses. Extension is the normal case, not a fork.
2. **The engine is a compile target.** ABNF compiles into it, for humans. And
   because a grammar is flat declarative data with no control flow, an *agent*
   can emit one — and you can check it before running it.

The payoff is the sentence to lead with: **parsing anything gets much easier.**

**What this is not.** The TypeScript and Go implementations are *not* the
headline. "One grammar, two runtimes" is an implementation fact — useful, worth
a card near the end of a feature grid, worth a line on `/releases` — but it is
not why the project exists, and leading with it buries the actual argument. An
earlier pass made exactly this mistake: the tagline read "An extensible parsing
engine, for TypeScript and Go", the feature grid ended on "Two runtimes", and
the homepage install block gave `npm` and `go get` equal weight. All corrected.
If a future edit reaches for cross-runtime parity as the selling point, this is
the paragraph that says don't.

## What changed, and why

The previous plan cited Evil Martians' "We studied 100 dev tool landing pages"
and prescribed, by name: a trust strip after the hero, a full-width final CTA
band, "Start building" as CTA copy, problem-oriented pain framing, and
scaffolded testimonials. All of it was implemented, and all of it has been
removed. The advice isn't wrong — it's advice for selling a product, which this
isn't.

Removed: hero CTA buttons, the trust strip (stars / package count / MIT), the
"Stop writing the parser twice" pain framing, the split CTA panels, the
full-bleed final CTA band, the `Testimonials` component and `TESTIMONIALS`
const, and the CTA row on `/why`.

Rewritten around the `/why` motivation: the homepage, `SITE_TAGLINE` and
`SITE_DESCRIPTION`, `/agents`, `/community`, `/sponsors`, and
`docs/introduction`.

## Current shape

| Page | Purpose |
| --- | --- |
| `/` | What it is, why it exists, core features, the addition grammar four ways, packages, the project |
| `/why` | The long-form motivation and the algorithm. The source document. |
| `/docs` | Diátaxis — Start / Tutorials / How-to / Reference / Explanation, with Pagefind search |
| `/how-to` | Task-oriented guides, at top level. An intro and index page, plus one page per problem |
| `/agents` | Half the thesis, and a build guide written for an agent |
| `/playground` | Client-side engine — ABNF or rule table, tree and value |
| `/examples` | Real languages on the engine: aontu (TS), boru (Go) |
| `/faq` | Questions, including scope: what the project won't do |
| `/releases` | All packages, live versions from the npm registry |
| `/comparisons` | Mechanical differences from ANTLR, Peggy, Chevrotain, nearley, tree-sitter |
| `/community` | How the project works, contributing, AI-friendly policy |
| `/sponsors` | Voxgig, and what sponsorship pays for |

Navigation: Why, Docs, How to, Agents, Playground, Examples, FAQ, Community —
`/agents` sits high because it carries half the thesis, not because agents are
fashionable. The footer carries Releases, Other parsers, Sponsors,
Contributing, Code of Conduct.

**On `/how-to` versus the docs How-to section.** The task-oriented quadrant is
big enough to be a section of its own, and it is the part a working reader
reaches for most, so it sits at top level next to `/why` rather than three
clicks into `/docs`. Three pages stayed in `/docs` — `abnf-grammars`,
`actions`, `extending` — because they double as the way in to ABNF, actions and
extension, and their URLs are already linked from the quickstart and the
homepage. The `/how-to` index lists them alongside its own guides, so there is
still exactly one place to look. A guide belongs at `/how-to` if it is named
after a problem; it belongs in `/docs` if it is named after a feature.

## Still to do

**Content, not code:**

- `/comparisons` characterises five other projects. Check the claims; getting a
  comparison wrong is worse than not having one.
- `/examples` describes aontu and boru from their READMEs and manifests.
  Worth a maintainer's eye.
- `@tabnas/markdown`'s README describes a CSV reader (copy-paste error).

**Needs org action:**

- Label "good first issue" across repos — `/community` surfaces the count, and
  the org currently has none.
- The live GitHub star widgets read 0 because the repos are new. Honest, but
  worth knowing before launch.
- Delete the `SITE_PASSWORD` secret from the Cloudflare Worker. The gate is
  gone from the code, so the secret is inert, but it shouldn't linger.

## Launch checklist

Done: the Basic-Auth gate removed, `output: "static"`, docs prerendered and
Pagefind indexing them, blog/RSS retired.

Remaining:

- Per-page OG images — now possible with static output (Satori /
  `astro-og-canvas`). Real default image (1200×630); verify cards.
- `robots.txt`; submit the sitemap to search console.
- Lighthouse pass (perf / a11y / SEO); check both themes.
- Confirm `PUBLIC_CF_BEACON` analytics live.

## Reference material

- **Project sites worth copying** — [Fastify][fastify] (plain descriptive
  sections, quickstart on the homepage, a real Team section),
  [Sniffnet][sniffnet] (interrogative headings, licence and implementation
  language stated as features, dated project news, named author),
  [Mockoon][mockoon] (defines itself partly by what it *doesn't* require;
  Releases / Roadmap / Comparisons / FAQ in the footer).
- **Docs structure** — [Diátaxis](https://diataxis.fr/): tutorial, how-to,
  reference, explanation. The tabnas repos already ship Diátaxis docs.
- **Community** — [GitHub Open Source Guides, *Building Welcoming
  Communities*](https://opensource.guide/building-community/): explicit
  CONTRIBUTING, "good first issue" labels, a public place to talk, fast
  first response.
- **Landing-page advice, and why it's excluded** — Evil Martians, ["We studied
  100 dev tool landing pages"][em]. Good advice for a commercial dev tool.
  Applied here it produced the product feel this plan exists to prevent. If a
  future change reaches for a trust strip or a CTA band, this is where it came
  from.

[fastify]: https://fastify.dev/
[sniffnet]: https://sniffnet.app/
[mockoon]: https://mockoon.com/
[em]: https://evilmartians.com/chronicles/we-studied-100-devtool-landing-pages-here-is-what-actually-works-in-2025
