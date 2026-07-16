---
title: Packages
description: The core engine and the ready-made grammar packages.
section: Reference
order: 1
---

Every package is published to npm under the `@tabnas/*` scope and, where
applicable, as a Go module at `github.com/tabnas/<name>/go`. Each ships
four-quadrant [Diátaxis](https://diataxis.fr) docs in both languages.

## Core

| Package | What it does |
| --- | --- |
| [`@tabnas/parser`](https://github.com/tabnas/parser) | The engine — define a grammar, get a parser and a uniform AST. |
| [`@tabnas/abnf`](https://github.com/tabnas/abnf) | Compile RFC 5234 ABNF into a working grammar. |
| [`@tabnas/debug`](https://github.com/tabnas/debug) | Inspect a live grammar — describe it or render it back as ABNF. |
| [`@tabnas/json`](https://github.com/tabnas/json) | A complete JSON grammar built on the engine. |
| [`@tabnas/railroad`](https://github.com/tabnas/railroad) | Draw railroad (syntax) diagrams from a grammar. |

## Grammars & plugins

| Package | What it does |
| --- | --- |
| [`@tabnas/jsonic`](https://github.com/tabnas/jsonic) | A forgiving, human-friendly JSON superset. |
| [`@tabnas/yaml`](https://github.com/tabnas/yaml) | Parse YAML with the engine. |
| [`@tabnas/csv`](https://github.com/tabnas/csv) | Parse CSV/TSV into rows and records. |

See the full list on [GitHub](https://github.com/tabnas) and the org
[status dashboard](https://tabnas.github.io/status/) for versions and health.
