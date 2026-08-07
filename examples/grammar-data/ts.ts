import { Tabnas } from '@tabnas/parser'

// The same grammar as step 1, but as data — the shape an agent emits.
const GRAMMAR = `{
  "options": {
    "fixed": { "token": { "#PL": "+" } },
    "rule":  { "start": "val" }
  },
  "rule": {
    "val": {
      "open":  [ { "p": "add" } ],
      "close": [ {} ]
    },
    "add": {
      "open":  [ { "s": "#NR" } ],
      "close": [ { "s": "#PL", "r": "add" }, {} ]
    }
  }
}`

const tn = new Tabnas()
tn.grammar(JSON.parse(GRAMMAR))

// It recognises an addition chain and refuses anything else — but, having no
// actions, it produces nothing.
for (const src of ['1+2+3', '12+3+45', '1+*']) {
  let ok = true
  try { tn.parse(src) } catch { ok = false }
  console.log(src.padEnd(8), ok ? 'accepted' : 'rejected')
}
