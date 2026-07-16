---
title: ABNF grammars
description: Define a language fast using the RFC 5234 ABNF dialect.
section: Guides
order: 1
---

The `@tabnas/abnf` plugin compiles [RFC 5234](https://www.rfc-editor.org/rfc/rfc5234)
ABNF straight into a working grammar. It's the fastest way to define a language.

```ts
const tn = new Tabnas({ plugins: [abnf] })
tn.abnf(`greet = "hi" / "hello"`)
tn.parse('hi') // => { rule: 'greet', src: 'hi', kids: [] }
```

## Dialect

tabnas uses the RFC 5234 dialect: `=` for definitions and `/` for
alternatives (not `::=` or `|`).

- **Literals**: `"+"`, case-insensitive by default; `%s"Hi"` is case-sensitive.
- **Optional**: `[ … ]`.
- **Repetition**: `*element` (zero or more), `1*element` (one or more),
  `2*4element` (bounded).
- **Grouping**: `( … )`.
- **Char ranges**: `%x30-39`.
- **Built-in tokens** by bareword: `NR` (number), plus core rules like `ALPHA`
  and `DIGIT`.

## Left recursion

Left-recursive rules are accepted directly. A left-recursion pass (Paull's
algorithm) rewrites both direct (`P = P a / b`) and indirect recursion into the
iterative form the engine runs without re-entering a rule at the same position:

```
P = P a / b     →     P = b *(a)
```

Because it's a rewrite, the tree is flat rather than left-nested, and a
**purely** left-recursive rule (no base branch) is an error. See the
[@tabnas/abnf README](https://github.com/tabnas/abnf#readme) for the full
details and caveats.

## Actions

Attach behaviour with `@ref` action references keyed by rule and phase — for
example `'@add:o:NR'` runs when the `add` rule opens on a number token. Actions
augment the captured node (e.g. set `node.value`), so `tn.parse(...)` returns
your real result.
