import { Tabnas } from '@tabnas/parser'

const tn = new Tabnas()
tn.options({ rule: { start: 'val' } })

// Nothing has ever incremented `depth`, so it has counted nothing.
tn.rule('val', (rs: any) => rs.open([{ s: '#NR', a: (r: any) => {
  console.log("lt('depth', 3)   ", r.lt('depth', 3))
  console.log("eq('depth', 0)   ", r.eq('depth', 0))
  console.log("gt('depth', 3)   ", r.gt('depth', 3))
  console.log("exist('depth')   ", r.exist('depth'))
} }]))

tn.parse('42')
