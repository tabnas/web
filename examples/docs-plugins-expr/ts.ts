import { Jsonic } from '@tabnas/jsonic'
import { Expr } from '@tabnas/expr'

// `make()` derives a fresh instance so the base parser is left alone, and
// `use()` layers a plugin onto it.
// Cast: jsonic and expr publish separate copies of the Plugin type.
const cfg = Jsonic.make().use(Expr as any)

// The first element of an expression is an operator node; the readable part is
// its `src`. This abbreviates the tree to that.
function simplify(n: any): any {
  if (Array.isArray(n)) return [n[0].src, ...n.slice(1).map(simplify)]
  if (n && 'object' === typeof n) {
    return Object.fromEntries(Object.entries(n).map(([k, v]) => [k, simplify(v)]))
  }
  return n
}

// Precedence is already handled: 1+2*3 groups the multiplication first.
console.log(JSON.stringify(simplify(cfg('x: 1+2*3'))))
