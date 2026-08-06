---
title: The rule instance
description: What an action receives — nodes, matched tokens, the rules around it, and the two kinds of scratch data.
section: Tutorials
order: 4
---

Every action, condition and error function is handed the same thing: `r`, the
rule instance. It is the rule *as it is running* — one per activation, not one
per rule — and it is where all the state of a parse lives.

This walks through it with a two-rule grammar you can run. Ten minutes.

## A grammar to look at

`name = value`, and nothing else:

```ts
import { Tabnas } from '@tabnas/parser'

const tn = new Tabnas()
tn.options({
  fixed: { token: { '#EQ': '=' } },
  rule: { start: 'pair' },
})

tn.rule('pair', (rs) => rs
  .open([{ s: ['#TX', '#EQ'], p: 'val' }])
  .close([{ a: (r) => { r.node = { key: r.o0.src, value: r.child.node } } }]))

tn.rule('val', (rs) => rs.open([
  { s: '#NR', a: (r) => { r.node = r.o0.val } },
]))

tn.parse('port = 8080')
// => { key: 'port', value: 8080 }
```

Two rules, four fields of `r` between them. Now the rest.

## Where you are

| Field | What it is |
|---|---|
| `r.name` | the rule's name — `'pair'` |
| `r.state` | `'o'` in the open phase, `'c'` in the close phase |
| `r.d` | stack depth; `0` for the start rule |
| `r.i` | a serial number, unique per rule activation in this parse |

`r.state` matters more than it looks. The same action can be attached to both
phases, and "am I going down or coming back up" is usually the question it
needs answered.

## What you matched

The open phase collects tokens into `r.o`, the close phase into `r.c`:

| Field | What it is |
|---|---|
| `r.o` | tokens matched in the **open** phase |
| `r.o0` `r.o1` | shorthand for `r.o[0]` and `r.o[1]` |
| `r.os` | how many open tokens matched |
| `r.c` | tokens matched in the **close** phase |
| `r.c0` `r.c1` | shorthand for `r.c[0]` and `r.c[1]` |
| `r.cs` | how many close tokens matched |

For the alternate `{ s: ['#TX', '#EQ'] }` on input `port = 8080`:

```ts
r.os        // => 2
r.o0.src    // => 'port'
r.o1.src    // => '='
r.o.map((t) => t.src)   // => [ 'port', '=' ]
```

`r.o0` is the one you will reach for most: it is the token that decided which
alternate you are in, which makes it the right thing to point an
[error](/how-to/parse-errors) at.

### Inside a token

```ts
tn.sub({ lex: (t) => console.log(t.name, t.src, t.val, t.rI, t.cI) })
tn.parse('{"a": 42}')
// #ST  "a"  a   1  2
// #NR  42   42  1  7
```

| Field | What it is |
|---|---|
| `src` | the source text, exactly as written |
| `val` | the resolved value — a real number for `#NR`, the unquoted string for `#ST` |
| `name` `tin` | the token's name and its numeric id |
| `rI` `cI` | row and column, 1-based |

**`src` and `val` are not the same thing**, and picking the wrong one is a
common bug. `r.o0.src` for a number is the string `'42'`; `r.o0.val` is the
number `42`.

## The rules around you

| Field | What it is |
|---|---|
| `r.parent` | the enclosing rule instance |
| `r.child` | the rule instance that just closed beneath this one |
| `r.prev` | the previous instance when a rule repeats |

`r.child` is only meaningful in the close phase — going down, nothing has
closed yet. That is why the `pair` grammar above reads `r.child.node` in
`close` and not in `open`.

Both are always *something*: when there is no parent or child, they are a
sentinel rule whose `name` is empty, not `undefined`. So `r.child.name` is safe
to read; `r.child.name === 'val'` is the check to write, rather than a null
test.

## The value: `r.node`

`r.node` is what the rule carries, and the start rule's `r.node` is what
`parse()` returns.

A pushed rule's node is **seeded from its parent**. That is why
`@setval$` can write into `r.node` from inside `pair` and have the result land
in the enclosing map — they are the same object. It is also why
[`@reset$`](/docs/builtin-actions) exists: a rule that needs its own scalar
value has to clear the inherited one first.

## Scratch data: `u` and `k`

Two bags for your own use. They differ in exactly one way, and it is the
important one:

| Field | Scope |
|---|---|
| `r.u` | this rule instance only |
| `r.k` | this rule **and every rule pushed or repeated below it** |

```ts
tn.rule('top', (rs) => rs
  .open([{ p: 'item', u: { onlyHere: 1 }, k: { everywhere: 2 } }]))

tn.rule('item', (rs) => rs.open([{ s: '#NR', a: (r) => {
  r.u.onlyHere      // => undefined — did not propagate
  r.k.everywhere    // => 2         — did
} }]))
```

Use `u` for something the rule needs between its own open and close phases —
the captured key in a `key = value` pair. Use `k` for configuration that a
whole subtree should see.

## Counters: `r.n`

`n` is a third bag, for numbers, and it propagates like `k`. It has comparison
helpers, and a trap:

| Helper | True when |
|---|---|
| `r.eq('k', n)` | the counter equals `n` |
| `r.lt` `r.lte` | below / at most `n` |
| `r.gt` `r.gte` | above / at least `n` |

**An unset counter compares as true against every one of them.** Not just
`lt` — `r.gt('depth', 99)` is also true when `depth` has never been set. This
is deliberate (a rule that never counts should not be blocked by a limit) and
it is the single most common source of a guard that fires on the first token.
[Conditions and counters](/docs/conditions) covers it properly.

## Reading it live

You do not have to guess at any of this:

```ts
tn.sub({ rule: (r) => console.log(`${r.name}~${r.state}@${r.d}`) })
tn.parse('1+2')
// __start__~o@0 val~o@1 add~o@2 add~c@2 add~o@2 add~c@2 val~c@1 __start__~c@0
```

Two `add` instances at the same depth is a repeat; increasing depth is a push.
See [debugging a grammar](/how-to/debug-a-grammar) for the full trace.

## Next

- [Builtin actions](/docs/builtin-actions) — building `r.node` without writing
  any code.
- [Conditions and counters](/docs/conditions) — using `r.n` and `r.u` to pick
  an alternate.
- [The rule table](/docs/rule-table) — the alternate fields that populate all
  of the above.
