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

There are two kinds of reference. `'@add:o:NR'` is an **alternate mark**: the
`add` rule, its **o**pen phase, on an `NR` token. `r.o` holds the tokens
matched in that phase, so `r.o[0].val` is the number just read — already a
number, courtesy of the lexer. `'@add:ac'` and `'@val:ac'` are **rule-phase
hooks** — **a**fter **c**lose, on the way back up the stack, which is when a
rule's children are complete and can be folded in.

```ts
const tn = new Tabnas({ plugins: [abnf] })
tn.abnf(`
  val = add
  add = NR [ PL add ]
  PL  = "+"
`, {
  actions: {
    // Each `add` holds its own number...
    '@add:o:NR': (r) => { r.node.value = r.o[0].val },

    // ...plus whatever the nested `add` came to.
    '@add:ac': (r) => { r.node.value += r.node.kids[0]?.value ?? 0 },

    // `val` carries the result of the parse.
    '@val:ac': (r) => { r.node.value = r.node.kids[0].value },
  },
})

tn.parse('1+2+3').value    // => 6
tn.parse('12+3+45').value  // => 60
```

The total lands on `val`'s node rather than in a variable outside the parse,
so `parse` returns it and the instance carries no state between calls.

`add`'s only child node is the nested `add` — `PL = "+"` is a lexical
definition, so it compiles to a token rather than a rule and never appears
in `kids`.

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

