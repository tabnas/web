import { Tabnas } from '@tabnas/parser'

// Actions referenced by name, so the whole grammar is JSON with no functions.
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

for (const src of ['42', '-7', '3.5']) {
  console.log(src.padEnd(4), '=>', tn.parse(src))
}
