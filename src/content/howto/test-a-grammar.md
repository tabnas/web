---
title: Test a grammar
description: Assert what parses, what doesn't, and that the grammar is still the shape you think it is.
group: Working on a grammar
order: 3
packages: ["abnf", "debug"]
---

A grammar is data, and it is mutable data — every `use()` changes the instance
it is called on. That makes two kinds of test worth writing: the obvious one
about inputs and outputs, and a less obvious one about the *grammar itself*,
which catches the class of bug where a plugin quietly stopped applying.

## A fresh instance per test

Start here, because it is the mistake that produces the most confusing
failures. If a test calls `use()`, `options()` or `rule()` on a shared
instance, it has changed the grammar for everything after it — and test order
is not something you want to depend on.

```ts
const make = () => {
  const tn = new Tabnas({ plugins: [abnf] })
  tn.abnf(GRAMMAR, { actions: { /* … */ } })
  return tn
}
```

Parsing is safe to share: state lives on the parse context, not the instance,
so one instance can serve many `parse()` calls. It is *modification* that has
to be per-test. `make()` is also available on an instance, and derives a copy
without touching the original — see
[extending a grammar](/docs/extending).

## Accept and reject

Table-driven, because a grammar is a lot of small cases and each one wants its
own name in the output:

```ts
import { test } from 'node:test'
import assert from 'node:assert'

test('accepts', () => {
  const tn = make()
  for (const [src, want] of [['1', 1], ['1+2', 3], ['12+3+45', 60]]) {
    assert.equal(tn.parse(src).value, want, src)
  }
})

test('rejects', () => {
  const tn = make()
  for (const src of ['1+', '+1', 'a']) {
    assert.throws(() => tn.parse(src), (e) => 'unexpected' === e.code, src)
  }
})
```

**Assert on `e.code`, not on `e.message`.** The rendered message includes the
source line, a caret and a hint, all of which are meant to change as you
improve them. The code is the contract. This matters most for
[errors you defined yourself](/how-to/parse-errors) — a test on the code is
what stops a message rewrite from being a breaking change.

The rejection cases are the ones people skip and shouldn't. A grammar that is
too permissive still passes every accept test.

## Test the grammar, not just the parse

`@tabnas/debug` gives you the installed grammar as data, so you can assert its
shape. This catches the failure that input-output tests miss: a plugin that
silently didn't apply, and a grammar that still parses your happy path for a
different reason.

```ts
import { Debug } from '@tabnas/debug'

test('grammar shape is what we think', () => {
  const tn = make()
  tn.use(Debug, { print: false })

  const model = tn.debug.model()
  assert.deepEqual(model.rules.map((r) => r.name).sort(), ['__start__', 'add', 'val'])
  assert.equal(model.abnf, GRAMMAR)
})
```

That last assertion is the strongest cheap test there is for an ABNF grammar:
the engine's rendering of what it actually installed, compared against the
source you wrote. If a compiler change or a plugin alters the rule table, it
fails.

`model()` is JSON-serialisable, so a snapshot works too — `tokens`,
`tokenSets`, `rules`, `graph`, `lexer`, `config` and `plugins` in one object.
So does `@tabnas/railroad`'s `toJson()`, which is a smaller and more readable
snapshot if structure is what you care about.

## Test the samples in your README

The `tabnas-abnf` CLI parses samples against a grammar file and exits non-zero
if any of them fail, which makes a grammar's examples testable from a
`Makefile` or a CI step with no test harness at all:

```bash
tabnas-abnf -f grammar.abnf --parse '1+2' --parse '12+3+45'
# ok: "1+2" -> { "rule": "val", … }
# ok: "12+3+45" -> { "rule": "val", … }

tabnas-abnf -f grammar.abnf --parse '1+'
# exits 1
```

`--parse-file` takes the sample from a file, so the fixtures on disk and the
ones in CI are the same bytes.

## Pin the mark names

If you attach actions by `@ref`, the mark names are assigned by the compiler
and are not yours. A test that asserts the listing turns a silent regression —
actions that stop firing because a mark was renamed — into a failure:

```bash
tabnas-abnf --marks -f grammar.abnf
```

```
val  o:add  p:add
val  c:_  (empty)
add  o:NR  s:#NR
add  c:PL  s:#PL
add  c:_  (empty)
```

`markListing(spec)` gives the same listing from code. Attaching an action to a
mark that doesn't exist is already an error rather than a silent no-op, so this
is belt and braces — but the listing also documents the compiled shape, which
is worth having in the repository.

## Pin the versions

Everything in the org is pre-1.0, where a caret range refuses the next minor
and a minor can change behaviour. Pin exact versions in `package.json`
(`"0.5.0"`, not `"^0.5.0"`) and upgrade deliberately, with these tests as the
thing that tells you what moved.

## See also

- [Debug a grammar](/how-to/debug-a-grammar) — what `model()` contains, and how
  to read a trace when a test goes red.
- [Give good parse errors](/how-to/parse-errors) — why `e.code` is the stable
  surface.
- [Attaching actions](/docs/actions) — `@ref` marks and where they come from.
