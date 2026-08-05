---
title: Quickstart
description: Parse your first input with tabnas in five minutes.
section: Tutorials
order: 1
---

Install the engine, define a small grammar in ABNF, parse a string, then attach
actions to compute a value. TypeScript here; the Go path mirrors it exactly.

## 1 · Install

```bash
npm install @tabnas/parser @tabnas/abnf
```

## 2 · Define a grammar

An addition grammar, written in ABNF — `NR` is the built-in number token,
`[ … ]` is optional, and the rule refers to itself to handle a whole chain.

```ts
import { Tabnas } from '@tabnas/parser'
import { abnf } from '@tabnas/abnf'

const tn = new Tabnas({ plugins: [abnf] })
tn.abnf(`
  val = add
  add = NR [ PL add ]
  PL  = "+"
`)
```

`val` wraps the chain — it's the rule that will hold the running total.

## 3 · Parse

That grammar recognises the input and builds a tree. Every parse has the same
`{ rule, src, kids }` shape:

```ts
tn.parse('1+2')
// => { rule: 'add', src: '1+2', kids: [ { rule: 'PL', src: '+', kids: [] }, … ] }
```

## 4 · Add actions

Recognising isn't computing. To get a total, attach actions by reference — the
grammar text stays untouched.

There are two kinds of reference. `'@val:bo'` is a **rule-phase hook**: the
`val` rule, **b**efore **o**pen. It runs once at the start, so it's where the
accumulator gets zeroed. `'@add:o:NR'` is an **alternate mark**: the `add`
rule, its **o**pen phase, on an `NR` token. `r.o` holds the tokens matched in
that phase, so `r.o[0].val` is the number just read — already a number,
courtesy of the lexer.

```ts
let total = 0

const tn = new Tabnas({ plugins: [abnf] })
tn.abnf(`
  val = add
  add = NR [ PL add ]
  PL  = "+"
`, {
  actions: {
    '@val:bo':   () => { total = 0 },
    '@add:o:NR': (r) => { total += r.o[0].val },
  },
})

tn.parse('1+2+3')    // total === 6
tn.parse('12+3+45')  // total === 60
```

Because `@val:bo` zeroes the total at the start of every parse, re-parsing
needs no cleanup between calls.

Mark names come from each alternate's leading discriminator, so ask the
compiler rather than guessing:

```bash
tabnas-abnf --marks -f grammar.abnf
```

```
val  o:add  p:add
val  c:_  (empty)
add  o:NR  s:#NR
add  c:_  (empty)
```

## Next steps

- Open the [playground](/playground) and edit this grammar live.
- Read about [ABNF grammars](/docs/abnf-grammars) — repetition, groups, left
  recursion, and `@ref` actions in full.
- The [home page](/#a-grammar-end-to-end) shows this grammar four ways,
  including how to carry the total on the parse itself instead of in an outer
  variable.
- Building in Go? The same grammar and tree are available via
  `github.com/tabnas/parser/go`.

