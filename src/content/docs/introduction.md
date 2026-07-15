---
title: Introduction
description: What tabnas is, and why a grammar is all you need.
section: Start
order: 1
---

**tabnas** is a polyglot parser engine. You describe a language once as a
grammar, and get a working parser that builds a small, uniform syntax tree —
the same grammar and the same tree in TypeScript and Go.

There is no code-generation step. The grammar *is* the parser: you install a
grammar package (or compile one from ABNF at runtime) and it parses input
directly. You can inspect a live grammar, render it back to ABNF, or draw it as
a railroad diagram.

## The syntax tree

Every parse yields the same shape:

```ts
{ rule: string, src: string, kids: Node[] }
```

Because the shape never changes, a walker, action, or tool you write once
applies to every grammar you define.

## One grammar, two runtimes

TypeScript is canonical; Go tracks it exactly, verified against shared
fixtures. Ship identical language support to a Node service and a Go binary
without maintaining two parsers.

## Where to go next

- [Quickstart](/docs/quickstart) — parse your first input in five minutes.
- [ABNF grammars](/docs/abnf-grammars) — the fastest way to define a language.
- [How it works](/docs/how-it-works) — the ideas behind the engine.
- [Packages](/docs/packages) — the core engine and ready-made grammars.
