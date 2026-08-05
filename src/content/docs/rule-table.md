---
title: The rule table
description: The grammar format the engine walks — rules, phases, alternates, and the fields on each.
section: Reference
order: 1
---

A grammar is a table. ABNF compiles to it, plugins build it programmatically,
and you can write it directly as data. This page is the format.

## Shape

```ts
{
  options: {
    fixed: { token: { '#PL': '+' } },   // custom fixed tokens
    rule:  { start: 'val' },            // where parsing begins
  },
  rule: {
    val: {
      open:  [ { p: 'add' } ],
      close: [ {} ],
    },
    add: {
      open:  [ { s: '#NR' } ],
      close: [ { s: '#PL', r: 'add' }, {} ],
    },
  },
}
```

Each rule has an **open** phase (on the way down) and a **close** phase (on the
way back up). Each phase holds a list of **alternates**, tried in order. The
first one whose token pattern matches wins.

## Alternate fields

| Field | Meaning |
|---|---|
| `s` | Match this token sequence. One token, or several for lookahead. |
| `p` | **Push** a child rule. It nests: the child's `parent` is this rule. |
| `r` | **Repeat** a rule at the same stack depth. No nesting; the parent is unchanged. |
| `a` | Action — a function, a `@ref` name, a `$`-builtin, or an array of them. |
| `c` | Condition; the alternate only applies when it holds. |
| `{}` | The empty alternate. Ends the phase. |

`p` versus `r` is the distinction worth internalising. Push builds depth, so
`a+b+c` nests three levels. Repeat stays flat, so every repetition shares one
parent — which is what lets an accumulator be a single value in a single place.

**Every phase needs a way out.** If no alternate matches, that is a parse
error. `{}` matches anything and does nothing, which is how a rule ends.

## The rule instance

Actions receive `r`, the current rule instance:

| Property | What it is |
|---|---|
| `r.node` | The value this rule carries. What `parse()` returns for the start rule. |
| `r.o` | Tokens matched in the open phase. `r.o[0].val` is the first token's value, `r.o[0].src` its source text. |
| `r.parent` | The enclosing rule instance. |
| `r.child` | The rule instance just closed beneath this one. |

## Tokens

Some tokens exist before you declare anything:

| Token | Matches |
|---|---|
| `#NR` | A number. `val` is a real number, not a string. |
| `#TX` | Bare text. |
| `#ST` | A quoted string. |
| `#CA` | `,` |
| `#CL` | `:` |
| `#OB` `#CB` | `{` `}` |
| `#OS` `#CS` | `[` `]` |
| `#SP` `#LN` | Space, newline. |
| `#ZZ` | End of source. |

Declare your own under `options.fixed.token`. Pick a name that isn't taken —
`#CM` is *comment*, not comma, and silently redefining it will cost you an
afternoon.

## Builtin actions

The engine ships `$`-suffixed action builtins, merged into the ref map when the
grammar loads. Because they are referenced by name, a grammar using only these
is **pure JSON with no functions in it** — serialisable, diffable, and safe to
accept from somewhere else.

| Builtin | Effect |
|---|---|
| `@object$` | `r.node = {}` |
| `@array$` | `r.node = []` |
| `@key$` | Capture the matched key token. |
| `@setval$` | Assign the child's node as an object property. |
| `@push$` | Append the child's node to an array. |
| `@value$` | Resolve the matched scalar token. |
| `@reset$` | Clear the parent-seeded node. |
| `@node$` `@capture$` `@bubble$` | Rebuild the `{ rule, src, kids }` tree. Used by the ABNF compiler. |

```ts
{
  options: { rule: { start: 'val' } },
  rule: {
    val: {
      open:  [ { s: '#NR', a: '@value$' } ],
      close: [ {} ],
    },
  },
}

// tn.parse('42')  =>  42
```

## Constraints

These are properties of the machine, not gaps to be filled later:

- **Deterministic dispatch.** Alternates are tried in order and the first
  match wins, so two alternates that can't be told apart from their leading
  tokens will resolve to whichever comes first.
- **No backtracking.** One path through, or an error.
- **No ambiguity.** One parse per input.
- **A hand-written grammar has no end-of-source check.** The ABNF compiler adds
  a `__start__` wrapper that consumes `#ZZ`; if you write the table yourself,
  trailing input can be silently ignored unless you handle it.

## See also

- [ABNF grammars](/docs/abnf-grammars) — the notation that compiles to this.
- [Attaching actions](/docs/actions) — the three ways to bind behaviour.
- [How it works](/docs/how-it-works) — why the machine has this shape.
