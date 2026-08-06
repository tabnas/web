---
title: Parse a line-oriented format
description: Make newlines significant — records, sections and one-statement-per-line syntax.
group: Shaping the parse
order: 3
packages: ["csv"]
---

Most grammars want whitespace gone. INI files, CSV, log lines and
one-statement-per-line configuration all want the opposite: a newline is the
thing that ends a record, and throwing it away destroys the format.

The engine ignores space, newline and comment tokens by default because they
are in the `IGNORE` token set. Taking newline back out of that set is the whole
of the trick.

## Stop ignoring the newline

`IGNORE` is positional: `#SP`, `#LN`, `#CM`. Pass `null` to drop an entry and
`undefined` to leave it alone.

```ts
const tn = new Tabnas()
tn.options({
  //           #SP        #LN   #CM
  tokenSet: { IGNORE: [undefined, null, undefined] },
})
```

From that point `#LN` arrives as an ordinary token that your rules must handle
— including in places you did not think about, which is why line-oriented
grammars tend to have an explicit blank-line alternate.

## Know what a newline token is

**Runs of newlines lex as one token.** That is usually what you want, and
occasionally not:

```ts
'1\n\n2'   // => #NR"1"  #LN"\n\n"  #NR"2"
```

`line.single` makes each newline its own token; `line.chars` and
`line.rowChars` change which characters count as one:

```ts
tn.options({ line: { single: true } })
'1\n\n2'   // => #NR"1"  #LN"\n"  #LN"\n"  #NR"2"

tn.options({ line: { chars: ';', rowChars: ';' } })
'1;2'      // => #NR"1"  #LN";"  #NR"2"
```

The second is how a record separator that isn't a newline is handled: it is
still a *line* to the lexer.

## A worked example: INI

Sections, `key = value`, blank lines. About twenty lines of grammar:

```ts
import { Tabnas } from '@tabnas/parser'

const tn = new Tabnas()
tn.options({
  fixed: { token: { '#EQ': '=' } },
  tokenSet: { IGNORE: [undefined, null, undefined] },   // #LN is content
  rule: { start: 'doc' },
})

// The section a key belongs to. Parse-scoped, so instances stay reusable.
const store = (r, ctx) => { if (null != r.u.key) ctx.u.sect[r.u.key] = r.child.node }

tn.rule('doc', (rs) => rs
  .bo((r, ctx) => { r.node = {}; ctx.u.sect = r.node })
  .open([{ s: '#ZZ' }, { p: 'line' }])
  .close([{}]))

tn.rule('line', (rs) => rs
  .open([
    { s: '#ZZ' },                                        // end of input
    { s: '#LN', r: 'line' },                             // blank line
    { s: ['#OS', '#TX', '#CS'],                          // [section]
      a: (r, ctx) => { ctx.u.sect = r.parent.node[r.o[1].src] = {} } },
    { s: ['#TX', '#EQ'], p: 'val',                       // key = value
      a: (r) => { r.u.key = r.o[0].src } },
  ])
  .close([
    { s: '#LN', a: store, r: 'line' },                   // next line
    { a: store },                                        // last line
  ]))

tn.rule('val', (rs) => rs.open([
  { s: '#VAL', a: (r, ctx) => { r.node = r.o0.resolveVal(r, ctx) } },
]))

tn.parse('a = 1\nb = two\n\n[db]\nhost = localhost\nport = 5432\n')
// => { a: 1, b: 'two', db: { host: 'localhost', port: 5432 } }

tn.parse('a = 1')          // => { a: 1 }
tn.parse('\n\na = 1\n\n')  // => { a: 1 }
```

Four things in there are the general pattern, not INI trivia.

**The repeat lives in `line`, not `doc`.** `{ r: 'line' }` in `line`'s close
replaces `line` at its own depth, so every line's parent is still `doc`. Put
the same repeat in `doc`'s close and it replaces *`doc`*, `r.parent.node`
becomes `undefined` on the second line, and the failure looks like a data bug
rather than a grammar bug.

**`#ZZ` gets its own alternate.** A line-oriented grammar has to say what
end-of-input means, in both phases — otherwise a file with no trailing newline
parses differently from one with.

**Blank lines are an alternate, not an accident.** `{ s: '#LN', r: 'line' }`
consumes the run and goes round again.

**Current-section state lives on `ctx.u`, not on the instance.** `ctx` is
created per parse, so the instance stays reusable and concurrent parses cannot
collide. `r.u` is per-rule user data, which is why the key can sit there
between the open and close phases of the same line.

`#VAL` is the built-in token set covering number, string, text and value
literals, and `resolveVal` turns the matched token into a real value — so
`5432` is a number and `true` is a boolean without any work.

## The reference solution: CSV

`@tabnas/csv` is this idea taken all the way, and it is the thing to read (or
just use) before writing your own record parser. It removes `#LN` from `IGNORE`
always and `#SP` too in strict mode, because in CSV a leading space is part of
the field.

```ts
import { jsonic } from '@tabnas/jsonic'
import { Csv } from '@tabnas/csv'

const tn = new Tabnas().use(jsonic).use(Csv)

tn.parse('name,age\nAlice,30\nBob,25')
// => [ { name: 'Alice', age: '30' }, { name: 'Bob', age: '25' } ]
```

Blank lines are skipped by default and preserved on request, and the record
separator does not have to be a newline:

```ts
new Tabnas().use(jsonic).use(Csv).parse('a,b\n1,2\n\n3,4')
// => [ { a: '1', b: '2' }, { a: '3', b: '4' } ]

new Tabnas().use(jsonic).use(Csv, { record: { empty: true } }).parse('a,b\n1,2\n\n3,4')
// => [ { a: '1', b: '2' }, { a: '', b: '' }, { a: '3', b: '4' } ]

new Tabnas().use(jsonic).use(Csv, { record: { separators: ';' } }).parse('a,b;1,2;3,4')
// => [ { a: '1', b: '2' }, { a: '3', b: '4' } ]
```

For very large inputs, `stream` hands each record to a callback instead of
building an array — see
[writing a parameterised parser](/how-to/parameterised-parsers).

## What this costs

Once `#LN` is significant, *every* rule in the grammar has to have an opinion
about it. That is the real expense of a line-oriented format, and it is why
mixing one with a free-form nested syntax is harder than either alone. If only
part of your format is line-oriented, consider parsing the line structure first
and the contents second.

## See also

- [Handle comments and whitespace](/how-to/comments-and-whitespace) — the other
  two members of `IGNORE`.
- [Choose between alternates](/how-to/choose-between-alternates) — `r` versus
  `p`, and the empty alternate.
- [@tabnas/csv](https://github.com/tabnas/csv) — the grammar, and every option.
