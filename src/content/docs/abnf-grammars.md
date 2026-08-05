---
title: ABNF grammars
description: Define a language fast using the RFC 5234 ABNF dialect.
section: How-to
order: 1
---

The `@tabnas/abnf` plugin compiles [RFC 5234](https://www.rfc-editor.org/rfc/rfc5234)
ABNF straight into a working grammar. It's the fastest way to define a language.

```ts
const tn = new Tabnas({ plugins: [abnf] })
tn.abnf(`greet = "hi" / "hello"`)
tn.parse('hi') // => { rule: 'greet', src: 'hi', kids: [] }
```

## Dialect

tabnas uses the RFC 5234 dialect: `=` for definitions and `/` for
alternatives (not `::=` or `|`).

- **Literals**: `"+"`, case-insensitive by default; `%s"Hi"` is case-sensitive.
- **Optional**: `[ … ]`.
- **Repetition**: `*element` (zero or more), `1*element` (one or more),
  `2*4element` (bounded).
- **Grouping**: `( … )`.
- **Char ranges**: `%x30-39`.
- **Built-in tokens** by bareword: `NR` (number), plus core rules like `ALPHA`
  and `DIGIT`.

## Left recursion

Left-recursive rules are accepted directly. A left-recursion pass ([Paull's](https://en.wikipedia.org/wiki/Left_recursion#Removing_all_left_recursion) — Wikipedia describes the method without using the name)
algorithm) rewrites both direct (`P = P a / b`) and indirect recursion into the
iterative form the engine runs without re-entering a rule at the same position:

```
P = P a / b     →     P = b *(a)
```

Because it's a rewrite, the tree is flat rather than left-nested, and a
**purely** left-recursive rule (no base branch) is an error. See the
[@tabnas/abnf README](https://github.com/tabnas/abnf#readme) for the full
details and caveats.

## Actions

Attach behaviour with `@ref` action references, passed as `actions` and keyed
by rule and phase. There are two forms:

- `'@add:o:NR'` — an **alternate** action: runs when the `add` rule opens on an
  `NR` token. The trailing mark is the alternate's leading discriminator.
- `'@add:ac'` — a **rule-phase** hook: after-close. Also `bo`, `ao` and `bc`
  for before-open, after-open and before-close. `ac` is where a rule's
  children are complete, so it's where a fold belongs.

```ts
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
```

`r` is the rule instance and `r.o` the tokens matched in the open phase, so
`r.o[0].val` is the value of the first — a real number, courtesy of the lexer.

### Finding the marks

An alternate mark comes from the alternate's leading discriminator, which the
compiler assigns — so don't guess at the name, ask for it:

```bash
tabnas-abnf --marks -f grammar.abnf
```

```
val  o:add  p:add
val  c:_  (empty)
add  o:NR  s:#NR
add  c:_  (empty)
```

`markListing(spec)` gives the same listing from code. Reading it also tells you
the shape the compiler produced: `val o:add p:add` says `val` pushes `add` as a
child rule, which is what `val = add` asks for.

Requires `@tabnas/abnf` 0.2.4 or later. Before that, a production whose single
alternative was one rule reference got dissolved by the left-recursion pass —
`val = add` was rewritten to `val = NR [ PL add ]`, so `val` vanished from the
tree and picked up an `o:NR` mark that belonged to `add`.

### Parents and generated rules

ABNF also desugars `[ … ]` and `( … )` into generated group rules, so a rule's
`parent` at runtime is often one of those rather than the rule above it in your
source. Accumulating onto `r.parent` works cleanly in a grammar defined
[as data](/#a-grammar-end-to-end), where `r` repeats a rule at the same stack
depth; with ABNF, keep the accumulator outside the parse — a `bo` hook on the
start rule is a good place to reset it.
