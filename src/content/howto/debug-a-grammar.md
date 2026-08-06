---
title: Debug a grammar
description: See the rules you actually have, watch a parse step by step, and draw the result.
group: Working on a grammar
order: 1
packages: ["debug", "railroad"]
---

A grammar that doesn't work is rarely a mystery for long, because a grammar is
data: you can print it. The order below is the order to try things in — each
step is cheaper than the one after it, and most bugs are caught in the first
two.

## 1 · Print the rules you have

`rule()` with no arguments returns the rule map. It is the fastest way to check
that a plugin did what you thought:

```ts
import { Tabnas } from '@tabnas/parser'
import { json } from '@tabnas/json'

Object.keys(new Tabnas({ plugins: [json] }).rule())
// => [ 'val', 'map', 'list', 'pair', 'elem' ]
```

One level down, `def.open` and `def.close` are the alternates in the order they
will be tried — which is the order that decides everything:

```ts
const tn = new Tabnas({ plugins: [json] })
tn.rule('val').def.open.map((a) => ({ s: a.s, p: a.p, b: a.b }))
// => [ { s: [ '#OB' ], p: 'map',  b: 1 },
//      { s: [ '#OS' ], p: 'list', b: 1 },
//      { s: [ '#VAL' ], p: null,  b: null } ]
```

Print this before and after your plugin runs. "My alternate never fires" is
usually "my alternate is third and the second one matches too".

## 2 · Print the tokens

Half of the remaining bugs are in the lexer, not the rules. `sub` gets a
callback per token:

```ts
tn.sub({ lex: (tkn) => console.log(tkn.name, JSON.stringify(tkn.src), tkn.val) })
```

and per rule step, which is a one-line parse trace when you don't want the
full one:

```ts
const steps = []
tn.sub({ rule: (r) => steps.push(`${r.name}~${r.state}@${r.d}`) })
tn.parse('1+2')

steps.join(' ')
// => '__start__~o@0 val~o@1 add~o@2 add~c@2 add~o@2 add~c@2 val~c@1 __start__~c@0'
```

`o`/`c` is the phase and `@n` the stack depth, so a rule that should be
repeating at one depth and is instead nesting shows up immediately.

## 3 · Describe the whole instance

`@tabnas/debug` adds a `debug` property with three views. It is a development
dependency — never ship it in a runtime path.

```ts
import { Debug } from '@tabnas/debug'

const tn = new Tabnas({ plugins: [json], tag: 'demo' })
tn.use(Debug, { print: false })

tn.debug.describe()   // printable text: tokens, token sets, rules, lexer, config
tn.debug.model()      // the same thing as a JSON-serialisable object
tn.debug.abnf()       // the live grammar rendered back as ABNF
```

`print: false` matters. The default is `true`, which prints a full description
every time `use()` is called afterwards — useful when you are bisecting which
plugin broke a grammar, and overwhelming otherwise.

`model()` is the one to reach for in a test. Its fields:

| Field | What it holds |
|---|---|
| `tag` | the instance tag |
| `tokens` | `{ tin, name, fixed? }[]` — the token table |
| `tokenSets` | named sets (`IGNORE`, `VAL`, `KEY`) → member tins |
| `rules` | each rule's open/close alternates, structurally |
| `graph` | per-rule push/replace edges |
| `lexer` | the matcher chain, in order |
| `config` | start rule, finish flag, per-lexer enable flags |
| `plugins` | what was applied, with the options it settled on |
| `abnf` | the live grammar as ABNF text |

```ts
const m = tn.debug.model()
m.config.start                 // => 'val'
m.plugins.map((p) => p.name)   // => [ 'json', 'Debug' ]
```

Worth knowing: with `@tabnas/abnf` installed, `m.config.start` is `__start__`,
not your first production. The compiler wraps the grammar in a start rule that
consumes `#ZZ`, which is what gives ABNF grammars an end-of-source check that
hand-written ones don't have.

`abnf()` is the useful trick for a grammar built by plugins: it renders whatever
is actually installed as ABNF, so you can read a composed grammar as one
document rather than as a stack of `use()` calls. It reads only the running
engine, and it is best-effort — a token-set alternate or an arbitrary match
regex has no ABNF spelling, and comes out as a comment or an empty alternative.
For a grammar that *came* from ABNF it round-trips exactly, which makes it a
good equality check in a test.

## 4 · Trace the parse

When the rules and tokens both look right, watch it run:

```ts
tn.use(Debug, { print: false, trace: true })
tn.parse('1+2')
```

The trace prints six kinds of line — `step`, `rule`, `lex`, `parse`, `node`,
`stack` — and you can switch off the ones you don't need. Note that the option
is *merged* over defaults where everything is on, so narrowing means setting
entries to `false`, not listing the ones you want:

```ts
tn.use(Debug, { print: false, trace: { lex: false, node: false, stack: false, step: false } })
```

```
rule   "1+2"   []~[]        0  __start__~1:OPEN  prev=0 parent=0 child=0
parse  "1+2"   []~[]        0  alt=0  []   g:abnf   p:val
rule   "1+2"   []~[]        1  . val~2:OPEN      prev=0 parent=1 child=0
parse  "1+2"   []~[]        1  . alt=0  []   g:abnf   p:add
rule   "1+2"   []~[]        2  . . add~3:OPEN    prev=0 parent=2 child=0
parse  "2"     ["1"]~[#NR]  2  . . alt=0  []   g:abnf
rule   "2"     []~[]        2  . . add~3:CLOSE   prev=0 parent=2 child=0
parse  "2"     ["+"]~[#PL]  2  . . alt=0  []   g:abnf   r:add
```

Read the `parse` lines. `alt=` is which alternate matched, `g:` its group tags,
and `p:`/`r:` whether it pushed or repeated. The dots are stack depth. The two
`add` rules at depth 2 with `r:add` between them are a repeat, not a nest —
exactly the distinction that is hard to see any other way.

To capture a trace instead of printing it — in a test, say — supply a console:

```ts
const lines = []
const tn = new Tabnas({
  plugins: [json],
  debug: { get_console: () => ({ log: (...a) => lines.push(a.join(' ')) }) },
})
```

## 5 · Draw it

`@tabnas/railroad` introspects a live instance and renders it. This is the view
that makes a *shape* problem obvious — an optional that should have been a
repetition, an alternative that can never be reached.

```ts
import { railroad } from '@tabnas/railroad'

const tn = new Tabnas({ plugins: [json, railroad] })

tn.railroad.toJson()    // declarative model: { start, rules, meta }
tn.railroad.toSvg()     // vertical-flow SVG
tn.railroad.toAscii()   // vertical ASCII, for a terminal or a diff
```

```
val:
              │
   ┌──────────┼──────────┐
┌──┴──┐   ┌───┴──┐   ╭───┴───╮
│ map │   │ list │   │ "VAL" │
└──┬──┘   └───┬──┘   ╰───┬───╯
   └──────────┼──────────┘
              │
```

`toAscii({ ascii: true })` uses plain `| - +` glyphs, which survives copy-paste
into an issue. There is also a CLI, so a diagram can be a build artifact:

```bash
tabnas-railroad --grammar @tabnas/json -o diagrams
# wrote grammar.railroad.json, grammar.svg, grammar.txt to diagrams/
```

The `--text` form is a compact per-rule EBNF, and is the quickest whole-grammar
overview there is:

```
val = (map | list | "VAL")
map = "{" [pair] "}"
list = "[" [elem] "]"
pair = "KEY" ":" val+ /* "," */
elem = val+ /* "," */
```

Railroad introspects `@tabnas/parser` instances. Grammars still targeting the
older `@tabnas/jsonic` engine — `ini` and `yaml` — are not yet supported.

## Reading the error you already have

Before any of the above: a parse error already tells you which rule and phase
gave up, and on which token. It is on the last line of the message.

```
[tabnas/unexpected]: unexpected character(s): }
  --> <no-file>:1:7
  1 | {"a": }
            ^ unexpected character(s): }

  --internal: tag=-; rule=val~o; token=#CB; plugins=json--
```

`rule=val~o` is the open phase of `val`; `token=#CB` is what it was offered.
That is two of the four things you were about to go and find out.

## See also

- [Give good parse errors](/how-to/parse-errors) — making that message useful
  to someone who isn't you.
- [Test a grammar](/how-to/test-a-grammar) — turning today's bug into a test.
- [Choose between alternates](/how-to/choose-between-alternates) — what `alt=`
  in the trace is indexing.
