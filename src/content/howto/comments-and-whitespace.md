---
title: Handle comments and whitespace
description: Turn comment styles on, define your own, and decide what the parser is allowed to throw away.
group: Feeding the lexer
order: 2
---

Space, newline and comment are lexed as real tokens — `#SP`, `#LN`, `#CM` —
and then discarded, because all three are in the `IGNORE` token set. Nearly
everything you want here is a change to that set, or to what counts as a
comment.

## Turning comments on

Comment lexing is a switch, and a grammar can have it off: `@tabnas/json` does,
because JSON has no comments.

```ts
import { json } from '@tabnas/json'

const strict = new Tabnas({ plugins: [json] })
strict.parse('{"a":1} // hi')
// throws [tabnas/unexpected]: unexpected character(s): /
```

Flip it and the three built-in styles appear — `#`, `//` and `/* … */`. That
one line is the whole difference between JSON and JSONC:

```ts
const jsonc = new Tabnas({ plugins: [json] })
jsonc.options({ comment: { lex: true } })

jsonc.parse('{"a":1} // hi')      // => { a: 1 }
jsonc.parse('{"a":1 /* x */}')    // => { a: 1 }
jsonc.parse('{"a":1} # h')        // => { a: 1 }
```

## Choosing which styles

The definitions are a map keyed by name — `hash`, `slash`, `multi` — so
removing one is setting it to `null`:

```ts
const tn = new Tabnas({ plugins: [json] })
tn.options({ comment: { lex: true, def: { hash: null, multi: null } } })

tn.parse('{"a":1} // hi')   // => { a: 1 }
tn.parse('{"a":1} # hi')    // throws [tabnas/unexpected]
```

## Defining your own

A definition is a start marker, optionally an end marker, and a flag saying
whether it runs to end of line:

```ts
const tn = new Tabnas({ plugins: [json] })
tn.options({
  comment: {
    lex: true,
    def: {
      semi: { line: true,  start: ';',    lex: true, eatline: false },
      sql:  { line: true,  start: '--',   lex: true, eatline: false },
      xml:  { line: false, start: '<!--', end: '-->', lex: true, eatline: false },
    },
  },
})

tn.parse('{"a":1} ; note')          // => { a: 1 }
tn.parse('{"a":1} -- note')         // => { a: 1 }
tn.parse('{"a": <!-- x --> 1}')     // => { a: 1 }
```

**A new definition must set `lex: true` on itself.** The built-in definitions
carry it, and the outer `comment.lex` switch does not supply it for entries you
add — leave it out and the definition is registered, ignored, and your comment
marker comes back as "unexpected character". This is the single most common way
to get this wrong.

## `eatline`

A line comment normally stops *before* the newline, so a `#LN` token follows
it. With `eatline: true` the comment token swallows the newline as well:

```ts
// eatline: false
'1 // hi\n2'   // => #NR"1"  #SP" "  #CM"// hi"     #LN"\n"  #NR"2"

// eatline: true
'1 // hi\n2'   // => #NR"1"  #SP" "  #CM"// hi\n"   #NR"2"
```

Irrelevant while newlines are ignored, and decisive once they are not: in a
[line-oriented grammar](/how-to/line-oriented-formats/), a comment on its own
line otherwise emits a record separator that isn't there.

## Keeping what is normally thrown away

`IGNORE` is positional — `#SP`, `#LN`, `#CM` — and `null` drops an entry while
`undefined` leaves it:

```ts
// Newlines become significant; space and comments still ignored.
tn.options({ tokenSet: { IGNORE: [undefined, null, undefined] } })

// Comments become significant; a rule must now handle #CM.
tn.options({ tokenSet: { IGNORE: [undefined, undefined, null] } })
```

Keeping `#CM` is how a formatter or a doc-comment extractor gets at comment
text: the token is in the stream with its source, and a rule can attach it to
whatever it precedes. Be aware of the cost — *every* rule that a comment can
appear before now needs an alternate for it, which is most of them.

Making space significant is rarer, and drastic:

```ts
const tn = new Tabnas({ plugins: [json] })
tn.options({ tokenSet: { IGNORE: [null, undefined, undefined] } })

tn.parse('{"a":1}')    // => { a: 1 }
tn.parse('{"a": 1}')   // throws — the space is now a token nothing accepts
```

`@tabnas/csv` does exactly this in strict mode, because a leading space in a
CSV field is part of the value. It is the right call there and almost nowhere
else; `space.chars` (which characters count as space) is the gentler knob.

## Checking what the lexer did

When a comment marker "doesn't work", look at the tokens before looking at the
rules:

```ts
tn.sub({ lex: (tkn) => console.log(tkn.name, JSON.stringify(tkn.src)) })
```

A `#CM` token in the stream means the definition took and the problem is
elsewhere. No `#CM` means the definition never registered — check `lex: true`.

## See also

- [Parse a line-oriented format](/how-to/line-oriented-formats/) — the other
  reason to change `IGNORE`.
- [Lex a token the engine doesn't know](/how-to/custom-tokens/) — matcher order,
  and why a comment-like token has to run early.
- [The rule table](/docs/rule-table/) — the built-in token names.
