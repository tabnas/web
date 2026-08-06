---
title: Write a parameterised parser
description: One plugin, many dialects — take options and let them decide the tokens, the lexer and the rules.
group: Composing grammars
order: 3
packages: ["directive", "csv", "expr"]
---

Formats come in families. CSV is also TSV and also semicolon-separated. A
directive is `@` for one language and `$` for another. Writing a grammar per
member of the family is the wrong shape; a grammar that takes options is the
right one, and every published plugin is built that way.

## The shape

A plugin is a function of an instance and its options, with a `defaults`
property. The engine merges what the caller passed over the defaults, so a
plugin only ever reads one settled object:

```ts
import { Tabnas } from '@tabnas/parser'
import { json } from '@tabnas/json'

// Recognise `250ms`, `10mb` — a number with one of a configurable set
// of unit suffixes — as a single value.
const Units = (tn, opts) => {
  tn.options({
    match: {
      value: {
        unit: {
          match: new RegExp(`^(\\d+)(${opts.suffix.join('|')})`),
          val: (res) => ({ n: +res[1], unit: res[2] }),
        },
      },
    },
  })
}

Units.defaults = { suffix: ['ms', 's', 'm', 'h'] }

new Tabnas({ plugins: [json] }).use(Units).parse('{"t": 250ms}')
// => { t: { n: 250, unit: 'ms' } }

new Tabnas({ plugins: [json] }).use(Units, { suffix: ['kb', 'mb'] }).parse('{"n": 10mb}')
// => { n: { n: 10, unit: 'mb' } }
```

The merge is deep, so a caller can override one leaf of a nested option without
restating the rest. The settled options are recorded on the instance, keyed by
the plugin's lowercased function name:

```ts
tn.internal().merged.plugin
// => { json: {}, units: { suffix: [ 'ms', 's', 'm', 'h' ] } }
```

That is worth knowing when a grammar misbehaves: it tells you what the plugin
actually ran with, rather than what you meant to pass.

## Derive, don't mutate

`use()` changes the instance it is called on. If anything else holds that
instance, parameterise a copy:

```ts
const base = new Tabnas({ plugins: [json] })
const derived = base.make().use(Units)

derived.parse('{"t":1s}')   // => { t: { n: 1, unit: 's' } }
base.parse('{"t":1}')       // => { t: 1 } — unchanged
```

## What options can reach

An option is only useful if it can change something. In practice there are five
levers, and `@tabnas/csv` — a grammar whose whole job is to be configurable —
pulls all of them.

### Redefine a token

The field separator is not a special case in the CSV grammar. The grammar is
written against `#CA`, and the option rebinds what `#CA` matches:

```ts
tn.options({ fixed: { token: { '#CA': options.field.separation } } })
```

Which is why the same grammar reads TSV:

```ts
import { jsonic } from '@tabnas/jsonic'
import { Csv } from '@tabnas/csv'

new Tabnas().use(jsonic).use(Csv).parse('a,b\n1,2')
// => [ { a: '1', b: '2' } ]

new Tabnas().use(jsonic).use(Csv, { field: { separation: '\t' } }).parse('a\tb\n1\t2')
// => [ { a: '1', b: '2' } ]

new Tabnas().use(jsonic).use(Csv, { field: { separation: ';' } }).parse('a;b\n1;2')
// => [ { a: '1', b: '2' } ]
```

### Turn a lexer off

Whole categories of token are switches. CSV's `number`, `value` and `comment`
options are passed straight through:

```ts
new Tabnas().use(jsonic).use(Csv, { number: true }).parse('a,b\n1,2')
// => [ { a: 1, b: 2 } ]     — numbers, not strings

new Tabnas().use(jsonic).use(Csv, { comment: true }).parse('#note\na,b\n1,2')
// => [ { a: '1', b: '2' } ]
```

### Change what is ignored

Space and newline are in the `IGNORE` token set by default. CSV takes newline
out of it always, and space too in strict mode, because in that dialect they
are content. See
[parsing a line-oriented format](/how-to/line-oriented-formats).

### Include or exclude rules

Alternates carry group tags, and `rule.exclude` drops every alternate in a
group at derive time. Strict CSV switches off the embedded-JSON and implicit
structure rules with one option:

```ts
tn.options({ rule: { exclude: 'jsonic,imp' } })
```

### Wrap the parser

When the option changes the shape of the *result* rather than the grammar, wrap
`parser.start`. CSV's `stream` option does exactly this — records are handed to
a callback and the return value is empty:

```ts
const rows = []
const tn = new Tabnas().use(jsonic).use(Csv, { stream: (what, rec) => rows.push([what, rec]) })

tn.parse('a,b\n1,2\n3,4')
// => []

rows
// => [ [ 'start', null ],
//      [ 'record', { a: '1', b: '2' } ],
//      [ 'record', { a: '3', b: '4' } ],
//      [ 'end', null ] ]
```

## When the options *are* the grammar

`@tabnas/directive` is the extreme case: the plugin has no fixed syntax at all.
Every part of it — the token that opens it, the optional closing token, what it
does, and where it is allowed — arrives as an option, so the same plugin
installed twice gives two unrelated statements:

```ts
import { Directive } from '@tabnas/directive'

const env = { HOME: '/home/dev' }

const tn = new Tabnas().use(jsonic)
  .use(Directive, { name: 'env',   open: '$', action: (r) => { r.node = env[String(r.child.node)] } })
  .use(Directive, { name: 'upper', open: '^', action: (r) => { r.node = String(r.child.node).toUpperCase() } })

tn.parse('a: $HOME, b: ^hello')
// => { a: '/home/dev', b: 'HELLO' }
```

The `name` option is not decoration — it names the rule the plugin installs and
the counter it uses, which is what keeps two instances from colliding.

`@tabnas/expr` sits in between: the option is a *table*, merged over a default
table. Naming an operator overrides it, naming a new one adds it, and setting
one to `null` removes it. See
[parsing expressions with precedence](/how-to/expressions-with-precedence).

## Fail fast on bad options

A grammar that is misconfigured fails late and confusingly — usually as
"unexpected character" somewhere unrelated. Check what you depend on while you
still have a good message to give. `tn.rule()` with no arguments returns the
rule map, which is all a precondition needs:

```ts
const Suffix = (tn, opts) => {
  const rules = tn.rule()
  if (null == rules || null == rules.val) {
    throw new Error(
      "Suffix: the 'val' rule is missing; register a grammar that " +
      'defines it before this plugin',
    )
  }
  // …
}
```

`@tabnas/hoover` does exactly this, and the message it throws — *"the 'val'
rule is missing; register a grammar that defines it before the hoover
plugin"* — tells the caller the fix rather than the symptom. That is the
standard to aim for: the engine ships no grammar of its own, so "register a
grammar first" is the single most common mistake a plugin can catch.

## What this costs

Options are a public interface, and a deep-merged one is easy to grow and hard
to shrink. Two things keep it manageable: put every option in `defaults` so the
full surface is readable in one place, and prefer options that select between
behaviours over options that take a function — a callback is impossible to
serialise, diff, or accept from somewhere you don't trust, and the engine's
[data-first design](/docs/how-it-works) is the thing you would be giving up.

## See also

- [Include one source from another](/how-to/include-other-sources) —
  `Directive` in use.
- [Lex a token the engine doesn't know](/how-to/custom-tokens) — the
  `match.value` matcher used above.
- [Extending a grammar](/docs/extending) — `make()`, `use()` and pruning rules.
