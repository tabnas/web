---
title: Include one source from another
description: Splice a file, a package or an in-memory string into a parse at the point it is referenced.
group: Composing grammars
order: 1
packages: ["multisource", "directive"]
---

Almost every configuration format grows an include statement. The requirement
is always the same shape: a mark in the source names another source, and the
value it parses to is spliced in at that point.

`@tabnas/multisource` is that feature, finished. It is worth reading how it is
built, because the mechanism underneath — `@tabnas/directive` — is how you
would add *any* statement that triggers custom parsing.

## The finished answer

The plugin needs a **resolver**: a function that turns a path into source text.
Two ship with the package, and the in-memory one is the easiest to see:

```ts
import { Tabnas } from '@tabnas/parser'
import { jsonic } from '@tabnas/jsonic'
import { MultiSource } from '@tabnas/multisource'
import { makeMemResolver } from '@tabnas/multisource/resolver/mem'

const tn = new Tabnas().use(jsonic).use(MultiSource, {
  resolver: makeMemResolver({
    'base.jsonic': 'port: 8080, host: localhost',
  }),
})

tn.parse('@"base.jsonic"')
// => { port: 8080, host: 'localhost' }
```

The mark is `@` by default (`markchar` changes it), and the path is an ordinary
value in the host grammar — so it obeys that grammar's quoting rules.

## Where the mark can go

Anywhere a value can go, plus the top of a document:

```ts
tn.parse('cfg: @"base.jsonic"')
// => { cfg: { port: 8080, host: 'localhost' } }

tn.parse('[ @"base.jsonic", 2 ]')
// => [ { port: 8080, host: 'localhost' }, 2 ]

tn.parse('{ @"base.jsonic", extra: 1 }')
// => { port: 8080, host: 'localhost', extra: 1 }
```

The third form is the interesting one. In *key* position the included map's
keys are merged into the enclosing map rather than nested under a key, which is
what makes an include statement feel like an include statement.

## Later wins

Merging is ordinary object merging in source order, so an include followed by a
key overrides that key. This is the whole of "environment overlays":

```ts
const tn = new Tabnas().use(jsonic).use(MultiSource, {
  resolver: makeMemResolver({
    'base.jsonic': 'port: 8080\nhost: localhost',
    'dev.jsonic': '@"base.jsonic"\nport: 3000',
  }),
})

tn.parse('@"dev.jsonic"')
// => { port: 3000, host: 'localhost' }
```

Includes nest: `dev.jsonic` pulls in `base.jsonic` while itself being pulled in.

## Reading real files

`makeFileResolver()` reads from disk, and `path` sets the base directory that
relative references resolve against:

```ts
import { makeFileResolver } from '@tabnas/multisource/resolver/file'

const tn = new Tabnas().use(jsonic).use(MultiSource, {
  resolver: makeFileResolver(),
  path: 'cfg',
})

tn.parse('@"dev.jsonic"')   // reads cfg/dev.jsonic
```

A nested include resolves against *its own* file's directory, not the entry
point's — the usual expectation, and the reason `base` is tracked per source
rather than globally. `makePkgResolver()` does the same job through
`require.resolve`, so a reference can name a published package.

The extension may be left off. `@"base"` searches `base.jsonic`, `base.jsc`,
`base.json` and `base.js`, then the same four as folder index files —
`base/index.*` and `base/index.base.*`.

## Deciding what a file means

The extension picks a **processor**, and processors are just functions that set
`res.val`. Adding a kind is adding a key:

```ts
const tn = new Tabnas().use(jsonic).use(MultiSource, {
  resolver: makeMemResolver({
    'notes.txt': '  hello  ',
    'rows.csv': 'a,b\n1,2',
  }),
  processor: {
    txt: (res) => { res.val = res.src.trim() },
    csv: (res) => { res.val = res.src.trim().split('\n').map((l) => l.split(',')) },
  },
})

tn.parse('note: @"notes.txt"')
// => { note: 'hello' }

tn.parse('rows: @"rows.csv"')
// => { rows: [ [ 'a', 'b' ], [ '1', '2' ] ] }
```

Out of the box: `.jsonic` and `.jsc` parse with the host instance, `.json`
parses as strict JSON, `.js` is evaluated as a module, and anything else is
inserted as a raw string.

## Knowing what was read

Pass a `deps` object in the parse metadata and it comes back filled in — which
is how a build tool knows what to watch:

```ts
const deps = {}
tn.parse('@"dev.jsonic"', { multisource: { deps } })

Object.keys(deps['dev.jsonic'])
// => [ 'base.jsonic' ]
```

The map is keyed by the *including* source's full path. The outermost entry is
keyed by an exported `TOP` symbol rather than a string, so
`Object.keys(deps)` will not show it; import `TOP` from the package and index
with it.

**There is no cycle detection.** Two files that include each other will recurse
until the stack overflows, with a `RangeError` rather than a parse error. If
your inputs are not trusted to be acyclic, walk `deps` yourself before or
during the parse.

## A missing source is a parse error

Not an exception from the file system — an error positioned at the reference,
listing where it looked:

```
[jsonic/multisource_not_found]: source not found: nope.jsonic
  --> <no-file>:1:1
```

## Building your own

Underneath, `MultiSource` is a `Directive`: a token that opens a rule, parses a
value, and hands you the result. The whole of a `$NAME` environment lookup is
one call.

```ts
import { Directive } from '@tabnas/directive'

const env = { HOME: '/home/dev', PORT: '8080' }

const tn = new Tabnas().use(jsonic).use(Directive, {
  name: 'env',
  open: '$',
  action: (rule) => { rule.node = env[String(rule.child.node)] },
})

tn.parse('home: $HOME, port: $PORT')
// => { home: '/home/dev', port: '8080' }
```

`open` is the token that starts the directive. `rule.child.node` is the value
that was parsed after it, and whatever you assign to `rule.node` is the value
the directive produced. Directives compose — a second `use(Directive, …)` adds
another, and they nest:

```ts
const tn = new Tabnas().use(jsonic)
  .use(Directive, { name: 'env',   open: '$', action: (r) => { r.node = env[String(r.child.node)] } })
  .use(Directive, { name: 'upper', open: '^', action: (r) => { r.node = String(r.child.node).toUpperCase() } })

tn.parse('a: ^$HOME')
// => { a: '/HOME/DEV' }
```

A directive can also be **bracketed**, with a `close` token, which is what lets
it take a list of arguments:

```ts
const tn = new Tabnas().use(jsonic).use(Directive, {
  name: 'sum',
  open: 'sum<',
  close: '>',
  action: (rule) => { rule.node = rule.child.node.reduce((a, b) => a + b, 0) },
})

tn.parse('a: sum<1,2,3>, b: 9')
// => { a: 6, b: 9 }
```

By default a directive is accepted wherever a value is accepted. The `rules`
option narrows or widens that — `MultiSource` uses it to also allow the mark in
key position, which is how the merge-into-the-enclosing-map form works.

An include of your own is the `env` example with a file read and a recursive
`parse` in place of the object lookup, plus an error when the path is unknown:

```ts
const FILES = { 'base.jsonic': 'port: 8080, host: localhost' }

const tn = new Tabnas().use(jsonic).use(Directive, {
  name: 'include',
  open: '@',
  action: (rule, ctx) => {
    const path = String(rule.child.node)
    const src = FILES[path]
    if (null == src) return rule.parent.o0.bad('include_not_found', { path })
    rule.node = ctx.inst().parse(src)
  },
})

tn.options({
  error: { include_not_found: 'no such include: {path}' },
  hint: { include_not_found: 'Known includes: base.jsonic' },
})

tn.parse('cfg: @"base.jsonic"')
// => { cfg: { port: 8080, host: 'localhost' } }
```

Returning a token from `bad()` is how an action reports a parse error rather
than throwing — see [giving good parse errors](/how-to/parse-errors/).

Having written that, use `MultiSource` instead. Resolution order, base paths,
implicit extensions, key-position merging and dependency tracking are the parts
that take the time, and they are already done.

## See also

- [Write a parameterised parser](/how-to/parameterised-parsers/) — how
  `Directive` takes its options, and how to do the same.
- [Extending a grammar](/docs/extending/) — the general form of adding to a
  grammar you didn't write.
- [@tabnas/multisource](https://github.com/tabnas/multisource) — resolvers,
  processors, preloading.
