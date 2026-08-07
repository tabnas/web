import { Jsonic } from '@tabnas/jsonic'
import { Expr } from '@tabnas/expr'

// A plugin is a function that modifies a grammar — adding rules, adding
// alternates to existing rules, registering tokens.
// Cast: jsonic and expr publish separate copies of the Plugin type.
const cfg = Jsonic.make().use(Expr as any)

// The op node's readable part is its `src`; abbreviate the tree to that.
function simplify(n: any): any {
  if (Array.isArray(n)) return [n[0].src, ...n.slice(1).map(simplify)]
  if (n && 'object' === typeof n) {
    return Object.fromEntries(Object.entries(n).map(([k, v]) => [k, simplify(v)]))
  }
  return n
}

console.log('base  ', JSON.stringify(Jsonic('x: 1+2*3')))
console.log('+Expr ', JSON.stringify(simplify(cfg('x: 1+2*3'))))
