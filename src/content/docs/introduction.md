---
title: Introduction
description: What tabnas is, and how a grammar becomes a parser.
section: Start
order: 1
---

**tabnas** is a parsing engine that can handle any language. You describe a
language as a grammar and get a working parser that builds a small, uniform
syntax tree.

There is no code-generation step. The grammar *is* the parser: a table of
rules and token lookups the engine walks at runtime. That has two consequences,
and they are the reason the project exists.

**Extension is cheap.** A new language is usually an existing one plus some
rules — JSONC is JSON with comments, jsonic is JSONC with relaxed quoting,
and so on. You add rules and token alternates to a grammar that already
parses, rather than forking a parser and owning the fork.

**The engine is a good compile target.** ABNF compiles into it, so a human can
write a grammar in the notation the RFCs already use. And because the grammar
is flat declarative data with no control flow, a language model can emit one
directly — and you can inspect it, print it back as ABNF, or draw it as a
railroad diagram before you run it.

See [why tabnas](/why) for where this came from, and
[agents](/agents) for the second point in full.

## The syntax tree

Every parse yields the same shape:

```ts
{ rule: string, src: string, kids: Node[] }
```

Because the shape never changes, a walker, action, or tool you write once
applies to every grammar you define.

## Runtimes

The engine is implemented twice, in TypeScript and in Go, so it runs wherever
you do. TypeScript is the reference implementation; the Go port tracks it and
is verified against the same fixtures. A grammar parses the same way in both.

## Where to go next

- [Quickstart](/docs/quickstart) — parse your first input in five minutes.
- [Your first grammar](/docs/first-grammar) — build a language from nothing.
- [A grammar with plugins](/docs/grammar-with-plugins) — build one by composing
  what already exists. Usually the cheaper route.
- [The rule table](/docs/rule-table) — the grammar format, in full.
- [How it works](/docs/how-it-works) — the ideas behind the engine.
