---
title: Give good parse errors
description: Name the file, define your own error codes, and raise them from the alternate that knows what went wrong.
group: Working on a grammar
order: 2
---

A parser is a user interface. Most of the time it is being used by someone who
got the syntax slightly wrong, and the error message is the entire product.

The engine gives you a good default and four ways to improve on it.

## What you get for free

Every parse error is a `TabnasError` — a `SyntaxError` subclass — rendered with
the source, a caret, and an explanation:

```
[tabnas/unexpected]: unexpected character(s): }
  --> <no-file>:1:7
  1 | {"a": }
            ^ unexpected character(s): }

  The character(s) } do not match any rule alternative active at
  this position.

  --internal: tag=-; rule=val~o; token=#CB; plugins=json--
```

The last line is for you, not your users: the rule and phase that gave up, the
token it was offered, and the plugins in play.

## 1 · Tell it the file name

`<no-file>` is not helpful and it is one argument away. Anything in the parse
metadata is available to the error formatter, and `fileName` is used directly:

```ts
tn.parse(src, { fileName: 'settings.json' })
```

```
  --> settings.json:1:7
```

## 2 · Name your language

`errmsg.name` replaces the `tabnas/` prefix, so the error looks like it came
from your tool rather than from a dependency. `errmsg.link` adds a
documentation URL:

```ts
tn.options({ errmsg: { name: 'cfg', link: 'https://example.com/errors/' } })
```

```
[cfg/unexpected]: unexpected character(s): }
  …
  https://example.com/errors/
```

## 3 · Define your own errors

An error is a code with a short message and a longer hint. Both are templates,
and **placeholders are `{braces}`** — values come from the `details` object you
pass when raising it, and from the token, rule and context:

```ts
tn.options({
  error: { missing_equals: 'expected = after key "{key}"' },
  hint:  { missing_equals: 'Settings are written `name = value`.\nThe key {key} had no `=` after it.' },
})
```

Overriding a built-in code works the same way, and is the cheapest improvement
available on a format with unusual quoting:

```ts
tn.options({ error: { unterminated_string: 'string is missing its closing quote' } })

tn.parse('"abc')
// throws [tabnas/unterminated_string]: string is missing its closing quote
```

## 4 · Raise it from where you know

`e` is an alternate field: an alternate that exists in order to fail well.
It runs when that alternate is selected, and returns the token to blame —
`token.bad(code, details)` builds it.

The pattern is an alternate *after* the good one, matching the prefix they
share:

```ts
const tn = new Tabnas()
tn.options({
  fixed: { token: { '#EQ': '=' } },
  rule: { start: 'setting' },
  error: { missing_equals: 'expected = after key "{key}"' },
  hint:  { missing_equals: 'Settings are written `name = value`.\nThe key {key} had no `=` after it.' },
})

tn.rule('setting', (rs) => rs
  .open([
    { s: ['#TX', '#EQ'], p: 'val', a: (r) => { r.node = { key: r.o[0].src } } },
    { s: ['#TX'], e: (r) => r.o0.bad('missing_equals', { key: r.o0.src }) },
  ])
  .close([{ a: (r) => { r.node.value = r.child.node } }]))

tn.rule('val', (rs) => rs.open([{ s: '#NR', a: (r) => { r.node = r.o[0].val } }]))

tn.parse('port = 8080')   // => { key: 'port', value: 8080 }
tn.parse('port 8080')
```

```
[tabnas/missing_equals]: expected = after key "port"
  --> <no-file>:1:1
  1 | port 8080
      ^^^^ expected = after key "port"

  Settings are written `name = value`.
  The key port had no `=` after it.
```

Without that second alternate the message would have been "unexpected
character(s): 8080", pointing at the number rather than the missing `=`.

An action can raise one too, by *returning* the token rather than throwing —
which is how `@tabnas/multisource` reports a missing include:

```ts
action: (rule, ctx) => {
  const src = FILES[String(rule.child.node)]
  if (null == src) return rule.parent.o0.bad('include_not_found', { path })
  rule.node = ctx.inst().parse(src)
}
```

## Point at the right token

The token you call `bad()` on decides where the caret goes, and the obvious
choice is often wrong. For an unclosed bracket, the useful position is the
*opening* one — which is `r.o0`, the token the rule opened on, not the token
that surprised it:

```ts
const OP = tn.fixed('(')
const grouped = (r) => OP === r.o0?.tin

tn.rule('val', (rs) => rs
  .open([{ s: '#OP', p: 'val' }, { s: '#NR', a: (r) => { r.node = r.o[0].val } }])
  .close([
    { s: '#CP', c: grouped, a: (r) => { r.node = [r.child.node] } },
    { c: grouped, e: (r) => r.o0.bad('unclosed') },
    {},
  ]))

tn.parse('((1)')
```

```
[tabnas/unclosed]: unclosed group
  --> <no-file>:1:1
  1 | ((1)
      ^ unclosed group

  A ( opened here was never closed with a matching ).
```

Column 1 — the bracket that was never closed — rather than the end of input.

## Handling errors in code

```ts
try {
  tn.parse(src, { fileName: 'settings.cfg' })
} catch (e) {
  e instanceof SyntaxError   // => true
  e.code                     // => 'missing_equals'
  e.fileName                 // => 'settings.cfg'
  e.lineNumber               // => 1
  e.columnNumber             // => 1
  e.message                  // the rendered block above
}
```

`TabnasError` is exported if you want an exact `instanceof`, but the `code`
field is the thing to branch on — it is stable, and it is what your `error` and
`hint` tables are keyed by.

## What this can't do

**The parse stops at the first error.** There is no recovery pass and no way to
collect several errors from one input: the engine is deterministic and does not
backtrack, so once a token cannot be matched there is no defined state to
continue from. If you need a list of problems rather than the first one — an
editor integration, say — the shape that works is parsing smaller units
separately (a line, a record, a section) and collecting their failures.

That is a real limitation, and it is the price of the parse being linear and
having exactly one interpretation.

## See also

- [Debug a grammar](/how-to/debug-a-grammar) — reading the `--internal` line,
  and what to do next.
- [Choose between alternates](/how-to/choose-between-alternates) — where the
  failing alternate goes in the list.
- [The rule table](/docs/rule-table) — the `e` field, and the rest.
