---
title: Handle strings, quotes and escapes
description: Change what quotes a string, which escapes exist, and what happens to the ones that don't.
group: Feeding the lexer
order: 3
packages: ["csv"]
---

The string matcher is configuration, not code. Which characters open a string,
which of them may span lines, what the escape character is, which escapes are
defined, and what an undefined escape means — all of it is `options.string`,
and the difference between a strict format and a relaxed one is a handful of
those fields.

## Start from what you have

The two published grammars sit at opposite ends, which makes them a useful
reference:

| | `@tabnas/json` | `@tabnas/jsonic` |
|---|---|---|
| Quote characters | `"` | `'` and `"` and backtick |
| Multi-line | none | backtick |
| Escapes | `b f n r t " \ /` | those, plus `v`, `'` and backtick |
| Unknown escape | error | passed through |

```ts
new Tabnas({ plugins: [json] }).parse(String.raw`"a\nb"`)   // => 'a\nb'
new Tabnas({ plugins: [json] }).parse(String.raw`"a\qb"`)   // throws — \q is undefined

new Tabnas().use(jsonic).parse("'x'")       // => 'x'
new Tabnas().use(jsonic).parse('`a b`')     // => 'a b'
```

Extending whichever is closer is nearly always less work than configuring the
matcher from scratch.

## More quote characters

`string.chars` is the complete set — set it, don't add to it:

```ts
const tn = new Tabnas({ plugins: [json] })
tn.options({ string: { chars: `"'` } })

tn.parse("'x'")   // => 'x'
```

## Strings that span lines

A raw newline inside an ordinary string is an error, in both grammars:

```ts
new Tabnas().use(jsonic).parse('a: "line1\nline2"')
// throws [jsonic/unprintable]: unprintable character
```

`string.multiChars` lists the quote characters that are allowed to. It must
also be in `chars`:

```ts
const tn = new Tabnas({ plugins: [json] })
tn.options({ string: { chars: '"`', multiChars: '`' } })

tn.parse('`line1\nline2`')   // => 'line1\nline2'
```

jsonic already does this for the backtick:

```ts
new Tabnas().use(jsonic).parse('a: `line1\nline2`')
// => { a: 'line1\nline2' }
```

For block-delimited strings with markers rather than quotes — triple quotes,
heredocs — see
[@tabnas/hoover](https://github.com/tabnas/hoover), which adds a configurable
"hoovering" matcher, or write
[a matcher of your own](/how-to/custom-tokens/#4--a-matcher-function).

## Escapes

`string.escape` maps the character *after* the escape character to what it
produces. Adding an entry defines an escape; setting it to `null` removes one:

```ts
const tn = new Tabnas({ plugins: [json] })
tn.options({ string: { escape: { z: ' ZZ' } } })
tn.parse(String.raw`"a\zb"`)   // => 'a ZZb'

const strict = new Tabnas({ plugins: [json] })
strict.options({ string: { escape: { n: null } } })
strict.parse(String.raw`"a\nb"`)   // throws — \n is no longer defined
```

The escape character itself is `string.escapeChar`:

```ts
const tn = new Tabnas({ plugins: [json] })
tn.options({ string: { escapeChar: '~' } })
tn.parse('"a~nb"')   // => 'a\nb'
```

`allowUnknown` decides what an undefined escape does. `false` — the JSON
setting — is an error; `true` — the jsonic setting — drops the escape character
and keeps the character after it:

```ts
const tn = new Tabnas({ plugins: [json] })
tn.options({ string: { allowUnknown: true } })
tn.parse(String.raw`"a\qb"`)   // => 'aqb'
```

Prefer `false` for a format you control. An unknown escape is almost always a
typo, and silently eating the backslash turns it into a data bug much later.

## Doubling instead of escaping

CSV does not use a backslash: a quote inside a quoted field is written twice,
and a quoted field may contain the separator and even a newline.
`@tabnas/csv` installs its own string matcher for this, which is the
general answer when quoting is not backslash-shaped:

```ts
const tn = new Tabnas().use(jsonic).use(Csv)

tn.parse('name,note\n"Smith, J","said ""hi"""')
// => [ { name: 'Smith, J', note: 'said "hi"' } ]

tn.parse('a,b\n"x\ny",2')
// => [ { a: 'x\ny', b: '2' } ]
```

The `string.csv` option turns that matcher on and off independently of strict
mode, which is the hook to copy if your format has the same convention.

## Unterminated strings

The engine reports these as their own error code, which means you can give them
your own message:

```ts
new Tabnas({ plugins: [json] }).parse('"abc')
// throws [tabnas/unterminated_string]: unterminated string: "abc
```

```ts
tn.options({
  error: { unterminated_string: 'string is missing its closing quote' },
})
```

See [giving good parse errors](/how-to/parse-errors/).

## See also

- [Lex a token the engine doesn't know](/how-to/custom-tokens/) — when the
  string matcher's options run out.
- [Handle comments and whitespace](/how-to/comments-and-whitespace/) — the other
  half of the lexer's configuration.
- [Extending a grammar](/docs/extending/) — deriving a stricter or looser
  dialect without touching the original.
