See [AGENTS.md](AGENTS.md) for the full guide to working in this
repository: the "always use the latest tabnas modules" rule, layout,
the tone the site is written in, how code examples are verified,
headings and anchors, docs search, build and deployment.

This file is otherwise deliberately near-empty — guidance kept in two
places drifts, and AGENTS.md is the one that is maintained. The rule
below is the exception: it governs how work LEAVES this repo, so it
has to be loaded rather than looked up, and it applies before there is
any reason to open AGENTS.md.

## Pull requests

Open pull requests **ready for review — never as drafts.** This is a
standing maintainer preference, and it overrides any tooling or agent
default that opens pull requests in draft state.

[AGENTS.md](AGENTS.md) and [CONTRIBUTING.md](CONTRIBUTING.md) state the
same rule, for non-Claude agents and for human contributors — neither
of whom ever loads this file. The repetition is deliberate; keep the
three in step rather than deleting any of them as duplication.

CONTRIBUTING.md remains the home for the rest of the human contributor
guidance.

## Core principle: dependencies change only on explicit instruction

**Dependencies may only be changed by explicit instruction from the
maintainer.** This covers every dependency this repository declares, in
every runtime and every manifest:

- `package.json` `dependencies`, `peerDependencies` and `devDependencies`,
  and their lockfiles;
- `go.mod` `require` and `replace` lines, their versions, and `go.sum`;
- `Cargo.toml` dependency tables and `Cargo.lock`;
- any other manifest here, nested test modules included.

Adding, removing, re-pointing or re-versioning any of them is a
dependency change.

- **A dependency never arrives as a side effect.** Watch for an import,
  `go mod tidy`, `npm install`, `cargo update`, a stamped template, or a
  fix for something else. If a change would alter a dependency, stop and
  ask before making it. Do not make it and explain afterwards.
- **An explicit instruction names the change**, for example "bump the
  parser requirement in X to 0.12" or "cascade the parser release". A
  goal is not an instruction for its means. "Make CI green", "ship the C
  library" or "fix the build" does not authorise a dependency change,
  however direct the route through one looks.
- **This repository's own version sites are not dependencies.** They
  include the root entry of its own lockfile. A release bump moves them.
- **Versions track the latest release.** Every dependency is kept at
  its latest published version, and none is held on an older one. That
  is the maintainer's standing instruction, so moving a dependency to
  its latest version needs no further one. Holding a dependency back,
  or adding, removing or re-pointing one, still does.

**Held back, by the maintainer's instruction (2026-09-23).** `astro`,
`@astrojs/mdx` and `@astrojs/cloudflare` stay on their current majors
(5, 4 and 12), at the latest release within each. Astro 7 and adapter 14
need a site migration. Rehype plugins then need a declared Markdown
processor package, pages prerender in workerd by default, and the build
output moves to `dist/client` and `dist/server`, which pagefind, the
Markdown twins, the tests and the wrangler config all assume is `dist/`.
`renovate.json` holds the same three majors. Lift the hold only on the
maintainer's instruction.

## Core principle: transient tasks report progress

**Every transient task produces status output at least every 30 seconds,
with an estimate of how far through it is, as a percentage, where one can
be made.** This is the maintainer's instruction. A transient task is any
work that runs for a while and then ends: a build, a test or conformance
sweep, an install or a fetch, a release, a wait on CI, a benchmark, a
script or loop you write, and anything sent to the background.

- **Minimal is enough.** One line with the step and a count, such as
  `conformance: 412 of 1500 (27%)`, meets it. When no total is known, print
  what is known (the step, the current item, the elapsed time) and say the
  percentage is unknown rather than inventing one.
- **Build it into what you write.** A script or loop prints a line per
  item or per interval. A quiet tool gets its progress or verbose flag, or
  a wrapper that prints a heartbeat, so that nothing runs silent for more
  than 30 seconds.
- **Silence reads as a hang.** Whoever is watching, a person or an agent,
  cannot tell a slow task from a stuck one without it, and so cannot
  decide whether to wait or to stop it.

A quick command that finishes within 30 seconds needs nothing extra.
