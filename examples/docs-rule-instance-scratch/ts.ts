import { Tabnas } from '@tabnas/parser'

const tn = new Tabnas()
tn.options({ rule: { start: 'top' } })

// `u` is scoped to this rule instance; `k` propagates to every rule pushed or
// repeated below it.
tn.rule('top', (rs: any) => rs
  .open([{ p: 'item', u: { onlyHere: 1 }, k: { everywhere: 2 } }]))

tn.rule('item', (rs: any) => rs.open([{ s: '#NR', a: (r: any) => {
  console.log('item sees u.onlyHere:  ', 'onlyHere' in r.u)
  console.log('item sees k.everywhere:', r.k.everywhere)
} }]))

tn.parse('42')
