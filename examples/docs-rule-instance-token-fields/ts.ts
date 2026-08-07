import { Tabnas } from '@tabnas/parser'
import { json } from '@tabnas/json'

const tn = new Tabnas({ plugins: [json] })

// A token carries its source text, its resolved value, and where it was found.
// `src` and `val` are not the same thing: for #NR, `src` is the string '42'
// and `val` is the number 42.
tn.sub({
  lex: (t: any) => {
    if ('#ST' !== t.name && '#NR' !== t.name) return
    console.log(t.name, String(t.src).padEnd(4), String(t.val).padEnd(3), t.rI, t.cI)
  },
})

tn.parse('{"a": 42}')
