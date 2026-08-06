---
title: Conditions and counters
description: Pick an alternate on state rather than tokens — with a predicate, a counter, or a declarative check.
section: Tutorials
order: 6
---

Alternates are chosen by their tokens. When two cases look identical to the
lexer, the difference has to come from somewhere else — how deep you are, what
the enclosing rule is, whether something has already been seen.

That is what `c` is for. This tutorial covers the three ways to write one, and
the one piece of semantics that catches everybody.

## A condition is a predicate

`c` is checked when an alternate's tokens match. If it returns false, the
alternate is skipped and the next one is tried:

```ts
tn.rule('val', (rs) => rs
  .open([{ s: '#OP', p: 'val' }, { s: '#NR', a: setNumber }])
  .close([
    // Only a val that opened on '(' may consume ')'.
    { s: '#CP', c: (r) => OP === r.o0?.tin, a: (r) => { r.node = [r.child.node] } },
    {},
  ]))
```

Everything on [the rule instance](/docs/rule-instance) is available: `r.o0` for
the token that opened this rule, `r.parent`, `r.child`, `r.n`, `r.u`.

## Counters

`n` on an alternate sets or increments a named counter, and counters
**propagate to pushed and repeated rules** — so a count made at the top is
visible all the way down:

```ts
{ s: '#OB', p: 'map', n: { depth: 1 } }   // one level deeper
{ s: '#OB', p: 'map', n: { pk: 0 } }      // reset to 0, not "add nothing"
```

Setting `0` **resets**; any other number adds. `n: { pk: 0 }` in the JSON
grammar is a reset, and reading it as a no-op will mislead you.

The rule instance has comparison helpers:

| Helper | True when |
|---|---|
| `r.eq('k', n)` | the counter equals `n` |
| `r.lt('k', n)` `r.lte` | below / at most `n` |
| `r.gt('k', n)` `r.gte` | above / at least `n` |

## The thing that catches everybody

**An unset counter compares as true against every helper.**

```ts
r.lt('depth', 3)    // true when depth has never been set
r.gt('depth', 3)    // ALSO true when depth has never been set
```

It is deliberate — a rule that never counts should not be blocked by a limit it
knows nothing about — but it means a guard written the obvious way fires
immediately, on the very first token, before anything has been counted.

The habit that avoids it: **write the condition in the permissive direction**,
so "not counting yet" lands on the side that lets the parse continue, and put
the refusal in a later alternate with no condition at all.

## A depth limit, done properly

Nesting is allowed while `depth` is below the limit. Past it, neither push
alternate matches, and the unconditional guard behind them is reached:

```ts
import { json } from '@tabnas/json'

const MAX = 3
const tn = new Tabnas({ plugins: [json] })
tn.options({ error: { too_deep: 'nested deeper than {max} levels' } })

tn.rule('val', (rs) => rs.open(
  [{ s: [['#OB', '#OS']], b: 1, e: (r) => r.o0.bad('too_deep', { max: MAX }) }],
  {
    custom: (alts) => {
      const guard = alts.shift()          // the alternate just prepended
      alts[0].n = alts[1].n = { depth: 1 }               // map and list push
      alts[0].c = alts[1].c = { 'n.depth': { $lt: MAX } }
      alts.splice(2, 0, guard)            // guard sits behind them
      return alts
    },
  },
))

tn.parse('{"a":1}')                    // => { a: 1 }
tn.parse('{"a":{"b":{"c":1}}}')        // => { a: { b: { c: 1 } } }
tn.parse('[[[1]]]')                    // => [ [ [ 1 ] ] ]

tn.parse('{"a":{"b":{"c":{"d":1}}}}')  // throws [tabnas/too_deep]
tn.parse('[[[[1]]]]')                  // throws [tabnas/too_deep]
```

Note the order: the two push alternates carry the condition, and the guard is
*after* them. Write it the other way — a `$gte` guard first — and every parse
fails at the opening brace, because `depth` is unset there and `$gte` passes.

## Declarative conditions

`c` also takes an **object**, which is a check against a path on the rule
instance. This keeps a grammar as data — no closure, so it still serialises:

```ts
{ s: '#OB', p: 'map', c: { 'n.depth': { $lt: 3 } } }
```

The key is a dot-path resolved against `r`, so `n.depth` is the counter,
`u.mode` is your own scratch value, `o0.tin` is the opening token.

| Form | Meaning |
|---|---|
| `{ 'n.depth': { $lt: 3 } }` | below |
| `$lte` `$gt` `$gte` | at most / above / at least |
| `{ 'u.mode': 'strict' }` | a bare value is `$eq` |
| `{ 'u.mode': { $ne: 'loose' } }` | not equal |

Several keys are **ANDed** — every one must hold:

```ts
{ c: { 'n.depth': { $gte: 1 }, 'u.mode': 'strict' } }
```

### The two halves behave differently

This is worth pinning down, because the asymmetry is invisible in the syntax:

```ts
// $eq does NOT match an unset path
{ c: { 'u.flag': 1 } }              // skipped when u.flag is unset

// the ordered ops DO pass an unset path
{ c: { 'n.never': { $gte: 99 } } }  // taken when n.never is unset
```

So `$eq` fails closed and `$lt`/`$lte`/`$gt`/`$gte` fail open. Reach for the
ordered ops in the permissive direction, as above, and for `$eq` when you want
"only if this was explicitly set".

## Which form to use

| If you want | Use |
|---|---|
| A grammar that stays serialisable | the object form |
| A grammar an agent emitted, checkable before running | the object form |
| Anything the object form can't express | a function |

The object form covers comparisons against rule state, which is most guards.
Anything involving two paths, arithmetic, or a call into your own code needs a
function — and the grammar becomes code at that point.

## Next

- [The rule instance](/docs/rule-instance) — every path the object form can
  reach.
- [Choose between alternates](/how-to/choose-between-alternates) — order,
  lookahead and group tags, the other ways to pick a branch.
- [Give good parse errors](/how-to/parse-errors) — the `e` alternate the guard
  above uses.
