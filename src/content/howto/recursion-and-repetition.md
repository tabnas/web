---
title: Handle recursion and repetition
description: Repeat without nesting, nest without recursing forever, and get left recursion past a push-down engine.
group: Shaping the parse
order: 1
packages: ["abnf"]
---

The engine is a push-down machine with no backtracking. It never re-enters a
rule at the same input position, which is what makes a parse linear and
predictable — and also what makes "a list of things" and "a thing inside a
thing" two different constructions rather than one.

Getting them the right way round is most of what a rule table gets wrong.

## Repetition is `r`

`r` runs a rule again **at the same stack depth**. Nothing nests, so every
repetition has the same parent, and an accumulator can live in one place:

```ts
tn.grammar({
  options: {
    fixed: { token: { '#PL': '+' } },
    rule: { start: 'val' },
  },
  rule: {
    val: {
      open:  [ { p: 'add', a: (r) => { r.node = 0 } } ],
      close: [ {} ],
    },
    add: {
      open:  [ { s: '#NR', a: (r) => { r.parent.node += r.o[0].val } } ],
      close: [ { s: '#PL', r: 'add' }, {} ],
    },
  },
})

tn.parse('1+2+3')   // => 6
```

`r.parent` is `val` for the first `add` and for every one after it, and
`r.d` — the stack depth — stays at 1. That is the property to reach for: if
what you are parsing is a *sequence*, `r` keeps it flat and the result lives
somewhere you can get at.

In ABNF this shape is written as a tail self-reference, and the compiler emits
the same repeat:

```ts
tn.abnf(`
  val = add
  add = NR [ PL add ]
  PL  = "+"
`)

tn.parse('1+2+3')
// => { rule: 'val', src: '1+2+3', kids: [
//      { rule: 'add', src: '1', kids: [] },
//      { rule: 'add', src: '2', kids: [] },
//      { rule: 'add', src: '3', kids: [] } ] }
```

Three siblings, not three levels. `*( … )` and `1*( … )` also repeat, but they
desugar into a generated group rule, so the repeated content is a child of a
rule you did not write — fine for recognition, awkward for actions. The tail
self-reference is the one that stays flat.

### The trap

`r` in a **close** phase replaces the *current* rule at its depth, so the
repetition's parent is the current rule's parent — not the current rule. Put a
repeat in the wrong phase and the accumulator you were reaching for is gone:

```ts
// WRONG: `line` replaces `doc`, so line's parent is whatever contained doc.
doc:  { close: [ { r: 'line' } ] }

// RIGHT: `line` replaces itself, so its parent is still doc.
doc:  { open: [ { p: 'line' } ] }
line: { close: [ { s: '#LN', r: 'line' }, {} ] }
```

The symptom is `r.parent.node` being `undefined` on the second repetition and
only the second. If you see that, this is why.

## Nesting is `p`

`p` **pushes** a child rule, so depth grows and the child's `parent` is the
rule that pushed it. Use it when the structure really is inside something else:

```ts
const tn = new Tabnas()
tn.options({
  fixed: { token: { '#OP': '(', '#CP': ')' } },
  rule: { start: 'val' },
})

const OP = tn.fixed('(')

tn.rule('val', (rs) => rs
  .open([
    { s: '#OP', p: 'val' },
    { s: '#NR', a: (r) => { r.node = r.o[0].val } },
  ])
  .close([
    // Only a val that opened on '(' may consume ')'.
    { s: '#CP', c: (r) => OP === r.o0?.tin, a: (r) => { r.node = [r.child.node] } },
    {},
  ]))

tn.parse('1')         // => 1
tn.parse('(1)')       // => [ 1 ]
tn.parse('(((1)))')   // => [ [ [ 1 ] ] ]
```

The condition on the close alternate is not optional decoration. Without it the
innermost `val` — the one that opened on the number — happily consumes the
first `)`, the outer one never sees its closing bracket, and the result is
`undefined` with no error. **A rule that can close on a delimiter must check
that it opened on the matching one.** `r.o0` is the first token the rule
matched, so its `tin` is that check.

## Left recursion

`P = P a / b` is the natural way to write a left-associative operator and the
one thing a push-down engine cannot run directly: `P` would re-enter itself
without consuming input. Write it in a hand-built rule table and you get
infinite recursion.

`@tabnas/abnf` accepts it anyway. A rewriting pass (Paull's algorithm) turns
direct and indirect left recursion into the iterative form before the grammar
is built:

```
P = P a / b     →     P = b *(a)
```

```ts
tn.abnf(`
  expr = expr PL term / term
  term = NR
  PL   = "+"
`)

tn.parse('1+2+3').kids.map((k) => k.rule)
// => [ 'term', 'term' ]
```

Three costs, all worth knowing before you rely on it:

- **The tree is flat, not left-nested.** The leading operand folds into the
  rule itself, so `1+2+3` yields two `term` children, not a left spine.
  Associativity has to be applied in an action.
- **`@ref` actions on the rewritten branches are look-up-only.** Attach actions
  to the sub-rules instead.
- **A purely left-recursive rule is an error.** `P = P a` with no base branch
  cannot be rewritten, and the compiler says so.

If you want operator precedence rather than a single left-associative rule,
don't write it as recursion at all —
[use `@tabnas/expr`](/how-to/expressions-with-precedence), which does it with
binding powers and no rule chain.

## Stopping unbounded nesting

Recursion that terminates on well-formed input still doesn't terminate on
hostile input. A counter (`n`) and a condition (`c`) put a ceiling on it. Here
the counter is added to the two alternates that push a structure, and a guard
alternate in front refuses to open another one past the limit:

```ts
import { json } from '@tabnas/json'

const MAX = 3
const tn = new Tabnas({ plugins: [json] })

tn.options({
  error: { too_deep: 'nested deeper than {max} levels' },
  hint:  { too_deep: 'Deeply nested input is often hostile. Raise the limit if it is not.' },
})

tn.rule('val', (rs) => rs.open(
  [ { s: [['#OB', '#OS']], b: 1,
      c: (r) => !r.lt('depth', MAX),
      e: (r) => r.o0.bad('too_deep', { max: MAX }) } ],
  { custom: (alts) => (alts[1].n = alts[2].n = { depth: 1 }, alts) },
))

tn.parse('{"a":{"b":{"c":1}}}')        // => { a: { b: { c: 1 } } }
tn.parse('[1,2,3]')                    // => [ 1, 2, 3 ]
tn.parse('{"a":{"b":{"c":{"d":1}}}}')  // throws [tabnas/too_deep]
tn.parse('[[[[1]]]]')                  // throws [tabnas/too_deep]
```

Three details do the work. `s: [['#OB', '#OS']]` is *one* position matching
either token — a nested array is alternation, a flat one is a sequence.
Counters set with `n` propagate to pushed and repeated rules, so `depth` counts
levels rather than occurrences. And `b: 1` puts the token back, so the guard
inspects without consuming.

Note the double negative in the condition: an unset counter reads as `0`, so
`r.lt('depth', MAX)` is true at depth 0, and the guard wants the opposite.
(Before 0.6 an unset counter compared as `true` against *every* limit, so the
same reasoning had to hold in both directions at once.)

The `custom` modifier reaches into the host grammar's alternates by index,
which is a real coupling — indices 1 and 2 are the `map` and `list` pushes in
`@tabnas/json` as it stands today. Print `tn.rule('val').def.open` before and
after, and pin the version.

`options.rule.maxmul` is a different backstop, and worth knowing about: the
engine caps total rule steps at a multiple of the input length (`maxmul`
defaults to `3`), which catches a grammar that loops without consuming rather
than one that nests too far.

## See also

- [Choose between alternates](/how-to/choose-between-alternates) — `c`, `b` and
  multi-token lookahead in their own right.
- [The rule table](/docs/rule-table) — `p` versus `r`, and every alternate
  field.
- [ABNF grammars](/docs/abnf-grammars) — repetition notation and the
  left-recursion pass.
