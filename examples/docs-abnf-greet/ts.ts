import { Tabnas } from '@tabnas/parser'
import { abnf } from '@tabnas/abnf'

const tn = new Tabnas({ plugins: [abnf] })
tn.abnf(`greet = "hi" / "hello"`)

// One line of ABNF is a working parser. Every parse is the same
// { rule, src, kids } node — and anything else is rejected.
for (const src of ['hi', 'hello', 'howdy']) {
  try {
    const n = tn.parse(src) as any
    console.log(`${src.padEnd(6)} ${n.rule} ${JSON.stringify(n.src)} kids=${n.kids.length}`)
  } catch {
    console.log(`${src.padEnd(6)} rejected`)
  }
}
