import { Jsonic } from '@tabnas/jsonic'
import { Expr } from '@tabnas/expr'

// Cast: jsonic and expr publish separate copies of the Plugin type.
const cfg = Jsonic.make().use(Expr as any)

function simplify(n: any): any {
  if (Array.isArray(n)) return [n[0].src, ...n.slice(1).map(simplify)]
  if (n && 'object' === typeof n) {
    return Object.fromEntries(Object.entries(n).map(([k, v]) => [k, simplify(v)]))
  }
  return n
}

// Parentheses work too, and are a node of their own with a single term — so an
// evaluator can recognise them and just descend.
console.log(JSON.stringify(simplify(cfg('y: (1+2)*3'))))
