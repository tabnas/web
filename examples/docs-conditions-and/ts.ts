import { Tabnas } from '@tabnas/parser'

let mark = ''

// Several keys in one `c` are ANDed — every one must hold.
function check(depth: number, mode: string) {
  const tn = new Tabnas()
  tn.grammar({
    ref: {
      '@taken': () => { mark = 'taken' },
      '@skipped': () => { mark = 'skipped' },
    },
    options: { rule: { start: 'val' } },
    rule: {
      val: {
        open: [{ s: '#NR', n: { depth }, u: { mode } }],
        close: [
          { c: { 'n.depth': { $gte: 1 }, 'u.mode': 'strict' }, a: '@taken' },
          { a: '@skipped' },
        ],
      },
    },
  } as any)
  tn.parse('1')
  return mark
}

console.log('depth=1 mode=strict ', check(1, 'strict'))
console.log('depth=1 mode=loose  ', check(1, 'loose'))
console.log('depth=0 mode=strict ', check(0, 'strict'))
