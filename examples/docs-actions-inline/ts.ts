import { Tabnas } from '@tabnas/parser'

const tn = new Tabnas()

tn.grammar({
  options: {
    fixed: { token: { '#PL': '+' } },
    rule: { start: 'val' },
  },
  rule: {
    val: {
      // Start the accumulator at zero.
      open: [{ p: 'add', a: (r: any) => { r.node = 0 } }],
      close: [{}],
    },
    add: {
      // Add each number to it.
      open: [{ s: '#NR', a: (r: any) => { r.parent.node += r.o[0].val } }],
      close: [{ s: '#PL', r: 'add' }, {}],
    },
  } as any,
})

// The total rides on the parse, so `parse()` returns it and two parses of
// different inputs cannot collide.
console.log(tn.parse('1+2+3'))
console.log(tn.parse('12+3+45'))
