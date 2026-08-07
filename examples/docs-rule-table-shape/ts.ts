import { Tabnas } from '@tabnas/parser'

const tn = new Tabnas()

// The rule table itself: options, then rules, each with an open and a close
// phase holding alternates tried in order.
tn.grammar({
  options: {
    fixed: { token: { '#PL': '+' } },   // custom fixed tokens
    rule: { start: 'val' },             // where parsing begins
  },
  rule: {
    val: {
      open: [{ p: 'add' }],
      close: [{}],
    },
    add: {
      open: [{ s: '#NR' }],
      close: [{ s: '#PL', r: 'add' }, {}],
    },
  },
})

// `p` pushes (depth grows), `r` repeats (depth stays). The trace shows it:
// `val` pushes `add` once, then every `+` repeats `add` at the same depth.
const trace: string[] = []
tn.sub({ rule: (r: any) => trace.push(`${r.name}~${r.state}@${r.d}`) })
tn.parse('1+2+3')
console.log(trace.join(' '))
