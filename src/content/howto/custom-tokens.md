---
title: Lex a token the engine doesn't know
description: Fixed literals, regex tokens, value literals, and a hand-written matcher for the cases none of those reach.
group: Feeding the lexer
order: 1
---

You write the lexer. The engine ships a small set of built-in tokens — number,
string, text, the JSON punctuation, space, newline, comment, end-of-source —
and everything else in your language is a token you declare.

There are four ways to declare one, in increasing order of effort. Use the
first that works.

## 1 · A fixed literal

The common case: a symbol or keyword with exactly one spelling.

```ts
tn.options({ fixed: { token: { '#EQ': '=', '#AR': '->' } } })
```

The name is yours; the value is matched literally. Longer literals win over
shorter ones, so `->` and `-` can coexist.

**Pick a name that isn't taken.** `#CM` is *comment*, not comma — the comma is
`#CA` — and silently redefining a built-in token is an afternoon you won't get
back. `tn.fixed('=')` returns the tin for a literal, or `undefined` if nothing
claims it; `tn.token('#EQ')` does the same by name and creates the token if
needed.

Redefining one on purpose is a legitimate technique:
`fixed: { token: { '#CA': ';' } }` is how `@tabnas/csv` implements
`field.separation` without touching its grammar.

## 2 · A regex token

When the spelling is a pattern rather than a literal:

```ts
const tn = new Tabnas()
tn.options({
  match: { token: { '#DUR': /^\d+(ms|s|m|h)/ } },
  rule: { start: 'val' },
})

tn.rule('val', (rs) => rs.open([
  { s: '#DUR', a: (r) => { r.node = r.o[0].src } },
]))

tn.parse('250ms')   // => '250ms'
tn.parse('3h')      // => '3h'
```

**Anchor the pattern.** A regex without `^` will match further down the input
and the lexer will not have consumed the characters in between; the symptom is
"unexpected character" pointing at the start of a value that clearly matches.

A `match.token` entry gives you a *new* token, which means every rule that
should accept it needs an alternate for it. That is the right shape when the
token is syntax. When it is a **value**, the next option is much less work.

## 3 · A value literal

`match.value` produces a `#VL` token carrying a computed value — and `#VL` is
already in the `VAL` token set every grammar accepts, so it works everywhere a
value works without touching a single rule:

```ts
import { json } from '@tabnas/json'

const tn = new Tabnas({ plugins: [json] })
tn.options({
  match: {
    value: {
      hex: { match: /^0x[0-9a-f]+/, val: (res) => parseInt(res[0], 16) },
    },
  },
})

tn.parse('{"n": 0xff}')   // => { n: 255 }
```

`val` receives the regex match array, so captures are available. For a fixed
set of words rather than a pattern, `value.def` is simpler still:

```ts
tn.options({ value: { def: { yes: { val: true }, no: { val: false }, nil: { val: null } } } })

tn.parse('{"a":yes,"b":no,"c":nil}')   // => { a: true, b: false, c: null }
```

Setting an entry to `null` removes it, which is how a dialect drops `true` or
`null` from the language.

## 4 · A matcher function

Some tokens are not regular: a raw block that runs to a terminator, a
heredoc, an indentation counter. Write a matcher. It is handed the lexer, and
its job is to return a token and advance the point — or return `undefined` and
leave the point alone.

```ts
const tn = new Tabnas({ plugins: [json] })

tn.options({
  lex: {
    match: {
      raw: {
        order: 2e6,
        make: () => function rawMatcher(lex) {
          const pnt = lex.pnt
          const src = lex.src.substring(pnt.sI)
          if (!src.startsWith('<<')) return undefined
          const end = src.indexOf('>>', 2)
          if (-1 === end) return undefined

          const tkn = lex.token('#RAW', src.substring(2, end), src.substring(0, end + 2), pnt)
          pnt.sI += end + 2
          pnt.cI += end + 2
          return tkn
        },
      },
    },
  },
})

tn.token('#RAW')
tn.rule('val', (rs) => rs.open([{ s: '#RAW', a: (r) => { r.node = r.o[0].val } }]))

tn.parse('{"a": <<x: 1, y: 2>>}')   // => { a: 'x: 1, y: 2' }
tn.parse('[<<a>>, 1, "b"]')         // => [ 'a', 1, 'b' ]
```

`order` decides where the matcher sits in the chain — lower runs earlier. It
matters whenever your syntax shares a prefix with a built-in one: a matcher for
`//path` has to run before the comment matcher, not after.

Two responsibilities are yours and the engine will not check them. **Advance
`pnt` by exactly the characters you consumed**, including `rI`/`cI` if the
token can span a newline, or every error position after it is wrong. And
**return `undefined` rather than throwing** when the input isn't yours, so the
rest of the chain gets a turn.

## Seeing the token stream

Before debugging a rule, check that the lexer produced what you think it did.
`sub` gets a callback on every token:

```ts
tn.sub({ lex: (tkn) => console.log(tkn.name, JSON.stringify(tkn.src), tkn.val) })

tn.parse('{"n": 0xff}')
// #OB "{"      undefined
// #ST "\"n\""  n
// #CL ":"      undefined
// #SP " "      undefined
// #VL "0xff"   255
// #CB "}"      undefined
// #ZZ ""       undefined
// #ZZ ""       undefined
```

Half of "my rule never fires" turns out to be "my token never lexed". (The end
token being reported twice is the parser peeking past the end, not a bug in
your grammar.)

## See also

- [The rule table](/docs/rule-table/) — the built-in tokens, and their names.
- [Handle strings, quotes and escapes](/how-to/strings-and-quoting/) — the
  string matcher's own options, which usually beat writing a matcher.
- [Write a parameterised parser](/how-to/parameterised-parsers/) — making the
  token set an option.
