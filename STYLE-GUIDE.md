# Documentation style guide

Write tabnas documentation around a concrete problem, executable code, and
an observable result. Put conditions and costs beside the claim.

This guide adapts Jostraca's documentation guide and the how-to guide in
`metsitaba/voxgig-web01/docs/howto-style.md`, using the website checks developed
for aontu. It applies to pages, shared descriptions, navigation, accessibility
labels, and the website README.

## Rule order

1. This guide and tabnas's terminology.
2. The [Google developer documentation style guide](https://developers.google.com/style)
   for conventions this guide does not cover.
3. Vale's default spelling and usage rules.

Richard Rodger's technical writing supplies the rhythm: concrete examples,
code early, direct judgements, and stated trade-offs. The
[Claudisms banlist](https://claudisms.ai/) informs the final editing pass.
A recognisable phrase is not a substitute for an explanation.

## Source ownership

| Content | Edit here | Check |
|---|---|---|
| Pages and shared copy | `src/pages/`, `src/layouts/`, `src/consts.ts` | `npm run check` |
| Documentation and how-to guides | `src/content/docs/`, `src/content/howto/` | `npm run check` |
| Executable examples | `examples/` | `npm run test-examples` |
| Skill summaries | Sibling `skills/skills/*/SKILL.md` | skill validator, then `npm run gen-ax-data` |
| Error codes, plugin descriptors, and MCP metadata | Owning sibling repository | its checks, then `npm run gen-ax-data` |

The documentation is authored here. Generated `src/data/*.json` is different:
edit its upstream source and regenerate it. `npm run check-ax` detects drift.

Public explanations must stand alone. Describe limitations directly instead
of citing internal bug logs, review notes, or design plans. Link to a public
issue or reference page for detail. Source files, runnable examples, and
instructions for creating a file remain useful references. Preserve code,
literal output, third-party notices, URLs, and existing heading links.

## Structure

Each documentation page has one purpose. Index pages route readers; landing
pages introduce the project; identity and privacy pages state facts and actions.

| Kind | Purpose | Pattern |
|---|---|---|
| Tutorial | Teach a sequence from the basics | Goal, code, output, one observation, next step |
| How-to | Solve one named task | Situation, imperative steps, result, limits, reference link |
| Reference | Specify syntax and behaviour | Definition, behaviour, edge cases, tested example |
| Explanation | Explain a design choice | Problem, reasoning, evidence, cost |

Keep the normative statement in the reference. Link to it from other kinds.
A how-to assumes the basics; it does not become a second tutorial. `/why`
explains the design without repeating the full language reference.

## Voice

Open with a fact or a concrete failure. A problem statement should identify
this page's problem, rather than describe software development in general.

Use second person, active voice, and present tense. Start a procedural step
with an imperative: "Write this as `example.mjs`:" or "Run the check:".
After code, explain the one result the reader needs to notice. Do not recap
all its lines or announce that a snippet demonstrates something.

Use short paragraphs, usually one to four sentences. Prefer sentences under
32 words; split a long explanation when the split makes its logic clearer.
Vary sentence length without stacking four short declarations in a row.
The word count is editorial guidance, not a reason to remove a required term.

State a trade-off directly and put its cost beside it. Keep humour rare and
out of reference material, error explanations, and instructions that change
files. Never make a joke at the reader's expense.

Use "we" only when walking through a tutorial with the reader. Do not use an organisational narrator. A named project-history passage may
use the maintainer's first person; tutorials and references address the reader.
End with the next action or a descriptive link. Omit rallying lines and
summaries that repeat the page.

## Words and claims

The enforced phrase list is
[reject.txt](.vale/styles/config/vocabularies/Tabnas/reject.txt).
Node and Vale read this one list; do not add a second array in a linter.

Avoid filler such as `worth noting`, `at its core`, and `when it comes to`;
inflated vocabulary such as `leverage`, `seamless`, and `comprehensive`;
and self-praise such as `load-bearing` or any form of `honest`.
Use a plain verb and name the result.

Do not invent observations about what teams know, what agents understand,
or how much code they produce. Do not substitute slogans such as
"not just X, but Y" for a description. Name the input, the check, and the
result. Claims of compatibility, safety, determinism, and termination must
include their relevant conditions or link to the reference that specifies those conditions.

Words with literal technical meanings remain available: an API surface,
a test harness, a grammar shape, and the parsing engine. Avoid using those words
as vague metaphors. Review context instead of banning the subject matter.

Comparisons name the alternative and the scenario. Describe the cost and
link to the alternative's own documentation. Do not claim that a whole
category of tools cannot express a rule without checking that claim.
A language reference does not need a comparison in every section.

Version claims name the version tested or derive it from the installed
package. Do not call a pin "latest" or promise that a page describes every
release. Imported documentation may describe implementation changes ahead of the
website's pin. Never add a verification date without a corresponding check.

## Punctuation, headings, and links

- Do not use em dashes in prose. Use a comma, parentheses, a colon, or a new
  sentence. Spaced `--` is not a workaround: Astro converts it to an em dash.
- Use sentence case in headings and serial commas in lists.
- Use British spellings, including "behaviour", "colour", and "initialise".
- Use no emoji. An exclamation mark is allowed only for a tutorial payoff,
  at most once on that page.
- Keep parentheses for definitions and caveats, with at most one dry aside
  per page. Reference parentheses state facts.
- Link text describes its destination. Avoid "click here" and unexplained
  internal filenames. A link list separates a link from its description
  with a full stop.

## Terminology

| Term | Meaning |
|---|---|
| tabnas | The project; lowercase in prose |
| `Tabnas` | The exported API identifier; preserve its capitalisation |
| lexer | A function that recognises tokens from source text |
| rule | A grammar definition with open and close states |
| rule instance | The state of a rule during a parse |
| alternate | An ordered candidate that matches tokens and controls the next operation |
| action | Behaviour attached to a rule or alternate |
| grammar plugin | A module that adds or changes grammar rules and options |
| ABNF | Grammar notation compiled into a tabnas rule table |

Explain rule, alternate, and rule instance where a newcomer first needs them.
Do not claim support for every language, universal ambiguity handling, or
reliable agent output. State the supported syntax and test cases. Distinguish
an error code, which is stable across runtimes, from its message.

The site describes an open-source project. Follow `ROADMAP.md`: no sales
buttons, testimonials, conversion sections, or unsupported performance claims.
Use descriptive links and name the maintainer. Keep the compile-target and
extensibility argument concrete: grammar input, validation, parse result.

## Examples

Keep existing executable examples and their literal output intact during a
prose edit. Name the source file before its code block. Show the command and
its observed result, and include failure behaviour where that is the task.
Do not invent successful output or a test-coverage claim.

The site's existing example harness runs TypeScript and Go examples against
the pinned packages. Partial tutorial listings remain partial; do not invent
successful output for them. Keep package versions exact and check the parser
and ABNF versions against the registry, as `AGENTS.md` requires.

Diagrams come from the model or the established diagram generator. Preserve
literal labels and output; write descriptive alt text for the reader.

## Prose checks

Follow Voxgig's two-gate pattern: Vale 3.9.1, Google v0.7.1 pinned by URL,
and one shared phrase vocabulary. Retain tabnas's British spelling and
Diátaxis structure. Voxgig's thirteen-part comparison template and sentence
quotas do not apply to these references.

```sh
vale sync
npm run build
npm run check-prose
npm run prose
```

Use `VALE=/path/to/vale npm run prose` for a local binary.
`npm run check` includes the Node prose gate. The separate
[prose workflow](.github/workflows/docs.yml) installs Vale and runs both
checks. GitHub branch-protection requirements are configured separately.

`tools/prose.mjs` reads every built HTML page, including imported content,
metadata, navigation, and accessibility labels. It checks the text for banned
phrases and em dashes, and prepares `.prose/` for Vale. Code, literal output,
scripts, and generated SVG labels are excluded. Metadata identifiers already
printed as code on the page remain code for spelling checks. A missing build,
empty extraction, or invalid vocabulary pattern fails.

Vale also checks the website README. Its error-level rules fail CI; other
levels remain editorial findings. The Google rule levels follow the source guides' house exceptions, recorded
in `.vale.ini`. Keep the reason for
any further change beside the rule. `test/prose-extraction.test.mjs` verifies extraction,
metadata coverage, wrapped phrases, and code exclusions.

Vale's accepted spelling terms can shadow rejected phrases. The Node check
still checks the shared rejection list, without an accepted-term exemption.
This guide quotes the phrases it forbids, so it is reviewed separately rather
than passed through that list.

## Update the guide

Change a rule alongside the first page that follows it. Record the reason.
Add accepted spellings one named term at a time, never with a broad suffix
pattern. Keep shared rules consistent with the source guide. Review each accepted term against the parser documentation.
