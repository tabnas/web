---
title: Attaching actions
description: Turn a parse into a value — with builtins, named refs, or inline functions.
section: How-to
order: 2
---

A grammar that only recognises input returns nothing useful. Actions build the
result. There are three ways to attach them; prefer them in this order.

## Builtins — no code at all

The engine ships `$`-suffixed action builtins. Referenced by name, they let a
grammar stay pure data:

```ts
tn.grammar({
  options: { rule: { start: 'val' } },
  rule: {
    val: {
      open:  [ { s: '#NR', a: '@value$' } ],
      close: [ {} ],
    },
  },
})

tn.parse('42')   // => 42
```

Nothing in that grammar is a function, so it round-trips through JSON. See
[the rule table](/docs/rule-table#builtin-actions) for the full set.

## Named refs — code, bound out of band

The grammar text stays untouched; behaviour binds through names the compiler
assigns. This is the form to use with ABNF, because it keeps the ABNF valid
RFC 5234.

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

tn.parse('1+2+3').value     // => 6
tn.parse('12+3+45').value   // => 60
```

The total lands on `val`'s node rather than in a variable outside the parse,
so `parse` returns it and the instance carries no state between calls.

Two kinds of name:

- **Alternate marks** — `@<rule>:<phase>:<mark>`, where the mark comes from the
  alternate's leading discriminator. These fire as tokens are matched.
- **Rule-phase hooks** — `@<rule>:bo`, `:ao`, `:bc`, `:ac` for before/after
  open and close. `ac` is where a rule's children are complete, so it's where
  a fold belongs.

### Finding the mark names

Marks are assigned by the compiler. Don't guess:

```bash
tabnas-abnf --marks -f grammar.abnf
```

```
val  o:add  p:add
val  c:_  (empty)
add  o:NR  s:#NR
add  c:_  (empty)
```

If you attach an action to a mark that doesn't exist, the compiler says so
rather than failing silently:

```
AbnfActionError: abnf: action ref '@item:o:ALPHA' matches no open alt
with mark 'ALPHA' in rule 'item'
```

That error is usually caused by desugaring: `[ … ]`, `( … )` and `*( … )`
compile to generated group rules, so the marks belong to rules you didn't
write. The listing above is the authority.

## Inline functions — the most direct

Written straight onto the alternate as `a`:

```ts
tn.grammar({
  options: {
    fixed: { token: { '#PL': '+' } },
    rule: { start: 'val' },
  },
  rule: {
    val: {
      // Start the accumulator at zero.
      open:  [ { p: 'add', a: (r) => { r.node = 0 } } ],
      close: [ {} ],
    },
    add: {
      // Add each number to it.
      open:  [ { s: '#NR', a: (r) => { r.parent.node += r.o[0].val } } ],
      close: [ { s: '#PL', r: 'add' }, {} ],
    },
  },
})

tn.parse('1+2+3')   // => 6
```

Two one-line actions. It works because `r` **repeats** `add` at the same stack
depth rather than pushing it, so every `add` shares one parent and the total
lives in one place. The result rides on the parse rather than an outer
variable, so `parse()` returns it and concurrent parses can't collide.

The cost: the grammar is now code. It can't be serialised, printed back as
ABNF, or safely accepted from anywhere you don't trust.

## Which to use

| If you want | Use |
|---|---|
| A grammar that survives JSON round-tripping | Builtins |
| A grammar an agent wrote, that you want to check before running | Builtins |
| ABNF that stays valid RFC 5234 | Named refs |
| The result on the parse, not in a closure | Inline functions, with a wrapping rule |

## A note on `r.parent`

Accumulating onto `r.parent` works cleanly in a grammar you wrote as data,
where you control which rules push and which repeat. In an ABNF-compiled
grammar the parent is often a generated group rule, so prefer a rule-phase
hook and an outer variable there.
