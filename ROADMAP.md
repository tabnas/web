# tabnas.dev — improvement plan

A prioritized plan for the site, grounded in current best practice for
open-source developer sites and documentation. Written 2026-07-15, against the
foundation in PR #1.

## Reference material

- **Dev-tool landing pages** — Evil Martians, *"We studied 100 dev tool landing
  pages — here's what really works in 2025"*
  (https://evilmartians.com/chronicles/we-studied-100-devtool-landing-pages-here-is-what-actually-works-in-2025).
  Centered hero + visual-below; problem-oriented feature storytelling beats
  function lists; trust strip right after the hero; **specific** CTA copy, not
  "Get started"; a distinct full-width final CTA band; "no salesy BS".
- **Docs structure** — Diátaxis (https://diataxis.fr/): four modes — tutorial,
  how-to, reference, explanation. tabnas repos already ship Diátaxis docs.
- **Docs tooling** — Astro Starlight (https://starlight.astro.build/): search
  (Pagefind), auto nav/sidebar, dark mode, i18n, a11y, MDX — same Astro runtime
  we already use.
- **Community** — GitHub Open Source Guides, *Building Welcoming Communities*
  (https://opensource.guide/building-community/): explicit CONTRIBUTING,
  "good first issue" labels, a public place to talk, fast first-response.
- **Onboarding / playground** — getting-started should hit a concrete goal fast
  ("first parse in 5 minutes"); runnable, in-browser examples beat static text
  (Nordic APIs, Cortex, Raze Growth API-playground guidance).

## Where the site stands (PR #1)

Have: brand + colour system + fonts; landing (hero = ABNF grammar → `6`);
docs/playground/agents/community/sponsors pages (mostly stubs); blog; `llms.txt`;
under-construction gate. Missing: real quickstart, interactive playground, unified
searchable docs, trust/social proof, community scaffolding, per-page OG.

---

## P0 — high impact, low effort (this iteration)

1. **Sharper landing CTAs & copy.** Replace generic "Get started" with specific
   verbs — primary **"Start building"** → quickstart, secondary **"Try in the
   browser"** → playground. Keep the code-snippet hero (correct pattern for a
   library). *(Evil Martians)*
2. **A real Quickstart** (`/docs/quickstart` or the top of `/docs`): one goal —
   *"Parse your first input in 5 minutes"* — install, define a 3-line grammar,
   parse, see the tree; a verification step; then "next steps". *(onboarding)*
3. **Trust strip under the hero.** No logos yet, so use honest metrics: live
   GitHub stars, "25 packages · TypeScript + Go parity", npm version badge,
   "Sponsored by Voxgig". *(Evil Martians trust section)*
4. **Problem-oriented feature copy.** Reframe the three feature blocks from
   capabilities to pains solved ("stop re-writing the same parser in two
   languages", "grammars that drift from their parser", "brittle hand-rolled
   lexers"). *(Evil Martians storytelling ladder)*
5. **Final CTA band.** Full-width, contrasting (deep-green) band before the
   footer: one line + one button to the quickstart. *(Evil Martians)*
6. **AI-agent depth.** Add `llms-full.txt` and per-doc raw-markdown endpoints so
   agents get full text, not just links. *(builds on the a+b scope)*

## P1 — core value (next)

7. **Interactive playground.** Client-side `@tabnas/parser` + `@tabnas/abnf`:
   grammar pane + input pane → live `{rule,src,kids}` tree / value, shareable via
   URL state, a few preset grammars (addition, JSON, CSV). This is the single
   biggest DX win and the site's signature "try it" moment. *(playground)*
8. **Unify the docs.** Adopt **Astro Starlight** for `/docs` (search via Pagefind,
   sidebar, prev/next, dark mode) and organise by Diátaxis. Decide: aggregate the
   per-repo docs into the hub vs. link out. Recommendation: aggregate the *engine*
   (parser/abnf/debug) tutorials + reference here; link out for long-tail plugins.
   *(Starlight, Diátaxis)*
9. **Site search.** Pagefind (bundled with Starlight, or standalone for the
   marketing pages) — static, no external service, on-brand with the no-third-party
   stance.

## P2 — community & growth

10. **Community scaffolding.** Enable GitHub Discussions; add `CONTRIBUTING.md`,
    `CODE_OF_CONDUCT.md`, and label "good first issue" / "docs" across repos;
    surface them on `/community`; state a first-response aim. *(opensource.guide)*
11. **Live GitHub signal.** Contributors, latest release, good-first-issues count
    pulled from the public API at build time.
12. **Per-page OG/Twitter cards.** Generate share images from the mark + title
    (Satori/`astro-og-canvas`) — matters once the gate comes off and links spread.
13. **Explanation page — "Why tabnas".** A concepts/why page (Diátaxis
    *explanation*): the "table of translations" idea, one-grammar-two-runtimes,
    where it fits vs. hand-written parsers / PEG / ANTLR. *(Diátaxis, Evil Martians
    mission storytelling)*
14. **Blog/changelog cadence.** Keep a narrow "recent updates" strip on the home
    page once there are real posts/releases. *(Evil Martians — mature teams only)*
15. **Testimonials** when real ones exist — curated, tweet-styled, near the
    bottom; even one early quote helps. *(Evil Martians social proof)*

## Launch checklist (when the gate comes off)

- Revert `output:"server"` → `"static"`, restore blog `getStaticPaths`, remove
  `src/middleware.ts` + `run_worker_first`.
- Real OG default image (1200×630); verify cards.
- `sitemap` + `robots.txt`; submit to search console.
- Lighthouse pass (perf/a11y/SEO); check both themes.
- Confirm `PUBLIC_CF_BEACON` analytics live.
