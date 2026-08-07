import { Tabnas } from '@tabnas/parser'

const tn = new Tabnas()

// The rule table, exactly as data — no code anywhere in it.
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

// A grammar is only known to work when the bad inputs fail too.
for (const src of ['1', '1+2', '1+2+3', '1+', '+1']) {
  let verdict = 'accept'
  try {
    tn.parse(src)
  } catch {
    verdict = 'reject'
  }
  console.log(src.padEnd(6), verdict)
}
