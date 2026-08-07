import { Tabnas } from '@tabnas/parser'

// Not one function in it, so it survives a trip through JSON.
const SPEC = `{
  "options": { "rule": { "start": "val" } },
  "rule": {
    "val": {
      "open":  [ { "s": "#NR", "a": "@value$" } ],
      "close": [ {} ]
    }
  }
}`

const tn = new Tabnas()
tn.grammar(JSON.parse(SPEC))
console.log('original  42 =>', tn.parse('42'))

// Somewhere else entirely — a second process, a config store, a network hop.
const elsewhere = new Tabnas()
elsewhere.grammar(JSON.parse(SPEC))
console.log('via JSON  42 =>', elsewhere.parse('42'))
