import { Jsonic } from '@tabnas/jsonic'
import { Expr } from '@tabnas/expr'

// Cast: jsonic and expr publish separate copies of the Plugin type.
const cfg = Jsonic.make().use(Expr as any)

// `expr` did the parsing, so evaluation is a short recursive walk.
const OPS: Record<string, (a: number, b: number) => number> = {
  '+': (a, b) => a + b,
  '-': (a, b) => a - b,
  '*': (a, b) => a * b,
  '/': (a, b) => a / b,
}

function evaluate(n: any): number {
  if (!Array.isArray(n)) return n           // a plain value
  const [op, ...terms] = n
  if (op.paren) return evaluate(terms[0])   // ( … ) — a single term
  return OPS[op.src](...(terms.map(evaluate) as [number, number]))
}

for (const src of ['v: 1+2*3', 'v: (1+2)*3', 'v: 10/4', 'v: 7-1-2']) {
  console.log(src.padEnd(12), '=>', evaluate((cfg(src) as any).v))
}
