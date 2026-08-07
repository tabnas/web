import { Tabnas } from '@tabnas/parser'

// A ref is a string starting with `@`; a trailing `$` marks an engine builtin.
const tn = new Tabnas()
tn.grammar({
  options: { rule: { start: 'val' } },
  rule: {
    val: {
      open: [{ s: '#NR', a: '@value$' }],
      close: [{}],
    },
  },
})
console.log('42 =>', tn.parse('42'))

// The `$` namespace is reserved, so a grammar cannot shadow a builtin with a
// ref of its own.
let refused = false
try {
  new Tabnas().grammar({
    ref: { '@my$thing': (r: any) => { r.node = 1 } },
    options: { rule: { start: 'val' } },
    rule: { val: { open: [{ s: '#NR', a: '@my$thing' }], close: [{}] } },
  } as any)
} catch {
  refused = true
}
console.log("user ref containing '$' refused:", refused)
