---
title: Parse expressions with precedence
description: Add infix, prefix, suffix and ternary operators to a grammar, with a binding-power scale you control.
group: Composing grammars
order: 2
packages: ["expr"]
---

Precedence is the one part of parsing that rule tables are bad at. Expressing
`1+2*3` as nested rules means one rule per precedence level, and adding a level
means rewriting the chain. `@tabnas/expr` does it with a
[Pratt parser](https://matklad.github.io/2020/04/13/simple-but-powerful-pratt-parsing.html)
instead: every operator carries two numbers, and precedence falls out of
comparing them.

Register it on a grammar that already defines values, and values become
expressions:

```ts
import { Tabnas } from '@tabnas/parser'
import { jsonic } from '@tabnas/jsonic'
import { Expr } from '@tabnas/expr'

const tn = new Tabnas().use(jsonic).use(Expr)

tn.parse('1+2*3')
```

## What comes back

An S-expression: an array whose first element is the operator and whose
remaining elements are the terms. The operator is an `Op` object — it carries
the source text, the binding powers, and which fixity matched — so printing a
tree usually means replacing it with `op.src` first:

```ts
// Replace each Op with its source text, for display.
const S = (x) =>
  Array.isArray(x) && x.length
    ? [x[0].src || x[0].osrc || S(x[0]), ...x.slice(1).map(S)]
    : x

S(tn.parse('1+2*3'))     // => [ '+', 1, [ '*', 2, 3 ] ]
S(tn.parse('-1+2'))      // => [ '+', [ '-', 1 ], 2 ]
S(tn.parse('2+3+4'))     // => [ '+', [ '+', 2, 3 ], 4 ]
S(tn.parse('(1+2)*3'))   // => [ '*', [ '(', [ '+', 1, 2 ] ], 3 ]
```

Two things worth noticing. `2+3+4` groups to the left, because addition's
binding powers say so. And the parenthesis is **kept** in the tree as an
operator of its own rather than dissolved — the tree records that the source
was written with brackets, which matters if you are formatting it back out.

Expressions live wherever values live, so this needs nothing extra:

```ts
S(tn.parse('[1+2, 3*4]'))
// => [ [ '+', 1, 2 ], [ '*', 3, 4 ] ]
```

## The binding-power scale

Each operator gets a `left` and a `right` number. When two operators compete
for a term, the larger binding power wins. The default table is spaced in
millions so there is room to insert between levels:

| Operator | `left` | `right` |
|---|---|---|
| `+` `-` prefix | — | 4000000 |
| `*` `/` `%` | 3000000 | 3100000 |
| `+` `-` infix | 2000000 | 2100000 |

**Associativity is the relationship between the two numbers on one operator.**
`left < right` binds to the left, which is what you want for arithmetic.
`left > right` binds to the right, which is what you want for exponentiation
and assignment.

## Adding operators

`op` is a map of definitions merged over the defaults, so you only name what
you are adding:

```ts
const tn = new Tabnas().use(jsonic).use(Expr, {
  op: {
    exponent:  { infix: true,  left: 5000000, right: 4900000, src: '**' },
    lt:        { infix: true,  left: 1400000, right: 1500000, src: '<' },
    and:       { infix: true,  left: 1000000, right: 1100000, src: '&&' },
    factorial: { suffix: true, left: 6000000,                 src: '!' },
  },
})

S(tn.parse('2**3**2'))     // => [ '**', 2, [ '**', 3, 2 ] ]
S(tn.parse('1<2 && 3<4'))  // => [ '&&', [ '<', 1, 2 ], [ '<', 3, 4 ] ]
S(tn.parse('3! + 1'))      // => [ '+', [ '!', 3 ], 1 ]
```

`**` binds right (`left > right`), so `2**3**2` is `2**(3**2)`. `&&` sits below
comparison, so comparisons bind tighter and become its operands. `!` is a
suffix at the top of the scale, so it takes `3` before `+` sees it.

Setting an operator to `null` removes it. Be aware of what that means: the
symbol is no longer an operator, but it is still lexable text, so in a relaxed
grammar like jsonic `1 % 2` becomes the implicit list `[1, '%', 2]` rather than
a syntax error. Removing an operator is not the same as forbidding it.

## Function-call and index syntax

A `paren` operator with a **preval** takes the value written immediately before
it as its first term. That is all a function call is:

```ts
const tn = new Tabnas().use(jsonic).use(Expr, {
  op: {
    call:  { paren: true, osrc: '(', csrc: ')', preval: { active: true } },
    index: { paren: true, osrc: '[', csrc: ']', preval: { required: true } },
  },
})

S(tn.parse('max(1,2)'))   // => [ '(', 'max', [ 1, 2 ] ]
S(tn.parse('f(1)'))       // => [ '(', 'f', 1 ]
S(tn.parse('a[1]'))       // => [ '[', 'a', 1 ]
```

`active` means the preceding value is used *if present*, so `(1+2)` still
groups. `required` means the operator only matches with one, which is what
keeps `[` working as a list bracket everywhere else.

Ternaries are declared with a two-element `src`:

```ts
const tn = new Tabnas().use(jsonic).use(Expr, {
  op: { ternary: { ternary: true, src: ['?', ':'], left: 1500000, right: 1400000 } },
})

S(tn.parse('a ? b : c'))   // => [ '?', 'a', 'b', 'c' ]
```

## Computing a value instead

Pass `evaluate` and the plugin reduces each node as it closes, so `parse`
returns the answer rather than the tree:

```ts
const math = (rule, ctx, op, terms) => {
  if (op.paren) return terms[0]
  if (op.prefix) return '-' === op.src ? -terms[0] : +terms[0]
  switch (op.src) {
    case '+': return terms[0] + terms[1]
    case '-': return terms[0] - terms[1]
    case '*': return terms[0] * terms[1]
    case '/': return terms[0] / terms[1]
    default:  return NaN
  }
}

const tn = new Tabnas().use(jsonic).use(Expr, { evaluate: math })

tn.parse('1+2*3')            // => 7
tn.parse('-(1+2)*3')         // => -9
tn.parse('a: 2*(3+4), b: 1') // => { a: 14, b: 1 }
```

Check `op.prefix` before switching on `op.src`: `-` is both a prefix and an
infix operator and they arrive at the same callback with a different number of
terms.

**Evaluating during the parse is a choice, not the default.** It is the right
one for a configuration language, where the result is a value. It is the wrong
one for anything that wants to inspect, rewrite or re-emit the source — keep
the tree and walk it afterwards.

## What this costs

The expression grammar is not a small addition. It brings its own rules,
counters and edge cases around implicit lists and maps, and it changes what
some inputs mean. On plain jsonic, `a: 1-2` parses to the string `'1-2'`;
install `Expr` and it is a subtraction. That is usually the point, but it is a
behaviour change to existing input, so install it on a derived instance
(`base.make().use(Expr)`) if other code depends on the original.

## See also

- [Handle recursion and repetition](/how-to/recursion-and-repetition/) — what to
  do when the nesting isn't operator precedence.
- [Write a parameterised parser](/how-to/parameterised-parsers/) — the option
  pattern `Expr` follows.
- [@tabnas/expr](https://github.com/tabnas/expr) — the full operator table and
  the Pratt implementation.
