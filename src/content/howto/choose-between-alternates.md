---
title: Choose between alternates
description: Order, lookahead, conditions, counters and group tags — how the engine picks a branch, and how to make it pick yours.
group: Shaping the parse
order: 2
---

Every rule phase is a list of alternates, tried in order, first match wins.
There is no backtracking: once an alternate is taken the parse commits to it.
That makes dispatch fast and predictable, and it makes *the order of your
alternates part of your grammar*.

Nearly every "why did it parse that way" question is one of the five tools
below.

## Order — most specific first

Two alternates whose leading tokens overlap will always resolve to the earlier
one. So the longer, more specific pattern goes first:

```ts
tn.rule('stmt', (rs) => rs.open([
  { s: ['#TX', '#CO', '#TX', '#AR'], p: 'tail', a: typedArrow },
  { s: ['#TX', '#CO', '#TX'],                   a: typed },
  { s: ['#TX'],                                 a: bare },
]))

tn.parse('a :: int -> b')   // => { kind: 'typed-arrow', name: 'a', type: 'int' }
tn.parse('a :: int')        // => { kind: 'typed',       name: 'a', type: 'int' }
tn.parse('a')               // => { kind: 'bare',        name: 'a' }
```

Reverse those three and every input is `bare`, with no error to tell you.

## Lookahead — as many tokens as you need

`s` is a *sequence*: the alternate matches only if all of its tokens match, in
order. The example above looks four tokens ahead. There is no two-token limit —
that claim appears in some older notes and is wrong.

Lookahead is free in the sense that it does not backtrack: the tokens are
peeked, and the alternate either matches or the next one is tried.

## Alternation inside one position

A nested array is "any of these", at a single position:

```ts
{ s: [['#OB', '#OS']] }   // one token: either { or [
{ s: ['#OB', '#OS'] }     // two tokens: { followed by [
```

That is the most common typo in a hand-written table, and it fails as
"unexpected character" on input that looks obviously valid.

## Conditions — `c`

When the tokens cannot tell two cases apart, the state can. `c` is a predicate
on the rule instance; the alternate only applies if it returns true:

```ts
// Only a val that opened on '(' may consume ')'.
{ s: '#CP', c: (r) => OP === r.o0?.tin, a: (r) => { r.node = [r.child.node] } }
```

`r.o0` is the first token matched in the open phase, `r.parent` the enclosing
rule, `r.child` the one that just closed. Anything reachable from the rule
instance is fair game.

## Counters — `n`

`n` sets or increments a named counter, and counters **propagate to pushed and
repeated rules** — so a counter set at the top is visible all the way down. The
comparison helpers read them:

| Helper | True when |
|---|---|
| `r.eq('k', n)` | counter equals `n` |
| `r.lt` `r.lte` | counter is below / at most `n` |
| `r.gt` `r.gte` | counter is above / at least `n` |

```ts
{ s: '#OB', p: 'map', n: { depth: 1 } }                     // count a level
{ s: '#OB', b: 1, c: (r) => !r.lt('depth', 3), e: tooDeep } // refuse past three
```

**An unset counter compares as true against every limit.** `r.lt('depth', 3)`
is true when `depth` has never been set, and so is `r.gt('depth', 3)`. Guards
written the obvious way therefore fire on the very first token; write the
condition so that the "not yet counting" case lands on the side you want, and
test the zero case explicitly.

Setting a counter to `0` resets it rather than incrementing — `n: { pk: 0 }`
in the JSON grammar is a reset, not a no-op.

## Push-back — `b`

`b: n` returns `n` matched tokens to the stream. It is how an alternate can
*inspect* without *consuming*:

```ts
{ s: '#OB', p: 'map', b: 1 }   // decide to parse a map, let map read the '{'
```

The JSON grammar uses it for exactly that: `val` recognises `{`, pushes `map`,
and hands the brace back so `map` can match its own opening token.

## Group tags — `g`

Every alternate can carry group tags, and an instance can include or exclude
whole groups when it is derived. This is how one grammar ships several
dialects:

```ts
const mini = (tn) => {
  tn.options({ rule: { start: 'val' } })
  tn.rule('val', (rs) => rs.open([
    { s: '#NR', a: (r) => { r.node = r.o[0].val }, g: 'num' },
    { s: '#TX', a: (r) => { r.node = r.o[0].src }, g: 'text' },
  ]))
}

const base = new Tabnas({ plugins: [mini] })
base.parse('x')     // => 'x'

const strict = base.make({ rule: { exclude: 'text' } })
strict.parse('1')   // => 1
strict.parse('x')   // throws [tabnas/unexpected]
base.parse('x')     // => 'x' — the original is untouched
```

`rule.include` is the inverse: with any include set, only tagged alternates
that match survive. `@tabnas/csv` uses `exclude: 'jsonic,imp'` to turn its
strict mode on.

**Filtering happens when an instance is derived, and derivation re-runs
plugins.** Rules registered with a bare `tn.rule(…)` outside a plugin are *not*
carried into `make()` — the derived instance simply won't have them. Put the
grammar in a plugin function, as above, and this works; define it inline and it
silently doesn't.

## The empty alternate

`{}` matches anything and consumes nothing, which is how a phase ends. Every
phase needs one, or a way to reach a token that satisfies it — if no alternate
matches, that is a parse error.

It is also a trap in a close phase: an empty alternate will happily end a rule
that should have insisted on a closing token, producing `undefined` rather than
an error. If a rule has a required terminator, make the empty alternate
conditional or replace it with an
[error alternate](/how-to/parse-errors).

## Seeing which one fired

Guessing is optional. `@tabnas/debug`'s trace prints the alternate index chosen
at every step:

```
parse  "2"   ["+"]~[#PL]   2  . . alt=0  []   g:abnf   r:add
```

`alt=0` is the index into the phase's alternate list, `g:` its group tags, and
`r:`/`p:` what it did next. See [debugging a grammar](/how-to/debug-a-grammar).

## See also

- [The rule table](/docs/rule-table) — every alternate field in one table.
- [Handle recursion and repetition](/how-to/recursion-and-repetition) — `p`,
  `r`, and counters as depth guards.
- [Give good parse errors](/how-to/parse-errors) — `e`, the alternate that
  exists to fail well.
