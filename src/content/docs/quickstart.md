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
// => { rule: 'val', src: '1+2', kids: [
//      { rule: 'add', src: '1', kids: [] },
//      { rule: 'add', src: '2', kids: [] } ] }
```

Each repetition of `add` is a sibling — the compiler turns the tail
self-reference `[ PL add ]` into a same-depth repeat, not a nested push.
(`PL` compiles to a token, so it never appears in `kids`.)

## 4 · Add actions

Recognising isn't computing. To get a total, attach actions by reference — the
grammar text stays untouched.

Actions attach by **alternate mark** — a rule's alternate, named by its
leading discriminator. `'@val:o:add'` is the `val` rule's alternate that
pushes `add`; `'@add:o:NR'` is the `add` rule's alternate on an `NR` token.
`r.o` holds the tokens that alternate matched, so `r.o[0].val` is the number
just read — already a number, courtesy of the lexer.

```ts
const tn = new Tabnas({ plugins: [abnf] })
tn.abnf(`
  val = add
  add = NR [ PL add ]
  PL  = "+"
`, {
  actions: {
    // `val` holds the running total.
    '@val:o:add': (r) => { r.node.value = 0 },

    // Each number adds to it.
    '@add:o:NR': (r) => { r.parent.node.value += r.o[0].val },
  },
})

tn.parse('1+2+3').value    // => 6
tn.parse('12+3+45').value  // => 60
```

`r.parent` is `val` for **every** repetition — that's the same-depth repeat
again — so the total accumulates in one place, on `val`'s node, where
`parse` returns it. The instance carries no state between calls.

These are the same two actions a hand-written rule table uses for this
grammar (see [the home page](/#a-grammar-end-to-end), steps 3 and 4):
ABNF and the rule table aren't just equivalent notations, they compile to
the same machine.

Mark names come from each alternate's leading discriminator, so ask the
compiler rather than guessing:

```bash
tabnas-abnf --marks -f grammar.abnf
```

```
val  o:add  p:add
val  c:_  (empty)
add  o:NR  s:#NR
add  c:PL  s:#PL
add  c:_  (empty)
```

`add c:PL` is the repeat itself — a close-phase alternate you can attach an
action to with `'@add:c:PL'`.

## Next steps

- Open the [playground](/playground) and edit this grammar live.
- Read about [ABNF grammars](/docs/abnf-grammars) — repetition, groups, left
  recursion, and `@ref` actions in full.
- The [home page](/#a-grammar-end-to-end) shows this grammar four ways,
  including how to carry the total on the parse itself instead of in an outer
  variable.
- Building in Go? The same grammar and tree are available via
  `github.com/tabnas/parser/go`.

