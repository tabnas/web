import { Tabnas } from '@tabnas/parser'

let mark = ''

// One alternate gated on the condition, one unconditional behind it. Nothing
// has set `u.flag`, `n.never` or `u.never`, so each row is the unset case.
function check(cond: any) {
  const tn = new Tabnas()
  tn.grammar({
    ref: {
      '@taken': () => { mark = 'taken' },
      '@skipped': () => { mark = 'skipped' },
    },
    options: { rule: { start: 'val' } },
    rule: {
      val: {
        open: [
          { s: '#NR', c: cond, a: '@taken' },
          { s: '#NR', a: '@skipped' },
        ],
        close: [{}],
      },
    },
  } as any)
  tn.parse('1')
  return mark
}

console.log("{ 'u.flag': 1 }              ", check({ 'u.flag': 1 }))
console.log("{ 'n.never': { $gte: 99 } }  ", check({ 'n.never': { $gte: 99 } }))
console.log("{ 'n.never': { $lt: 1 } }    ", check({ 'n.never': { $lt: 1 } }))
console.log("{ 'u.never': { $gte: 99 } }  ", check({ 'u.never': { $gte: 99 } }))
