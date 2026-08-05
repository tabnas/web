---
title: A grammar with plugins
description: Build a configuration language by composing existing grammars instead of writing one.
section: Tutorials
order: 3
---

[Your first grammar](/docs/first-grammar) built a language from nothing. This
is the other way, and usually the cheaper one: start from a grammar that
already parses something close, and add the pieces you need.

We'll build a config format that takes arithmetic in its values — so
`width: 2+3*4` yields `14`, not the string `"2+3*4"`. Writing that from
scratch means an expression parser with operator precedence. Composing it takes
about six lines.

## 1 · Install

```bash
npm install @tabnas/jsonic @tabnas/expr
```

[jsonic](https://github.com/tabnas/jsonic) is a relaxed JSON — unquoted keys,
implicit objects, comments, trailing commas.
[expr](https://github.com/tabnas/expr) adds Pratt-parser expressions with a
configurable precedence scale.

## 2 · Start from jsonic

```ts
import { Jsonic } from '@tabnas/jsonic'

Jsonic('a:1, b:{c:2}, d:[3,4]')
// => { a: 1, b: { c: 2 }, d: [ 3, 4 ] }
```

That is already a usable config format. What it doesn't do is arithmetic:
`x: 1+2` gives you a string.

## 3 · Add the expression plugin

`Jsonic.make()` derives a fresh instance so the base parser is left alone, and
`.use()` layers a plugin onto it.

```ts
import { Jsonic } from '@tabnas/jsonic'
import { Expr } from '@tabnas/expr'

const cfg = Jsonic.make().use(Expr)

cfg('x: 1+2*3')
// => { x: [ '+', 1, [ '*', 2, 3 ] ] }
```

Values are now expression trees, and precedence is already handled — `1+2*3`
groups the multiplication first, without you saying so. Parentheses work too:

```ts
cfg('y: (1+2)*3')
// => { y: [ '*', [ '(', [ '+', 1, 2 ] ], 3 ] }
```

(The first element is an operator node; the readable part is its `src`. The
shapes above are abbreviated for clarity.)

## 4 · Evaluate

`expr` did the parsing, so evaluation is a short recursive walk:

```ts
const OPS = {
  '+': (a, b) => a + b,
  '-': (a, b) => a - b,
  '*': (a, b) => a * b,
  '/': (a, b) => a / b,
}

function evaluate(n) {
  if (!Array.isArray(n)) return n           // a plain value
  const [op, ...terms] = n
  if (op.paren) return evaluate(terms[0])   // ( … ) — a single term
  return OPS[op.src](...terms.map(evaluate))
}
```

And that's the language:

```ts
const conf = cfg('width: 2+3*4, height: (2+3)*4, ratio: 10/4')

evaluate(conf.width)   // => 14
evaluate(conf.height)  // => 20
evaluate(conf.ratio)   // => 2.5
```

## What just happened

You didn't write a parser. You picked one that was close, added a plugin for
the part it was missing, and wrote ten lines of evaluation. No grammar file, no
generated code, and no fork of jsonic — the base instance is untouched, so
other code using it is unaffected.

This is the normal way to build with tabnas, and it composes further:

| Add | For |
|---|---|
| [directive](https://github.com/tabnas/directive) | `@name` and `add<1,2>` forms |
| [hoover](https://github.com/tabnas/hoover) | Block strings with unquoted spaces |
| [multisource](https://github.com/tabnas/multisource) | One document pulling in others |
| [path](https://github.com/tabnas/path) | Knowing where each value sits in the tree |

[aontu](/examples) is the same trick at full size: a CUE-like configuration
language built from five of these plugins and no parser of its own.

## Next

- [Extending a grammar](/docs/extending) — adding and removing rules directly.
- [The rule table](/docs/rule-table) — what a plugin is actually doing.
- [Packages](/docs/packages) — everything available to compose.
