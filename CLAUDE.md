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
