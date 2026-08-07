import { Jsonic } from '@tabnas/jsonic'
import { Expr } from '@tabnas/expr'

// Cast: jsonic and expr publish separate copies of the Plugin type.
const cfg = Jsonic.make().use(Expr as any)

const OPS: Record<string, (a: number, b: number) => number> = {
  '+': (a, b) => a + b,
  '-': (a, b) => a - b,
  '*': (a, b) => a * b,
  '/': (a, b) => a / b,
}

function evaluate(n: any): number {
  if (!Array.isArray(n)) return n
  const [op, ...terms] = n
  if (op.paren) return evaluate(terms[0])
  return OPS[op.src](...(terms.map(evaluate) as [number, number]))
}

// And that's the language: a config format that takes arithmetic in its values.
const conf: any = cfg('width: 2+3*4, height: (2+3)*4, ratio: 10/4')

for (const key of ['width', 'height', 'ratio']) {
  console.log(key.padEnd(7), evaluate(conf[key]))
}
