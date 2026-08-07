import { Tabnas } from '@tabnas/parser'

// `c` also takes an OBJECT: a check against a dot-path on the rule instance.
// No closure, so the grammar is still data — this one has no functions at all.
const tn = new Tabnas()
tn.grammar({
  options: {
    fixed: { token: { '#OP': '(', '#CP': ')' } },
    rule: { start: 'val' },
  },
  rule: {
    val: {
      open: [
        { s: '#OP', p: 'val', n: { depth: 1 }, c: { 'n.depth': { $lt: 3 } } },
        { s: '#NR' },
      ],
      close: [{ s: '#CP' }, {}],
    },
  },
})

// Past three levels the push alternate no longer applies, and nothing else
// matches an opening bracket.
for (const src of ['1', '(1)', '((1))', '(((1)))', '((((1))))']) {
  let verdict = 'accepted'
  try { tn.parse(src) } catch { verdict = 'rejected' }
  console.log(src.padEnd(10), verdict)
}
