---
title: Quickstart
description: Parse your first input with tabnas in five minutes.
section: Start
order: 2
---

Install the engine, define a three-line grammar in ABNF, and parse a string
into a value. TypeScript here; the Go path mirrors it exactly.

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
  add = NR [ PL add ]
  PL  = "+"
`, {
  actions: {
    '@add:o:NR': (r) => {
      let top = r
      while (top.parent && top.parent.name === 'add') top = top.parent
      top.node.value = (top.node.value || 0) + Number(r.o[0].val)
    },
  },
})
```

## 3 · Parse

```ts
tn.parse('1+2+3').value   // => 6
tn.parse('12+3+45').value // => 60
```

## 4 · Verify

Every parse has the same `{ rule, src, kids }` shape:

```ts
tn.parse('1+2')
// => { rule: 'add', src: '1+2', kids: [ { rule: 'PL', src: '+', kids: [] }, … ] }
```

## Next steps

- Open the [playground](/playground) and edit this grammar live.
- Read about [ABNF grammars](/docs/abnf-grammars) — repetition, groups, left
  recursion, and `@ref` actions.
- Building in Go? The same grammar and tree are available via
  `github.com/tabnas/parser/go`.
